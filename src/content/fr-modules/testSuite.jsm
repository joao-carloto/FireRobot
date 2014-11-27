	var EXPORTED_SYMBOLS = [
		"runTest",
		"showReport",
		"openTest",
		"saveAs",
		"save",
		"getOSName"
	];

	Components.utils.import("resource://gre/modules/FileUtils.jsm");

	Components.utils.import("chrome://firerobot/content/fr-modules/variables.jsm");
	Components.utils.import("chrome://firerobot/content/fr-modules/utils.jsm");


	function runTest() {

		var testRunning = Application.storage.get("testRunning", undefined);
		if (testRunning) return;

		var frWindow = Application.storage.get("frWindow", undefined);
		if (!frWindow.navigator.javaEnabled()) {
			warning("firerobot.warn.no-java");
			return;
		}

		var appVersion = frWindow.navigator.appVersion;
		var testDir = FileUtils.getDir("ProfD", ["extensions",
				"{91d9d8dc-09f8-4890-b6d8-32cbbf0a2f0e}",
				"run"
			],
			true);

		//Remove old screen shots
		testDir.remove(true);
		//Create new test execution folder
		testDir = FileUtils.getDir("ProfD", ["extensions",
				"{91d9d8dc-09f8-4890-b6d8-32cbbf0a2f0e}",
				"run"
			],
			true);
		var testDirPath = testDir.path;

		var robotFramework = FileUtils.getFile("ProfD", ["extensions",
			"{91d9d8dc-09f8-4890-b6d8-32cbbf0a2f0e}",
			"content",
			"java",
			"robotframework-2.8.4.jar"
		]);
		var robotFrameworkPath = robotFramework.path;

		var selenium2Library = FileUtils.getFile("ProfD", ["extensions",
			"{91d9d8dc-09f8-4890-b6d8-32cbbf0a2f0e}",
			"content",
			"java",
			"robotframework-selenium2library-java-1.4.0.7-SNAPSHOT-jar-with-dependencies.jar"
		]);
		var selenium2LibraryPath = selenium2Library.path;

		var shell;
		var args;
		var testFile;

		var OSName = getOSName();
		if (OSName == "Windows") {
			testFile = new FileUtils.File(testDirPath + "\\FireRobot.txt");

			_saveTest(testFile);
			var env = Components.classes["@mozilla.org/process/environment;1"]
				.getService(Components.interfaces.nsIEnvironment);
			shell = new FileUtils.File(env.get("COMSPEC"));
			args = ["/C",
				"java",
				"-Xbootclasspath/a:" + selenium2LibraryPath,
				"-jar",
				robotFrameworkPath,
				"-d",
				testDirPath,
				testFile.path
			];
		} else if (OSName == "MacOS") {
			testFile = new FileUtils.File(testDirPath + "/FireRobot.txt");

			_saveTest(testFile);
			shell = new FileUtils.File("/bin/sh");
			var testScript = new FileUtils.File(testDirPath + "/osx-script.txt");
			var outStream = FileUtils.openFileOutputStream(testScript);
			var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].
			createInstance(Components.interfaces.nsIConverterOutputStream);
			converter.init(outStream, "UTF-8", 0, 0);

			var script = "osascript -e 'tell app \"Terminal\" to do script \"java -Xbootclasspath/a:" +
				selenium2LibraryPath.replace(/ /g, "\\\\ ") +
				" -jar " +
				robotFrameworkPath.replace(/ /g, "\\\\ ") +
				" -d " +
				testDirPath.replace(/ /g, "\\\\ ") +
				" " +
				testFile.path.replace(/ /g, "\\\\ ") +
				"\"'";

			converter.writeString(script);
			converter.close();
			args = [testScript.path];
		} else {
			testFile = new FileUtils.File(testDirPath + "/FireRobot.txt");

			_saveTest(testFile);
			shell = new FileUtils.File("/bin/sh");
			args = ["-c",
				"x-terminal-emulator -e java -Xbootclasspath/a:" +
				selenium2LibraryPath.replace(/ /g, "\\ ") +
				" -jar " +
				robotFrameworkPath.replace(/ /g, "\\ ") +
				" -d " +
				testDirPath.replace(/ /g, "\\ ") +
				" " +
				testFile.path.replace(/ /g, "\\ ")
			];
		}

		var playButton = frWindow.document.getElementById("playButton");

		var process = Components.classes["@mozilla.org/process/util;1"]
			.createInstance(Components.interfaces.nsIProcess);

		process.init(shell);

		Application.storage.set("testRunning", true);

		playButton.setAttribute("class", "playOn");

		process.runAsync(args, args.length, function(subject, topic, data) {
			Application.storage.set("testRunning", false);

			//The window might have been closed or switched mode.
			frWindow = Application.storage.get("frWindow", undefined);
			if (frWindow) {
				playButton = frWindow.document.getElementById("playButton");
				playButton.setAttribute("class", "btn");
			}
			showReport();
		});
	}

	function showReport() {
		Components.utils.import("resource://gre/modules/FileUtils.jsm");

		var reportFile = FileUtils.getFile("ProfD", ["extensions",
			"{91d9d8dc-09f8-4890-b6d8-32cbbf0a2f0e}",
			"run",
			"report.html"
		]);

		if (reportFile.exists()) {
			var OSName = getOSName();
			var reportFilePath = reportFile.path;
			var reportURL;

			if (OSName == "Windows") {
				reportURL = "file:\\\\\\" + reportFilePath;
			} else {
				reportURL = "file:///" + reportFilePath;
			}

			var url = Components.classes["@mozilla.org/supports-string;1"].
			createInstance(Components.interfaces.nsISupportsString);
			url.data = reportURL;

			windowWatcher.openWindow(null, "chrome://browser/content/browser.xul", "_blank",
				"chrome,centerscreen,location=yes,dialog=no,width=920,height=680,resizable=yes,scrollbars=yes", url);

		} else {
			warning("firerobot.warn.no-report");
		}
	}

	function save() {
		var testFile = Application.storage.get("testFile", undefined);
		if (testFile) {
			_saveTest(testFile);
		} else {
			saveAs();
		}
	}

	function saveAs() {
		var nsIFilePicker = Components.interfaces.nsIFilePicker;
		var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
		fp.defaultExtension = "txt";
		fp.init(windowWatcher.activeWindow, "Save your robot test suite", nsIFilePicker.modeSave);
		fp.appendFilter("RF Text Files (*.txt, *.robot)", "*.txt; *.robot");

		var res = fp.show();
		if (res != nsIFilePicker.returnCancel) {
			Application.storage.set("testFile", fp.file);
			_saveTest(fp.file);
		}
	}

	function openTest() {
		var nsIFilePicker = Components.interfaces.nsIFilePicker;
		var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
		fp.init(windowWatcher.activeWindow, "Load your robot test suite", nsIFilePicker.modOpen);
		fp.appendFilter("RF Text Files (*.txt, *.robot)", "*.txt; *.robot");

		var OSName = getOSName();

		var res = fp.show();
		if (res != nsIFilePicker.returnCancel) {
			var testFile = fp.file;
			Application.storage.set("testFile", testFile);
			Components.utils.import("resource://gre/modules/NetUtil.jsm");
			NetUtil.asyncFetch(testFile, function(inputStream, status) {
				if (!Components.isSuccessCode(status)) {
					return;
				}
				var data = NetUtil.readInputStreamToString(inputStream, inputStream.available());
				var utf8Converter = Components.classes["@mozilla.org/intl/utf8converterservice;1"].
				getService(Components.interfaces.nsIUTF8ConverterService);

				data = utf8Converter.convertURISpecToUTF8(data, "UTF-8");

				var headPattern = /^\s?\*+\s*.+/mi;
				var settPattern = /^\s?\*+\s*(?:settings?|metadata|setting table)(?:$|\s*\*+|\s{2,})/mi;
				var varPattern = /^\s?\*+\s*(?:variables?|variable table)(?:$|\s*\*+|\s{2,})/mi;
				var testPattern = /^\s?\*+\s*(?:test\scases?|test\scase table)(?:$|\s*\*+|\s{2,})/mi;
				var keyPattern = /^\s?\*+\s*(?:keywords?|user keywords?|keyword table)(?:$|\s*\*+|\s{2,})/mi;

				var frWindow = Application.storage.get("frWindow", undefined);

				if (data.match(settPattern)) {
					var settings = data.split(settPattern)[1].split(headPattern)[0].trim();
					frWindow.document.getElementById("settingsTextArea").value = settings;
				} else {
					warning("firerobot.warn.no-settings");
					frWindow.document.getElementById("settingsTextArea").value = "";
				}
				if (data.match(varPattern)) {
					var variables = data.split(varPattern)[1].split(headPattern)[0].trim();
					loadVariables(variables);
				} else {
					warning("firerobot.warn.no-variables");
					varListBox = frWindow.document.getElementById("varListBox");
					while (varListBox.firstChild) {
						varListBox.removeChild(varListBox.firstChild);
					}
				}
				if (data.match(testPattern)) {
					var tests = data.split(testPattern)[1].split(headPattern)[0].trim();
					frWindow.document.getElementById("testCaseTextArea").value = tests;
				} else {
					warning("firerobot.warn.no-tests");
					frWindow.document.getElementById("testCaseTextArea").value = "";
				}

				if (data.match(keyPattern)) {
					var keywords = data.split(keyPattern)[1].split(headPattern)[0].trim();
					frWindow.document.getElementById("keywordsTextArea").value = keywords;
				} else {
					frWindow.document.getElementById("keywordsTextArea").value = "";
				}
			});
		}
	}

	function _saveTest(file) {

		var frWindow = Application.storage.get("frWindow", undefined);
		var oldContent;
		var newContent;

		var headPattern = /^\s?\*+\s*.+/mi;
		var settPattern = /^\s?\*+\s*(?:settings?|metadata|setting table)(?:$|\s*\*+|\s{2,})/mi;
		var varPattern = /^\s?\*+\s*(?:variables?|variable table)(?:$|\s*\*+|\s{2,})/mi;
		var testPattern = /^\s?\*+\s*(?:test\scases?|test\scase table)(?:$|\s*\*+|\s{2,})/mi;
		var keyPattern = /^\s?\*+\s*(?:keywords?|user keywords?|keyword table)(?:$|\s*\*+|\s{2,})/mi;

		//Start by opening the file and reading current content
		Components.utils.import("resource://gre/modules/NetUtil.jsm");
		NetUtil.asyncFetch(file, function(inputStream, status) {
			if (!Components.isSuccessCode(status)) {
				oldContent = "";
			} else {
				try {
					oldContent = NetUtil.readInputStreamToString(inputStream, inputStream.available());
					var utf8Converter = Components.classes["@mozilla.org/intl/utf8converterservice;1"].
					getService(Components.interfaces.nsIUTF8ConverterService);
					oldContent = utf8Converter.convertURISpecToUTF8(oldContent, "UTF-8");
				}
				//Overwrite existing file
				//TODO this kinda works, but is it the correct way?
				catch (err) {
					oldContent = "";
				}
			}

			newContent = oldContent;

			//Add or replace settings table
			var newSettings = frWindow.document.getElementById("settingsTextArea").
			value.
			replace(/(\r\n|\n|\r)/gm, "\r\n");

			if (oldContent && oldContent.match(settPattern)) {
				var oldSettings = oldContent.split(settPattern)[1].split(headPattern)[0].trim();
				newContent = newContent.replace(oldSettings, newSettings);
			} else {
				newContent += "*** Settings ***\r\n\r\n" + newSettings;
			}

			//Add or replace variables table
			var rows = frWindow.document.getElementById("varListBox").childNodes;
			var newVariables = "";
			for (var i = 0; i < rows.length; i++) {
				newVariables += "${" + rows[i].childNodes[1].value + "}" +
					" \t" +
					rows[i].childNodes[3].value +
					"\r\n";
			}
			newVariables = newVariables.trim();

			if (oldContent && oldContent.match(varPattern)) {
				var oldVariables = oldContent.split(varPattern)[1].split(headPattern)[0].trim();
				newContent = newContent.replace(oldVariables, newVariables);
			} else {
				newContent += "\r\n\r\n\r\n*** Variables ***\r\n\r\n" + newVariables;
			}

			//Add or repalce test cases table
			var newTestCases = frWindow.document.getElementById("testCaseTextArea").
			value.
			replace(/(\r\n|\n|\r)/gm, "\r\n");

			if (oldContent && oldContent.match(testPattern)) {
				var oldTestCases = oldContent.split(testPattern)[1].split(headPattern)[0].trim();
				newContent = newContent.replace(oldTestCases, newTestCases);
			} else {
				newContent += "\r\n\r\n\r\n*** Test Cases ***\r\n\r\n" + newTestCases;
			}

			//Add or replace keywords table
			var newKeywords = frWindow.document.getElementById("keywordsTextArea").
			value.
			replace(/(\r\n|\n|\r)/gm, "\r\n");
			if (oldContent && oldContent.match(keyPattern)) {
				var oldKeywords = oldContent.split(keyPattern)[1].split(headPattern)[0].trim();
				newContent = newContent.replace(oldKeywords, newKeywords);
			} else {
				newContent += "\r\n\r\n\r\n*** Keywords ***\r\n\r\n" + newKeywords;
			}

			//Open the file for writting
			var outStream = FileUtils.openFileOutputStream(file);
			var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].
			createInstance(Components.interfaces.nsIConverterOutputStream);
			converter.init(outStream, "UTF-8", 0, 0);
			converter.writeString(newContent);
			converter.close();
		});
	}
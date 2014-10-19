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

	var _Application = Components.classes["@mozilla.org/fuel/application;1"]
		.getService(Components.interfaces.fuelIApplication);

	var _windowWatcher = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
		.getService(Components.interfaces.nsIWindowWatcher);
		

	function runTest() {

		var testRunning = _Application.storage.get("testRunning", undefined);
		if (testRunning) return;

		var frWindow = _Application.storage.get("frWindow", undefined);
		if (!frWindow.navigator.javaEnabled()) {
			warning("firerobot.warn.no-java");
			return;
		}

		var appVersion = frWindow.navigator.appVersion;
		var testDir = FileUtils.getDir("ProfD", ["extensions",
				"{91d9d8dc-09f8-4890-b6d8-32cbbf0a2f0e}",
				"Fire"
			],
			true);

		//Remove old screen shots
		testDir.remove(true);
		//Create new test execution folder
		testDir = FileUtils.getDir("ProfD", ["extensions",
				"{91d9d8dc-09f8-4890-b6d8-32cbbf0a2f0e}",
				"Fire"
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
			"robotframework-selenium2library-java-1.4.0.6-jar-with-dependencies.jar"
		]);
		var selenium2LibraryPath = selenium2Library.path;

		var shell;
		var args;
		var testFile;

		var OSName = getOSName();
		if (OSName == "Windows") {
			testFile = new FileUtils.File(testDirPath + "robot-test.txt");

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
			testFile = new FileUtils.File(testDirPath + "/robot-test.txt");

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
			testFile = new FileUtils.File(testDirPath + "robot-test.txt");

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

		_Application.storage.set("testRunning", true);

		playButton.setAttribute("class", "playOn");

		process.runAsync(args, args.length, function(subject, topic, data) {
			_Application.storage.set("testRunning", false);

			//The window might have been closed or switched mode.
			frWindow = _Application.storage.get("frWindow", undefined);
			if (frWindow) {
				playButton = frWindow.document.getElementById("playButton");
				playButton.setAttribute("class", "btn");
			}

			var reportFile = FileUtils.getFile("ProfD", ["extensions",
				"{91d9d8dc-09f8-4890-b6d8-32cbbf0a2f0e}",
				"Fire",
				"report.html"
			]);

			//You may stop the test by closing the CLI, before a test report is generated.
			if (reportFile.exists()) {
				var reportFilePath = reportFile.path;
				var OSName = getOSName();
				var reportURL;

				if (OSName == "Windows") {
					reportURL = "file:\\\\\\" + reportFilePath;
				} else {
					reportURL = "file:///" + reportFilePath;
				}
				_windowWatcher.openWindow(null,
					reportURL,
					"Fire Robot Report",
					"menubar,location,toolbar,resizable,scrollbars,status, centerscreen",
					null);
			}
		});
	}


	function showReport() {
		Components.utils.import("resource://gre/modules/FileUtils.jsm");

		var reportFile = FileUtils.getFile("ProfD", ["extensions",
			"{91d9d8dc-09f8-4890-b6d8-32cbbf0a2f0e}",
			"Fire",
			"report.html"
		]);

		if (reportFile.exists()) {
			var OSName = getOSName();
			var reportFilePath = reportFile.path;
			//.replace(/ /g, "\\ ");
			var reportURL;

			if (OSName == "Windows") {
				reportURL = "file:\\\\\\" + reportFilePath;
			} else {
				reportURL = "file:///" + reportFilePath;
			}
			_windowWatcher.openWindow(null,
				reportURL,
				"Fire Robot Report",
				"menubar,location,toolbar,resizable,scrollbars,status, centerscreen",
				null);
		} else {
			warning("firerobot.warn.no-report");
		}
	}

	function save() {
		var testFile = _Application.storage.get("testFile", undefined);
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
		fp.init(_windowWatcher.activeWindow, "Save your robot test suite", nsIFilePicker.modeSave);
		fp.appendFilter("RF Text Files (*.txt, *.robot)", "*.txt; *.robot");

		var res = fp.show();
		if (res != nsIFilePicker.returnCancel) {
			_Application.storage.set("testFile", fp.file);
			_saveTest(fp.file);
		}
	}

	function openTest() {
		var nsIFilePicker = Components.interfaces.nsIFilePicker;
		var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
		fp.init(_windowWatcher.activeWindow, "Load your robot test suite", nsIFilePicker.modOpen);
		fp.appendFilter("RF Text Files (*.txt, *.robot)", "*.txt; *.robot");

		var OSName = getOSName();

		var res = fp.show();
		if (res != nsIFilePicker.returnCancel) {
			testFile = fp.file;
			_Application.storage.set("testFile", fp.file);
			Components.utils.import("resource://gre/modules/NetUtil.jsm");
			NetUtil.asyncFetch(testFile, function(inputStream, status) {
				if (!Components.isSuccessCode(status)) {
					return;
				}
				var data = NetUtil.readInputStreamToString(inputStream, inputStream.available());
				var utf8Converter = Components.classes["@mozilla.org/intl/utf8converterservice;1"].
				getService(Components.interfaces.nsIUTF8ConverterService);

				data = utf8Converter.convertURISpecToUTF8(data, "UTF-8");

				var settPattern = /\*+\s*settings.*[\n|\r]/mi;
				var varPattern = /\*+\s*variables.*[\n|\r]/mi;
				var testPattern = /\*+\s*test\scases.*[\n|\r]/mi;

				var frWindow = _Application.storage.get("frWindow", undefined);

				if (data.match(settPattern)) {
					var settings = data.split(settPattern)[1].split(varPattern)[0].trim();
					frWindow.document.getElementById("settingsTextArea").value = settings;
				} else {
					warning("firerobot.warn.no-settings");
					frWindow.document.getElementById("settingsTextArea").value = "";
				}
				if (data.match(varPattern)) {
					var variables = data.split(varPattern)[1].split(testPattern)[0].trim();
					loadVariables(variables);
				} else {
					warning("firerobot.warn.no-variables");
					varListBox = frWindow.document.getElementById("varListBox");
					while (varListBox.firstChild) {
						varListBox.removeChild(varListBox.firstChild);
					}
				}
				if (data.match(testPattern)) {
					var tests = data.split(testPattern)[1].trim();
					frWindow.document.getElementById("testCaseTextArea").value = tests;
				} else {
					warning("firerobot.warn.no-tests");
					frWindow.document.getElementById("testCaseTextArea").value = "";
				}
			});
		}
	}


	function _saveTest(file) {
		var outStream = FileUtils.openFileOutputStream(file);

		var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].
		createInstance(Components.interfaces.nsIConverterOutputStream);
		converter.init(outStream, "UTF-8", 0, 0);

		var str = "***Settings***\r\n\r\n";

		var frWindow = _Application.storage.get("frWindow", undefined);

		str += frWindow.document.getElementById("settingsTextArea").
		value.
		replace(/(\r\n|\n|\r)/gm, "\r\n");

		str += "\r\n\r\n\r\n***Variables***\r\n\r\n";

		var variables = "";

		var rows = frWindow.document.getElementById("varListBox").childNodes;

		for (var i = 0; i < rows.length; i++) {
			variables += "${" + rows[i].childNodes[1].value + "}" +
				" \t" +
				rows[i].childNodes[3].value +
				"\r\n";
		}
		str += variables;
		str += "\r\n\r\n***Test Cases***\r\n\r\n";
		str += frWindow.document.getElementById("testCaseTextArea").
		value.
		replace(/(\r\n|\n|\r)/gm, "\r\n");

		converter.writeString(str);
		converter.close();
	}
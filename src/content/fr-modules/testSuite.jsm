	var EXPORTED_SYMBOLS = [
		"runTest",
		"showReport",
		"openTest",
		"saveAs",
		"save"
	];

	Components.utils.import("resource://gre/modules/FileUtils.jsm");

	Components.utils.import("chrome://firerobot/content/fr-modules/variables.jsm");
	Components.utils.import("chrome://firerobot/content/fr-modules/utils.jsm");


	var _Application = Components.classes["@mozilla.org/fuel/application;1"]
		.getService(Components.interfaces.fuelIApplication);

	var _windowWatcher = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
		.getService(Components.interfaces.nsIWindowWatcher);

	//TODO remove this
	var _promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
		.getService(Components.interfaces.nsIPromptService);


	function runTest() {

		var testRunning = _Application.storage.get("testRunning", undefined);
		if (testRunning) return;

		var env = Components.classes["@mozilla.org/process/environment;1"]
			.getService(Components.interfaces.nsIEnvironment);

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

		var testFile = new FileUtils.File(testDir.path + "Robot.txt");

		_saveTest(testFile);

		var robotFramework = FileUtils.getFile("ProfD", ["extensions",
			"{91d9d8dc-09f8-4890-b6d8-32cbbf0a2f0e}",
			"content",
			"java",
			"robotframework-2.8.4.jar"
		]);

		var selenium2Library = FileUtils.getFile("ProfD", ["extensions",
			"{91d9d8dc-09f8-4890-b6d8-32cbbf0a2f0e}",
			"content",
			"java",
			"robotframework-selenium2library-java-1.4.0.6-jar-with-dependencies.jar"
		]);

		var OSName = _getOSName();
		var shell;
		var args;

		if (OSName == "Windows") {
			shell = new FileUtils.File(env.get("COMSPEC"));
			args = ["/C",
				"java",
				"-Xbootclasspath/a:" + selenium2Library.path,
				"-jar",
				robotFramework.path,
				"-d",
				testDir.path,
				testFile.path
			];
		} else {
			shell = new FileUtils.File("/bin/sh");
			args = ["-c",
				"x-terminal-emulator -e java -Xbootclasspath/a:" +
				selenium2Library.path +
				" -jar " +
				robotFramework.path +
				" -d " +
				testDir.path +
				" " +
				testFile.path +
				" > " +
				"/home/ubuntu/Desktop/frlog.txt"
			];
		}

		var playButton = frWindow.document.getElementById("playButton");

		var process = Components.classes["@mozilla.org/process/util;1"]
			.createInstance(Components.interfaces.nsIProcess);

		process.init(shell);

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
				var OSName = _getOSName();
				var reportPath;

				if (OSName == "Windows") {
					reportPath = "file:\\\\\\" + reportFile.path;

				} else {
					reportPath = "file:///" + reportFile.path
				}
				_windowWatcher.openWindow(null,
					reportPath,
					"Fire Robot Report",
					"menubar,location,toolbar,resizable,scrollbars,status, height=768, width =1024",
					null);
			}
		});
		_Application.storage.set("testRunning", true);
		playButton.setAttribute("class", "playOn");
	}


	function showReport() {
		Components.utils.import("resource://gre/modules/FileUtils.jsm");

		var reportFile = FileUtils.getFile("ProfD", ["extensions",
			"{91d9d8dc-09f8-4890-b6d8-32cbbf0a2f0e}",
			"Fire",
			"report.html"
		]);

		if (reportFile.exists()) {
			var OSName = _getOSName();
			var reportPath;

			if (OSName == "Windows") {
				reportPath = "file:\\\\\\" + reportFile.path;
			} else {
				reportPath = "file:///" + reportFile.path
			}
			_windowWatcher.openWindow(null,
				reportPath,
				"Fire Robot Report",
				"menubar,location,toolbar,resizable,scrollbars,status, height=768, width =1024",
				null);
		} else {
			warning("firerobot.warn.no-report");
		}
	}

	var testFile;

	function save() {
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
		fp.appendFilters(nsIFilePicker.filterText);

		var res = fp.show();
		if (res != nsIFilePicker.returnCancel) {
			testFile = fp.file;
			testFile.path = testFile.path + ".txt";
			_saveTest(testFile);
		}
	}

	function openTest() {
		var nsIFilePicker = Components.interfaces.nsIFilePicker;
		var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
		fp.init(_windowWatcher.activeWindow, "Load your robot test suite", nsIFilePicker.modOpen);
		fp.appendFilters(nsIFilePicker.filterText);

		var res = fp.show();
		if (res != nsIFilePicker.returnCancel) {
			testFile = fp.file;
			testFile.path = testFile.path + ".txt";
			Components.utils.import("resource://gre/modules/NetUtil.jsm");
			NetUtil.asyncFetch(testFile, function(inputStream, status) {
				if (!Components.isSuccessCode(status)) {
					// Handle error!
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
					//document.getElementById("variablesTextArea").value = variables;
					loadVariables(variables);
				} else {
					warning("firerobot.warn.no-variables");
					//document.getElementById("variablesTextArea").value = "";
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

	function _getOSName() {
		var frWindow = _Application.storage.get("frWindow", undefined);
		var appVersion = frWindow.navigator.appVersion;
		var OSName = "Unknown OS";

		if (appVersion.indexOf("Win") != -1) {
			OSName = "Windows";
		} else if (appVersion.indexOf("Mac") != -1) {
			OSName = "MacOS";
		} else if (appVersion.indexOf("X11") != -1) {
			OSName = "UNIX";
		} else if (appVersion.indexOf("Linux") != -1) {
			OSName = "Linux";
		}

		return OSName;
	}
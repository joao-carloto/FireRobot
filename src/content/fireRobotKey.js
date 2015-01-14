Components.utils.import("resource://gre/modules/FileUtils.jsm");

Components.utils.import("chrome://firerobot/content/fr-modules/utils.jsm");
Components.utils.import("chrome://firerobot/content/fr-modules/locators.jsm");


if (!FireRobot) var FireRobot = {};
if (!FireRobot.Key) FireRobot.Key = {};


FireRobot.Key = {


	//To force the OK button on Linux and OS X
	setButtons: function(e) {
		var buttonAccept = document.documentElement.getButton('accept');
		buttonAccept.hidden = false;
		buttonAccept.disabled = false;
	},

	loadSelSteps: function() {

		var keyWindow = Application.storage.get("keyWindow", undefined);

		resFilePath = prefService.getCharPref("extensions.firerobot.key.res_file");
		if (resFilePath !== "") {
			keyWindow.document.getElementById('resFileBox').value = resFilePath;
		}

		var frWindow = Application.storage.get("frWindow", undefined);
		var testArea = frWindow.document.getElementById("testCaseTextArea");

		var steps = testArea.value;

		var start = testArea.selectionStart;
		var end = testArea.selectionEnd;

		var selectedSteps = steps.substring(start, end).
		trim();
		//TODO test this in OS X

		selectedSteps = "    " + selectedSteps;
		var stepsArea = keyWindow.document.getElementById("keyStepsArea");
		stepsArea.value = selectedSteps;

		Application.storage.set("selectedSteps", selectedSteps);

		//Remove local variables
		//First, select  variables defined or redefined in the selected steps
		var matchLocalVar = selectedSteps.match(/(\r\n\s*|\n\s*|\r\s*|^[\s]*)\${[^${}]*}/g);
		if (matchLocalVar) {
			for (var i = 0; i < matchLocalVar.length; i++) {
				//Is this the first reference to the variable? Was this defined in the selected steps?
				sameVar = matchLocalVar[i].trim();
				var firstOcurrencePos = selectedSteps.indexOf(sameVar);
				var defPos = selectedSteps.indexOf(matchLocalVar[i]);
				if (defPos <= firstOcurrencePos) {
					//Yes this was defined inside the selected steps, so it will not be an argument of the new keyword
					//Let's remove the variable
					sameVar = sameVar.replace("$", "\\$");
					var regex = new RegExp(sameVar, "g");
					selectedSteps = selectedSteps.replace(regex, "");
				}
			}
		}

		var matchVar = selectedSteps.match(/\${[^${}]*}/g);
		if (matchVar) {
			//Remove duplicates
			matchVar = matchVar.filter(function(elem, pos) {
				return matchVar.indexOf(elem) == pos;
			});
			var varString = "";
			for (var i = 0; i < matchVar.length; i++) {
				varString += matchVar[i] + "    ";
			}
			var keyVarBox = keyWindow.document.getElementById("keyVarBox");
			keyVarBox.value = varString;
		}
	},

	selectResForKey: function() {

		var nsIFilePicker = Components.interfaces.nsIFilePicker;
		var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);

		fp.init(windowWatcher.activeWindow,
			"Add a resource file",
			nsIFilePicker.modOpen);

		fp.appendFilter("RF Text Files (*.txt, *.robot)", "*.txt; *.robot");

		var res = fp.show();
		if (res != nsIFilePicker.returnCancel) {

			var resFile = fp.file;

			var resFilePath = resFile.path;

			prefService.setCharPref("extensions.firerobot.key.res_file",
				resFilePath);

			keyWindow = Application.storage.get("keyWindow", undefined);
			if (keyWindow) {
				keyWindow.document.getElementById('resFileBox').value = resFilePath;
			}

			var OSName = getOSName();
			if (OSName == "Windows") {
				resFilePath = resFilePath.
				replace(/\\/g, "\\\\").
				replace(/ /g, "\\ ");
			} else {
				resFilePath = resFilePath.replace(/ /g, "\\ ");
			}
		}
	},

	addKey: function() {

		target = prefService.getCharPref("extensions.firerobot.key.target");
		if (target == "res_file") {
			return this.addKeyToFile();
		} else {
			return this.addKeyToSelf();
		}
	},


	addKeyToSelf: function() {

		var keyWindow = Application.storage.get("keyWindow", undefined);
		var keyNameBox = keyWindow.document.getElementById("keyNameBox");
		var name = keyNameBox.value;

		if (!name) {
			warning("firerobot.warn.no-key-name");
			return false;
		}
		var keyword = name;

		var keyVarBox = keyWindow.document.getElementById("keyVarBox");
		var vars = keyVarBox.value;

		if (vars) {
			keyword += "   \t[Arguments]   \t" + vars;
		}

		var keyStepsArea = keyWindow.document.getElementById("keyStepsArea");
		var steps = keyStepsArea.value;

		keyword += "\r\n" + steps;

		var frWindow = Application.storage.get("frWindow", undefined);
		var keywordsTextArea = frWindow.document.getElementById("keywordsTextArea");
		var oldKeywords = keywordsTextArea.value;

		if (oldKeywords !== "") {
			keyword = "\r\n\r\n" + keyword;
		}

		var newKeywords = oldKeywords + keyword;
		keywordsTextArea.value = newKeywords;

		//Replace steps for new keyword, if option is enabled.
		if (prefService.getBoolPref("extensions.firerobot.key.replace")) {
			var testArea = frWindow.document.getElementById("testCaseTextArea");
			var testCase = testArea.value;
			var keyStep = name;

			if (vars) {
				keyStep += "   \t" + vars;
			}
			var selectedSteps = Application.storage.get("selectedSteps", undefined);
			testCase = testCase.replace(selectedSteps.trim(), keyStep);
			testArea.value = testCase;
		}
		return true;
	},


	addKeyToFile: function() {

		var keyWindow = Application.storage.get("keyWindow", undefined);
		var resFileBox = keyWindow.document.getElementById("resFileBox");
		var filePath = resFileBox.value;

		if (!filePath) {
			warning("firerobot.warn.no-res-file");
			return false;
		}

		var file = new FileUtils.File(filePath);
		if (!file) {
			warning("firerobot.warn.no-open-res-file");
			return false;
		}

		var outStream = FileUtils.openFileOutputStream(file, 0x02 | 0x10);
		var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].
		createInstance(Components.interfaces.nsIConverterOutputStream);

		converter.init(outStream, "UTF-8", 0, 0);

		var keyNameBox = keyWindow.document.getElementById("keyNameBox");
		var name = keyNameBox.value;

		if (!name) {
			warning("firerobot.warn.no-key-name");
			return false;
		}
		var keyword = "\r\n\r\n" + name;

		var keyVarBox = keyWindow.document.getElementById("keyVarBox");
		var vars = keyVarBox.value;

		if (vars) {
			keyword += "   \t[Arguments]   \t" + vars;
		}

		var keyStepsArea = keyWindow.document.getElementById("keyStepsArea");
		var steps = keyStepsArea.value;

		keyword += "\r\n" + steps;
		try {
			converter.writeString(keyword);
		} catch (err) {
			warning("firerobot.warn.no-save-res-file");
			return false;
		}
		converter.close();

		//Add resource file to settings, if not yet included
		var frWindow = Application.storage.get("frWindow", undefined);
		var settingsTextArea = frWindow.document.getElementById("settingsTextArea");
		var settings = settingsTextArea.value;

		var OSName = getOSName();
		if (OSName == "Windows") {
			filePath = filePath.replace(/\\/g, "\\\\");
		}
		filePath = filePath.replace(/ /g, "\\ ");

		var resLine = "Resource   \t" + filePath;
		var patt = new RegExp(resLine.replace(/\\/g, "\\\\"));
		var resExists = patt.test(settings);

		if (!resExists) {
			settings += "\r\n" + resLine;
			settingsTextArea.value = settings;
			var ti = frWindow.document.getAnonymousNodes(settingsTextArea)[0].
			childNodes[0];
			ti.scrollTop = ti.scrollHeight;
		}

		//Replace steps for new keyword, if option is enabled.
		if (prefService.getBoolPref("extensions.firerobot.key.replace")) {
			var testArea = frWindow.document.getElementById("testCaseTextArea");
			var testCase = testArea.value;
			var keyStep = name;

			if (vars) {
				keyStep += "   \t" + vars;
			}
			var selectedSteps = Application.storage.get("selectedSteps", undefined);
			testCase = testCase.replace(selectedSteps.trim(), keyStep);
			testArea.value = testCase;
		}
		return true;
	}
};
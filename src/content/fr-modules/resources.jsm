	var EXPORTED_SYMBOLS = [
		"addResource"
	];


	//TODO remove not usefull
	Components.utils.import("resource://gre/modules/FileUtils.jsm");

	Components.utils.import("chrome://firerobot/content/fr-modules/variables.jsm");

	Components.utils.import("chrome://firerobot/content/fr-modules/utils.jsm");

	var _Application = Components.classes["@mozilla.org/fuel/application;1"]
		.getService(Components.interfaces.fuelIApplication);

	var _windowWatcher = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
		.getService(Components.interfaces.nsIWindowWatcher);

	var _promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
		.getService(Components.interfaces.nsIPromptService);


	//TODO check if is not allready present
	function addResource() {
		var nsIFilePicker = Components.interfaces.nsIFilePicker;
		var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
		fp.init(_windowWatcher.activeWindow, "Add a resource file", nsIFilePicker.modOpen);
		fp.appendFilter("RF Text Files (*.txt, *.robot)", "*.txt; *.robot");

		var res = fp.show();
		if (res != nsIFilePicker.returnCancel) {
			var resFile = fp.file;
			_Application.storage.set("resFile", resFile);
			var frWindow = _Application.storage.get("frWindow", undefined);
			var settingsTextArea = frWindow.document.getElementById("settingsTextArea");
			var settings = settingsTextArea.value;
			settings = settings + "\r\nResource  \t" + resFile.path.replace(/\\/g, "\\\\");
			settingsTextArea.value = settings;
			var ti = frWindow.document.getAnonymousNodes(settingsTextArea)[0].
			childNodes[0];
			ti.scrollTop = ti.scrollHeight;
		};
	}
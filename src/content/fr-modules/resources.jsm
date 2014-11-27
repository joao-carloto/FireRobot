	var EXPORTED_SYMBOLS = [
		"addResource"
	];

	Components.utils.import("resource://gre/modules/FileUtils.jsm");

	Components.utils.import("chrome://firerobot/content/fr-modules/utils.jsm");
	

	function addResource() {
		var nsIFilePicker = Components.interfaces.nsIFilePicker;
		var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
		fp.init(windowWatcher.activeWindow, "Add a resource file", nsIFilePicker.modOpen);
		fp.appendFilter("RF Text Files (*.txt, *.robot)", "*.txt; *.robot");

		var res = fp.show();

		if (res != nsIFilePicker.returnCancel) {
			var resFile = fp.file;

			prefService.setCharPref("extensions.firerobot.key.res_file", resFile.path);

			var frWindow = Application.storage.get("frWindow", undefined);
			var settingsTextArea = frWindow.document.getElementById("settingsTextArea");
			var settings = settingsTextArea.value;

			var resLine = resFile.path;
			var OSName = getOSName();
			if (OSName == "Windows") {
				resLine = resLine.replace(/\\/g, "\\\\");
			}
			resLine = resLine.replace(/ /g, "\\ ");
			resLine = "Resource  \t" + resLine;

			var patt = new RegExp(resLine.replace(/\\/g,"\\\\"));
			var resExists = patt.test(settings);

			if (!resExists) {
				settings += "\r\n" + resLine;
				settingsTextArea.value = settings;
				var ti = frWindow.document.getAnonymousNodes(settingsTextArea)[0].
				childNodes[0];
				ti.scrollTop = ti.scrollHeight;
			} else {
				warning("firerobot.warn.res-exists");
			}
		}
	}
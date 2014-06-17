Components.utils.import("chrome://firerobot/content/fr-modules/utils.jsm");
Components.utils.import("chrome://firerobot/content/fr-modules/frWindow.jsm");
Components.utils.import("chrome://firerobot/content/fr-modules/keywords.jsm");
Components.utils.import("chrome://firerobot/content/fr-modules/variables.jsm");
Components.utils.import("chrome://firerobot/content/fr-modules/select.jsm");
Components.utils.import("chrome://firerobot/content/fr-modules/testSuite.jsm");


if (!FireRobot) var FireRobot = {};
if (!FireRobot.BrowserOverlay) FireRobot.BrowserOverlay = {};

FireRobot.BrowserOverlay = {

	windowMediator: Components.classes["@mozilla.org/appshell/window-mediator;1"]
		.getService(Components.interfaces.nsIWindowMediator),

	prefService: Components.classes["@mozilla.org/preferences-service;1"]
		.getService(Components.interfaces.nsIPrefBranch),

	Application: Components.classes["@mozilla.org/fuel/application;1"]
		.getService(Components.interfaces.fuelIApplication),

	promptService: Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
	.getService(Components.interfaces.nsIPromptService),	


	openFRWindow: function() {
		var frWindow = Application.storage.get("frWindow", undefined);

		//Avoids opening several instances
		if (typeof(frWindow) != 'undefined' && !frWindow.closed) {
			return;
		}
		var windowModePreference = this.prefService.getCharPref(
			"extensions.firerobot.window-mode");

		if (windowModePreference == "float") {
			frWindow = createFloatWindow();
		} else {
			frWindow = createSideBar();
		}
		Application.storage.set("frWindow", frWindow);

		frWindow.addEventListener('load', function() {
			addVariable('BROWSER', 'FireFox');
		}, true);

		document.getElementById("fire-robot-toolbar-button").style
			.listStyleImage = "url('chrome://firerobot/skin/fire_robot_toolbar_on.png')";

		Application.storage.set("selectedElements", []);

		var browserWindow = this.windowMediator.getMostRecentWindow(
			"navigator:browser");

		Application.storage.set("browserWindow", browserWindow);
	},

	selectBtn: function() {
		toggleSelectMode();
	},

	selectButtonOver: function() {
		var selectModeOn = Application.storage.get("selectModeOn", false);

		if (!selectModeOn) {
			var frWindow = Application.storage.get("frWindow", undefined);
			var btn = frWindow.document.getElementById("selectButton");
			btn.setAttribute("class", "selectOn");
		}
	},

	selectButtonOut: function() {
		var selectModeOn = Application.storage.get("selectModeOn", false);

		if (!selectModeOn) {
			var frWindow = Application.storage.get("frWindow", undefined);
			var btn = frWindow.document.getElementById("selectButton");
			btn.setAttribute("class", "btn");
		}
	},

	escClearSelections: function() {
		clearSelections();
	},

	//TODO add more keywords, namely "Wait..."
	addKeyword: function(menu_item_id) {
		switch (menu_item_id) {
			case "fire-robot-page-should-contain":
				kwPageShouldContain();
				break;
			case "fire-robot-page-should-contain-smart":
				kwPageShouldContainSmart();
				break;
			case "fire-robot-click-smart":
				kwClickSmart();
				break;
			case "fire-robot-page-should-not-contain":
				kwPageShouldNotContain();
				break;
			case "fire-robot-page-should-not-contain-smart":
				kwPageShouldNotContainSmart();
				break;
			case "fire-robot-select-frame":
				kwSelectFrame();
				break;
			case "fire-robot-current-frame-contains":
				kwCurrentFrameContains();
				break;
			case "fire-robot-current-frame-should-not-contain":
				kwCurrentFrameShouldNotContain();
				break;
			case "fire-robot-frame-should-contain":
				kwFrameShouldContain();
				break;
			case "fire-robot-unselect-frame":
				kwUnselectFrame();
				break;
			case "fire-robot-open-browser":
				kwOpenBrowser();
				break;
			case "fire-robot-go-to":
				kwGoTo();
				break;
			case "fire-robot-go-back":
				kwGoBack();
				break;
			case "fire-robot-close-browser":
				kwCloseBrowser();
				break;
			case "fire-robot-close-all-browsers":
				kwCloseAllBrowsers();
				break;
			case "fire-robot-fill-form":
				kwFillForm();
				break;
			case "fire-robot-check-form":
				kwCheckForm();
				break;
			default:
      			warning("firerobot.warn.not-implemented");
		}
	},

	closeSideBar: function() {
		sideBar = Application.storage.get("sideBar", undefined);

		if (sideBar) {
			removeSideBar();
			resetSelectContext();

			var browserWindow = Application.storage.get("browserWindow", undefined);

			if (browserWindow && !browserWindow.closed) {
				browserWindow.document.getElementById("fire-robot-toolbar-button")
					.style.listStyleImage =
					"url('chrome://firerobot/skin/fire_robot_toolbar_off.png')";
			}
			Application.storage.set("frWindow", undefined);
		}
	},

	switchWindowMode: function() {
		var currentWindow = Application.storage.get("frWindow", undefined);
		var newWindow;

		if (currentWindow.frameElement) {

			this.prefService.setCharPref("extensions.firerobot.window-mode", "float");

			newWindow = createFloatWindow();
			newWindow.addEventListener('load', function() {
				copyWindowContent(currentWindow, newWindow);
				removeSideBar();
			}, true);
		} else {
			this.prefService.setCharPref("extensions.firerobot.window-mode",
				"sidebar");

			newWindow = createSideBar();

			newWindow.addEventListener('load', function() {
				copyWindowContent(currentWindow, newWindow);
				currentWindow.close();
			}, true);
		}
	},

	openPreferences: function() {
		var prefWindow = window.openDialog(
			"chrome://firerobot/content/fireRobotPreferences.xul",
			"fire-robot-preferences", "chrome, dialog");
		Application.storage.set("prefWindow", prefWindow);
	},

	openHelp: function() {
		var helpWindow = window.open(
			"chrome://firerobot/content/fireRobotHelp.xul",
			"FireRobot Help", "chrome, resizable");
		Application.storage.set("helpWindow", helpWindow);
	},

	addVariableBtn: function(name, value) {
		addVariable(name, value);
	},

	removeVariableBtn: function() {
		removeVariable();
	},

	increaseVarIndexBtn: function() {
		increaseVarIndex();
	},

	decreaseVarIndexBtn: function() {
		decreaseVarIndex();
	},

	saveBtn: function() {
		save();
	},

	saveAsBtn: function() {
		saveAs();
	},

	openTestBtn: function() {
		openTest();
	},

	runTestBtn: function() {
		runTest();
	},

	showReportBtn: function() {
		showReport();
	}
};
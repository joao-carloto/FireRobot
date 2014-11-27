Components.utils.import("chrome://firerobot/content/fr-modules/utils.jsm");
Components.utils.import("chrome://firerobot/content/fr-modules/frWindow.jsm");
Components.utils.import("chrome://firerobot/content/fr-modules/keywords.jsm");
Components.utils.import("chrome://firerobot/content/fr-modules/variables.jsm");
Components.utils.import("chrome://firerobot/content/fr-modules/select.jsm");
Components.utils.import("chrome://firerobot/content/fr-modules/testSuite.jsm");
Components.utils.import("chrome://firerobot/content/fr-modules/resources.jsm");


if (!FireRobot) var FireRobot = {};
if (!FireRobot.BrowserOverlay) FireRobot.BrowserOverlay = {};


FireRobot.BrowserOverlay = {

	openFRWindow: function() {
		var frWindow = Application.storage.get("frWindow", undefined);

		//Avoids opening several instances
		if (typeof(frWindow) != 'undefined' && !frWindow.closed) {
			return;
		}
		var windowModePreference = prefService.getCharPref(
			"extensions.firerobot.window-mode");

		if (windowModePreference == "float") {
			frWindow = createFloatWindow();
		} else {
			frWindow = createSideBar();
		}
		Application.storage.set("frWindow", frWindow);

		frWindow.addEventListener('load', function() {
			addVariable('BROWSER', 'Firefox');
		}, true);

		var browserWindow  = setBrowserWindow();
		setBrowserIconOn(browserWindow);

		Application.storage.set("selectedElements", []);
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
			case "fire-robot-wait-until-page-contains":
				kwWaitUntilPageContains();
				break;
			case "fire-robot-wait-until-page-contains-element":
				kwWaitUntilPageContainsElement();
				break;
			case "fire-robot-wait-until-element-is-visible":
				kwWaitUntilElementIsVisible();
				break;
			case "fire-robot-element-should-be-enabled":
				kwElementShouldBeEnabled();
				break;
			case "fire-robot-element-should-be-disabled":
				kwElementShouldBeDisabled();
				break;
			case "fire-robot-element-should-be-visible":
				kwElementShouldBeVisible();
				break;
			case "fire-robot-element-should-not-be-visible":
				kwElementShouldNotBeVisible();
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
			case "fire-robot-reload-page":
				kwReloadPage();
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
			setBrowserIconOff(browserWindow);

			Application.storage.set("frWindow", undefined);
			Application.storage.set("testFile", undefined);
		}
	},

	switchWindowMode: function() {
		var currentWindow = Application.storage.get("frWindow", undefined);
		var newWindow;

		if (currentWindow.frameElement) {

			prefService.setCharPref("extensions.firerobot.window-mode", "float");

			newWindow = createFloatWindow();
			newWindow.addEventListener('load', function() {
				copyWindowContent(currentWindow, newWindow);
				removeSideBar();
			}, true);
		} else {
			prefService.setCharPref("extensions.firerobot.window-mode",
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
			"fire-robot-preferences", "chrome, dialog, centerscreen");
		Application.storage.set("prefWindow", prefWindow);
	},

	openHelp: function() {
		var helpWindow = window.open(
			"chrome://firerobot/content/fireRobotHelp.xul",
			"FireRobot Help", "chrome, resizable,centerscreen");
		Application.storage.set("helpWindow", helpWindow);
	},

	addResourceBtn: function() {
		addResource();
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
	},

	extractKeywordBtn: function() {
		var frWindow = Application.storage.get("frWindow", undefined);
		var testArea = frWindow.document.getElementById("testCaseTextArea");
		var start = testArea.selectionStart;
		var end = testArea.selectionEnd;
		var activeElement = frWindow.document.activeElement;
		if (activeElement != testArea.inputField || start == end) {
			warning("firerobot.warn.no-steps-selected");
			return;
		}
		var keyWindow = window.open(
			"chrome://firerobot/content/fireRobotKey.xul",
			"Extract New Keyword", "chrome, resizable, centerscreen");
		
		Application.storage.set("keyWindow", keyWindow);
	}

};
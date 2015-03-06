var EXPORTED_SYMBOLS = [
	"kwPageShouldContain",
	"kwPageShouldNotContain",
	"kwPageShouldContainSmart",
	"kwPageShouldNotContainSmart",
	"kwWaitUntilPageContains",
	"kwWaitUntilPageContainsElement",
	"kwWaitUntilElementIsVisible",
	"kwElementTextShouldBe",
	"kwElementShouldBeEnabled",
	"kwElementShouldBeDisabled",
	"kwElementShouldBeVisible",
	"kwElementShouldNotBeVisible",
	"kwClickSmart",
	"kwOpenContext",
	"kwPressKey",
	"kwFocus",
	"kwMouseDownSmart",
	"kwMouseUp",
	"kwMouseOver",
	"kwMouseOut",
	"kwSelectFrame",
	"kwCurrentFrameContains",
	"kwCurrentFrameShouldNotContain",
	"kwFrameShouldContain",
	"kwUnselectFrame",
	"kwOpenBrowser",
	"kwOpenBrowserFFProfDir",
	"kwGoTo",
	"kwGoBack",
	"kwLocationShouldBe",
	"kwReloadPage",
	"kwCloseBrowser",
	"kwCloseAllBrowsers",
	"kwSetWindowSize",
	"kwFillForm",
	"kwCheckForm"
];

Components.utils.import("chrome://firerobot/content/external-modules/xregexp.jsm");

Components.utils.import("chrome://firerobot/content/fr-modules/utils.jsm");
Components.utils.import("chrome://firerobot/content/fr-modules/locators.jsm");
Components.utils.import("chrome://firerobot/content/fr-modules/variables.jsm");


function kwPageShouldContain() {
	_addTextVerifications("Page Should Contain");
}

function kwPageShouldNotContain() {
	_addTextVerifications("Page Should Not Contain");
}

function kwPageShouldContainSmart() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		var step = "Page Should Contain ";
		if (el.tagName == "A") {
			step += "Link";
			var locType = getLocatorType(el);
			if (locType == "link") {
				var useVar = prefService.getBoolPref(
					"extensions.firerobot.variables.use");
				if (useVar) {
					var varName = getVarNameFromValue(getLocator(el));
					if (varName) {
						step += "   \t${" + varName + "}";
						_addStepToTest(step);
						return;
					}
				}
			}
		} else if (el.tagName == "BUTTON" ||
			(el.tagName == "INPUT" && (el.type == "button" || el.type == "submit"))) {
			step += "Button";
		} else if (el.tagName == "INPUT" && el.type == "text") {
			step += "Textfield";
		} else if (el.tagName == "INPUT" && el.type == "radio") {
			step += "Radio Button";
		} else if (el.tagName == "INPUT" && el.type == "checkbox") {
			step += "Checkbox";
		} else if (el.tagName == "IMG") {
			step += "Image";
		} else if (el.tagName == "SELECT") {
			step += "List";
		} else {
			step += "Element";
		}
		step += "   \t" + getLocator(el);
		_addStepToTest(step);
	}
}

function kwPageShouldNotContainSmart() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		var step = "Page Should Not Contain ";
		if (el.tagName == "A") {
			step += "Link";
			var locType = getLocatorType(el);
			if (locType == "link") {
				var useVar = prefService.getBoolPref(
					"extensions.firerobot.variables.use");
				if (useVar) {
					var varName = getVarNameFromValue(getLocator(el));
					if (varName) {
						step += "   \t${" + varName + "}";
						_addStepToTest(step);
						return;
					}
				}
			}
		} else if (el.tagName == "BUTTON" ||
			(el.tagName == "INPUT" && (el.type == "button" || el.type == "submit"))) {
			step += "Button";
		} else if (el.tagName == "INPUT" && el.type == "text") {
			step += "Textfield";
		} else if (el.tagName == "INPUT" && el.type == "radio") {
			step += "Radio Button";
		} else if (el.tagName == "INPUT" && el.type == "checkbox") {
			step += "Checkbox";
		} else if (el.tagName == "IMG") {
			step += "Image";
		} else if (el.tagName == "SELECT") {
			step += "Page Should Not Contain List";
		} else {
			step += "Element";
		}
		step += "   \t" + getLocator(el);
		_addStepToTest(step);
	}
}

function kwClickSmart() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		var step = "Click ";
		if (el.tagName == "A") {
			step += "Link";
			var locType = getLocatorType(el);
			if (locType == "link") {
				var useVar = prefService.getBoolPref(
					"extensions.firerobot.variables.use");
				if (useVar) {
					var varName = getVarNameFromValue(getLocator(el));
					if (varName) {
						step += "   \t${" + varName + "}";
						_addStepToTest(step);
						return;
					}
				}
			}
		} else if (el.tagName == "BUTTON" ||
			(el.tagName == "INPUT" && (el.type == "button" || el.type == "submit"))) {
			step += "Button";
		} else if (el.tagName == "IMG") {
			step += "Image";
		} else {
			step += "Element";
		}
		step += "   \t" + getLocator(el);
		_addStepToTest(step);
	}
}

function kwOpenContext() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		_addStepToTest("Open Context Menu   \t" + getLocatorForGenericElement(el));
	}
}

function kwPressKey() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	} else {
		var doc = selectedElements[0].ownerDocument;
		doc.addEventListener("keydown", _checkDownKey);
		doc.addEventListener("keypress", _checkPressedKey);
	}
}



function _checkDownKey(e) {
	if (e.which) {
		var keynum;
		var doc;
		var key;
		if (e.which < 33 || e.which == 127) {
			e.stopImmediatePropagation();
			e.stopPropagation();
			e.preventDefault();
			key = "\\\\" + e.which;
		} else {
			doc.removeEventListener("keydown", _checkDownKey);
			return;
		}
		var selectedElements = Application.storage.get("selectedElements", undefined);
		if (!selectedElements || selectedElements.length === 0) {
			warning("firerobot.warn.no-el-select");
			return;
		} else {
			var doc = selectedElements[0].ownerDocument;
			for (var i = 0; i < selectedElements.length; i++) {
				var el = selectedElements[i];
				_addStepToTest("Press Key   \t" + getLocatorForGenericElement(el) + "   \t" + key);
			}
		}
	}
	doc.removeEventListener("keydown", _checkDownKey);
	doc.removeEventListener("keypress", _checkPressedKey);
}



function _checkPressedKey(e) {
	if (e.which) {
		var keynum;
		var doc;
		var key;
		var keyLetter = String.fromCharCode(e.charCode);
		var printable = XRegExp('[^\x00-\x1F\x7F]');
		var isPrintable = printable.test(keyLetter);
		if (isPrintable) {
			key = keyLetter;
		} else {
			doc.removeEventListener("keypress", _checkPressedKey);
			return;
		}
		var selectedElements = Application.storage.get("selectedElements", undefined);
		if (!selectedElements || selectedElements.length === 0) {
			warning("firerobot.warn.no-el-select");
			return;
		} else {
			var doc = selectedElements[0].ownerDocument;
			for (var i = 0; i < selectedElements.length; i++) {
				var el = selectedElements[i];
				_addStepToTest("Press Key   \t" + getLocatorForGenericElement(el) + "   \t" + key);
			}
		}
	}
	doc.removeEventListener("keydown", _checkDownKey);
	doc.removeEventListener("keypress", _checkPressedKey);
}

//TODO not working in Firefox 35
/*
function kwFocus() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		_addStepToTest("Focus   \t" + getLocatorForGenericElement(el));
	}
}
*/

function kwMouseDownSmart() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		var step = "Mouse Down ";
		if (el.tagName == "A") {
			step += "On Link";
			var locType = getLocatorType(el);
			if (locType == "link") {
				var useVar = prefService.getBoolPref(
					"extensions.firerobot.variables.use");
				if (useVar) {
					var varName = getVarNameFromValue(getLocator(el));
					if (varName) {
						step += "   \t${" + varName + "}";
						_addStepToTest(step);
						return;
					}
				}
			}
		} else if (el.tagName == "IMG") {
			step += "On Image";
		}
		step += "   \t" + getLocator(el);
		_addStepToTest(step);
	}
}

function kwMouseUp() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		_addStepToTest("Mouse Up   \t" + getLocatorForGenericElement(el));
	}
}

function kwMouseOver() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		_addStepToTest("Mouse Over   \t" + getLocatorForGenericElement(el));
	}
}

function kwMouseOut() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		_addStepToTest("Mouse Out   \t" + getLocatorForGenericElement(el));
	}
}

function kwWaitUntilPageContains() {
	_addTextVerifications("Wait Until Page Contains");
}

function kwWaitUntilPageContainsElement() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		_addStepToTest("Wait Until Page Contains Element   \t" + getLocatorForGenericElement(el));
	}
}

function kwWaitUntilElementIsVisible() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		_addStepToTest("Wait Until Element Is Visible   \t" + getLocatorForGenericElement(el));
	}
}

function kwElementShouldBeEnabled() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	var numInputElements = 0;
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		if (el.tagName == "INPUT") {
			_addStepToTest("Element Should Be Enabled   \t" + getLocatorForGenericElement(el));
			numInputElements++;
		}
	}
	if (numInputElements === 0) {
		warning("firerobot.warn.no-input-select");
	}
}

function kwElementShouldBeDisabled() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	var numInputElements = 0;
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		if (el.tagName == "INPUT") {
			_addStepToTest("Element Should Be Disabled   \t" + getLocatorForGenericElement(el));
			numInputElements++;
		}
	}
	if (numInputElements === 0) {
		warning("firerobot.warn.no-input-select");
	}
}

//TODO Not Used. The selenium webriver interpretation of element.text seems a bit unpredictable,
//particullarly concerning line breaks.
//Could not yet acheive algorithm that would emulate it.
/*
function kwElementTextShouldBe() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	var numElWithText = 0;
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		var elText = getElementText(el);
		if (elText) {
			elText = escapeRobot(elText);
			elText = escapeSpace(elText);
			_addStepToTest("Element Text Should Be  \t" + getLocatorForGenericElement(el)  + "  \t" + elText);
			numElWithText++;
		}
	}
	if (numElWithText == 0) {
		warning("firerobot.warn.no-el-with-text");
	}
}
*/

function kwElementShouldBeVisible() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		_addStepToTest("Element Should Be Visible   \t" + getLocatorForGenericElement(el));
	}
}

function kwElementShouldNotBeVisible() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		_addStepToTest("Element Should Not Be Visible   \t" + getLocatorForGenericElement(el));
	}
}

function kwSelectFrame() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	var browserWindow = windowMediator.getMostRecentWindow("navigator:browser");
	var selectedFrame;
	for (var i = 0; i < selectedElements.length; i++) {
		try {
			if (selectedElements[i].tagName == "IFRAME" ||
				selectedElements[i].tagName == "FRAME") {
				if (selectedFrame && selectedElements[i] != selectedFrame) {
					warning("firerobot.warn.more-than-one-frame");
					return;
				} else {
					selectedFrame = selectedElements[i];
				}
			} else {
				var xPathResult = browserWindow.content.document.evaluate(".//iframe|.//frame",
					selectedElements[i],
					null,
					0,
					null);

				var matchedNode = xPathResult.iterateNext();
				while (matchedNode) {
					if (selectedFrame && matchedNode != selectedFrame) {
						warning("firerobot.warn.more-than-one-frame");
						return;
					} else {
						selectedFrame = matchedNode;
					}
					matchedNode = xPathResult.iterateNext();
				}
			}
			//Not sure if this is propper
		} catch (err) {}

		var elContainingDocument = selectedElements[i].ownerDocument;
		var elContainingWindow = elContainingDocument.defaultView ||
			elContainingDocument.parentWindow;

		if (elContainingWindow.frameElement) {
			if (selectedFrame && elContainingWindow.frameElement != selectedFrame) {
				warning("firerobot.warn.more-than-one-frame");
				return;
			} else {
				selectedFrame = elContainingWindow.frameElement;
			}
		}
	}
	if (selectedFrame) {
		var step = "Select Frame   \t" + getLocator(selectedFrame);
		_addStepToTest(step);
	} else {
		warning("firerobot.warn.no-frame");
	}
}

function kwCurrentFrameContains() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	var elInFrameWithText = 0;
	var textFragments;
	for (var i = 0; i < selectedElements.length; i++) {
		var len = selectedElements[i].containers.length;
		if (len > 1) {
			textFragments = getTextFragments(selectedElements[i]);
			for (var j = 0; j < textFragments.length; j++) {
				var useVar = prefService.getBoolPref(
					"extensions.firerobot.variables.use");
				if (useVar) {
					var varName = getVarNameFromValue(textFragments[j]);
					if (varName) {
						_addStepToTest("Current Frame Contains   \t${" + varName + "}");
					} else {
						_addStepToTest("Current Frame Contains   \t" + textFragments[j]);
					}
				} else {
					_addStepToTest("Current Frame Contains   \t" + textFragments[j]);
				}
				elInFrameWithText++;
			}
		}
	}
	if (elInFrameWithText === 0) {
		warning("firerobot.warn.no-text-in-frame");
	}
}

function kwCurrentFrameShouldNotContain() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	var elInFrameWithText = 0;
	var textFragments;
	for (var i = 0; i < selectedElements.length; i++) {
		var len = selectedElements[i].containers.length;
		if (len > 1) {
			textFragments = getTextFragments(selectedElements[i]);
			for (var j = 0; j < textFragments.length; j++) {
				var useVar = prefService.getBoolPref("extensions.firerobot.variables.use");
				if (useVar) {
					var varName = getVarNameFromValue(textFragments[j]);
					if (varName) {
						_addStepToTest("Current Frame Should Not Contain   \t${" +
							varName +
							"}");
					} else {
						_addStepToTest("Current Frame Should Not Contain   \t" +
							textFragments[j]);
					}
				} else {
					_addStepToTest("Current Frame Should Not Contain   \t" +
						textFragments[j]);
				}
				elInFrameWithText++;
			}
		}
	}
	if (elInFrameWithText === 0) {
		warning("firerobot.warn.no-text-in-frame");
	}
}

function kwFrameShouldContain() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	var elInFrame = 0;
	var textFragments;
	for (var i = 0; i < selectedElements.length; i++) {
		var len = selectedElements[i].containers.length;
		if (len > 1) {
			textFragments = getTextFragments(selectedElements[i]);
			for (var j = 0; j < textFragments.length; j++) {
				var useVar = prefService.getBoolPref(
					"extensions.firerobot.variables.use");
				if (useVar) {
					var varName = getVarNameFromValue(textFragments[j]);
					if (varName) {
						_addStepToTest("Frame Should Contain   \t" +
							selectedElements[i].containers[len - 1] +
							"   \t${" + varName + "}");
					} else {
						_addStepToTest("Frame Should Contain   \t" +
							selectedElements[i].containers[len - 1] +
							"  \t" + textFragments[j]);
					}
				} else {
					_addStepToTest("Frame Should Contain   \t" +
						electedElements[i].containers[len - 1] +
						"   \t" + textFragments[j]);
				}
				elInFrame++;
			}
		}
	}
	if (elInFrame === 0) {
		warning("firerobot.warn.no-text-in-frame");
	}
}

function kwUnselectFrame() {
	_addStepToTest("Unselect Frame");
}

function kwOpenBrowser() {
	var url = getURL();
	url = escapeSpace(url);
	var step = "Open Browser  \t" + url;
	var useVar = prefService.getBoolPref(
		"extensions.firerobot.variables.use");
	if (useVar && varNameExists("BROWSER")) {
		step += "   \t${BROWSER}";
	} else {
		step += "   \tFirefox";
	}
	_addStepToTest(step);
}

function kwOpenBrowserFFProfDir() {
	var url = getURL();
	url = escapeSpace(url);
	var step = "Open Browser  \t" + url;
	var useVar = prefService.getBoolPref(
		"extensions.firerobot.variables.use");
	if (useVar && varNameExists("BROWSER")) {
		step += "   \t${BROWSER}";
	} else {
		step += "   \tFirefox";
	}

	// Get profile directory.
	var profDir = Components.classes["@mozilla.org/file/directory_service;1"].
	getService(Components.interfaces.nsIProperties).
	get("ProfD", Components.interfaces.nsIFile);

	profDirPath = profDir.path;

	var OSName = getOSName();
	if (OSName == "Windows") {
		profDirPath = profDirPath.replace(/\\/g, "\\\\");
	}
	profDirPath = escapeSpace(profDirPath);
	step += "   \tff_profile_dir=" + profDirPath;
	_addStepToTest(step);
}

function kwGoTo() {
	var url = getURL();
	_addStepToTest("Go To   \t" + url);
}

function kwGoBack() {
	_addStepToTest("Go Back");
}

function kwLocationShouldBe() {
	var url = getURL();
	_addStepToTest("Location Should be  \t" + url);
}

function kwReloadPage() {
	_addStepToTest("Reload Page");
}

function kwCloseBrowser() {
	_addStepToTest("Close Browser");
}

function kwCloseAllBrowsers() {
	_addStepToTest("Close All Browsers");
}

function kwSetWindowSize() {
	var browserWindow = windowMediator.getMostRecentWindow("navigator:browser");
	var x = browserWindow.innerWidth;
	var y = browserWindow.innerHeight;
	_addStepToTest("Set window Size  \t" + x + "  \t" + y);
}

function kwFillForm() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	var formElementsInSelection = 0;

	for (var i = 0; i < selectedElements.length; i++) {
		var selElement = selectedElements[i];

		//The selection itself is a form element
		if (selElement.tagName == "INPUT" ||
			selElement.tagName == "SELECT" ||
			selElement.tagName == "TEXTAREA" ||
			selElement.getAttribute("contenteditable") == "true"
		) {
			_fillFormElement(selElement);
			formElementsInSelection++;
		}
		//If not, look for form elements inside selection
		else {
			if (selElement.tagName == "FRAME" || selElement.tagName == "IFRAME") {
				selElement = selElement.contentWindow.document.body;
			}

			var formElementsXPath = ".//input|.//select|.//textarea|.//*[@contenteditable='true']";
			var elContainingDocument = selElement.ownerDocument;
			var xPathResult = elContainingDocument.evaluate(formElementsXPath,
				selElement,
				null,
				0,
				null);
			var matchedNode = xPathResult.iterateNext();

			while (matchedNode) {
				if (isVisible(matchedNode)) {
					_fillFormElement(matchedNode);
					formElementsInSelection++;
				}
				matchedNode = xPathResult.iterateNext();
			}
		}
	}
	if (formElementsInSelection === 0) {
		warning("firerobot.warn.no-form-el-select");
	}
}

function kwCheckForm() {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	var formElementsInSelection = 0;

	for (var i = 0; i < selectedElements.length; i++) {
		var selElement = selectedElements[i];

		//The selection itself is a form element
		if (selElement.tagName == "INPUT" || selElement.tagName == "SELECT" ||
			selElement.tagName == "TEXTAREA") {
			_checkFormElement(selElement);
			formElementsInSelection++;
		}
		//If not, look for form elements inside selection
		else {
			if (selElement.tagName == "FRAME" || selElement.tagName == "IFRAME") {
				selElement = selElement.contentWindow.document.body;
			}

			var formElementsXPath = ".//input|.//select|.//textarea";
			var elContainingDocument = selElement.ownerDocument;
			var xPathResult = elContainingDocument.evaluate(formElementsXPath,
				selElement,
				null,
				0,
				null);

			var matchedNode = xPathResult.iterateNext();
			while (matchedNode) {
				if (isVisible(matchedNode)) {
					_checkFormElement(matchedNode);
					formElementsInSelection++;
				}
				matchedNode = xPathResult.iterateNext();
			}
		}
	}
	if (formElementsInSelection === 0) {
		warning("firerobot.warn.no-form-el-select");
	}
}

function _fillFormElement(element) {
	var createVar = prefService.getBoolPref(
		"extensions.firerobot.variables.create");
	var useVar = prefService.getBoolPref(
		"extensions.firerobot.variables.use");
	var locator = getLocator(element);
	var testStep;
	var varName;
	var boxText;

	if (element.tagName == "INPUT" &&
		!_isReadOnly(element) &&
		!_isDisabled(element)) {
		if ((element.type == "text" ||
				element.type == "email" ||
				element.type == "tel" ||
				element.type == "url" ||
				element.type == "search" ||
				element.type == "color" ||
				element.type == "number" ||
				element.type == "range" ||
				element.type == "date" ||
				element.type === undefined) &&
			element.value) {
			testStep = "Input Text   \t" +
				locator +
				"   \t";
			boxText = element.value;
			boxText = escapeRobot(boxText);
			boxText = escapeSpace(boxText);
			if (useVar || createVar) {
				varName = getVarNameFromValue(boxText);
			}
			if (createVar && !varName) {
				varName = createVarNameForInput(element);
				addVariable(varName, boxText);
			}
			if (useVar && varName) {
				_addStepToTest(testStep + "${" + varName + "}");
			} else {
				_addStepToTest(testStep + boxText);
			}
		} else if (element.type == "checkbox" && element.checked) {
			_addStepToTest("Select Checkbox   \t" + locator);
		}
		//TODO would this be useful?
		/*
			else if (element.type == "checkbox" && !element.checked) {
			_addStepToTest("Unselect Checkbox  \t" + getLocator(element));
			}
		*/
		else if (element.type == "radio" && element.checked) {
			_addStepToTest("Select Radio Button   \t" +
				element.name +
				"   \t" +
				element.value);
		} else if (element.type == "password" && element.value) {
			testStep = "Input Password   \t" +
				locator +
				"   \t";
			var passText = element.value;
			passText = escapeRobot(passText);
			passText = escapeSpace(passText);
			if (useVar || createVar) {
				varName = getVarNameFromValue(passText);
			}
			if (createVar && !varName) {
				varName = createVarNameForInput(element);
				addVariable(varName, passText);
			}
			if (useVar && varName) {
				_addStepToTest(testStep + "${" + varName + "}");
			} else {
				_addStepToTest(testStep + passText);
			}
		}
	} else if (element.tagName == "TEXTAREA" &&
		element.value &&
		!_isReadOnly(element) &&
		!_isDisabled(element)) {
		testStep = "Input Text   \t" +
			locator +
			"   \t";
		var areaText = element.value;
		areaText = escapeRobot(areaText);
		areaText = areaText.replace(/(\r\n|\n|\r)/gm, "\\n");
		areaText = escapeSpace(areaText);

		if (useVar || createVar) {
			varName = getVarNameFromValue(areaText);
		}
		if (createVar && !varName) {
			varName = createVarNameForInput(element);
			addVariable(varName, areaText);
		}
		if (useVar && varName) {
			_addStepToTest(testStep + "${" + varName + "}");
		} else {
			_addStepToTest(testStep + areaText);
		}
	} else if (element.tagName == "SELECT" &&
		!_isDisabled(element)) {
		var elContainingDocument = element.ownerDocument;
		var xPathResult = elContainingDocument.evaluate(".//option",
			element,
			null,
			0,
			null);
		var matchedNode = xPathResult.iterateNext();
		while (matchedNode) {
			if (matchedNode.selected) {
				var locType = getLocatorType(matchedNode);
				var matcheNodeLoc;

				if (locType == "value") {
					testStep = "Select From List By Value   \t" +
						locator +
						"   \t";
					matcheNodeLoc = matchedNode.getAttribute("value");
				} else if (locType == "label") {
					testStep = "Select From List By Label   \t" +
						locator +
						"   \t";
					matcheNodeLoc = matchedNode.label;
				} else if (locType == "index") {
					testStep = "Select From List By Index   \t" +
						locator +
						"   \t";
					matcheNodeLoc = matchedNode.index;
				} else if (matchedNode.label && matchedNode.label !== "") {
					testStep = "Select From List By Label   \t" +
						locator +
						"   \t";
					matcheNodeLoc = matchedNode.label;
				}

				if (useVar || createVar) {
					varName = getVarNameFromValue(matcheNodeLoc);
				}
				if (createVar && !varName) {
					varName = createVarNameForInput(element);
					addVariable(varName, matcheNodeLoc);
				}
				if (useVar && varName) {
					_addStepToTest(testStep + "${" + varName + "}");
				} else {
					_addStepToTest(testStep + matcheNodeLoc);
				}
			}
			//TODO would this be useful?
			/*
			else {
					_addStepToTest("Unselect From List\t" + getLocator(element) + "  \t" + getLocator(matchedNode));
			} 
			*/
			matchedNode = xPathResult.iterateNext();
		}
	}
	//TODO improve
	//For custom input boxes
	else if (element.getAttribute("contenteditable") == "true" && element.innerHTML !== "") {
		testStep = "Input Text   \t" +
			locator +
			"   \t";
		var cleanElement = getCleanClone(element);
		boxText = cleanElement.innerHTML;
		boxText = escapeRobot(boxText).
		replace(/<br>|<br\/>|<p[^>]*>/gmi, "\\n").
		replace(/<[^>]*>/gmi, "").
		replace(/&nbsp;/gmi, " ");
		boxText = escapeSpace(boxText);
		if (useVar || createVar) {
			varName = getVarNameFromValue(boxText);
		}
		if (createVar && !varName) {
			varName = createVarNameForInput(element);
			addVariable(varName, boxText);
		}
		if (useVar && varName) {
			_addStepToTest(testStep + "${" + varName + "}");
		} else {
			_addStepToTest(testStep + boxText);
		}
	}
}

function _checkFormElement(element) {
	var createVar = prefService.getBoolPref(
		"extensions.firerobot.variables.create");
	var useVar = prefService.getBoolPref(
		"extensions.firerobot.variables.use");
	var locator = getLocator(element);
	var testStep;
	var varName;
	var boxText;

	if (element.tagName == "INPUT") {
		if ((element.type == "text" ||
				element.type == "email" ||
				element.type == "tel" ||
				element.type == "url" ||
				element.type == "search" ||
				element.type == "color" ||
				element.type == "number" ||
				element.type == "range" ||
				element.type == "date" ||
				element.type === undefined) &&
			element.value) {
			testStep = "Textfield Value Should Be   \t" +
				locator +
				"   \t";
			boxText = element.value;
			boxText = escapeRobot(boxText);
			boxText = escapeSpace(boxText);
			if (useVar || createVar) {
				varName = getVarNameFromValue(boxText);
			}
			if (createVar && !varName) {
				varName = createVarNameForInput(element);
				addVariable(varName, boxText);
			}
			if (useVar && varName) {
				_addStepToTest(testStep + "${" + varName + "}");
			} else {
				_addStepToTest(testStep + boxText);
			}
		} else if (element.type == "checkbox" && element.checked) {
			_addStepToTest("Checkbox Should Be Selected   \t" +
				locator);
		} else if (element.type == "checkbox" && !element.checked) {
			_addStepToTest("Checkbox Should Not Be Selected   \t" +
				locator);
			//TODO Use the "radio button should no be selected" keyword?
		} else if (element.type == "radio" && element.checked) {
			_addStepToTest("Radio Button Should Be Set To   \t" +
				element.name +
				"\tvalue=" +
				element.value);
		}
	} else if (element.tagName == "TEXTAREA" && element.value) {
		testStep = "Textarea Value Should Be   \t" +
			locator +
			"   \t";
		var areaText = element.value;
		areaText = escapeRobot(areaText);
		areaText = areaText.replace(/(\r\n|\n|\r)/gm, "\\n");
		areaText = escapeSpace(areaText);

		if (useVar || createVar) {
			varName = getVarNameFromValue(areaText);
		}
		if (createVar && !varName) {
			varName = createVarNameForInput(element);
			addVariable(varName, areaText);
		}
		if (useVar && varName) {
			_addStepToTest(testStep + "${" + varName + "}");
		} else {
			_addStepToTest(testStep + areaText);
		}
	} else if (element.tagName == "SELECT") {
		var elContainingDocument = element.ownerDocument;
		var xPathResult = elContainingDocument.evaluate(".//option",
			element,
			null,
			0,
			null);
		var matchedNode = xPathResult.iterateNext();
		while (matchedNode) {
			if (matchedNode.selected) {
				var locType = getLocatorType(matchedNode);
				testStep = "List Selection Should Be   \t" +
					locator +
					"   \t";
				var matcheNodeLoc;
				if (locType == "value") {
					matcheNodeLoc = matchedNode.getAttribute("value");
				} else if (locType == "label") {
					matcheNodeLoc = matchedNode.label;
				}
				//Index is valid for filling but not for checking, use value as default
				else if (matchedNode.getAttribute("value") &&
					matchedNode.getAttribute("value") !== "") {
					matcheNodeLoc = matchedNode.getAttribute("value");
				}

				if (useVar || createVar) {
					varName = getVarNameFromValue(matcheNodeLoc);
				}
				if (createVar && !varName) {
					varName = createVarNameForInput(element);
					addVariable(varName, matcheNodeLoc);
				}
				if (useVar && varName) {
					_addStepToTest(testStep + "${" + varName + "}");
				} else {
					_addStepToTest(testStep + matcheNodeLoc);
				}
			}
			matchedNode = xPathResult.iterateNext();
		}
	}
}

function _addTextVerifications(keyword) {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	var textFragments;
	var numTextFragmentInSelection = 0;
	var useVar = prefService.getBoolPref("extensions.firerobot.variables.use");
	for (var i = 0; i < selectedElements.length; i++) {

		textFragments = getTextFragments(selectedElements[i]);

		numTextFragmentInSelection += textFragments.length;

		for (var j = 0; j < textFragments.length; j++) {
			if (useVar) {
				var varName = getVarNameFromValue(textFragments[j]);
				if (varName) {
					_addStepToTest(keyword + "   \t${" + varName + "}");
				} else {
					_addStepToTest(keyword + "   \t" + textFragments[j]);
				}
			} else {
				_addStepToTest(keyword + "   \t" + textFragments[j]);
			}
		}
	}
	if (numTextFragmentInSelection === 0) {
		warning("firerobot.warn.no-text-select");
	}
}

function _addStepToTest(step) {
	var frWindow = Application.storage.get("frWindow", undefined);
	var testCaseTextArea = frWindow.document.getElementById("fire-robot-testCaseTextArea");
	var testCase = testCaseTextArea.value;
	testCase = testCase + "\r\n    " + step;
	testCaseTextArea.value = testCase;
	var ti = frWindow.document.getAnonymousNodes(testCaseTextArea)[0].
	childNodes[0];
	ti.scrollTop = ti.scrollHeight;
}

function _isReadOnly(element) {
	return element.readOnly || element.getAttribute("readonly") == "readonly";
}

function _isDisabled(element) {
	return element.disabled || element.getAttribute("disabled") == "disabled";
}
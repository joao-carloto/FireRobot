var EXPORTED_SYMBOLS = [
	"kwPageShouldContain",
	"kwPageShouldNotContain",
	"kwPageShouldContainSmart",
	"kwPageShouldNotContainSmart",
	"kwWaitUntilPageContains",
	"kwWaitUntilPageContainsElement",
	"kwWaitUntilElementIsVisible",
	"kwElementShouldBeEnabled",
	"kwElementShouldBeDisabled",
	"kwElementShouldBeVisible",
	"kwElementShouldNotBeVisible",
	"kwClickSmart",
	"kwSelectFrame",
	"kwCurrentFrameContains",
	"kwCurrentFrameShouldNotContain",
	"kwFrameShouldContain",
	"kwUnselectFrame",
	"kwOpenBrowser",
	"kwCloseAllBrowsers",
	"kwGoTo",
	"kwGoBack",
	"kwCloseBrowser",
	"kwCloseAllBrowsers",
	"kwFillForm",
	"kwCheckForm"
];

Components.utils.import("chrome://firerobot/content/fr-modules/utils.jsm");
Components.utils.import("chrome://firerobot/content/fr-modules/locators.jsm");
Components.utils.import("chrome://firerobot/content/fr-modules/variables.jsm");


var _prefService = Components.classes["@mozilla.org/preferences-service;1"]
	.getService(Components.interfaces.nsIPrefBranch);

var _Application = Components.classes["@mozilla.org/fuel/application;1"]
	.getService(Components.interfaces.fuelIApplication);

var _windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
	.getService(Components.interfaces.nsIWindowMediator);

function kwPageShouldContain() {
	_addTextVerifications("Page Should Contain");
}

function kwPageShouldNotContain() {
	_addTextVerifications("Page Should Not Contain");
}

function kwPageShouldContainSmart() {
	var selectedElements = _Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		var step = "Page Should Contain ";
		if (el.tagName == "A") {
			step += "Link";
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
		step += "  \t" + getLocator(el);
		_addStepToTest(step);
	}
}

function kwPageShouldNotContainSmart() {
	var selectedElements = _Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		var step = "Page Should Not Contain ";
		if (el.tagName == "A") {
			step += "Link";
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
		step += "  \t" + getLocator(el);
		_addStepToTest(step);
	}
}

function kwClickSmart() {
	var selectedElements = _Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		var step = "Click ";
		if (el.tagName == "A") {
			step += "Link";
		} else if (el.tagName == "BUTTON" ||
			(el.tagName == "INPUT" && (el.type == "button" || el.type == "submit"))) {
			step += "Button";
		} else if (el.tagName == "IMG") {
			step += "Image";
		} else {
			step += "Element";
		}
		step += "  \t" + getLocator(el);
		_addStepToTest(step);
	}
}

function kwWaitUntilPageContains() {
	_addTextVerifications("Wait Until Page Contains");
}

function kwWaitUntilPageContainsElement() {
	var selectedElements = _Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		_addStepToTest("Wait Until Page Contains Element  \t" + getLocatorForGenericElement(el));
	}
}

function kwWaitUntilElementIsVisible() {
	var selectedElements = _Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		_addStepToTest("Wait Until Element Is Visible  \t" + getLocatorForGenericElement(el));
	}
}

function kwElementShouldBeEnabled() {
	var selectedElements = _Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	var numInputElements = 0;
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		if (el.tagName == "INPUT") {
			_addStepToTest("Element Should Be Enabled  \t" + getLocatorForGenericElement(el));
			numInputElements++;
		}
	}
	if (numInputElements === 0) {
		warning("firerobot.warn.no-input-select");
	}
}

function kwElementShouldBeDisabled() {
	var selectedElements = _Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	var numInputElements = 0;
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		if (el.tagName == "INPUT") {
			_addStepToTest("Element Should Disabled  \t" + getLocatorForGenericElement(el));
			numInputElements++;
		}
	}
	if (numInputElements === 0) {
		warning("firerobot.warn.no-input-select");
	}
}

function kwElementShouldBeVisible() {
	var selectedElements = _Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		_addStepToTest("Element Should Be Visible  \t" + getLocatorForGenericElement(el));
	}
}

function kwElementShouldNotBeVisible() {
	var selectedElements = _Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	for (var i = 0; i < selectedElements.length; i++) {
		var el = selectedElements[i];
		_addStepToTest("Element Should Not Be Visible  \t" + getLocatorForGenericElement(el));
	}
}

function kwSelectFrame() {
	var selectedElements = _Application.storage.get("selectedElements", undefined);
	var browserWindow = _windowMediator.getMostRecentWindow("navigator:browser");
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
		var step = "Select Frame  \t" + getLocator(selectedFrame);
		_addStepToTest(step);
	} else {
		warning("firerobot.warn.no-frame");
	}
}

function kwCurrentFrameContains() {
	var selectedElements = _Application.storage.get("selectedElements", undefined);
	var elInFrameWithText = 0;
	var textFragments;
	for (var i = 0; i < selectedElements.length; i++) {
		var len = selectedElements[i].containers.length;
		if (len > 1) {
			textFragments = getTextFragments(selectedElements[i]);
			for (var j = 0; j < textFragments.length; j++) {
				var useVar = _prefService.getBoolPref(
					"extensions.firerobot.variables.use");
				if (useVar) {
					var varName = getVarNameFromValue(textFragments[j]);
					if (varName) {
						_addStepToTest("Current Frame Contains  \t${" + varName + "}");
					} else {
						_addStepToTest("Current Frame Contains  \t" + textFragments[j]);
					}
				} else {
					_addStepToTest("Current Frame Contains  \t" + textFragments[j]);
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
	var selectedElements = _Application.storage.get("selectedElements", undefined);
	var elInFrameWithText = 0;
	var textFragments;
	for (var i = 0; i < selectedElements.length; i++) {
		var len = selectedElements[i].containers.length;
		if (len > 1) {
			textFragments = getTextFragments(selectedElements[i]);
			for (var j = 0; j < textFragments.length; j++) {
				var useVar = _prefService.getBoolPref("extensions.firerobot.variables.use");
				if (useVar) {
					var varName = getVarNameFromValue(textFragments[j]);
					if (varName) {
						_addStepToTest("Current Frame Should Not Contain  \t${" +
							varName +
							"}");
					} else {
						_addStepToTest("Current Frame Should Not Contain  \t" +
							textFragments[j]);
					}
				} else {
					_addStepToTest("Current Frame Should Not Contain  \t" +
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
	var selectedElements = _Application.storage.get("selectedElements", undefined);
	var elInFrame = 0;
	var textFragments;
	for (var i = 0; i < selectedElements.length; i++) {
		var len = selectedElements[i].containers.length;
		if (len > 1) {
			textFragments = getTextFragments(selectedElements[i]);
			for (var j = 0; j < textFragments.length; j++) {
				var useVar = _prefService.getBoolPref(
					"extensions.firerobot.variables.use");
				if (useVar) {
					var varName = getVarNameFromValue(textFragments[j]);
					if (varName) {
						_addStepToTest("Frame Should Contain  \t" +
							selectedElements[i].containers[len - 1] +
							"  \t${" + varName + "}");
					} else {
						_addStepToTest("Frame Should Contain  \t" +
							selectedElements[i].containers[len - 1] +
							"  \t" + textFragments[j]);
					}
				} else {
					_addStepToTest("Frame Should Contain  \t" +
						electedElements[i].containers[len - 1] +
						"  \t" + textFragments[j]);
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
	var browserWindow = _windowMediator.getMostRecentWindow("navigator:browser");
	var url = browserWindow.content.document.URL;
	url = decodeURIComponent(url);
	_addStepToTest("Open Browser  \t" +
		url +
		"  \t${BROWSER}");
}

function kwGoTo() {
	var browserWindow = _windowMediator.getMostRecentWindow("navigator:browser");
	var url = browserWindow.content.document.URL;
	url = decodeURIComponent(url);
	_addStepToTest("Go To  \t" + url);
}

function kwGoBack() {
	_addStepToTest("Go Back");
}

function kwCloseBrowser() {
	_addStepToTest("Close Browser");
}

function kwCloseAllBrowsers() {
	_addStepToTest("Close All Browsers");
}

function kwFillForm() {
	var selectedElements = _Application.storage.get("selectedElements", undefined);
	var formElementsInSelection = 0;

	for (var i = 0; i < selectedElements.length; i++) {
		var selElement = selectedElements[i];

		//The selection itself is a form element
		if (selElement.tagName == "INPUT" ||
			selElement.tagName == "SELECT" ||
			selElement.tagName == "TEXTAREA") {
			_fillFormElement(selElement);
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
	var selectedElements = _Application.storage.get("selectedElements", undefined);
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
		warning("No form elements are selected.");
	}
}

function _fillFormElement(element) {
	var createVar = this._prefService.getBoolPref(
		"extensions.firerobot.variables.create");
	var useVar = this._prefService.getBoolPref(
		"extensions.firerobot.variables.use");

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
			var boxText = element.value;
			boxText = escapeRobot(boxText);
			boxText = escapeSpace(boxText);
			if (useVar || createVar) {
				varName = getVarNameFromValue(boxText);
				if (varName) {
					_addStepToTest("Input Text  \t" + getLocator(element) +
						"  \t${" +
						varName +
						"}");
				} else {
					if (createVar) {
						varName = createVarName(element);
						addVariable(varName, boxText);
						_addStepToTest("Input Text  \t" + getLocator(element) +
							"  \t${" +
							varName +
							"}");
					} else {
						_addStepToTest("Input Text  \t" + getLocator(element) +
							"  \t" +
							boxText);
					}
				}
			} else {
				_addStepToTest("Input Text  \t" +
					getLocator(element) +
					"  \t" + boxText);
			}
		} else if (element.type == "checkbox" && element.checked) {
			_addStepToTest("Select Checkbox  \t" + getLocator(element));
		}
		//TODO would this be useful?
		/*
			else if (element.type == "checkbox" && !element.checked) {
			_addStepToTest("Unselect Checkbox  \t" + getLocator(element));
			}
		*/
		else if (element.type == "radio" && element.checked) {
			_addStepToTest("Select Radio Button  \t" +
				element.name +
				"  \t" +
				element.value);
		} else if (element.type == "password" && element.value) {

			var passText = element.value;
			if (useVar || createVar) {
				varName = getVarNameFromValue(passText);
				if (varName) {
					_addStepToTest("Input Password   \t" +
						getLocator(element) +
						"  \t${" +
						varName +
						"}");
				} else {
					if (createVar) {
						varName = createVarName(element);
						addVariable(varName, passText);
						_addStepToTest("Input Password   \t" +
							getLocator(element) +
							"  \t${" +
							varName +
							"}");
					} else {
						_addStepToTest("Input Password   \t" +
							getLocator(element) +
							"  \t" +
							passText);
					}
				}
			} else {
				_addStepToTest("Input Password   \t" +
					getLocator(element) +
					"  \t" +
					passText);
			}
		}
	} else if (element.tagName == "TEXTAREA" && element.value) {
		var areaText = element.value;
		areaText = escapeRobot(areaText);
		areaText = areaText.replace(/(\r\n|\n|\r)/gm, "\\n");
		areaText = escapeSpace(areaText);
		if (useVar || createVar) {
			varName = getVarNameFromValue(areaText);
			if (varName) {
				_addStepToTest("Input Text  \t" +
					getLocator(element) +
					"  \t${" +
					varName +
					"}");
			} else {
				if (createVar) {
					varName = createVarName(element);
					addVariable(varName, areaText);
					_addStepToTest("Input Text  \t" +
						getLocator(element) +
						"  \t${" +
						varName +
						"}");
				} else {
					_addStepToTest("Input Text  \t" + getLocator(element) +
						"  \t" +
						areaText);
				}
			}
		} else {
			_addStepToTest("Input Text  \t" + getLocator(element) +
				"  \t" +
				areaText);
		}
	}

	//TODO create variables from values and labels?
	else if (element.tagName == "SELECT") {
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
				var testStep;

				if (locType == "value") {
					testStep = "Select From List By Value  \t" +
						getLocator(element) +
						"  \t" +
						matchedNode.getAttribute("value");
				} else if (locType == "label") {
					testStep = "Select From List By Label  \t" +
						getLocator(element) +
						"  \t" +
						matchedNode.label;
				} else if (locType == "index") {
					testStep = "Select From List By Index  \t" +
						getLocator(element) +
						"  \t" +
						matchedNode.index;
				} else if (matchedNode.label && matchedNode.label !== "") {
					testStep = "Select From List By Label  \t" +
						getLocator(element) +
						"  \t" +
						matchedNode.label;
				}
				if (testStep) {
					_addStepToTest(testStep);
				}
				//TODO would this be useful?
				/*
					if (useVar || createVar) {
					var varName = getVarNameFromValue(locator);
					if (varName) {
					_addStepToTest(testStep + "${" + varName + "}");
					} else {
					if (createVar) {
					varName = _createVarName(element);
					addVariable(varName, locator);
					_addStepToTest(testStep + "${" + varName + "}");
					} else {
					_addStepToTest(testStep + locator);
					}
					}
					}
				*/
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
}

function _checkFormElement(element) {
	var varName;
	var useVar = this._prefService.getBoolPref(
		"extensions.firerobot.variables.use");

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
			element.type === undefined) && element.value) {
			var boxText = element.value;
			boxText = escapeRobot(boxText);
			boxText = escapeSpace(boxText);
			if (useVar) {
				varName = getVarNameFromValue(boxText);
				if (varName) {
					_addStepToTest("Textfield Value Should Be  \t" +
						getLocator(element) +
						"  \t${" +
						varName +
						"}");
				} else {
					_addStepToTest("Textfield Value Should Be  \t" +
						getLocator(element) +
						"  \t" +
						boxText);
				}
			} else {
				//TODO should this verify if the textfield is empty?
				_addStepToTest("Textfield Value Should Be  \t" + getLocator(element) +
					"  \t" +
					boxText);
			}
		} else if (element.type == "checkbox" && element.checked) {
			_addStepToTest("Checkbox Should Be Selected  \t" +
				getLocator(element));
		} else if (element.type == "checkbox" && !element.checked) {
			_addStepToTest("Checkbox Should Not Be Selected  \t" +
				getLocator(element));
			//TODO Use the "radio button should no be selected" keyword?
		} else if (element.type == "radio" && element.checked) {
			_addStepToTest("Radio Button Should Be Set To  \t" +
				element.name +
				"\tvalue=" +
				element.value);
		}
	} else if (element.tagName == "TEXTAREA" && element.value) {
		var areaText = element.value;
		areaText = escapeRobot(areaText);
		areaText = areaText.replace(/(\r\n|\n|\r)/gm, "\\n");
		areaText = escapeSpace(areaText);
		if (useVar) {
			varName = getVarNameFromValue(areaText);
			if (varName) {
				_addStepToTest("Textarea Value Should Be  \t" +
					getLocator(element) +
					"  \t${" +
					varName +
					"}");
			} else {
				_addStepToTest("Textarea Value Should Be  \t" +
					getLocator(element) +
					"  \t" +
					areaText);
			}
		} else {
			//TODO should this verify if the textfield is empty?
			_addStepToTest("Textarea Value Should Be  \t" +
				getLocator(element) +
				"  \t" + areaText);
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
				if (locType == "value" || locType == "label") {
					_addStepToTest("List Selection Should Be  \t" +
						getLocator(element) +
						"  \t" +
						getLocator(matchedNode));
				} else if (matchedNode.getAttribute("value") &&
					matchedNode.getAttribute("value") !== "") {
					_addStepToTest("List Selection Should Be  \t" +
						getLocator(element) +
						"  \t" +
						matchedNode.getAttribute(value));
				}
			}
			matchedNode = xPathResult.iterateNext();
		}
	}
}

function _addTextVerifications(keyword) {
	var selectedElements = _Application.storage.get("selectedElements", undefined);
	if (!selectedElements || selectedElements.length === 0) {
		warning("firerobot.warn.no-el-select");
		return;
	}
	var textFragments;
	var numTextFragmentInSelection = 0;
	var useVar = _prefService.getBoolPref("extensions.firerobot.variables.use");
	for (var i = 0; i < selectedElements.length; i++) {

		textFragments = getTextFragments(selectedElements[i]);

		numTextFragmentInSelection += textFragments.length;

		for (var j = 0; j < textFragments.length; j++) {
			if (useVar) {
				var varName = getVarNameFromValue(textFragments[j]);
				if (varName) {
					_addStepToTest(keyword + "  \t${" + varName + "}");
				} else {
					_addStepToTest(keyword + "  \t" + textFragments[j]);
				}
			} else {
				_addStepToTest(keyword + "  \t" + textFragments[j]);
			}
		}
	}
	if (numTextFragmentInSelection === 0) {
		warning("firerobot.warn.no-text-select");
	}
}

function _addStepToTest(step) {
	var frWindow = _Application.storage.get("frWindow", undefined);
	var testCaseTextArea = frWindow.document.getElementById("testCaseTextArea");
	var testCase = testCaseTextArea.value;
	testCase = testCase + "\r\n\t" + step;
	testCaseTextArea.value = testCase;
	var ti = frWindow.document.getAnonymousNodes(testCaseTextArea)[0].
	childNodes[0];
	ti.scrollTop = ti.scrollHeight;
}
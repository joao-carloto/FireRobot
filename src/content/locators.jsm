var EXPORTED_SYMBOLS = [
	"getLocator",
	"getLocatorType"
];

Components.utils.import("chrome://firerobot/content/utils.jsm");


var _prefService = Components.classes["@mozilla.org/preferences-service;1"].
getService(Components.interfaces.nsIPrefBranch);

function getLocator(element) {
	var locatorPreferences = _getLocPrefs();
	var i;
	var validLocators;

	if (element.tagName == "A") {
		validLocators = _linkLocators;
	} else if (element.tagName == "BUTTON" ||
		(element.tagName == "INPUT" &&
			element.type == "button")) {
		validLocators = _btnLocators;
	} else if (element.tagName == "INPUT" &&
		(element.type == "text" ||
			element.type == "email" ||
			element.type == "tel" ||
			element.type == "url" ||
			element.type == "search" ||
			element.type == "color" ||
			element.type == "number" ||
			element.type == "range" ||
			element.type == "date" ||
			element.type == "password")) {
		validLocators = _textFieldLocators;
	} else if (element.tagName == "TEXTAREA") {
		validLocators = _textFieldLocators;
	} else if (element.tagName == "INPUT" && element.type == "radio") {
		validLocators = _radioBtnLocators;
	} else if (element.tagName == "INPUT" && element.type == "checkbox") {
		validLocators = _checkBoxLocators;
	} else if (element.tagName == "IMG") {
		validLocators = _imageLocators;
	} else if (element.tagName == "SELECT") {
		validLocators = _listLocators;
	} else if (element.tagName == "OPTION") {
		validLocators = _optionLocators;
	} else if (element.tagName == "FRAME" || element.tagName == "IFRAME") {
		validLocators = _frameLocators;
	} else {
		validLocators = _elementLocators;
	}

	var selLocType;
	var loc = undefined;
	for (i = 0; i < locatorPreferences.length; i++) {
		if (validLocators.indexOf(locatorPreferences[i]) != -1) {
			selLocType = locatorPreferences[i];
			if (selLocType == "id" && element.id) {
				loc = element.id;
			} else if (selLocType == "name" && element.name) {
				loc = element.name;
			} else if (selLocType == "href" && element.href) {
				loc = element.getAttribute("href");
			}
			//TODO BUG will return absolute paths not compatible with test
			else if (selLocType == "src" && element.src) {
				loc = element.getAttribute("src");
			} else if (selLocType == "value" &&
				element.getAttribute("value") &&
				element.getAttribute("value") !== "") {
				loc = element.getAttribute("value");
			} else if (selLocType == "index" && element.index) {
				loc = element.index;
			} else if (selLocType == "alt" && element.alt) {
				loc = element.alt;
			} else if (selLocType == "label" &&
				element.label &&
				element.label !== "") {
				loc = element.label;
			} else if (selLocType == "link" && getNodeValue(element) !== "") {
				loc = getNodeValue(element);
			} else if (selLocType == "xpath") {
				loc = "xpath=" + (element.xpath || getElementXPath(element));
			}
		}
		if (loc) break;
	}
	if (!loc) {
		loc = "xpath=" + (element.xpath || getElementXPath(element));
	}
	return escapeRobot(loc);
}

function getLocatorType(element) {
	var locatorPreferences = _getLocPrefs();
	var i;
	var validLocators;

	if (element.tagName == "A") {
		validLocators = _linkLocators;
	} else if (element.tagName == "BUTTON" || (element.tagName == "INPUT" &&
		element.type == "button")) {
		validLocators = _btnLocators;
	} else if (element.tagName == "INPUT" &&
		(element.type == "text" ||
			element.type == "email" ||
			element.type == "tel" ||
			element.type == "url" ||
			element.type == "search" ||
			element.type == "color" ||
			element.type == "number" ||
			element.type == "range" ||
			element.type == "date" ||
			element.type == "password")) {
		validLocators = _textFieldLocators;
	} else if (element.tagName == "TEXTAREA") {
		validLocators = _textFieldLocators;
	} else if (element.tagName == "INPUT" && element.type == "radio") {
		validLocators = _radioBtnLocators;
	} else if (element.tagName == "INPUT" && element.type == "checkbox") {
		validLocators = _checkBoxLocators;
	} else if (element.tagName == "IMG") {
		validLocators = _imageLocators;
	} else if (element.tagName == "SELECT") {
		validLocators = _listLocators;
	} else if (element.tagName == "OPTION") {
		validLocators = _optionLocators;
	} else if (element.tagName == "FRAME" || element.tagName == "IFRAME") {
		validLocators = _frameLocators;
	} else {
		validLocators = _elementLocators;
	}

	var selLocType;
	for (i = 0; i < locatorPreferences.length; i++) {
		if (validLocators.indexOf(locatorPreferences[i]) != -1) {
			selLocType = locatorPreferences[i];
			if (selLocType == "id" && element.id) {
				return "id";
			} else if (selLocType == "name" && element.name) {
				return "name";
			} else if (selLocType == "href" && element.href) {
				return "href";
			} else if (selLocType == "src" && element.src) {
				return "src";
			} else if (selLocType == "value" && element.getAttribute("value")) {
				return "value";
			} else if (selLocType == "index" && element.index) {
				return "index";
			} else if (selLocType == "label" && element.label) {
				return "label";
			} else if (selLocType == "link" && getNodeValue(element) !== "") {
				return "link";
			} else if (selLocType == "xpath") {
				return "xpath";
			}
		}
	}
	return "xpath";
}

var _linkLocators = [
	"id",
	"name",
	"href",
	"link",
	"xpath"
];

var _btnLocators = [
	"id",
	"name",
	"value",
	"xpath"
];

var _radioBtnLocators = [
	"id",
	"name",
	"value",
	"xpath"
];

var _checkBoxLocators = [
	"id",
	"name",
	"value",
	"xpath"
];

var _listLocators = [
	"id",
	"name",
	"xpath"
];

var _optionLocators = [
	"value",
	"label",
	"index"
];

var _textFieldLocators = [
	"id",
	"name",
	"xpath"
];

var _imageLocators = [
	"id",
	"src",
	"alt",
	"xpath"
];

var _frameLocators = [
	"id",
	"name",
	"xpath"
];

var _elementLocators = [
	"id",
	"name",
	"xpath"
];

function _getLocPrefs() {
	var enabledLocPreferences;
	enabledLocPreferences = _prefService.getCharPref(
		"extensions.firerobot.enabled-locators");
	return enabledLocPreferences.split(",");
}
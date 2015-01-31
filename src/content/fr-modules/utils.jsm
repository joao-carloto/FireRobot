var EXPORTED_SYMBOLS = [
	"Application",
	"prefService",
	"promptService",
	"windowMediator",
	"windowWatcher",
	"setBrowserWindow",
	"setBrowserIconOn",
	"setBrowserIconOff",
	"warning",
	"escapeRobot",
	"escapeSpace",
	"getNodeValue",
	"getTextFragments",
	"getElementText",
	"getCleanClone",
	"getElementXPath",
	"getNearTextElement",
	"getLabel",
	"getURL",
	"isVisible",
	"getOSName"
];

Components.utils.import("chrome://firerobot/content/external-modules/xregexp.jsm");

var Application = Components.classes["@mozilla.org/fuel/application;1"]
	.getService(Components.interfaces.fuelIApplication);

var prefService = Components.classes["@mozilla.org/preferences-service;1"]
	.getService(Components.interfaces.nsIPrefBranch);

var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
	.getService(Components.interfaces.nsIPromptService);

var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
	.getService(Components.interfaces.nsIWindowMediator);

var windowWatcher = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
	.getService(Components.interfaces.nsIWindowWatcher);


function setBrowserWindow() {
	var browserWindow = windowMediator.getMostRecentWindow("navigator:browser");
	Application.storage.set("browserWindow", browserWindow);
	return browserWindow;
}

function setBrowserIconOn(browserWindow) {
	if (browserWindow && !browserWindow.closed) {
		var toolbarIcon = browserWindow.document.getElementById("fire-robot-toolbar-button");
		if (toolbarIcon) {
			toolbarIcon.style.listStyleImage = "url('chrome://firerobot/skin/fire_robot_toolbar_on.png')";
		}
	}
}

function setBrowserIconOff(browserWindow) {
	if (browserWindow && !browserWindow.closed) {
		var toolbarIcon = browserWindow.document.getElementById("fire-robot-toolbar-button");
		if (toolbarIcon) {
			toolbarIcon.style.listStyleImage = "url('chrome://firerobot/skin/fire_robot_toolbar_off.png')";
		}
	}
}

//To produce localized warnings from .js or .jsm files not directly associated with a window.
function warning(propRef) {
	var frWindow = Application.storage.get("frWindow", undefined);
	if (!frWindow) return;
	var strBundle = frWindow.document.getElementById("string-bundle");
	var header = strBundle.getString("firerobot.warn.warn");
	var text = strBundle.getString(propRef);
	promptService.alert(null, header, text);
}

function escapeRobot(text) {
	text = text.replace(/\\/g, "\\\\");
	text = text.replace(/\$\{/g, "\\${");
	text = text.replace(/@\{/g, "\\@{");
	text = text.replace(/%\{/g, "\\%{");
	text = text.replace(/#/g, "\\#");
	return text;
}

function escapeSpace(text) {
	text = text.replace(/\t/g, "\\t");
	text = text.replace(/\s/g, " ");
	text = text.replace(/(\s){2,2}/g, " \\ ");
	text = text.replace(/(\\\s\s)/g, "\\ \\ ");
	text = text.replace(/(\\n\s)/g, "\\n\\ ");
	return text;
}

function getNodeValue(element) {
	var nodeValue = "";
	if (element.childNodes[0]) {
		nodeValue = element.childNodes[0].nodeValue;
	}
	if (nodeValue) {
		nodeValue = nodeValue.trim();
		nodeValue = escapeRobot(nodeValue);
	}
	return nodeValue;
}

function getTextFragments(element) {

	if (element.textFragments) {
		return element.textFragments;
	}

	var cleanClone = getCleanClone(element);
	var textFragments = cleanClone.innerHTML.split(/<[^>]*>/);

	//More sanitizing on the text fragments
	for (var i = 0; i < textFragments.length; i++) {
		textFragments[i] = _replaceHTMLEntities(textFragments[i]);
		textFragments[i] = escapeRobot(textFragments[i]);
		textFragments[i] = textFragments[i].replace(/(\r\n|\n|\r)/gm, "\\n");
		textFragments[i] = textFragments[i].trim();
		textFragments[i] = escapeSpace(textFragments[i]);

		textFragments[i] = textFragments[i].replace(/^((\\n)|(\\t)|\s|\\\s)*/, "");
		textFragments[i] = textFragments[i].replace(/((\\n)|(\\t)|\s|\\\s)*$/, "");

		//Element.textContent will repalace &nbsp; with \u0020 instead of \u00A0. 
		//Bugzilla issue https://bugzilla.mozilla.org/show_bug.cgi?id=359303
		if (textFragments[i].match(/^(&nbsp;){1,}$/)) {
			textFragments.splice(i, 1);
			i--;
			continue;
		}
		var splitTextFragment = textFragments[i].split("&nbsp;");
		if (splitTextFragment.length > 1) {
			textFragments.splice(i, 1, splitTextFragment[0]);
			for (var j = 1; j < splitTextFragment.length; j++) {
				textFragments.splice(i + j, 0, splitTextFragment[j]);
			}
		}
		if (textFragments[i].length === 0 || !(_isPrintable(textFragments[i]))) {
			textFragments.splice(i, 1);
			i--;
			continue;
		}
	}
	//Remove duplicates
	textFragments = textFragments.filter(function(elem, pos) {
		return textFragments.indexOf(elem) == pos;
	});
	element.textFragments = textFragments;
	return textFragments;
}

function getElementText(element) {
	var textFragments = getTextFragments(element);
	var text = textFragments[0];
	for (var i = 1; i < textFragments.length; i++) {
		text += "\\n";
		text += textFragments[i];
	}
	return text;
}

function getElementXPath(element) {
	var tag = _getTag(element);

	if (tag == "body") {
		return ".//body";
	}

	var xpath;
	var txt;
	//We cannot use element.type because of default types that are not explicitly defined 
	//and will not work in xpath
	var type = _getElementType(element);

	if (element.placeholder && element.placeholder !== "") {
		var placeholder = _resolveApostrophes(element.placeholder);
		xpath = ".//" + tag + "[@placeholder=" + placeholder + "]";
	} else if (element.alt && element.alt !== "") {
		var alt = _resolveApostrophes(element.alt);
		xpath = ".//" + tag + "[@alt=" + alt + "]";
	} else if (element.title && element.title !== "") {
		var title = _resolveApostrophes(element.title);
		xpath = ".//" + tag + "[@title=" + title + "]";
	} else if (tag == "input" &&
		(type == "button" || type == "reset" || type == "submit") &&
		element.value &&
		element.value !== "") {
		xpath = ".//input[@value='" + element.value + "']";
	}
	//Check if the element has text

	//Yes, I know that declaring variables here is not good practice.
	//But the alternative would produce too much indentation and worse readability
	//I also don't want to call the function twice
	else if (tag != "SELECT" && (txt = _getXPathText(element)) !== "") {
		xpath = ".//" +
			tag +
			"[contains(normalize-space(.), " +
			_resolveApostrophes(txt) +
			")]";
	} else if ((nearTextElement = getNearTextElement(element)) !== null) {
		//Search for associated labels in the context of the "nearTextElement"
		var LabelText;
		if (nearTextElement.tagName == "LABEL" &&
			nearTextElement.for == element.id &&
			nearTextElement.textContent.length > 0) {
			labelText = _getXPathText(nearTextElement);
			labelText = _resolveApostrophes(labelText);
			xpath = ".//" + tag + "[@id=//label[contains(normalize-space(.)," + labelText + ")]/@for]";
		} else {
			var label = getLabel(element, nearTextElement);
			if (label && label.textContent.length > 0) {
				labelText = _getXPathText(label);
				labelText = _resolveApostrophes(labelText);
				xpath = ".//" + tag + "[@id=//label[contains(normalize-space(.)," + labelText + ")]/@for]";
			}
		}
		//No label found, use the nerTextElement text
		if (!xpath) {
			var nearestText = _getXPathText(nearTextElement);
			xpath = ".//" + _getTag(nearTextElement) +
				"[contains(normalize-space(.)," +
				_resolveApostrophes(nearestText) +
				")]";
			var nearestTextElementXpathIndex = _getElementXPathIndex(nearTextElement, xpath);
			if (nearestTextElementXpathIndex !== "") {
				xpath = "(" + xpath + ")" + nearestTextElementXpathIndex;
			}
			xpath += "/" + nearTextElement.relationship + "::";
			xpath += tag;
		}
	}
	//The element does not have text included or nearby.
	if (!xpath) {
		xpath = ".//" + tag;
	}
	if (xpath && type) {
		xpath += "[@type='" + type + "']";
	}
	var elementXPathIndex = _getElementXPathIndex(element, xpath);
	if (elementXPathIndex !== "") {
		xpath = "(" + xpath + ")" + elementXPathIndex;
	}
	//Robot Framework escaping has to be done after xpath definition. 
	//Remember that escaped xpath will not work outside RF.
	xpath = escapeRobot(xpath);
	return xpath;
}

//We cannot use element.type because of default types that are not explicitly defined 
//and will not work in xpath
function _getElementType(element) {
	var elContainingDocument = element.ownerDocument;
	var xPathResult = elContainingDocument.evaluate("attribute::type", element, null, 0, null);

	var matchedNode = xPathResult.iterateNext();
	if (matchedNode) {
		return matchedNode.value;
	} else {
		return null;
	}
}

function _getElementXPathIndex(element, xpath) {
	var i = 0;
	var index;
	try {
		var elContainingDocument = element.ownerDocument;
		var xPathResult = elContainingDocument.
		evaluate(xpath, elContainingDocument, null, 0, null);
		var matchedNode = xPathResult.iterateNext();
		while (matchedNode) {
			i++;
			if (matchedNode == element) {
				index = i;
			}
			matchedNode = xPathResult.iterateNext();
		}
	} catch (err) {
		//warning("firerobot.warn.no-xpath");
	}
	if (i == 1) {
		return "";
	} else if (index == i) {
		return "[last()]";
	} else {
		if (index === undefined) {
			warning("firerobot.warn.no-xpath");
		}
		return "[" + index + "]";
	}
}

//TODO improve this
function getNearTextElement(element) {
	var parentTextElement;
	var precTextElement;
	var followingTextElement;

	var tempXpath = "(.//" + _getTag(element) + ")";
	tempXpath += _getElementXPathIndex(element, tempXpath);

	parentTextElement = _getParentTextElement(element);
	if (parentTextElement) {
		return parentTextElement;
	} else {
		precTextElement = _getPrecTextElement(element);
		followingTextElement = _getFollowingTextElement(element);
		if (!precTextElement && !followingTextElement) {
			return null;
		} else if (precTextElement && followingTextElement) {
			var elRec = element.getBoundingClientRect();
			var precRec = precTextElement.getBoundingClientRect();
			var follRec = followingTextElement.getBoundingClientRect();
			var precIsAbove = (precRec.bottom < elRec.top);
			var follIsBellow = (follRec.top > elRec.bottom);
			if (precIsAbove && follIsBellow) {
				if ((elRec.top - precRec.bottom) <= (follRec.top - elRec.bottom)) {
					return precTextElement;
				} else {
					return followingTextElement;
				}
			}
			return precTextElement;
		} else {
			if (precTextElement) {
				return precTextElement;
			} else if (followingTextElement) {
				return followingTextElement;
			}
		}
	}
}

function getLabel(input, contextEl) {
	if (!input.id) return null;
	xpath = ".//label[@for='" + input.id + "']";
	var xPathResult = contextEl.ownerDocument.
	evaluate(xpath, contextEl, null, 0, null);
	var matchedNode = xPathResult.iterateNext();
	return matchedNode;
}

function isVisible(element) {
	return element.offsetWidth > 0 || element.offsetHeight > 0;
}

function getOSName() {
	var frWindow = Application.storage.get("frWindow", undefined);
	var appVersion = frWindow.navigator.appVersion;
	var OSName = "Unknown OS";

	if (appVersion.indexOf("Win") != -1) {
		OSName = "Windows";
	} else if (appVersion.indexOf("Mac") != -1) {
		OSName = "MacOS";
	} else if (appVersion.indexOf("Linux") != -1) {
		OSName = "Linux";
	} else if (appVersion.indexOf("X11") != -1) {
		OSName = "UNIX";
	}
	return OSName;
}

function getURL() {
	var browserWindow = windowMediator.getMostRecentWindow("navigator:browser");
	var url = browserWindow.content.location.href;
	url = decodeURIComponent(url);
	return url;
}

//TODO improve
function getCleanClone(element) {
	var clone = element.cloneNode(true);
	for (var i = 0; i < element.childNodes.length; i++) {
		//go recursive
		if (element.childNodes[i].childNodes.length > 0) {
			clone.childNodes[i].outerHTML = getCleanClone(element.childNodes[i]).outerHTML;
		}
		//comments
		if (element.childNodes[i].nodeType === 8) {
			clone.childNodes[i].data = "";
		}
		//hidden elements
		else if ((element.childNodes[i].nodeType !== 3 &&
				!isVisible(element.childNodes[i]) &&
				element.childNodes[i].tagName != "BR") ||
			element.childNodes[i].tagName == "IFRAME" ||
			element.childNodes[i].tagName == "FRAME") {
			clone.childNodes[i].outerHTML = "<!---->";
		}
		//attributes
		else if (element.childNodes[i].nodeType === 2) {
			clone.childNodes[i].nodeValue = "";
		}
	}
	return clone;
}

function _getPrecTextElement(element) {
	var nearestTextElementXpath;
	var elContainingDocument = element.ownerDocument;
	var tempXpath = "(.//" + _getTag(element) + ")";
	tempXpath += _getElementXPathIndex(element, tempXpath);
	for (var i = 0; true; i++) {
		nearestTextElementXpath = "(" +
			tempXpath +
			"/preceding::*[normalize-space(.)!=''][not(@contenteditable and @contenteditable = 'true')])[last() - " +
			i +
			"]";
		var xPathResult = elContainingDocument.
		evaluate(nearestTextElementXpath, elContainingDocument.body, null, 0, null);
		var matchedNode = xPathResult.iterateNext();
		if (!matchedNode) {
			return null;
		} else if (_elTextContainsAlphanum(matchedNode) && isVisible(matchedNode)) {
			matchedNode.relationship = "following";
			return matchedNode;
		}
	}
	return null;
}

function _getFollowingTextElement(element) {
	var nearestTextElementXpath;
	var elContainingDocument = element.ownerDocument;
	var tempXpath = "(.//" + _getTag(element) + ")";
	tempXpath += _getElementXPathIndex(element, tempXpath);
	nearestTextElementXpath = tempXpath + "/following::*[normalize-space(.)!=''][not(@contenteditable and @contenteditable = 'true')]";
	var xPathResult = elContainingDocument.
	evaluate(nearestTextElementXpath, elContainingDocument.body, null, 0, null);
	var matchedNode = xPathResult.iterateNext();
	while (matchedNode) {
		if (_elTextContainsAlphanum(matchedNode) && isVisible(matchedNode)) {
			matchedNode.relationship = "preceding";
			return matchedNode;
		}
		matchedNode = xPathResult.iterateNext();
	}
	return null;
}

//TODO improve this
function _getParentTextElement(element) {
	var nearestTextElementXpath;
	var elContainingDocument = element.ownerDocument;
	var tempXpath = "(.//" + _getTag(element) + ")";
	tempXpath += _getElementXPathIndex(element, tempXpath);
	nearestTextElementXpath = tempXpath + "/parent::*[normalize-space(.)!=''][not(@contenteditable and @contenteditable = 'true')]"; //[" + i + "]";
	var xPathResult = elContainingDocument.
	evaluate(nearestTextElementXpath, elContainingDocument.body, null, 0, null);
	var matchedNode = xPathResult.iterateNext();
	if (!matchedNode) {
		return null;
	} else if (_elTextContainsAlphanum(matchedNode) &&
		isVisible(matchedNode) &&
		matchedNode.textContent.trim() !== element.textContent.trim()) {
		matchedNode.relationship = "child";
		return matchedNode;
	}
	return null;
}

//Adapted from http://razgulyaev.blogspot.pt/2012/07/selenium-2-java-client-how-to-resolve.html#!/2012/07/selenium-2-java-client-how-to-resolve.html
function _resolveApostrophes(str) {
	if (str.indexOf("'") == -1) {
		return "'" + str + "'";
	}
	var sArray = {};
	var finalStr;

	sArray = str.split("'");
	finalStr = "concat(";

	for (var i = 0; i < (sArray.length - 1); i++) {
		finalStr = finalStr + "'" + sArray[i] + "', " + "\"'\", ";
	}

	finalStr = finalStr + "'" + sArray[sArray.length - 1] + "'";
	if (str.lastIndexOf("'") == str.length) {
		finalStr = finalStr + ", \"'\"";
	}
	finalStr = finalStr + ")";

	return finalStr;
}

//TODO do others
function _replaceHTMLEntities(text) {
	text = text.
	replace(/&lt;/g, "<").
	replace(/&gt;/g, ">").
	replace(/&amp;/g, "&").
	replace(/&cent;/g, "¢").
	replace(/&pound;/g, "£").
	replace(/&yen;/g, "¥").
	replace(/&euro;/g, "€").
	replace(/&copy;/g, "©").
	replace(/&reg;/g, "®").
	replace(/&trade;/g, "™").
	replace(/&larr;/g, "?").
	replace(/&uarr;/g, "?").
	replace(/&rarr;/g, "?").
	replace(/&darr;/g, "?").
	replace(/&forall;/g, "?").
	replace(/&part;/g, "?").
	replace(/&exist;/g, "?").
	replace(/&nabla;/g, "?").
	replace(/&isin;/g, "?").
	replace(/&ni;/g, "?").
	replace(/&prod;/g, "?").
	replace(/&sum;/g, "?").
	replace(/&Alpha;/g, "?").
	replace(/&Beta;/g, "?").
	replace(/&Gamma;/g, "G").
	replace(/&Delta;/g, "?").
	replace(/&Epsilon;/g, "?").
	replace(/&Zeta;/g, "?");
	return text;
}

function _getXPathText(element) {

	//TODO check other empty space representations 
	if (!element.innerHTML || element.innerHTML.match(/^(&nbsp;){1,}$/) || element.getAttribute("contenteditable") == "true") {
		return "";
	}
	var elementText = element.innerHTML;
	//TODO find better solution
	//Element.textContent will repalace &nbsp; with \u0020 instead of \u00A0. 
	//Bugzilla issue https://bugzilla.mozilla.org/show_bug.cgi?id=359303
	var guid = "d313ad54-6482-4c26-8c2d-66a3050baeb4";
	elementText = elementText.replace(/(&nbsp;){1,}/g, guid);

	var tmpElement = element.ownerDocument.createElement("div");
	tmpElement.innerHTML = elementText;

	editableXPath = ".//*[@contenteditable = 'true']";
	var xPathResult = element.ownerDocument.
	evaluate(editableXPath, element, null, 0, null);
	var matchedNode = xPathResult.iterateNext();
	if (matchedNode) {
		//Exclude text of children
		elementText = tmpElement.childNodes[0].nodeValue || "";
	} else {
		//Include text of children
		elementText = tmpElement.textContent || "";
	}

	elementText = elementText.trim();

	var splitElementText = elementText.split(guid);
	elementText = "";
	for (var i = 0; i < splitElementText.length; i++) {
		if (splitElementText[i] !== "") {
			elementText = splitElementText[i];
			break;
		}
	}
	elementText = elementText.replace(/(\r\n|\n|\r)/gm, " ");
	elementText = elementText.replace(/\s+/g, " ");
	elementText = _replaceHTMLEntities(elementText);
	//TODO should this be bigger/smaller?
	elementText = elementText.substring(0, 100);

	return elementText;
}

function _elTextContainsAlphanum(element) {
	var elementText = _getXPathText(element);
	var unicodeWord = XRegExp('\\p{L}|\\p{N}');
	return unicodeWord.test(_UTF8.decode(elementText));
}

/**
 *
 *  UTF-8 data encode / decode
 *  http://www.webtoolkit.info/
 *
 **/
var _UTF8 = {
	// public method for url encoding
	encode: function(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	},

	decode: function(utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while (i < utftext.length) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
};

function _arrayContains(needle, arrhaystack) {
	return (arrhaystack.indexOf(needle) > -1);
}

function _getTag(element) {
	var tag = element.tagName.toLowerCase();
	//TODO other situations?
	if (tag == "svg" ||
		tag == "rect" ||
		tag == "circle" ||
		tag == "ellipse" ||
		tag == "line" ||
		tag == "polyline" ||
		tag == "polygon" ||
		tag == "path" ||
		tag == "text" ||
		tag == "g") {
		tag = "*[local-name() = '" + tag + "']";
	}
	return tag;
}

//TODO any other characters?
function _isPrintable(str) {
	var patt = new RegExp(/[^\u200c\u200d\u200e\u200f]+/gm);
	return patt.test(str);
}
var EXPORTED_SYMBOLS = [
	"toggleSelectMode",
	"clearSelections",
	"resetSelectContext"
];

Components.utils.import("chrome://firerobot/content/fr-modules/utils.jsm");
Components.utils.import("chrome://firerobot/content/fr-modules/locators.jsm");


function toggleSelectMode() {
	var selectModeOn = Application.storage.get("selectModeOn", false);
	var frWindow = Application.storage.get("frWindow", undefined);
	var btn = frWindow.document.getElementById("selectButton");

	if (selectModeOn) {
		Application.storage.set("selectModeOn", false);
		resetSelectContext();
		btn.setAttribute("class", "btn");
	} else {
		var oldBrowserWindow = Application.storage.get("browserWindow", undefined);
		var browserWindow = setBrowserWindow();

		if(oldBrowserWindow !== browserWindow) {
			setBrowserIconOff(oldBrowserWindow);
		} 
		setBrowserIconOn(browserWindow);
		var doc = browserWindow.content.document;

		if (!doc.body) {
			warning("firerobot.warn.no-body");
			return;
		}
		Application.storage.set("selectModeOn", true);
		_setSelectContext();
		btn.setAttribute("class", "selectOn");
	}
}

function clearSelections() {
	var frWindow = Application.storage.get("frWindow", undefined);
	var selectedElements = Application.storage.get("selectedElements", undefined);
	for (var i = 0; i < selectedElements.length; i++) {
		try {
			selectedElements[i].isSelected = false;
			selectedElements[i].style.outline = "";
		} catch (error) {
			//Object might be dead due to reload. Do nothing.
		}
	}
	selectedElements = [];
	frWindow.document.getElementById("htmlTextArea").value = "";
	Application.storage.set("selectedElements", selectedElements);
}

function resetSelectContext() {
	var frWindow = Application.storage.get("frWindow", undefined);
	frWindow.document.getElementById("selectButton").setAttribute("class", "btn");
	clearSelections();
	var doc = Application.storage.get("selectContextDoc", undefined);
	if (doc) {
		_removeEventListners(doc);
	}
	var browserWindow = Application.storage.get("selectContextWindow", undefined);
	if (browserWindow) {
		var contextMenu = browserWindow.document.getElementById("contentAreaContextMenu");
		var contextMenuItems = contextMenu.childNodes;
		for (var i = 0; i < contextMenuItems.length; i++) {
			if (contextMenuItems[i].id.substring(0, 11) == "fire-robot-") {
				contextMenuItems[i].hidden = true;
			} else {
				contextMenuItems[i].style.display = "";
			}
		}
	}
	Application.storage.set("selectModeOn", false);
	Application.storage.set("selectContextWindow", undefined);
	Application.storage.set("selectContextDoc", undefined);
}

function _setSelectContext() {

	var browserWindow = Application.storage.get("browserWindow", undefined);
	var doc = browserWindow.content.document;

	Application.storage.set("selectContextWindow", browserWindow);
	Application.storage.set("selectContextDoc", doc);

	_addEventListners(doc);

	var contextMenu = browserWindow.document.getElementById("contentAreaContextMenu");
	var contextMenuItems = contextMenu.childNodes;
	for (var i = 0; i < contextMenuItems.length; i++) {
		if (contextMenuItems[i].id.substring(0, 11) != "fire-robot-") {
			contextMenuItems[i].style.display = "none";
		} else {
			contextMenuItems[i].hidden = false;
		}
	}
}

function _addEventListners(doc) {
	doc.body.style.border = "5px dashed lightBlue";

	doc.addEventListener('click', _selectElement, true);
	doc.addEventListener('mouseover', _overElement, true);
	doc.addEventListener('mouseout', _outElement, true);
	doc.addEventListener('keydown', _keyDown, true);
	doc.addEventListener('mouseup', _blockMouseUpDown, true);
	doc.addEventListener('mousedown', _blockMouseUpDown, true);
	doc.addEventListener('contextmenu', _setContextMenu, true);

	docWindow = doc.defaultView || doc.parentWindow;
	docWindow.addEventListener('unload', resetSelectContext, true);

	//This is the only way I could make the eventListeners to be removed 
	//when the FireRobot window is in float mode.
	Application.storage.set("click", _selectElement);
	Application.storage.set("mouseover", _overElement);
	Application.storage.set("mouseout", _outElement);
	Application.storage.set("keydown", _keyDown);
	Application.storage.set("mouseupdown", _blockMouseUpDown);
	Application.storage.set("contextmenu", _setContextMenu);
	Application.storage.set("unload", resetSelectContext);

	//Go recursive for frames
	var frames = doc.querySelectorAll('iframe, frame');
	for (var i = 0; i < frames.length; i++) {
		var iDoc = frames[i].contentWindow || frames[i].contentDocument;
		if (iDoc.document) {
			iDoc = iDoc.document;
			_addEventListners(iDoc);
		}
	}
}

function _removeEventListners(doc) {
	var _selectElement = Application.storage.get("click", _selectElement);
	var _overElement = Application.storage.get("mouseover", _overElement);
	var _outElement = Application.storage.get("mouseout", _outElement);
	var _keyDown = Application.storage.get("keydown", _keyDown);
	var _blockMouseUpDown = Application.storage.get("mouseupdown", _blockMouseUpDown);
	var _setContextMenu = Application.storage.get("contextmenu", _setContextMenu);
	var _resetSelectContext = Application.storage.get("unload", resetSelectContext);

	doc.body.style.border = "";

	doc.removeEventListener('click', _selectElement, true);
	doc.removeEventListener('mouseover', _overElement, true);
	doc.removeEventListener('mouseout', _outElement, true);
	doc.removeEventListener('keydown', _keyDown, true);
	doc.removeEventListener('mouseup', _blockMouseUpDown, true);
	doc.removeEventListener('mousedown', _blockMouseUpDown, true);
	doc.removeEventListener('contextmenu', _setContextMenu, true);

	docWindow = doc.defaultView || doc.parentWindow;
	docWindow.removeEventListener('unload', _resetSelectContext, true);

	//Go recursive for frames
	var frames = doc.querySelectorAll('iframe, frame');
	for (var i = 0; i < frames.length; i++) {
		var iDoc = frames[i].contentWindow || frames[i].contentDocument;
		if (iDoc.document) {
			iDoc = iDoc.document;
			_removeEventListners(iDoc);
		}
	}
}

function _compareElements(a, b) {
	for (var i = 0; i < a.containerIndexes.length; i++) {
		if (a.containerIndexes[i] < b.containerIndexes[i]) {
			return -1;
		} else if (a.containerIndexes[i] > b.containerIndexes[i]) {
			return 1;
		}
	}
	return 0;
}

function _selectElement(e) {
	if (e.which == 1) {
		e.stopImmediatePropagation();
		e.stopPropagation();
		e.preventDefault();

		var el = e.target;
		//Only allow the body 
		if (el.tagName == "HTML") return;

		var selectedElements = Application.storage.get("selectedElements", undefined);

		if (el.outerHTML.substring(1, el.outerHTML.indexOf(">")).indexOf("xmlns=\"http://www.w3.org/1999/xhtml\"") != -1) {
			warning("firerobot.warn.no-xhtml");
			return;
		}
		if (!el.isSelected) {
			//TODO el.xpath not preserved when element inside frame. Make more efficient.
			if(el.xpath === undefined) el.xpath =  getElementXPath(el);
			var containers = [];
			var containerIndexes = [];
			_getElementContainers(el, containers, containerIndexes);
			el.containers = containers;
			el.containerIndexes = containerIndexes;
			selectedElements.push(el);
			el.style.outline = "dashed blue 2px";
			el.isSelected = true;
		} else {
			el.style.outline = "";
			selectedElements.splice(selectedElements.indexOf(el), 1);
			el.isSelected = false;
		}
		selectedElements.sort(_compareElements);
		_displayHTML();
		Application.storage.set("selectedElements", selectedElements);
	}
}

function _getElementContainers(element, elementContainers,
	elementContainerIndexes) {
	var elContainingDocument = element.ownerDocument;
	var xpath = element.xpath || getElementXPath(element);
	var xPathResult = elContainingDocument.evaluate("count(" +
		xpath +
		"/preceding::*)",
		elContainingDocument,
		null,
		0,
		null);
	elementContainerIndexes.push(xPathResult.numberValue + 1);
	var elContainingWindow = elContainingDocument.defaultView ||
		elContainingDocument.parentWindow;
	if (elContainingWindow.frameElement) {
		elementContainers.push(getLocator(elContainingWindow.frameElement));
		_getElementContainers(elContainingWindow.frameElement,
			elementContainers,
			elementContainerIndexes);
	} else {
		elementContainers.push("top");
		elementContainers.reverse();
		elementContainerIndexes.reverse();
	}
}

function _setContextMenu(e) {
	e.stopImmediatePropagation();
	e.stopPropagation();
	e.preventDefault();
	var selectContextWindow = Application.storage.get("selectContextWindow", null);
	var contextMenu = selectContextWindow.document.getElementById("contentAreaContextMenu");
	contextMenu.openPopupAtScreen(e.screenX, e.screenY, true, e);
}

//TODO Improve HTML display. Use expandable tree.
function _displayHTML() {
	var selectedElementsHTML = "";
	var containerString = "";
	var i;
	var selectedElements = Application.storage.get("selectedElements", undefined);

	if (selectedElements.length !== 0) {
		if (selectedElements[0].containers.length > 1) {
			containerString = "<!--Contained in frame(s): ";
			for (i = 1; i < selectedElements[0].containers.length; i++) {
				containerString += " " + selectedElements[0].containers[i] + ";";
			}
			containerString += " -->\n";
			selectedElementsHTML += containerString;
		}

		selectedElementsHTML += selectedElements[0].originalHTML;
		for (i = 1; i < selectedElements.length; i++) {

			selectedElementsHTML += "\n(...)\n";

			if (selectedElements[i].containers.length > 1) {
				containerString = "<!--Contained in frame(s): ";
				for (var j = 1; j < selectedElements[i].containers.length; j++) {
					containerString += selectedElements[i].containers[j] + ";";
				}
				containerString += " -->\n";
				selectedElementsHTML += containerString;
			}
			selectedElementsHTML += selectedElements[i].originalHTML;
		}
	}
	var frWindow = Application.storage.get("frWindow", undefined);
	var htmlArea = frWindow.document.getElementById("htmlTextArea");
	htmlArea.value = selectedElementsHTML;

	var ti = frWindow.document.getAnonymousNodes(htmlArea)[0].
	childNodes[0];
	ti.scrollTop = ti.scrollHeight;
}

function _overElement(e) {
	e.stopImmediatePropagation();
	e.stopPropagation();
	e.preventDefault();

	var el = e.target;
	if (!el.originalHTML) {
		el.originalHTML = e.target.outerHTML;
	}

	var selectedElements = Application.storage.get("selectedElements", undefined);
	if (selectedElements.indexOf(el) == -1) {
		el.style.outline = "solid lightBlue 2px";
	}
}

function _outElement(e) {
	var selectedElements = Application.storage.get("selectedElements", undefined);
	e.stopImmediatePropagation();
	e.stopPropagation();
	e.preventDefault();
	var el = e.target;
	if (selectedElements.indexOf(el) == -1) {
		el.style.outline = "";
	}
}

function _keyDown(e) {
	e = e || window.event;
	if (e.keyCode == 27) {
		clearSelections();
	} else if (e.ctrlKey && e.altKey && e.keyCode == 83) {
		toggleSelectMode();
	}
}

function _blockMouseUpDown(e) {
	e.stopImmediatePropagation();
	e.stopPropagation();
	e.preventDefault();
}
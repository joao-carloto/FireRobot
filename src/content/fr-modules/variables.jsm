var EXPORTED_SYMBOLS = [
	"createVarName",
	"addVariable",
	"removeVariable",
	"increaseVarIndex",
	"decreaseVarIndex",
	"loadVariables",
	"getVarNameFromValue",
	"setFocusedVarName",
	"updateVarName",
	"varNameExists"
];

Components.utils.import("chrome://firerobot/content/fr-modules/utils.jsm");

Components.utils.import("chrome://firerobot/content/external-modules/xregexp.jsm");


var _Application = Components.classes["@mozilla.org/fuel/application;1"]
	.getService(Components.interfaces.fuelIApplication);

function createVarName(element) {
	var varName;
	if (element.tagName == "INPUT" &&
		element.placeholder &&
		element.placeholder !== "") {
		varName = element.placeholder;
	} else if (element.tagName == "SELECT") {
		var selText = "";
		var nodes = element.parentNode.childNodes;
		for (var i = 0; i < nodes.length; ++i) {
			if (nodes[i].nodeType === 3  && nodes[i].wholeText.trim() !== "") { // 3 means "text"
				selText += nodes[i].wholeText + " ";
			}
		}
		if (selText !== "") {
			varName = selText;
		}
	}
	if (varName == undefined) {
		var nearTextElement = getNearTextElement(element);
		if (nearTextElement) {
			varName = nearTextElement.textContent;
		}
	}
	if (varName !== undefined) {
		varName = varName.toLowerCase();
		varName = varName.trim();
		varName = varName.replace(/\s{1,}/g, "-");
		var regex = new XRegExp("[^\\p{N}\\p{L}-_]", "g");
		varName = XRegExp.replace(varName, regex, "");
		varName = varName.replace(/-{2,}/g, "-").replace(/^-|-$/g, "");
		varName = varName.substring(0, 63);
	} else {
		varName = "var-name";
	}
	var frWindow = _Application.storage.get("frWindow", undefined);
	var rows = frWindow.document.getElementById("varListBox").childNodes;
	for (var i = 0; i < rows.length; i++) {
		if (varNameExists(varName)) {
			varName = varName.replace(/(-*\d*)$/, "");
			varName = varName + "-" + (i + 2);
		} else {
			break;
		}
	}
	return varName;
}

function addVariable(name, value) {
	frWindow = _Application.storage.get("frWindow", undefined);

	varListBox = frWindow.document.getElementById("varListBox");

	var row = frWindow.document.createElement('richlistitem');
	row.setAttribute("class", "varBoxItem");
	row.setAttribute("align", "center");

	var varStartLabel = frWindow.document.createElement('label');
	varStartLabel.setAttribute('value', "${");
	varStartLabel.setAttribute('class', 'varLabel');
	row.appendChild(varStartLabel);

	var nameTextBox = frWindow.document.createElement('textbox');
	nameTextBox.setAttribute('value', name);
	nameTextBox.setAttribute('flex', '1');
	nameTextBox.setAttribute('class', 'testBox');
	nameTextBox.setAttribute('onfocus', 'setFocusedVarName(event);');
	nameTextBox.setAttribute('onchange', 'updateVarName(event);');
	row.appendChild(nameTextBox);

	var varEndLabel = frWindow.document.createElement('label');
	varEndLabel.setAttribute('value', "}   ");
	varEndLabel.setAttribute('class', 'varLabel');
	row.appendChild(varEndLabel);

	var valueTextBox = frWindow.document.createElement('textbox');
	valueTextBox.setAttribute('value', value);
	valueTextBox.setAttribute('flex', '2');
	valueTextBox.setAttribute('class', 'testBox');

	row.appendChild(valueTextBox);
	varListBox.appendChild(row);
	varListBox.ensureElementIsVisible(row);
}

function removeVariable() {
	var frWindow = _Application.storage.get("frWindow", undefined);
	var varListBox = frWindow.document.getElementById("varListBox");
	var selectedItem = varListBox.selectedItem;

	if (selectedItem) {
		var selectedIndex = varListBox.selectedIndex;

		varListBox.removeItemAt(varListBox.selectedIndex);

		if (selectedIndex !== 0) {
			varListBox.selectedIndex = selectedIndex - 1;
		} else if (selectedIndex != varListBox.itemCount) {
			varListBox.selectedIndex = selectedIndex;
		}
		//TODO disable instead of warning.
	} else {
		warning("firerobot.warn.no-var-select");
	}
}

function increaseVarIndex() {
	var frWindow = _Application.storage.get("frWindow", undefined);
	var varListBox = frWindow.document.getElementById("varListBox");
	var selectedItem = varListBox.selectedItem;
	var selectedIndex = varListBox.selectedIndex;
	var itemCount = varListBox.itemCount;

	if (!selectedItem) {
		warning("firerobot.warn.no-var-select");
	} else if (selectedIndex < itemCount - 1) {
		varListBox.removeItemAt(selectedIndex);

		if (selectedIndex < itemCount - 2) {
			varListBox.insertBefore(selectedItem, varListBox.getItemAtIndex(selectedIndex + 1));
		} else {
			varListBox.appendChild(selectedItem);
		}
	}
}

function decreaseVarIndex() {
	var frWindow = _Application.storage.get("frWindow", undefined);
	var varListBox = frWindow.document.getElementById("varListBox");
	var selectedItem = varListBox.selectedItem;
	var selectedIndex = varListBox.selectedIndex;

	if (!selectedItem) {
		warning("firerobot.warn.no-var-select");
	} else if (selectedIndex > 0) {
		varListBox.removeItemAt(selectedIndex);
		varListBox.insertBefore(selectedItem, varListBox.getItemAtIndex(selectedIndex - 1));
	}
}

function loadVariables(str) {
	var frWindow = _Application.storage.get("frWindow", undefined);
	var varListBox = frWindow.document.getElementById("varListBox");
	while (varListBox.firstChild) {
		varListBox.removeChild(varListBox.firstChild);
	}
	var lines = str.split(/\r?\n/);
	for (var i = 0; i < lines.length; i++) {

		if (lines[i].match(/\${.*}/)[0]) {
			var name = lines[i].match(/\${.*}/)[0].replace(/^\${/, "").replace(/}$/, "");
			var value = lines[i].replace(/\s*\${.*}=*\s{2,}/, "");

			this.addVariable(name, value);
		}
	}
}

function getVarNameFromValue(value) {
	var frWindow = _Application.storage.get("frWindow", undefined);
	var rows = frWindow.document.getElementById("varListBox").childNodes;
	for (var i = 0; i < rows.length; i++) {
		if (value == rows[i].childNodes[3].value) {
			return rows[i].childNodes[1].value;
		}
	}
	return null;
}

function setFocusedVarName(event) {
	_Application.storage.set("focusedVarName", event.target.value);
}

function updateVarName(event) {
	//TODO some kind of validation
	var focusedVarName = _Application.storage.get("focusedVarName", undefined);
	var realOldVarName = "${" + focusedVarName + "}";
	var realNewVarName = "${" + event.target.value + "}";
	var frWindow = _Application.storage.get("frWindow", undefined);
	var tests = frWindow.document.getElementById("testCaseTextArea").value;
	var newTests = tests.replace(realOldVarName, realNewVarName, "g");

	frWindow.document.getElementById("testCaseTextArea").value = newTests;
}

function varNameExists(varName) {
	var frWindow = _Application.storage.get("frWindow", undefined);
	var rows = frWindow.document.getElementById("varListBox").childNodes;
	for (var i = 0; i < rows.length; i++) {
		if (varName == rows[i].childNodes[1].value) {
			return true;
		}
	}
	return false;
}
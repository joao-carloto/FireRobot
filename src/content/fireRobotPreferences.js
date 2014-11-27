Components.utils.import("chrome://firerobot/content/fr-modules/utils.jsm");
Components.utils.import("chrome://firerobot/content/fr-modules/locators.jsm");


if (!FireRobot) var FireRobot = {};
if (!FireRobot.Preferences) FireRobot.Preferences = {};


FireRobot.Preferences = {

	enableLocator: function() {
		var disabledLocList = document.getElementById("disabled-locators-list");
		var selectedItem = disabledLocList.selectedItem;

		if (selectedItem) {
			var selectedIndex = disabledLocList.selectedIndex;
			disabledLocList.removeItemAt(selectedIndex);

			var enabledLocList = document.getElementById("enabled-locators-list");

			enabledLocList.insertBefore(selectedItem, enabledLocList.getItemAtIndex(0));

			enabledLocList.selectItem(selectedItem);
			this.updateLocators();
		} else {
			warning("firerobot.warn.select-locator");
		}
	},

	disableLocator: function() {
		var enabledLocList = document.getElementById("enabled-locators-list");
		var selectedItem = enabledLocList.selectedItem;
		var selectedIndex = enabledLocList.selectedIndex;

		if (selectedItem) {
			if (selectedItem.value == "xpath") {
				warning("firerobot.warn.default-loc");
				return;
			}
			enabledLocList.removeItemAt(selectedIndex);

			var disabledLocList = document.getElementById("disabled-locators-list");
			disabledLocList.appendChild(selectedItem);

			this.updateLocators();
		} else {
			warning("firerobot.warn.select-locator");
		}
	},

	increaseLocatorIndex: function() {
		var enabledLocList = document.getElementById("enabled-locators-list");
		var selectedItem = enabledLocList.selectedItem;
		var selectedIndex = enabledLocList.selectedIndex;
		var itemCount = enabledLocList.itemCount;

		if (!selectedItem) {
			warning("firerobot.warn.select-locator");
		} else if (selectedIndex < itemCount - 1) {
			enabledLocList.removeItemAt(selectedIndex);
			if (selectedIndex < itemCount - 2) {
				enabledLocList.insertBefore(selectedItem, enabledLocList.getItemAtIndex(selectedIndex + 1));
			} else {
				enabledLocList.appendChild(selectedItem);
			}
			enabledLocList.selectItem(selectedItem);

			this.updateLocators();
		}
	},

	decreaseLocatorIndex: function() {
		var enabledLocList = document.getElementById("enabled-locators-list");
		var selectedItem = enabledLocList.selectedItem;
		var selectedIndex = enabledLocList.selectedIndex;

		if (!selectedItem) {
			warning("firerobot.warn.select-locator");
		} else if (selectedIndex > 0) {

			enabledLocList.removeItemAt(selectedIndex);

			enabledLocList.insertBefore(selectedItem, enabledLocList.getItemAtIndex(selectedIndex - 1));

			enabledLocList.selectItem(selectedItem);

			this.updateLocators();
		}
	},

	updateLocators: function() {
		var i;
		var enabledLocPreferences = "";
		var enabledLocList = document.getElementById("enabled-locators-list");

		if (enabledLocList.itemCount > 0) {

			enabledLocPreferences = enabledLocList.getItemAtIndex(0).value;

			for (i = 1; i < enabledLocList.itemCount; i++) {
				enabledLocPreferences += "," + enabledLocList.getItemAtIndex(i).
				value;
			}
		}
		document.getElementById("pref-enabled-locators").value = enabledLocPreferences;
	},

	loadLocatorListBoxes: function() {
		var enabledLocPreferences;
		var disabledLocPreferences;

		enabledLocPreferences = prefService.getCharPref("extensions.firerobot.enabled-locators");
		enabledLocPreferences = enabledLocPreferences.split(",");
		disabledLocPreferences = this.getDisabledLocPrefsFromEnabled(
			enabledLocPreferences);

		var enabledLocList = document.getElementById("enabled-locators-list");

		var disabledLocList = document.getElementById("disabled-locators-list");

		var appendedItem;

		var i;

		if (enabledLocPreferences[0] !== "") {
			for (i = 0; i < enabledLocPreferences.length; i++) {
				if (enabledLocPreferences[i] == "xpath") {
					appendedItem = enabledLocList.appendItem("text based xpath");
				} else {
					appendedItem = enabledLocList.appendItem(enabledLocPreferences[i]);
				}
				appendedItem.value = enabledLocPreferences[i];
				appendedItem.setAttribute('class', 'prefItem');
			}
		}

		if (disabledLocPreferences[0] !== "") {
			for (i = 0; i < disabledLocPreferences.length; i++) {
				if (disabledLocPreferences[i] == "xpath") {
					appendedItem = disabledLocList.appendItem("text based xpath");
				} else {
					appendedItem = disabledLocList.appendItem(disabledLocPreferences[i]);
				}
				appendedItem.value = disabledLocPreferences[i];
				appendedItem.setAttribute('class', 'prefItem');
			}
		}


		//css pseudoclass :focus will not work, ence the following code
		enabledLocList.addEventListener('select', function() {
			var previousSelEnable = Application.storage.get("selectedEnabledLocator", undefined);
			if (previousSelEnable) {
				previousSelEnable.setAttribute('class', 'prefItem');
			}
			var previousSelDisable = Application.storage.get("selectedDisabledLocator", undefined);
			if (previousSelDisable) {
				previousSelDisable.setAttribute('class', 'prefItem');
				Application.storage.set("selectedDisabledLocator", undefined);
			}
			var selectedItem = enabledLocList.selectedItem;
			if (selectedItem) {
				Application.storage.set("selectedEnabledLocator", selectedItem);
				selectedItem.setAttribute('class', 'prefItemSelected');
			}
		}, true);

		disabledLocList.addEventListener('select', function() {
			var previousSelDisable = Application.storage.get("selectedDisabledLocator", undefined);
			if (previousSelDisable) {
				previousSelDisable.setAttribute('class', 'prefItem');
			}
			var previousSelEnable = Application.storage.get("selectedEnabledLocator", undefined);
			if (previousSelEnable) {
				previousSelEnable.setAttribute('class', 'prefItem');
				Application.storage.set("selectedEnabledLocator", undefined);
			}
			var selectedItem = disabledLocList.selectedItem;
			if (selectedItem) {
				Application.storage.set("selectedDisabledLocator", selectedItem);
				selectedItem.setAttribute('class', 'prefItemSelected');
			}
		}, true);
	},


	getDisabledLocPrefsFromEnabled: function(enabledLocPreferences) {
		//TODO put this on locators.jsm?
		var allLocPrefs = [
			"id",
			"name",
			"href",
			"link",
			"alt",
			"src",
			"value",
			"label",
			"index",
			"xpath"
		];

		var disabledLocPreferences = [];

		for (var i = 0; i < allLocPrefs.length; i++) {
			if (enabledLocPreferences.indexOf(allLocPrefs[i]) == -1) {
				disabledLocPreferences.push(allLocPrefs[i]);
			}
		}
		return disabledLocPreferences;
	}
};
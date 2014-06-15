FireRobot
=========

WHAT IS FIREROBOT?

FireRobot is a tool that allows you to create Robot Framework/Selenium tests, in a more efficient way.
Keyword driven testing is in the far end of the spectrum from record and play tools, as far as test automation concerns. 
Although this tool has some features in common with record and play tools, it's interest lies in some specific features that will help you to create high level custom keywords, based on the Selenium2library:
- Bulk selection of elements and creation of test steps in an adaptative way.
- Filling and verification of forms based on their current state.
- Easy preference definition for the page element locators.
- Element localization thru automatically generated XPath, based on an element's own text or text of a nearby element.
- Automatic creation of variables based on the content of text fields.

HOW TO USE FIREROBOT?
- Toggle the select button.">
- The active web page will get a dashed border, along with any included frames or iframes.
- Click to select page elements of interest.
- Right-click the page under testing to access the keyword context menu.
- Select the menu options and test steps will be added.
- Use the ESC key to clear the selections, while keeping the selection mode on.
- To fill and check forms you may select any element that includes the form elements of interest, not necessarily the form element.
- For frame related keywords you may select an element that includes the frame of interest or any element inside the frame.
- Use the settings window to change the locator preferences and the options for variable creation and usage."
- You may reference resource files, with high level keywords, in the *Settings* section. Make shure you use the full path.

Disclaimer: This tool is being released publicly because it is believed to have reached a stage where it can be helpful. However, it is still a 'young' application, with some known (and possibly unknown) limitations. 
Please provide feedback at the FireRobot GitHub page. 
Bugs, new features, small improvements, all are welcome. They will be addressed when possible.
A couple of relevant known issues are:
- The 'Run Test Suite' button will only work in Windows (for now).
- There might be situations where the extension will be unable to create a valid XPath expression or suggest a variable name.

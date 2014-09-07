FireRobot
=========

WHAT IS FIREROBOT?

FireRobot is a Firefox extension that allows you to create Robot Framework/Selenium tests, in a more efficient way. Check the demonstration video at <strong><a href='http://youtu.be/uzRwY6xkTC0' target='_blank'>YouTube</a></strong> or keep reading.

Keyword driven testing is in the far end of the spectrum from record and play tools, as far as test automation concerns. 
Although this tool has some features in common with record and play tools, it's interest lies in some specific features that will help you to create high level custom keywords, based on the Selenium2library:
- Bulk selection of elements and creation of test steps in an adaptative way.
- Filling and verification of forms based on their current state.
- Easy preference definition for the page element locators.
- Element localization thru automatically generated XPath, based on an element's own text or text of a nearby element.
- Automatic creation of variables based on the content of text fields.


HOW TO INSTALL FIREROBOT?

- Go to the releases page (https://github.com/joao-carloto/FireRobot/releases).
- Get the firerobot.xpi file.
- Drag it over a window of your Firefox browser.
- Confirm the installation (you will have trust me on this being safe, the reason why this is not in the official Mozilla repository is explained <a href="https://forums.mozilla.org/addons/viewtopic.php?f=21&t=19759">here</a>).
- Restart the browser.
- You may start the extension at the Developer menu.
- For more convenience drag the FireRobot icon from the "Customize" menu onto the browser toolbar.


HOW TO USE FIREROBOT?

- Toggle the select button.
- The active web page will get a dashed border, along with any included frames or iframes.
- Click to select page elements of interest.
- Right-click the page under testing to access the keyword context menu.
- Select the menu options and test steps will be added.
- Use the ESC key to clear the selections, while keeping the selection mode on.
- To fill and check forms you may select any element that includes the form elements of interest, not necessarily the form element.
- For frame related keywords you may select an element that includes the frame of interest or any element inside the frame.
- Use the settings window to change the locator preferences and the options for variable creation and usage.
- You may reference resource files, with high level keywords, in the *Settings* section. Make sure you use the full path.
- You may use any RF standard library (OperatingSystem, String, etc). Just include it on the *Settings* section.
- To run the current test script just click on the play button.
- The test script can be saved to a .txt or .robot file and reused later, on FireRobot or another IDE. In Linux, or Mac OS X, you must explicitly use one of these extensions when naming the test file. In Windows, .txt will be used by default, if none is indicated explicitly.
- Mac OS X users must open the test report manually, after the test is run.


Disclaimer: This tool is being released publicly because it is believed to have reached a stage where it can be helpful. However, it is still a 'young' application, with some known (and possibly unknown) limitations.
Please provide feedback at https://github.com/joao-carloto/FireRobot/issues. 
Bugs, new features, small improvements, all are welcome. They will be addressed when possible.

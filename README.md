FireRobot
=========

<strong>WARNING!</strong> This extension will not work from Firefox 47 onward. This is due to the deprecation and removal of the FUEL library. Current alternatives to this library would not support the full range of functionality that this extension currently provides.
<br/>
Also, the extension current implementation makes it incompatible with the Firefox signing system. Basically, once you run a test from the extension, a file is written into the extension folder and the signature becomes invalid.
<br/>
If you still want to use this extension I advise to downgrade to Firefox 45 or lower and disable signature verification by going to about:config and setting xpinstall.signatures.required to false. Details can be found here: https://wiki.mozilla.org/Add-ons/Extension_Signing. Beware that this change will impact the verification of all installed extensions.

WHAT IS FIREROBOT?

FireRobot is a Firefox extension that allows you to create Robot Framework/Selenium tests, in a more efficient way. 
Check the demonstration videos on YouTube or keep reading:
<ul>
<li><a href='http://youtu.be/uzRwY6xkTC0' target='_blank'>Generic demonstration</a></li>
<li><a href='https://www.youtube.com/watch?v=-yNYXSyOCKg' target='_blank'>Keyword extraction</a></li>
</ul>

Keyword driven testing is in the far end of the spectrum from record and play tools, as far as test automation concerns. 
Although this tool has some features in common with record and play tools, it's interest lies in some specific features that will help you to create high level custom keywords, based on the Selenium2library:
- Bulk selection of elements and creation of test steps in an adaptative way.
- Filling and verification of forms based on their current state.
- Easy preference definition for the page element locators.
- Element localization thru automatically generated XPath, based on an element's own text or text of a nearby element.
- Automatic creation of variables based on the value of inputs.


HOW TO INSTALL FIREROBOT?

- Get the reviewed and signed installer at https://addons.mozilla.org/en-US/firefox/addon/firerobot/
- You may start the extension at the Developer menu.
- For more convenience drag the FireRobot icon from the "Customize" menu onto the browser toolbar.


HOW TO USE FIREROBOT?

- Toggle the select button (shortcut keys Alt + Z).
- The active web page will get a dashed border, along with any included frames or iframes.
- Click to select page elements of interest.
- Right-click the page under testing to access the keyword context menu.
- Select the menu options and test steps will be added.
- Use the ESC key to clear the selections, while keeping the selection mode on.
- To fill and check forms you may select any element that includes the form elements of interest, not necessarily the form element.
- For frame related keywords you may select an element that includes the frame of interest or any element inside the frame.
- Use the preferences window to change the locator preferences and the options for variable creation and usage.
- You may select resource files and automatically add its path to the *Settings* section.
- You may select a group of test steps and automatically convert them to a new keyword that will be added to a resource file.
- To run the current test script just click on the play button. You must have the <a href='http://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#installation-instructions' target='_blank'>Robot Framework</a> and the <a href='https://github.com/rtomac/robotframework-selenium2library#installation' target='_blank'>Selenium2Library</a> installed. To help the installation you might want to use this <a href='http://joao-carloto.github.io/RF_Install_Script/' target='_blank'>script</a>.
- The test script can be saved to a .txt or .robot file and reused later, on FireRobot or another IDE. In Linux, or Mac OS X, you must explicitly use one of these extensions when naming the test file. In Windows, .txt will be used by default, if none is indicated explicitly.
- Linux and Mac OS X users must open the test report manually, after the test is run.


Disclaimer: This tool is being released publicly because it is believed to have reached a stage where it can be helpful. However, most of it was written when the author should be sleeping, and it was not submitted to exhaustive testing.
If you feel this project might be helpful to you, please contribute by providing feedback at https://github.com/joao-carloto/FireRobot/issues. 
Bugs, new features, small improvements, all are welcome. They will be addressed when possible.

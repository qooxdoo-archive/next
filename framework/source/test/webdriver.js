/**
 * Runs the unit tests in a browser using WebDriver and dumps the results
 * in TAP stream format, e.g. for CI (Jenkins et al.)
 *
 * // TODO: Turn this into a Grunt task
 */
var webDriver = require('webdriver-sync');
var fs = require('fs');

var args = process.argv;
var autUri = args[2];
var serverUri = args[3];

if (!autUri || !serverUri) {
  var hint = args[0] + " " + args[1] + "http://application.under.test http://my.webdriver.server:4321/wd/hub";
  var message = "Incomplete arguments! Usage example:\n" + hint;
  throw new Error(message);
}

var capabilities = args[4];
if (capabilities) {
  capabilities = JSON.parse(capabilities);
}

var desiredCapabilities = new webDriver.DesiredCapabilities().firefox();
for (var key in capabilities) {
  desiredCapabilities.setCapability(key, capabilities[key]);
}

driver = new webDriver.RemoteWebDriver(serverUri, desiredCapabilities);
driver.manage().window().maximize();
driver.get(autUri);

webDriver.wait(function() {
  return driver.executeScript("return window.testsDone");
}, { timeout: 500000, period: 1000 }); // TODO: option for timeout

var tap = driver.executeScript("return window.tap");
fs.writeFileSync('result.tap', tap); // TODO: option for results file. Default: console.log

driver.quit();
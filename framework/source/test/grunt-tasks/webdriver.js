'use strict';
/**
 * Runs the unit tests in a browser using WebDriver and dumps the results
 * in TAP stream format, e.g. for CI (Jenkins et al.)
 */
var webDriver = require('webdriver-sync');
var fs = require('fs');

module.exports = function(grunt) {
  grunt.registerTask('webdriver', 'Runs the unit tests in a browser using WebDriver', function() {
    var opts = this.options();

    var autUri = grunt.option('autUri') || opts.autUri;
    if (!autUri) {
      grunt.fail.fatal('Missing --autUri argument.');
    }

    var serverUri = grunt.option('serverUri') || opts.serverUri;
    if (!serverUri) {
      grunt.fail.fatal('Missing --serverUri argument.');
    }

    var capabilities = grunt.option('capabilities');
    if (capabilities) {
      capabilities = JSON.parse(capabilities);
    } else {
      capabilities = opts.capabilities;
    }

    var desiredCapabilities = (new webDriver.DesiredCapabilities()).firefox();
    for (var key in capabilities) {
      desiredCapabilities.setCapability(key, capabilities[key]);
    }

    var driver = new webDriver.RemoteWebDriver(serverUri, desiredCapabilities);
    driver.manage().window().maximize();
    driver.get(autUri);

    var tap;
    try {
      var clientEnv = driver.executeScript('return [qxWeb.env.get("browser.name"), qxWeb.env.get("browser.version"), qxWeb.env.get("os.name"), qxWeb.env.get("os.version")]');
      grunt.verbose.writeln('Executing tests in ' + clientEnv[0] + ' ' + clientEnv[1] + ' on ' + clientEnv[2] + ' ' + clientEnv[3]);

      var timeout = grunt.option('timeout') || opts.timeout;
      webDriver.wait(function() {
        return driver.executeScript('return window.testsDone');
      }, { timeout: timeout, period: 1000 });

      grunt.verbose.writeln('Test suite finished, collecting results.');
      tap = driver.executeScript('return window.tap');
    } catch(ex) {
      grunt.fail.fatal(ex);
    } finally {
      driver.quit();
    }

    var filename = grunt.option('filename') || opts.filename;
    if (filename) {
      grunt.verbose.writeln('Writing TAP results to file ' + filename);
      fs.writeFileSync(filename, tap);
    } else {
      grunt.verbose.writeln('No results file name configured, writing TAP results to console.\n');
      grunt.log.write(tap);
    }
  });

};
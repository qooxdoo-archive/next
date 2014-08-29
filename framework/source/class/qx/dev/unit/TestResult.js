"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)
     * Daniel Wagner (d_wagner)

************************************************************************ */

/**
 * The test result class runs the test functions and fires events depending on
 * the result of the test run.
 */
qx.Bootstrap.define("qx.dev.unit.TestResult",
{
  extend : Object,
  include : [qx.event.MEmitter],


  events :
  {
    /**
     * Fired before the test is started
     *
     * Event data: The test {@link qx.dev.unit.TestFunction}
     */
    startTest : "qx.dev.unit.TestFunction",

    /** Fired after the test has finished
     *
     * Event data: The test {@link qx.dev.unit.TestFunction}
     */
    endTest   : "qx.dev.unit.TestFunction",

    /**
     * Fired if the test raised an {@link qx.core.AssertionError}
     *
     * Event data: The test {@link qx.dev.unit.TestFunction}
     */
    error     : "qx.dev.unit.TestFunction",

    /**
     * Fired if the test failed with a different exception
     *
     * Event data: The test {@link qx.dev.unit.TestFunction}
     */
    failure   : "qx.dev.unit.TestFunction",

    /**
     * Fired if an asynchronous test sets a timeout
     *
     * Event data: The test {@link qx.dev.unit.TestFunction}
     */
    wait   : "qx.dev.unit.TestFunction",

    /**
     * Fired if the test was skipped, e.g. because a requirement was not met.
     *
     * Event data: The test {@link qx.dev.unit.TestFunction}
     */
    skip : "qx.dev.unit.TestFunction",

    /**
     * Fired if a performance test returned results.
     *
     * Event data: The test {@link qx.dev.unit.TestFunction}
     */
    endMeasurement : "qx.dev.unit.TestFunction"
  },






  statics :
  {
    /**
     * Run a test function using a given test result
     *
     * @param testResult {TestResult} The test result to use to run the test
     * @param test {TestSuite|TestFunction} The test
     * @param testFunction {var} The test function
     */
    run : function(testResult, test, testFunction) {
      testResult.run(test, testFunction);
    }
  },


  members :
  {

    _timeout : null,

    /**
     * Run the test
     *
     * @param test {TestSuite|TestFunction} The test
     * @param testFunction {Function} The test function
     * @param self {Object?} The context in which to run the test function
     * @param resume {Boolean?} Resume a currently waiting test
     */
    run : function(test, testFunction, self, resume)
    {
      if(!this._timeout) {
        this._timeout = {};
      }

      var testClass = test.testClass;
      if (!testClass.hasListener("assertionFailed")) {
        testClass.on("assertionFailed", function(data) {
          var error = [{
            exception : data,
            test      : test
          }];
          this.emit("failure", error);
        }, this);
      }

      if (resume && !this._timeout[test.getFullName()]) {
        this._timeout[test.getFullName()] = "failed";
        var qxEx = new qx.type.BaseError("Error in asynchronous test", "resume() called before wait()");
        this._createError("failure", [qxEx], test);
        this.emit("endTest", test);
        return;
      }

      this.emit("startTest", test);

      if (qx.core.Environment.get("qx.debug.dispose")) {
        qx.dev.Debug.startDisposeProfiling();
      }

      if (this._timeout[test.getFullName()])
      {
        if (this._timeout[test.getFullName()] !== "failed") {
          window.clearTimeout(this._timeout[test.getFullName()]);
        }
        delete this._timeout[test.getFullName()];
      }
      else
      {
        try {
          test.setUp();
        }
        catch(ex)
        {
          try {
            this.tearDown(test);
          }
          catch(except) {
            /* Any exceptions here are likely caused by setUp having failed
               previously, so we'll ignore them. */
          }

          if (ex.classname == "qx.dev.unit.RequirementError") {
            this._createError("skip", [ex], test);
            this.emit("endTest", test);
          }
          else {
            if (ex instanceof qx.type.BaseError &&
              ex.message == qx.type.BaseError.DEFAULTMESSAGE)
            {
              ex.message = "setUp failed";
            }
            else {
              ex.message = "setUp failed: " + ex.message;
            }
            this._createError("error", [ex], test);
            this.emit("endTest", test);
          }

          return;
        }
      }

      try {
        testFunction.call(self || window);
      }
      catch(ex)
      {
        var error = true;
        if (ex instanceof qx.dev.unit.AsyncWrapper)
        {

          if (this._timeout[test.getFullName()]) {
            // Do nothing if there's already a timeout for this test
            return;
          }

          if (ex.delay) {
            var that = this;
            var defaultTimeoutFunction = function() {
              throw new qx.core.AssertionError(
                "Asynchronous Test Error",
                "Timeout reached before resume() was called."
              );
            };
            var timeoutFunc = (ex.deferredFunction ? ex.deferredFunction : defaultTimeoutFunction);
            var context = (ex.context ? ex.context : window);
            this._timeout[test.getFullName()] = window.setTimeout(function() {
               this.run(test, timeoutFunc, context);
            }.bind(that), ex.delay);
            this.emit("wait", test);
          }

        } else if (ex instanceof qx.dev.unit.MeasurementResult) {
          error = false;
          this._createError("endMeasurement", [ex], test);
        } else {
          try {
            this.tearDown(test);
          } catch(except) {}
          if (ex.classname == "qx.core.AssertionError") {
            this._createError("failure", [ex], test);
            this.emit("endTest", test);
          } else if (ex.classname == "qx.dev.unit.RequirementError") {
            this._createError("skip", [ex], test);
            this.emit("endTest", test);
          } else {
            this._createError("error", [ex], test);
            this.emit("endTest", test);
          }
        }
      }

      if (!error)
      {
        try {
          this.tearDown(test);
          this.emit("endTest", test);
        } catch(ex) {
          if (ex instanceof qx.type.BaseError &&
            ex.message == qx.type.BaseError.DEFAULTMESSAGE)
          {
            ex.message = "tearDown failed";
          }
          else {
            ex.message = "tearDown failed: " + ex.message;
          }

          this._createError("error", [ex], test);
          this.emit("endTest", test);
        }
      }
    },


    /**
     * Fire an error event
     *
     * @param eventName {String} Name of the event
     * @param exceptions {Error[]} The exception(s), which caused the test to fail
     * @param test {TestSuite|TestFunction} The test
     */
    _createError : function(eventName, exceptions, test)
    {
      var errors = [];
      for (var i=0,l=exceptions.length; i<l; i++) {
        // WebKit and Opera
        errors.push({
          exception : exceptions[i],
          test      : test
        });
      }

      this.emit(eventName, errors);
    },


    /**
     * Calls the generic tearDown method on the test class, then the specific
     * tearDown for the test, if one is defined.
     *
     * @param test {Object} The test object (first argument of {@link #run})
     */
    tearDown : function(test)
    {
      test.tearDown();
      var testClass = test.testClass;
      var specificTearDown = "tearDown" + qx.lang.String.firstUp(test.name);
      if (testClass[specificTearDown]) {
        testClass[specificTearDown]();
      }

      if (qx.core.Environment.get("qx.debug.dispose")
        && qx.dev.Debug.disposeProfilingActive)
      {
        var testName = test.getFullName();
        var undisposed = qx.dev.Debug.stopDisposeProfiling();
        for (var i=0; i<undisposed.length; i++) {
          var trace;
          if (undisposed[i].stackTrace) {
            trace = undisposed[i].stackTrace.join("\n");
          }
          window.top.qx.log.Logger.warn("Undisposed object in " + testName + ": "
          + undisposed[i].object.classname + "[" + undisposed[i].object.toHashCode()
          + "]" + "\n" + trace);
        }
      }
    }
  }
});

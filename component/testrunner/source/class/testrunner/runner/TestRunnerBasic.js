"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Daniel Wagner (d_wagner)

************************************************************************ */

/**
 * The TestRunner is responsible for loading the test classes and keeping track
 * of the test suite's state.
 *
 */
qx.Bootstrap.define("testrunner.runner.TestRunnerBasic", {

  extend : qx.event.Emitter,
  include : qx.data.MBinding,

  statics :
  {
    /**
     * Load test suite defined by testrunner.define()
     */
    start : function()
    {
      var init = qx.core.Init ? qx.core.Init : qx.core.BaseInit;
      var runner = init.getApplication().runner;
      runner._loadExternalTests();
      if (typeof runner.view.toggleAllTests == "function") {
        runner.view.toggleAllTests(true);
      }
    }
  },

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */
  construct : function()
  {
    if (qx.core.Environment.get("qx.globalErrorHandling")) {
      qx.event.GlobalError.setErrorHandler(this._handleGlobalError, this);
    }

    // Create view
    this.__testsInView = [];
    var viewSetting = qx.core.Environment.get("testrunner.view");
    var viewClass = qx.Bootstrap.getByName(viewSetting);

    if (qx.core.Environment.get("testrunner.performance")) {
      // qx.Class.include(viewClass, testrunner.view.MPerformance); TODO
    }

    this.view = new viewClass();

    // Connect view and controller
    this.view.on("runTests", this._runTests, this);

    this.view.on("stopTests", this._stopTests, this);
    this.bind("testSuiteState", this.view, "testSuiteState");
    this.bind("testCount", this.view, "testCount");
    this.bind("testModel", this.view, "testModel");
    qx.data.SingleValueBinding.bind(this.view, "selectedTests", this, "selectedTests");

    this._origin = qx.core.Environment.get("testrunner.testOrigin");
    this._testNameSpace = this._getTestNameSpace();

    this._loadTests();
  },


  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /** Current state of the test suite */
    testSuiteState :
    {
      init : "init",
      //check : [ "init", "loading", "ready", "running", "finished", "aborted", "error" ],
      event : true
    },

    /** Number of tests that haven't run yet */
    testCount :
    {
      init : null,
      nullable : true,
      check : "Number",
      event : true
    },

    /** Model object representing the test namespace. */
    testModel :
    {
      init : null,
      nullable : true,
      event : true
    },

    /** List of tests selected by the user */
    selectedTests :
    {
      nullable : true,
      init : null,
      apply : "_applySelectedTests"
    }
  },


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    _origin : null,
    loader : null,
    _testParts : null,
    __testsInView : null,
    _testNameSpace : null,
    _externalTestClasses : 0,


    /**
     * Returns the configured base namespace of the current test suite
     * @return {String} Test namespace
     */
    _getTestNameSpace : function()
    {
      // Test namespace set by URI parameter
      if (typeof location !== "undefined" && location.search) {
        var params = location.search;
        if (params.indexOf("testclass=") > 0 ) {
          return params.substr(params.indexOf("testclass=") + 10);
        }
      }
      return qx.core.Environment.get("qx.testNameSpace");
    },


    /**
     * Deletes the current test suite so a new one can be loaded
     */
    _resetSuite : function()
    {
      if (this.loader) {
        this.loader.dispose();
        this.loader = null;
      }

      this._externalTestClasses = 0;
      this.testModel = null;
      this.__testsInView = [];
    },


    /**
     * Loads the test suite
     */
    _loadTests : function()
    {
      var origin = qx.core.Environment.get("testrunner.testOrigin");
      switch(origin) {
        case "external":
          break;
        default:
          this._loadInlineTests(this._testNameSpace);
      }
    },


    /**
     * Loads test classes that are a part of the TestRunner application.
     *
     * @param nameSpace {String|Object} Test namespace to be loaded
     */
    _loadInlineTests : function(nameSpace)
    {
      this.testSuiteState = ("loading");
      this.loader = new qx.dev.unit.TestLoaderBasic(nameSpace);
      this._wrapAssertions();
      this._getTestModel();
    },


    /**
     * Creates a test class from the given members map and adds it to the suite
     * @param membersMap {map} Map containing the class members (test methods etc.)
     */
    _addTestClass : function(membersMap)
    {
      if (qx.core.Environment.get("qx.debug")) {
        qx.core.Assert.assertMap(membersMap);
      }
      this.testSuiteState = ("loading");

      this._externalTestClasses += 1;
      var testNameSpace = this._testNameSpace;
      var prefix = "test";

      var testClassName;
      if (membersMap.classname) {
        testClassName = membersMap.classname;
        testClassName = prefix + "." + testClassName;

        if (testClassName.indexOf(testNameSpace) !== 0) {
          return;
        }

        delete membersMap.classname;
      }
      else {
        testClassName = prefix + ".Test" + (this._externalTestClasses);
      }
      var testClass = this._defineTestClass(testClassName, membersMap);

      if (this.loader) {
        this.loader.getSuite().add(testClass);
      }
      else {
        this.loader = new qx.dev.unit.TestLoaderBasic(testNameSpace);
      }
    },


    /**
     * Creates a test class from the given members map
     *
     * @param testClassName {String} Fully qualified name for the test class
     * @param membersMap {map} Map containing the class members (test methods etc.)
     * @return {qx.Class} Configured test class
     */
    _defineTestClass : function(testClassName, membersMap)
    {
      var qxClass = qx.Class;
      return qxClass.define(testClassName,
      {
        extend : qx.dev.unit.TestCase,
        members : membersMap
      });
    },


    /**
     * Create a test class from the given definition and add it to the model
     *
     * @param membersMap {Map} "members" section for the new test class
     */
    define : function(membersMap)
    {
      this._addTestClass(membersMap);
      this._getTestModel();
    },

    /**
     * Create a new test suite from the class definitions in
     * window.testrunner.testDefinitions
     *
     * @ignore(testrunner.testDefinitions.*)
     */
    _loadExternalTests : function()
    {
      this._resetSuite();

      if (window.testrunner.testDefinitions instanceof Array) {
        for (var i=0,l=testrunner.testDefinitions.length; i<l; i++) {
          this._addTestClass(testrunner.testDefinitions[i]);
        }
        window.testrunner.testDefinitions = [];
        if (this.loader) {
          //FIXME: Assertion wrapping causes weird errors
          //this._wrapAssertions();
          this._getTestModel();
        }
      }
    },

    /**
     * Returns the loader's test representation object
     *
     * @return {Object} Test representation
     */
    __getTestRep : function()
    {
      var testRep = this.loader.getTestDescriptions();
      if (!testRep) {
        this.error("Couldn't get test descriptions from loader!");
        return null;
      }
      return qx.lang.Json.parse(testRep);
    },


    /**
     * Constructs a model of the test suite from the loader's test
     * representation data
     */
    _getTestModel : function()
    {
      if (this.currentTestData) {
        this.currentTestData = null;
        delete this.currentTestData;
      }
      var oldModel = this.testModel;
      if (oldModel) {
        this.testModel.dispose();
        this.__testsInView = [];
      }
      this.testModel = null;

      var testRep = this.__getTestRep();
      if (!testRep || testRep.length === 0 ||
        (testRep.length === 1 && testRep[0].tests.length === 0))
      {
        this.testSuiteState = ("error");
        return;
      }
      var modelData = testrunner.runner.ModelUtil.createModelData(testRep);
      var delegate = {
        getModelSuperClass : function(properties) {
          return testrunner.runner.TestItem;
        }
      };
      var marshal = new qx.data.marshal.Json(delegate);
      marshal.toClass(modelData.children[0], true);
      var model = marshal.toModel(modelData.children[0]);
      testrunner.runner.ModelUtil.addDataFields(model);
      this.testModel = model;
      this.testSuiteState = ("ready");
    },


    /**
     * Wraps all assert* methods included in qx.dev.unit.TestCase in try/catch
     * blocks. For each caught exception, a data event containing the Error
     * object will be fired on the test class. This allows the Testrunner to
     * mark the test as failed while any code following an assertion call will
     * still be executed. Aborting the test execution whenever an assertion
     * fails has caused some extremely hard to debug problems in the qooxdoo
     * framework unit tests in the past.
     *
     * Doing this in the Testrunner application is a temporary solution: It
     * really should be done in qx.dev.unit.TestCase, but that would break
     * backwards compatibility with the existing testrunner component. Once
     * testrunner has fully replaced testrunner, this code should be moved.
     *
     * @param autWindow {DOMWindow?} The test application's window. Default: The
     * Testrunner's window.
     */
    _wrapAssertions : function(autWindow)
    {
      var win = autWindow || window;
      var tCase = win.qx.dev.unit.TestCase.prototype;
      for (var prop in tCase) {
        if ((prop.indexOf("assert") == 0 || prop === "fail") &&
            typeof tCase[prop] == "function") {
          // store original assertion func
          var originalName = "__" + prop;
          tCase[originalName] = tCase[prop];
          // create wrapped assertion func
          var body = 'var argumentsArray = qx.lang.Array.fromArguments(arguments);'
            + 'try {'
            + 'this[arguments.callee.originalName].apply(this, argumentsArray);'
            + '} catch(ex) {'
            + 'this.emit("assertionFailed", ex);'
            + '}';

          // need to use the AUT window's Function since IE 6/7/8 can't catch
          // exceptions from other windows.
          tCase[prop] = new win.Function(body);
          tCase[prop].originalName = originalName;
        }
      }
    },


    /**
     * Run the selected tests
     */
    _runTests : function() {
      if (this.testSuiteState === "aborted") {
        this.testSuiteState = "ready";
      }
      this.runTests();
    },


    /**
     * Stop executing tests
     */
    _stopTests : function() {
      this.testSuiteState = "aborted";
    },


    /**
     * Runs all tests in the list.
     */
    runTests : function()
    {
      var self = this;
      var suiteState = this.testSuiteState;
      switch (suiteState) {
        case "loading":
          this.__testsInView = [];
          break;
        case "ready":
        case "finished":
          if (this.testList.length > 0) {
            this.testSuiteState = ("running");
          } else {
            return;
          }
          break;
        case "aborted":
        case "error":
          return;
      }

      if (this.testList.length == 0) {
        window.setTimeout(function() {
          self.testSuiteState = ("finished");
          self.exit();
        }, 250);
        return;
      }

      var currentTest = this.currentTestData = this.testList.shift();
      currentTest.state = undefined;
      this.testCount = (this.testList.length);
      var className = currentTest.parent.fullName;
      var functionName = currentTest.name;
      var testResult = this.__initTestResult(currentTest);

      window.setTimeout(function() {
        self.loader.runTests(testResult, className, functionName);
      }, 5);
    },


    /**
     * Terminates the Java VM
     */
    exit : function()
    {
      if (qx.core.Environment.get("runtime.name") == "rhino") {
        java.lang.System.exit(0);
      }
    },


    /**
     * Returns a new instance of the class that executes the tests
     *
     * @return {qx.dev.unit.TestResult} TestResult instance
     */
    _getTestResult : function()
    {
      return new qx.dev.unit.TestResult();
    },


    /**
     * Creates the TestResult object that will run the actual test functions.
     * @return {qx.dev.unit.TestResult} The configured TestResult object
     */
    __initTestResult : function()
    {
      var testResult = this._getTestResult();

      testResult.on("startTest", function(test) {
        if (this.currentTestData) {
          if (this.currentTestData.fullName === test.getFullName() &&
              this.currentTestData.state == "wait")
          {
            // test is in wait state, don't add it to the view again
            this.currentTestData.state = (this.currentTestData.previousState || "start");
            return;
          }
          else {
            // test was executed before, clear old exceptions
            this.currentTestData.exceptions = [];
          }
        }

        if (!qx.lang.Array.contains(this.__testsInView, this.currentTestData.fullName)) {
          this.view.addTestResult(this.currentTestData);
          this.__testsInView.push(this.currentTestData.fullName);
        }
      }, this);

      testResult.on("wait", this._onTestWait, this);

      testResult.on("failure", this._onTestFailure, this);

      testResult.on("error", this._onTestError, this);

      testResult.on("skip", this._onTestSkip, this);

      testResult.on("endTest", this._onTestEnd, this);

      testResult.on("endMeasurement", this._onTestEndMeasurement, this);

      return testResult;
    },


    /**
     * Sets the "wait" state for async tests
     *
     * @param ev {qx.event.type.Data} "wait" event
     */
    _onTestWait : function(ev)
    {
      this.currentTestData.state = ("wait");
    },


    /**
     * Records any (assertion) exceptions that caused a test to fail
     *
     * @param ev {qx.event.type.Data} "failure" event
     */
    _onTestFailure : function(data)
    {
      this.__addExceptions(this.currentTestData, data);

      if (this.currentTestData.state === "failure") {
        this.currentTestData.state = undefined;
      }
      this.currentTestData.state = "failure";
    },


    /**
     * Records any unexpected exceptions that occurred during test execution
     *
     * @param ev {qx.event.type.Data} "error" event
     */
    _onTestError : function(data)
    {
      this.__addExceptions(this.currentTestData, data);

      if (this.currentTestData.state === "error") {
        this.currentTestData.state = undefined;
      }
      this.currentTestData.state = ("error");
    },


    /**
     * Records any exceptions that caused a test to be skipped
     *
     * @param ev {qx.event.type.Data} "skip" event
     */
    _onTestSkip : function(data)
    {
      this.__addExceptions(this.currentTestData, data);

      if (this.currentTestData.state === "skip") {
        this.currentTestData.state = undefined;
      }
      this.currentTestData.state = ("skip");
    },


    /**
     * Starts the next test
     *
     * @param ev {qx.event.type.Data} "endTest" event
     */
    _onTestEnd : function(ev)
    {
      var state = this.currentTestData.state;
      if (state == "start") {
        this.currentTestData.state = ("success");
      }

      qx.event.Timer.once(this.runTests, this, 0);
    },


    /**
     * Records any exceptions that occurred during a performance test
     *
     * @param ev {qx.event.type.Data} "endMeasurement" event
     */
    _onTestEndMeasurement : function(data)
    {
      this.__addExceptions(this.currentTestData, data);

      var url = qx.core.Environment.get("testrunner.reportPerfResultUrl");
      if (url) {
        var measureData = data[0].exception.getData();
        measureData.testname = this.currentTestData.getFullName();
        measureData.browsername = qx.core.Environment.get("browser.name");
        measureData.browserversion = qx.core.Environment.get("browser.version");
        measureData.osname = qx.core.Environment.get("os.name") || "unknown";
        measureData.osversion = qx.core.Environment.get("os.version") || "unknown";

        var parsedUri = qx.util.Uri.parseUri(location.href);
        if (parsedUri.queryKey && parsedUri.queryKey.branch) {
          measureData.branch = parsedUri.queryKey.branch;
        }

        url += "?" + qx.util.Uri.toParameter(measureData, false);
        var req = new qx.bom.request.Script();
        req.open("GET", url);
        req.send();
      }
    },

    /**
     * Adds exception information to an existing Test Item object, making sure
     * no duplicates are recorded.
     *
     * @param testItem {testrunner.runner.TestItem} Test item object
     * @param exceptions {Object[]} List of exception objects
     */
    __addExceptions : function(testItem, exceptions)
    {
      var oldEx = testItem.exceptions;
      var newEx = oldEx.concat();

      for (var i=0,l=exceptions.length; i<l; i++) {
        var newExMsg = exceptions[i].exception.toString();
        var dupe = false;
        for (var j=0,m=oldEx.length; j<m; j++) {
          var oldExMsg = oldEx[j].exception.toString();
          if (newExMsg === oldExMsg) {
            dupe = true;
            break;
          }
        }
        if (!dupe) {
          newEx.push(exceptions[i]);
        }
      }
      testItem.exceptions = newEx;
    },


    /**
     * Sets the list of pending tests to those selected by the user.
     *
     * @param value {String[]} Selected tests
     * @param old {String[]} Previous value
     */
    _applySelectedTests : function(value, old)
    {
      if (!value) {
        return;
      }
      if (old) {
        old.off("change", this._onChangeTestSelection, this);
      }
      value.on("change", this._onChangeTestSelection, this);
      this._onChangeTestSelection();
    },


    /**
     * Sets the pending test list and count according to the selection
     */
    _onChangeTestSelection : function() {
      this.testList = this._getFlatTestList();
      // Make sure the value is applied even if it didn't change so the view is
      // updated
      if (this.testList.length == this.testCount) {
        this.testCount = undefined;
      }
      this.testCount = (this.testList.length);
    },


    /**
     * Returns an array containing all "test" children of the current test
     * selection
     *
     * @return {Object[]} Test array
     */
    _getFlatTestList : function()
    {
      var selection = this.selectedTests;
      if (selection.length == 0) {
        return new qx.data.Array();
      }

      var testList = [];
      for (var i=0,l=selection.length; i<l; i++) {
        var item = selection.getItem(i);
        var testsFromItem = testrunner.runner.ModelUtil.getItemsByProperty(item, "type", "test");
        testList = testList.concat(testsFromItem);
      }
      return testList;
    },


    /**
     * Logs any errors caught by qooxdoo's global error handling.
     *
     * @param ex{Error} Caught exception
     */
    _handleGlobalError : function(ex)
    {
      qx.log.Logger.error(ex);
    },

    dispose : function()
    {
      this.view.off("runTests", this._runTests, this);
      this.view.off("stopTests", this._stopTests, this);
      this.removeAllBindings();
      if (this.testModel) {
        this.testModel.dispose();
      }
      this._disposeArray("testsInView");
      this._disposeArray("testList");
      this._disposeArray("testPackageList");
      this._disposeObjects("view", "currentTestData", "loader");
      this.base(qx.core.Object, "dispose");
    }

  }

});

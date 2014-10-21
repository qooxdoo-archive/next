/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2010 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

************************************************************************ */

describe("dev.StackTrace", function() {


  afterEach(function() {
    qx.dev.StackTrace.FILENAME_TO_CLASSNAME = null;
    qx.dev.StackTrace.FORMAT_STACKTRACE = null;
  });


  it("GetStackTraceFromError", function() {
    if (!qx.core.Environment.get("ecmascript.error.stacktrace")) {
      skip("Test skipped since the client doesn't provide stack traces");
    }
    var trace = [];
    try {
      throw new Error("Expected exception");
    } catch (ex) {
      trace = qx.dev.StackTrace.getStackTraceFromError(ex);
    }
    assert.notEqual(0, trace.length, "No stack trace information returned!");
  });


  it("GetStackTraceFromErrorQx", function() {
    if (!qx.core.Environment.get("ecmascript.error.stacktrace")) {
      skip("Test skipped since the client doesn't provide stack traces");
    }
    var qxErrorClasses = [qx.type.BaseError, qx.dev.unit.RequirementError];
    for (var i = 0, l = qxErrorClasses.length; i < l; i++) {
      var cls = qxErrorClasses[i];
      var e = new cls();
      try {
        throw e;
      } catch (ex) {
        var trace = qx.dev.StackTrace.getStackTraceFromError(ex);
        assert.notStrictEqual(0, trace.length, "Didn't get stack trace from " + cls.toString());
      }
    }
  });


  it("FilenameConverterDefault", function() {

    var ex = new Error("Just a test");
    var stack = qx.dev.StackTrace.getStackTraceFromError(ex);
    for (var i = 0, l = stack.length; i < l; i++) {
      assert.match(stack[i], /((?:test\.dev\.StackTrace)|(?:dev\.unit)|(?:testrunner\.js)|(?:tests\.js))/);
    }
  });


  it("FilenameConverterCustom", function() {
    var converter = function(fileName) {
      assert.isString(fileName);
      return "FOO";
    };

    qx.dev.StackTrace.FILENAME_TO_CLASSNAME = qx.lang.Function.bind(converter, this);
    var ex = new Error("Just a test");
    var stack = qx.dev.StackTrace.getStackTraceFromError(ex);
    for (var i = 0, l = stack.length; i < l; i++) {
      assert.match(stack[i], /FOO/);
    }
  });


  it("FormatStackTrace", function() {
    var formatter = function(trace) {
      assert.isArray(trace);
      for (var i = 0, l = trace.length; i < l; i++) {
        trace[i] = "BAR " + trace[i];
      }
      return trace;
    };

    qx.dev.StackTrace.FORMAT_STACKTRACE = qx.lang.Function.bind(formatter, this);
    var ex = new Error("Just a test");
    var stack = qx.dev.StackTrace.getStackTraceFromError(ex);
    for (var i = 0, l = stack.length; i < l; i++) {
      assert.match(stack[i], /^BAR/);
    }
  });
});

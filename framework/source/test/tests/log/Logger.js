/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)

************************************************************************ */
describe("log.Logger", function() {

  var TEST_CONSTANT = "abc";

  beforeEach(function() {
    qx.log.appender.Native.SILENT = true;
    __initialLogLevel = qx.log.Logger.getLevel();
  });


  afterEach(function() {
    qx.log.appender.Native.SILENT = false;
    qx.log.Logger.setLevel(__initialLogLevel);
  });


  function __testLogException(exception) {
    var appender = new qx.log.appender.RingBuffer();

    qx.log.Logger.setLevel("debug");
    qx.log.Logger.clear();
    qx.log.Logger.register(appender);

    qx.log.Logger.debug(exception);

    var events = appender.getAllLogEvents();
    assert.equal(1, events.length);

    if (qx.core.Environment.get("ecmascript.error.stacktrace")) {
      if (exception instanceof Error || qx.core.Environment.get("engine.name") !== "gecko") {
        assert(events[0].items[0].trace.length > 0);
      }
    }

    qx.log.Logger.unregister(appender);
  }


  it("LogException", function() {
    var exception = newException();
    __testLogException(exception);
  });


  it("LogDOMException", function() {
    var exception = newDOMException();
    __testLogException(exception);
  });


  it("KonstantDeprecation", function() {
    // call the method to see if its not throwing an error
    qx.log.Logger.deprecatedConstantWarning(
      this, "abc"
    );

    assert.equal("abc", TEST_CONSTANT);
  });


  it("ContextObject", function() {
    var appender = new qx.log.appender.RingBuffer();

    qx.log.Logger.setLevel("debug");
    qx.log.Logger.clear();
    qx.log.Logger.register(appender);

    qx.log.Logger.debug(Object, "m1");
    qx.log.Logger.debug(qxWeb(), "m2");

    var events = appender.getAllLogEvents();
    assert.equal(qxWeb, events[1].clazz);

    qx.log.Logger.unregister(appender);
  });


  function newException() {
    var exc;
    try {
      throw new Error();
    } catch (e) {
      exc = e;
    }
    return exc;
  }


  function newDOMException() {
    var exc;
    try {
      document.body.appendChild(null);
    } catch (e) {
      exc = e;
    }
    return exc;
  }

});

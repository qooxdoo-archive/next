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

describe("log.RingBuffer", function ()
{

  beforeEach (function ()
  {
    __initialLogLevel = qx.log.Logger.getLevel();
  });

  afterEach (function ()
  {
    qx.log.Logger.setLevel(__initialLogLevel);
  });


 it("Log", function() {
      var appender = new qx.log.appender.RingBuffer();

      qx.log.Logger.setLevel("debug");
      qx.log.Logger.clear();
      qx.log.Logger.register(appender);
      qx.log.Logger.debug("test");

      var events = appender.getAllLogEvents();
      assert.equal(1, events.length);
      assert.equal("test", events[0].items[0].text);

      qx.log.Logger.unregister(appender);
  });


  it("ExceedMaxMessages", function() {
      var appender = new qx.log.appender.RingBuffer(2);

      for (var i=0; i<10; i++) {
        appender.process({index: i});
      }

      var events = appender.getAllLogEvents();
      assert.equal(2, events.length);
      assert.equal(8, events[0].index);
      assert.equal(9, events[1].index);
  });


  it("RetrieveLogEvents", function() {
      var appender = new qx.log.appender.RingBuffer(6);

      for (var i=0; i<10; i++)
      {
        var event = {
          index: i
        };
        appender.process(event);
      }

      var events = appender.retrieveLogEvents(5);
      assert.equal(5, events.length);
      assert.equal(5, events[0].index);
      assert.equal(9, events[4].index);
  });


  it("ClearHistory", function() {
      var appender = new qx.log.appender.RingBuffer();
      appender.process({});
      assert.equal(1, appender.getAllLogEvents().length);

      appender.clearHistory();
      assert.equal(0, appender.getAllLogEvents().length);

  });
});

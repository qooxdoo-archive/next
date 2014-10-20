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
     * Martin Wittemann (martinwittemann)
     * Fabian Jakobs (fjakobs)

************************************************************************ */
/**
 * @require(qx.util.ColorUtil)
 */
describe("core.Assert", function ()
{

  it("CSSColor", function() {
      // working
      qx.core.Assert.assertCssColor("red", "red");
      qx.core.Assert.assertCssColor("black", "black");
      qx.core.Assert.assertCssColor("aqua", "rgb(0,255,255)");
      qx.core.Assert.assertCssColor("rgb(159,123,147)", "rgb(159,123,147)");

      // not working
      assert.throw(function() {
        qx.core.Assert.assertCssColor("red", true);
      }, qx.core.AssertionError, null, "1");

      assert.throw(function() {
        qx.core.Assert.assertCssColor("red", "reed");
      }, qx.core.AssertionError, null, "2");

      assert.throw(function() {
        qx.core.Assert.assertCssColor("red", "rgb(15,45,56)");
      }, qx.core.AssertionError, null, "3");

      // non existing color
      assert.throw(function() {
        qx.core.Assert.assertCssColor("grey", "grey");
      }, Error, null, "4");
  });

  it("AssertElement", function() {
      // working
      qx.core.Assert.assertElement(document.body);
      qx.core.Assert.assertElement(document.createElement("div"));

      // not working
      assert.throw(function() {
        qx.core.Assert.assertElement("test");
      }, qx.core.AssertionError, null, "1");

      assert.throw(function() {
        qx.core.Assert.assertElement({});
      }, qx.core.AssertionError, null, "2");

      assert.throw(function() {
        qx.core.Assert.assertElement(true);
      }, qx.core.AssertionError, null, "2");

      assert.throw(function() {
        qx.core.Assert.assertElement(window);
      }, qx.core.AssertionError, null, "4");

  });

  it("AssertArgumentsCount", function() {
      assert.throw(function() {
        var f = function(a, b) {
          qx.core.Assert.assertArgumentsCount(arguments, 2, 2);
        };
        f("1", "2", "3", "4", "5");
      }, qx.core.AssertionError, /but found '5' arguments\./g);
  });

  it("AssertEventFired", function() {
      //  assertEventFired : function(obj, event, invokeFunc, listenerFunc, msg)
      var obj = new qx.event.Emitter();

       qx.core.Assert.assertEventFired(obj, "xyz", function() {
        obj.emit("xyz");
      });

      assert.throw(function() {
        qx.core.Assert.assertEventFired(obj, "xyz", function() {
          obj.emit("xyz1");
        });
      }, qx.core.AssertionError);

  });
});

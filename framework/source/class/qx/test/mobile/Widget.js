/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

qx.Class.define("qx.test.mobile.Widget",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testCreate : function()
    {
      var widget = new qx.ui.mobile.Widget();
      widget.setAttribute("id", "affe");
      this.getRoot().append(widget);

      var element = document.getElementById("affe");
      this.assertElement(element);

      widget.dispose();
    },


    testSetCssClass : function()
    {
      var widget = new qx.ui.mobile.Widget();

      this.getRoot().append(widget);

      var element = widget[0];

      var className = qx.bom.element.Class.get(element);
      this.assertEquals(className, "");

      widget.defaultCssClass = "affe";
      className = qx.bom.element.Class.get(element);
      this.assertEquals(className, "affe");

      widget.defaultCssClass = "bar";
      className = qx.bom.element.Class.get(element);
      this.assertEquals(className, "bar");

      widget.dispose();
    },


    testAddRemoveCssClass : function()
    {
      var widget = new qx.ui.mobile.Widget();
      this.getRoot().append(widget);

      var element = widget[0];

      var className = qx.bom.element.Class.get(element);
      this.assertEquals(className, "");

      widget.addClass("affe");
      this.assertTrue(widget.hasClass("affe"));

      widget.removeClass("affe");
      this.assertFalse(widget.hasClass("affe"));

      widget.dispose();
    },


    testAutoId : function()
    {
      var widget1 = new qx.ui.mobile.Widget();
      var widget2 = new qx.ui.mobile.Widget();

      var idPrefix = qx.ui.mobile.Widget.ID_PREFIX;
      var id1 = widget1.getAttribute("id").replace(idPrefix, "");
      var id2 = widget2.getAttribute("id").replace(idPrefix, "");

      // check that the id's are next to each other
      this.assertEquals(parseInt(id1), parseInt(id2) - 1);

      widget1.dispose();
      widget2.dispose();
    },


    testWidgetRegistration : function()
    {
      var widget = new qx.ui.mobile.Widget();
      this.getRoot().append(widget);

      widget = qx.ui.mobile.Widget.getWidgetById(widget.getAttribute("id"));
      this.assertQxMobileWidget(widget);

      widget.dispose();
    },


    testDispose : function()
    {
      var widget = new qx.ui.mobile.Widget();

      var id = widget.getAttribute("id");
      widget.dispose();
      widget = qx.ui.mobile.Widget.getWidgetById(id);
      this.assertUndefined(widget);
      var element = document.getElementById(id);
      this.assertNull(element);
    },


    testVisibility : function()
    {
      var widget = new qx.ui.mobile.Widget();
      this.getRoot().append(widget);

      this.__assertShow(widget);

      widget.exclude();
      this.assertNotEquals("visible", widget.visibility, "Exclude: Widget should not be visible");
      this.assertEquals("excluded", widget.visibility, "Exclude: Widget should be excluded");
      this.assertTrue(widget.hasClass("exclude"), "Exclude: No exclude class set");
      this.assertEquals("visible", widget.getStyle("visibility"), "Exclude: Visibility style should be null");

      widget.show();
      this.__assertShow(widget);

      widget.hide();
      this.assertNotEquals("visible", widget.visibility, "Hide: Widget should not be visible");
      this.assertFalse(widget.visibility === "excluded", "Hide: Widget should not be excluded");
      this.assertEquals("hidden", widget.visibility, "Hide: Widget should be hidden");
      this.assertTrue(widget[0].offsetWidth > 0, "Hide: Widget should be seeable");
      this.assertEquals("block", widget.getStyle("display"), "Hide: Display style should be block");
      this.assertFalse(widget.hasClass("exclude"), "Hide: Exclude class set");
      this.assertEquals("hidden", widget.getStyle("visibility"), "Hide: Visibility style should be hidden");

      widget.show();
      this.__assertShow(widget);

      widget.dispose();
    },


    __assertShow : function(widget) {
      this.assertEquals("visible", widget.visibility, "Show: Widget should be visible");
      this.assertNotEquals("excluded", widget.visibility, "Show: Widget should not be excluded");
      this.assertNotEquals("hidden", widget.visibility, "Show: Widget should not be hidden");
      this.assertTrue(widget[0].offsetWidth > 0, "Show: Widget should be seeable");
      this.assertEquals("block", widget.getStyle("display"), "Show: Display style should be block");
      this.assertFalse(widget.hasClass("exclude"), "Hide: Exclude class set");
      this.assertEquals("visible", widget.getStyle("visibility"), "Show: Visibility style should be visible");
    },

    testEnabled : function()
    {
      var widget = new qx.ui.mobile.Widget();
      this.getRoot().append(widget);

      this.assertEquals(true,widget.enabled);
      this.assertFalse(qx.bom.element.Class.has(widget[0],'disabled'));

      widget.enabled = false;
      this.assertEquals(false,widget.enabled);
      this.assertEquals(true,qx.bom.element.Class.has(widget[0],'disabled'));

      this.assertEquals('none', qx.bom.element.Style.get(widget[0],'pointerEvents'));

      widget.dispose();

      widget = new qx.ui.mobile.Widget();
      this.getRoot().append(widget);

      widget.enabled = true;
      widget.anonymous = true;
      this.assertFalse(qx.bom.element.Class.has(widget[0],'disabled'));
      this.assertEquals('none', qx.bom.element.Style.get(widget[0],'pointerEvents'));

      widget.enabled = false;
      this.assertEquals(true,qx.bom.element.Class.has(widget[0],'disabled'));
      this.assertEquals('none', qx.bom.element.Style.get(widget[0],'pointerEvents'));

      widget.enabled = true;
      this.assertEquals('none', qx.bom.element.Style.get(widget[0],'pointerEvents'));

      widget.dispose();
    },

    testInitWidget : function() {
      var el1 = document.createElement("div");
      el1.setAttribute("data-qx-widget", "qx.ui.mobile.Widget");
      this.getRoot()[0].appendChild(el1);

      var el2 = document.createElement("div");
      el2.setAttribute("data-qx-widget", "qx.ui.mobile.Widget");
      this.getRoot()[0].appendChild(el2);

      qx.ui.mobile.Widget.initWidgets();

      this.assertInstance(el1.$$widget, qx.ui.mobile.Widget);
      this.assertInstance(el2.$$widget, qx.ui.mobile.Widget);
    },

    testInitWidgetSelector : function() {
      var el1 = document.createElement("div");
      el1.setAttribute("data-qx-widget", "qx.ui.mobile.Widget");
      this.getRoot()[0].appendChild(el1);

      var el2 = document.createElement("div");
      el2.setAttribute("class", "foo");
      el2.setAttribute("data-qx-widget", "qx.ui.mobile.Widget");
      this.getRoot()[0].appendChild(el2);

      qx.ui.mobile.Widget.initWidgets(".foo");

      this.assertUndefined(el1.$$widget);
      this.assertInstance(el2.$$widget, qx.ui.mobile.Widget);
    },

    testInitWidgetFunction : function() {
      var el1 = document.createElement("div");
      this.getRoot()[0].appendChild(el1);

      var el2 = document.createElement("div");
      el2.affe = true;
      el2.setAttribute("data-qx-widget", "qx.ui.mobile.Widget");
      this.getRoot()[0].appendChild(el2);

      qx.ui.mobile.Widget.initWidgets(function(el) {
        return !!el2.affe;
      });

      this.assertUndefined(el1.$$widget);
      this.assertInstance(el2.$$widget, qx.ui.mobile.Widget);
    },

    testRestoreInstance : function() {
      var widget = new qx.ui.mobile.Widget();
      widget.setAttribute("id", "affe");
      this.getRoot().append(widget);

      var element = document.getElementById("affe");
      this.assertEquals(widget, qxWeb(element));

      widget.dispose();
    },

    _testAddedChild : function(invokeFunc) {
      var child = new qx.ui.mobile.Widget();
      this.assertEventFired(this.getRoot(),
        "addedChild",
        invokeFunc.bind(this,child),
        function(newChild) {
          this.assertEquals(child, newChild);
        }.bind(this)
      );
    },

    testAddedChildAppend : function() {
      this._testAddedChild(function(child) {
        this.getRoot().append(child);
      });
    },

    testAddedChildAppendAt : function() {
      this._testAddedChild(function(child) {
        this.getRoot().appendAt(child, 0);
      });
    },

    testAddedChildInsertAfter : function() {
      var sibling = new qx.ui.mobile.Widget();
      this.getRoot().append(sibling);
      this._testAddedChild(function(child) {
        child.insertAfter(sibling);
      });
    },

    testAddedChildInsertBefore : function() {
      var sibling = new qx.ui.mobile.Widget();
      this.getRoot().append(sibling);
      this._testAddedChild(function(child) {
        child.insertBefore(sibling);
      });
    },

    testAddedChildAfter : function() {
      var sibling = new qx.ui.mobile.Widget();
      this.getRoot().append(sibling);
      this._testAddedChild(function(child) {
        sibling.after(child);
      });
    },

    testAddedChildBefore : function() {
      var sibling = new qx.ui.mobile.Widget();
      this.getRoot().append(sibling);
      this._testAddedChild(function(child) {
        sibling.before(child);
      });
    },

    testAddedChildAppendTo : function() {
      this._testAddedChild(function(child) {
        child.appendTo(this.getRoot());
      });
    },

    testRemovedChildRemove : function() {
      var child = new qx.ui.mobile.Widget();
      this.getRoot().append(child);
      this.assertEventFired(this.getRoot(),
        "removedChild",
        function() {
          child.remove();
        }.bind(this),
        function(removedChild) {
          this.assertEquals(child, removedChild);
        }.bind(this)
      );
    },

    testRemovedChildEmpty : function() {
      var child = new qx.ui.mobile.Widget();
      this.getRoot().append(child);
      this.assertEventFired(this.getRoot(),
        "removedChild",
        function() {
          this.getRoot().empty();
        }.bind(this),
        function(removedChildren) {
          this.assertInArray(child, removedChildren);
        }.bind(this)
      );
    }
  }
});

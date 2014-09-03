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

qx.Bootstrap.define("qx.test.mobile.core.Widget",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testCreate : function()
    {
      var widget = new qx.ui.mobile.core.Widget();
      widget.setAttribute("id", "affe");
      this.getRoot().append(widget);

      var element = document.getElementById("affe");
      this.assertElement(element);

      widget.dispose();
    },


    testSetCssClass : function()
    {
      var widget = new qx.ui.mobile.core.Widget();

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
      var widget = new qx.ui.mobile.core.Widget();
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
      var widget = new qx.ui.mobile.core.Widget();
      this.getRoot().append(widget);

      var clazz =  qx.ui.mobile.core.Widget;
      // decrement is 2 when qx.core.Environment.get("qx.debug.dispose") because the _root is recreated on every test,
      // and it is a widget too
      var decrement = qx.core.Environment.get("qx.debug.dispose") ? 2 : 1;
      var id = clazz.ID_PREFIX + (clazz.getCurrentId() - decrement);
      var element = document.getElementById(id);
      this.assertElement(element);

      this.assertEquals(id, widget.getAttribute("id"));

      widget.dispose();
    },


    testWidgetRegistration : function()
    {
      var widget = new qx.ui.mobile.core.Widget();

      widget = qx.ui.mobile.core.Widget.getWidgetById(widget.getAttribute("id"));
      this.assertQxMobileWidget(widget);

      widget.dispose();
    },


    testWidgetRegistrationSameId : function()
    {
      var widget = new qx.ui.mobile.core.Widget();
      widget.setAttribute("id", "affe");

      if (qx.core.Environment.get("qx.debug"))
      {
        this.assertException(function() {
          var widget2 = new qx.ui.mobile.core.Widget();
          widget2.setAttribute("id", "affe");
        });
      }

      widget.dispose();
    },


    testDispose : function()
    {
      var widget = new qx.ui.mobile.core.Widget();

      var id = widget.getAttribute("id");
      widget.dispose();
      widget = qx.ui.mobile.core.Widget.getWidgetById(id);
      this.assertUndefined(widget);
      var element = document.getElementById(id);
      this.assertNull(element);
    },


    testVisibility : function()
    {
      var widget = new qx.ui.mobile.core.Widget();
      this.getRoot().append(widget);

      this.__assertShow(widget);

      widget.exclude();
      this.assertFalse(widget.isVisible(), "Exclude: Widget should not be visible");
      this.assertTrue(widget.isExcluded(), "Exclude: Widget should be excluded");
      this.assertTrue(widget.isHidden(), "Exclude: Widget should be hidden");
      this.assertTrue(widget.hasClass("exclude"), "Exclude: No exclude class set");
      this.assertEquals("visible", widget.getStyle("visibility"), "Exclude: Visibility style should be null");

      widget.show();
      this.__assertShow(widget);

      widget.hide();
      this.assertFalse(widget.isVisible(), "Hide: Widget should not be visible");
      this.assertFalse(widget.isExcluded(), "Hide: Widget should not be excluded");
      this.assertTrue(widget.isHidden(), "Hide: Widget should be hidden");
      this.assertTrue(widget.isSeeable(), "Hide: Widget should be seeable");
      this.assertEquals("block", widget.getStyle("display"), "Hide: Display style should be block");
      this.assertFalse(widget.hasClass("exclude"), "Hide: Exclude class set");
      this.assertEquals("hidden", widget.getStyle("visibility"), "Hide: Visibility style should be hidden");

      widget.show();
      this.__assertShow(widget);

      widget.dispose();
    },


    __assertShow : function(widget) {
      this.assertTrue(widget.isVisible(), "Show: Widget should be visible");
      this.assertFalse(widget.isExcluded(), "Show: Widget should not be excluded");
      this.assertFalse(widget.isHidden(), "Show: Widget should not be hidden");
      this.assertTrue(widget.isSeeable(), "Show: Widget should be seeable");
      this.assertEquals("block", widget.getStyle("display"), "Show: Display style should be block");
      this.assertFalse(widget.hasClass("exclude"), "Hide: Exclude class set");
      this.assertEquals("visible", widget.getStyle("visibility"), "Show: Visibility style should be visible");
    },

    testEnabled : function()
    {
      var widget = new qx.ui.mobile.core.Widget();
      this.getRoot().append(widget);

      this.assertEquals(true,widget.enabled);
      this.assertFalse(qx.bom.element.Class.has(widget[0],'disabled'));

      widget.enabled = false;
      this.assertEquals(false,widget.enabled);
      this.assertEquals(true,qx.bom.element.Class.has(widget[0],'disabled'));

      this.assertEquals('none', qx.bom.element.Style.get(widget[0],'pointerEvents'));

      widget.dispose();

      widget = new qx.ui.mobile.core.Widget();
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
      el1.setAttribute("data-qx-widget", "qx.ui.mobile.core.Widget");
      this.getRoot()[0].appendChild(el1);

      var el2 = document.createElement("div");
      el2.setAttribute("data-qx-widget", "qx.ui.mobile.core.Widget");
      this.getRoot()[0].appendChild(el2);

      qx.ui.mobile.core.Widget.initWidgets();

      this.assertInstance(el1.$$widget, qx.ui.mobile.core.Widget);
      this.assertInstance(el2.$$widget, qx.ui.mobile.core.Widget);
    },

    testInitWidgetSelector : function() {
      var el1 = document.createElement("div");
      el1.setAttribute("data-qx-widget", "qx.ui.mobile.core.Widget");
      this.getRoot()[0].appendChild(el1);

      var el2 = document.createElement("div");
      el2.setAttribute("class", "foo");
      el2.setAttribute("data-qx-widget", "qx.ui.mobile.core.Widget");
      this.getRoot()[0].appendChild(el2);

      qx.ui.mobile.core.Widget.initWidgets(".foo");

      this.assertUndefined(el1.$$widget);
      this.assertInstance(el2.$$widget, qx.ui.mobile.core.Widget);
    },

    testInitWidgetFunction : function() {
      var el1 = document.createElement("div");
      this.getRoot()[0].appendChild(el1);

      var el2 = document.createElement("div");
      el2.affe = true;
      el2.setAttribute("data-qx-widget", "qx.ui.mobile.core.Widget");
      this.getRoot()[0].appendChild(el2);

      qx.ui.mobile.core.Widget.initWidgets(function(el) {
        return !!el2.affe;
      });

      this.assertUndefined(el1.$$widget);
      this.assertInstance(el2.$$widget, qx.ui.mobile.core.Widget);
    },

    testRestoreInstance : function() {
      var widget = new qx.ui.mobile.core.Widget();
      widget.setAttribute("id", "affe");
      this.getRoot().append(widget);

      var element = document.getElementById("affe");
      this.assertEquals(widget, qxWeb(element));

      widget.dispose();
    }
  }
});

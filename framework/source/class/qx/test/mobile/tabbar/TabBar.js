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

qx.Bootstrap.define("qx.test.mobile.tabbar.TabBar",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    __tabBar : null,

    setUp : function() {
      this.base(qx.test.mobile.MobileTestCase, "setUp");
      this.__tabBar = new qx.ui.mobile.tabbar.TabBar();
      this.getRoot().append(this.__tabBar);
    },

    tearDown : function() {
      this.base(qx.test.mobile.MobileTestCase, "tearDown");
      this.__tabBar.dispose();
    },

    __assertChildNodesLength : function(tabNumber) {
      var childrenLength = this.__tabBar.getChildren().length;
      this.assertEquals(tabNumber, childrenLength);
    },

    testAdd : function()
    {
      var tabBar = this.__tabBar;

      var button1 = new qx.ui.mobile.Button("Button 1");
      tabBar.append(button1);
      this.__assertChildNodesLength(1);

      var button2 = new qx.ui.mobile.Button("Button 2");
      tabBar.append(button2);
      this.__assertChildNodesLength(2);

      var button3 = new qx.ui.mobile.Button("Button 3");
      tabBar.append(button3);
      this.__assertChildNodesLength(3);
      tabBar.dispose();
    },


    testRemove : function()
    {
      var tabBar = this.__tabBar;

      var button1 = new qx.ui.mobile.Button("Button 1");
      tabBar.append(button1);
      var button2 = new qx.ui.mobile.Button("Button 2");
      tabBar.append(button2);
      var button3 = new qx.ui.mobile.Button("Button 3");
      tabBar.append(button3);

      this.__assertChildNodesLength(3);

      button2.remove();
      this.__assertChildNodesLength(2);
      button1.remove();
      this.__assertChildNodesLength(1);
      button3.remove();
      this.__assertChildNodesLength(0);
    },


    testSelected : function()
    {
      var tabBar = this.__tabBar;

      var button1 = new qx.ui.mobile.Button()
        .setData("qxConfigPage", "#foo")
        .appendTo(tabBar);
      this.assertEquals(button1, tabBar.selected);

      var button2 = new qx.ui.mobile.Button()
        .setData("qxConfigPage", "#bar")
        .appendTo(tabBar);
      this.assertEquals(button1, tabBar.selected);

      tabBar.selected = button2;
      this.assertEquals(button2, tabBar.selected);

      button2.remove();
      this.assertEquals(button1[0], tabBar.selected[0]);

      this.assertEventFired(tabBar, "changeSelected", function() {
        tabBar.selected = null;
      });
    },


    testView : function()
    {
      var tabBar = this.__tabBar;

      var view1 = new qx.ui.mobile.basic.Label("1").
        appendTo(this.getRoot()).hide();
      this.assertTrue(view1.getStyle("visibility") == "hidden");
      var button1 = new qx.ui.mobile.Button("Button 1")
        .setData("qxConfigPage", "#" + view1.getAttribute("id"))
        .appendTo(tabBar);
      this.assertTrue(view1.getStyle("visibility") == "visible");

      var view2 = new qx.ui.mobile.basic.Label("2").
        appendTo(this.getRoot());
      var button2 = new qx.ui.mobile.Button("Button 2")
        .setData("qxConfigPage", "#" + view2.getAttribute("id"))
        .appendTo(tabBar);
      this.assertFalse(view2.getStyle("visibility") == "visible");

      var view3 = new qx.ui.mobile.basic.Label("3").
        appendTo(this.getRoot());
      var button3 = new qx.ui.mobile.Button("Button 3")
        .setData("qxConfigPage", "#" + view3.getAttribute("id"))
        .appendTo(tabBar);
      tabBar.selected = button3;
      this.assertTrue(view1.getStyle("visibility") == "hidden");
      this.assertTrue(view2.getStyle("visibility") == "hidden");
      this.assertTrue(view3.getStyle("visibility") == "visible");

      button3.remove();
      this.assertTrue(view1.getStyle("visibility") == "visible");
      this.assertTrue(view2.getStyle("visibility") == "hidden");
      this.assertTrue(view3.getStyle("visibility") == "visible");
    }
  }

});

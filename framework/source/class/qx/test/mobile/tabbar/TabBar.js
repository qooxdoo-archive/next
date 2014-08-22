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
    __createTabBar : function() {
      var tabBar = new qx.ui.mobile.tabbar.TabBar();
      this.getRoot().append(tabBar);
      return tabBar;
    },

    __assertChildNodesLength : function(tabBar, tabNumber) {
      var childrenLength = tabBar.getChildren().length;
      this.assertEquals(tabNumber, childrenLength);
    },

    testAdd : function()
    {
      var tabBar = this.__createTabBar();

      var button1 = new qx.ui.mobile.tabbar.TabButton("Button 1");
      tabBar.append(button1);
      this.__assertChildNodesLength(tabBar, 1);

      var button2 = new qx.ui.mobile.tabbar.TabButton("Button 2");
      tabBar.append(button2);
      this.__assertChildNodesLength(tabBar, 2);

      var button3 = new qx.ui.mobile.tabbar.TabButton("Button 3");
      tabBar.append(button3);
      this.__assertChildNodesLength(tabBar, 3);

      button1.dispose();
      button2.dispose();
      button3.dispose();
      tabBar.dispose();
    },


    testRemove : function()
    {
      var tabBar = this.__createTabBar();

      var button1 = new qx.ui.mobile.tabbar.TabButton("Button 1");
      tabBar.append(button1);
      var button2 = new qx.ui.mobile.tabbar.TabButton("Button 2");
      tabBar.append(button2);
      var button3 = new qx.ui.mobile.tabbar.TabButton("Button 3");
      tabBar.append(button3);

      this.__assertChildNodesLength(tabBar, 3);

      button2.remove();
      this.__assertChildNodesLength(tabBar, 2);
      button1.remove();
      this.__assertChildNodesLength(tabBar, 1);
      button3.remove();
      this.__assertChildNodesLength(tabBar, 0);

      button1.dispose();
      button2.dispose();
      button3.dispose();
      tabBar.dispose();
    },


    testSelection : function()
    {
      var tabBar = this.__createTabBar();

      var button1 = new qx.ui.mobile.tabbar.TabButton();
      tabBar.append(button1);
      this.assertEquals(button1, tabBar.selection);

      var button2 = new qx.ui.mobile.tabbar.TabButton();
      tabBar.append(button2);
      this.assertEquals(button1, tabBar.selection);

      var button3 = new qx.ui.mobile.tabbar.TabButton();
      tabBar.append(button3);
      this.assertEquals(button1, tabBar.selection);

      tabBar.selection = button2;
      this.assertEquals(button2, tabBar.selection);

      button2.remove();
      this.assertEquals(null, tabBar.selection);

      this.assertEventFired(tabBar, "changeSelection", function() {
        tabBar.selection = button1;
      });

      button1.dispose();
      button2.dispose();
      button3.dispose();
      tabBar.dispose();
    },


    testView : function()
    {
      var tabBar = this.__createTabBar();

      var button1 = new qx.ui.mobile.tabbar.TabButton("Button 1");
      var view1 = new qx.ui.mobile.basic.Label("1");
      view1.exclude();
      button1.view = view1;
      tabBar.append(button1);
      this.assertTrue(view1.isVisible());

      var button2 = new qx.ui.mobile.tabbar.TabButton("Button 2");
      tabBar.append(button2);
      var view2 = new qx.ui.mobile.basic.Label("2");
      button2.view = view2;
      this.assertFalse(view2.isVisible());

      var button3 = new qx.ui.mobile.tabbar.TabButton("Button 3");
      tabBar.append(button3);
      tabBar.selection = button3;
      var view3 = new qx.ui.mobile.basic.Label("3");

      this.assertEventFired(button3, "changeView", function() {
        button3.view = view3;
      });

      this.assertFalse(view1.isVisible());
      this.assertTrue(view3.isVisible());

      button3.remove();
      this.assertFalse(view1.isVisible());
      this.assertFalse(view2.isVisible());
      this.assertFalse(view3.isVisible());

      button1.dispose();
      button2.dispose();
      button3.dispose();
      view1.dispose();
      view2.dispose();
      view3.dispose();
      tabBar.dispose();
    }
  }

});

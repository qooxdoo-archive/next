/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

qx.Class.define("qx.test.mobile.container.Navigation",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testCreate : function()
    {
      var container = new qx.ui.mobile.container.Navigation();
      this.getRoot().append(container);
      container.dispose();
    },


    testAdd : function()
    {
      var container = new qx.ui.mobile.container.Navigation();
      var page = new qx.ui.mobile.page.NavigationPage();
      this.getRoot().append(container);
      this.assertFalse(container.getContent().getChildren().length > 0);
      container.append(page);
      this.assertTrue(container.getContent().getChildren().length > 0);
      page.dispose();
      container.dispose();
    },


    testRemove : function()
    {
      var container = new qx.ui.mobile.container.Navigation();
      var page = new qx.ui.mobile.page.NavigationPage();
      this.getRoot().append(container);
      this.assertFalse(container.getContent().getChildren().length > 0);
      container.append(page);
      this.assertTrue(container.getContent().getChildren().length > 0);
      page.remove();
      this.assertFalse(container.getContent().getChildren().length > 0);
      page.dispose();
      container.dispose();
    },


    testUpdateEvent : function() {
      var container = new qx.ui.mobile.container.Navigation();
      var updateEventFired = false;

      container.on("update", function() {
        updateEventFired = true;
      }, this);


      var page1 = new qx.ui.mobile.page.NavigationPage();
      var page2 = new qx.ui.mobile.page.NavigationPage();
      this.getRoot().append(container);
      container.append(page1);
      container.append(page2);
      page2.show();

      this.assertTrue(updateEventFired);

      page1.dispose();
      page2.dispose();
      container.dispose();
    }
  }

});

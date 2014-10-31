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


qx.Class.define("qx.test.mobile.page.NavigationPage",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testNavigationInterface : function()
    {
      var page = new qx.ui.page.NavigationPage();

      this.assertNotNull(page.getTitleWidget());
      this.assertNotNull(page.getLeftContainer());
      this.assertNotNull(page.getRightContainer());

      page.dispose();
    },


    testTitle : function()
    {
      var page = new qx.ui.page.NavigationPage();

      page.title = "Affe";
      this.assertEquals("Affe", page.getTitleWidget().value);

      page.dispose();
    },


    testBackButton : function()
    {
      var page = new qx.ui.page.NavigationPage();

      page.getLeftContainer();

      page.showBackButton = true;
      page.backButtonText = "Affe";
      this.assertEquals("Affe", page._getBackButton().getValue());
      this.assertEquals("visible", page._getBackButton().visibility);
      page.showBackButton = false;
      this.assertNotEquals("visible", page._getBackButton().visibility);

      page.dispose();
    },


    testButton : function()
    {
      var page = new qx.ui.page.NavigationPage();

      page.getRightContainer();

      page.showButton = true;
      page.buttonText = "Affe";
      this.assertEquals("Affe", page._getButton().getValue());
      this.assertEquals("visible", page._getButton().visibility);
      page.showButton = false;
      this.assertNotEquals("visible", page._getButton().visibility);

      page.dispose();
    }
  }
});

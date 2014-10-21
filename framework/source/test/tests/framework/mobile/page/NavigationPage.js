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


describe("mobile.page.NavigationPage", function ()
{

  beforeEach( function () {
     setUpRoot();
  });


  afterEach( function (){
     tearDownRoot();
  });


 it("NavigationInterface", function() {
      var page = new qx.ui.mobile.page.NavigationPage();

      assert.isNotNull(page.getTitleWidget());
      assert.isNotNull(page.getLeftContainer());
      assert.isNotNull(page.getRightContainer());

      page.dispose();
  });


  it("Title", function() {
      var page = new qx.ui.mobile.page.NavigationPage();

      page.title = "Affe";
      assert.equal("Affe", page.getTitleWidget().value);

      page.dispose();
  });


  it("BackButton", function() {
      var page = new qx.ui.mobile.page.NavigationPage();

      page.getLeftContainer();

      page.showBackButton = true;
      page.backButtonText = "Affe";
      assert.equal("Affe", page._getBackButton().getValue());
      assert.equal("visible", page._getBackButton().visibility);
      page.showBackButton = false;
      assert.notEqual("visible", page._getBackButton().visibility);

      page.dispose();
  });


  it("Button", function() {
      var page = new qx.ui.mobile.page.NavigationPage();

      page.getRightContainer();

      page.showButton = true;
      page.buttonText = "Affe";
      assert.equal("Affe", page._getButton().getValue());
      assert.equal("visible", page._getButton().visibility);
      page.showButton = false;
      assert.notEqual("visible", page._getButton().visibility);

      page.dispose();

  });
});

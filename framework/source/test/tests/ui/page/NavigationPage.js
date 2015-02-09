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


describe("ui.page.NavigationPage", function () {

 it("NavigationInterface", function() {
      var page = new qx.ui.page.NavigationPage();

      assert.isNotNull(page.getTitleElement());
      assert.isNotNull(page.getLeftContainer());
      assert.isNotNull(page.getRightContainer());

      page.dispose();
  });


  it("Title", function() {
      var page = new qx.ui.page.NavigationPage();

      page.title = "Affe";
      assert.equal(page.getTitleElement().getHtml(), "Affe");

      page.dispose();
  });


  it("BackButton", function() {
      var page = new qx.ui.page.NavigationPage();

      page.getLeftContainer();

      page.showBackButton = true;
      page.backButtonText = "Affe";
      assert.equal(page._getBackButton().getChildren().getHtml(), "Affe");
      assert.equal(page._getBackButton().visibility, "visible");
      page.showBackButton = false;
      assert.notEqual(page._getBackButton().visibility, "visible");

      page.dispose();
  });


  it("Button", function() {
      var page = new qx.ui.page.NavigationPage();

      page.getRightContainer();

      page.showButton = true;
      page.buttonText = "Affe";
      assert.equal(page._getButton().getChildren().getHtml(), "Affe");
      assert.equal(page._getButton().visibility, "visible");
      page.showButton = false;
      assert.notEqual(page._getButton().visibility, "visible");

      page.dispose();

  });


  it("Factory", function() {
    var navigationPage = qxWeb.create("<div>").toNavigationPage().appendTo(sandbox);
    assert.instanceOf(navigationPage, qx.ui.page.NavigationPage);
    assert.equal(navigationPage[0].$$widget, navigationPage);
    assert.equal(navigationPage.getData("qxWidget"), "qx.ui.page.NavigationPage");
  });
});

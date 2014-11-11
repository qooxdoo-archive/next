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

describe("mobile.navigationbar.NavigationBar", function()
{

  beforeEach( function () {
     setUpRoot();
  });


  afterEach( function (){
     tearDownRoot();
  });


  it("Create", function() {
      var bar = new qx.ui.navigationbar.NavigationBar();
      getRoot().append(bar);

      var back = new qx.ui.Button("Back");
      bar.append(back);

      var title = qxWeb.create('<h1>').setHtml('Title').addClass('title');
      bar.append(title);

      var button = new qx.ui.Button("Action");
      bar.append(button);

      assert.equal(3, bar.getChildren().length);

      back.dispose();
      title.dispose();
      button.dispose();
      bar.dispose()
  });


  it("Factory", function() {
    var navigationBar = qxWeb.create("<div>").toNavigationBar().appendTo(getRoot());
    assert.instanceOf(navigationBar, qx.ui.navigationbar.NavigationBar);
    assert.equal(navigationBar, navigationBar[0].$$widget);
    assert.equal("qx.ui.navigationbar.NavigationBar", navigationBar.getData("qxWidget"));
  });
});

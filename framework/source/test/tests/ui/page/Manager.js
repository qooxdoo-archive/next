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

describe("ui.page.Manager", function() {

  it("Create", function() {
    var manager = new qx.ui.page.Manager(undefined, qxWeb(document.body));
    manager.dispose();
  });


  it("AddTablet", function() {
    var manager = new qx.ui.page.Manager(true, qxWeb(document.body));
    var page = new qx.ui.page.NavigationPage();
    manager.addMaster([page]);
    manager.addDetail([page]);
    manager.dispose();
  });


  it("AddMobile", function() {
    var manager = new qx.ui.page.Manager(false, qxWeb(document.body));
    var page1 = new qx.ui.page.NavigationPage();
    var page2 = new qx.ui.page.NavigationPage();
    manager.addMaster([page1]);
    manager.addMaster([page2]);
    manager.dispose();
  });

});

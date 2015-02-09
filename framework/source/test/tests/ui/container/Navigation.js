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

describe("ui.container.Navigation", function() {

  it("Create", function() {
    var container = new qx.ui.container.Navigation();
    sandbox.append(container);
    container.dispose();
  });


  it("Add", function() {
    var container = new qx.ui.container.Navigation();
    var page = new qx.ui.page.NavigationPage();
    sandbox.append(container);
    assert.isFalse(container.getContent().getChildren().length > 0);
    container.append(page);
    assert.isTrue(container.getContent().getChildren().length > 0);
    page.dispose();
    container.dispose();
  });


  it("Remove", function() {
    var container = new qx.ui.container.Navigation();
    var page = new qx.ui.page.NavigationPage();
    sandbox.append(container);
    assert.isFalse(container.getContent().getChildren().length > 0);
    container.append(page);
    assert.isTrue(container.getContent().getChildren().length > 0);
    page.remove();
    assert.isFalse(container.getContent().getChildren().length > 0);
    page.dispose();
    container.dispose();
  });


  it("UpdateEvent", function() {
    var container = new qx.ui.container.Navigation();
    var updateEventFired = false;

    container.on("update", function() {
      updateEventFired = true;
    }, this);

    var page1 = new qx.ui.page.NavigationPage();
    var page2 = new qx.ui.page.NavigationPage();
    sandbox.append(container);
    container.append(page1);
    container.append(page2);
    page2.show();

    assert.isTrue(updateEventFired);

    page1.dispose();
    page2.dispose();
    container.dispose();
  });


  it("Factory", function() {
    var navigation = q.create('<div>')
      .toNavigation()
      .appendTo(sandbox);

    assert.instanceOf(navigation, qx.ui.container.Navigation);
    assert.equal(navigation, navigation[0].$$widget);
    assert.equal("qx.ui.container.Navigation", navigation.getData("qxWidget"));

    navigation.dispose();
  });

});

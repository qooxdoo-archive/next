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

describe("mobile.tabbar.TabBar", function() {

  var __tabBar = null;

  beforeEach(function() {
    setUpRoot();
    __tabBar = new qx.ui.tabbar.TabBar();
    getRoot().append(__tabBar);
  });


  afterEach(function() {
    tearDownRoot();
    __tabBar.dispose();
  });


  function __assertChildNodesLength(tabNumber) {
    var childrenLength = __tabBar.getChildren().length;
    assert.equal(tabNumber, childrenLength);
  }


  it("Add", function() {
    var tabBar = __tabBar;

    var button1 = new qx.ui.Button("Button 1");
    tabBar.append(button1);
    __assertChildNodesLength(1);

    var button2 = new qx.ui.Button("Button 2");
    tabBar.append(button2);
    __assertChildNodesLength(2);

    var button3 = new qx.ui.Button("Button 3");
    tabBar.append(button3);
    __assertChildNodesLength(3);
    tabBar.dispose();
  });


  it("Remove", function() {
    var tabBar = __tabBar;

    var button1 = new qx.ui.Button("Button 1");
    tabBar.append(button1);
    var button2 = new qx.ui.Button("Button 2");
    tabBar.append(button2);
    var button3 = new qx.ui.Button("Button 3");
    tabBar.append(button3);

    __assertChildNodesLength(3);

    button2.remove();
    __assertChildNodesLength(2);
    button1.remove();
    __assertChildNodesLength(1);
    button3.remove();
    __assertChildNodesLength(0);
  });


  it("Selected", function() {
    var tabBar = __tabBar;

    var button1 = new qx.ui.Button()
      .setData("qxConfigPage", "#foo")
      .appendTo(tabBar);
    assert.equal(button1, tabBar.selected);

    var button2 = new qx.ui.Button()
      .setData("qxConfigPage", "#bar")
      .appendTo(tabBar);
    assert.equal(button1, tabBar.selected);

    tabBar.selected = button2;
    assert.equal(button2, tabBar.selected);

    button2.remove();
    assert.equal(button1[0], tabBar.selected[0]);

    qx.core.Assert.assertEventFired(tabBar, "changeSelected", function() {
      tabBar.selected = null;
    });
  });


  it("View", function() {
    var tabBar = __tabBar;

    var view1 = new qx.ui.basic.Label("1").
    appendTo(getRoot()).exclude();
    assert.isTrue(view1.hasClass("exclude"));
    var button1 = new qx.ui.Button("Button 1")
      .addClass("selected")
      .setData("qxConfigPage", "#" + view1.getAttribute("id"))
      .appendTo(tabBar);

    assert.isFalse(view1.hasClass("exclude"));

    var view2 = new qx.ui.basic.Label("2").
    appendTo(getRoot()).exclude();
    var button2 = new qx.ui.Button("Button 2")
      .setData("qxConfigPage", "#" + view2.getAttribute("id"))
      .appendTo(tabBar);

    assert.isTrue(view2.hasClass("exclude"));

    var view3 = new qx.ui.basic.Label("3").
    appendTo(getRoot()).exclude();
    var button3 = new qx.ui.Button("Button 3")
      .setData("qxConfigPage", "#" + view3.getAttribute("id"))
      .appendTo(tabBar);

    tabBar.selected = button3;
    assert.isTrue(view1.hasClass("exclude"));
    assert.isTrue(view2.hasClass("exclude"));
    assert.isFalse(view3.hasClass("exclude"));

    button3.remove();
    assert.isFalse(view1.hasClass("exclude"));
    assert.isTrue(view2.hasClass("exclude"));
    assert.isFalse(view3.hasClass("exclude"));
  });


  it("Factory", function() {
    __tabBar = qxWeb.create("<div>").toTabBar().appendTo(getRoot());
    assert.instanceOf(__tabBar, qx.ui.tabbar.TabBar);
    assert.equal(__tabBar, __tabBar[0].$$widget);
    assert.equal("qx.ui.tabbar.TabBar", __tabBar.getData("qxWidget"));
  });
});
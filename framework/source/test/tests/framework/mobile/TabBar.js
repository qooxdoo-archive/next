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

describe("mobile.TabBar", function() {

  var __tabBar = null;

  beforeEach(function() {
    __tabBar = new qx.ui.TabBar();
    sandbox.append(__tabBar);
  });


  afterEach(function() {
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


  it("Active", function() {
    var tabBar = __tabBar;

    var button1 = new qx.ui.Button()
      .setData("qxConfigPage", "#foo")
      .appendTo(tabBar);
    assert.equal(button1[0], tabBar.active);

    var button2 = new qx.ui.Button()
      .setData("qxConfigPage", "#bar")
      .appendTo(tabBar);
    assert.equal(button1[0], tabBar.active);

    tabBar.active = button2[0];
    assert.equal(button2[0], tabBar.active);

    button2.remove();
    assert.equal(button1[0], tabBar.active);

    button2.appendTo(tabBar);
    qx.core.Assert.assertEventFired(tabBar, "changeActive", function() {
      tabBar.active = button2[0];
    },
    function(e) {
      assert.equal(button2[0], e.value);
    });
  });


  it("View", function() {
    var tabBar = __tabBar;

    var view1 = new qx.ui.Label("1").
    appendTo(sandbox).exclude();
    assert.isTrue(view1.hasClass("exclude"));
    var button1 = new qx.ui.Button("Button 1")
      .addClass("selected")
      .setData("qxConfigPage", "#" + view1.getAttribute("id"))
      .appendTo(tabBar);

    assert.isFalse(view1.hasClass("exclude"));

    var view2 = new qx.ui.Label("2").
    appendTo(sandbox).exclude();
    var button2 = new qx.ui.Button("Button 2")
      .setData("qxConfigPage", "#" + view2.getAttribute("id"))
      .appendTo(tabBar);

    assert.isTrue(view2.hasClass("exclude"));

    var view3 = new qx.ui.Label("3").
    appendTo(sandbox).exclude();
    var button3 = new qx.ui.Button("Button 3")
      .setData("qxConfigPage", "#" + view3.getAttribute("id"))
      .appendTo(tabBar);

    tabBar.active = button3[0];
    assert.isTrue(view1.hasClass("exclude"));
    assert.isTrue(view2.hasClass("exclude"));
    assert.isFalse(view3.hasClass("exclude"));

    button3.remove();
    assert.isFalse(view1.hasClass("exclude"));
    assert.isTrue(view2.hasClass("exclude"));
    assert.isFalse(view3.hasClass("exclude"));
  });


  it("Factory", function() {
    __tabBar = qxWeb.create("<div>").toTabBar().appendTo(sandbox);
    assert.instanceOf(__tabBar, qx.ui.TabBar);
    assert.equal(__tabBar, __tabBar[0].$$widget);
    assert.equal("qx.ui.TabBar", __tabBar.getData("qxWidget"));
  });
});
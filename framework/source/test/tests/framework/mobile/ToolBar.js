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

describe("mobile.ToolBar", function() {

  var __toolBar = null;

  beforeEach(function () {
    setUpRoot();
    __toolBar = new qx.ui.ToolBar();
    getRoot().append(__toolBar);
  });

  afterEach(function() {
    tearDownRoot();
    __toolBar.dispose();
  });


  function __assertChildNodesLength(toolBar, toolbarKidsNumber) {
    var childrenLength = toolBar.getChildren().length;
    assert.equal(toolbarKidsNumber, childrenLength);
  }


  it("Add", function() {
    var button1 = new qx.ui.Button("Button 1");
    __toolBar.append(button1);
    __assertChildNodesLength(__toolBar, 1);

    var button2 = new qx.ui.Button("Button with long name 2");
    __toolBar.append(button2);
    __assertChildNodesLength(__toolBar, 2);

    var button3 = new qx.ui.Button("Button 3");
    __toolBar.append(button3);
    __assertChildNodesLength(__toolBar, 3);

    button1.dispose();
    button2.dispose();
    button3.dispose();
    __toolBar.dispose();
  });


  it("Remove", function() {
    var button1 = new qx.ui.Button("Button 1");
    __toolBar.append(button1);

    var button2 = new qx.ui.Button("Button 2");
    __toolBar.append(button2);

    var button3 = new qx.ui.Button("Button 3");
    __toolBar.append(button3);

    __assertChildNodesLength(__toolBar, 3);

    button2.remove();
    __assertChildNodesLength(__toolBar, 2);
    button1.remove();
    __assertChildNodesLength(__toolBar, 1);
    button3.remove();
    __assertChildNodesLength(__toolBar, 0);

    button1.dispose();
    button2.dispose();
    button3.dispose();
    __toolBar.dispose();
  });


  it("Factory", function() {
    __toolBar = qxWeb.create("<div>").toToolBar().appendTo(getRoot());
    assert.instanceOf(__toolBar, qx.ui.ToolBar);
    assert.equal(__toolBar, __toolBar[0].$$widget);
    assert.equal("qx.ui.ToolBar", __toolBar.getData("qxWidget"));
  });
});

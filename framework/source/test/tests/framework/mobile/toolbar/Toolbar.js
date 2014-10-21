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

describe("mobile.toolbar.Toolbar", function() {

  function __createToolbar() {
    var toolBar = new qx.ui.mobile.toolbar.ToolBar();
    getRoot().append(toolBar);
    return toolBar;
  }


  function __assertChildNodesLength(toolBar, toolbarKidsNumber) {
    var childrenLength = toolBar.getChildren().length;
    assert.equal(toolbarKidsNumber, childrenLength);
  }


  it("Add", function() {
    var toolBar = __createToolbar();

    var button1 = new qx.ui.mobile.Button("Button 1");
    toolBar.append(button1);
    __assertChildNodesLength(toolBar, 1);

    var button2 = new qx.ui.mobile.Button("Button with long name 2");
    toolBar.append(button2);
    __assertChildNodesLength(toolBar, 2);

    var button3 = new qx.ui.mobile.Button("Button 3");
    toolBar.append(button3);
    __assertChildNodesLength(toolBar, 3);

    assert.equal(qx.bom.element.Dimension.getWidth(button1[0]), qx.bom.element.Dimension.getWidth(button2[0]));
    assert.equal(qx.bom.element.Dimension.getWidth(button3[0]), qx.bom.element.Dimension.getWidth(button2[0]));

    button1.dispose();
    button2.dispose();
    button3.dispose();
    toolBar.dispose();
  });


  it("Remove", function() {
    var toolBar = __createToolbar();

    var button1 = new qx.ui.mobile.Button("Button 1");
    toolBar.append(button1);

    var button2 = new qx.ui.mobile.Button("Button 2");
    toolBar.append(button2);

    var button3 = new qx.ui.mobile.Button("Button 3");
    toolBar.append(button3);

    __assertChildNodesLength(toolBar, 3);

    button2.remove();
    __assertChildNodesLength(toolBar, 2);
    button1.remove();
    __assertChildNodesLength(toolBar, 1);
    button3.remove();
    __assertChildNodesLength(toolBar, 0);

    button1.dispose();
    button2.dispose();
    button3.dispose();
    toolBar.dispose();
  });
});

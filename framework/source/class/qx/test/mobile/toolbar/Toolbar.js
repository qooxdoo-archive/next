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

qx.Bootstrap.define("qx.test.mobile.toolbar.Toolbar",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    __createToolbar : function() {
      var toolBar = new qx.ui.mobile.toolbar.ToolBar();
      this.getRoot().append(toolBar);
      return toolBar;
    },

    __assertChildNodesLength : function(toolBar, toolbarKidsNumber) {
      var childrenLength = toolBar.getChildren().length;
      this.assertEquals(toolbarKidsNumber, childrenLength);
    },

    testAdd : function()
    {
      var toolBar = this.__createToolbar();

      var button1 = new qx.ui.mobile.toolbar.Button("Button 1");
      toolBar.append(button1);
      this.__assertChildNodesLength(toolBar, 1);

      var button2 = new qx.ui.mobile.toolbar.Button("Button with long name 2");
      toolBar.append(button2);
      this.__assertChildNodesLength(toolBar, 2);

      var button3 = new qx.ui.mobile.toolbar.Button("Button 3");
      toolBar.append(button3);
      this.__assertChildNodesLength(toolBar, 3);

      this.assertEquals(qx.bom.element.Dimension.getWidth(button1[0]), qx.bom.element.Dimension.getWidth(button2[0]));
      this.assertEquals(qx.bom.element.Dimension.getWidth(button3[0]), qx.bom.element.Dimension.getWidth(button2[0]));

      button1.dispose();
      button2.dispose();
      button3.dispose();
      toolBar.dispose();
    },


    testRemove : function()
    {
      var toolBar = this.__createToolbar();

      var button1 = new qx.ui.mobile.toolbar.Button("Button 1");
      toolBar.append(button1);

      var button2 = new qx.ui.mobile.toolbar.Button("Button 2");
      toolBar.append(button2);

      var button3 = new qx.ui.mobile.toolbar.Button("Button 3");
      toolBar.append(button3);

      this.__assertChildNodesLength(toolBar, 3);

      toolBar.remove(button2);
      this.__assertChildNodesLength(toolBar, 2);
      toolBar.remove(button1);
      this.__assertChildNodesLength(toolBar, 1);
      toolBar.remove(button3);
      this.__assertChildNodesLength(toolBar, 0);

      button1.dispose();
      button2.dispose();
      button3.dispose();
      toolBar.dispose();
    }

  }

});

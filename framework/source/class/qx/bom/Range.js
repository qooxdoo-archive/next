/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Alexander Steitz (aback)

************************************************************************ */



/**
 * Low-level Range API which is used together with the low-level Selection API.
 * This is especially useful whenever a developer want to work on text level,
 * e.g. for an editor.
 */
qx.Bootstrap.define("qx.bom.Range",
{
  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /**
     * Returns the range object of the given node.
     *
     * @param node {Node} node to get the range of
     * @return {Range} valid range of given selection
     */
    get : function(node) {
      var doc = qx.dom.Node.getDocument(node);

      // get the selection object of the corresponding document
      var sel = qx.bom.Selection.getSelectionObject(doc);

      if (sel.rangeCount > 0)
      {
        return sel.getRangeAt(0);
      }
      else
      {
        return doc.createRange();
      }
    }
  }
});
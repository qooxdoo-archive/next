"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * The Row widget represents a row in a {@link Form}.
 */
qx.Class.define("qx.ui.mobile.form.Row",
{
  extend : qx.ui.mobile.Widget,


  /**
   * @param layout {qx.ui.mobile.layout.Abstract?null} The layout that should be used for this
   *     container
   */
  construct : function(layout)
  {
    this.base(qx.ui.mobile.Widget, "constructor");
    this.layout = layout;
    this.selectable = false;
  },


  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "form-row"
    },


    /**
     * Whether the widget is selectable or not.
     */
    selectable :
    {
      check : "Boolean",
      init : false,
      apply : "_applySelectable"
    }
  },


  members :
  {

    _applySelectable : function(value, old) {
      this.setData("selectable", value ? null : "false");
    },


    // overridden
    _getTagName : function()
    {
      return "li";
    }
  }
});

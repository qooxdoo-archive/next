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
     * Gabriel Munteanu (gabios)

************************************************************************ */

/**
 * A toolbar widget.
 *
 */
qx.Bootstrap.define("qx.ui.mobile.toolbar.ToolBar",
{
  extend : qx.ui.mobile.Widget,

  construct : function(layout)
  {
    this.base(qx.ui.mobile.Widget, "constructor");
    this.layout = layout;
    if (!layout) {
      layout = new qx.ui.mobile.layout.HBox();
      layout.alignY = "middle";
      this.layout = layout;
    }
  },


  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "toolbar"
    }
  },

  members :
  {

    /**
      * Flag to keep the show/hidden state of the toolbar
      */
    __hidden: false,


    /**
      * Adds a new child widget.
      *
      * @param child {qx.ui.mobile.Widget} the widget to add.
      * @param layoutProperties {Map?null} Optional layout data for widget.
      */
    append : function(child, layoutProperties)
    {
      if(!(child instanceof qx.ui.mobile.toolbar.Separator))
      {
        layoutProperties = layoutProperties ? layoutProperties : {};
        qx.lang.Object.mergeWith(layoutProperties, {flex: 1}, false);
      }
      child.layoutPrefs = layoutProperties;
      this.base(qx.ui.mobile.Widget, "append", child);
    }
  }
});

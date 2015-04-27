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
 * @group(Widget)
 */
qx.Class.define("qx.ui.ToolBar",
{
  extend : qx.ui.Widget,

  /**
   * @attach {qxWeb, toToolBar}
   * @param layout {qx.ui.layout.Abstract?} The toolbar layout
   * @param element {Element?} The element used to create the widget.
   */
  construct : function(layout, element)
  {
    this.super("construct", element);
    this.layout = layout;
    if (!layout) {
      layout = new qx.ui.layout.HBox();
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
      * @param child {qx.ui.Widget} the widget to add.
      * @param layoutProperties {Map?null} Optional layout data for widget.
      */
    append : function(child, layoutProperties)
    {
      layoutProperties = layoutProperties ? layoutProperties : {};
      qx.lang.Object.mergeWith(layoutProperties, {flex: 1}, false);
      child.layoutPrefs = layoutProperties;
      this.super("append", child);
    }
  },

  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

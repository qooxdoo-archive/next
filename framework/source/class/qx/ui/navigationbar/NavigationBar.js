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
 * A navigation bar widget.
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *   var bar = new qx.ui.navigationbar.NavigationBar();
 *   var backButton = new qx.ui.Button();
 *   bar.append(backButton);
 *   var title = new qx.ui.navigationbar.Title();
 *   title.layoutPrefs = {flex:1};
 *   var.append(title);
 *
 *   this.getRoot.append(bar);
 * </pre>
 *
 * This example creates a navigation bar and adds a back button and a title to it.
 */
qx.Class.define("qx.ui.navigationbar.NavigationBar",
{
  extend : qx.ui.Widget,

  /**
   * @attach {qxWeb, toNavigationBar}
   */
  construct : function(layout, element) {
    this.super(qx.ui.Widget, "constructor", element);
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
    defaultCssClass : {
      init : "navigationbar"
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

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
 * A Button widget.
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *   var button = new qx.ui.mobile.Button("Hello World");
 *
 *   button.on("tap", function(e) {
 *     alert("Button was clicked");
 *   }, this);
 *
 *   this.getRoot.append(button);
 * </pre>
 *
 * This example creates a button with the label "Hello World" and attaches an
 * event listener to the {@link qx.ui.mobile.Widget#tap} event.
 */
qx.Bootstrap.define("qx.ui.mobile.Button",
{
  extend : qx.ui.mobile.basic.Atom,


  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "button"
    },

    // overridden
    activatable :
    {
      init : true
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

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
 * @group(Widget)
 */
qx.Class.define("qx.ui.Button",
{
  extend : qx.ui.Atom,


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


  /**
   * @attach {qxWeb, toButton}
   * @param label {String} The buttons label.
   * @param icon {String?} The URI to the buttons icon.
   * @param element {Element?} The element used to create the widget.
   */
  construct : function(label, icon, element) {
    this.super("construct", label, icon, element);
  },

  members: {

    _getTagName: function() {
      return "button";
    }

  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

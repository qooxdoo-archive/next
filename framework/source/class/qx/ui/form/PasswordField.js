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
 * The PasswordField is a single-line password input field.
 *
 * @group(Widget)
 */
qx.Class.define("qx.ui.form.PasswordField",
{
  extend : qx.ui.form.TextField,

  properties :
  {
    // overridden
    defaultCssClass : {
      init : "password-field"
    }
  },

  /**
   * @attach {qxWeb, toPasswordField}
   * @param value {String} The initial value.
   * @param element {Element?} The element used to create the widget.
   */
  construct: function(value, element) {
    this.super("construct", value, element);
    this.type = "password";
  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

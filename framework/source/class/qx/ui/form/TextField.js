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
 * The TextField is a single-line text input field.
 */
qx.Class.define("qx.ui.form.TextField",
{
  extend : qx.ui.form.Input,
  include : [
    qx.ui.form.MText
  ],


  /**
   * @param value {var?null} The value of the widget.
   * @attach {qxWeb, toTextField}
   * @return {qx.ui.form.TextField} The new text field widget.
   */
  construct : function(value, element)
  {
    this.super(qx.ui.form.Input, "constructor", element);
    this.type = "text";

    if (value) {
      this.value = value;
    }

    this.on("keypress", this._onKeyPress, this);
    this.initMText();
  },


  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "text-field"
    }
  },


  members :
  {
    /**
    * Event handler for <code>keypress</code> event.
    * @param evt {qx.event.type.KeySequence} the keypress event.
    */
    _onKeyPress : function(evt) {
      // On return
      if(evt.keyCode == 13) {
        this.blur();
      }
    },


    dispose : function() {
      this.super(qx.ui.form.Input, "dispose");
      this.off("keypress", this._onKeyPress, this);
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

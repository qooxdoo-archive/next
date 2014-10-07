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
qx.Class.define("qx.ui.mobile.form.TextField",
{
  extend : qx.ui.mobile.form.Input,
  include : [qx.ui.mobile.form.MValue, qx.ui.mobile.form.MText],


  /**
   * @param value {var?null} The value of the widget.
   */
  construct : function(value)
  {
    this.base(qx.ui.mobile.form.Input, "constructor");

    if (value) {
      this.value = value;
    }

    this.on("keypress", this._onKeyPress, this);
    this.initMValue(value);
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
    // overridden
    _getType : function()
    {
      return "text";
    },


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
      this.base(qx.ui.mobile.form.Input, "dispose");
      this.off("keypress", this._onKeyPress, this);
    }
  }
});

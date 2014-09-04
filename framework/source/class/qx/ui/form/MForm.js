"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */

/**
 * Mixin handling the valid and required properties for the form widgets.
 */
qx.Mixin.define("qx.ui.form.MForm",
{
  properties : {

    /**
     * Flag signaling if a widget is valid. If a widget is invalid, an invalid
     * state will be set.
     */
    valid : {
      check : "Boolean",
      init : true,
      apply : "_applyValid",
      event : true
    },


    /**
     * Flag signaling if a widget is required.
     */
    required : {
      check : "Boolean",
      init : false,
      event : true
    },


    /**
     * Message which is shown in an invalid tooltip.
     */
    invalidMessage : {
      check : "String",
      init: "",
      event : true
    },


    /**
     * Message which is shown in an invalid tooltip if the {@link #required} is
     * set to true.
     */
    requiredInvalidMessage : {
      check : "String",
      nullable : true,
      event : true
    }
  },


  members : {

    /**
     * Initializes this mixin. Should be called from the including class'
     * constructor.
     */
    initMForm : function() {
      if (qx.core.Environment.get("qx.dynlocale")) {
        qx.locale.Manager.getInstance().on("changeLocale", this.__onChangeLocale, this);
      }
    },


    // apply method
    _applyValid: function(value, old) {
      value ? this.removeState("invalid") : this.addState("invalid");
    },


    /**
     * Locale change event handler
     *
     * @signature function(e)
     * @param e {Event} the change event
     */
    __onChangeLocale : qx.core.Environment.select("qx.dynlocale",
    {
      "true" : function(e)
      {
        // invalid message
        var invalidMessage = this.invalidMessage;
        if (invalidMessage && invalidMessage.translate) {
          this.invalidMessage = invalidMessage.translate();
        }
        // required invalid message
        var requiredInvalidMessage = this.requiredInvalidMessage;
        if (requiredInvalidMessage && requiredInvalidMessage.translate) {
          this.requiredInvalidMessage = requiredInvalidMessage.translate();
        }
      },

      "false" : null
    }),

    disposeMForm : function() {
      if (qx.core.Environment.get("qx.dynlocale")) {
        qx.locale.Manager.getInstance().off("changeLocale", this.__onChangeLocale, this);
      }
    }
  }
});

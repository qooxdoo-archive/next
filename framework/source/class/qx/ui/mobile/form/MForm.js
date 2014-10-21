"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */

/**
 * Mixin handling the common properties of form widgets.
 */
qx.Mixin.define("qx.ui.mobile.form.MForm",
{

  events: {

    /**
     * Fired if the item's validity changes
     */
    changeValid: null,

    /**
     * The event is fired on every keystroke modifying the value of the field.
     *
     * The method {@link qx.event.type.Data#getData} returns the
     * current value of the text field. TODOC
     */
    keyInput : null,


    /**
     * The event is fired each time the text field looses focus and the
     * text field values has changed.
     *
     * If you change {@link #liveUpdate} to true, the changeValue event will
     * be fired after every keystroke and not only after every focus loss. In
     * that mode, the changeValue event is equal to the {@link #input} event.
     *
     * The method {@link qx.event.type.Data#getData} returns the
     * current text value of the field.
     */
    changeValue : null
  },


  properties : {

    /**
     * The item's value
     */
    value : {
      set: "_setWidgetValue",
      get: "_getWidgetValue",
      event: true
    },

    /**
     * Whether the item must have a value
     */
    required: {
      type: "Boolean",
      apply: "_applyRequired",
      init: false
    },

    /**
     * Whether the item's value is valid
     */
    valid: {
      type: "Boolean",
      init: true,
      event: true,
      apply: "_applyValid"
    },

    /**
     * Optional custom validation method. Will be called with the value
     * and must return a boolean.
     */
    validator: {
      type: "Function",
      init: null,
      nullable: true,
      apply: "_applyValidator"
    },

    /**
     * Whether the {@link #changeValue} event should be fired on every key
     * input. If set to true, the changeValue event is equal to the
     * {@link #input} event.
     */
    liveUpdate: {
      check : "Boolean",
      init : false
    },


    /**
     * Message to display if the item's value is invalid
     */
    validationMessage: {
      check: "String",
      init: "Value is invalid",
      nullable: true
    }

  },


  members : {

    __oldValue : undefined,
    __inputTimeoutHandle : null,
    __hasFocus : null,


    /**
     * Initializes this mixin. Should be called from the including class'
     * constructor.
     */
    initMForm : function() {
      if (qx.core.Environment.get("qx.dynlocale")) {
        qx.locale.Manager.getInstance().on("changeLocale", this.__onChangeLocale, this);
      }

      if (this._getTagName() == "input" || this._getTagName() == "textarea") {
        this.on("change", this._onChangeContent, this);
        this.on("input", this._onInput, this);
      }

      this.on("focus", this._onFocus,this);
      this.on("blur", this._onBlur,this);
    },


    /**
    * Handler for <code>focus</code> event.
    */
    _onFocus : function() {
      this.__hasFocus = true;
    },


    /**
    * Handler for <code>blur</code> event.
    */
    _onBlur : function() {
      this.__hasFocus = false;
    },


    /**
    * Returns whether this widget has focus or not.
    * @return {Boolean} <code>true</code> or <code>false</code>
    */
    hasFocus : function() {
      return this.__hasFocus;
    },


    /**
     * Sets the value.
     *
     * @param value {var} The value to set
     */
    _setWidgetValue: function(value) {
      if (this.__oldValue != value) {
        if (this.maxLength && typeof value === "string" &&
            value.length > this.maxLength) {
          value = value.substr(0, this.maxLength);
        }

        if (typeof this._setValue == "function") {
          this._setValue(value);
        } else {
          this.setAttribute("value", value);
        }

        this.__fireChangeValue(value);
        this.validate();
      }
    },


    /**
     * Returns the set value.
     *
     * @return {var} The set value
     */
    _getWidgetValue: function() {
      if (typeof this._getValue == "function") {
        return this._getValue();
      }
      return this.getAttribute("value");
    },


    /**
     * Resets the value.
     */
    resetValue : function() {
      this.value = null;
    },


    /**
     * Event handler. Called when the {@link #change} event occurs.
     *
     * @param evt {Event} The native change event
     */
    _onChangeContent : function(evt) {
      this.value = evt.target.value;
    },


    /**
     * Event handler. Called when the {@link #input} event occurs.
     *
     * @param evt {Event} The native input event
     */
    _onInput : function(evt) {
      var data = evt.target.value;
      this.emit("keyInput", {value: data, target: this});
      if (this.liveUpdate) {
        this.value = data;
      }
    },


    /**
     * Fires the {@link #changeValue} event.
     *
     * @param value {var} The current value to fire.
     */
    __fireChangeValue : function(value) {
      if (this.__oldValue != value) {
        var old = this.__oldValue;
        this.__oldValue = value;
        this.emit("changeValue", {value: value, old: old, target: this});
      }
    },


    /**
     * Checks this item's value against the applied restrictions, e.g.
     * pattern, min, max, step
     * @return {Boolean} <code>true</code> if the item's value is valid
     */
    validate: function() {
      for (var prop in this) {
        if ((typeof this[prop] == "function") && prop.indexOf('_validate') === 0 ) {
          if (!this[prop]()) {
            this.valid = false;
            return;
          }
        }
      }
      this.valid = true;
    },


    /**
     * Check for the <code>required</code> property
     * @return {Boolean} <code>true</code> if the value passed the check
     */
    _validateRequired: function() {
      if (this.required && !this.value) {
        return false;
      }
      return true;
    },


    /**
     * Check for the badInput state, e.g. if a non-numerical value is
     * entered in a number field.
     * @return {Boolean} <code>true</code> if the value passed the check
     */
    _validateBadInput: function() {
      if (this[0].validity !== undefined) {
        return !this[0].validity.badInput;
      }
      return true;
    },


    /**
     * Updates the <code>valid</code> property if the
     * <code>required</code> property changes
     *
     * @param value {Boolean} new value
     * @param old {Boolean} previous value
     */
    _applyRequired: function(value, old) {
      // Required fields shouldn't initially be marked as invalid
      if (this.__oldValue !== undefined) {
        this.valid = this._validateRequired();
      }
    },


    /**
     * Adds/removes the <code>invalid</code> CSS class
     *
     * @param value {Boolean} new value
     * @param old {Boolean} previous value
     */
    _applyValid: function(value, old) {
      if (value) {
        this.removeClass("invalid");
      }
      else {
        this.addClass("invalid");
      }
    },


    _applyValidator: function(value, old) {
      this["_validateCustom"] = value;
      this.validate();
    },


    /**
     * Locale change event handler
     *
     * @signature function(e)
     * @param e {Event} the change event
     * TODO
     */
    __onChangeLocale : qx.core.Environment.select("qx.dynlocale", {
      "true" : function(e) {
        var validationMessage = this.validationMessage;
        if (validationMessage && validationMessage.translate) {
          this.validationMessage = validationMessage.translate();
        }
      },

      "false" : null
    }),


    disposeMForm : function() {
      if (qx.core.Environment.get("qx.dynlocale")) {
        qx.locale.Manager.getInstance().off("changeLocale", this.__onChangeLocale, this);
      }

      this.off("focus", this._onFocus,this);
      this.off("blur", this._onBlur,this);

      if (this._getTagName() == "input" || this._getTagName() == "textarea") {
        this.off("change", this._onChangeContent, this);
        this.off("input", this._onInput, this);
      }
    }
  }
});

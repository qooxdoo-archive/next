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
     * Fired when the item's value fails validation
     */
    invalid : null,

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
      set: "setValue",
      get: "getValue",
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
     * Returns the item's ValidityState.
     * See {@link https://developer.mozilla.org/en-US/docs/Web/API/ValidityState}
     */
    validity: {
      get: "_getValidity"
    },


    /**
     * A message describing why this item's value is invalid, or an empty
     * string if it's valid.
     * @type {Object}
     */
    validationMessage: {
      get: "_getValidationMessage"
    },

    /**
     * Whether the {@link #changeValue} event should be fired on every key
     * input. If set to true, the changeValue event is equal to the
     * {@link #input} event.
     */
    liveUpdate :
    {
      check : "Boolean",
      init : false
    }

  },


  members : {

    __oldValue : null,
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

      this.on("invalid", this._setInvalidState, this);
      this._setInvalidState();
      this.on("changeValue", this._setInvalidState, this);
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
    setValue: function(value)
    {
      if (this.__oldValue != value)
      {
        if (this.maxLength && typeof value === "string" &&
            value.length > this.maxLength) {
          value = value.substr(0, this.maxLength);
        }

        if (this._setValue) {
          this._setValue(value);
        } else {
          this.setAttribute("value", value);
        }
        this.__fireChangeValue(value);
      }
    },


    /**
     * Returns the set value.
     *
     * @return {var} The set value
     */
    getValue: function() {
      return this._getValue ? this._getValue() : this.getAttribute("value");
    },


    /**
     * Resets the value.
     */
    resetValue : function()
    {
      this.value = null;
    },


    /**
     * Event handler. Called when the {@link #changeValue} event occurs.
     *
     * @param evt {Event} The native change event
     */
    _onChangeContent : function(evt)
    {
      this.__fireChangeValue(evt.target.value);
    },


    /**
     * Event handler. Called when the {@link #input} event occurs.
     *
     * @param evt {Event} The native input event
     */
    _onInput : function(evt)
    {
      var data = evt.target.value;
      this.emit("keyInput", {value: data, target: this});
      if (this.liveUpdate) {
        if (this._setValue) {
          this._setValue(data);
        }
        this._setInvalidState();
      }
    },


    /**
    * Returns the caret position of this widget.
    * @return {Integer} the caret position.
    */
    _getCaretPosition : function() {
      var val = this[0].value;
      if(val && this.getAttribute("type") !== "number") {
        return val.slice(0, this[0].selectionStart).length;
      } else {
        return val.length;
      }
    },


    /**
     * Sets the caret position on this widget.
     * @param position {Integer} the caret position.
     */
    _setCaretPosition: function(position) {
      if (typeof position == "number" && this.hasFocus()) {
        if (this.getAttribute("type") !== "number" && this[0].setSelectionRange) {
          this[0].setSelectionRange(position, position);
        }
      }
    },


    /**
     * Fires the {@link #changeValue} event.
     *
     * @param value {var} The current value to fire.
     */
    __fireChangeValue : function(value)
    {
      if (this.__oldValue != value)
      {
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
    checkValidity: function() {
      return this[0].checkValidity();
    },


    /**
     * Mark this item as invalid with a custom error message
     * @param message {String} Message describing why the value is invalid
     */
    setCustomValidity: function(message) {
      this[0].setCustomValidity(message);
      this._setInvalidState();
    },


    /**
     * Adds the CSS class 'invalid' if this item's value failed validation
     */
    _setInvalidState: function() {
      if (this.validity && this.validity.valid === false) {
        this.addClass("invalid");
      } else {
        this.removeClass("invalid");
      }
    },


    /**
     * Maps the <code>required</code> property to the DOM attribute
     * @param value {Boolean} value
     */
    _applyRequired: function(value) {
      if (value) {
        this.setAttribute("required", true);
      } else {
        this.removeAttribute("required");
      }
      this._setInvalidState();
      if (this.validity &&  !this.validity.valid) {
        this.emit("invalid", this[0]);
      }
    },


    /**
     * Getter for the <code>validity</code> property
     * @return {Object} ValidityState object
     */
    _getValidity: function() {
      return this[0].validity;
    },


    /**
     * Getter for the <code>validationMessage</code> property
     * @return {String} validation message
     */
    _getValidationMessage: function() {
      return this[0].validationMessage;
    },


    /**
     * Locale change event handler
     *
     * @signature function(e)
     * @param e {Event} the change event
     * TODO
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
      this.off("invalid", this._setInvalidState, this);
      this.off("changeValue", this._setInvalidState, this);
      this.off("focus", this._onFocus,this);
      this.off("blur", this._onBlur,this);
    }
  }
});

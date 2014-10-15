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
 * The mixin contains all functionality to provide common properties for
 * text fields.
 */
qx.Mixin.define("qx.ui.mobile.form.MText",
{
  properties :
  {
    /**
     * Regular expression used to check the field's value
     * @type {Object}
     */
    pattern: {
      check: "String",
      init: null,
      nullable: true,
      apply: "_applyPattern",
      event: true
    },

   /**
     * Maximum number of characters that can be entered in the input field.
     */
    maxLength :
    {
      check : "Number",
      nullable : true,
      init : null,
      apply : "_applyMaxLength"
    },


    /**
     * String value which will be shown as a hint if the field is all of:
     * unset, unfocused and enabled. Set to <code>null</code> to not show a placeholder
     * text.
     */
    placeholder :
    {
      check : "String",
      nullable : true,
      init : null,
      apply : "_applyPlaceholder"
    },


    /** Whether the field is read only */
    readOnly :
    {
      check : "Boolean",
      nullable : true,
      init : null,
      apply : "_applyReadOnly"
    }
  },


  members :
  {

    _applyReadOnly : function(value) {
      this.setAttribute("readonly", value);
    },


    /**
     * Initializes this mixin. Should be called from the including class'
     * constructor.
     */
    initMText : function() {
      this.maxLength = undefined;
      this.placeholder = undefined;
      this.readOnly = undefined;
    },


    // property apply
    _applyMaxLength : function(value, old) {
      if (value) {
        this.setAttribute("maxlength", value);
        if (this.value && this.value.length > value) {
          this.value = this.value.substr(0, value);
        }
      } else {
        this.removeAttribute("maxlength");
      }
      this.valid = this._validateMaxLength();
    },


    // property apply
    _applyPlaceholder : function(value, old)
    {
      // Android is not able to indent placeholder.
      // Adding a space before the placeholder text, as a fix.
      if (qx.core.Environment.get("os.name") == "android" && value !== null) {
        value = " " + value;
      }
      this.setAttribute("placeholder", value);
    },


    _applyPattern: function(value) {
      this.setAttribute("pattern", value);
      this.valid = this._validatePattern();
    },


    /**
     * Checks if the value matches the pattern
     *
     * @return {Boolean} <code>true</code> if the pattern matches
     */
    _validatePattern: function() {
      return !this[0].validity.patternMismatch;
    },


    /**
     * Checks if the value's length exceeds the maxLength
     * @return {Boolean} <code>true</code> if the value passed the check
     */
    _validateMaxLength: function() {
      if (typeof this.value == "string" &&
          typeof this.maxLength == "number" &&
          this.value.length > this.maxLength) {
        return false;
      }
      return true;
    },


    /**
     * Points the focus of the form to this widget.
     */
    focus : function() {
      if(this.readOnly || this.enabled === false) {
        return;
      }

      var targetElement = this[0];
      if(targetElement) {
        targetElement.focus();
      }
    },


    /**
     * Removes the focus from this widget.
     */
    blur : function() {
      var targetElement = this[0];
      if(targetElement) {
        targetElement.blur();
      }
    }
  }
});

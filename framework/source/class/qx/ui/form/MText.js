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
qx.Mixin.define("qx.ui.form.MText",
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
      this._applyMaxLength(this.maxLength);
      this._applyPlaceholder(this.placeholder);
      this._applyReadOnly(this.readOnly);
    },


    // property apply
    _applyMaxLength : function(value) {
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
    _applyPlaceholder : function(value)
    {
      // Android is not able to indent placeholder.
      // Adding a space before the placeholder text, as a fix.
      if (qx.core.Environment.get("os.name") == "android" && value !== null) {
        value = " " + value;
      }
      this.setAttribute("placeholder", value);

      if (qx.core.Environment.get("browser.name") === "firefox" &&
          parseFloat(qx.core.Environment.get("browser.version")) < 36 &&
          this._getTagName() === "textarea" &&
          !this.isRendered())
      {
        this.once("addedToParent", function() {
          this.removeAttribute("placeholder")
            .setAttribute("placeholder", value);
        }, this);
      }
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
      if (this[0].validity !== undefined && this[0].validity.patternMismatch !== undefined) {
        return !this[0].validity.patternMismatch;
      }

      // empty string is considered valid
      if (typeof this.pattern !== "string" || !this.value) {
        return true;
      }

      return typeof this.value == "string" && !!this.value.match(this.pattern);
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
     * Validates the type of the input field.
     * @return {Boolean} <code>true</code>, if the validation succeeded.
     */
    _validateType: function() {
      if (this[0].validity !== undefined && this[0].validity.typeMismatch !== undefined) {
        return !this[0].validity.typeMismatch;
      }

      if (!this.value) {
        // empty string/null are considered valid
        return true;
      }

      if (this.type === "email") {
        try {
          qx.util.Validate.email(this.value);
          return true;
        } catch(ex) {
          if (ex instanceof qx.core.ValidationError) {
            return false;
          }
          throw ex;
        }
      }

      if (this.type === "url") {
        try {
          qx.util.Validate.url(this.value);
          return true;
        } catch(ex) {
          if (ex instanceof qx.core.ValidationError) {
            return false;
          }
          throw ex;
        }
      }

      return true;
    }
  }
});

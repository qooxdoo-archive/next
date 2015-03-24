"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)
     * Adrian Olaru (adrianolaru)

************************************************************************ */

/**
 * This static class contains a set of default validators.
 */
qx.Class.define("qx.util.Validate",
{
  statics :
  {
    /**
     * The function checks the incoming value to see if it is a number.
     * If not, a ValidationError will be thrown.
     *
     * @param value {var} The value to check.
     * @throws {qx.core.ValidationError} If the value parameter is not a
     *    finite number
     */
    number : function(value)
    {
      if ((typeof value !== "number" && (!(value instanceof Number)))
        || (!(isFinite(value))))
      {
        throw new qx.core.ValidationError("Validation Error",
          value + " is not a number.");
      }
    },


    /**
     * The function checks the incoming value to see if it is an email address.
     * If not, a ValidationError will be thrown.
     *
     * @param value {var} The value to check.
     * @throws {qx.core.ValidationError} If the value parameter is not
     *    a valid email address.
     */
    email : function(value)
    {
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,})$/;
      if (reg.test(value) === false) {
        throw new qx.core.ValidationError("Validation Error",
          "'" + value + "'' is not an email address.");
      }
    },


    /**
     * The function checks the incoming value to see if it is a string.
     * If not, an ValidationError will be thrown.
     *
     * @param value {var} The value to check.
     * @throws {qx.core.ValidationError} If the value parameter is not a string.
     */
    string : function(value)
    {
      if (typeof value !== "string" && (!(value instanceof String))) {
        throw new qx.core.ValidationError("Validation Error",
          value + " is not a string.");
      }
    },


    /**
     * The function checks the incoming value to see if it is an url.
     * If not, an ValidationError will be thrown.
     *
     * @param value {var} The value to check.
     * @throws {qx.core.ValidationError} If the value parameter is not an url.
     */
    url : function(value)
    {
      var reg = /([A-Za-z0-9])+:\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      if (!reg.test(value)) {
        throw new qx.core.ValidationError("Validation Error",
          value + " is not a valid URL.");
      }
    },


    /**
     * The function checks the incoming value to see if it is a color.
     * If not, a ValidationError will be thrown. The check itself will be
     * delegated to the {@link qx.util.ColorUtil#stringToRgb} method.
     *
     * @param value {var} The value to check.
     * @throws {qx.core.ValidationError} If the value parameter is not a color.
     */
    color : function(value)
    {
      try {
        qx.util.ColorUtil.stringToRgb(value);
      } catch (e) {
        throw new qx.core.ValidationError("Validation Error",
          value + " is not a color! " + e);
      }
    },


    /**
     * Checks if the number is in the given range.
     * The range includes the border values.
     * A range from 1 to 2 accepts the value 1 and all values up to and
     * including 2.
     * If the value is outside the range, a ValidationError will be thrown.
     *
     * @param value {var} The value to check
     * @param from {Number} The lower border of the range.
     * @param to {Number} The upper border of the range.
     */
    range : function(value, from, to)
    {
      if (value < from || value > to) {
        throw new qx.core.ValidationError("Validation Error",
          "The value " + value + " is not within the range from " +
          from + " until " + to);
      }
    },


    /**
     * Checks if the given value is in the array.
     * If the given value is not in the array, a ValidationError will
     * be thrown.
     *
     * @param value {var} The value to check
     * @param array {Array} The array holding the possibilities.
     */
    inArray : function(value, array)
    {
      if (array.indexOf(value) === -1) {
        throw new qx.core.ValidationError("Validation Error", value +
          " is not in the Array " + array);
      }
    },


    /**
     * Checks if the given value matches the RegExp.
     * For testing, the function uses the RegExp.test function.
     * If the value does not match the RegExp, a
     * ValidationError will be thrown.
     *
     * @param value {var} The value to check
     * @param reg {RegExp} The RegExp for the check.
     */
    regExp : function(value, reg)
    {
      if (!reg.test(value)) {
        throw new qx.core.ValidationError("Validation Error",
          value + " does not match " + reg);
      }
    }
  }
});

define(['qx/Class'], function(Dep0) {
var qx = {
  "Class": Dep0,
  "lang": {
    "Type": null
  }
};

"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/**
 * Utility class with type check for all native JavaScript data types.
 * @ignore(qx.data.*)
 * @ignore(qx.Interface.*)
 */
var clazz = qx.Class.define("qx.lang.Type",
{
  statics :
  {
    /**
     * Get the internal class of the value. See
     * http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
     * for details.
     *
     * @signature function(value)
     * @param value {var} value to get the class for
     * @return {String} the internal class of the value
     */
    getClass : qx.Class.getClass,


    /**
     * Whether the value is a string.
     *
     * @param value {var} Value to check.
     * @return {Boolean} Whether the value is a string.
     */
    isString : function(value)
    {
      // Added "value !== null" because IE throws an exception "Object expected"
      // by executing "value instanceof String" if value is a DOM element that
      // doesn't exist. It seems that there is an internal difference between a
      // JavaScript null and a null returned from calling DOM.
      // e.q. by document.getElementById("ReturnedNull").
      return (
        value !== null && (
        typeof value === "string" ||
        qx.Class.getClass(value) == "String" ||
        value instanceof String ||
        (!!value && !!value.$$isString))
      );
    },


    /**
     * Whether the value is an array.
     *
     * @param value {var} Value to check.
     * @return {Boolean} Whether the value is an array.
     */
    isArray : function(value)
    {
      // Added "value !== null" because IE throws an exception "Object expected"
      // by executing "value instanceof Array" if value is a DOM element that
      // doesn't exist. It seems that there is an internal difference between a
      // JavaScript null and a null returned from calling DOM.
      // e.q. by document.getElementById("ReturnedNull").
      return (
        value !== null && (
        value instanceof Array ||
        (value && qx.data && qx.data.IListData && qx.Interface.classImplements(value.constructor, qx.data.IListData) ) ||
        qx.Class.getClass(value) == "Array" ||
        (!!value && !!value.$$isArray))
      );
    },


    /**
     * Whether the value is an object. Note that built-in types like Window are
     * not reported to be objects.
     *
     * @param value {var} Value to check.
     * @return {Boolean} Whether the value is an object.
     */
    isObject : function(value) {
      return (
        value !== undefined &&
        value !== null &&
        qx.Class.getClass(value) == "Object"
      );
    },


    /**
     * Whether the value is a function.
     *
     * @param value {var} Value to check.
     * @return {Boolean} Whether the value is a function.
     */
    isFunction : function(value) {
      return qx.Class.getClass(value) == "Function";
    },


    /**
    * Whether the value is a regular expression.
    *
    * @param value {var} Value to check.
    * @return {Boolean} Whether the value is a regular expression.
    */
    isRegExp : function(value) {
      return this.getClass(value) == "RegExp";
    },


    /**
    * Whether the value is a number.
    *
    * @param value {var} Value to check.
    * @return {Boolean} Whether the value is a number.
    */
    isNumber : function(value) {
      // Added "value !== null" because IE throws an exception "Object expected"
      // by executing "value instanceof Number" if value is a DOM element that
      // doesn't exist. It seems that there is an internal different between a
      // JavaScript null and a null returned from calling DOM.
      // e.q. by document.getElementById("ReturnedNull").
      return (
        value !== null && (
        this.getClass(value) == "Number" ||
        value instanceof Number)
      );
    },


    /**
    * Whether the value is a boolean.
    *
    * @param value {var} Value to check.
    * @return {Boolean} Whether the value is a boolean.
    */
    isBoolean : function(value)
    {
      // Added "value !== null" because IE throws an exception "Object expected"
      // by executing "value instanceof Boolean" if value is a DOM element that
      // doesn't exist. It seems that there is an internal different between a
      // JavaScript null and a null returned from calling DOM.
      // e.q. by document.getElementById("ReturnedNull").
      return (
        value !== null && (
        this.getClass(value) == "Boolean" ||
        value instanceof Boolean)
      );
    },


    /**
     * Whether the value is a date.
     *
     * @param value {var} Value to check.
     * @return {Boolean} Whether the value is a date.
     */
    isDate : function(value)
    {
      // Added "value !== null" because IE throws an exception "Object expected"
      // by executing "value instanceof Date" if value is a DOM element that
      // doesn't exist. It seems that there is an internal different between a
      // JavaScript null and a null returned from calling DOM.
      // e.q. by document.getElementById("ReturnedNull").
      return (
        value !== null && (
        this.getClass(value) == "Date" ||
        value instanceof Date)
      );
    },


    /**
     * Whether the value is a Error.
     *
     * @param value {var} Value to check.
     * @return {Boolean} Whether the value is a Error.
     */
    isError : function(value)
    {
      // Added "value !== null" because IE throws an exception "Object expected"
      // by executing "value instanceof Error" if value is a DOM element that
      // doesn't exist. It seems that there is an internal different between a
      // JavaScript null and a null returned from calling DOM.
      // e.q. by document.getElementById("ReturnedNull").
      return (
        value !== null && (
        this.getClass(value) == "Error" ||
        value instanceof Error)
      );
    }
  }
});

 qx.lang.Type = clazz;
return clazz;
});

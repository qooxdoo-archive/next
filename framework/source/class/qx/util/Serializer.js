define(['qx/Class', 'qx/Interface', 'qx/lang/Type', 'qx/util/PropertyUtil'], function(Dep0,Dep1,Dep2,Dep3) {
var qx = {
  "Class": Dep0,
  "Interface": Dep1,
  "lang": {
    "Type": Dep2
  },
  "util": {
    "PropertyUtil": Dep3,
    "Serializer": null
  }
};

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
 * This is an util class responsible for serializing qooxdoo objects.
 *
 * @ignore(qx.data, qx.data.IListData)
 * @ignore(qxWeb)
 */
var clazz = qx.Class.define("qx.util.Serializer",
{
  statics :
  {
    /**
     * Serializes the properties of the given qooxdoo object. To get the
     * serialization working, every property needs to have a string
     * representation because the value of the property will be concatenated to the
     * serialized string.
     *
     * @param object {Object} Any qooxdoo object
     * @param qxSerializer {Function} Function used for serializing qooxdoo
     *   objects stored in the properties of the object. Check for the type of
     *   classes you want to serialize and return the serialized value. In all
     *   other cases, just return nothing.
     * @return {String} The serialized object.
     */
    toUriParameter : function(object, qxSerializer) // TODO use new properties
    {
      var result = "";
      var properties = qx.util.PropertyUtil.getAllProperties(object.constructor);

      for (var name in properties) {
        var value = object[name];

        // handle arrays
        if (qx.lang.Type.isArray(value) && (qxWeb && !(value instanceof qxWeb))) {
          var isdataArray = qx.data && qx.data.IListData &&
            qx.Interface.classImplements(value && value.constructor, qx.data.IListData);
          for (var i = 0; i < value.length; i++) {
            var valueAtI = isdataArray ? value.getItem(i) : value[i];
            result += this.__toUriParameter(name, valueAtI, qxSerializer);
          }
        } else {
          result += this.__toUriParameter(name, value, qxSerializer);
        }
      }
      return result.substring(0, result.length - 1);
    },


    /**
     * Helper method for {@link #toUriParameter}. Check for qooxdoo objects
     * and returns the serialized name value pair for the given parameter.
     *
     * @param name {String} The name of the value
     * @param value {var} The value itself
     * @param qxSerializer {Function} The serializer for qooxdoo objects.
     * @return {String} The serialized name value pair.
     */
    __toUriParameter : function(name, value, qxSerializer)
    {

      if (value && value.$$type == "Class") {
        value = value.classname;
      }

      if (value && (value.$$type == "Interface" || value.$$type == "Mixin")) {
        value = value.name;
      }

      var encValue;
      if (value && value.classname && value.$$name && qxSerializer) {
        encValue = encodeURIComponent(qxSerializer(value));
        if (encValue === undefined) {
          encValue = encodeURIComponent(value);
        }
      } else {
        encValue = encodeURIComponent(value);
      }
      return encodeURIComponent(name) + "=" + encValue + "&";
    },


    /**
     * Serializes the properties of the given qooxdoo object into a native
     * object.
     *
     * @param object {Object} Any qooxdoo object
     *
     * @param qxSerializer {Function}
     *   Function used for serializing qooxdoo objects stored in the propertys
     *   of the object. Check for the type of classes you want to serialize
     *   and return the serialized value. In all other cases, just return
     *   nothing.
     * @return {String}
     *   The serialized object.
     */
    toNativeObject : function(object, qxSerializer)
    {
      var result;

      // null or undefined
      if (object == null)
      {
        return null;
      }
      var i;
      // data array
      if (qx.data && qx.data.IListData && qx.Interface.classImplements(object.constructor, qx.data.IListData))
      {
        result = [];
        for (i = 0; i < object.getLength(); i++)
        {
          result.push(qx.util.Serializer.toNativeObject(
            object.getItem(i), qxSerializer)
          );
        }

        return result;
      }

      // return names for qooxdoo classes
      if (object.$$type == "Class") {
        return object.classname;
      }

      // return names for qooxdoo interfaces and mixins
      if (object.$$type == "Interface" || object.$$type == "Mixin") {
        return object.name;
      }

      // qooxdoo object
      if (object.classname && object.$$name) {
        if (qxSerializer) {
          var returnValue = qxSerializer(object);

          // if we have something returned, return that
          if (returnValue) {
            return returnValue;
          }

          // continue otherwise
        }

        result = {};

        var properties =
          qx.util.PropertyUtil.getAllProperties(object.constructor);

        for (var name in properties) {
          var value = object[name];
          result[name] = qx.util.Serializer.toNativeObject(
            value, qxSerializer
          );
        }

        return result;
      }

      // other arrays
      if (qx.lang.Type.isArray(object))
      {
        result = [];
        for (i = 0; i < object.length; i++)
        {
          result.push(qx.util.Serializer.toNativeObject(
            object[i], qxSerializer)
          );
        }

        return result;
      }

      // JavaScript objects
      if (qx.lang.Type.isObject(object))
      {
        result = {};

        for (var key in object)
        {
          result[key] = qx.util.Serializer.toNativeObject(
            object[key], qxSerializer
          );
        }

        return result;
      }

      // all other stuff, including String, Date, RegExp
      return object;
    },


    /**
     * Serializes the properties of the given qooxdoo object into a json object.
     *
     * @param object {Object} Any qooxdoo object
     * @param qxSerializer {Function?} Function used for serializing qooxdoo
     *   objects stored in the properties of the object. Check for the type of
     *   classes you want to serialize and return the serialized value. In all
     *   other cases, just return nothing.
     * @return {String} The serialized object.
     */
    toJson : function(object, qxSerializer) {
      var result = "";

      if (object === null || object === undefined) {
        return "null";
      }

      var i;
      // data array
      if (qx.data && qx.data.IListData && object.constructor &&
          qx.Interface.classImplements(object.constructor, qx.data.IListData))
      {
        result += "[";
        for (i = 0; i < object.getLength(); i++) {
          result += qx.util.Serializer.toJson(object.getItem(i), qxSerializer) + ",";
        }
        if (result != "[") {
          result = result.substring(0, result.length - 1);
        }
        return result + "]";
      }

      // return names for qooxdoo classes
      if (object.$$type == "Class") {
        return '"' + object.classname + '"';
      }

      // return names for qooxdoo interfaces and mixins
      if (object.$$type == "Interface" || object.$$type == "Mixin") {
        return '"' + object.name + '"';
      }

      // qooxdoo object
      if (object.classname && object.$$name) {
        if (qxSerializer) {
          var returnValue = qxSerializer(object);
          // if we have something returned, ruturn that
          if (returnValue) {
            return '"' + returnValue + '"';
          }
          // continue otherwise
        }
        result += "{";
        var properties = qx.util.PropertyUtil.getAllProperties(object.constructor);
        for (var name in properties) {
          var value = object[name];
          result += '"' + name + '":' + qx.util.Serializer.toJson(value, qxSerializer) + ",";
        }
        if (result != "{") {
          result = result.substring(0, result.length - 1);
        }
        return result + "}";
      }

      // other arrays
      if (qx.lang.Type.isArray(object)) {
        result += "[";
        for (i = 0; i < object.length; i++) {
          result += qx.util.Serializer.toJson(object[i], qxSerializer) + ",";
        }
        if (result != "[") {
          result = result.substring(0, result.length - 1);
        }
        return result + "]";
      }

      // javascript objects
      if (qx.lang.Type.isObject(object)) {
        result += "{";
        for (var key in object) {
          result += '"' + key + '":' +
                    qx.util.Serializer.toJson(object[key], qxSerializer) + ",";
        }
        if (result != "{") {
          result = result.substring(0, result.length - 1);
        }
        return result + "}";
      }

      // strings
      if (qx.lang.Type.isString(object)) {
        // escape
        object = object.replace(/([\\])/g, '\\\\');
        object = object.replace(/(["])/g, '\\"');
        object = object.replace(/([\r])/g, '\\r');
        object = object.replace(/([\f])/g, '\\f');
        object = object.replace(/([\n])/g, '\\n');
        object = object.replace(/([\t])/g, '\\t');
        object = object.replace(/([\b])/g, '\\b');

        return '"' + object + '"';
      }

      // Date and RegExp
      if (qx.lang.Type.isDate(object) || qx.lang.Type.isRegExp(object)) {
        return '"' + object + '"';
      }

      // all other stuff
      return object + "";
    }
  }
});

 qx.util.Serializer = clazz;
return clazz;
});

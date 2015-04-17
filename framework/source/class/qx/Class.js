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
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Martin Wittemann (martinwittemann)

************************************************************************ */

/**
 * Create namespace
 *
 * @ignore(qx.data)
 * @ignore(qx.data.IListData)
 * @ignore(qx.Interface.*)
 * @ignore(qx.Mixin.*)
 */

/**
 * Bootstrap qx.Class to create myself later
 * This is needed for the API browser etc. to let them detect me
 */
var tempClass = {

  /** @type {Map} allowed keys in non-static class definition */
  __allowedKeys : {
    "extend"     : ["Function"],  // Function
    "implement"  : ["Array", "Object"],    // Interface[]
    "include"    : ["Array", "Object"],    // Mixin[]
    "construct"  : ["Function"],  // Function
    "statics"    : ["Object"],    // Map
    "properties" : ["Object"],    // Map
    "members"    : ["Object"],    // Map
    "classDefined" : ["Function"],  // Function
    "events"     : ["Object"]     // Map
  },


  __classToTypeMap: {
    "[object String]": "String",
    "[object Array]": "Array",
    "[object Object]": "Object",
    "[object RegExp]": "RegExp",
    "[object Number]": "Number",
    "[object Boolean]": "Boolean",
    "[object Date]": "Date",
    "[object Function]": "Function",
    "[object Error]": "Error"
  },


  genericToString : function() {
    return "[Class " + this.classname + "]";
  },


  createNamespace : function(name, object)
  {
    var splits = name.split(".");
    var part = splits[0];
    var parent = qx.$$namespaceRoot && qx.$$namespaceRoot[part] ? qx.$$namespaceRoot : window;

    for (var i=0, len=splits.length-1; i<=len; i++, part=splits[i])
    {
      if (i === len) {
        if (parent[part] !== undefined) {
          // throw new Error("Illegal redefine of class: '"+name+"'.");
          console.warn("Illegal redefine of class: '"+name+"'.");
        }

        break;
      }

      if (!parent[part]) {
        parent = parent[part] = {};
      } else {
        parent = parent[part];
      }
    }

    // store object
    parent[part] = object;

    // return last part name (e.g. classname)
    return part;
  },

  getClass: function(value) {
    var classString = Object.prototype.toString.call(value);
    return (
      tempClass.__classToTypeMap[classString] ||
      classString.slice(8, -1)
    );
  },

  setDisplayName : function(fcn, classname, name)
  {
    fcn.displayName = classname + "." + name + "()";
  },


  setDisplayNames : function(functionMap, classname)
  {
    for (var name in functionMap)
    {
      var value = functionMap[name];
      if (value instanceof Function) {
        value.displayName = classname + "." + name + "()";
      }
    }
  },


  getByName : function(name, type) {
    if (typeof name !== "string") {
      return;
    }
    var parts = name.split(".");
    var obj = qx.$$namespaceRoot || window;
    for (var i=0, l=parts.length; i<l; i++) {
      obj = obj[parts[i]];
      if (!obj) {
        return;
      }
      if (i == parts.length - 1) {
        if (type && obj.$$type !== type) {
          return;
        }
        return obj;
      }
    }
  },


  "super" : function(name, varargs) {
    var id = name;
    // Provide consistency that construct will call native constructor
    if (name === "construct") {
      name = "constructor";
    } else if (name == "constructor") {
      id = "construct";
    }

    if (!this.$currentPrototpyes) {
      this.$currentPrototpyes = {};
    }
    if (!this.$currentPrototpyes[id]) {
      this.$currentPrototpyes[id] = [];
    }

    var last;
    if (this.$currentPrototpyes[id].length == 0) {
      last = this;
    } else {
      last = this.$currentPrototpyes[id][this.$currentPrototpyes[id].length -1];
    }

    do {
      last = Object.getPrototypeOf(last);
    } while(!last.hasOwnProperty(name) && !last.hasOwnProperty(id));
    this.$currentPrototpyes[id].push(last);

    var superMethod = Object.getPrototypeOf(last)[id] || Object.getPrototypeOf(last)[name];
    var returnValue;
    if (arguments.length === 1) {
      returnValue = superMethod.call(this);
    } else {
      returnValue = superMethod.apply(this, Array.prototype.slice.call(arguments, 1));
    }

    this.$currentPrototpyes[id].pop();

    return returnValue;
  },


  define : function(name, config)
  {
    if (!config) {
      config = { statics : {} };
    }

    tempClass.__validateConfig(name, config);

    var clazz;
    var proto = null;

    tempClass.setDisplayNames(config.statics, name);

    var i, l, keys;

    if (config.members || config.extend || config.properties) {
      tempClass.setDisplayNames(config.members, name + ".prototype");

      clazz = config.construct ||
        (config.extend ? qx.Class.__createDefaultConstructor() : function() {});
      clazz.$$name = clazz.classname = name;

      if (config.extend) {
        this.extendClass(clazz, clazz, config.extend, name);
      }

      var statics = config.statics || {};
      // use keys to include the shadowed in IE
      for (i = 0, keys = Object.keys(statics), l = keys.length; i < l; i++) {
        var key = keys[i];
        clazz[key] = statics[key];
      }

      proto = clazz.prototype;
      // Enable basecalls within constructor
      proto.super = qx.Class.super;
      proto.$$name = proto.classname = name;
      clazz.$$events = config.events || {};

      if (config.members) {
        qx.Class.addMembers(proto, config.members);
      }

      // property handling
      qx.Class.addProperties(proto, config.properties);

      // Include mixins
      // Must be the last here to detect conflicts
      if (config.include) {
        if (qx.Mixin) {
          var imclList = config.include;
          if (qx.Class.getClass(imclList) !== "Array") {
            imclList = [imclList];
          }
          for (i = 0, l = imclList.length; i < l; i++) {
            qx.Mixin.add(clazz, imclList[i], false);
          }
        } else {
          throw new Error("Class definition for '" + name + "' contains key 'include' but qx.Mixin is not available.");
        }
      }
    }
    else
    {
      clazz = config.statics || {};
      clazz.$$name = clazz.classname = name;

      // Merge class into former class (needed for 'optimize: ["statics"]')
      var formerClass = tempClass.getByName(name);
      if (formerClass) {
        // Add/overwrite properties and return early if necessary
        if (Object.keys(clazz).length !== 0) {
          // Execute classDefined to prevent too early overrides
          if (config.classDefined) {
            config.classDefined(clazz, proto);
          }

          for (var curProp in clazz) {
            formerClass[curProp] = clazz[curProp];
          }
          return formerClass;
        }
      }
    }

    // Store type info
    clazz.$$type = "Class";

    // Attach toString
    if (!clazz.hasOwnProperty("toString")) {
      clazz.toString = this.genericToString;
    }

    // Create namespace
    // var basename = name ? this.createNamespace(name, clazz) : "";
    var basename = name.split('.');
    basename = basename[basename.length - 1];
    clazz.basename = basename;

    // add property events
    if (config.properties) {
      for (var propName in config.properties) {
        var def = config.properties[propName];
        if (def.event) {
          if (!clazz.$$events) {
            clazz.$$events = {};
          }
          clazz.$$events["change" + qx.Class.firstUp(propName)] = "Map";
        }
      }
    }

    // Interface support
    if (config.implement) {
      if (qx.Interface) {
        var implList = config.implement;
        if (qx.Class.getClass(implList) !== "Array") {
          implList = [implList];
        }
        for (i = 0, l = implList.length; i < l; i++) {
          qx.Interface.add(clazz, implList[i]);
        }
      }
      else {
        throw new Error("Class definition for '" + name + "' contains key 'implements' but qx.Interface is not available.");
      }
    }

    // Execute classDefined section
    if (config.classDefined) {
      config.classDefined(clazz, proto);
    }

    return clazz;
  },


  __createDefaultConstructor : function()
  {
    function defaultConstructor() {
      defaultConstructor.super.apply(this, arguments);
    }

    defaultConstructor.$$isDefaultConstructor = true;

    return defaultConstructor;
  },


  __validateConfig : function(name, config) {
    for (var key in config) {
      if (!tempClass.__allowedKeys[key]) {
        throw new Error("The key '" + key +
          "' is not allowed in the class definition for '" + name + "'.");
      }
      if (tempClass.__allowedKeys[key].indexOf(tempClass.getClass(config[key])) == -1) {
        throw new Error("Illegal type of key '" + key +
          "' in the class definition for '" + name + "'. Must be '" +
          tempClass.__allowedKeys[key] + "'.");
      }
    }
  }
};


/**
 * TODO
 */
qx.Class.define("qx.Class",
{
  statics :
  {
    /** Timestamp of qooxdoo based application startup */
    LOADSTART : qx.$$start || new Date(),

    /**
     * Mapping for early use of the qx.debug environment setting.
     */
    DEBUG : (function() {
      // make sure to reflect all changes here to the environment class!
      var debug = true;
      if (qx.$$environment && qx.$$environment["qx.debug"] === false) {
        debug = false;
      }
      return debug;
    })(),


    addMembers : function(proto, members) {
      var key, member;

      // use keys to include the shadowed in IE
      for (var i=0, keys=Object.keys(members), l=keys.length; i<l; i++) {
        key = keys[i];

        if (proto[key] !== undefined && key.charAt(0) == "_" && key.charAt(1) == "_") {
          throw new Error('Overwriting private member "' + key + '" of Class "' + proto.classname + '" is not allowed!');
        }

        if (proto.hasOwnProperty(key)) {
          throw new Error('Overwriting member "' + key + '" of Class "' + proto.classname + '" is not allowed!');
        }

        member = members[key];

        // Enable basecalls for methods
        // Hint: proto[key] is not yet overwritten here
        if (member instanceof Function && proto[key]) {
          member.super = proto[key];
        }

        proto[key] = member;
      }
    },


    /**
     * TODO
     *
     * supported property keys: set, get, writable, nullable, apply, event, init, check
     */
    /* eslint no-shadow:0 */
    addProperties : function(proto, properties) {
      var propertyMap = {};
      if (!proto.$$properties) {
        proto.$$properties = {};
      } else {
        // copy parent class property definitions
        for (var propName in proto.$$properties) {
          propertyMap[propName] = {};
          for (var propKey in proto.$$properties[propName]) {
            propertyMap[propName][propKey] = proto.$$properties[propName][propKey];
          }
        }
      }

      proto.$$properties = propertyMap;

      for (var name in properties) {
        if (typeof proto[name] == "function") {
          throw new Error("Cannot add property '" + name + "' to class '" + proto.classname + "': A method with the same name already exists.");
        }

        var def = properties[name];
        if (!propertyMap[name]) {
          propertyMap[name] = def;
        } else {
          for (var key in def) {
            if (propertyMap[name][key] === undefined || key == "init") {
              propertyMap[name][key] = def[key];
            } else {
              throw new Error("Illegal definition for property '" + name + "' in class '" + proto.classname + "': Only the 'init' key may be overridden.");
            }
          }
          def = propertyMap[name];
        }

        if (propertyMap[name].init !== undefined) {
          proto["$$" + name] = propertyMap[name].init;
        }

        // custom getter/setter
        var getter = null;
        if (def.get instanceof Function) {
          getter = def.get;
        } else if (def.get) {
          // we can not use the function pointer directly due to extension
          getter = (function(name) {
            return function(value) {
              return this[name](value);
            };
          })(def.get);
        }

        var setter = null;
        if (def.set instanceof Function) {
          setter = def.set;
        } else if (def.set) {
          // we can not use the function pointer directly due to extension
          setter = (function(name) {
            return function(value) {
              return this[name](value);
            };
          })(def.set);
        }

        var descriptor = {
          enumerable : true,
          get : getter || (function(name, def) {
            return function() {
              var value = this["$$" + name];
              if (value === undefined && def.init !== undefined) {
                return def.init;
              }
              return value;
            };
          })(name, def),

          set : setter || (function(name, def) {
            return function(value) {
              // don't do anything if value is the same
              if (value === this["$$" + name]) {
                return;
              }

              // nullable
              if (!def.nullable && value === null) {
                if (!def.init || value !== undefined) {
                  throw new Error("Error in property '" + name + "' of class '" + this.classname + "': Null value is not allowed!");
                }
              }

              // check
              if (def.check) {
                var ok = true;
                if (typeof def.check == "string") {
                  if (this[def.check] instanceof Function) {
                    // check is a member method
                    ok = this[def.check].call(this, value);
                  } else {
                    var type = qx.Class.getClass(value);
                    if (!(def.nullable && type == "Null")) { // allow null for nullable properties
                      if (!(def.init !== undefined && type == "Undefined")) { // allow undefined as reset value
                        // check against built-in types
                        if (type !== def.check) {
                          var checkClass = qx.Class.getByName(def.check);
                          // check against class
                          if (!checkClass) {
                            throw new Error("Error in property '" + name + "' of class '" + this.classname + "': Type '" + def.check + "' is not defined!'");
                          }
                          // interface
                          if (checkClass.$$type == "Interface" && qx.Interface) {
                            if (!value.constructor || !qx.Interface.classImplements(value.constructor, checkClass)) {
                              throw new Error("Error in property '" + name + "' of class '" + this.classname + "': Value must implement '" + def.check + "'!");
                            }
                          }
                          // class
                          else if (!(value instanceof checkClass)) {
                            throw new Error("Error in property '" + name + "' of class '" + this.classname + "': Value must be '" + def.check + "' but is '" + type + "'!");
                          }
                        }
                      }
                    }
                  }
                } else if (def.check instanceof Function) {
                  // inline check function
                  ok = def.check.call(this, value);
                }

                if (!ok) {
                  throw new Error("Error in property '" + name + "' of class '" + this.classname + "': Custom check failed'!");
                }
              }

              // init value normalization
              var old = this["$$" + name];
              if (old === undefined) {
                old = def.init;
              }
              if (value === undefined) {
                value = def.init;
              }

              this["$$" + name] = value;

              // apply
              if (def.apply) {
                var applyMethod = def.apply instanceof Function ? def.apply : this[def.apply];
                applyMethod.call(this, value, old, name);
              }

              // event
              if (def.event) {
                var eventName = "change" + qx.Class.firstUp(name);
                if (this.emit) {
                  this.emit(eventName, {value: value, old: old, target: this});
                } else {
                  throw new Error("Error in property " + name + " of class '" + this.classname + "': Event could not be fired.");
                }
              }

            };
          }(name, def))
        };

        if (def.writable === false) {
          descriptor.value = def.init;
          descriptor.writable = false;
          // need to delete the accessors as they are not allowed
          delete descriptor.set;
          delete descriptor.get;
        }

        Object.defineProperty(proto, name, descriptor);
      }

      // generic setter
      if (properties && Object.keys(properties).length > 0 && !proto.set) {
        proto.set = function(map) {
          for (var key in map) {
            if (!(key in this) && qx.Class.DEBUG) {
              /* eslint no-console:0 */
              console.warn("The class '" + this.classname + "' does not support the property '" + key + "'.");
              continue;
            }
            this[key] = map[key];
          }
          return this;
        };
      }
    },


    /**
     * Creates a namespace and assigns the given object to it.
     *
     * @internal
     * @signature function(name, object)
     * @param name {String} The complete namespace to create. Typically, the last part is the class name itself
     * @param object {Object} The object to attach to the namespace
     * @return {String} last part of the namespace (which object is assigned to)
     * @throws {Error} when the given object already exists.
     */
    // createNamespace : qx.Class.createNamespace,


    /**
     * Offers the ability to change the root for creating namespaces from window to
     * whatever object is given.
     *
     * @param root {Object} The root to use.
     * @internal
     */
    setRoot : function(root) {
      qx.$$namespaceRoot = root;
    },

    /**
     * Call the same method of the super class.
     *
     * @signature function(name, varargs)
     * @param name {String} The menthod name to call.
     * @param varargs {var} variable number of arguments passed to the overwritten function
     * @return {var} the return value of the method of the base class.
     * @internal
     */
    "super" : tempClass.super,

    /**
     * Define a new class using the qooxdoo class system.
     *
     * @signature function(name, config)
     * @param name {String?} Name of the class. If null, the class will not be
     *   attached to a namespace.
     * @param config {Map ? null} Class definition structure. The configuration map has the following keys:
     *     <table>
     *       <tr><th>Name</th><th>Type</th><th>Description</th></tr>
     *       <tr><th>extend</th><td>Class</td><td>The super class the current class inherits from.</td></tr>
     *       <tr><th>construct</th><td>Function</td><td>The constructor of the class.</td></tr>
     *       <tr><th>statics</th><td>Map</td><td>Map of static values / functions of the class.</td></tr>
     *       <tr><th>members</th><td>Map</td><td>Map of instance members of the class.</td></tr>
     *       <tr><th>classDefined</th><td>Function</td><td>Function that is called at the end of
     *          processing the class declaration.</td></tr>
     *     </table>
     * @return {Class} The defined class.
     */
    define : tempClass.define,


    /**
     * Returns the default constructor.
     * This constructor just calls the constructor of the base class.
     *
     * @return {Function} The default constructor.
    */
    __createDefaultConstructor : tempClass.__createDefaultConstructor,


    /**
     * Validates an incoming configuration and checks for proper keys and values
     *
     * @signature function(name, config)
     * @param name {String} The name of the class
     * @param config {Map} Configuration map
     */
    __validateConfig : tempClass.__validateConfig,


    /**
     * Sets the display name of the given function
     *
     * @signature function(fcn, classname, name)
     * @param fcn {Function} the function to set the display name for
     * @param classname {String} the name of the class the function is defined in
     * @param name {String} the function name
     * @internal
     */
    setDisplayName : tempClass.setDisplayName,


    /**
     * Set the names of all functions defined in the given map
     *
     * @signature function(functionMap, classname)
     * @param functionMap {Object} a map with functions as values
     * @param classname {String} the name of the class, the functions are
     *   defined in
     * @internal
     */
    setDisplayNames : tempClass.setDisplayNames,

    /**
     * This method will be attached to all classes to return
     * a nice identifier for them.
     *
     * @internal
     * @signature function()
     * @return {String} The class identifier
     */
    genericToString : tempClass.genericToString,


    /**
     * Inherit a class from a super class.
     *
     * @param clazz {Function} The class's wrapped constructor
     * @param construct {Function} The unwrapped constructor
     * @param superClass {Function} The super class
     * @param name {Function} fully qualified class name
     * @internal
     */
    extendClass : function(clazz, construct, superClass, name)
    {
      var superproto = superClass.prototype;

      // Use helper function/class to save the unnecessary constructor call while
      // setting up inheritance.
      var Helper = function() {};
      Helper.prototype = superproto;
      var proto = new Helper();

      // Apply prototype to new Helper instance
      clazz.prototype = proto;

      // Store names in prototype
      proto.$$name = proto.classname = name;

      /*
        - Store base constructor to constructor-
        - Store reference to extend class
      */
      construct.super = superClass;
      clazz.superclass = superClass;

      /*
        - Store statics/constructor onto constructor/prototype
        - Store correct constructor
        - Store statics onto prototype
      */
      construct.self = clazz.constructor = proto.constructor = clazz;
    },


    /**
     * Find a class, interface or mixin by its name
     *
     * @param name {String} class name to resolve
     * @param type {String?} Optional type filter. One of "Class", "Interface", "Mixin"
     * @return {Class} the class
     */
    getByName : tempClass.getByName,


    /**
     * Whether a class is a direct or indirect sub class of another class,
     * or both classes coincide.
     *
     * @param clazz {Class} the class to check.
     * @param superClass {Class} the potential super class
     * @return {Boolean} whether clazz is a sub class of superClass.
     */
    isSubClassOf : function(clazz, superClass)
    {
      if (!clazz) {
        return false;
      }

      if (clazz == superClass) {
        return true;
      }

      if (clazz.prototype instanceof superClass) {
        return true;
      }

      return false;
    },


    /**
     * Returns the type of an event declared on the given class.
     *
     * @param clazz {Function} The class to check.
     * @param eventName {String} The name of the event.
     * @return {String|undefined} The type of the event data or undefined if not declared.
     */
    getEventType : function(clazz, eventName) {
      var baseClass = clazz;
      while (baseClass) {
        if (baseClass.$$events && baseClass.$$events[eventName] !== undefined) {
          return baseClass.$$events[eventName];
        }
        baseClass = baseClass.superclass;
      }
    },


    /**
     * Checks if the given class supports a property with the given name
     * @param clazz {Function}  Class
     * @param propertyName {String} Property name
     * @return {Boolean} <code>true</code> if the class supports the property
     */
    hasProperty : function(clazz, propertyName) {
      return !!((clazz.$$properties && clazz.$$properties[propertyName]) ||
        (clazz.prototype.$$properties && clazz.prototype.$$properties[propertyName]));
    },


    /**
     * Returns the amount of arguments supported by the given constructor.
     *
     * @param constr {Function} constructor function
     * @return {Number} arguments length
     * @internal
     */
    getConstructorArgumentsCount : function(constr) {
      // get the first non-default constructor in the inheritance hierarchy
      while (constr.$$isDefaultConstructor) {
        constr = constr.superclass;
      }
      // parse the function to get the arguments count
      var index = 0;
      var match = /function\s*\((.*?)\)/g.exec(Function.prototype.toString.call(constr));
      if (match && match[1]) {
        index = Math.max(match[1].split(",").length - 1, 0);
      }
      return index;
    },

    curryConstructor : function(clazz, args) {
      // Set the context for the 'bind' call (will be replaced by new)
      Array.prototype.unshift.call(args, null);
      // Create temporary constructor with bound arguments
      return clazz.bind.apply(clazz, args);
    },

    /*
    ---------------------------------------------------------------------------
      STRING UTILITY FUNCTIONS
    ---------------------------------------------------------------------------
    */


    /**
     * Convert the first character of the string to upper case.
     *
     * @param str {String} the string
     * @return {String} the string with an upper case first character
     * @internal
     */
    firstUp : function(str) {
      return str.charAt(0).toUpperCase() + str.substr(1);
    },


    /**
     * Mapping from JavaScript string representation of objects to names
     * @internal
     * @type {Map}
     */
    __classToTypeMap : tempClass.__classToTypeMap,


    /**
     * Get the internal class of the value. See
     * http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
     * for details.
     *
     * @param value {var} value to get the class for
     * @return {String} the internal class of the value
     * @internal
     */
    getClass : tempClass.getClass,


    /*
    ---------------------------------------------------------------------------
      LOGGING UTILITY FUNCTIONS
    ---------------------------------------------------------------------------
    */

    $$logs : [],


    /**
     * Sending a message at level "debug" to the logger.
     *
     * @param object {Object} Contextual object (either instance or static class)
     * @param message {var} Any number of arguments supported. An argument may
     *   have any JavaScript data type. All data is serialized immediately and
     *   does not keep references to other objects.
     */
    /* eslint no-unused-vars:0 */
    debug : function(object, message) {
      qx.Class.$$logs.push(["debug", arguments]);
    },


    /**
     * Sending a message at level "info" to the logger.
     *
     * @param object {Object} Contextual object (either instance or static class)
     * @param message {var} Any number of arguments supported. An argument may
     *   have any JavaScript data type. All data is serialized immediately and
     *   does not keep references to other objects.
     */
    /* eslint no-unused-vars:0 */
    info : function(object, message) {
      qx.Class.$$logs.push(["info", arguments]);
    },


    /**
     * Sending a message at level "warn" to the logger.
     *
     * @param object {Object} Contextual object (either instance or static class)
     * @param message {var} Any number of arguments supported. An argument may
     *   have any JavaScript data type. All data is serialized immediately and
     *   does not keep references to other objects.
     */
    /* eslint no-unused-vars:0 */
    warn : function(object, message) {
      qx.Class.$$logs.push(["warn", arguments]);
    },


    /**
     * Sending a message at level "error" to the logger.
     *
     * @param object {Object} Contextual object (either instance or static class)
     * @param message {var} Any number of arguments supported. An argument may
     *   have any JavaScript data type. All data is serialized immediately and
     *   does not keep references to other objects.
     */
    /* eslint no-unused-vars:0 */
    error : function(object, message) {
      qx.Class.$$logs.push(["error", arguments]);
    },


    /**
     * Prints the current stack trace at level "info"
     *
     * @param object {Object} Contextual object (either instance or static class)
     */
    /* eslint no-unused-vars:0 */
    trace : function(object) {}
  }
});

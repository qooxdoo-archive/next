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
 * @ignore(qx.util.OOUtil)
 * @ignore(qx.event.*)
 * @ignore(qx.Interface.*)
 * @ignore(qx.Mixin.*)
 */
if (!window.qx) {
  window.qx = {};
}

/**
 * Bootstrap qx.Bootstrap to create myself later
 * This is needed for the API browser etc. to let them detect me
 */
qx.Bootstrap = {

  /** @type {Map} allowed keys in non-static class definition */
  __allowedKeys : {
    "extend"     : ["Function"],  // Function
    "implement"  : ["Array", "Object"],    // Interface[]
    "include"    : ["Array", "Object"],    // Mixin[]
    "construct"  : ["Function"],  // Function
    "statics"    : ["Object"],    // Map
    "properties" : ["Object"],    // Map
    "members"    : ["Object"],    // Map
    "defer"      : ["Function"],  // Function
    "events"     : ["Object"]     // TODO: remove
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

    for (var i=0, len=splits.length-1; i<len; i++, part=splits[i])
    {
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
      qx.Bootstrap.__classToTypeMap[classString] ||
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


  base : function(args, varargs)
  {
    if (qx.Bootstrap.DEBUG) {
      if (!(args.callee.base instanceof Function)) {
        throw new Error(
          "Cannot call super class. Method is not derived: " +
          args.callee.displayName
        );
      }
    }

    if (arguments.length === 1) {
      return args.callee.base.call(this);
    } else {
      return args.callee.base.apply(this, Array.prototype.slice.call(arguments, 1));
    }
  },


  define : function(name, config)
  {
    if (!config) {
      config = { statics : {} };
    }

    qx.Bootstrap.__validateConfig(name, config);

    var clazz;
    var proto = null;

    qx.Bootstrap.setDisplayNames(config.statics, name);

    if (config.members || config.extend || config.properties) {
      qx.Bootstrap.setDisplayNames(config.members, name + ".prototype");

      clazz = config.construct || new Function();
      clazz.name = clazz.classname = name;

      if (config.extend) {
        this.extendClass(clazz, clazz, config.extend, name, basename);
      }

      var statics = config.statics || {};
      // use keys to include the shadowed in IE
      for (var i=0, keys=Object.keys(statics), l=keys.length; i<l; i++) {
        var key = keys[i];
        clazz[key] = statics[key];
      }

      proto = clazz.prototype;
      // Enable basecalls within constructor
      proto.base = qx.Bootstrap.base;
      proto.name = proto.classname = name;

      if (config.members) {
        qx.Bootstrap.addMembers(proto, config.members, false);
      }

      // property handling
      qx.Bootstrap.addProperties(proto, config.properties);

      // Include mixins
      // Must be the last here to detect conflicts
      if (config.include) {
        if (qx.Mixin) {
          var imclList = config.include;
          if (qx.Bootstrap.getClass(imclList) !== "Array") {
            imclList = [imclList];
          }
          for (var i=0, l=imclList.length; i<l; i++) {
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
      clazz.name = clazz.classname = name;

      // Merge class into former class (needed for 'optimize: ["statics"]')
      var formerClass = qx.Bootstrap.getByName(name);
      if (formerClass) {
        // Add/overwrite properties and return early if necessary
        if (Object.keys(clazz).length !== 0) {
          // Execute defer to prevent too early overrides
          if (config.defer) {
            config.defer(clazz, proto);
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
    var basename = name ? this.createNamespace(name, clazz) : "";
    clazz.basename = basename;

    if (config.events) {
      //this.addEvents(clazz, config.events); TODO?
    }

    // add property events
    if (config.properties) {
      for (var propName in config.properties) {
        var def = config.properties[propName];
        if (def.event) {
          if (!clazz.$$events) {
            clazz.$$events = {};
          }
          clazz.$$events["change" + qx.Bootstrap.firstUp(propName)] = "qx.event.type.Data";
        }
      }
    }

    // Interface support
    if (config.implement) {
      if (qx.Interface) {
        var implList = config.implement;
        if (qx.Bootstrap.getClass(implList) !== "Array") {
          implList = [implList];
        }
        for (var i=0, l=implList.length; i<l; i++) {
          qx.Interface.add(clazz, implList[i]);
        }
      }
      else {
        throw new Error("Class definition for '" + name + "' contains key 'implements' but qx.Interface is not available.");
      }
    }

    // Execute defer section
    if (config.defer) {
      config.defer(clazz, proto);
    }

    // Store class reference in global class registry
    if (name != null) {
      qx.Bootstrap.$$registry[name] = clazz;
    }

    return clazz;
  },


  __validateConfig : function(name, config) {
    for (var key in config) {
      if (!qx.Bootstrap.__allowedKeys[key]) {
        throw new Error("The key '" + key +
          "' is not allowed in the class definition for '" + name + "'.");
      }
      if (qx.Bootstrap.__allowedKeys[key].indexOf(qx.Bootstrap.getClass(config[key])) == -1) {
        throw new Error("Illegal type of key '" + key +
          "' in the class definition for '" + name + "'. Must be '" +
          qx.Bootstrap.__allowedKeys[key] + "'.");
      }
    }
  }
};


/**
 * Internal class that is responsible for bootstrapping the qooxdoo
 * framework at load time.
 */
qx.Bootstrap.define("qx.Bootstrap",
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


    addMembers : function(proto, members, patch) {
      var key, member;

      // use keys to include the shadowed in IE
      for (var i=0, keys=Object.keys(members), l=keys.length; i<l; i++) {
        key = keys[i];

        if (proto[key] !== undefined && key.charAt(0) == "_" && key.charAt(1) == "_") {
          throw new Error('Overwriting private member "' + key + '" of Class "' + proto.classname + '" is not allowed!');
        }

        if (patch !== true && proto.hasOwnProperty(key)) {
          throw new Error('Overwriting member "' + key + '" of Class "' + proto.classname + '" is not allowed!');
        }

        member = members[key];

        // Enable basecalls for methods
        // Hint: proto[key] is not yet overwritten here
        if (member instanceof Function && proto[key]) {
          member.base = proto[key];
        }

        proto[key] = member;
      }
    },

    addProperties : function(proto, properties) {
      if (!proto.$$properties) {
        proto.$$properties = {};
      }
      for (var name in properties) {
        var def = properties[name];
        proto.$$properties[name] = def;

        Object.defineProperty(proto, name, {

          get : (function(name, def) {
            return function() {
              var value = this["$$" + name];
              if (value === undefined && def.init !== undefined) {
                return def.init;
              } else if (value === undefined && !def.nullable) {
                throw new Error("Error in property '" + name + "' of class '" + this.classname + "': Not (yet) initialized!");
              }
              return value;
            };
          })(name, def),

          set : (function(name, def) {
            return function(value) {
              // nullable
              if (!def.nullable && value === null) {
                if (!def.init || value !== undefined) {
                  throw new Error("Error in property '" + name + "' of class '" + this.classname + "': Null value is not allowed!");
                }
              }

              // check
              if (def.check) {
                // TODO: classes and interfaces
                var ok = true;
                if (typeof def.check == "string") {
                  if (this[def.check] instanceof Function) {
                    ok = this[def.check].call(this, value);
                  } else {
                    var type = qx.Bootstrap.getClass(value);
                    if (type !== def.check) {
                      throw new Error("Error in property '" + name + "' of class '" + this.classname + "': Value must be '" + def.check + "' but is '" + type + "'!");
                    }
                  }
                } else if (def.check instanceof Function) {
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

              // apply
              if (def.apply) {
                var applyMethod = def.apply instanceof Function ? def.apply : this[def.apply];
                applyMethod.call(this, value, old, name);
              }

              // event
              if (def.event) {
                var eventName = "change" + qx.Bootstrap.firstUp(name);
                if (this.emit) {
                  this.emit(eventName, {value: value, old: old});
                } else if (this.fireEvent && qx.event && qx.event.type && qx.event.type.Data) {
                  this.fireEvent(eventName, qx.event.type.Data, [value, old]);
                } else {
                  throw new Error("Error in property " + name + " of class '" + this.classname + "': Event could not be fired.");
                }
              }

              this["$$" + name] = value;
            };
          }(name, def))
        });
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
    createNamespace : qx.Bootstrap.createNamespace,


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
     * @signature function(args, varargs)
     * @param args {arguments} the arguments variable of the calling method
     * @param varargs {var} variable number of arguments passed to the overwritten function
     * @return {var} the return value of the method of the base class.
     * @internal
     */
    base : qx.Bootstrap.base,

    /**
     * Define a new class using the qooxdoo class system.
     * Lightweight version of {@link qx.Class#define} with less features.
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
     *       <tr><th>defer</th><td>Function</td><td>Function that is called at the end of
     *          processing the class declaration.</td></tr>
     *     </table>
     * @return {Class} The defined class.
     */
    define : qx.Bootstrap.define,


    /**
     * Validates an incoming configuration and checks for proper keys and values
     *
     * @signature function(name, config)
     * @param name {String} The name of the class
     * @param config {Map} Configuration map
     */
    __validateConfig : qx.Bootstrap.__validateConfig,


    /**
     * Removes a class from qooxdoo defined by {@link #define}
     *
     * @param name {String} Name of the class
     */
    undefine : function(name)
    {
      // first, delete the class from the registry
      delete this.$$registry[name];
      // delete the class reference from the namespaces and all empty namespaces
      var ns = name.split(".");

      var splits = name.split(".");
      var part = splits[0];

      // build up an array containing all namespace objects including the namespace root
      var objects = qx.$$namespaceRoot ? [qx.$$namespaceRoot] : [window];
      for (var i = 0; i < ns.length; i++) {
        objects.push(objects[i][ns[i]]);
      }

      // go through all objects and check for the constructor or empty namespaces
      for (var i = objects.length - 1; i >= 1; i--) {
        var last = objects[i];
        var parent = objects[i - 1];
        if (qx.lang.Type.isFunction(last) || Object.keys(last).length === 0) {
          delete parent[ns[i - 1]];
        } else {
          break;
        }
      }
    },


    /**
     * Sets the display name of the given function
     *
     * @signature function(fcn, classname, name)
     * @param fcn {Function} the function to set the display name for
     * @param classname {String} the name of the class the function is defined in
     * @param name {String} the function name
     * @internal
     */
    setDisplayName : qx.Bootstrap.setDisplayName,


    /**
     * Set the names of all functions defined in the given map
     *
     * @signature function(functionMap, classname)
     * @param functionMap {Object} a map with functions as values
     * @param classname {String} the name of the class, the functions are
     *   defined in
     * @internal
     */
    setDisplayNames : qx.Bootstrap.setDisplayNames,

    /**
     * This method will be attached to all classes to return
     * a nice identifier for them.
     *
     * @internal
     * @signature function()
     * @return {String} The class identifier
     */
    genericToString : qx.Bootstrap.genericToString,


    /**
     * Inherit a clazz from a super class.
     *
     * This function differentiates between class and constructor because the
     * constructor written by the user might be wrapped and the <code>base</code>
     * property has to be attached to the constructor, while the <code>superclass</code>
     * property has to be attached to the wrapped constructor.
     *
     * @param clazz {Function} The class's wrapped constructor
     * @param construct {Function} The unwrapped constructor
     * @param superClass {Function} The super class
     * @param name {Function} fully qualified class name
     * @param basename {Function} the base name
     * @internal
     */
    extendClass : function(clazz, construct, superClass, name, basename)
    {
      var superproto = superClass.prototype;

      // Use helper function/class to save the unnecessary constructor call while
      // setting up inheritance.
      var helper = new Function();
      helper.prototype = superproto;
      var proto = new helper();

      // Apply prototype to new helper instance
      clazz.prototype = proto;

      // Store names in prototype
      proto.name = proto.classname = name;
      proto.basename = basename;

      /*
        - Store base constructor to constructor-
        - Store reference to extend class
      */
      construct.base = superClass;
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
    getByName : qx.Bootstrap.getByName,


    /** @type {Map} Stores all defined classes */
    $$registry : {},


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
    __classToTypeMap : qx.Bootstrap.__classToTypeMap,


    /**
     * Get the internal class of the value. See
     * http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
     * for details.
     *
     * @param value {var} value to get the class for
     * @return {String} the internal class of the value
     * @internal
     */
    getClass : qx.Bootstrap.getClass,


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
    debug : function(object, message) {
      qx.Bootstrap.$$logs.push(["debug", arguments]);
    },


    /**
     * Sending a message at level "info" to the logger.
     *
     * @param object {Object} Contextual object (either instance or static class)
     * @param message {var} Any number of arguments supported. An argument may
     *   have any JavaScript data type. All data is serialized immediately and
     *   does not keep references to other objects.
     */
    info : function(object, message) {
      qx.Bootstrap.$$logs.push(["info", arguments]);
    },


    /**
     * Sending a message at level "warn" to the logger.
     *
     * @param object {Object} Contextual object (either instance or static class)
     * @param message {var} Any number of arguments supported. An argument may
     *   have any JavaScript data type. All data is serialized immediately and
     *   does not keep references to other objects.
     */
    warn : function(object, message) {
      qx.Bootstrap.$$logs.push(["warn", arguments]);
    },


    /**
     * Sending a message at level "error" to the logger.
     *
     * @param object {Object} Contextual object (either instance or static class)
     * @param message {var} Any number of arguments supported. An argument may
     *   have any JavaScript data type. All data is serialized immediately and
     *   does not keep references to other objects.
     */
    error : function(object, message) {
      qx.Bootstrap.$$logs.push(["error", arguments]);
    },


    /**
     * Prints the current stack trace at level "info"
     *
     * @param object {Object} Contextual object (either instance or static class)
     */
    trace : function(object) {}
  }
});

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

************************************************************************ */

/**
 * This class is used to define interfaces (similar to Java interfaces).
 *
 * See the description of the {@link #define} method how an interface is
 * defined.
 * @require(qx.Interface#define)
 */
qx.Class.define("qx.Interface",
{
  statics :
  {
    /*
    ---------------------------------------------------------------------------
       PUBLIC API
    ---------------------------------------------------------------------------
    */

    /**
     * Define a new interface. Interface definitions look much like class definitions.
     *
     * The main difference is that the bodies of functions defined in <code>members</code>
     * and <code>statics</code> are called before the original function with the
     * same arguments. This can be used to check the passed arguments. If the
     * checks fail, an exception should be thrown. It is convenient to use the
     * method defined in {@link qx.core.MAssert} to check the arguments.
     *
     * In the <code>build</code> version the checks are omitted.
     *
     * For properties only the names are required so the value of the properties
     * can be empty maps.
     *
     * Example:
     * <pre class='javascript'>
     * qx.Interface.define("name",
     * {
     *   extend: [SuperInterfaces],
     *
     *   statics:
     *   {
     *     PI : 3.14
     *   },
     *
     *   properties: {"color": {}, "name": {} },
     *
     *   members:
     *   {
     *     meth1: function() {},
     *     meth2: function(a, b) { this.assertArgumentsCount(arguments, 2, 2); },
     *     meth3: function(c) { this.assertInterface(c.constructor, qx.some.Interface); }
     *   },
     *
     *   events :
     *   {
     *     keydown : "qx.event.type.KeySequence"
     *   }
     * });
     * </pre>
     *
     * @param name {String} name of the interface
     * @param config {Map ? null} Interface definition structure. The configuration map has the following keys:
     *   <table>
     *     <tr><th>Name</th><th>Type</th><th>Description</th></tr>
     *     <tr><th>extend</th><td>Interface |<br>Interface[]</td><td>Single interface or array of interfaces this interface inherits from.</td></tr>
     *     <tr><th>members</th><td>Map</td><td>Map of members of the interface.</td></tr>
     *     <tr><th>statics</th><td>Map</td><td>
     *         Map of statics of the interface. The statics will not get copied into the target class.
     *         This is the same behaviour as statics in mixins ({@link qx.Mixin#define}).
     *     </td></tr>
     *     <tr><th>properties</th><td>Map</td><td>Map of properties and their definitions.</td></tr>
     *     <tr><th>events</th><td>Map</td><td>Map of event names and the corresponding event class name.</td></tr>
     *   </table>
     *
     * @return {qx.Interface} The configured interface
     */
    define : function(name, config)
    {
      var iface = {};
      if (config)
      {
        // Normalize include
        if (config.extend && !(qx.Class.getClass(config.extend) === "Array")) {
          config.extend = [config.extend];
        }

        // Validate incoming data
        if (qx.core.Environment.get("qx.debug")) {
          this.__validateConfig(name, config);
        }

        // Create interface from statics
        iface = config.statics ? config.statics : {};

        // Attach configuration
        if (config.extend) {
          iface.$$extends = config.extend;
        }

        if (config.properties) {
          iface.$$properties = config.properties;
        }

        if (config.members) {
          iface.$$members = config.members;
        }

        if (config.events) {
          iface.$$events = config.events;
        }
      }

      // Add Basics
      iface.$$type = "Interface";
      iface.name = name;

      // Attach toString
      iface.toString = this.genericToString;

      // Assign to namespace
      iface.basename = name ? qx.Class.createNamespace(name, iface) : "";

      // Return final interface
      return iface;
    },


    /**
     * Add a single interface to a class
     *
     * @param clazz {Class} class to add interface to
     * @param iface {Interface} the Interface to add
     */
    add : function(clazz, iface)
    {
      if (qx.core.Environment.get("qx.debug")) {
        var ifaces = [iface];

        if (iface.$$extends) {
          ifaces = ifaces.concat(iface.$$extends);
        }

        for (var i=0, l=ifaces.length; i<l; i++) {
          if (!qx.Interface.__checkMembers(clazz, ifaces[i]) ||
              !qx.Interface.__checkProperties(clazz, ifaces[i])) {
            throw new Error("Class '" + clazz.classname +
                "' does not implement the interface '" + iface.name + "'.");
          }
        }

      }

      // Store interface reference
      var list = qx.Interface.flatten([iface]);
      if (clazz.$$implements) {
        clazz.$$implements.push(iface);
        clazz.$$flatImplements.push.apply(clazz.$$flatImplements, list);
      }
      else {
        clazz.$$implements = [iface];
        clazz.$$flatImplements = list;
      }
    },


    /**
     * Generates a list of all interfaces including their super interfaces
     * (resolved recursively)
     *
     * @param ifaces {Interface[] ? []} List of interfaces to be resolved
     * @return {Array} List of all interfaces
     * @internal
     */
    flatten : function(ifaces)
    {
      if (!ifaces) {
        return [];
      }

      // we need to create a copy and not to modify the existing array
      var list = ifaces.concat();

      for (var i=0, l=ifaces.length; i<l; i++)
      {
        if (ifaces[i].$$extends) {
          list.push.apply(list, this.flatten(ifaces[i].$$extends));
        }
      }

      return list;
    },


    /**
     * Check interface members
     *
     * @param clazz {Class} class of the object
     * @param iface {Interface} the interface to verify
     */
    __checkMembers : function(clazz, iface)
    {
      // Validate members
      var members = iface.$$members;
      if (members) {
        for (var key in members) {
          if (qx.lang.Type.isFunction(members[key])) {
            if (!qx.lang.Type.isFunction(clazz.prototype[key])) {
              return false;
            }
          }
        }
      }
      return true;
    },


    /**
     * Assert properties
     *
     * @param clazz {Class} class to check interface for
     * @param iface {Interface} the interface to verify
     */
    __checkProperties : function(clazz, iface)
    {
      if (iface.$$properties) {
        for (var key in iface.$$properties) {
          var currentClass = clazz;
          var found = false;
          while (currentClass) {
            if (currentClass.$$properties && currentClass.$$properties[key] ||
              currentClass.prototype.$$properties && currentClass.prototype.$$properties[key]) {
              found = true;
              currentClass = null;
            } else {
              currentClass = currentClass.superclass;
            }
          }
          if (!found) {
            return false;
          }
        }
      }
      return true;
    },


    /**
     * Checks if an interface is implemented by a class
     *
     * @param clazz {Class} class to check interface for
     * @param iface {Interface} the interface to verify
     * @param wrap {Boolean ? false} wrap functions required by interface to
     *     check parameters etc.
     */
    assert : function(clazz, iface, wrap)
    {
      if (!this.__checkMembers(clazz, iface, wrap, true) ||
          !this.__checkProperties(clazz, iface, true)) {
        throw new Error("Class '" + clazz.classname +
          "' does not implement the interface '" + iface.name + "'.");
      }

      // Validate extends, recursive
      var extend = iface.$$extends;
      if (extend)
      {
        for (var i=0, l=extend.length; i<l; i++) {
          this.assert(clazz, extend[i], wrap);
        }
      }
    },


    /**
     * Tests whether an interface is implemented by a class, without throwing an
     * exception when it doesn't.
     *
     * @param clazz {Class} class to check interface for
     * @param iface {Interface} the interface to verify
     * @return {Boolean} <code>true</code> if interface is implemented
     */
    classImplements : function(clazz, iface) {
      if (!this.__checkMembers(clazz, iface) ||
          !this.__checkProperties(clazz, iface)) {
        return false;
      }

      // Validate extends, recursive
      var extend = iface.$$extends;
      if (extend) {
        for (var i=0, l=extend.length; i<l; i++) {
          if (!this.classImplements(clazz, extend[i])) {
            return false;
          }
        }
      }

      return true;
    },



    /*
    ---------------------------------------------------------------------------
       PRIVATE/INTERNAL API
    ---------------------------------------------------------------------------
    */

    /**
     * This method will be attached to all interface to return
     * a nice identifier for them.
     *
     * @internal
     * @return {String} The interface identifier
     */
    genericToString : function() {
      return "[Interface " + this.name + "]";
    },


    /** @type {Map} allowed keys in interface definition */
    __allowedKeys : qx.core.Environment.select("qx.debug",
    {
      "true":
      {
        "extend"     : "object", // Interface | Interface[]
        "statics"    : "object", // Map
        "members"    : "object", // Map
        "properties" : "object", // Map
        "events"     : "object"  // Map
      },

      "default" : null
    }),


    /**
     * Validates incoming configuration and checks keys and values
     *
     * @signature function(name, config)
     * @param name {String} The name of the class
     * @param config {Map} Configuration map
     */
    __validateConfig : qx.core.Environment.select("qx.debug",
    {
      "true": function(name, config)
      {
        if (qx.core.Environment.get("qx.debug"))
        {
          // Validate keys
          var allowed = this.__allowedKeys;

          for (var key in config)
          {
            if (allowed[key] === undefined) {
              throw new Error('The configuration key "' + key + '" in class "' + name + '" is not allowed!');
            }

            if (config[key] == null) {
              throw new Error("Invalid key '" + key + "' in interface '" + name + "'! The value is undefined/null!");
            }

            if (allowed[key] !== null && typeof config[key] !== allowed[key]) {
              throw new Error('Invalid type of key "' + key + '" in interface "' + name + '"! The type of the key must be "' + allowed[key] + '"!');
            }
          }

          // Validate maps
          var maps = [ "statics", "members", "properties", "events" ];
          for (var i=0, l=maps.length; i<l; i++)
          {
            key = maps[i];

            if (config[key] !== undefined &&
                ([
                   "Array",
                   "RegExp",
                   "Date"
                 ].indexOf(qx.Class.getClass(config[key])) != -1 ||
                 config[key].classname !== undefined)) {
              throw new Error('Invalid key "' + key + '" in interface "' + name + '"! The value needs to be a map!');
            }
          }

          // Validate extends
          if (config.extend)
          {
            var a;
            for (i = 0, a = config.extend, l = a.length; i<l; i++)
            {
              if (a[i] == null) {
                throw new Error("Extends of interfaces must be interfaces. The extend number '" + i+1 + "' in interface '" + name + "' is undefined/null!");
              }

              if (a[i].$$type !== "Interface") {
                throw new Error("Extends of interfaces must be interfaces. The extend number '" + i+1 + "' in interface '" + name + "' is not an interface!");
              }
            }
          }

          // Validate statics
          if (config.statics)
          {
            for (key in config.statics)
            {
              if (key.toUpperCase() !== key) {
                throw new Error('Invalid key "' + key + '" in interface "' + name + '"! Static constants must be all uppercase.');
              }

              switch(typeof config.statics[key])
              {
                case "boolean":
                case "string":
                case "number":
                  break;

                default:
                  throw new Error('Invalid key "' + key + '" in interface "' + name + '"! Static constants must be all of a primitive type.');
              }
            }
          }
        }
      },

      "default" : function() {}
    })
  }
});

"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (wittemann)

************************************************************************ */

/**
 * The Core module's responsibility is to query the DOM for elements and offer
 * these elements as a collection. The Core module itself does not offer any methods to
 * work with the collection. These methods are added by the other included modules,
 * such as Manipulating or Attributes.
 *
 * Core also provides the plugin API which allows modules to attach either
 * static functions to the global <code>q</code> object or define methods on the
 * collection it returns.
 *
 * By default, the core module is assigned to a global module named <code>q</code>.
 * In case <code>q</code> is already defined, the name <code>qxWeb</code>
 * is used instead.
 *
 * For further details, take a look at the documentation in the
 * <a href='http://manual.qooxdoo.org/${qxversion}/pages/website.html' target='_blank'>user manual</a>.
 *
 * @ignore(q)
 *
 * @group (Core)
 */
qx.Class.define("qxWeb", {
  extend : qx.type.BaseArray,
  statics : {
    // internal storage for all initializers
    _init : [],

    // internal reference to the used qx namespace
    $$qx : qx,

    /**
     * Internal helper to initialize collections.
     *
     * @param arg {var} An array of Elements which will
     *   be initialized as {@link q}. All items in the array which are not
     *   either a window object, a DOM element node or a DOM document node will
     *   be ignored.
     * @param clazz {Class} The class of the new collection.
     * @return {q} A new initialized collection.
     */
    $init : function(arg, clazz, forceNew) {
      // restore widget instance
      if (!forceNew && arg.length && arg.length == 1 && arg[0] && arg[0].$$widget) {
        return arg[0].$$widget;
      }

      var clean = [];
      for (var i = 0; i < arg.length; i++) {
        // check for node or window object
        var isNode = !!(arg[i] && (arg[i].nodeType === 1 ||
          arg[i].nodeType === 9 || arg[i].nodeType === 11));
        if (isNode) {
          clean.push(arg[i]);
          continue;
        }
        var isWindow = !!(arg[i] && arg[i].history && arg[i].location && arg[i].document);
        if (isWindow) {
          clean.push(arg[i]);
        }
      }

      var col;
      if (arg.length === 1 && arg[0] && arg[0].getAttribute && arg[0].getAttribute("data-qx-widget")) {
        clazz = qx.Class.getByName(arg[0].getAttribute("data-qx-widget")) || clazz;
        // add DOM element as last widget constructor argument
        var index = qx.Class.getConstructorArgumentsCount(clazz);
        var args = [];
        args[index] = clean[0];
        var Temp = qx.Class.curryConstructor(clazz, args);
        col = new Temp();
      } else {
        col = qx.lang.Array.cast(clean, clazz);
      }

      for (i = 0; i < qxWeb._init.length; i++) {
        qxWeb._init[i].call(col);
      }

      return col;
    },


    /**
     * This is an API for module development and can be used to attach new methods
     * to {@link q}.
     *
     * @param module {Map} A map containing the methods to attach.
     * @param override {Boolean?false} Force to override
     */
    $attach : function(module, override) {
      for (var name in module) {
        if (qxWeb.prototype[name] != undefined && Array.prototype[name] == undefined && override !== true) {
          if (qx.core.Environment.get("qx.debug")) {
            throw new Error("Method '" + name + "' already available.");
          }
        } else {
          qxWeb.prototype[name] = module[name];
        }
      }
    },


    /**
     * This is an API for module development and can be used to attach new methods
     * to {@link q}.
     *
     * @param module {Map} A map containing the methods to attach.
     */
    $attachStatic : function(module, override) {
      for (var name in module) {
        if (qx.core.Environment.get("qx.debug")) {
          if (qxWeb[name] != undefined && override !== true) {
            throw new Error("Method '" + name + "' already available as static method.");
          }
        }
        qxWeb[name] = module[name];
      }
    },


    /**
     * This is an API for module development and can be used to attach new initialization
     * methods to {@link q} which will be called when a new collection is
     * created.
     *
     * @param init {Function} The initialization method for a module.
     */
    $attachInit : function(init) {
      this._init.push(init);
    },


    /**
     * Define a new class using the qooxdoo class system.
     *
     * @param name {String?} Name of the class. If null, the class will not be
     *   attached to a namespace.
     * @param config {Map ? null} Class definition structure. The configuration map has the following keys:
     *     <table>
     *       <thead>
     *         <tr><th>Name</th><th>Type</th><th>Description</th></tr>
     *       </thead>
     *       <tr><td>extend</td><td>Class</td><td>The super class the current class inherits from.</td></tr>
     *       <tr><td>construct</td><td>Function</td><td>The constructor of the class.</td></tr>
     *       <tr><td>statics</td><td>Map</td><td>Map of static values / functions of the class.</td></tr>
     *       <tr><td>members</td><td>Map</td><td>Map of instance members of the class.</td></tr>
     *       <tr><td>defer</td><td>Function</td><td>Function that is called at the end of
     *          processing the class declaration.</td></tr>
     *     </table>
     * @return {Function} The defined class.
     */
    define : function(name, config) {
      if (config == undefined) {
        config = name;
        name = null;
      }
      return qx.Class.define.call(qx.Class, name, config);
    }
  },


  /**
   * Primary usage:
   * Accepts a selector string and returns a collection of found items. The optional context
   * element can be used to reduce the amount of found elements to children of the
   * context element. If the context object is a collection, its first item is used.
   *
   * Secondary usage:
   * Creates a collection from an existing DOM element, document node or window object
   * (or an Array containing any such objects)
   *
   * <a href="http://sizzlejs.com/" target="_blank">Sizzle</a> is used as selector engine.
   * Check out the <a href="https://github.com/jquery/sizzle/wiki/Sizzle-Home" target="_blank">documentation</a>
   * for more details.
   *
   * @param selector {String|Element|Document|Window|Array} Valid selector (CSS3 + extensions),
   *   window object, DOM element/document or Array of DOM Elements.
   * @param context {Element|q} Only the children of this element are considered.
   * @return {q} A collection of DOM elements.
   */
  construct : function(selector, context) {
    if (!selector && this instanceof qxWeb) {
      return this;
    }

    if (!selector) {
      selector = [];
    }
    else if (qx.lang.Type.isString(selector)) {
      if (context instanceof qxWeb && context.length != 0) {
        context = context[0];
      }
      if (context instanceof qxWeb) {
        selector = [];
      } else {
        selector = qx.bom.Selector.query(selector, context);
      }
    }
    else if ((selector.nodeType === 1 || selector.nodeType === 9 ||
      selector.nodeType === 11) ||
      (selector.history && selector.location && selector.document))
    {
      selector = [selector];
    }
    return qxWeb.$init(selector, qxWeb);
  },


  members : {
    /**
     * Gets a new collection containing only those elements that passed the
     * given filter. This can be either a selector expression or a filter
     * function.
     *
     * @param selector {String|Function} Selector expression or filter function
     * @return {q} New collection containing the elements that passed the filter
     */
    filter : function(selector) {
      var arr;
      if (qx.lang.Type.isFunction(selector)) {
        arr = Array.prototype.filter.call(this, selector);
      } else {
        arr = qx.bom.Selector.matches(selector, this);
      }
      return qxWeb.$init(arr, qxWeb, true);
    },


    /**
     * Recreates a collection which is free of all duplicate elements from the original.
     *
     * @return {q} Returns a copy with no duplicates
     */
    unique : function() {
      var unique = qx.lang.Array.unique(this);
      return qxWeb.$init(unique, qxWeb, true);
    },


    /**
     * Returns a copy of the collection within the given range.
     *
     * @param begin {Number} The index to begin.
     * @param end {Number?} The index to end.
     * @return {q} A new collection containing a slice of the original collection.
     */
    slice : function(begin, end) {
      // Old IEs return an empty array if the second argument is undefined
      // check 'end' explicit for "undefined" [BUG #7322]
      if (end !== undefined) {
        return qxWeb.$init(Array.prototype.slice.call(this, begin, end), qxWeb, true);
      }
      return qxWeb.$init(Array.prototype.slice.call(this, begin), qxWeb, true);
    },


    /**
     * Removes the given number of items and returns the removed items as a new collection.
     * This method can also add items. Take a look at the
     * <a href='https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/splice' target='_blank'>documentation of MDN</a> for more details.
     *
     * @param index {Number} The index to begin.
     * @param howMany {Number} the amount of items to remove.
     * @param varargs {var} As many items as you want to add.
     * @return {q} A new collection containing the removed items.
     */
    /* eslint no-unused-vars:0 */
    splice : function(index, howMany, varargs) {
      return qxWeb.$init(Array.prototype.splice.apply(this, arguments), qxWeb, true);
    },


    /**
     * Returns a new collection containing the modified elements. For more details, check out the
     * <a href='https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/map' target='_blank'>MDN documentation</a>.
     *
     * @param callback {Function} Function which produces the new element.
     * @param thisarg {var} Context of the callback.
     * @return {q} New collection containing the elements that passed the filter
     */
    /* eslint no-unused-vars:0 */
    map : function(callback, thisarg) {
      return qxWeb.$init(Array.prototype.map.apply(this, arguments), qxWeb, true);
    },


    /**
     * Returns a copy of the collection including the given elements.
     * @param varargs {var} As many items as you want to add.
     * @return {q} A new collection containing all items.
     */
    /* eslint no-unused-vars:0 */
    concat : function(varargs) {
      var clone = Array.prototype.slice.call(this, 0);
      for (var i=0; i < arguments.length; i++) {
        if (arguments[i] instanceof qxWeb) {
          clone = clone.concat(Array.prototype.slice.call(arguments[i], 0));
        } else {
          clone.push(arguments[i]);
        }
      }
      return qxWeb.$init(clone, qxWeb, true);
    },


    /**
     * Returns the index of the given element within the current
     * collection or -1 if the element is not in the collection
     * @param elem {Element|Element[]|qxWeb} Element or collection of elements
     * @return {Number} The element's index
     */
    indexOf : function(elem) {
      if (!elem) {
        return -1;
      }

      if (qx.lang.Type.isArray(elem)) {
        elem = elem[0];
      }

      for (var i=0, l=this.length; i<l; i++) {
        if (this[i] === elem) {
          return i;
        }
      }

      return -1;
    },


    /**
     * Calls the browser's native debugger to easily allow debugging within
     * chained calls.
     *
     * @return {q} The collection for chaining
     * @ignore(debugger)
     */
    debug : function() {
      /* eslint no-debugger:0 */
      debugger;
      return this;
    },


    /**
     * Calls a function for each DOM element or document fragment in the collection.
     *
     * @param func {Function} Callback function. Will be called with three arguments:
     * The element, the element's index within the collection and the collection itself.
     * @param ctx {Object} The context for the callback function (default: The collection)
     * @return {q} The collection for chaining
     */
    forEach: function (func, ctx) {
      for (var i = 0, l = this.length; i < l; i++) {
        func.apply(ctx || this, [qxWeb(this[i]), i, this]);
      }
      return this;
    },


    /**
     * Calls a function for each DOM element. This is used for DOM manipulations which can't be
     * applied to document nodes or window objects.
     *
     * @param func {Function} Callback function. Will be called with three arguments:
     * The element, the element's index within the collection and the collection itself.
     * @param ctx {Object} The context for the callback function (default: The collection)
     * @return {q} The collection for chaining
     */
    _forEachElement: function (func, ctx) {
      for (var i = 0, l = this.length; i < l; i++) {
        if (this[i] && (this[i].nodeType === 1 || this[i].nodeType === 11)) {
          func.apply(ctx || this, [this[i], i, this]);
        }
      }
      return this;
    }
  },

  /**
   * @ignore(q)
   */
  classDefined : function(statics) {
    if (window.q == undefined) {
      window.q = statics;
    }
  }
});

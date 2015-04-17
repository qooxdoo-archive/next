define(['qx/Class', 'qx/lang/Array', 'qx/core/Assert', 'qx/core/Environment'], function(Dep0,Dep1,Dep2,Dep3) {
var qx = {
  "Class": Dep0,
  "lang": {
    "Array": Dep1,
    "Function": null
  },
  "core": {
    "Assert": Dep2,
    "Environment": Dep3
  }
};

/* eslint strict:0 */
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

   ======================================================================

   This class contains code based on the following work:

   * Mootools
     http://mootools.net
     Version 1.1.1

     Copyright:
       2007 Valerio Proietti

     License:
       MIT: http://www.opensource.org/licenses/mit-license.php

************************************************************************ */

/**
 * Collection of helper methods operating on functions.
 *
 * @require(qx.lang.Array)
 */
var clazz = qx.Class.define("qx.lang.Function",
{
  statics :
  {
    /**
     * Extract the caller of a function from the arguments variable.
     *
     * @param args {arguments} The local arguments variable
     * @return {Function} A reference to the calling function or "undefined" if caller is not supported.
     */
    getCaller : function(args) {
      return args.caller ? args.caller.callee : args.callee.caller;
    },


    /**
     * Try to get a sensible textual description of a function object.
     * This may be the class/mixin and method name of a function
     * or at least the signature of the function.
     *
     * @param fcn {Function} function the get the name for.
     * @return {String} Name of the function.
     */
    getName : function(fcn)
    {
      if (fcn.displayName) {
        return fcn.displayName;
      }

      if (fcn.$$original || fcn.wrapper || fcn.classname) {
        return fcn.classname + ".constructor()";
      }

      if (fcn.self)
      {
        var clazz = fcn.self.constructor;
        if (clazz)
        {
          // members
          for(var key in clazz.prototype)
          {
            if (clazz.prototype[key] == fcn) {
              return clazz.classname + ".prototype." + key + "()";
            }
          }
          // statics
          for(key in clazz)
          {
            if (clazz[key] == fcn) {
              return clazz.classname + "." + key + "()";
            }
          }
        }
      }

      var fcnReResult = fcn.toString().match(/function\s*(\w*)\s*\(.*/);
      if (fcnReResult && fcnReResult.length >= 1 && fcnReResult[1]) {
        return fcnReResult[1] + "()";
      }

      return 'anonymous()';
    },


    /**
     * Evaluates JavaScript code globally
     *
     * @lint ignoreDeprecated(eval)
     *
     * @param data {String} JavaScript commands
     * @return {var} Result of the execution
     */
    globalEval : function(data)
    {
      if (window.execScript) {
        return window.execScript(data);
      } else {
        return eval.call(window, data);
      }
    },


    /**
     * Base function for creating functional closures which is used by most other methods here.
     *
     * @param func {Function} Original function to wrap
     * @param options {Map?} Map of options
     *
     * <ul>
     * <li><strong>self</strong>: The object that the "this" of the function will refer to. Default is the same as the wrapper function is called.</li>
     * <li><strong>args</strong>: An array of arguments that will be passed as arguments to the function when called.
     *     Default is no custom arguments; the function will receive the standard arguments when called.</li>
     * <li><strong>delay</strong>: If set, the returned function will delay the actual execution by this amount of milliseconds and return a timer handle when called.
     *     Default is no delay.</li>
     * <li><strong>periodical</strong>: If set the returned function will periodically perform the actual execution with this specified interval
     *      and return a timer handle when called. Default is no periodical execution.</li>
     * <li><strong>attempt</strong>: If set to true, the returned function will try to execute and return either the results or false on error. Default is false.</li>
     * </ul>
     *
     * @return {Function} Wrapped function
     */
    create : function(func, options)
    {
      if (qx.core.Environment.get("qx.debug")) {
        qx.core.Assert && qx.core.Assert.assertFunction(func, "Invalid parameter 'func'.");
      }

      // Nothing to be done when there are no options.
      if (!options) {
        return func;
      }

      // Check for at least one attribute.
      if (!(options.self || options.args || options.delay != null || options.periodical != null || options.attempt)) {
        return func;
      }

      return function()
      {
        // Convert (and copy) incoming arguments
        var args = qx.lang.Array.fromArguments(arguments);

        // Prepend static arguments
        if (options.args) {
          args = options.args.concat(args);
        }

        if (options.delay || options.periodical)
        {
          var returns = function() {
            return func.apply(options.self||this, args);
          };

          if (options.delay) {
            return window.setTimeout(returns, options.delay);
          }

          if (options.periodical) {
            return window.setInterval(returns, options.periodical);
          }
        }
        else if (options.attempt)
        {
          var ret = false;

          try {
            ret = func.apply(options.self||this, args);
          } catch(ex) {}

          return ret;
        }
        else
        {
          return func.apply(options.self||this, args);
        }
      };
    },


    /**
     * Returns a function whose "this" is altered.
     *
     * If you find yourself using this static method a lot, you may be
     * interested in the bindTo() method in the mixin qx.core.MBindTo.
     *
     * @see qx.core.MBindTo
     *
     * @param func {Function} Original function to wrap
     * @param self {Object ? null} The object that the "this" of the function will refer to.
     * @param varargs {arguments ? null} The arguments to pass to the function.
     * @return {Function} The bound function.
     */
    /* eslint no-unused-vars:0 */
    bind : function(func, self, varargs)
    {
      return this.create(func,
      {
        self  : self,
        args  : arguments.length > 2 ? qx.lang.Array.fromArguments(arguments, 2) : null
      });
    },


    /**
     * Returns a function whose arguments are pre-configured.
     *
     * @param func {Function} Original function to wrap
     * @param varargs {arguments} The arguments to pass to the function.
     * @return {var} The pre-configured function.
     */
    /* eslint no-unused-vars:0 */
    curry : function(func, varargs)
    {
      return this.create(func, {
        args  : arguments.length > 1 ? qx.lang.Array.fromArguments(arguments, 1) : null
      });
    },


    /**
     * Returns a function which could be used as a listener for a native event callback.
     *
     * @param func {Function} Original function to wrap
     * @param self {Object ? null} The object that the "this" of the function will refer to.
     * @param varargs {arguments} The arguments to pass to the function.
     * @return {var} The bound function.
     */
    /* eslint no-unused-vars:0 */
    listener : function(func, self, varargs)
    {
      if (arguments.length < 3)
      {
        return function(event)
        {
          // Directly execute, but force first parameter to be the event object.
          return func.call(self||this, event||window.event);
        };
      }
      else
      {
        var optargs = qx.lang.Array.fromArguments(arguments, 2);

        return function(event)
        {
          var args = [event||window.event];

          // Append static arguments
          args.push.apply(args, optargs);

          // Finally execute original method
          func.apply(self||this, args);
        };
      }
    },


    /**
     * Tries to execute the function.
     *
     * @param func {Function} Original function to wrap
     * @param self {Object ? null} The object that the "this" of the function will refer to.
     * @param varargs {arguments ? null} The arguments to pass to the function.
     * @return {Boolean|var} <code>false</code> if an exception is thrown, else the function's return.
     */
    /* eslint no-unused-vars:0 */
    attempt : function(func, self, varargs)
    {
      return this.create(func,
      {
        self    : self,
        attempt : true,
        args    : arguments.length > 2 ? qx.lang.Array.fromArguments(arguments, 2) : null
      })();
    },


    /**
     * Delays the execution of a function by a specified duration.
     *
     * @param func {Function} Original function to wrap
     * @param delay {Integer} The duration to wait (in milliseconds).
     * @param self {Object ? null} The object that the "this" of the function will refer to.
     * @param varargs {arguments} The arguments to pass to the function.
     * @return {Integer} The JavaScript Timeout ID (useful for clearing delays).
     */
    /* eslint no-unused-vars:0 */
    delay : function(func, delay, self, varargs)
    {
      return this.create(func,
      {
        delay : delay,
        self  : self,
        args  : arguments.length > 3 ? qx.lang.Array.fromArguments(arguments, 3) : null
      })();
    },


    /**
     * Executes a function in the specified intervals of time
     *
     * @param func {Function} Original function to wrap
     * @param interval {Integer} The duration of the intervals between executions.
     * @param self {Object ? null} The object that the "this" of the function will refer to.
     * @param varargs {arguments} The arguments to pass to the function.
     * @return {Integer} The Interval ID (useful for clearing a periodical).
     */
    /* eslint no-unused-vars:0 */
    periodical : function(func, interval, self, varargs)
    {
      return this.create(func,
      {
        periodical : interval,
        self       : self,
        args       : arguments.length > 3 ? qx.lang.Array.fromArguments(arguments, 3) : null
      })();
    }
  }
});

 qx.lang.Function = clazz;
return clazz;
});

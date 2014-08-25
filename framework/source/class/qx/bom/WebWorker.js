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
     * Adrian Olaru (adrianolaru)

************************************************************************ */


/**
 * EXPERIMENTAL - NOT READY FOR PRODUCTION
 *
 * Web Workers allows us to run JavaScript in parallel on a web page,
 * without blocking the user interface. A 'worker' is just another script
 * file that will be loaded and executed in the background.
 *
 * For more information see:
 * http://www.w3.org/TR/workers/
 */
qx.Bootstrap.define("qx.bom.WebWorker",
{
  extend : Object,
  include : [qx.event.MEmitter],


  /**
   * Create a new instance.
   *
   * @param src {String} The path to worker as an URL
   */
  construct: function(src) {
    this.__isNative = qx.core.Environment.get("html.webworker"); // only IE9
    this.__isNative ? this.__initNative(src) : this.__initFake(src);
  },


  events :
  {
    /** Fired when worker sends a message */
    "message": "var",

    /** Fired when an error occurs */
    "error": "Error"
  },


  members :
  {
    _worker : null,
    _handleErrorBound : null,
    _handleMessageBound : null,

    __isNative : true,
    __fake : null,



    /**
     * Initialize the native worker
     * @param src {String} The path to worker as an URL
     */
    __initNative: function(src) {
      this._worker = new window.Worker(src);
      this._handleMessageBound = qx.lang.Function.bind(this._handleMessage, this);
      this._handleErrorBound = qx.lang.Function.bind(this._handleError, this);

      this._worker.addEventListener("message", this._handleMessageBound);
      this._worker.addEventListener("error", this._handleErrorBound);
    },

    /**
     * Initialize the fake worker
     * @param src {String} The path to worker as an URL
     * @lint ignoreDeprecated(eval)
     */
    __initFake: function(src) {
      var that = this;
      var req = new qx.bom.request.Xhr();
      req.onload = function() {
        that.__fake = (function() {
          var postMessage = function(e) {
            that.emit('message', e);
          };
          //set up context vars before evaluating the code
          eval("var onmessage = null, postMessage = " + postMessage + ";" +
            req.responseText);

          //pick the right onmessage because of the uglifier
          return {
            onmessage: eval("onmessage"),
            postMessage: postMessage
          };
        })();
      };

      req.open("GET", src, false);
      req.send();
    },


    /**
     * Send a message to the worker.
     * @param msg {String} the message
     */
    postMessage: function(msg) {
      var that = this;

      if (this.__isNative) {
        this._worker.postMessage(msg);
      } else {
        setTimeout(function() {
          try {
            that.__fake.onmessage && that.__fake.onmessage({data: msg});
          } catch (ex) {
            that.emit("error", ex);
          }
        }, 0);
      }
    },


    /**
     * Message handler
     * @param e {Event} message event
     */
    _handleMessage: function(e) {
      this.emit("message", e.data);
    },


    /**
     * Error handler
     * @param e {Event} error event
     */
    _handleError: function(e) {
      this.emit("error", e.message);
    },


    dispose : function() {
      if (this.__isNative) {
        qx.bom.Event.removeNativeListener(this._worker, "message", this._handleMessageBound);
        qx.bom.Event.removeNativeListener(this._worker, "error", this._handleErrorBound);
        if (this._worker) {
          this._worker.terminate();
          this._worker = null;
        }
      } else {
        if (this.__fake) {
          this.__fake = null;
        }
      }
    }
  }
});

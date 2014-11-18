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
     * Tristan Koch (tristankoch)

************************************************************************ */

/**
 * Query JSONP services using the script element. Requests may be cross-origin.
 *
 * Configuration of the request is done with properties. Events are fired for
 * various states in the life cycle of a request, such as "success". Request
 * data is transparently processed.
 *
 * For an introduction to JSONP, please refer to
 * <a href="http://ajaxian.com/archives/jsonp-json-with-padding">Ajaxian.com</a>.
 *
 * Here is how to request a JSON file from a REST service and listen to
 * the "success" event:
 *
 * <pre class="javascript">
 * var req = new qx.io.request.Jsonp();
 * req.url = "http://feeds.delicious.com/v2/json/popular";
 *
 * // Some services have a fixed callback name
 * // req.setCallbackName("callback");
 *
 * req.addListener("success", function(e) {
 *   var req = e.getTarget();
 *
 *   // HTTP status code indicating success, e.g. 200
 *   req.getStatus();
 *
 *   // "success"
 *   req.phase;
 *
 *   // JSON response
 *   req.getResponse();
 * }, this);
 *
 * // Send request
 * req.send();
 * </pre>
 *
 * Some noteable features:
 *
 * * Abstraction of low-level request
 * * Convenient setup using properties
 * * Fine-grained events
 * * Symbolic phases
 * * Transparent processing of request data
 * * Stream-lined authentication
 * * Flexible callback handling
 * * Cross-origin requests
 *
 * In order to debug requests, set the environment flag
 * <code>qx.debug.io</code>.
 *
 * Internally uses {@link qx.io.request.Jsonp}.
 */
qx.Class.define("qx.io.request.Jsonp",
{
  extend: qx.io.request.AbstractRequest,


  construct: function(url) {
    this.super(qx.io.request.AbstractRequest, "constructor", url);

    this.__id = this.__generateId();
    this.transport = new qx.io.request.Script();

    this.transport.on("readystatechange", function() {
      this.readyState = this.transport.readyState;
      this.status = this.transport.status;
      this.emit("readystatechange");
    }.bind(this));
    this.transport.on("load", function() { this.emit("load"); }.bind(this));
    this.transport.on("loadend", function() { this.emit("loadend"); }.bind(this));
    this.transport.on("error", function() { this.emit("error"); }.bind(this));
    this.transport.on("abort", function() { this.emit("abort"); }.bind(this));
    this.transport.on("timeout", function() { this.emit("timeout"); }.bind(this));
  },


  // for events refer to AbstractRequest

  properties:
  {
    /**
     * The HTTP method.
     */
    method: {
      // overwrite
      writable: false
    },


    /**
     * Whether to process asynchronously.
     */
    async: {
      // overwrite
      writable: false
    },


    /**
     * Whether to allow request to be answered from cache.
     *
     * Allowed values:
     *
     * * <code>true</code>: Allow caching (Default)
     * * <code>false</code>: Prohibit caching. Appends nocache parameter to URL.
     */
    cache: {
      check: "Boolean",
      init: true
    },


    /**
     * Set callback parameter.
     *
     * Some JSONP services expect the callback name to be passed labeled with a
     * special URL parameter key, e.g. "jsonp" in "?jsonp=myCallback". The
     * default is "callback".
     *
     * @type {String} Callback parameter.
     */
    callbackParam: {
      init: "",
      nullable: true
    },


    /**
     * Set callback name.
     *
     * Must be set to the name of the callback function that is called by the
     * script returned from the JSONP service. By default, the callback name
     * references this instance’s {@link #callback} method, allowing to connect
     * multiple JSONP responses to different requests.
     *
     * If the JSONP service allows to set custom callback names, it should not
     * be necessary to change the default. However, some services use a fixed
     * callback name. This is when setting the callbackName is useful. A
     * function is created and made available globally under the given name.
     * The function receives the JSON data and dispatches it to this instance’s
     * {@link #callback} method. Please note that this function is only created
     * if it does not exist before.
     *
     * @type {String} Callback name.
     */
    callbackName: {
      init: "",
      nullable: true
    },


    /**
     * Prefix used for the internal callback name.
     *
     * @param prefix {String} The prefix to put in front of 'qx'
     */
    prefix: {
      init: ""
    }
  },

  members:
  {
    /**
     * @type {qx.io.request.Script} Parsed JSON response.
     */
    transport: null,


    /**
     * @type {Number} Identifier of this instance.
     */
    __id: null,


    /**
     * @type {Boolean} Whether callback was called.
     */
    __callbackCalled: null,


    /**
     * @type {Boolean} Whether a custom callback was created automatically.
     */
    __customCallbackCreated: null,


    /**
     * @type {String} The generated URL for the current request
     */
    __generatedUrl: null,


    /**
     * @type {Boolean} Whether request was disposed.
     */
    _disposed: null,


    /**
     * Initializes (prepares) request.
     *
     * @param method {String}
     *   The HTTP method to use.
     *   This parameter exists for compatibility reasons. The script transport
     *   does not support methods other than GET.
     * @param url {String}
     *   The URL to which to send the request.
     */
    _open: function(method, url) {
      if (this._disposed) {
        return;
      }

      var query = {},
          callbackParam,
          callbackName,
          that = this;

      var delegate = {
        onNativeLoad: this._onNativeLoad.bind(this),
        onNativeError: this._onNativeError.bind(this)
      };
      this.transport.delegate = delegate;

      // Reset properties that may have been set by previous request
      this.response = null;
      this.__callbackCalled = false;

      callbackParam = this.callbackParam || "callback";
      callbackName = this.callbackName || this.prefix +
        "qx.io.request.Jsonp." + this.__id + ".callback";

      // Default callback
      if (!this.callbackName) {

        // Store globally available reference to this object
        this.constructor[this.__id] = this;

      // Custom callback
      } else {

        // Dynamically create globally available callback (if it does not
        // exist yet) with user defined name. Delegate to this object’s
        // callback method.
        if (!window[this.callbackName]) {
          this.__customCallbackCreated = true;
          window[this.callbackName] = function(data) {
            that.callback(data);
          };
        } else {
          if (qx.core.Environment.get("qx.debug.io")) {
            qx.Class.debug(qx.io.request.Jsonp, "Callback " +
              this.callbackName + " already exists");
          }
        }

      }

      if (qx.core.Environment.get("qx.debug.io")) {
        qx.Class.debug(qx.io.request.Jsonp,
          "Expecting JavaScript response to call: " + callbackName);
      }

      query[callbackParam] = callbackName;
      this.__generatedUrl = url = qx.util.Uri.appendParamsToUrl(url, query);

      this.__callTransport("open", [method, url]);
    },


    /**
     * Callback provided for JSONP response to pass data.
     *
     * Called internally to populate response property
     * and indicate successful status.
     *
     * Note: If you write a custom callback you’ll need to call
     * this method in order to notify the request about the data
     * loaded. Writing a custom callback should not be necessary
     * in most cases.
     *
     * @param data {Object} JSON
     */
    callback: function(data) {
      if (this._disposed) {
        return;
      }

      // Signal callback was called
      this.__callbackCalled = true;

      // Sanitize and parse
      if (qx.core.Environment.get("qx.debug")) {
        data = JSON.stringify(data);
        data = JSON.parse(data);
      }

      // Set response
      this.response = data;

      // Delete global reference to this
      this.constructor[this.__id] = undefined;

      this.__deleteCustomCallback();
    },


    /**
     * Returns the generated URL for the current / last request
     *
     * @internal
     * @return {String} The current generated URL for the request
     */
    getGeneratedUrl : function() {
      return this.__generatedUrl;
    },


    /**
     * Get status code.
     *
     * @return {String} The transport’s status code.
     */
    getStatus: function() {
      return this.transport.status;
    },


    /**
     * Set status code.
     *
     * @param {String} The transport’s status code.
     */
    setStatus: function(status) {
      this.transport.status = status;
    },


    /**
     * Get status text.
     *
     * @return {String} The transport’s status text.
     */
    getStatusText: function() {
      return this.transport.statusText;
    },


    /**
     * Set status text.
     *
     * @param {String} The transport’s status text.
     */
    setStatusText: function(statusText) {
      this.transport.statusText = statusText;
    },


    dispose: function() {
      // In case callback was not called
      this.__deleteCustomCallback();

      this.__callTransport("dispose");
    },


    /**
     * Handle native load.
     */
    _onNativeLoad: function() {
      // Indicate erroneous status (500) if callback was not called.
      //
      // Why 500? 5xx belongs to the range of server errors. If the callback was
      // not called, it is assumed the server failed to provide an appropriate
      // response. Since the exact reason of the error is unknown, the most
      // generic message ("500 Internal Server Error") is chosen.
      this.transport.status = this.__callbackCalled ? 200 : 500;

      this.__callTransport("_onNativeLoad");
    },


    /**
     * Handle native error.
     */
    _onNativeError: function() {
      // Indicate erroneous status (500) if callback was not called.
      //
      // Why 500? 5xx belongs to the range of server errors. If the callback was
      // not called, it is assumed the server failed to provide an appropriate
      // response. Since the exact reason of the error is unknown, the most
      // generic message ("500 Internal Server Error") is chosen.
      this.transport.status = this.__callbackCalled ? 200 : 500;

      this.__callTransport("_onNativeError");
    },


    /**
     *  Delete custom callback if dynamically created before.
     */
    __deleteCustomCallback: function() {
      if (this.__customCallbackCreated && window[this.callbackName]) {
        window[this.callbackName] = undefined;
        this.__customCallbackCreated = false;
      }
    },


    /**
     * Call overriden method.
     *
     * @param method {String} Name of the overriden method.
     * @param args {Array} Arguments.
     */
    __callTransport: function(method, args) {
      this.transport[method].apply(this.transport, args || []);
    },


    /**
     * Generate ID.
     */
    __generateId: function() {
      // Add random digits to date to allow immediately following requests
      // that may be send at the same time
      return "qx" + (new Date().valueOf()) + ("" + Math.random()).substring(2,5);
    },


    /**
     * Get configured URL.
     *
     * Append request data to URL. Also append random string
     * to URL if required by value of {@link #cache}.
     *
     * @return {String} The configured URL.
     */
    _getConfiguredUrl: function() {
      var url = this.url,
          serializedData;

      if (this.requestData) {
        serializedData = this._serializeData(this.requestData);
        url = qx.util.Uri.appendParamsToUrl(url, serializedData);
      }

      if (!this.cache) {
        // Make sure URL cannot be served from cache and new request is made
        url = qx.util.Uri.appendParamsToUrl(url, {nocache: new Date().valueOf()});
      }

      return url;
    },


    /**
     * Return the transport’s response property.
     *
     * See {@link qx.io.request.Jsonp}.
     *
     * @return {Object} The parsed response of the request.
     */
    _getParsedResponse: function() {
      return this.$$response;
    },


    _dispose: function() {
      // In case callback was not called
      this.__deleteCustomCallback();

      var noop = function() {};

      this.transport.onreadystatechange = this.transport.onload = this.transport.onloadend =
      this.transport.onabort = this.transport.ontimeout = this.transport.onerror = noop;

      this.__callTransport("dispose");
    },


    _send: function() {
      this.__callTransport("send");
    },


    _abort: function() {
      this.__callTransport("abort");
    },


    _setRequestHeader: function() {
      this.__callTransport("setRequestHeader");
    }
  }
});

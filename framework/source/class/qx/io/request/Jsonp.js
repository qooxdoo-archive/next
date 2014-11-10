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

    this.transport.onreadystatechange = function() { this.emit("readystatechane"); }.bind(this);
    this.transport.onload = function() { this.emit("load"); }.bind(this);
    this.transport.onloadend = function() { this.emit("loadend"); }.bind(this);
    this.transport.onerror = function() { this.emit("error"); }.bind(this);
    this.transport.onabort = function() { this.emit("abort"); }.bind(this);
    this.transport.ontimeout = function() { this.emit("timeout"); }.bind(this);
  },

  events:
  {

    /**
     * Fired when request completes without error and data has been received.
     */
    "success": null,

    /**
     * Fired when request completes without error.
     *
     * Every request receiving a response completes without error. This means
     * that even for responses that do not call the callback, a "load" event
     * is fired. If you are only interested in the JSON data received, consider
     * listening to the {@link #success} event instead.
     */
    "load": null,

    /**
     * Fired when request completes without error but no data was received.
     *
     * The underlying script transport does not know the HTTP status of the
     * response. However, if the callback was not called (no data received)
     * an erroneous status (500) is assigned to the transport’s status
     * property.
     *
     * Note: If you receive an unexpected "statusError", check that the JSONP
     * service accepts arbitrary callback names given as the "callback"
     * parameter. In case the service expects another parameter for the callback
     * name, use {@link #setCallbackParam}. Should the service respond with a
     * hard-coded callback, set a custom callback name with
     * {@link #setCallbackName}.
     */
    "statusError": null
  },

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
    }
  },

  members:
  {
    /**
     * @type {qx.io.request.Script} Parsed JSON response.
     */
    transport: null,

    /**
     * @type {Object} Parsed JSON response.
     */
    responseJson: null,

    /**
     * @type {Number} Identifier of this instance.
     */
    __id: null,

    /**
     * @type {String} Callback parameter.
     */
    __callbackParam: null,

    /**
     * @type {String} Callback name.
     */
    __callbackName: null,

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

    /** Prefix used for the internal callback name. */
    __prefix : "",

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
      this.transport.setDelegate(delegate);

      // Reset properties that may have been set by previous request
      this.responseJson = null;
      this.__callbackCalled = false;

      callbackParam = this.__callbackParam || "callback";
      callbackName = this.__callbackName || this.__prefix +
        "qx.io.request.Jsonp." + this.__id + ".callback";

      // Default callback
      if (!this.__callbackName) {

        // Store globally available reference to this object
        this.constructor[this.__id] = this;

      // Custom callback
      } else {

        // Dynamically create globally available callback (if it does not
        // exist yet) with user defined name. Delegate to this object’s
        // callback method.
        if (!window[this.__callbackName]) {
          this.__customCallbackCreated = true;
          window[this.__callbackName] = function(data) {
            that.callback(data);
          };
        } else {
          if (qx.core.Environment.get("qx.debug.io")) {
            qx.Class.debug(qx.io.request.Jsonp, "Callback " +
              this.__callbackName + " already exists");
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
     * Called internally to populate responseJson property
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
      this.responseJson = data;

      // Delete global reference to this
      this.constructor[this.__id] = undefined;

      this.__deleteCustomCallback();
    },

    /**
     * Set callback parameter.
     *
     * Some JSONP services expect the callback name to be passed labeled with a
     * special URL parameter key, e.g. "jsonp" in "?jsonp=myCallback". The
     * default is "callback".
     *
     * @param param {String} Name of the callback parameter.
     * @return {qx.io.request.Jsonp} Self reference for chaining.
     */
    setCallbackParam: function(param) {
      this.__callbackParam = param;
      return this;
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
     * @param name {String} Name of the callback function.
     * @return {qx.io.request.Jsonp} Self reference for chaining.
     */
    setCallbackName: function(name) {
      this.__callbackName = name;
      return this;
    },


    /**
     * Set the prefix used in front of 'qx.' in case 'qx' is not available
     * (for qx.Website e.g.)
     * @internal
     * @param prefix {String} The prefix to put in front of 'qx'
     */
    setPrefix : function(prefix) {
      this.__prefix = prefix;
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
     * Get parsed response.
     *
     * @return {String} The parsed response of the request.
     */
    getStatus: function() {
      return this.transport.status;
    },

    /**
     * Get parsed response.
     *
     * @return {String} The parsed response of the request.
     */
    getStatusText: function() {
      return this.transport.statusText;
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
      if (this.__customCallbackCreated && window[this.__callbackName]) {
        window[this.__callbackName] = undefined;
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
     * Return the transport’s responseJson property.
     *
     * See {@link qx.io.request.Jsonp}.
     *
     * @return {Object} The parsed response of the request.
     */
    _getParsedResponse: function() {
      return this.responseJson;
    },

    /**
     * Get parsed response.
     *
     * @return {String} The parsed response of the request.
     */
    getResponse: function() {
      return this._getParsedResponse();
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

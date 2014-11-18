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
 * AbstractRequest serves as a base class for {@link qx.io.request.Xhr}
 * and {@link qx.io.request.Jsonp}. It contains methods to conveniently
 * communicate with transports found in {@link qx.bom.request}.
 *
 * The general procedure to derive a new request is to choose a
 * transport (override {@link #_createTransport}) and link
 * the transport’s response (override {@link #_getParsedResponse}).
 * The transport must implement {@link qx.bom.request.IRequest}.
 *
 * To adjust the behavior of {@link #send} override
 * {@link #_getConfiguredUrl} and {@link #_getConfiguredRequestHeaders}.
 */
qx.Class.define("qx.io.request.AbstractRequest",
{
  extend : Object,
  include: [qx.event.MEmitter],

  /**
   * @param url {String?} The URL of the resource to request.
   */
  construct : function(url)
  {
    if (url !== undefined) {
      this.url = url;
    }

    this.__requestHeaders = {};

    this.on("readystatechange", this._onReadyStateChange, this);
    this.on("timeout", this._onTimeout, this);
    this.on("error", this._onError, this);
  },

  events :
  {
    /**
     * Fired on every change of the transport’s readyState.
     */
    "readystatechange": "null",

    /**
     * Fired when request completes without error and transport’s status
     * indicates success.
     */
    "success": "Object",

    /**
     * Fired when request completes without error.
     */
    "load": "null",

    /**
     * Fired when request completes with or without error.
     */
    "loadend": "null",

    /**
     * Fired when request is aborted.
     */
    "abort": "Object",

    /**
     * Fired when request reaches timeout limit.
     */
    "timeout": "Object",

    /**
     * Fired when request completes with error.
     */
    "error": "Object",

    /**
     * Fired when request completes without error but erroneous HTTP status.
     */
    "statusError": "Object",

    /**
     * Fired on timeout, error or remote error.
     *
     * This event is fired for convenience. Usually, it is recommended
     * to handle error related events in a more fine-grained approach.
     */
    "fail": "Object|null",

    /**
     * Fired on change of the parsed response.
     *
     * This event allows to use data binding with the
     * parsed response as source.
     *
     * For example, to bind the response to the value of a label:
     *
     * <br />
     * <pre class="javascript">
     * // req is an instance of qx.io.request.*,
     * // label an instance of qx.ui.basic.Label
     * req.bind("response", label, "value");
     * </pre>
     *
     * The response is parsed (and therefore changed) only
     * after the request completes successfully. This means
     * that when a new request is made the initial empty value
     * is ignored, instead only the final value is bound.
     *
     */
    "changeResponse": "Object",

    /**
     * Fired on change of the phase.
     */
    "changePhase": "Object"
  },

  properties :
  {
    /**
     * The URL of the resource to request.
     *
     * Note: Depending on the configuration of the request
     * and/or the transport chosen, query params may be appended
     * automatically.
     */
    url: {
      check: "String"
    },

    /**
     * Timeout limit in milliseconds. Default (0) means no limit.
     */
    timeout: {
      check: "Number",
      nullable: true,
      init: 0
    },

    /**
     * The HTTP method.
     */
    method: {
      check: "String",
      init: "GET"
    },

    /**
     * Whether to process asynchronously.
     */
    async: {
      check: "Boolean",
      init: true
    },

    /**
     * Get current phase.
     *
     * A more elaborate version of {@link #readState}, this property indicates
     * the current phase of the request. Maps to stateful (i.e. deterministic)
     * events (success, abort, timeout, statusError) and intermediate
     * readyStates (unsent, configured, loading, load).
     *
     * When the requests is successful, it progresses the states:<br>
     * 'unsent', 'opened', 'sent', 'loading', 'load', 'success'
     *
     * In case of failure, the final state is one of:<br>
     * 'abort', 'timeout', 'statusError'
     *
     * For each change of the phase, a {@link #changePhase} data event is fired.
     *
     * @return {String} Current phase.
     */
    phase: {
      check: function(value) {
        return qx.lang.Type.isString(value) &&
               /^(unsent|opened|sent|loading|load|success|abort|timeout|statusError)$/.test(value);
      },
      event: "changePhase",
      init: "unsent"
    },

    /**
     * Data to be send as part of the request.
     *
     * Supported types:
     *
     * * String
     * * Map
     * * qooxdoo Object
     *
     * For every supported type except strings, a URL encoded string
     * with unsafe characters escaped is internally generated and sent
     * as part of the request.
     *
     * Depending on the underlying transport and its configuration, the request
     * data is transparently included as URL query parameters or embedded in the
     * request body as form data.
     *
     * If a string is given the user must make sure it is properly formatted and
     * escaped. See {@link qx.util.Serializer#toUriParameter}.
     *
     */
    requestData: {
      check: function(value) {
        return qx.lang.Type.isString(value) ||
               qx.lang.Type.isObject(value);
      },
      nullable: true
    },

    /**
     * @type {Number} Ready state.
     *
     * States can be:
     * UNSENT:           0,
     * OPENED:           1,
     * HEADERS_RECEIVED: 2,
     * LOADING:          3,
     * DONE:             4
     */
    readyState: {
      type: "Number",
      init: 0
    },

    /**
     * @type {String} The response of the request as text.
     */
    responseText: {
      type: "String",
      init: ""
    },

    /**
     * @type {Object} The response of the request as a Document object.
     */
    responseXML: {
      init: null,
      nullable: true
    },

    /**
     * Parsed response.
     *
     * @type {String} The parsed response of the request.
     */
    response: {
      get: "_getParsedResponse",
      event: "changeResponse",
      nullable: true
    },

    /**
     * @type {Number} The HTTP status code.
     *
     * Note: Getter and Setter needed for later override.
     */
    status: {
      get: "getStatus",
      set: "setStatus",
      type: "Number",
      init: 0
    },

    /**
     * @type {String} The HTTP status text.
     *
     * Note: Getter and Setter needed for later override.
     */
    statusText: {
      get: "getStatusText",
      set: "setStatusText",
      type: "String",
      init: ""
    },

    /**
     * Authentication delegate.
     *
     * The delegate must implement {@link qx.io.request.authentication.IAuthentication}.
     */
    authentication: {
      check: "qx.io.request.authentication.IAuthentication",
      nullable: true
    }
  },

  members :
  {
    /**
     * Abort flag.
     */
     __abort: null,

    /**
     * Request headers.
     */
    __requestHeaders: null,

    /**
     * Request headers (deprecated).
     */
    __requestHeadersDeprecated: null,

    /**
     * Get configured URL.
     *
     * A configured URL typically includes a query string that
     * encapsulates transport specific settings such as request
     * data or no-cache settings.
     *
     * This method MUST be overridden. It is called in {@link #send}
     * before the request is initialized. Without an URL no
     * request is possible.
     *
     * @return {String} The configured URL.
     */
    _getConfiguredUrl: function() {
      throw new Error("Abstract method call");
    },

    /**
     * Get configuration related request headers.
     *
     * This method MAY be overridden to add request headers for features limited
     * to a certain transport.
     *
     * @return {Map} Map of request headers.
     */
    _getConfiguredRequestHeaders: function() {},

    /**
     * Get parsed response.
     *
     * Is called in the {@link #_onReadyStateChange} event handler
     * to parse and store the transport’s response.
     *
     * This method MUST be overridden.
     *
     * @return {String} The parsed response of the request.
     */
    _getParsedResponse: function() {
      throw new Error("Abstract method call");
    },

    /**
     * Send request.
     */
    send: function() {
      var url, method, async, serializedData;

      //
      // Open request
      //

      url = this._getConfiguredUrl();

      // Drop fragment (anchor) from URL as per
      // http://www.w3.org/TR/XMLHttpRequest/#the-open-method
      if (/\#/.test(url)) {
        url = url.replace(/\#.*/, "");
      }

      // Support transports with enhanced feature set
      method = this.method;
      async = this.async;

      // Open
      if (qx.core.Environment.get("qx.debug.io")) {
        this.debug("Open low-level request with method: " +
          method + ", url: " + url + ", async: " + async);
      }

      this._open(method, url, async);
      this.phase = "opened";

      //
      // Send request
      //

      serializedData = this._serializeData(this.requestData);

      this._setRequestHeaders();

      // Send
      if (qx.core.Environment.get("qx.debug.io")) {
        this.debug("Send low-level request");
      }
      method == "GET" ? this._send() : this._send(serializedData);
      this.phase = "sent";

      return this;
    },

    /**
     * Abort request.
     */
    abort: function() {
      if (qx.core.Environment.get("qx.debug.io")) {
        this.debug("Abort request");
      }
      this.__abort = true;

      // Update phase to "abort" before user handler are invoked [BUG #5485]
      this.phase = "abort";

      this._abort();
    },

    /**
     * Abort request.
     *
     * This method MAY be overridden. It is called in {@link #abort}.
     */
    _abort: function() {},

    /**
     * Get parsed response.
     *
     * Is called in the {@link #_onReadyStateChange} event handler
     * to parse and store the transport’s response.
     *
     * This method MUST be overridden.
     */
    _send: function() {
      throw new Error("Abstract method call");
    },

    /**
     * Opens a request.
     *
     * This method MUST be overridden. It is called in {@link #send}.
     */
    _open: function() {
      throw new Error("Abstract method call");
    },

    /*
    ---------------------------------------------------------------------------
     REQUEST HEADERS
    ---------------------------------------------------------------------------
    */

    /**
     * Apply configured request headers to transport.
     *
     * This method MAY be overridden to customize application of request headers
     * to transport.
     */
    _setRequestHeaders: function() {
      var requestHeaders = this._getAllRequestHeaders();

      for (var key in requestHeaders) {
        this._setRequestHeader(key, requestHeaders[key]);
      }

    },

    _setRequestHeader: function() {
      throw new Error("Abstract method call");
    },

    /**
     * Set a request header.
     *
     * Note: Setting request headers has no effect after the request was send.
     *
     * @param key {String} Key of the header.
     * @param value {String} Value of the header.
     */
    setRequestHeader: function(key, value) {
      this.__requestHeaders[key] = value;
    },

    /**
     * Get all request headers.
     *
     * @return {Map} All request headers.
     */
    _getAllRequestHeaders: function() {
      var requestHeaders = {};
      // Transport specific headers
      qx.lang.Object.mergeWith(requestHeaders, this._getConfiguredRequestHeaders());
      // Authentication delegate
      qx.lang.Object.mergeWith(requestHeaders, this.__getAuthRequestHeaders());
      // User-defined, requestHeaders property (deprecated)
      qx.lang.Object.mergeWith(requestHeaders, this.__requestHeadersDeprecated);
      // User-defined
      qx.lang.Object.mergeWith(requestHeaders, this.__requestHeaders);

      return requestHeaders;
    },

    /**
    * Retrieve authentication headers from auth delegate.
    *
    * @return {Map} Authentication related request headers.
    */
    __getAuthRequestHeaders: function() {
      var auth = this.authentication,
          headers = {};

      if (auth) {
        auth.getAuthHeaders().forEach(function(header) {
          headers[header.key] = header.value;
        });
        return headers;
      }
    },

    /**
     * Get a request header.
     *
     * @param key {String} Key of the header.
     * @return {String} The value of the header.
     */
    getRequestHeader: function(key) {
       return this.__requestHeaders[key];
    },

    /**
     * Remove a request header.
     *
     * Note: Removing request headers has no effect after the request was send.
     *
     * @param key {String} Key of the header.
     */
    removeRequestHeader: function(key) {
      if (this.__requestHeaders[key]) {
       delete this.__requestHeaders[key];
      }
    },

    /**
     * Get status code.
     *
     * @return {Number} The transport’s status code.
     */
    getStatus: function() {
      return this.$$status;
    },

    /**
     * Set status code.
     *
     * @param status {Number} The transport’s status code.
     */
    setStatus: function(status) {
      this.$$status = status;
    },

    /**
     * Get status text.
     *
     * @return {String} The transport’s status text.
     */
    getStatusText: function() {
      return this.$$statusText;
    },

    /**
     * Set status text.
     *
     * @param {String} The transport’s status text.
     */
    setStatusText: function(statusText) {
      this.$$statusText = statusText;
    },

    /**
     * Get the content type response header from response.
     *
     * @return {String}
     *   Content type response header.
     */
    getResponseContentType: function() {
      return this.getResponseHeader("Content-Type");
    },

    /**
     * Whether request completed (is done).
     */
    isDone: function() {
      return this.readyState === 4;
    },


    isDisposed: function() {
      return !!this.$$disposed;
    },

    /*
    ---------------------------------------------------------------------------
      EVENT HANDLING
    ---------------------------------------------------------------------------
    */

    /**
     * Handle "readystatechange" event.
     */
    _onReadyStateChange: function() {
      var readyState = this.readyState;

      if (qx.core.Environment.get("qx.debug.io")) {
        this.debug("Fire readyState: " + readyState);
      }

      // Transport switches to readyState DONE on abort and may already
      // have successful HTTP status when response is served from cache.
      //
      // Not fire custom event "loading" (or "success", when cached).
      if (this.__abort) {
        return;
      }

      if (readyState === 3) {
        this.phase = "loading";
      }

      if (this.isDone()) {
        this.__onReadyStateDone();
      }
    },

    /**
     * Called internally when readyState is DONE.
     */
    __onReadyStateDone: function() {
      if (qx.core.Environment.get("qx.debug.io")) {
        this.debug("Request completed with HTTP status: " + this.status);
      }

      // Event "load" fired in onLoad
      this.phase = "load";

      // Successful HTTP status
      if (qx.util.Request.isSuccessful(this.status)) {

        // Parse response
        if (qx.core.Environment.get("qx.debug.io")) {
          this.debug("Response is of type: '" + this.getResponseContentType() + "'");
        }

        this.response = this._getParsedResponse();

        this._fireStatefulEvent("success");

      // Erroneous HTTP status
      } else {

        try {
          this.response = this._getParsedResponse();
        } catch (e) {
          // ignore if it does not work
        }

        // A remote error failure
        if (this.status !== 0) {
          this._fireStatefulEvent("statusError");
          this.emit("fail", {target: this});
        }
      }
    },

    /**
     * Handle "timeout" event.
     */
    _onTimeout: function() {
      this.phase = "timeout";

      // A network error failure
      this.emit("fail");
    },

    /**
     * Handle "error" event.
     */
    _onError: function() {
      // A network error failure
      this.emit("fail", {target: this});
    },

    /*
    ---------------------------------------------------------------------------
      INTERNAL / HELPERS
    ---------------------------------------------------------------------------
    */

    /**
     * Fire stateful event.
     *
     * Fires event and sets phase to name of event.
     *
     * @param evt {String} Name of the event to fire.
     */
    _fireStatefulEvent: function(evt) {
      if (qx.core.Environment.get("qx.debug")) {
        qx.core.Assert.assertString(evt);
      }
      this.phase = evt;
      this.emit(evt, {target: this});
    },

    /**
     * Serialize data.
     *
     * @param data {String|Map|qx.core.Object} Data to serialize.
     * @return {String|null} Serialized data.
     */
    _serializeData: function(data) {
      var isPost = "method" in this && this.method == "POST",
          isJson = (/application\/.*\+?json/).test(this.getRequestHeader("Content-Type"));

      if (!data) {
        return null;
      }

      if (qx.lang.Type.isString(data)) {
        return data;
      }

      // duck typing for qx classes
      if (data.classname && data.$$name) {
        return qx.util.Serializer.toUriParameter(data);
      }

      if (isJson && (qx.lang.Type.isObject(data) || qx.lang.Type.isArray(data))) {
        return JSON.stringify(data);
      }

      if (qx.lang.Type.isObject(data)) {
        return qx.util.Uri.toParameter(data, isPost);
      }
    },

    dispose: function() {
      this.$$disposed = true;
      var noop = function() {};

      this.onreadystatechange = this.onload = this.onloadend =
      this.onabort = this.ontimeout = this.onerror = noop;

      // [BUG #8315] dispose asynchronously to work with Sinon.js fake server
      window.setTimeout(
        function(ctx) {
          return function() {
            ctx._dispose();
          };
        }(this),
        0
      );
    },

    _dispose: function() {
      throw new Error("Abstract method call");
    }
  },

  classDefined: function() {
    qx.core.Environment.add("qx.debug.io", false);
  }
});

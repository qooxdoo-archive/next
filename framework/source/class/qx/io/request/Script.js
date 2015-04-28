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
 * Script loader with interface similar to
 * <a href="http://www.w3.org/TR/XMLHttpRequest/">XmlHttpRequest</a>.
 *
 * The script loader can be used to load scripts from arbitrary sources.
 * <span class="desktop">
 * For JSONP requests, consider the {@link qx.io.request.Jsonp} transport
 * that derives from the script loader.
 * </span>
 *
 * @require(qx.io.request.Script#_success)
 * @require(qx.io.request.Script#abort)
 * @require(qx.io.request.Script#dispose)
 * @require(qx.io.request.Script#isDisposed)
 * @require(qx.io.request.Script#getAllResponseHeaders)
 * @require(qx.io.request.Script#getResponseHeader)
 * @require(qx.io.request.Script#setDetermineSuccess)
 * @require(qx.io.request.Script#setRequestHeader)
 *
 * @group (IO)
 */

qx.Class.define("qx.io.request.Script",
{
  include: [qx.event.MEmitter],


  construct : function()
  {
    this.__initXhrProperties();

    this.__onNativeLoadBound = this._onNativeLoad.bind(this);
    this.__onNativeErrorBound = this._onNativeError.bind(this);
    this.__onTimeoutBound = this._onTimeout.bind(this);

    this.__headElement = document.head || document.getElementsByTagName( "head" )[0] ||
                         document.documentElement;
  },


  events : {
    /** Fired at ready state changes. */
    "readystatechange" : "qx.io.request.Script",

    /** Fired on error. */
    "error" : "qx.io.request.Script",

    /** Fired at loadend. */
    "loadend" : "qx.io.request.Script",

    /** Fired on timeouts. */
    "timeout" : "qx.io.request.Script",

    /** Fired when the request is aborted. */
    "abort" : "qx.io.request.Script",

    /** Fired on successful retrieval. */
    "load" : "qx.io.request.Script"
  },


  properties: {
    /**
     * @type {Object} Delegator for events.
     * Enables pre/post-processing injection.
     *
     * Set delegate functions. This is a possibility to run
     * logic after/before handlers (e.g. __onNativeLoadBound).
     *
     * Note:
     *  The handler functions (e.g. __onNativeLoadBound) have
     *  then to be called manually!
     */
    delegate : {
      init: null,
      nullable: true
    },


    /**
     * @type {Number} Ready state.
     *
     * States can be:
     * UNSENT:           0,
     * OPENED:           1,
     * LOADING:          2,
     * LOADING:          3,
     * DONE:             4
     *
     * Contrary to {@link qx.io.request.Xhr#readyState}, the script transport
     * does not receive response headers. For compatibility, another LOADING
     * state is implemented that replaces the HEADERS_RECEIVED state.
     */
    readyState: {
      init: null,
      nullable: true
    },


    /**
     * @type {Number} The status code.
     *
     * Note: The script transport cannot determine the HTTP status code.
     */
    status: {
      init: null,
      nullable: true
    },

    /**
     * @type {String} The status text.
     *
     * The script transport does not receive response headers. For compatibility,
     * the statusText property is set to the status casted to string.
     */
    statusText: {
      init: null,
      nullable: true
    },


    /**
     * @type {Number} Timeout limit in milliseconds.
     *
     * 0 (default) means no timeout.
     */
    timeout: {
      init: null,
      nullable: true
    }
  },

  members :
  {

    /**
     * @type {Function} Function that is executed once the script was loaded.
     */
    __determineSuccess: null,


    /**
     * Initializes (prepares) request.
     *
     * @param method {String}
     *   The HTTP method to use.
     *   This parameter exists for compatibility reasons. The script transport
     *   does not support methods other than GET.
     * @param url {String}
     *   The URL to which to send the request.
     * @return {qx.io.request.Script} Self for chaining.
     */
    open: function(method, url) {
      if (this._disposed) {
        return this;
      }

      // Reset XHR properties that may have been set by previous request
      this.__initXhrProperties();

      this._isAbort = null;
      this.__url = url;

      if (qx.core.Environment.get("qx.debug.io")) {
        qx.Class.debug(qx.io.request.Script, "Open native request with " +
          "url: " + url);
      }

      this._readyStateChange(1);
      return this;
    },


    /**
     * Appends a query parameter to URL.
     *
     * This method exists for compatibility reasons. The script transport
     * does not support request headers. However, many services parse query
     * parameters like request headers.
     *
     * Note: The request must be initialized before using this method.
     *
     * @param key {String}
     *  The name of the header whose value is to be set.
     * @param value {String}
     *  The value to set as the body of the header.
     * @return {qx.io.request.Script} Self for chaining.
     */
    setRequestHeader: function(key, value) {
      if (this._disposed) {
        return null;
      }

      var param = {};

      if (this.readyState !== 1) {
        throw new Error("Invalid state");
      }

      param[key] = value;
      this.__url = qx.util.Uri.appendParamsToUrl(this.__url, param);
      return this;
    },


    /**
     * Sends request.
     * @return {qx.io.request.Script} Self for chaining.
     */
    send: function() {
      if (this._disposed) {
        return null;
      }

      var script = this.__createScriptElement(),
          head = this.__headElement,
          that = this;

      if (this.timeout > 0) {
        this.__timeoutId = window.setTimeout(this.__onTimeoutBound, this.timeout);
      }

      if (qx.core.Environment.get("qx.debug.io")) {
        qx.Class.debug(qx.io.request.Script, "Send native request");
      }

      // Attach script to DOM
      head.insertBefore(script, head.firstChild);

      // The resource is loaded once the script is in DOM.
      // Assume HEADERS_RECEIVED and LOADING and dispatch async.
      window.setTimeout(function() {
        that._readyStateChange(2);
        that._readyStateChange(3);
      });
      return this;
    },


    /**
     * Aborts request.
     * @return {qx.io.request.Script} Self for chaining.
     */
    abort: function() {
      if (this._disposed) {
        return null;
      }

      this._isAbort = true;
      this.__disposeScriptElement();
      this.emit("abort");
      return this;
    },


    /**
     * Get a single response header from response.
     *
     * Note: This method exists for compatibility reasons. The script
     * transport does not receive response headers.
     *
     * @return {String|null} Warning message or <code>null</code> if the request
     * is disposed
     */
    getResponseHeader: function() {
      if (this._disposed) {
        return null;
      }

      if (qx.core.Environment.get("qx.debug")) {
        qx.Class.debug("Response header cannot be determined for " +
          "requests made with script transport.");
      }
      return "unknown";
    },


    /**
     * Get all response headers from response.
     *
     * Note: This method exists for compatibility reasons. The script
     * transport does not receive response headers.
     * @return {String|null} Warning message or <code>null</code> if the request
     * is disposed
     */
    getAllResponseHeaders: function() {
      if (this._disposed) {
        return null;
      }

      if (qx.core.Environment.get("qx.debug")) {
        qx.Class.debug("Response headers cannot be determined for" +
          "requests made with script transport.");
      }

      return "Unknown response headers";
    },


    /**
     * Determine if loaded script has expected impact on global namespace.
     *
     * The function is called once the script was loaded and must return a
     * boolean indicating if the response is to be considered successful.
     *
     * @param check {Function} Function executed once the script was loaded.
     * @return {qx.io.request.Script} Self for chaining.
     */
    setDetermineSuccess: function(check) {
      this.__determineSuccess = check;
      return this;
    },


    /**
     * Dispose object.
     */
    dispose: function() {
      var script = this.__scriptElement;

      if (!this._disposed) {

        // Prevent memory leaks
        if (script) {
          script.onload = script.onreadystatechange = null;
          this.__disposeScriptElement();
        }

        if (this.__timeoutId) {
          window.clearTimeout(this.__timeoutId);
          this.__timeoutId = null;
        }

        this._disposed = true;
      }
    },


    /**
     * Check if the request has already beed disposed.
     * @return {Boolean} <code>true</code>, if the request has been disposed.
     */
    isDisposed : function() {
      return !!this._disposed;
    },


    /*
    ---------------------------------------------------------------------------
      PROTECTED
    ---------------------------------------------------------------------------
    */

    /**
     * Get URL of request.
     *
     * @return {String} URL of request.
     */
    _getUrl: function() {
      return this.__url;
    },


    /**
     * Get script element used for request.
     *
     * @return {Element} Script element.
     */
    _getScriptElement: function() {
      return this.__scriptElement;
    },


    /**
     * Handle timeout.
     */
    _onTimeout: function() {
      this.__failure();
      this.emit("timeout");
    },


    /**
     * Handle native load.
     */
    _onNativeLoad: function() {
      var determineSuccess = this.__determineSuccess,
          that = this;

      // Aborted request must not fire load
      if (this._isAbort) {
        return;
      }

      if (qx.core.Environment.get("qx.debug.io")) {
        qx.Class.debug(qx.io.request.Script, "Received native load");
      }

      // Determine status by calling user-provided check function
      if (determineSuccess) {

        // Status set before has higher precedence
        if (!this.status) {
          this.status = determineSuccess() ? 200 : 500;
        }

      }

      if (this.status === 500) {
        if (qx.core.Environment.get("qx.debug.io")) {
          qx.Class.debug(qx.io.request.Script, "Detected error");
        }
      }

      if (this.__timeoutId) {
        window.clearTimeout(this.__timeoutId);
        this.__timeoutId = null;
      }

      window.setTimeout(function() {
        that._success();
        that._readyStateChange(4);
        that.emit("load");
        that.emit("loadend");
      });
    },


    /**
     * Handle native error.
     */
    _onNativeError: function() {
      this.__failure();
      this.emit("error");
      this.emit("loadend");
    },


    /**
     * @type {Element} Script element
     */
    __scriptElement: null,


    /**
     * @type {Element} Head element
     */
    __headElement: null,


    /**
     * @type {String} URL
     */
    __url: "",


    /**
     * @type {Function} Bound _onNativeLoad handler.
     */
    __onNativeLoadBound: null,


    /**
     * @type {Function} Bound _onNativeError handler.
     */
    __onNativeErrorBound: null,


    /**
     * @type {Function} Bound _onTimeout handler.
     */
    __onTimeoutBound: null,


    /**
     * @type {Number} Timeout timer iD.
     */
    __timeoutId: null,


    /**
     * @type {Boolean} Whether request was aborted.
     */
    __abort: null,


    /**
     * @type {Boolean} Whether request was disposed.
     */
    _disposed: null,


    /**
     * Initialize properties.
     */
    __initXhrProperties: function() {
      this.readyState = 0;
      this.status = 0;
      this.statusText = "";
    },


    /**
     * Change readyState.
     *
     * @param readyState {Number} The desired readyState
     */
    _readyStateChange: function(readyState) {
      this.readyState = readyState;
      this.emit("readystatechange");
    },


    /**
     * Handle success.
     */
    _success: function() {
      this.__disposeScriptElement();
      this.readyState = 4;
      // By default, load is considered successful
      this.status = (!this.status) ? 200 : this.status;
      this.statusText = "" + this.status;
    },


    /**
     * Handle failure.
     */
    __failure: function() {
      this.__disposeScriptElement();
      this.readyState = 4;
      this.status = (!this.status) ? 0 : this.status;
      this.statusText = null;
    },


    /**
     * Create and configure script element.
     *
     * @return {Element} Configured script element.
     */
    __createScriptElement: function() {
      var script = this.__scriptElement = document.createElement("script");

      script.src = this.__url;

      if (this.delegate && this.delegate.onNativeLoad && this.delegate.onNativeError) {
        script.onload = this.delegate.onNativeLoad;
        script.onerror = this.delegate.onNativeError;
      } else {
        script.onload = this.__onNativeLoadBound;
        script.onerror = this.__onNativeErrorBound;
      }

      return script;
    },


    /**
     * Remove script element from DOM.
     */
    __disposeScriptElement: function() {
      var script = this.__scriptElement;

      if (script && script.parentNode) {
        this.__headElement.removeChild(script);
      }
    }
  },


  classDefined : function() {
    qx.core.Environment.add("qx.debug.io", false);
  }
});

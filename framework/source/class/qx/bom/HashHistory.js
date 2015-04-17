define(['qx/Class', 'qx/bom/History', 'qx/bom/Iframe', 'qx/core/Environment', 'qx/lang/Type', 'qx/util/ResourceManager'], function(Dep0,Dep1,Dep2,Dep3,Dep4,Dep5) {
var qx = {
  "Class": Dep0,
  "bom": {
    "History": Dep1,
    "Iframe": Dep2,
    "HashHistory": null
  },
  "core": {
    "Environment": Dep3
  },
  "lang": {
    "Type": Dep4
  },
  "util": {
    "ResourceManager": Dep5
  }
};

"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Fabian Jakobs (fjakobs)
     * Mustafa Sak (msak)

************************************************************************ */

/**
 * History manager implementation for IE greater 7. IE reloads iframe
 * content on history actions even just hash value changed. This
 * implementation forwards history states (hashes) to a helper iframe.
 *
 * @internal
 */
var clazz = qx.Class.define("qx.bom.HashHistory",
{
  extend : qx.bom.History,

  construct : function()
  {
    this.super("construct");
    this._baseUrl = null;
    this.__initIframe();
  },


  members :
  {
    __iframe : null,
    __iframeReady : false,
    __intervalId : null,


    //overridden
    addToHistory : function(state, newTitle)
    {
      if (!qx.lang.Type.isString(state)) {
        state = state + "";
      }

      if (qx.lang.Type.isString(newTitle))
      {
        this.title = newTitle;
        this._titles[state] = newTitle;
      }

      if (this.state !== state) {
        this._writeState(state);
      }
    },


    /**
     * Initializes the iframe
     *
     */
    __initIframe : function()
    {
      this.__iframe = this.__createIframe();
      document.body.appendChild(this.__iframe);

      this.__waitForIFrame(function()
      {
        this._baseUrl = this.__iframe.contentWindow.document.location.href;
        this.__attachListeners();
      }, this);
    },


    /**
     * IMPORTANT NOTE FOR IE:
     * Setting the source before adding the iframe to the document.
     * Otherwise IE will bring up a "Unsecure items ..." warning in SSL mode
     *
     * @return {Element}
     */
    __createIframe : function ()
    {
      var iframe = qx.bom.Iframe.create({
        src : qx.util.ResourceManager.getInstance().toUri(qx.core.Environment.get("qx.blankpage")) + "#"
      });

      iframe.style.visibility = "hidden";
      iframe.style.position = "absolute";
      iframe.style.left = "-1000px";
      iframe.style.top = "-1000px";

      return iframe;
    },


    /**
     * Waits for the IFrame being loaded. Once the IFrame is loaded
     * the callback is called with the provided context.
     *
     * @param callback {Function} This function will be called once the iframe is loaded
     * @param context {Object?window} The context for the callback.
     * @param retry {Integer} number of tries to initialize the iframe
     */
    __waitForIFrame : function(callback, context, retry)
    {
      if (typeof retry === "undefined") {
        retry = 0;
      }

      if ( !this.__iframe.contentWindow || !this.__iframe.contentWindow.document )
      {
        if (retry > 20) {
          throw new Error("can't initialize iframe");
        }

        window.setTimeout(function() {
          this.__waitForIFrame(callback, context, ++retry);
        }.bind(this), 10);

        return;
      }

      this.__iframeReady = true;
      callback.call(context || window);
    },


    /**
     * Attach hash change listeners
     */
    __attachListeners : function() {
      this.__intervalId = window.setInterval(this.__onHashChange.bind(this), 100);
    },


    /**
     * Remove hash change listeners
     */
    __detatchListeners : function()
    {
      window.clearInterval(this.__intervalId);
    },


    /**
     * hash change event handler
     */
    __onHashChange : function()
    {
      var currentState = this._readState();

      if (qx.lang.Type.isString(currentState) && currentState != this.getState()) {
        this._onHistoryLoad(currentState);
      }
    },


    /**
     * Browser dependent function to read the current state of the history
     *
     * @return {String} current state of the browser history
     */
    _readState : function() {
      return !this._getHash() ? "" : this._getHash().substr(1);
    },


    /**
     * Returns the fragment identifier of the top window URL. For gecko browsers we
     * have to use a regular expression to avoid encoding problems.
     *
     * @return {String|null} the fragment identifier or <code>null</code> if the
     * iframe isn't ready yet
     */
    _getHash : function()
    {
      if (!this.__iframeReady){
        return null;
      }
      return this.__iframe.contentWindow.document.location.hash;
    },


    /**
     * Save a state into the browser history.
     *
     * @param state {String} state to save
     */
    _writeState : function(state)
    {
      this._setHash(state);
    },


    /**
     * Sets the fragment identifier of the window URL
     *
     * @param value {String} the fragment identifier
     */
    _setHash : function (value)
    {
      if (!this.__iframe || !this._baseUrl){
        return;
      }
      var hash = !this.__iframe.contentWindow.document.location.hash ? "" : this.__iframe.contentWindow.document.location.hash.substr(1);
      if (value != hash) {
        this.__iframe.contentWindow.document.location.hash = value;
      }
    },


    dispose : function() {
      this.__detatchListeners();
      this.__iframe = null;
    }
  }
});

 qx.bom.HashHistory = clazz;
return clazz;
});

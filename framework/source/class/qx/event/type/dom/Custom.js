"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christopher Zuendorf (czuendorf)
     * Daniel Wagner (danielwagner)

************************************************************************ */

/**
 * Cross-browser custom UI event
 */
qx.Class.define("qx.event.type.dom.Custom", {

  extend : Object,

  statics : {
    PROPERTIES : {
      bubbles : false,
      cancelable : true
    }
  },

  /**
   * @param type {String} event type
   * @param domEvent {Event} Native event that will be used as a template for the new event
   * @param customProps {Map} Map of event properties (will override the domEvent's values)
   * @return {Event} event object
   */
  construct : function(type, domEvent, customProps) {
    this._type = type;
    this._event = this._createEvent();
    this._initEvent(domEvent, customProps);
    this._event._original = domEvent;

    this._event.preventDefault = function() {
      if (this._original.preventDefault) {
        this._original.preventDefault();
      } else {
        // In IE8, the original event can be a DispCEventObj which throws an
        // exception when trying to access its properties.
        try {
          this._original.returnValue = false;
        } catch(ex) {}
      }
    };

    if (this._event.stopPropagation) {
      this._event._nativeStopPropagation = this._event.stopPropagation;
    }

    this._event.stopPropagation = function() {
      this._stopped = true;
      if (this._nativeStopPropagation) {
        this._nativeStopPropagation();
        if (this._original.type.indexOf("gesture") !== 0) {
          this._original.stopPropagation();
        }
      } else {
        this._original.cancelBubble = true;
      }
    };

    return this._event;
  },

  members : {
    _type : null,
    _event : null,


    /**
     * Creates a custom event object
     * @return {Event} event object
     */
    _createEvent : function() {
      var evt;
      if (qx.core.Environment.get("event.customevent")) {
        evt = new window.CustomEvent(this._type);
      } else if (typeof document.createEvent == "function") {
        evt = document.createEvent("UIEvents");
      } else if (typeof document.createEventObject == "object") {
        // IE8 doesn't support custom event types
        evt = {};
        evt.type = this._type;
      }

      return evt;
    },

    /**
     * Initializes a custom event
     *
     * @param domEvent {Event} Native event that will be used as a template for the new event
     * @param customProps {Map} Map of event properties (will override the domEvent's values)
     */
    _initEvent : function(domEvent, customProps) {
      customProps = customProps || {};
      var defaultProps = qx.event.type.dom.Custom.PROPERTIES;
      var bubbles = customProps.bubbles !== undefined ? customProps.bubbles : defaultProps.bubbles;
      var cancelable = customProps.cancelable !== undefined ? customProps.cancelable : defaultProps.cancelable;

      if (this._event.initEvent) {
        this._event.initEvent(this._type, bubbles, cancelable);
      } else {
        this._event.bubbles = bubbles;
        this._event.cancelable = cancelable;
      }

      for (var prop in customProps) {
        // bubbles and cancelable are read-only in Gecko
        if (!(prop in defaultProps)) {
          this._event[prop] = customProps[prop];
        }
      }
    }
  }
});

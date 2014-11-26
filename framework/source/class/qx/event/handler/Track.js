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
 * Listens for synthetic gesture events and fires events
 * for track events.
 */
qx.Class.define("qx.event.handler.Track", {
  extend : Object,

  statics : {

    TYPES : ["track", "trackstart", "trackend"],

    GESTURE_EVENTS : ["gesturebegin", "gesturemove", "gesturecancel"]
  },

  /**
   * @param target {Element} DOM Element that should fire gesture events
   * is not supported, e.g. in IE8)
   */
  construct : function(target) {
    this.__defaultTarget = target;
    this._startTargets = {};
    this._initObserver();
  },

  members : {
    __defaultTarget : null,
    _startTargets : null,


    /**
     * Register pointer event listeners
     */
    _initObserver : function() {
      // force qx.bom.Event.supportsEvent to return true for this type so we
      // can use the native addEventListener (synthetic gesture events use the
      // native dispatchEvent).
      qx.event.handler.Track.TYPES.forEach(function(type) {
        if (!this.__defaultTarget["on" + type]) {
          this.__defaultTarget["on" + type] = true;
        }
      }.bind(this));

      var defaultTarget = qxWeb(this.__defaultTarget);
      qx.event.handler.Track.GESTURE_EVENTS.forEach(function(gestureType) {
        defaultTarget.on(gestureType, this.checkAndFireGesture, this);
      }.bind(this));

      qxWeb(document.documentElement).on("pointerup", this.gestureFinish, this);
    },


    /**
     * Remove native pointer event listeners.
     */
    _stopObserver : function() {
      var defaultTarget = qxWeb(this.__defaultTarget);
      qx.event.handler.Track.GESTURE_EVENTS.forEach(function(pointerType) {
        defaultTarget.off(pointerType, this.checkAndFireGesture, this);
      }.bind(this));

      qxWeb(document.documentElement).off("pointerup", this.gestureFinish, this);
    },


    /**
     * Checks if a gesture was made and fires the gesture event.
     *
     * @param domEvent {Event} DOM event
     */
    checkAndFireGesture : function(domEvent) {
      var type = domEvent.type;
      var target = qx.bom.Event.getTarget(domEvent);

      if (type == "gesturebegin") {
        this.gestureBegin(domEvent, target);
      } else if (type == "gesturemove") {
        this.gestureMove(domEvent, target);
      } else if (type == "gesturecancel") {
        this.gestureCancel(domEvent.pointerId);
      }
    },

    /**
     * Helper method for gesture start.
     *
     * @param domEvent {Event} DOM event
     * @param target {Element} event target
     */
    gestureBegin : function(domEvent, target) {
      if (this._startTargets[domEvent.pointerId]) {
        delete this._startTargets[domEvent.pointerId];
      }
      if (domEvent.isPrimary) {
        this._startTargets[domEvent.pointerId] = target;
        this._fireTrack("trackstart", domEvent, target);
      }
    },


    /**
     * Helper method for gesture move.
     *
     * @param domEvent {Event} DOM event
     * @param target {Element} event target
     */
    gestureMove : function(domEvent, target) {
      var startTarget = this._startTargets[domEvent.pointerId];
      if (startTarget) {
        this._fireTrack("track", domEvent, startTarget);
      }
    },


    /**
     * Checks if a DOM element located between the target of a gesture
     * event and the element this handler is attached to has a gesture
     * handler of its own.
     *
     * @param target {Element} The gesture event's target
     * @return {Boolean}
     */
    _hasIntermediaryHandler: function(target) {
      while (target && target !== this.__defaultTarget) {
        if (target.$$trackHandler) {
          return true;
        }
        target = target.parentNode;
      }
      return false;
    },


    /**
     * Helper method for gesture end.
     *
     * @param domEvent {Event} DOM event
     */
    gestureFinish : function(domEvent) {
      var startTarget = this._startTargets[domEvent.pointerId];

      // If no start position is available for this pointerup event, cancel gesture recognition.
      if (!startTarget) {
        return;
      }

      /*
        If the dom event's target or one of its ancestors have
        a gesture handler, we don't need to fire the gesture again
        since it bubbles.
       */
      if (this._hasIntermediaryHandler(this.__defaultTarget)) {
        delete this._startTargets[domEvent.pointerId];
        return;
      }

      this._fireTrack("trackend", domEvent, startTarget);

      delete this._startTargets[domEvent.pointerId];
    },


    /**
     * Cancels the gesture if running.
     * @param id {Number} The pointer Id.
     */
    gestureCancel : function(id) {
      if (this._startTargets[id]) {
        delete this._startTargets[id];
      }
    },


    /**
     * Fires a track event.
     *
     * @param type {String} the track type
     * @param domEvent {Event} DOM event
     * @param target {Element} event target
     */
    _fireTrack : function(type, domEvent, target) {
      // The target may have been removed
      if (!this.__defaultTarget) {
        return;
      }

      var evt = new qx.event.type.dom.Custom(type, domEvent, {
        bubbles: true,
        pointerType: domEvent.pointerType
      });
      target.dispatchEvent(evt);
    },


    /**
     * Dispose the current instance
     */
    dispose : function() {
      this._stopObserver();
      this.__defaultTarget = null;
    }
  }
});

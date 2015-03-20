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
 * Low-level pointer event handler.
 *
 * @require(qx.bom.client.Event)
 * @require(qx.lang.Function)
 * @require(qx.event.type.dom.Pointer)
 */
qx.Class.define("qx.event.handler.Pointer", {

  extend : Object,

  statics : {
    MOUSE_TO_POINTER_MAPPING: {
      mousedown: "pointerdown",
      mouseup: "pointerup",
      mousemove: "pointermove",
      mouseout: "pointerout",
      mouseover: "pointerover"
    },

    TOUCH_TO_POINTER_MAPPING: {
      touchstart: "pointerdown",
      touchend: "pointerup",
      touchmove: "pointermove",
      touchcancel: "pointercancel"
    },

    MSPOINTER_TO_POINTER_MAPPING: {
      MSPointerDown : "pointerdown",
      MSPointerMove : "pointermove",
      MSPointerUp : "pointerup",
      MSPointerCancel : "pointercancel",
      MSPointerLeave : "pointerleave",
      MSPointerEnter: "pointerenter",
      MSPointerOver : "pointerover",
      MSPointerOut : "pointerout"
    },

    POINTER_TO_GESTURE_MAPPING : {
      pointerdown : "gesturebegin",
      pointerup : "gesturefinish",
      pointercancel : "gesturecancel",
      pointermove : "gesturemove"
    },

    SIM_MOUSE_DISTANCE : 25,

    SIM_MOUSE_DELAY : 2500,

    /**
     * Coordinates of the last touch. This needs to be static because the target could
     * change between touch and simulated mouse events. Touch events will be detected
     * by one instance which moves the target. The simulated mouse events will be fired with
     * a delay which causes another target and with that, another instance of this handler.
     * last touch was.
     */
    __lastTouch : null
  },

  /**
   * Create a new instance
   *
   * @param target {Element} element on which to listen for native touch events
   */
  construct : function(target) {
    this.__defaultTarget = target;
    this.__eventNames = [];
    this.__buttonStates = [];
    this.__activeTouches = [];

    var engineName = qx.core.Environment.get("engine.name");
    var docMode = parseInt(qx.core.Environment.get("browser.documentmode"), 10);
    if (engineName == "mshtml" && docMode == 10) {
      this.__eventNames = ["MSPointerDown", "MSPointerMove", "MSPointerUp", "MSPointerCancel", "MSPointerOver", "MSPointerOut"];
      this._initPointerObserver();
    } else {
      if (qx.core.Environment.get("event.mspointer")) {
        this.__nativePointerEvents = true;
        this.__eventNames = ["pointerdown", "pointermove", "pointerup", "pointercancel", "pointerover", "pointerout"];
        this._initPointerObserver();
      }
    }
    if (!qx.core.Environment.get("event.mspointer")) {
      if (qx.core.Environment.get("device.touch")) {
        this.__eventNames = ["touchstart", "touchend", "touchmove", "touchcancel"];
        this._initObserver(this._onTouchEvent);
      }

      this.__eventNames = ["mousedown", "mouseup", "mousemove", "mouseover", "mouseout", "contextmenu"];
      this._initObserver(this._onMouseEvent);
    }
  },

  members : {
    __defaultTarget : null,
    __eventNames : null,
    __nativePointerEvents : false,
    __wrappedListener : null,
    __lastButtonState : 0,
    __buttonStates : null,
    __primaryIdentifier : null,
    __activeTouches : null,

    /**
     * Adds listeners to native pointer events if supported
     */
    _initPointerObserver : function() {
      this._initObserver(this._onPointerEvent);
    },


    /**
     * Register native event listeners
     * @param callback {Function} listener callback
     */
    _initObserver : function(callback) {
      this.__wrappedListener = qx.lang.Function.listener(callback, this);
      this.__eventNames.forEach(function(type) {
        qx.bom.Event.addNativeListener(this.__defaultTarget, type, this.__wrappedListener);
      }.bind(this));
    },

    /**
     * Handler for native pointer events
     * @param domEvent {Event}  Native DOM event
     */
    _onPointerEvent : function(domEvent) {
      if (!qx.core.Environment.get("event.mspointer") ||
          // workaround for bug #8533
          (qx.core.Environment.get("browser.documentmode") === 10 && domEvent.type.toLowerCase().indexOf("ms") == -1)
        )
      {
        return;
      }
      if (!this.__nativePointerEvents) {
        domEvent.stopPropagation();
      }
      var type = qx.event.handler.Pointer.MSPOINTER_TO_POINTER_MAPPING[domEvent.type] || domEvent.type;
      var evt = new qx.event.type.dom.Pointer(type, domEvent, {bubbles: true});
      this._fireEvent(evt, type, domEvent.target);
    },

    /**
     * Handler for touch events
     * @param domEvent {Event} Native DOM event
     */
    _onTouchEvent: function(domEvent) {
      if (domEvent.$$qxProcessed) {
        return;
      }

      domEvent.$$qxProcessed = true;
      var type = qx.event.handler.Pointer.TOUCH_TO_POINTER_MAPPING[domEvent.type];
      var changedTouches = domEvent.changedTouches;

      this._determineActiveTouches(domEvent.type, changedTouches);

      // Detecting vacuum touches. (Touches which are not active anymore, but did not fire a touchcancel event)
      if (domEvent.touches.length < this.__activeTouches.length) {
        // Firing pointer cancel for previously active touches.
        for (var i = this.__activeTouches.length - 1; i >= domEvent.touches.length; i--) {
          var cancelEvent = new qx.event.type.dom.Pointer("pointercancel", domEvent, {
            identifier: this.__activeTouches[i].identifier,
            target: domEvent.target,
            pointerType: "touch",
            pointerId: this.__activeTouches[i].identifier + 2
          });

          this._fireEvent(cancelEvent, "pointercancel", domEvent.target);
        }
        // remove vacuum touches
        var diff = this.__activeTouches.length - domEvent.touches.length;
        this.__activeTouches.splice(0, diff);
      }

      if (domEvent.type == "touchstart" && this.__primaryIdentifier === null) {
        this.__primaryIdentifier = changedTouches[0].identifier;
      }
      var l = changedTouches.length;
      for (i = 0; i < l; i++) {
        var touch = changedTouches[i];

        var touchTarget = document.elementFromPoint(touch.clientX, touch.clientY) || domEvent.target;

        var touchProps = {
          clientX: touch.clientX,
          clientY: touch.clientY,
          pageX: touch.pageX,
          pageY: touch.pageY,
          identifier: touch.identifier,
          screenX: touch.screenX,
          screenY: touch.screenY,
          target: touchTarget,
          pointerType: "touch",
          pointerId: touch.identifier + 2,
          bubbles: true
        };

        if (domEvent.type == "touchstart") {
          // Fire pointerenter before pointerdown
          var overEvt = new qx.event.type.dom.Pointer("pointerover", domEvent, touchProps);
          this._fireEvent(overEvt, "pointerover", touchProps.target);
        }

        if (touch.identifier == this.__primaryIdentifier) {
          touchProps.isPrimary = true;
          // always simulate left click on touch interactions for primary pointer
          touchProps.button = 0;
          touchProps.buttons = 1;
          qx.event.handler.Pointer.__lastTouch = {
            "x": touch.clientX,
            "y": touch.clientY,
            "time": new Date().getTime()
          };
        }

        var evt = new qx.event.type.dom.Pointer(type, domEvent, touchProps);

        this._fireEvent(evt, type, touchProps.target);

        if (domEvent.type == "touchend" || domEvent.type == "touchcancel") {
          // Fire pointerout after pointerup
          var outEvt = new qx.event.type.dom.Pointer("pointerout", domEvent, touchProps);
          // fire on the original target to make sure over / out event are on the same target
          this._fireEvent(outEvt, "pointerout", domEvent.target);

          if (this.__primaryIdentifier == touch.identifier) {
            this.__primaryIdentifier = null;
          }
        }
      }
    },


    /**
    * Handler for touch events
    * @param domEvent {Event} Native DOM event
    */
    _onMouseEvent : function(domEvent) {
      if (domEvent.$$qxProcessed) {
        return;
      }
      domEvent.$$qxProcessed = true;

      if (this._isSimulatedMouseEvent(domEvent.clientX, domEvent.clientY)) {
        /*
          Simulated MouseEvents are fired by browsers directly after TouchEvents
          for improving compatibility. They should not trigger PointerEvents.
        */
        return;
      }

      if (domEvent.type == "mousedown") {
        this.__buttonStates[domEvent.which] = 1;
      } else if (domEvent.type == "mouseup") {
        this.__buttonStates[domEvent.which] = 0;
      }

      var type = qx.event.handler.Pointer.MOUSE_TO_POINTER_MAPPING[domEvent.type];
      var buttonsPressed = qx.lang.Array.sum(this.__buttonStates);
      var mouseProps = {pointerType : "mouse", pointerId: 1, bubbles : true};

      // if the button state changes but not from or to zero
      if (this.__lastButtonState != buttonsPressed && buttonsPressed !== 0 && this.__lastButtonState !== 0) {
        var moveEvt = new qx.event.type.dom.Pointer("pointermove", domEvent, mouseProps);
        this._fireEvent(moveEvt, "pointermove", domEvent.target);
      }
      this.__lastButtonState = buttonsPressed;

      // pointerdown should only trigger form the first pressed button.
      if (domEvent.type == "mousedown" && buttonsPressed > 1) {
        return;
      }

      // pointerup should only trigger if user releases all buttons.
      if (domEvent.type == "mouseup" && buttonsPressed > 0) {
        return;
      }

      if (domEvent.type == "contextmenu") {
        this.__buttonStates[domEvent.which] = 0;
        return;
      }

      var evt = new qx.event.type.dom.Pointer(type, domEvent, mouseProps);
      this._fireEvent(evt, type, domEvent.target);
    },


    /**
     * Determines the current active touches.
     * @param type {String} the DOM event type.
     * @param changedTouches {Array} the current changed touches.
     */
    _determineActiveTouches: function(type, changedTouches) {
      if (type == "touchstart") {
        for (var i = 0; i < changedTouches.length; i++) {
          this.__activeTouches.push(changedTouches[i]);
        }
      } else if (type == "touchend" || type == "touchcancel") {
        var updatedActiveTouches = [];

        for (i = 0; i < this.__activeTouches.length; i++) {
          var add = true;
          for (var j = 0; j < changedTouches.length; j++) {
            if (this.__activeTouches[i].identifier == changedTouches[j].identifier) {
              add = false;
              break;
            }
          }

          if (add) {
            updatedActiveTouches.push(this.__activeTouches[i]);
          }
        }
        this.__activeTouches = updatedActiveTouches;
      }
    },


    /**
     * Detects whether the given MouseEvent position is identical to the previously fired TouchEvent position.
     * If <code>true</code> the corresponding event can be identified as simulated.
     * @param x {Integer} current mouse x
     * @param y {Integer} current mouse y
     * @return {Boolean} <code>true</code> if passed mouse position is a synthetic MouseEvent.
     */
    _isSimulatedMouseEvent: function(x, y) {
      var touch = qx.event.handler.Pointer.__lastTouch;
      if (touch) {
        var timeSinceTouch = new Date().getTime() - touch.time;
        var dist = qx.event.handler.Pointer.SIM_MOUSE_DISTANCE;
        var distX = Math.abs(x - qx.event.handler.Pointer.__lastTouch.x);
        var distY = Math.abs(y - qx.event.handler.Pointer.__lastTouch.y);
        if (timeSinceTouch < qx.event.handler.Pointer.SIM_MOUSE_DELAY) {
          if (distX < dist || distY < dist) {
            return true;
          }
        }
      }
      return false;
    },


    /**
     * Removes native pointer event listeners.
     */
    _stopObserver : function() {
      for (var i = 0; i < this.__eventNames.length; i++) {
        qx.bom.Event.removeNativeListener(this.__defaultTarget, this.__eventNames[i], this.__wrappedListener);
      }
    },

    /**
     * Fire a touch event with the given parameters
     *
     * @param domEvent {Event} DOM event
     * @param type {String ? null} type of the event
     * @param target {Element ? null} event target
     */
    _fireEvent: function(domEvent, type, target) {
      target = target || domEvent.target;
      type = type || domEvent.type;

      var gestureEvent;

      var isButtonPressed = domEvent.button === 0;
      if (!isButtonPressed && domEvent.buttons) {
        isButtonPressed = true;
      }

      if ((domEvent.pointerType !== "mouse" || isButtonPressed) &&
        (type == "pointerdown" || type == "pointerup" || type == "pointermove"))
      {
        gestureEvent = new qx.event.type.dom.Pointer(
          qx.event.handler.Pointer.POINTER_TO_GESTURE_MAPPING[type],
          domEvent,
          {
            bubbles: true,
            pointerType: domEvent.pointerType,
            pointerId: domEvent.pointerId
          }
        );
        qx.event.type.dom.Pointer.normalize(gestureEvent);
      }

      if (!this.__nativePointerEvents) {
        target.dispatchEvent(domEvent);
      }
      if (gestureEvent) {
        target.dispatchEvent(gestureEvent);
      }
    },

    /**
     * Dispose this object
     */
    dispose : function() {
      this._stopObserver();
      this.__defaultTarget = null;
    }
  }
});

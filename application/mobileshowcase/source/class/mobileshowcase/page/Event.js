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
     * Tino Butz (tbtz)
     * Christopher Zuendorf (czuendorf)

************************************************************************ */
define(["class/mobileshowcase/page/Abstract"], function(AbstractPage) {

/**
 * Mobile page responsible for showing the "event" showcase.
 * @require(qx.module.AnimationFrame)
 */
return qx.Class.define(null,
{
  extend : AbstractPage,

  construct : function()
  {
    this.super(AbstractPage, "construct", false);
    this.title = "Events";

    this.__circles = [];

    this.__pointers = {};

    if(qxWeb.env.get("browser.name")=="firefox") {
      this.__vendorPrefix = "moz";
    } else if (qxWeb.env.get("engine.name") == "mshtml") {
      this.__vendorPrefix = "ms";
    }
  },


  members :
  {
    __container: null,
    __showcaseContainer: null,
    __gestureTarget: null,
    __gestureTargetWrap: null,
    __label: null,
    __inMove: null,
    __circles: null,
    __initialScale: 0.3,
    __initialRotation: -15,
    __currentRotation: -15,
    __currentScale: 0.3,
    __maxScale: 1.5,
    __minScale: 0.3,
    __lastMultiTouchEventTime: 0,
    __vendorPrefix: "webkit",
    __logoLeft: -130,
    __logoTop: -130,
    __logoStartLeft: 0,
    __logoStartTop: 0,
    __pointers: null,


    // overridden
    _initialize : function()
    {
      this.super(AbstractPage, "_initialize");

      var sclayout = new qx.ui.layout.VBox();
      sclayout.alignX = "center";
      sclayout.alignY = "middle";
      var container =  this.__showcaseContainer = new qx.ui.Widget();
      container.layout = sclayout;
      container.addClass("eventcontainer");

      container.on("touchmove", function(evt) {
        evt.preventDefault();
      }, this);

      // CONTAINER TOUCH AREA
      var clayout = new qx.ui.layout.VBox();
      clayout.alignX = "center";
      clayout.alignY = "middle";
      var containerTouchArea = this.__container = new qx.ui.Widget();
      containerTouchArea.layout = clayout;
      containerTouchArea.addClass("container-touch-area");

      containerTouchArea.on("tap", this._onGesture, this);
      containerTouchArea.on("dbltap", this._onGesture, this);
      containerTouchArea.on("longtap", this._onGesture, this);
      containerTouchArea.on("swipe", this._onGesture, this);

      containerTouchArea.on("pointerdown", this._onPointer, this);
      containerTouchArea.on("pointermove", this._onPointer, this);
      containerTouchArea.on("pointerup", this._onPointer, this);
      containerTouchArea.on("pointercancel", this._onPointer, this);
      containerTouchArea.on("pointerout", this._onPointer, this);

      container.append(containerTouchArea);

      // GESTURE TARGET OBJECT
      this.__gestureTarget = new qx.ui.Image("mobileshowcase/icon/HTML5_Badge_512.png");

      this.__gestureTarget.addClass("gesture-target");
      this.__gestureTarget.on("trackstart", this.__onTrackStart, this);
      this.__gestureTarget.on("track", this.__onTrack, this);
      this.__gestureTarget.on("trackend", this.__onTrackEnd, this);
      this.__gestureTarget.on("pinch", this.__onPinch, this);
      this.__gestureTarget.on("rotate", this.__onRotate, this);
      this.__gestureTarget.setDraggable(false);
      this.__gestureTarget.on("dragstart", function(ev) {
        ev.preventDefault();
      });
      this.__gestureTarget.translate([(-5000) + "px", 0]);

      container.append(this.__gestureTarget);

      // POINTER VISUALIZATION CIRCLES
      for (var i = 0; i < 15; i++) {
        var circle = new qx.ui.Widget();
        circle.addClass("touch");

        this.__circles.push(circle);
        circle.translate([(-5000) + "px", 0]);
        circle.anonymous = true;

        containerTouchArea.append(circle);
      }

      var label = this.__label = new qx.ui.Label("Touch / Tap / Swipe this area");
      containerTouchArea.append(label);

      var descriptionText = "<b>Testing Pointer Events:</b> Touch / Tap / Swipe the area<br />\n\
      <b>Testing Multi-Pointer Events:</b> Touch the area with multiple fingers<br />\n\
      ";
      descriptionText += "<b>Testing Pinch/Zoom Gesture:</b> Touch HTML5 logo with two fingers<br />";
      descriptionText += "<b>Testing OrientationChange Event</b>: Rotate your device / change browser size";

      var descriptionGroup = new qx.ui.form.Group(descriptionText);
      var containerGroup = new qx.ui.form.Group()
        .append(container);
      descriptionGroup.layoutPrefs = {flex: 1};
      this.getContent().append(descriptionGroup);
      containerGroup.layoutPrefs = {flex: 1};
      this.getContent().append(containerGroup);

      // Center background gradient, when multiple pointers are available.
      this.__container.setStyle("background", "-" + this.__vendorPrefix + "-radial-gradient(50% 50%, cover, #1a82f7, #2F2727)");

      // Start rendering
      qxWeb.requestAnimationFrame(this._renderLabel, this);
      qxWeb.requestAnimationFrame(this._renderLogo, this);
    },


    /**
     * Event handler.
     *
     * @param evt {qx.event.type.Track} The track event.
     */
    __onTrackStart : function(evt) {
      this.__logoStartLeft = this.__logoLeft;
      this.__logoStartTop = this.__logoTop;
    },


    /**
     * Event handler.
     *
     * @param evt {qx.event.type.Track} The track event.
     */
    __onTrack : function(evt) {
      var delta = evt.delta;
      this.__logoLeft = this.__logoStartLeft + delta.x;
      this.__logoTop = this.__logoStartTop + delta.y;

      qxWeb.requestAnimationFrame(this._renderLogo, this);
    },


    /**
     * Event handler.
     *
     * @param evt {qx.event.type.Track} The track event.
     */
    __onTrackEnd : function() {
      this.__initialRotation = this.__currentRotation;
      this.__initialScale = this.__currentScale;
    },


    /**
     * Event handler.
     *
     * @param evt {qx.event.type.Rotate} The rotate event.
     */
    __onRotate : function(evt) {
      this.__currentRotation = this.__initialRotation + evt.angle;
      qxWeb.requestAnimationFrame(this._renderLogo, this);
    },


    /**
     * Event handler.
     *
     * @param evt {qx.event.type.Pinch} The pinch event.
     */
    __onPinch : function(evt) {
      var scale = evt.scale * this.__initialScale;
      this.__currentScale = (Math.round(scale * 100) / 100);

      this.__currentScale = Math.max(this.__currentScale,this.__minScale);
      this.__currentScale = Math.min(this.__currentScale,this.__maxScale);

      qxWeb.requestAnimationFrame(this._renderLogo, this);
    },


    /**
     * Event handler.
     *
     * @param evt {qx.event.type.Pointer} The pointer event.
     */
    _onGesture : function(evt) {
      var pointer = this.__pointers[evt._original.pointerId]; //TODO: evt.pointerId
      if (pointer) {
        this.__pointers[evt._original.pointerId].events.push(evt.type);
      }
      qxWeb.requestAnimationFrame(this._renderLabel, this);
    },


    /**
     * Reacts on pointer events and updates the event container background and pointer markers.
     *
     * @param evt {qx.event.type.Pointer} The pointer event.
     */
    _updatePointerPosition : function(evt) {
      var position = this._getPointerPosition(evt);

      this._setPointerCirclePosition(evt.pointerId, position[0], position[1]);
    },


    /**
    * Resets the pointer circle position.
    *
    * @param pointerId {Integer} corresponding pointerId.
    */
    _resetPointerPosition : function(pointerId) {
      var pointer = this.__pointers[pointerId];

      if (pointer && pointer.target && !pointer.remove) {
        this.__circles.push(pointer.target);
        pointer.remove = true;
        pointer.target.translate(["-1000px", "-1000px"]);
      }
    },


    /**
    * Sets the pointer circle position.
    *
    * @param pointerId {Integer} corresponding pointerId.
    * @param x {Integer} pointer position x.
    * @param y {Integer} pointer position y.
    */
    _setPointerCirclePosition : function(pointerId,x,y) {
      // Disable pointer circles Windows Phone 8 as no pointer-events:none is available.
      if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
        return;
      }

      var pointer = this.__pointers[pointerId];
      if (pointer && pointer.target && pointer.remove == false) {
        pointer.target.translate([x + "px", y + "px"]);
      }
    },


    /**
    * Calculates the pointer position relative to its container.
    *
    * @param evt {qx.event.type.Pointer} The pointer event.
    */
    _getPointerPosition : function(evt) {
      var containerLeft = this.__container.getLocation().left;
      var containerTop = this.__container.getLocation().top;
      return [evt.clientX - containerLeft, evt.clientY - containerTop];
    },


    /**
     * Event handler.
     *
     * @param evt {qx.event.type.Pointer} The pointer event.
     */
    _onPointer : function(evt)
    {
      var type = evt.type;
      var pointerId = evt.pointerId;

      if (type == "pointerdown") {
        for (var key in this.__pointers) {
          var pointerToDelete = this.__pointers[key];
          if(pointerToDelete.remove) {
            delete this.__pointers[key];
          }
        }

        this.__pointers[pointerId] = {
          target: this.__circles.pop(),
          events: [],
          remove: false
        };

        this._updatePointerPosition(evt);
      }

      if(type == "pointermove") {
        this._updatePointerPosition(evt);
      }


      if(this.__pointers[pointerId] && !this.__pointers[pointerId].remove) {
        var pointerEvents = this.__pointers[pointerId].events;
        if(pointerEvents.length > 0) {
          var lastEventType = pointerEvents[pointerEvents.length -1];
          if (lastEventType != type) {
            pointerEvents.push(type);
          }
        } else {
          pointerEvents.push(type);
        }
      }

      if (type == "pointerup" || type == "pointercancel" || type == "pointerout") {
        // Remove all circles out of visible area
        this._resetPointerPosition(pointerId);

        if (evt.isPrimary) {
          this.__initialRotation = this.__currentRotation;
          this.__initialScale = this.__currentScale;
        }
      }

      qxWeb.requestAnimationFrame(this._renderLabel, this);
    },


    /**
    * Renders the position of the HTML5 Logo.
    */
    _renderLogo : function() {
      // Render HTML5 logo: rotation and scale.
      var transitionValue = "translate(" + (this.__logoLeft) + "px" + "," + (this.__logoTop) + "px) ";
      transitionValue = transitionValue + " scale(" + (this.__currentScale) + ")";
      transitionValue = transitionValue + " rotate(" + (this.__currentRotation) + "deg)";

      this.__gestureTarget.setStyle("transform", transitionValue);
    },


    /**
    * Renders the label text.
    */
    _renderLabel : function() {
      var labelBuffer = "";
      for (var pointerId in this.__pointers) {
        var pointer = this.__pointers[pointerId];
         labelBuffer = labelBuffer + "<div class='pointers'>";
        labelBuffer = labelBuffer + "<span class='pointer'>" + pointerId + "</span>";
        for (var i = 0; i < pointer.events.length; i++) {
          labelBuffer = labelBuffer + " <span class='event'>" + pointer.events[i] + "</span>";
        };
        labelBuffer = labelBuffer + "</div>";
      };
      this.__label.value = labelBuffer;
    }
  }
});

});
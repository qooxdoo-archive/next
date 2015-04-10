"use strict";
/* ************************************************************************

 qooxdoo - the new era of web development

 http://qooxdoo.org

 Copyright:
 2004-2014 1&1 Internet AG, Germany, http://www.1und1.de

 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.

 Authors:
 * Christopher Zuendorf (czuendorf)

 ************************************************************************ */

/**
 * Mobile page showing a HTML5 canvas example.
 *
 * @require(qx.module.event.TrackHandler)
 */
qx.Class.define("mobileshowcase.page.Canvas",
  {
    extend: mobileshowcase.page.Abstract,

    construct: function () {
      this.super("construct", false);
      this.title = "Canvas";
      this.__ratio = qxWeb.env.get("device.pixelRatio");
    },

    members: {
      __canvasLeft: 0,
      __canvasTop: 0,
      __canvas: null,
      __lastPoint: null,
      __canvasSize: 1000,
      __ratio: 1,

      // overridden
      _initialize: function () {
        this.super("_initialize");

        this.__lastPoint = {};

        var clearButton = new qx.ui.Button("Clear");
        clearButton.on("tap", this.__clearCanvas, this);

        this.getRightContainer().append(clearButton);

        var canvasSize = Math.max(q(window).getWidth() * 1.5, q(window).getHeight() * 1.5);

        // Limit to maximum canvas size of iOS devices.
        canvasSize = Math.min(canvasSize, 1448 / this.__ratio);

        this.__canvasSize = canvasSize;

        var canvas = this.__canvas = qxWeb.create('<canvas>');

        canvas.on("trackstart", this._onTrackStart, this)
          .on("trackend", this._onTrackEnd, this)
          .on("track", this._onTrack, this)
          .on("touchstart", function (e) {
            e.preventDefault();
          }, this)
          .setAttribute("width", this._to(this.__canvasSize))
          .setAttribute("height", this._to(this.__canvasSize))
          .setStyle("width", this.__canvasSize + "px")
          .setStyle("height", this.__canvasSize + "px");

        this.getContent().append(canvas);

        this.__clearCanvas();
        this._drawExample();
      },


      _createScrollContainer: function () {
        return new qx.ui.Widget();
      },


      /**
       * Calculates the correct position in relation to the device pixel ratio.
       * @return {Number} the correct position.
       */
      _to: function (value) {
        return value * this.__ratio;
      },


      /**
       * Draws the example on the canvas.
       */
      _drawExample: function () {
        // Comment in Text
        var ctx = this.__canvas[0].getContext('2d');
        ctx.fillStyle = 'gray';
        ctx.font = 'bold ' + this._to(16) + 'px Helvetica';
        ctx.fillText('Start drawing here ...', this._to(15), this._to(25));

        // Smiley
        ctx.strokeStyle = '#3D72C9';
        ctx.beginPath();
        ctx.arc(475, 85, 50, 0, Math.PI * 2, true);
        ctx.moveTo(510, 85);
        ctx.arc(475, 85, 35, 0, Math.PI, false);
        ctx.moveTo(465, 75);
        ctx.arc(460, 75, 5, 0, Math.PI * 2, true);
        ctx.moveTo(495, 75);
        ctx.arc(490, 75, 5, 0, Math.PI * 2, true);
        ctx.stroke();
      },


      /**
       * Removes any drawings off the canvas.
       */
      __clearCanvas: function () {
        this.__canvas.setAttribute("width", this.__canvas.getAttribute("width"));
        var ctx = this.__canvas[0].getContext('2d');
        ctx.clearRect(0, 0, this._to(this.__canvasSize), this._to(this.__canvasSize));
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, this._to(this.__canvasSize), this._to(this.__canvasSize));
        ctx.fill();
      },


      /**
       * Handles the <code>trackstart</code>  event on canvas.
       */
      _onTrackStart: function (evt) {
        this.__canvasLeft = this.__canvas[0].getBoundingClientRect().left;
        this.__canvasTop = this.__canvas[0].getBoundingClientRect().top;

        this.__draw(evt);
      },


      /**
       * Handles the <code>track</code>  event on canvas.
       */
      _onTrack: function (evt) {
        this.__draw(evt);

        evt.preventDefault();
        evt.stopPropagation();
      },


      /**
       * Handles the <code>trackend</code> event on canvas.
       */
      _onTrackEnd: function () {
        this.__lastPoint = {};
      },


      /**
       * Draws the line on canvas.
       */
      __draw: function (evt) {
        var ctx = this.__canvas[0].getContext('2d');
        var lastPoint = this.__lastPoint[evt._original.pointerId];

        var pointerLeft = evt._original.clientX - this.__canvasLeft;
        var pointerTop = evt._original.clientY - this.__canvasTop;

        var opacity = null;

        if (lastPoint) {
          ctx.beginPath();
          ctx.lineCap = 'round';
          ctx.moveTo(this._to(lastPoint.x), this._to(lastPoint.y));
          ctx.lineTo(this._to(pointerLeft), this._to(pointerTop));

          var deltaX = Math.abs(lastPoint.x - pointerLeft);
          var deltaY = Math.abs(lastPoint.y - pointerTop);

          var velocity = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

          opacity = (100 - velocity) / 100;
          opacity = Math.round(opacity * Math.pow(10, 2)) / Math.pow(10, 2);

          if (!lastPoint.opacity) {
            lastPoint.opacity = 1;
          }
          if (opacity < 0.1) {
            opacity = 0.1;
          }

          // linear gradient from start to end of line
          var grad = ctx.createLinearGradient(lastPoint.x, lastPoint.y, pointerLeft, pointerTop);
          grad.addColorStop(0, 'rgba(61,114,201,' + lastPoint.opacity + ')');
          grad.addColorStop(1, 'rgba(61,114,201,' + opacity + ')');
          ctx.strokeStyle = grad;

          ctx.lineWidth = this._to(1.5);

          ctx.stroke();
        }

        this.__lastPoint[evt._original.pointerId] = {
          "x": pointerLeft,
          "y": pointerTop,
          "opacity": opacity
        };
      }
    }
  });

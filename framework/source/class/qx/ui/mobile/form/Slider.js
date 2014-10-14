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
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * The Slider widget provides horizontal slider.
 *
 * The Slider is the classic widget for controlling a bounded value.
 * It lets the user move a slider handle along a horizontal
 * groove and translates the handle's position into an integer value
 * within the defined range.
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *    var slider= new qx.ui.mobile.form.Slider().set({
 *       minimum : 0,
 *       maximum : 10,
 *       step : 2
 *     });
 *     slider.on("changeValue", handler, this);
 *
 *   this.getRoot.append(slider);
 * </pre>
 *
 * This example creates a slider and attaches an
 * event listener to the {@link #changeValue} event.
 *
 * @require(qx.module.AnimationFrame)
 * @group(Widget)
 */
qx.Class.define("qx.ui.mobile.form.Slider",
{
  extend : qx.ui.mobile.Widget,
  include : [
    qx.ui.mobile.form.MForm
  ],
  implement : [
    qx.ui.form.IForm
  ],


  /**
   * @attach {qxWeb, slider}
   * @return {qx.ui.mobile.form.Slider} The new Slider widget.
   */
  construct : function(element)
  {
    this.base(qx.ui.mobile.Widget, "constructor", element);
    this.append(this._createKnobElement());
    this._registerEventListener();
    this._refresh();
    this.displayValue = undefined;

    this.addClass("gap");
    this.initMForm();
  },


  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "slider"
    },


    /**
     * Model property for storing additional information for the Slider.
     *
     * Be careful using that property as this is used for the
     * {@link qx.ui.form.MModelSelection} it has some restrictions:
     *
     * * Don't use equal models in one widget using the
     *     {@link qx.ui.form.MModelSelection}.
     *
     * * Avoid setting only some model properties if the widgets are added to
     *     a {@link qx.ui.form.MModelSelection} widget.
     *
     * Both restrictions result of the fact, that the set models are deputies
     * for their widget.
     */
    model :
    {
      nullable : true,
      event : true
    },


    /**
     * The minimum slider value (may be negative). This value must be smaller
     * than {@link #maximum}.
     */
    minimum :
    {
      check : "Number",
      init : 0,
      apply : "_refresh",
      event : true
    },


    /**
     * The maximum slider value (may be negative). This value must be larger
     * than {@link #minimum}.
     */
    maximum :
    {
      check : "Number",
      init : 100,
      apply : "_refresh",
      event : true
    },


    /**
     * The amount to increment on each event. Typically corresponds
     * to the user moving the knob.
     */
    step :
    {
      check : "Number",
      init : 1,
      event : true
    },


    /**
     * Reverses the display direction of the slider knob. If true, the maxium of
     * the slider is on the left side and minimum on the right side.
     */
    reverseDirection :
    {
      check : "Boolean",
      init : false,
      apply : "_refresh"
    },


    /**
     * Adjusts which slider value should be displayed inside the knob.
     * If <code>null</code> no value will be displayed.
     */
    displayValue :
    {
      init : "percent",
      check : [ "value", "percent" ],
      nullable : true,
      apply : "_applyDisplayValue"
    }
  },


  members :
  {
    _knobElement : null,
    _containerElementWidth : null,
    _containerElementLeft : null,
    _pixelPerStep : null,
    __value: 0,



    /**
     * Increments the current value.
     */
    nextValue : function() {
      this.value = this.value + this.step;
    },


    /**
     * Decrements the current value.
     */
    previousValue : function() {
      this.value = this.value - this.step;
    },


    /**
     * Creates the knob element.
     *
     * @return {Element} The created knob element
     */
    _createKnobElement : function()
    {
      return qxWeb.create("<div>")[0];
    },


    /**
     * Registers all needed event listeners.
     */
    _registerEventListener : function()
    {
      this.on("pointerdown", this._onPointerDown, this);
      this.on("track", this._onTrack, this);
      this.on("appear", this._refresh, this);

      qxWeb(window).on("resize", this._refresh, this)
        .on("orientationchange", this._refresh, this);
    },


    /**
     * Unregisters all needed event listener.
     */
    _unregisterEventListener : function()
    {
      this.off("pointerdown", this._onPointerDown, this);
      this.off("track", this._onTrack, this);
      this.off("appear", this._refresh, this);

      qxWeb(window).off("resize", this._refresh, this)
        .off("orientationchange", this._refresh, this);
    },


    /**
     * Refreshes the slider and the knob position.
     */
    _refresh : function(ev)
    {
      this._updateSizes();
      this._updateKnobPosition();
    },


    /**
     * Updates all internal sizes of the slider.
     */
    _updateSizes : function()
    {
      if(this[0]) {
        this._containerElementWidth = this.getWidth();
        this._containerElementLeft = this[0].getBoundingClientRect().left;
        this._pixelPerStep = this._getPixelPerStep(this._containerElementWidth);
      }
    },


    /**
     * Event handler. Called when the <code>pointerdown</code> event occurs.
     *
     * @param evt {qx.event.type.Pointer} The pointer event.
     */
    _onPointerDown: function(evt)
    {
      if (evt.isPrimary) {
        this._updateSizes();
        var position = this._getPosition(evt.pageX);
        this.value = this._positionToValue(position);

        evt.stopPropagation();
      }
    },


    /**
     * Event handler. Called when the <code>track</code> event occurs.
     *
     * @param evt {qx.event.type.Track} The track event.
     */
    _onTrack : function(evt)
    {
      var position = this._getPosition(evt._original.pageX);
      this.value = this._positionToValue(position);
      evt.stopPropagation();
      evt.preventDefault();
    },


    /**
     * Returns the current position of the knob.
     *
     * @param documentLeft {Integer} The left positon of the knob
     * @return {Integer} The current position of the container element.
     */
    _getPosition : function(documentLeft)
    {
      return documentLeft - this._containerElementLeft;
    },


    /**
     * Returns the knob DOM element.
     *
     * @return {Element} The knob DOM element.
     */
    _getKnobElement : function()
    {
      if (!this._knobElement) {
        var element = this[0];
        if (element) {
          this._knobElement = element.childNodes[0];
        }
      }
      return this._knobElement;
    },

    /**
     * Sets the value of this slider.
     * It is called by the setValue method of the qx.ui.mobile.form.MForm
     * mixin
     * @param value {Integer} the new value of the slider
     */
    _setValue : function(value)
    {
      this.__value = value;
      qxWeb.requestAnimationFrame(this._refresh, this);
    },

    /**
     * Gets the value [true/false] of this slider.
     * It is called by the getValue method of the qx.ui.mobile.form.MForm mixin
     * @return {Integer} the value of the slider
     */
    _getValue : function() {
      return this.__value;
    },


    /**
     * Updates the knob position based on the current value.
     */
    _updateKnobPosition : function()
    {
      var percent = this._valueToPercent(this.value);

      var width = this._containerElementWidth;
      var position = Math.floor(this._percentToPosition(width, percent));

      var knobElement = this._getKnobElement();
      if (knobElement) {
        qxWeb(knobElement).setStyle("width", width - (width - position) + "px")
          .setData("value", this.value)
          .setData("percent", Math.floor(percent));
      }
    },


    // Property apply
    _applyDisplayValue : function(value, old ) {
      if (old != null) {
        this.removeClass(old);
      }
      if (value != null) {
        this.addClass(value);
      }
    },


    /**
     * Converts the given value to percent.
     *
     * @param value {Integer} The value to convert
     * @return {Integer} The value in percent
     */
    _valueToPercent : function(value)
    {
      var min = this.minimum;
      var value = this._limitValue(value);

      var percent = ((value - min) * 100) / this._getRange();

      if (this.reverseDirection) {
        return 100 - percent;
      } else {
        return percent;
      }
    },


    /**
     * Converts the given position to the corresponding value.
     *
     * @param position {Integer} The position to convert
     * @return {Integer} The converted value
     */
    _positionToValue : function(position)
    {
      var value = this.minimum + (Math.round(position / this._pixelPerStep) * this.step);
      value = this._limitValue(value);
      if(this.reverseDirection) {
        var center = this.minimum + this._getRange()/2;
        var dist = center-value;
        value = center + dist;
      }

      return value;
    },


    /**
     * Converts the given percent to the position of the knob.
     *
     * @param width {Integer} The width of the slider container element
     * @param percent {Integer} The percent to convert
     * @return {Integer} The position of the knob
     */
    _percentToPosition : function(width, percent)
    {
      return width * (percent / 100);
    },


    /**
     * Limits a value to the set {@link #minimum} and {@link #maximum} properties.
     *
     * @param value {Integer} The value to limit
     * @return {Integer} The limited value
     */
    _limitValue : function(value)
    {
      value = Math.min(value, this.maximum);
      value = Math.max(value, this.minimum);
      return value;
    },


    /**
     * Return the number of pixels per step.
     *
     * @param width {Integer} The width of the slider container element
     * @return {Integer} The pixels per step
     */
    _getPixelPerStep : function(width)
    {
      return width / this._getOverallSteps();
    },


    /**
     * Return the overall number of steps.
     *
     * @return {Integer} The number of steps
     */
    _getOverallSteps : function()
    {
      return (this._getRange() / this.step);
    },


    /**
     * Return the range between {@link #maximum} and {@link #minimum}.
     *
     * @return {Integer} The range between {@link #maximum} and {@link #minimum}
     */
    _getRange : function()
    {
      return this.maximum - this.minimum;
    },


    dispose : function() {
      this.base(qx.ui.mobile.Widget, "dispose");
      this._knobElement = null;
      this._unregisterEventListener();
      this.disposeMForm();
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});
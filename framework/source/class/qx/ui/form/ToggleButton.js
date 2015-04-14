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
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/**
 * A toggle Button widget
 *
 * If the user tap the button, the button toggles between the <code>ON</code>
 * and <code>OFF</code> state.
 *
 * This example creates a toggle button and attaches an
 * event listener to the {@link #changeValue} event.
 *
 * @require(qx.module.event.Swipe)
 * @require(qx.module.event.GestureHandler)
 * @require(qx.module.event.Track)
 * @require(qx.module.event.TrackHandler)
 *
 * @group(Widget)
 */
qx.Class.define("qx.ui.form.ToggleButton", {
  extend: qx.ui.Widget,
  include: [
    qx.ui.form.MForm
  ],
  implement: [
    qx.ui.form.IForm
  ],


  /**
   * @param value {Boolean?null} The value of the button
   * @param labelChecked {Boolean?"ON"} The value of the text display when toggleButton is active
   * @param labelUnchecked {Boolean?"OFF"} The value of the text display when toggleButton is inactive
   * @attach {qxWeb, toToggleButton}
   * @return {qx.ui.form.ToggleButton} The new toggle button widget.
   */
  construct: function(value, labelChecked, labelUnchecked) {
    this.super("construct");

    if (labelChecked && labelUnchecked) {
      this.__labelUnchecked = labelUnchecked;
      this.__labelChecked = labelChecked;
    }

    this
      .addClass("gap")
      .setData("label-checked", this.__labelChecked)
      .setData("label-unchecked", this.__labelUnchecked)
      .on("tap", this.toggle, this)
      ._createSwitch()
        .on("track", this._onTrack, this)
        .on("trackend", this._onTrackend, this)
        .appendTo(this);

    this.value = !!value;

    if (!this.isRendered()) {
      this.once("appear", function() {
        if (value){
          this._setSwitchRight();
        }
      }, this);
    }

    this.initMForm();
  },


  properties: {
    // overridden
    defaultCssClass: {
      init: "togglebutton"
    }
  },


  members: {
    __value: false,
    __labelUnchecked: "OFF",
    __labelChecked: "ON",


    // overridden
    setValue: function(value) {
      this.value = value;
      if (this.value) {
        this._setSwitchRight();
      } else {
        this._setSwitchLeft();
      }
    },


    // overridden
    getValue: function() {
      return this.value;
    },


    /**
     * Toggles the value of the button.
     *
     * @return {qx.ui.form.ToggleButton} The instance for chaining
     */
    toggle: function() {
      this.setValue(!this.getValue());
      return this;
    },


    /**
     * Creates the switch control of the widget.
     *
     * @return {qx.ui.Widget} The switch control.
     */
    _createSwitch: function() {
      return new qx.ui.Widget()
        .addClass("togglebutton-switch");
    },


    /**
     * Sets the value [true/false] of this toggle button.
     * Called by the setValue method of the qx.ui.form.MForm mixin
     *
     * @param value {Boolean} the new value of the toggle button
     * @return {Boolean} The value of the toggle button
     */
    _setValue: function(value) {
      if (typeof value !== 'boolean') {
        throw new Error("value for " + this + " must be boolean");
      }
      if (value) {
        this.addClass("checked");
      } else {
        this.removeClass("checked");
      }
      this.__value = value;

      return value;
    },


    /**
     * Gets the value [true/false] of this toggle button.
     * Called by the getValue method of the qx.ui.form.MForm mixin
     *
     * @return {Boolean} the value of the toggle button
     */
    _getValue: function() {
      return this.__value;
    },


    /**
     * Aligns the switch with the button's right edge
     */
    _setSwitchRight: function() {
      var left = this.getContentWidth() - this.getChildren().getWidth();
      this.getChildren().translate(left + "px");
    },


    /**
     * Aligns the switch with the button's left edge
     */
    _setSwitchLeft: function() {
      this.getChildren().translate("0px");
    },


    /**
     * Event handler. Called when the track event occurs.
     * Tracks the switch and toggles.
     *
     * @param evt {qx.event.type.Track} The track event.
     */
    _onTrack: function(evt) {
      var tSwitch = this.getChildren(".togglebutton-switch");
      var buttonLeftBorder = parseInt(this.getStyle("borderLeftWidth"));
      var buttonLeftPadding = parseInt(this.getStyle("paddingLeft"));

      var limitLeft = this.getContentWidth() - tSwitch.getWidth();
      var left = tSwitch.getLocation().left - this.getLocation().left - buttonLeftBorder -
        buttonLeftPadding + evt.movementX;
      left = Math.min(left, limitLeft);
      left = Math.max(0, left);
      tSwitch.translate(left + "px");

      this.value = !this.__isSwitchLeftSided();
    },


    /**
     * Event handler. Called when the trackend event occurs.
     * Toggles the button.
     *
     */
    _onTrackend: function() {
      this.setValue(!this.__isSwitchLeftSided());
    },


    /**
     * Determines if the switch is within the left half of the button
     * @return {Boolean} <code>true</code> if the switch is on the left side
     */
    __isSwitchLeftSided: function() {
      var toggleCenter = this.getOffset().left + this.getWidth() /2;
      var switchCenter = this.getChildren().getOffset().left + this.getChildren().getWidth() /2;
      return switchCenter < toggleCenter;
    },


    // overridden
    dispose: function() {
      this.super("dispose");
      this.off("tap", this.toggle, this);
      this.find(".togglebutton-switch")
        .off("track", this._onTrack, this)
        .off("trackend", this._onTrack, this)
        .dispose();
      this.disposeMForm();
    }
  },


  classDefined: function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

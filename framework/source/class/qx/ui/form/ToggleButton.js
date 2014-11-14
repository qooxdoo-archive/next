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
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *   var button = new qx.ui.form.ToggleButton(false,"YES","NO");
 *
 *   button.on("changeValue", function(value) {
 *     alert(value);
 *   }, this);
 *
 *   this.getRoot.append(button);
 * </pre>
 *
 * This example creates a toggle button and attaches an
 * event listener to the {@link #changeValue} event.
 *
 * @require(qx.module.event.Swipe)
 */
qx.Class.define("qx.ui.form.ToggleButton",
{
  extend : qx.ui.Widget,
  include : [
    qx.ui.form.MForm
  ],
  implement : [
    qx.ui.form.IForm
  ],


  /**
   * @param value {Boolean?null} The value of the button
   * @param labelChecked {Boolean?"ON"} The value of the text display when toggleButton is active
   * @param labelUnchecked {Boolean?"OFF"} The value of the text display when toggleButton is inactive
   * @attach {qxWeb, toToggleButton}
   * @return {qx.ui.form.ToggleButton} The new toggle button widget.
   */
  construct : function(value, labelChecked, labelUnchecked)
  {
    this.super(qx.ui.Widget, "constructor");

    if(labelChecked && labelUnchecked) {
       this.__labelUnchecked = labelUnchecked;
       this.__labelChecked = labelChecked;
    }

    this.setData("label-checked", this.__labelChecked);
    this.setData("label-unchecked", this.__labelUnchecked);

    this.__switch = this._createSwitch();
    this.append(this.__switch);

    if (value) {
      this.value = value;
    }

    this.on("tap", this._onTap, this);
    this.on("swipe", this._onSwipe, this);

    this.addClass("gap");
    this.initMForm();
  },


  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "togglebutton"
    },


    /**
     * Model property for storing additional information for the ToggleButton.
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
    }
  },


  members :
  {
    __switch : null,
    __value : false,
    __labelUnchecked : "OFF",
    __labelChecked : "ON",
    __lastToggleTimestamp : 0,

    // overridden
    setValue: function(value) {
      this.value = value;
    },


    // overridden
    getValue: function() {
      return this.value;
    },


    /**
     * Returns the child control of the toggle button.
     *
     * @return {qx.ui.Widget} the child control.
     */
    _getChild : function() {
      return this.__switch;
    },


    /**
     * Creates the switch control of the widget.
     * @return {qx.ui.Widget} The switch control.
     */
    _createSwitch : function() {
      var toggleButtonSwitch = new qx.ui.Widget();
      toggleButtonSwitch.addClass("togglebutton-switch");
      return toggleButtonSwitch;
    },


    /**
     * Sets the value [true/false] of this toggle button.
     * It is called by the setValue method of the qx.ui.form.MForm
     * mixin
     * @param value {Boolean} the new value of the toggle button
     */
    _setValue : function(value)
    {
      if (typeof value !== 'boolean') {
        throw new Error("value for "+this+" should be boolean");
      }
      if (value) {
        this.addClass("checked");
      } else {
        this.removeClass("checked");
      }
       this.__value = value;
    },

    /**
     * Gets the value [true/false] of this toggle button.
     * It is called by the getValue method of the qx.ui.form.MForm mixin
     * @return {Boolean} the value of the toggle button
     */
    _getValue : function() {
      return this.__value;
    },


    /**
     * Toggles the value of the button.
     */
    toggle : function() {
      this.setValue(!this.getValue());
    },


    /**
     * Event handler. Called when the tap event occurs.
     * Toggles the button.
     *
     * @param evt {qx.event.type.Tap} The tap event.
     */
    _onTap : function(evt)
    {
      if(this._checkLastPointerTime()) {
        this.toggle();
      }
    },


    /**
     * Event handler. Called when the swipe event occurs.
     * Toggles the button, when.
     *
     * @param evt {qx.event.type.Swipe} The swipe event.
     */
    _onSwipe : function(evt)
    {
      if (this._checkLastPointerTime()) {
        var direction = evt.getDirection();
        if (direction == "left") {
          if (this.__value == true) {
            this.toggle();
          }
        } else {
          if (this.__value == false) {
            this.toggle();
          }
        }
      }
    },


    /**
     * Checks if last touch event (swipe,tap) is more than 500ms ago.
     * Bugfix for several simulator/emulator, when tap is immediately followed by a swipe.
     * @return {Boolean} <code>true</code> if the last event was more than 500ms ago
     */
    _checkLastPointerTime : function() {
      var elapsedTime = new Date().getTime() - this.__lastToggleTimestamp;
      this.__lastToggleTimestamp = new Date().getTime();
      return elapsedTime>500;
    },

    dispose : function() {
      this.super(qx.ui.Widget, "dispose");
      this.off("tap", this._onTap, this);
      this.off("swipe", this._onSwipe, this);

      this.__switch && this.__switch.dispose();
      this.disposeMForm();
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});
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
 *
 * @group(Widget)
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
    this.super(qx.ui.Widget, "construct");

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

    this.on("appear", function(){
      if (value){
        this._setKnobRight();
      }
    });

    this.on("tap", this._onTap, this);
    this.getChildren().on("track", this._onTrack, this);
    this.getChildren().on("trackend", this._onTrackend, this);
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

    // overridden
    setValue : function(value) {
      this.value = value;
    },


    // overridden
    getValue : function() {
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
        throw new Error("value for " + this + " should be boolean");
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


    _setKnobRight : function() {
      return this.getChildren().translate(this.getWidth()-this.getChildren().getWidth() -2 + "px");
    },


    _setKnobLeft : function() {
      return this.getChildren().translate("0px");
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
     */
    _onTap : function()
    {
      if(this._getValue()){
        this.setValue(false);
        this._setKnobLeft();
      }else{
        this.setValue(true);
        this._setKnobRight();
      }
    },


    /**
     * Event handler. Called when the track event occurs.
     * Tracks the switch and toggles.
     *
     * @param evt {qx.event.type.Track} The track event.
     */
    _onTrack : function(evt) {

      if (this.__isPointerOutLeft(evt)) {
        this.setValue(false);
        this._setKnobLeft();
      } else if (this.__isPointerOutRight(evt)) {
        this.setValue(true);
        this._setKnobRight();

      } else {
        if (evt.delta.x < 0 && (this.getChildren().getOffset().left - 1 !== this.getOffset().left)) {
          this.getChildren().translate(this.getWidth() - this.getChildren().getWidth() + evt.delta.x + "px");
        } else if (evt.delta.x > 0 && (this.getChildren().getOffset().right + 1 !== this.getOffset().right)) {
          this.getChildren().translate(evt.delta.x + "px");
        }
      }

      if (this.__isSwitchLeftSided()) {
        this.setValue(false);
      } else {
        this.setValue(true);
      }
    },


    /**
     * Event handler. Called when the trackend event occurs.
     * Toggles the button.
     *
     * @param evt {qx.event.type.Track} The trackend event.
     */
    _onTrackend : function(evt) {
      if (this.__isSwitchLeftSided()) {
        this.setValue(false);
        this._setKnobLeft();
      } else {
        this.setValue(true);
        this._setKnobRight();
      }
    },


    __isSwitchLeftSided : function() {
      var toggleCenter = this.getOffset().left + this.getWidth() /2;
      var knobCenter = this.getChildren().getOffset().left + this.getChildren().getWidth() /2;
      if (knobCenter < toggleCenter) {
        return true;
      }
    },


    __isPointerOutLeft : function(evt) {
      if (evt._original.getDocumentLeft() <= this.getOffset().left || this.getChildren().getOffset().left <= this.getOffset().left) {
        return true;
      }
    },


    __isPointerOutRight : function(evt) {
      if (evt._original.getDocumentLeft() >= this.getOffset().right || this.getChildren().getOffset().right >= this.getOffset().right) {
        return true;
      }
    },


    dispose : function() {
      this.super(qx.ui.Widget, "dispose");
      this.off("tap", this._onTap, this);
      this.getChildren().off("track", this._onTrack, this);
      this.getChildren().off("trackend", this._onTrack, this);
      this.__switch && this.__switch.dispose();
      this.disposeMForm();
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

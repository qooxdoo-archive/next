"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2011-2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/**
 *
 * The picker widget gives the user the possibility to select a value out of an array
 * of values. The picker widget can be added to a {@link qx.ui.dialog.Popup} or to any other container.
 *
 * The picker widget is able to display multiple picker slots, for letting the user choose
 * several values at one time, in one single control.
 *
 * You can add an array with objects which contain the keys <code>title</code>, a <code>subtitle</code> or an <code>image</code> (all optional).
 *
 * <pre>
 * var picker = new qx.ui.form.Picker();
 * picker.height = 200;
 * picker.on("changeSelection", function(evt) {
 *   var data = evt.getData();
 * },this);
 *
 * var slotData1 = [{title:"Windows Phone"}, {title:"iOS",subtitle:"Version 7.1"}, {title:"Android"}];
 * var slotData2 = [{title:"Tablet"}, {title:"Smartphone"}, {title:"Phablet"}];
 *
 * picker.addSlot(new qx.data.Array(slotData1));
 * picker.addSlot(new qx.data.Array(slotData2));
 * </pre>
 *
 */
qx.Class.define("qx.ui.form.Picker",
{
  extend : qx.ui.Widget,
  include : [
    qx.ui.form.MForm
  ],
  implement : [
    qx.ui.form.IForm
  ],

  /**
   * @param element {Element}
   * @return {qx.ui.form.Picker} The new picker widget.
   */
  construct : function(element)
  {
    this.super(qx.ui.Widget, "construct", element);

    this._pickerModel = new qx.data.Array();
    this._slots = new qx.data.Array();

    this._applyVisibleItems(this.$$properties.visibleItems.init); //TODO: better init
    this.__value = [];
    this.value = [];
    this.on("changeValue", this._scrollToSelected, this);
  },


  properties :
  {
    // overridden
    defaultCssClass : {
      init : "picker"
    },


    /**
    * Controls how many visible items are shown inside the picker.
    */
    visibleItems : {
      init : 5,
      check : function(value) {
        return [3, 5, 7, 9].indexOf(value) !== -1;
      },
      apply : "_applyVisibleItems"
    },


    /**
     * Controls the picker height.
     */
    height : {
      init : 200,
      check : "Number"
    }
  },


  members :
  {
    _slots : null,
    _pickerModel : null,
    _name: "picker",
    __value: null,


    // property apply
    _applyVisibleItems : function(value) {
      this.setData("items", value);
    },


    /**
     * @param value {Array}
     */
    _setValue: function (value) {
      for (var i = 0; i < this.__value.length; i++) {
        this._observeProperty(this.__value, i, false);
      }
      for (var j = 0; j < value.length; j++) {
        value["$$" + j] = value[j];
        this._observeProperty(value, j, true);
      }
      this.__value = value;
      this._fireChangeValue(value);
    },


    // overridden
    setValue: function(value) {
      this._setValue(value);
    },


    /**
     * @returns {Array}
     */
    _getValue: function () {
      return this.__value;
    },


    // overridden
    getValue: function() {
      return this._getValue();
    },


    // overridden
    setAttribute: function (name, value) {
      if (name === "name") {
        this._slots.forEach(function (slot) {
          slot.container.find('input[type=hidden]').setAttribute("name", value);
        }, this);
        this._name = value;
      }
      this.super(qx.ui.Widget, "setAttribute", name, value);
    },

    // overridden
    getAttribute: function (name) {
      if (name === "name") {
        return this._name;
      }
      return this.super(qx.ui.Widget, "getAttribute", name);
    },


    /**
     * Scrolls the slots so the currently selected items are centered
     */
    _scrollToSelected: function() {
      for (var i = 0; i < this.__value.length; i++) {
        var slotModel = this._pickerModel.getItem(i);
        if (!slotModel) {
          continue;
        }
        if (slotModel.contains(this.__value[i])) {
          var row = slotModel.indexOf(this.__value[i]);
          var slotContainer = this._slots.getItem(i).container;
          slotContainer.scrollTo(0, row * this._calcItemHeight());
        } else {
          this.__value[i] = slotModel.getItem(0);
          throw new Error("'" + this.__value[i] + "' is not a selectable element for slot " + i);
        }
      }
    },


    /**
    * Returns the internal used picker model which contains one or more picker slot models.
    * @return {qx.data.Array} the picker model.
    */
    getModel : function() {
      return this._pickerModel;
    },


    /**
     * Creates a picker slot.
     * @param slotModel {qx.data.Array} the picker slot model.
     * @param slotIndex {Number} the index of this slot.
     * @param delegate {Object?null} the list delegate object for this slot list.
     * @return {qx.ui.container.Scroll} the picker slot as a scroll container.
     */
    _createPickerSlot : function(slotModel, slotIndex, delegate) {
      var scrollContainer = new qx.ui.container.Scroll({
        "vScrollbar": false
      });
      scrollContainer.setWaypointsY([".list-item"]);

      scrollContainer.setStyle("height", this.height + "px");

      var slot = {
        container: scrollContainer,
        selectedIndex: 0
      };

      this._slots.push(slot);

      scrollContainer.on("waypoint", this._onWaypoint, {
        self: this,
        slot: slot,
        slotIndex: slotIndex,
        slotModel: slotModel
      });

      var list = new qx.ui.List(delegate);
      list.itemHeight = this._calcItemHeight();
      list.on("selected", this._onChangeSelection.bind(this, slotIndex));
      list.model = slotModel;

      var slotWrapper = new qx.ui.Widget();

      // Generate placeholder items at before and after picker data list,
      // for making sure the first and last item can be scrolled
      // to the center of the picker.
      var placeholderItemCount = Math.floor(this.visibleItems / 2);
      for (var i = 0; i < placeholderItemCount; i++) {
        slotWrapper.append(this._createPlaceholderItem());
      }
      slotWrapper.append(list);
      for (var j = 0; j < placeholderItemCount; j++) {
        slotWrapper.append(this._createPlaceholderItem());
      }
      scrollContainer.append(slotWrapper);
      scrollContainer.append(this._createHiddenField(slotModel.getItem(0)));

      this.append(scrollContainer);

      scrollContainer.refresh();

      return scrollContainer;
    },

    /**
     * Creates hidden field to store value to provide form api
     *
     * @param currentItem {String|Object}
     * @returns {Element} the hidden field
     */
    _createHiddenField: function (currentItem) {
      var hiddenField = qxWeb.create("<input>")[0];
      hiddenField.type = "hidden";
      hiddenField.name = this._name;
      hiddenField.value = this._serializeItemValue(currentItem);

      return hiddenField;
    },

    /**
     * Extracts the value from the passed item.
     *
     * @param item {String|Object}
     * @returns {String} The current item value
     */
    _serializeItemValue: function (item) {
      var Type = qx.lang.Type;

      if (Type.isString(item)) {
        return item;
      }
      else if (Type.isObject(item)) {
        if (typeof item.title !== 'undefined') {
          return item.title;
        } else {
          return item.toString();
        }
      }

      return "";
    },

    /**
    * Creates a placeholder list item, for making sure the selected item is vertically centered.
    * @return {qx.ui.Widget} the placeholder list item.
    */
    _createPlaceholderItem : function() {
      var placeholderItem = new qx.ui.Widget();
      placeholderItem.setStyle("minHeight", this._calcItemHeight() + "px")
        .addClass("list-item")
        .addClass("placeholder-item");
      return placeholderItem;
    },


    /**
    * Calculates the item height of a picker item.
    * @return {Number} height of the picker item.
    */
    _calcItemHeight : function() {
      return this.height / this.visibleItems;
    },


    /**
     * Handler for <code>changeSelection</code> event on picker list.
     * @param slotIndex {Integer} the index of the target picker slot.
     * @param evt {qx.event.type.Data} the events data.
     */
    _onChangeSelection: function(slotIndex, evt) {
      var index = parseInt(evt.getData("row"), 10);
      var slot = this._slots.getItem(slotIndex);

      if (this.visibility === "visible") {
        slot.container.scrollTo(0, index * this._calcItemHeight());
      }
    },


    /**
    * Handler for <code>waypoint</code> event on scroll container.
    * @param data {qx.event.type.Data} the waypoint data.
    */
    _onWaypoint: function(data) {
      var element = this.slot.container.find(".list-item").eq(data.index + 2);

      var item = this.slotModel.getItem(parseInt(element.getData("row"), 10));
      this.self.value[this.slotIndex] = item;
      this.slot.container.find('input[type=hidden]').setValue(this.self._serializeItemValue(item));
    },


    /**
     * Returns the picker slot count, added to this picker.
     * @return {Integer} count of picker slots.
     */
    getSlotCount : function() {
      return this._pickerModel.getLength();
    },


    /**
     * Adds an picker slot to the end of the array.
     * @param slotModel {qx.data.Array} the picker slot model to display.
     * @param delegate {Object?null} the list delegate object for this slot.
     */
    addSlot : function(slotModel, delegate) {
      if (slotModel !== null && slotModel instanceof qx.data.Array) {
        this._pickerModel.push(slotModel);
        var slotIndex = this._pickerModel.length - 1;

        var scrollContainer = this._createPickerSlot(slotModel, slotIndex, delegate);

        slotModel.on("changeBubble", this._onSlotDataChange, scrollContainer);
        slotModel.on("change", this._onSlotDataChange, scrollContainer);

        this._observeProperty(this.value, slotIndex, true);

        this.value[slotIndex] = slotModel.getItem(0);
      }
    },


    /**
     * Removes the picker slot at the given slotIndex.
     * @param slotIndex {Integer} the index of the target picker slot.
     */
    removeSlot : function(slotIndex) {
      if (this._pickerModel.length > slotIndex && slotIndex > -1) {
        var slotModel = this._pickerModel.getItem(slotIndex);
        var scrollContainer = this._slots.getItem(slotIndex).container;

        slotModel.off("changeBubble", this._onSlotDataChange, scrollContainer);
        slotModel.off("change", this._onSlotDataChange, scrollContainer);

        var container = this._slots.getItem(slotIndex).container;
        container.find(".list").dispose();
        container.find(".placeholder-item").forEach(function(item) {
          item.dispose();
        });
        container.getChildren().remove();
        container.dispose();

        this._pickerModel.removeAt(slotIndex);
        this._slots.removeAt(slotIndex);

        this._observeProperty(this.value, slotIndex, false);
        this.value.splice(slotIndex, 1);
        this.emit("changeValue", this.value);
      }
    },


    /**
     * Defines a property setter on the given object that optionally fires
     * the <code>selected</code> event when called
     *
     * @param object {Object} Object to modify
     * @param property {String} Name of the new property
     * @param fireEvent {Boolean} <code>true</code> if a selected event
     * should be fired on property changes
     */
    _observeProperty: function(object, property, fireEvent) {
      var self = this;
      Object.defineProperty(object, property, {
        configurable: true,
        set: function(value) {
          this["$$" + property] = value;
          if (fireEvent) {
            self.emit("changeValue", self.value);
          }
        },
        get: function() {
          return this["$$" + property];
        }
      });
    },


    /**
    * Handles the <code>changeBubble</code> and <codechange></code> event on a picker slot model.
    */
    _onSlotDataChange : function() {
      this.refresh();
    },


    /**
     * Dispose a Picker slot and all its child widgets.
     * @param slotIndex {Number} index of the slot to be disposed
     */
    _disposeSlot: function(slotIndex) {
      var container = this._slots.getItem(slotIndex).container;
      container.find(".list").dispose();
      container.find(".placeholder-item").forEach(function(item) {
        item.dispose();
      });
      container.getChildren().dispose();
      container.dispose();
    },


    dispose : function() {
      this.off("changeValue", this._scrollToSelected, this);
      for (var i = this._slots.length - 1; i >= 0; i--) {
        this.removeSlot(i);
      }
      this.super(qx.ui.Widget, "dispose");
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

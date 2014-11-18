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
 * var picker = new qx.ui.control.Picker();
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
qx.Class.define("qx.ui.control.Picker",
{
  extend : qx.ui.Widget,

  /**
   * @param element
   * @return {qx.ui.control.Picker} The new picker widget.
   */
  construct : function(element)
  {
    this.super(qx.ui.Widget, "constructor", element);

    this._pickerModel = new qx.data.Array();
    this._slots = new qx.data.Array();

    this._applyVisibleItems(this.$$properties.visibleItems.init); //TODO: better init
    this.selection = [];
    this.on("selected", this._scrollToSelected, this);
  },


  events :
  {
    /**
     * Fired if an item has been selected. The value is an Array containing
     * the selected model item of each slot.
     */
    selected : "Array"
  },


  properties :
  {
    // overridden
    defaultCssClass : {
      init : "picker"
    },


    /**
     * Array containing the currently selected model item of each slot.
     */
    selection: {
      check: "Array",
      nullable: false,
      apply: "_applySelection",
      event: true
    },


    /**
    * Controls how many visible items are shown inside the picker.
    */
    visibleItems : {
      init : 5,
      check : function(value) {
        return [3,5,7,9].indexOf(value) !== -1;
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


    // property apply
    _applyVisibleItems : function(value) {
      this.setData("items", value);
    },


    // property apply
    _applySelection: function(value, old) {
      if (old) {
        for (var i = 0; i < old.length; i++) {
          this._observeProperty(old, i, false);
        }
      }

      for (var i = 0; i < value.length; i++) {
        value["$$" + i] = value[i];
        this._observeProperty(value, i, true);
      }
      this.emit("selected", value);
    },


    /**
     * Scrolls the slots so the currently selected items are centered
     */
    _scrollToSelected: function() {
      for (var i = 0; i < this.selection.length; i++) {
        var slotModel = this._pickerModel.getItem(i);
        if (!slotModel) {
          continue;
        }
        if (slotModel.contains(this.selection[i])) {
          var row = slotModel.indexOf(this.selection[i]);
          var slotContainer = this._slots.getItem(i).container;
          slotContainer.scrollTo(0, row * this._calcItemHeight());
        } else {
          this.selection[i] = slotModel.getItem(0);
          throw new Error("'" + this.selection[i] + "' is not a selectable element for slot " + i);
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
        // "snap": ".list-item",
        "vScrollbar" : false
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
        slot : slot,
        slotIndex : slotIndex,
        slotModel : slotModel
      });

      var list = new qx.ui.list.List(delegate);
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
      this.append(scrollContainer);

      scrollContainer.refresh();

      return scrollContainer;
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
    * @param evt {qx.event.type.Data} the events data.
    */
    _onChangeSelection: function(slotIndex, el) {
      var index = parseInt(el.getData("row"), 10);
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
      var element = this.slot.container.find(".list-item").eq(data.element + 2); // TODO: upper placeholder count
      // this.slot.container.scrollTo(0, data.element * this.self._calcItemHeight());

      var item = this.slotModel.getItem(parseInt(element.getData("row"), 10));
      this.self.selection[this.slotIndex] = item;
      this.self.emit("selected", this.self.selection);
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

        this._observeProperty(this.selection, slotIndex, true);

        this.selection[slotIndex] = slotModel.getItem(0);
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
        container.find(".placeholder-item")._forEachElementWrapped(function(item) {
          item.dispose();
        });
        container.getChildren().dispose();
        container.dispose();

        this._pickerModel.removeAt(slotIndex);
        this._slots.removeAt(slotIndex);

        this._observeProperty(this.selection, slotIndex, false);
        this.selection.splice(slotIndex, 1);
        this.emit("selected", this.selection);
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
        set: function(value) {
          this["$$" + property] = value;
          if (fireEvent) {
            self.emit("selected", self.selection);
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
      container.find(".placeholder-item")._forEachElementWrapped(function(item) {
        item.dispose();
      });
      container.getChildren().dispose();
      container.dispose();
    },


    dispose : function() {
      this.off("selected", this._scrollToSelected, this);
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

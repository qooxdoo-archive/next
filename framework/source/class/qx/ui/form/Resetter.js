"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2010-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

/**
* The resetter is responsible for managing a set of items and resetting these
* items on a {@link qx.ui.form.Resetter#reset} call.
*/
qx.Class.define("qx.ui.form.Resetter",
{
  extend : Object,

  construct : function() {
    this.__items = [];
  },


  members :
  {
    __items : null,

    /**
     * Adding a widget to the resetter will get its current value and store
     * it for resetting. To access the value, the given item needs to specify
     * a value property.
     *
     * @param item {qx.ui.core.Widget} The widget which should be added.
     */
    add: function (item) {
      // check the init values
      var init = this.getItemValue(item);
      if (init === undefined) {
        throw new Error("Item " + item + " not supported for resetting.");
      }
      // store the item and its init value
      this.__items.push({item: item, init: init});
    },


    /**
     * Removes a widget to the resetter
     *
     * @param item {qx.ui.core.Widget} The widget which should be removed.
     * @return {Boolean} <code>true</code>, if the widget has been removed.
     */
    remove : function(item) {
      for (var i = 0; i < this.__items.length; i++) {
        var storedItem = this.__items[i];
        if (storedItem.item === item) {
          this.__items.splice(i, 1);
          return true;
        }
      }
      return false;
    },


    /**
     * Resets all added form items to their initial value. The initial value
     * is the value in the widget during the {@link #add}.
     */
    reset: function() {
      // reset all form items
      for (var i = 0; i < this.__items.length; i++) {
        var dataEntry = this.__items[i];
        // set the init value
        this.__setItem(dataEntry.item, dataEntry.init);
      }
    },


    /**
     * Resets a single given item. The item has to be added to the resetter
     * instance before. Otherwise, an error is thrown.
     *
     * @param item {qx.ui.core.Widget} The widget, which should be resetted.
     */
    resetItem : function(item)
    {
      // get the init value
      var init;
      for (var i = 0; i < this.__items.length; i++) {
        var dataEntry = this.__items[i];
        if (dataEntry.item === item) {
          init = dataEntry.init;
          break;
        }
      }

      // check for the available init value
      if (init === undefined) {
        throw new Error("The given item has not been added.");
      }

      this.__setItem(item, init);
    },


    /**
     * Internal helper top access the value of a given item.
     *
     * @param item {qx.ui.core.Widget} The item to access.
     * @returns {Array|String|undefined}
     */
    getItemValue: function(item) {
      if (this._supportsValue(item)) {
        if (qx.lang.Type.isArray(item.value)) {
          return item.value.slice();
        }
        return item.value;
      }
      return undefined;
    },


    /**
     * Internal helper for setting an item to a given init value. It checks
     * for the supported APIs and uses the fitting API.
     *
     * @param item {qx.ui.core.Widget} The item to reset.
     * @param init {var} The value to set.
     */
    __setItem : function(item, init)
    {
      // set the init value
      if (this._supportsValue(item)) {
        if (qx.lang.Type.isArray(init)) {
          for (var i = 0; i < item.value.length; i++) {
            item.value[i] = init[i];
          }
        } else {
          item.value = init;
        }
      }
    },


    /**
     * Takes the current values of all added items and uses these values as
     * init values for resetting.
     */
    redefine: function() {
      // go threw all added items
      for (var i = 0; i < this.__items.length; i++) {
        var item = this.__items[i].item;
        // set the new init value for the item
        this.__items[i].init = this.getItemValue(item);
      }
    },


    /**
     * Takes the current value of the given item and stores this value as init
     * value for resetting.
     *
     * @param item {qx.ui.core.Widget} The item to redefine.
     */
    redefineItem : function(item)
    {
      // get the data entry
      var dataEntry;
      for (var i = 0; i < this.__items.length; i++) {
        if (this.__items[i].item === item) {
          dataEntry = this.__items[i];
          break;
        }
      }

      // check for the available init value
      if (dataEntry === undefined) {
        throw new Error("The given item has not been added.");
      }

      // set the new init value for the item
      dataEntry.init = this.getItemValue(dataEntry.item);
    },

    /**
     * Returns true, if the value property is supplied by the form item.
     *
     * @param formItem {Object} The item to check.
     * @return {Boolean} true, if the given item implements the
     *   necessary interface.
     */
    _supportsValue : function(formItem) {
      return qx.Class.hasProperty(formItem.constructor, "value");
    }
  }
});
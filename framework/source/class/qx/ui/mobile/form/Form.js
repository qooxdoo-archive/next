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
 * Representation of a form. A form widget can contain one or more {@link Row} widgets.
 *
 * *Example*
 *
 * Here is an example of how to use the widget.
 *
 * <pre class='javascript'>
 *   var title = new qx.ui.mobile.form.Title("Group");
 *   var form = new qx.ui.mobile.form.Form();
 *   form.app(new qx.ui.mobile.form.TextField(), "Username: ");
 *
 *   this.getRoot().append(title);
 *   this.getRoot().append(new qx.ui.mobile.form.renderer.Single(form));
 * </pre>
 *
 * This example creates a form and adds a row with a text field in it.
 */
qx.Bootstrap.define("qx.ui.mobile.form.Form",
{
  extend : Object,
  include : [qx.event.MEmitter],


  construct : function()
  {
    this.__groups = [];
    this._buttons = [];
    this._buttonOptions = [];
    this._validationManager = this._createValidationManager();
    this._resetter = this._createResetter();

    this.__invalidItems = [];
  },


  events : {
    /** Fired as soon as something changes in the form.*/
    "change" : "qx.event.type.Event"
  },


  members :
  {
    /** the renderer this form uses to be displayed */
    __renderer : null,


    /** Contains all invalid items. */
    __invalidItems : null,

    __groups : null,
    _validationManager : null,
    _groupCounter : 0,
    _buttons : null,
    _buttonOptions : null,
    _resetter : null,


    /**
     * Setter for the renderer private variable
     * @param renderer {qx.ui.mobile.form.renderer.AbstractRenderer} the renderer
     */
    setRenderer : function(renderer) {
      this.__renderer = renderer;
    },

    /**
     * Makes a row visible, identified by its group and row index.
     * @param groupIndex {Integer} the index of the group to which the row belongs to
     * @param rowIndex {Integer} the index of the row inside the target group
     */
    showRow : function(groupIndex,rowIndex) {
      var item = this._getItemByIndex(groupIndex, rowIndex);
      if(item) {
        this.__renderer.showItem(item);
      }
    },


    /**
     * Makes a row invisible, identified by its group and row index.
     * @param groupIndex {Integer} the index of the group to which the row belongs to
     * @param rowIndex {Integer} the index of the row inside the target group
     */
    hideRow : function(groupIndex, rowIndex) {
      var item = this._getItemByIndex(groupIndex, rowIndex);
      if(item) {
        this.__renderer.hideItem(item);
      }
    },


    /**
     * Gets the item with the given group and rowIndex.
     * @param groupIndex {Integer} the index of the group to which the row belongs to
     * @param rowIndex {Integer} the index of the row inside the target group
     * @return {qx.ui.form.IForm | null} The validation result.
     */
    _getItemByIndex : function(groupIndex, rowIndex) {
      var groups = this.getGroups();
      var group = groups[groupIndex];
      if(group) {
        var item = group.items[rowIndex];
        return item;
      }

      return null;
    },


    /**
    * Returns the invalid items of the form, which were determined by {@link qx.ui.mobile.form.Form#validate} before.
    * It returns an empty array if no items are invalid.
    * @return {qx.ui.mobile.core.Widget[]} The invalid items of the form.
    */
    getInvalidItems : function() {
      return this.__invalidItems;
    },


    /*
    ---------------------------------------------------------------------------
       ADD
    ---------------------------------------------------------------------------
    */

    /**
     * Adds a form item to the form including its internal
     * {@link qx.ui.form.validation.Manager} and {@link qx.ui.form.Resetter}.
     *
     * *Hint:* The order of all add calls represent the order in the layout.
     *
     * @param item {qx.ui.form.IForm} A supported form item.
     * @param label {String} The string, which should be used as label.
     * @param validator {Function | qx.ui.form.validation.AsyncValidator ? null}
     *   The validator which is used by the validation
     *   {@link qx.ui.form.validation.Manager}.
     * @param name {String?null} The name which is used by the data binding
     *   controller {@link qx.data.controller.Form}.
     * @param validatorContext {var?null} The context of the validator.
     * @param options {Map?null} An additional map containin custom data which
     *   will be available in your form renderer specific to the added item.
     */
    add : function(item, label, validator, name, validatorContext, options) {
      if (this.__isFirstAdd()) {
        this.__groups.push({
          title: null, items: [], labels: [], names: [],
          options: [], headerOptions: {}
        });
      }
      // save the given arguments
      this.__groups[this._groupCounter].items.push(item);
      this.__groups[this._groupCounter].labels.push(label);
      this.__groups[this._groupCounter].options.push(options);
      // if no name is given, use the label without not working character
      if (name == null) {
        name = label.replace(
          /\s+|&|-|\+|\*|\/|\||!|\.|,|:|\?|;|~|%|\{|\}|\(|\)|\[|\]|<|>|=|\^|@|\\/g, ""
        );
      }
      this.__groups[this._groupCounter].names.push(name);

      // add the item to the validation manager
      this._validationManager.add(item, validator, validatorContext);
      // add the item to the reset manager
      this._resetter.add(item);
      // fire the change event
      this.emit("change");
    },


    /**
     * Adds a group header to the form.
     *
     * *Hint:* The order of all add calls represent the order in the layout.
     *
     * @param title {String} The title of the group header.
     * @param options {Map?null} A special set of custom data which will be
     *   given to the renderer.
     */
    addGroupHeader : function(title, options) {
      if (!this.__isFirstAdd()) {
        this._groupCounter++;
      }
      this.__groups.push({
        title: title, items: [], labels: [], names: [],
        options: [], headerOptions: options
      });
      // fire the change event
      this.emit("change");
    },


    /**
     * Adds a button to the form.
     *
     * *Hint:* The order of all add calls represent the order in the layout.
     *
     * @param button {qx.ui.form.Button} The button to add.
     * @param options {Map?null} An additional map containin custom data which
     *   will be available in your form renderer specific to the added button.
     */
    addButton : function(button, options) {
      this._buttons.push(button);
      this._buttonOptions.push(options || null);
      // fire the change event
      this.emit("change");
    },


    /**
     * Returns whether something has already been added.
     *
     * @return {Boolean} true, if nothing has been added jet.
     */
    __isFirstAdd : function() {
      return this.__groups.length === 0;
    },


    /*
    ---------------------------------------------------------------------------
       REMOVE
    ---------------------------------------------------------------------------
    */


    /**
     * Removes the given item from the form.
     *
     * @param item {qx.ui.form.IForm} A supported form item.
     * @return {Boolean} <code>true</code>, if the item could be removed.
     */
    remove : function(item) {
      for (var i = 0; i < this.__groups.length; i++) {
        var group = this.__groups[i];
        for (var j = 0; j < group.items.length; j++) {
          var storedItem = group.items[j];
          if (storedItem === item) {
            // remove all stored data
            group.items.splice(j, 1);
            group.labels.splice(j, 1);
            group.names.splice(j, 1);
            group.options.splice(j, 1);

            // remove the item to the validation manager
            this._validationManager.remove(item);
            // remove the item to the reset manager
            this._resetter.remove(item);

            // fire the change event
            this.emit("change");
            return true;
          }
        }
      }
      return false;
    },


    /**
     * Removes the given group header from the form. All items in the group will be moved to
     * another group (usually the previous group). If there is more than one group with
     * the same title, only the first group will be removed.
     *
     * @param title {String} The title.
     * @return {Boolean} <code>true</code>, if the header could be removed.
     */
    removeGroupHeader : function(title) {
      for (var i = 0; i < this.__groups.length; i++) {
        var group = this.__groups[i];
        if (group.title === title) {
          var targetGroup;

          // if it's the first group
          if (i == 0) {
            // if it's the only group
            if (this.__groups.length == 1) {
              // remove the title and the header options
              group.title = null;
              group.headerOptions = {};
              // fire the change event
              this.emit("change");
              return true;
            } else {
              // add to the next
              targetGroup = this.__groups[i+1];
            }
          } else {
            // add to the previous group
            targetGroup = this.__groups[i-1];
          }

          // copy the data over
          targetGroup.items = targetGroup.items.concat(group.items);
          targetGroup.labels = targetGroup.labels.concat(group.labels);
          targetGroup.names = targetGroup.names.concat(group.names);
          targetGroup.options = targetGroup.options.concat(group.options);

          // delete the group
          this.__groups.splice(i, 1);

          this._groupCounter--;

          // fire the change event
          this.emit("change");
          return true;
        }
      }
      return false;
    },


    /**
     * Removes the given button from the form.
     *
     * @param button {qx.ui.form.Button} The button to remove.
     * @return {Boolean} <code>true</code>, if the button could be removed.
     */
    removeButton : function(button) {
      for (var i = 0; i < this._buttons.length; i++) {
        var storedButton = this._buttons[i];
        if (storedButton === button) {
          this._buttons.splice(i, 1);
          this._buttonOptions.splice(i, 1);
          // fire the change event
          this.emit("change");
          return true;
        }
      }
      return false;
    },



    /*
    ---------------------------------------------------------------------------
       RESET SUPPORT
    ---------------------------------------------------------------------------
    */

    /**
     * Resets the form. This means reseting all form items and the validation.
     */
    reset : function() {
      this._resetter.reset();
      this._validationManager.reset();
      this.__renderer.resetForm();
    },


    /**
     * Redefines the values used for resetting. It calls
     * {@link qx.ui.form.Resetter#redefine} to get that.
     */
    redefineResetter : function() {
      this._resetter.redefine();
    },


    /**
     * Redefines the value used for resetting of the given item. It calls
     * {@link qx.ui.form.Resetter#redefineItem} to get that.
     *
     * @param item {qx.ui.core.Widget} The item to redefine.
     */
    redefineResetterItem : function(item) {
      this._resetter.redefineItem(item);
    },



    /*
    ---------------------------------------------------------------------------
       VALIDATION
    ---------------------------------------------------------------------------
    */

    /**
     * Validates the form using the
     * {@link qx.ui.form.validation.Manager#validate} method.
     *
     * @return {Boolean | null} The validation result.
     */
    validate : function() {
      var validateResult = this._validationManager.validate();

      this.__invalidItems = [];

      if(this.__renderer != null) {
        this.__renderer.resetForm();
      }
      var groups = this.getGroups();
      for (var i = 0; i < groups.length; i++)
      {
        var group = groups[i];
        for(var j=0; j < group.items.length; j++)
        {
          var item = group.items[j];
          if(item.valid === false)
          {
            this.__invalidItems.push(item);

            if(this.__renderer != null)
            {
              this.__renderer.showErrorForItem(item);
            }
            else
            {
              alert('error '+item.invalidMessage);
            }
          }
        }
      }

      return validateResult;
    },


    /**
     * Returns the internally used validation manager. If you want to do some
     * enhanced validation tasks, you need to use the validation manager.
     *
     * @return {qx.ui.form.validation.Manager} The used manager.
     */
    getValidationManager : function() {
      return this._validationManager;
    },


    /*
    ---------------------------------------------------------------------------
       RENDERER SUPPORT
    ---------------------------------------------------------------------------
    */

    /**
     * Accessor method for the renderer which returns all added items in a
     * array containing a map of all items:
     * {title: title, items: [], labels: [], names: []}
     *
     * @return {Array} An array containing all necessary data for the renderer.
     * @internal
     */
    getGroups : function() {
      return this.__groups;
    },


    /**
     * Accessor method for the renderer which returns all added buttons in an
     * array.
     * @return {Array} An array containing all added buttons.
     * @internal
     */
    getButtons : function() {
      return this._buttons;
    },


    /**
     * Accessor method for the renderer which returns all added options for
     * the buttons in an array.
     * @return {Array} An array containing all added options for the buttons.
     * @internal
     */
    getButtonOptions : function() {
      return this._buttonOptions;
    },



    /*
    ---------------------------------------------------------------------------
       INTERNAL
    ---------------------------------------------------------------------------
    */

    /**
     * Returns all added items as a map.
     *
     * @return {Map} A map containing for every item an entry with its name.
     *
     * @internal
     */
    getItems : function() {
      var items = {};
      // go threw all groups
      for (var i = 0; i < this.__groups.length; i++) {
        var group = this.__groups[i];
        // get all items
        for (var j = 0; j < group.names.length; j++) {
          var name = group.names[j];
          items[name] = group.items[j];
        }
      }
      return items;
    },


    /**
     * Creates and returns the used resetter.
     *
     * @return {qx.ui.mobile.form.Resetter} the resetter class.
     */
    _createResetter : function() {
      return new qx.ui.mobile.form.Resetter();
    },


    /**
     * Creates and returns the used validation manager.
     *
     * @return {qx.ui.form.validation.Manager} The validation manager.
     */
    _createValidationManager : function() {
      return new qx.ui.form.validation.Manager();
    }
  }
});
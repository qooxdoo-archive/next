"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Gabriel Munteanu (gabios)
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/**
 * The SelectBox
 *
 * an example, how to use the SelectBox:
 * *Example* TODO
 */
qx.Class.define("qx.ui.mobile.form.SelectBox",
{
  extend : qx.ui.mobile.Widget,
  include : [
    qx.ui.mobile.form.MForm,
    qx.ui.mobile.form.MText
  ],
  implement : [
    qx.ui.mobile.form.IForm
  ],


  construct : function()
  {
    this.super(qx.ui.mobile.Widget, "constructor");

    // This text node is for compatibility reasons, because Firefox can not
    // change appearance of SelectBoxes.
    this.setAttribute("type","text");
    this.readOnly = true;

    this.on("focus", this.blur);
    this.on("tap", this._onTap, this);

    // Selection dialog creation.
    this.__selectionDialog = this._createSelectionDialog();

    this.addClass("gap");

    // When selectionDialogs changes selection, get chosen selectedIndex from it.
    this.__selectionDialog.on("changeSelection", this._onChangeSelection, this);
    this.initMForm();
    this.initMText();
  },


  events :
  {
    /**
     * Fired when user selects an item.
     * {
     *   index : number,
     *   item : var
     * }
     */
    changeSelection : "Object"
  },


  properties :
  {

    // overridden
    defaultCssClass :
    {
      init : "selectbox"
    },


    // overridden
    activatable :
    {
      refine :true,
      init : true
    },


    /**
     * Defines if the SelectBox has a clearButton, which resets the selection.
     */
    nullable :
    {
      init : true,
      check : "Boolean",
      apply : "_applyNullable"
    },


    /**
     * The model to use to render the list.
     */
    model :
    {
      check : "qx.data.Array",
      apply : "_applyModel",
      event : true,
      nullable : true,
      init : null
    },


    /**
     * The selected index of this SelectBox.
     */
    selection :
    {
      init : null,
      check : "_checkSelection",
      apply : "_applySelection",
      nullable : true
    }
  },


  members :
  {
    __selectionDialog : null,


    // overridden
    _getTagName : function()
    {
      // No select here, see BUG #6054
      return "input";
    },


    /**
     * Creates the menu dialog. Override this to customize the widget.
     *
     * @return {qx.ui.mobile.dialog.Menu} A dialog, containing a selection list.
     */
    _createSelectionDialog : function() {
      var menu = new qx.ui.mobile.dialog.Menu();

      // Special appearance for SelectBox menu items.
      menu.selectedItemClass = "selectbox-selected";
      menu.unselectedItemClass = "selectbox-unselected";

      // Hide selectionDialog on tap on blocker.
      menu.hideOnBlockerTap = true;

      return menu;
    },


    /**
     * Returns the SelectionDialog.
     * @return {qx.ui.mobile.dialog.Menu} the SelectionDialog.
     */
    getSelectionDialog : function() {
      return this.__selectionDialog;
    },


    /**
     * Sets the dialog title on the selection dialog.
     * @param title {String} the title to set on selection dialog.
     */
    setDialogTitle : function(title) {
      this.__selectionDialog.title = title;
    },


    /**
     * Set the ClearButton label of the selection dialog.
     * @param value {String} the value to set on the ClearButton at selection dialog.
     */
    setClearButtonLabel : function(value) {
      this.__selectionDialog.clearButtonLabel = value;
    },


    /**
     * Sets the selected text value of this SelectBox.
     * @param value {String} the text value which should be selected.
     */
    _setValue : function(value) {
      if(this.model == null) {
        return;
      }

      if (!value) {
        if (this.nullable) {
          this.selection = null;
        } else {
          this.selection = 0;
        }
      } else if (value != null) {
        this.selection = this.model.indexOf(value);
      } else {
        this.selection = null;
      }

      this.validate();
    },


    /**
     * Get the text value of this
     * It is called by the setValue method of the qx.ui.mobile.form.MForm
     * mixin.
     * @return {Number} the new selected index of the SelectBox.
     */
    _getValue : function() {
      return this.getAttribute("value");
    },


    /**
     * Renders this SelectBox. Override this if you would like to display the
     * values of the SelectBox in a different way than the default.
     */
    _render : function() {
      if (this.model != null && this.model.length > 0) {
        var selectedItem = this.model.getItem(this.selection);
        this.setAttribute("value", selectedItem);
      }
    },


    /**
     * Sets the model property to the new value
     * @param value {qx.data.Array}, the new model
     * @param old {qx.data.Array?}, the old model
     */
    _applyModel : function(value, old){
      value.on("change", this._render, this);
      if (old != null) {
        old.off("change", this._render, this);
      }

      this._render();
    },


    /**
     * Refreshes selection dialogs model, and shows it.
     */
    __showSelectionDialog : function () {
      if(this.enabled === true) {
        // Set index before items, because setItems() triggers rendering.
        this.__selectionDialog.selectedIndex = this.selection;
        this.__selectionDialog.setItems(this.model);
        this.__selectionDialog.show();
      }
    },


    /**
     * Gets the selectedIndex out of change selection event and renders view.
     * @param evt {qx.event.type.Data} data event.
     */
    _onChangeSelection : function (evt) {
      this.selection = evt.index;
      this._render();
      this.validate();
    },


    /**
    * Handler for <code>tap</code> event on this widget.
    * @param evt {qx.event.type.Tap} the handling tap event.
    */
    _onTap : function(evt) {
      this.__showSelectionDialog();

      // request focus so that it leaves previous widget
      // such as text field and hide virtual keyboard.
      evt._original.target.focus();
    },


    /**
     * Validates the selection value.
     * @param value {Integer} the selection value to validate.
     */
    _checkSelection : function(value) {
      if(value != null && qx.lang.Type.isNumber(value) == false)
      {
        throw new qx.core.ValidationError(
          "Validation Error: Input value is not a number"
        );
      }

      if(this.model === null) {
        throw new qx.core.ValidationError(
          "Validation Error: Please apply model before selection"
        );
      }

      if(!this.nullable && value === null ) {
        throw new qx.core.ValidationError(
          "Validation Error: SelectBox is not nullable"
        );
      }

      if(value != null && (value < 0 || value >= this.model.getLength())) {
        throw new qx.core.ValidationError(
          "Validation Error: Input value is out of model range"
        );
      }

      return true;
    },


    // property apply
    _applySelection : function(value, old) {
      var selectedItem = this.model.getItem(value);
      this.emit("changeSelection", {index: value, item: selectedItem});

      this._render();
    },


    // property apply
    _applyNullable : function(value, old) {
      // Delegate nullable property.
      this.__selectionDialog.nullable = value;
    },


    dispose : function() {
      this.super(qx.ui.mobile.Widget, "dispose");
      this.__selectionDialog.off("changeSelection", this._onChangeSelection, this);

      this.__selectionDialog && this.__selectionDialog.dispose();

      this.off("focus", this.blur);
      this.off("tap", this._onTap, this);

      this.disposeMForm();
    }
  }
});

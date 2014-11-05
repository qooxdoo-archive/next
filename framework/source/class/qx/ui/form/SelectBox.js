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


qx.Class.define("qx.ui.form.SelectBox",
{
  extend : qx.ui.Widget,
  include : [
    qx.ui.form.MForm,
    qx.ui.form.MText
  ],
  implement : [
    qx.ui.form.IForm
  ],

  /**
   * @attach {qxWeb, toSelectBox}
   */
  construct : function()
  {
    this.super(qx.ui.Widget, "constructor");

    // This text node is for compatibility reasons, because Firefox can not
    // change appearance of SelectBoxes.
    this.setAttribute("type","text");
    this.readOnly = true;

    this.on("focus", this.blur);
    this.on("tap", this._onTap, this);

    this.__selectionDialog = this._createSelectionDialog();

    this.addClass("gap");

    this.__selectionDialog.on("selected", this._onSelected, this);
    qxWeb.data.bind(this, "model", this.__selectionDialog, "model");
    this.initMForm();
    this.initMText();
  },


  events :
  {
    /**
     * Fired when user selects an item.
     */
    selected : "qxWeb"
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
     * The model to use to render the list.
     */
    model :
    {
      check : "qx.data.Array",
      apply : "_applyModel",
      event : true,
      nullable : true,
      init : null
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
     * @return {qx.ui.dialog.Menu} A dialog, containing a selection list.
     */
    _createSelectionDialog : function() {
      var menu = new qx.ui.dialog.Menu();
      menu.hideOnBlockerTap = true;
      return menu;
    },


    /**
     * Returns the SelectionDialog.
     * @return {qx.ui.dialog.Menu} the SelectionDialog.
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
     * Sets the model property to the new value
     * @param value {qx.data.Array}, the new model
     * @param old {qx.data.Array?}, the old model
     */
    _applyModel : function(value, old){
      value.on("change", this._updateValue, this);
      if (old != null) {
        old.off("change", this._updateValue, this);
      }
      this._updateValue();
    },


    _updateValue : function() {
      if (this.model) {
        if (this.model.indexOf(this.value) === -1) {
          this.value = null;
        }
      }
    },

    _setValue : function(value) {
      if (value === undefined) {
        value = null;
      }
      if (this.model.indexOf(value) === -1 && value !== null) {
        throw new Error("Value not in model");
      }
      this.setAttribute("value", value);
    },


    /**
     * Refreshes selection dialogs model, and shows it.
     */
    __showSelectionDialog : function () {
      if(this.enabled === true) {
        this.__selectionDialog.show();
      }
    },


    /**
     * Gets the selectedIndex out of change selection event and renders view.
     * @param evt {qx.event.type.Data} data event.
     */
    _onSelected : function (el) {
      var row = parseInt(el.getData("row"), 10);
      this.value = this.model.getItem(row);
      this.__selectionDialog.hideWithDelay(500);

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
     * Validates the selected value.
     * @param value {Integer} the selected value to validate.
     */
    _checkSelected : function(value) {
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


    dispose : function() {
      this.super(qx.ui.Widget, "dispose");
      this.__selectionDialog.off("selected", this._onSelected, this);
      this.__selectionDialog.dispose();

      this.off("focus", this.blur);
      this.off("tap", this._onTap, this);

      this.disposeMForm();
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

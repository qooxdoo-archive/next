"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Gabriel Munteanu (gabios)
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/**
 * Single renderer is a class used to render forms into a mobile page.
 * It displays a label above or next to each form element.
 *
 */
qx.Bootstrap.define("qx.ui.mobile.form.renderer.Single",
{

  extend : qx.ui.mobile.form.renderer.AbstractRenderer,


  construct : function(form)
  {
    this.__errorMessageContainers = [];
    this._rows = [];
    this._labels = [];
    this.base(qx.ui.mobile.form.renderer.AbstractRenderer, "constructor",form);
    this.addClass("single");
  },


  statics : {

    /** @type {Array} qx.Mobile form widgets which are rendered in one single line. */
    ONE_LINE_WIDGETS : [
      qx.ui.mobile.form.ToggleButton,
      qx.ui.mobile.form.RadioButton,
      qx.ui.mobile.form.TextField,
      qx.ui.mobile.form.PasswordField,
      qx.ui.mobile.form.NumberField,
      qx.ui.mobile.form.CheckBox,
      qx.ui.mobile.form.SelectBox
    ]
  },


  members :
  {
    _rows : null,
    _labels : null,


    _onFormChange : function() {
      this._disposeArray("_labels");
      this._disposeArray("_rows");
      this._rows = [];
      this._labels = [];
      this.base(qx.ui.mobile.form.renderer.AbstractRenderer, "_onFormChange");
    },

    /**
     * A collection of error containers used to keep the error messages
     * resulted after form validation.
     * Also useful to clear them when the validation passes.
     */
    __errorMessageContainers : null,


    // override
    _getTagName : function()
    {
      return "ul";
    },


     /**
     * Determines whether the given item can be display in one line
     * or whether a separate line for the text label is needed.
     * @param item {qx.ui.mobile.core.Widget} the widget which should be added.
     * @return {Boolean} it indicates whether the widget can be displayed
     *  in same line as the label.
     */
    _isOneLineWidget : function(item) {
      var widgets = qx.ui.mobile.form.renderer.Single.ONE_LINE_WIDGETS;

      for (var i = 0; i < widgets.length; i++) {
        var widget = widgets[i];
        if(item instanceof widget) {
          return true;
        }
      }

      return false;
    },


    // override
    addItems : function(items, names, title) {
      if(title !== null)
      {
        this._addGroupHeader(title);
      }

      this._addGroupHeaderRow();
      for (var i = 0, l = items.length; i < l; i++) {
        var item = items[i];
        var name = names[i];
        var isLastItem = (i == items.length - 1);

        if (item instanceof qx.ui.mobile.form.TextArea) {
          if (qx.core.Environment.get("qx.mobile.nativescroll") == false)
          {
            this._addToScrollContainer(item, name);
          } else {
            this._addRow(item, name, new qx.ui.mobile.layout.VBox());
          }
        } else {
          if (this._isOneLineWidget(item)) {
            this._addRow(item, name, new qx.ui.mobile.layout.HBox());
          } else {
            this._addRow(item, name, new qx.ui.mobile.layout.VBox());
          }
        }

        if (!item.valid) {
          this.showErrorForItem(item);
        }

        if (!isLastItem) {
          this._addSeparationRow();
        }
      }

      this._addGroupFooterRow();
    },


    /**
     * @deprecated {4.0} Please use '_addToScrollContainer' instead.
     * Wraps the given item with a ScrollComposite.
     * @param item {qx.ui.mobile.core.Widget} A form item to render.
     * @param name {String} A name for the form item.
     */
    _addInScrollComposite: function(item, name) {
      this._addToScrollContainer(item, name);
    },


    /**
     * Wraps the given item with a {@link qx.ui.mobile.container.Scroll scroll} container.
     * @param item {qx.ui.mobile.core.Widget} A form item to render.
     * @param name {String} A name for the form item.
     */
    _addToScrollContainer : function(item,name) {
      var scrollContainer = new qx.ui.mobile.container.Scroll();
      scrollContainer.addClass("form-row-scroll");

      scrollContainer.append(item, {
        flex: 1
      });

      this._addRow(scrollContainer,name,new qx.ui.mobile.layout.VBox());
    },


    /**
     * @deprecated {3.5} Please use this._addRow(item, name, new qx.ui.mobile.layout.VBox()) instead.
     *
     * Adds a label and the widgets in two separate lines (rows).
     * @param item {qx.ui.mobile.core.Widget} A form item to render.
     * @param name {String} A name for the form item.
     */
    _addInSeparateLines : function(item, name) {
      this._addRow(item, name, new qx.ui.mobile.layout.VBox());
    },


    /**
     * @deprecated {3.5} Please use this._addRow(item, name, new qx.ui.mobile.layout.HBox()) instead.
     *
     * Adds a label and it according widget in one line (row).
     * @param item {qx.ui.mobile.core.Widget} A form item to render.
     * @param name {String} A name for the form item.
     */
    _addInOneLine : function(item, name) {
      this._addRow(item, name, new qx.ui.mobile.layout.HBox());
    },


    /**
    * Adds a label and its according widget in a row and applies the given layout.
    * @param item {qx.ui.mobile.core.Widget} A form item to render.
    * @param name {String} A name for the form item.
    * @param layout {qx.ui.mobile.layout.Abstract} layout of the rendered row.
    */
    _addRow : function(item, name, layout) {
      var row = new qx.ui.mobile.form.Row(layout);
      row.addClass("form-row-content");

      if(name !== null) {
        var label = new qx.ui.mobile.form.Label(name);
        label.setLabelFor(item.id);
        label.layoutPrefs = {flex:1};
        row.append(label);
        this._labels.push(label);
      }
      row.append(item);
      this.append(row);
      this._rows.push(row);
    },


    /**
     * Adds a separation line into the form.
     */
    _addSeparationRow : function() {
      var row = new qx.ui.mobile.form.Row();
      row.addClass("form-separation-row");
      this.append(row);
      this._rows.push(row);
    },


    /**
     * Adds an row group header.
     */
    _addGroupHeaderRow : function() {
      var row = new qx.ui.mobile.form.Row();
      row.addClass("form-row-group-first");
      this.append(row);
      this._rows.push(row);
    },


    /**
     * Adds an row group footer.
     */
    _addGroupFooterRow : function() {
      var row = new qx.ui.mobile.form.Row();
      row.addClass("form-row-group-last");
      this.append(row);
      this._rows.push(row);
    },


    /**
     * Adds a row with the name of a group of elements
     * When you want to group certain form elements, this methods implements
     * the way the header of that group is presented.
     * @param title {String} the title shown in the group header
     */
    _addGroupHeader : function(title)
    {
      var row = new qx.ui.mobile.form.Row();
      row.addClass("form-row-group-title");
      var titleLabel = new qx.ui.mobile.basic.Label(title);
      row.append(titleLabel);
      this.append(row);
      this._labels.push(titleLabel);
      this._rows.push(row);
    },


    // override
    addButton : function(button) {
      var row = new qx.ui.mobile.form.Row(new qx.ui.mobile.layout.HBox());
      button.layoutPrefs = {flex:1};
      row.append(button);
      this.append(row);
      this._rows.push(row);
    },


    // override
    showErrorForItem : function(item) {
      var errorNode = qxWeb.create('<div>')
        .setHtml(item.invalidMessage)
        .addClass('form-element-error')
        .insertAfter(this._getParentRow(item)[0]);
      this.__errorMessageContainers.push(errorNode[0]);
    },


    /**
     * Shows a single item of this form
     * @param item {qx.ui.form.IForm} form item which should be hidden.
     */
    showItem : function(item) {
      this._getParentRow(item).removeClass("exclude");
    },


    /**
     * Hides a single item of this form
     * @param item {qx.ui.form.IForm} form item which should be hidden.
     */
    hideItem : function(item) {
      this._getParentRow(item).addClass("exclude");
    },


    /**
    * Returns the parent row of the item.
    *
    * @param item {qx.ui.form.IForm} the form item.
    * @return {qx.ui.mobile.core.Widget} the parent row.
    */
    _getParentRow : function(item) {
      var parent = item._getParentWidget();

      while (parent && !parent.hasClass("form-row")) {
        parent = parent._getParentWidget();
      }

      return parent;
    },


    // override
    resetForm : function() {
      for (var i = 0; i < this.__errorMessageContainers.length; i++) {
        this.__errorMessageContainers[i].parentNode.removeChild(this.__errorMessageContainers[i]);
      }
    },


    dispose : function() {
      this.base(qx.ui.mobile.form.renderer.AbstractRenderer, "dispose");
      this.resetForm();
      this._disposeArray("_labels");
      this._disposeArray("_rows");
    }
  }
});

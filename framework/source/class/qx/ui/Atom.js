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
 * A multi-purpose widget, which combines a label with an icon.
 *
 * The intended purpose of qx.ui.Atom is to easily align the common icon-text
 * combination in different ways.
 *
 * @group(Widget)
 */
qx.Class.define("qx.ui.Atom",
{
  extend : qx.ui.Widget,


  /**
   * @attach {qxWeb, toAtom}
   * @param label {String?} Label to use
   * @param icon {String?null} Icon to use
   * @return {qx.ui.Atom} The new atom widget.
   */
  construct : function(label, icon, element)
  {
    this.super(qx.ui.Widget, "construct", element);

    this.addClass("qx-flex-center");

    if (label) {
      this.label = label;
    }
    if (icon) {
      this.icon = icon;
    }
    this._applyIconPosition("left");
    this.addClass("gap");
  },


  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "atom"
    },

    /** The label/caption/text of the qx.ui.Atom instance */
    label :
    {
      apply : "_applyLabel",
      nullable : true,
      check : "String",
      event : true
    },

    /** Any URI String supported by qx.ui.mobile.Image to display an icon */
    icon :
    {
      check : "String",
      apply : "_applyIcon",
      nullable : true,
      event : true
    },


    /**
     * Configure the visibility of the sub elements/widgets.
     * Possible values: both, text, icon
     */
    showChildren :
    {
      init : "both",
      check : "_checkShowChildren",
      inheritable : true,
      apply : "_applyShowChildren"
    },


    /**
     * The position of the icon in relation to the text.
     * Only useful/needed if text and icon is configured and 'show' is configured as 'both'
     */
    iconPosition :
    {
      init   : "left",
      check : "_checkIconPosition",
      apply : "_applyIconPosition"
    }
  },

  members :
  {
    __label : null,
    __icon : null,
    __childrenContainer : null,


    /**
     * Property validation
     * @param value {String} value
     * @return {Boolean} <code>true</code> if the value is valid.
     */
    _checkIconPosition: function(value) {
      return [ "top", "right", "bottom", "left" ].indexOf(value) !== -1;
    },


    // property apply
    _applyIconPosition : function(value, old) {
      var targetLayout;
      var verticalLayout = ["top", "bottom"].indexOf(value) != -1;

      if (verticalLayout) {
        targetLayout = new qx.ui.layout.VBox();
      } else {
        targetLayout = new qx.ui.layout.HBox();
      }
      this.layout = targetLayout;

      var isReverse = ["right", "bottom"].indexOf(value) != -1;
      targetLayout.reversed = isReverse;

    },


    /**
     * Property validation
     * @param value {String} value
     * @return {Boolean} <code>true</code> if the value is valid.
     */
    _checkShowChildren: function(value) {
      return [ "both", "label", "icon" ].indexOf(value) !== -1;
    },

    // property apply
    _applyShowChildren : function(value, old)
    {
      if (this.__label) {
        if (value === 'both' || value === 'label') {
          this.__label.show();
        } else if(value === 'icon') {
          this.__label.exclude();
        }
      }
      if (this.__icon) {
        if (value === 'both' || value === 'icon') {
          this.__icon.show();
        } else if (value === 'label') {
          this.__icon.exclude();
        }
      }
    },


    // property apply
    _applyLabel : function(value, old)
    {
      if (this.__label) {
        this.__label.value = value;
      } else {
        this.__label = this._createLabelWidget(value);
        this.append(this.__label);
      }
    },


    // property apply
    _applyIcon : function(value, old)
    {
      if (this.__icon) {
        this.__icon.source = value;
      } else {
        this.__icon = this._createIconWidget(value);
        if (this.__label) {
          this.__icon.insertBefore(this.__label);
        } else {
          this.append(this.__icon);
        }
      }
    },


    /**
     * Returns the icon widget.
     *
     * @return {qx.ui.Image} The icon widget.
     */
    getIconWidget: function() {
      return this.__icon;
    },


    /**
     * Returns the label widget.
     *
     * @return {qx.ui.Label} The label widget.
     */
    getLabelWidget : function() {
      return this.__label;
    },


    /**
     * Creates the icon widget.
     *
     * @param iconUrl {String} The icon url.
     * @return {qx.ui.Image} The created icon widget.
     */
    _createIconWidget : function(iconUrl)
    {
      var iconWidget = new qx.ui.Image(iconUrl);
      iconWidget.setStyle("display", "block");
      iconWidget.anonymous = true;
      iconWidget.addClass("gap");
      return iconWidget;
    },


    /**
     * Creates the label widget.
     *
     * @param label {String} The text that should be displayed.
     * @return {qx.ui.Label} The created label widget.
     */
    _createLabelWidget : function(label)
    {
      var labelWidget = new qx.ui.Label(label);
      labelWidget.anonymous = true;
      labelWidget.textWrap = false;
      labelWidget.addClasses(["gap", "qx-flex-center"]);
      return labelWidget;
    },


    /**
     * This function is responsible for creating and adding 2 children controls to the Button widget.
     * A label and an icon.
     * @param label {String} the text of the button
     * @param icon {String} A path to an image resource
     *
     */
    __createChildrenContainer : function(label, icon) {
      var layout;
      var verticalLayout = [ "top", "bottom" ].indexOf(this.iconPosition) != -1;
      // If Atom has no Label, only Icon is shown, and should vertically centered.
      var hasNoLabel = !this.__label;

      if (verticalLayout || hasNoLabel) {
        layout = new qx.ui.layout.VBox();
      } else {
        layout = new qx.ui.layout.HBox();
      }

      if(this.__childrenContainer) {
        this.__childrenContainer.dispose();
      }
      this.__childrenContainer = new qx.ui.Widget();
      this.__childrenContainer.layout = layout;
      this.__childrenContainer.addClass("qx-flex-center");
      this.__childrenContainer.anonymous = true;
    },


    dispose : function() {
      this.super(qx.ui.Widget, "dispose");
      this.__label && this.__label.dispose();
      this.__icon && this.__icon.dispose();
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

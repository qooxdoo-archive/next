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
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/**
 * Mobile page responsible for showing all basic widgets available:
 * - Labels
 * - Atoms
 * - Images
 * - Buttons
 * - Collapsible
 * - Enabled / Disabled state
 */
qx.Class.define("mobileshowcase.page.Basic",
{
  extend : mobileshowcase.page.Abstract,

  construct : function()
  {
    this.super("construct", false);
    this.title = "Basic Widgets";
    this._widgets = [];
  },


  members :
  {

    _widgets : null,

    // overridden
    _initialize : function()
    {
      this.super("_initialize");

      // EXAMPLE WIDGETS
      var exButton = new qx.ui.Button("Button");

      var exToggleButton = new qx.ui.form.ToggleButton(false);

      var labelText = "qx.Mobile is a sophisticated HTML5 framework. It provides specific UI widgets for touch devices, handling of mobile events like swiping, custom theming and much more. It is suitable for mobile web browsers on platforms such as Android, iOS, WP8 or BlackBerry 10.";

      var exLabel = new qx.ui.Label(labelText);
      exLabel.addClass("space-top");

      var exImage = new qx.ui.Image("mobileshowcase/icon/mobile.png");

      // TOGGLE BUTTON
      var toggleEnableButton = new qx.ui.form.ToggleButton(true, "ON", "OFF");

      toggleEnableButton.on("changeValue", function() {
        /*eslint no-shadow: 0 */
        for (var i = 0; i < this._widgets.length; i++) {
          this._widgets[i].enabled = !this._widgets[i].enabled;
        }
      }, this);

      // TOGGLE LABEL WRAP BUTTON
      var toggleLabelWrapButton = new qx.ui.form.ToggleButton(true, "ON", "OFF");
      toggleLabelWrapButton.on("changeValue", function() {
        exLabel.textWrap = !exLabel.textWrap;
      }, this);

      // ATOMS
      var positions = [ "top", "left", "right", "bottom" ];
      var iconSrc = "mobileshowcase/icon/mobile.png";
      var atomRow = new qx.ui.form.Row().set({
        layout: new qx.ui.layout.VBox()
      });
      for (var i = 0; i < positions.length; i++) {
        var atomExample = new qx.ui.Atom("Icon Position: "+positions[i], iconSrc);
        atomExample.iconPosition = positions[i];
        atomRow.append(atomExample);
        this._widgets.push(atomExample);
      }

      var exCollapsible = this._createCollapsible();

      var rating = new qx.ui.Rating();

      this._widgets.push(exButton);
      this._widgets.push(exToggleButton);
      this._widgets.push(exLabel);
      this._widgets.push(exImage);
      this._widgets.push(exCollapsible);
      this._widgets.push(rating);

      // BUILD VIEW
      var row = new qx.ui.form.Row();
      row.append(toggleEnableButton, "Enable");
      row.append(toggleLabelWrapButton, "Wrap");
      var menuGroup = new qx.ui.form.Group("Widget Modes")
        .appendTo(this.getContent());

      new qx.ui.form.Row(toggleEnableButton, "Enable")
        .appendTo(menuGroup);

      new qx.ui.form.Row(toggleLabelWrapButton, "Wrap")
        .appendTo(menuGroup);

      new qx.ui.form.Group("Button")
        .appendTo(this.getContent())
        .append(exButton);

      new qx.ui.form.Group("ToggleButton")
        .appendTo(this.getContent())
        .append(new qx.ui.form.Row(exToggleButton));

      new qx.ui.form.Group("Label")
        .appendTo(this.getContent())
        .append(new qx.ui.form.Row(exLabel));

      new qx.ui.form.Group("Image")
        .appendTo(this.getContent())
        .append(exImage);

      new qx.ui.form.Group("Collapsible")
        .appendTo(this.getContent())
        .append(exCollapsible);

      new qx.ui.form.Group("Atoms")
        .appendTo(this.getContent())
        .append(atomRow);

      new qx.ui.form.Group("Rating")
        .appendTo(this.getContent())
        .append(new qx.ui.form.Row(rating));
    },


    _createCollapsible : function() {
      var collapsible = new qx.ui.container.Collapsible("Collapsible Header");
      var label = new qx.ui.Label("This is the content of the Collapsible.");
      collapsible.append(label);
      return collapsible;
    }
  }
});

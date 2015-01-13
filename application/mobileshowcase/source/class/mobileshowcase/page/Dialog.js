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
 * Mobile page responsible for showing all dialog widgets available:
 * - Popup
 * - Confirm dialogs
 * - Anchor dialogs
 */
qx.Class.define("mobileshowcase.page.Dialog",
{
  extend : mobileshowcase.page.Abstract,

  construct : function()
  {
    this.super(mobileshowcase.page.Abstract, "construct", false);
    this.title = "Dialog Widgets";
  },


  members :
  {
    __anchorPopup : null,
    __popup : null,
    __busyPopup : null,
    __menu : null,
    __picker : null,
    __pickerDialog : null,
    __pickerDaySlotData : null,
    __anchorMenu : null,
    __resultsLabel : null,


    // overridden
    _initialize : function()
    {
      var body = qxWeb(document.body);

      this.super(mobileshowcase.page.Abstract, "_initialize");

      this.__resultsLabel = new qx.ui.Label("No events received so far.");
      var resultsGroup = new qx.ui.form.Group();
      new qx.ui.form.Row()
        .append(this.__resultsLabel)
        .appendTo(resultsGroup);

      // EXAMPLE WIDGETS
      var busyIndicator = new qx.ui.dialog.BusyIndicator("Please wait...");
      this.__busyPopup = new qx.ui.dialog.Popup(busyIndicator).appendTo(body);

      // DEFAULT POPUP
      this.__popup = null;

      var closeDialogButton1 = new qx.ui.Button("Close Popup");
      this.__popup = new qx.ui.dialog.Popup(closeDialogButton1).appendTo(body);
      this.__popup.title = "A Popup";

      closeDialogButton1.on("tap", function() {
        this.__popup.hide();
      }, this);

      // ANCHOR POPUP
      var showAnchorButton = new qx.ui.Button("Anchor Popup");
      showAnchorButton.on("tap", function(e) {
          this.__anchorPopup.show();
      }, this);

      this.__anchorPopup = this.__createAnchorPopup(showAnchorButton);

      // MENU DIALOG
      var menuModel = new qx.data.Array();
      for (var i = 0; i < 50; i++) {
        menuModel.push({
          title: "Action " + i
        });
      }

      this.__menu = new qx.ui.dialog.Menu(menuModel).appendTo(body);
      this.__menu.title = "Menu";
      this.__menu.on("selected", this.__onMenuChangeSelection, this);
      this.__menu.visibleListItems = 10;

       // PICKER DIALOG
      var showPickerButton = new qx.ui.Button("Picker");
      showPickerButton.on("tap", function(e) {
        this.__pickerDialog.show();
      }, this);

      this._createPicker(showPickerButton);

      // ANCHORED MENU POPUP
      var showAnchorMenuButton = new qx.ui.Button("Anchor Menu");
      showAnchorMenuButton.on("tap", function(e) {
        this.__anchorMenu.show();
      }, this);

      var anchorMenuModel = new qx.data.Array([{
        title: "Red"
      }, {
        title: "Green"
      }, {
        title: "Blue"
      }]);
      this.__anchorMenu = new qx.ui.dialog.Menu(anchorMenuModel, showAnchorMenuButton).appendTo(body);
      this.__anchorMenu.title = "Colors";
      this.__anchorMenu.on("selected", this.__onAnchorMenuChangeSelection, this);

      // BUTTONS
      var showPopupButton = new qx.ui.Button("Popup");
      showPopupButton.on("tap", function(e) {
        this.__popup.show();
      }, this);

      var busyIndicatorButton = new qx.ui.Button("Busy Indicator");
      busyIndicatorButton.on("tap", function(e) {
        this.__busyPopup.toggleVisibility();
        window.setTimeout(this.__busyPopup.hide.bind(this.__busyPopup), 3000);
      }, this);

      var showMenuButton = new qx.ui.Button("Menu");
      showMenuButton.on("tap", function(e) {
        this.__menu.show();
      }, this);

      var popupGroup = new qx.ui.form.Group([],false);
      popupGroup.append(this._createGroupTitle("Popup"));
      popupGroup.layout = new qx.ui.layout.VBox();
      showPopupButton.layoutPrefs = {flex:1};
      popupGroup.append(showPopupButton);
      showAnchorButton.layoutPrefs = {flex:1};
      popupGroup.append(showAnchorButton);

      var menuGroup = new qx.ui.form.Group([],false);
      menuGroup.append(this._createGroupTitle("Menu"));
      menuGroup.layout = new qx.ui.layout.VBox();
      showMenuButton.layoutPrefs = {flex:1};
      menuGroup.append(showMenuButton);
      showAnchorMenuButton.layoutPrefs = {flex:1};
      menuGroup.append(showAnchorMenuButton);

      var otherGroup = new qx.ui.form.Group([],false);
      otherGroup.append(this._createGroupTitle("Other"));
      otherGroup.layout = new qx.ui.layout.VBox();
      busyIndicatorButton.layoutPrefs = {flex:1};
      otherGroup.append(busyIndicatorButton);
      showPickerButton.layoutPrefs = {flex:1};
      otherGroup.append(showPickerButton);

      var groupContainer = new qx.ui.Widget();
      groupContainer.addClass("dialog-group");
      groupContainer.layout = new qx.ui.layout.HBox();
      popupGroup.layoutPrefs =  {flex:1};
      groupContainer.append(popupGroup);
      menuGroup.layoutPrefs =  {flex:1};
      groupContainer.append(menuGroup);
      otherGroup.layoutPrefs =  {flex:1};
      groupContainer.append(otherGroup);

      this.getContent().append(groupContainer);
      this.getContent().append(resultsGroup);

      this._updatePickerDaySlot();
    },


    /**
    * Creates the date picker dialog.
    * @param anchor {qx.ui.Widget} the anchor of the popup.
    * @return {qx.ui.dialog.Picker} the date picker.
    */
    _createPicker : function(anchor) {
      var picker = this.__picker = new qx.ui.form.Picker();

      this.__pickerDaySlotData = this._createDayPickerSlot(0, new Date().getFullYear());
      picker.addSlot(this.__pickerDaySlotData);
      picker.addSlot(this._createMonthPickerSlot());
      picker.addSlot(this._createYearPickerSlot());

      picker.on("changeValue", this.__onPickerChangeValue, this);

      var hidePickerButton = new qx.ui.Button("OK")
        .setStyle("width", "100%");
      hidePickerButton.on("tap", function(e) {
        pickerDialog.hide();
      }, this);

      var pickerDialogContent = new qx.ui.Widget();
      pickerDialogContent.append(picker);
      pickerDialogContent.append(hidePickerButton);
      var pickerDialog = this.__pickerDialog = new qx.ui.dialog.Popup(pickerDialogContent).appendTo(qxWeb(document.body));
      pickerDialog.title = "Picker";
    },


    /**
     * Creates the picker slot data for days in month.
     * @param month {Integer} current month.
     * @param year {Integer} current year.
     */
    _createDayPickerSlot : function(month, year) {
      var daysInMonth = new Date(year, month + 1, 0).getDate();

      var slotData = [];
      for (var i = 1; i <= daysInMonth; i++) {
        slotData.push({
          title: "" + i
        });
      }
      return new qx.data.Array(slotData);
    },


    /**
     * Creates the picker slot data for month names.
     */
    _createMonthPickerSlot : function() {
      var slotData = [];
      ["January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"]
      .forEach(function(name) {
        slotData.push({
          title: name
        });
      });
      return new qx.data.Array(slotData);
    },


    /**
     * Creates the picker slot data from 1950 until the current year.
     */
    _createYearPickerSlot : function() {
      var slotData = [];
      for (var i = new Date().getFullYear(); i > 1950; i--) {
        slotData.push(i + "");
      }
      return new qx.data.Array(slotData);
    },


    /**
     * Creates the anchor popup.
     */
    __createAnchorPopup : function(anchor)
    {
      if (this.__anchorPopup) {
        return this.__anchorPopup;
      }
      var body = qxWeb(document.body);

      var buttonsWidget = new qx.ui.Widget();
      buttonsWidget.layout = new qx.ui.layout.HBox();
      var okButton = new qx.ui.Button("Yes");
      var cancelButton = new qx.ui.Button("No");

      buttonsWidget.append(okButton);
      buttonsWidget.append(cancelButton);

      okButton.on("tap", function() {
        this.__anchorPopup.hide();
      }, this);
      cancelButton.on("tap", function() {
        this.__anchorPopup.hide();
      }, this);

      var popup = new qx.ui.dialog.Popup(buttonsWidget, anchor).appendTo(body);
      popup.title = "Are you sure?";
      return popup;
    },


    /**
     * Reacts on "changeSelection" event on picker, and displays the values on resultsLabel.
     */
    __onPickerChangeValue : function(value) {
      this._updatePickerDaySlot();

      var label = "Picker selection changed: ";
      value.forEach(function(item, slotIndex) {
        label = label + " [slot " + slotIndex + ": " + (item.title || item) + "]";
      }.bind(this));
      this.__resultsLabel.value = label;
    },


    /**
    * Updates the shown days in the picker slot.
    */
    _updatePickerDaySlot : function() {
      var model = this.__picker.getModel();
      var month = model.getItem(1).indexOf(this.__picker.value[1]);

      var year = parseInt(this.__picker.value[2]);
      var daysInMonth = new Date(year, month + 1, 0).getDate();

      var displayedDays = model.getItem(0).length;
      var diff;
      if (displayedDays > daysInMonth) {
        diff = displayedDays - daysInMonth;
        if (parseInt(this.__picker.value[0].title) > daysInMonth) {
          this.__picker.value[0] = model.getItem(0).getItem(daysInMonth - 1);
          return;
        }

        model.getItem(0).splice(displayedDays - diff, diff);
      } else if (displayedDays < daysInMonth) {
        diff = daysInMonth - displayedDays;
        for (var i=0; i<diff; i++) {
          model.getItem(0).push({
            title: displayedDays + i + 1
          });
        }
      }
    },


    /**
    * Creates a group title for the dialow showcase.
    * @return {qx.ui.form.Label} the group title label.
    */
    _createGroupTitle : function(value) {
      var titleLabel = new qx.ui.Label(value);
      titleLabel.addClass("dialog-group-title");
      titleLabel.addClass("gap");
      return titleLabel;
    },


    /**
     * Reacts on "changeSelection" event on Menu, and displays the values on resultsLabel.
     */
    __onMenuChangeSelection : function(el) {
      var index = el.getData("row");
      var model = this.__menu.model.getItem(index);
      this.__resultsLabel.value = (
        "Received <b>changeSelection</b> from Menu Dialog. [index: "
        + index + "] [item: " + model.title + "]");
    },

    __onAnchorMenuChangeSelection: function(el) {
      var index = el.getData("row");
      var model = this.__anchorMenu.model.getItem(index);
      this.__resultsLabel.value = (
        "Received <b>changeSelection</b> from Anchor Menu Dialog. [index: " + index + "] [item: " + model.title + "]");
    }

  }
});

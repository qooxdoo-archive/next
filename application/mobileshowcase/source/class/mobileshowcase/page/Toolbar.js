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
     * Gabriel Munteanu (gabios)

************************************************************************ */

/* ************************************************************************


************************************************************************ */
/**
 * Mobile page responsible for showing the different showcases.
 *
 * @asset(mobileshowcase/icon/camera.png)
 */
qx.Bootstrap.define("mobileshowcase.page.Toolbar",
{
  extend : mobileshowcase.page.Abstract,


  statics : {
    __toolbarButtonImages: ["mobileshowcase/icon/arrowleft.png","mobileshowcase/icon/camera.png"]
  },


  construct : function()
  {
    this.base(mobileshowcase.page.Abstract, "constructor", false);
    this.title = "Toolbar";
  },


  events :
  {
    /** The page to show */
    "show" : "qx.event.type.Data"
  },


  members :
  {

    /**
     * The toolbar
     */
    __toolbar : null,
    __searchPopup: null,
    __busyIndicator: null,
    __areYouSurePopup: null,
    __searchDialog: null,
    __deleteDialog: null,
    __goBackBtn: null,
    __loadButton: null,


    // overridden
    _initialize : function()
    {
      this.base(mobileshowcase.page.Abstract, "_initialize");

      var label = new qx.ui.mobile.form.Title("Search");
      this.getContent().append(label);

      var toolbar = this.__toolbar = new qx.ui.mobile.toolbar.ToolBar();
      this.append(toolbar);

      var searchBtn = new qx.ui.mobile.Button("Search");
      searchBtn.on("tap", function() {
        var searchDialog = this.__createSearchDialog();
        searchDialog.show();
      }, this);

      this.__goBackBtn = new qx.ui.mobile.Button(
        null, mobileshowcase.page.Toolbar.__toolbarButtonImages[0]
      );
      this.__goBackBtn.showChildren = "icon";

       this.__goBackBtn.on("tap", function(){
        var popup = this.__createAreYouSurePopup( this.__goBackBtn);
        popup.show();
      }, this);

      this.__loadButton = new qx.ui.mobile.Button(
        null, mobileshowcase.page.Toolbar.__toolbarButtonImages[1]
      );
      this.__loadButton.showChildren = "icon";

      this.__loadButton.on("tap", function(){
        var popup = this.__createSearchPopup();
        popup.show();
        window.setTimeout(popup.hide.bind(popup), 3000);
      }, this);


      var deleteButton = new qx.ui.mobile.Button("Delete");
      deleteButton.on("tap", function(){
        this.__deleteDialog = qx.ui.mobile.dialog.Manager.getInstance().warning('Deleting', 'Are you sure?', this.__processDelete, this, ["Yes", "No"]);
      }, this);

      toolbar.append(searchBtn);
      toolbar.append(this.__goBackBtn);
      toolbar.append(this.__loadButton);
      toolbar.append(deleteButton);
    },


    __processDelete : function(index)
    {
      if(index==0) {
        this.__deleteDialog.dispose();
      } else {
        this.__deleteDialog.dispose();
      }
    },


    /**
     * Creates the popup widget to show when backButton is tapped
     */
    __createAreYouSurePopup : function(anchor)
    {
      if(this.__areYouSurePopup) {
        return this.__areYouSurePopup;
      }
      var buttonsWidget = new qx.ui.mobile.Widget();
      buttonsWidget.setLayout(new qx.ui.mobile.layout.HBox());

      var okButton = new qx.ui.mobile.Button("Yes");
      var cancelButton = new qx.ui.mobile.Button("No");

      okButton.layoutPrefs = {flex:1};
      buttonsWidget.append(okButton);
      cancelButton.layoutPrefs = {flex:1};
      buttonsWidget.append(cancelButton);

      okButton.on("tap", function(){
        this.__areYouSurePopup.hide();
      }, this);

      cancelButton.on("tap", function(){
        this.__areYouSurePopup.hide();
      }, this);

      this.__areYouSurePopup = new qx.ui.mobile.dialog.Popup(buttonsWidget, anchor);
      this.__areYouSurePopup.title = "Are you sure?";
      return this.__areYouSurePopup;
    },

    /**
     * Creates the popup widget to show when backButton is tapped
     */
    __createSearchPopup : function(attachedToWidget)
    {
      if(this.__searchPopup) {
        return this.__searchPopup;
      }
      var busyIndicator = new qx.ui.mobile.dialog.BusyIndicator("Data connection...");
      this.__searchPopup = new qx.ui.mobile.dialog.Popup(busyIndicator, attachedToWidget);
      this.__searchPopup.title = "Loading...";
      return this.__searchPopup;
    },

    /**
     * Creates the popup widget to show when backButton is tapped
     */
    __createSearchDialog : function()
    {
      if(this.__searchDialog) {
        return this.__searchDialog;
      }
      var popupWidget = new qx.ui.mobile.Widget();
      popupWidget.setLayout(new qx.ui.mobile.layout.VBox());

      var searchField = new qx.ui.mobile.form.TextField();
      searchField.on("keydown", function(evt) {
        if (evt.keyIdentifier == "Enter") {
          this.__searchDialog.hide();
          searchField.blur();
        }
      }.bind(this));

      var searchButton = new qx.ui.mobile.Button("Search");
      searchButton.on("tap", function(){
        this.__searchDialog.hide();
      }, this);

      popupWidget.append(searchField);
      popupWidget.append(searchButton);

      this.__searchDialog = new qx.ui.mobile.dialog.Popup(popupWidget);
      this.__searchDialog.hideOnBlockerTap = true;
      this.__searchDialog.modal = true;
      this.__searchDialog.title = 'Search ...';
      return this.__searchDialog;
    },


    // overridden
    _stop : function() {
      if (this.__deleteDialog) {
        this.__deleteDialog.hide();
      }
      if (this.__areYouSurePopup) {
        this.__areYouSurePopup.hide();
      }
      if (this.__searchPopup) {
        this.__searchPopup.hide();
      }
      if (this.__searchDialog) {
        this.__searchDialog.hide();
      }
    }
  }
});

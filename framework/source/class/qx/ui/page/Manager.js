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
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/**
 * The page manager decides automatically whether the added pages should be
 * displayed in a master/detail view (for tablet) or as a plain card layout (for
 * smartphones).
 *
 * *Example*
 *
 * Here is a little example of how to use the manager.
 *
 * <pre class='javascript'>
 *  var manager = new qx.ui.page.Manager();
 *  var page1 = new qx.ui.page.NavigationPage();
 *  var page2 = new qx.ui.page.NavigationPage();
 *  var page3 = new qx.ui.page.NavigationPage();
 *  manager.addMaster(page1);
 *  manager.addDetail([page2,page3]);
 *
 *  page1.show();
 * </pre>
 *
 *
 */
qx.Class.define("qx.ui.page.Manager",
{
  extend : Object,


  /**
   * @param isTablet {Boolean?} flag which triggers the manager to layout for tablet (or big screens/displays) or mobile devices. If parameter is null,
   * qx.core.Environment.get("device.type") is called for decision.
   * @param root {qx.ui.Widget?} widget which should be used as root for this manager.
   */
  construct : function(isTablet, root)
  {
    root = root || qx.core.Init.getApplication().getRoot();

    if (typeof isTablet !== "undefined" && isTablet !== null) {
      this.__isTablet = isTablet;
    } else {
      // If isTablet is undefined, call environment variable "device.type".
      // When "tablet" or "desktop" type >> do tablet layouting.
      this.__isTablet =
      qx.core.Environment.get("device.type") == "desktop" ||
      qx.core.Environment.get("device.type") == "tablet";
    }

    this.__detailNavigation = this._createDetailNavigation();
    this.__detailNavigation.layoutPrefs = {flex:1};

    if (this.__isTablet) {
      this.__masterNavigation = this._createMasterNavigation();
      this.__masterNavigation.layoutPrefs = {flex:1};

      this.__masterContainer = this._createMasterContainer();
      this.__detailContainer = this._createDetailContainer();
      this.__detailContainer.layoutPrefs = {flex:1};

      this.__masterButton = this._createMasterButton();
      this.__masterButton.on("tap", this._onMasterButtonTap, this);

      this.__hideMasterButton = this._createHideMasterButton();
      this.__hideMasterButton.on("tap", this._onHideMasterButtonTap, this);

      this.__masterNavigation.on("update", this._onMasterContainerUpdate, this);
      this.__detailNavigation.on("update", this._onDetailContainerUpdate, this);

      root.append(this.__masterContainer);
      root.append(this.__detailContainer);
      this.__masterContainer.append(this.__masterNavigation);
      this.__detailContainer.append(this.__detailNavigation);

      qxWeb(window).on("orientationchange", this._onLayoutChange, this);
      this.__masterContainer.on("resize", this._onLayoutChange, this);

      // On Tablet Mode, no Animation should be shown by default.
      this.__masterNavigation.getContent().layout.showAnimation = false;
      this.__detailNavigation.getContent().layout.showAnimation = false;

      this.__masterContainer.forceHide();

      setTimeout(function() {
        if (qxWeb.env.isLandscape()) {
          this.__masterContainer.show();
        }
      }.bind(this), 300);
    } else {
      root.append(this.__detailNavigation);
    }
  },


  properties : {

    /**
     * The caption/label of the Master Button and Popup Title.
     */
    masterTitle : {
      init : "Master",
      check : "String",
      apply : "_applyMasterTitle"
    },


    /**
     * The caption/label of the Hide Master Button.
     */
    hideMasterButtonCaption : {
      init : "Hide",
      check : "String",
      apply : "_applyHideMasterButtonCaption"
    },


    /**
     * This flag controls whether the MasterContainer can be hidden on Landscape.
     */
    allowMasterHideOnLandscape : {
      init : true,
      check : "Boolean"
    },


    /**
     *  This flag controls whether the MasterContainer hides on portrait view,
     *  when a Detail Page fires the lifecycle event "start".
     */
    hideMasterOnDetailStart : {
      init : true,
      check : "Boolean"
    }
  },


  members :
  {
    __isTablet : null,
    __detailNavigation : null,
    __masterNavigation : null,
    __masterButton : null,
    __hideMasterButton : null,
    __masterPages : null,
    __detailPages : null,
    __masterContainer : null,
    __detailContainer : null,


    /**
     * Creates the master container.
     *
     * @return {qx.ui.Widget} The created container
     */
    _createMasterContainer : function() {
      var masterContainer = new qx.ui.container.Drawer(new qx.ui.layout.HBox());
      masterContainer.visibility = "hidden";
      masterContainer.addClass("master-detail-master");
      masterContainer.hideOnParentTap = false;
      masterContainer.on("changeVisibility", this._onMasterChangeVisibility, this);
      return masterContainer;
    },


    /**
     * Creates the detail container.
     *
     * @return {qx.ui.Widget} The created container
     */
    _createDetailContainer : function() {
      var detailContainer = new qx.ui.Widget();
      detailContainer.layout = new qx.ui.layout.VBox();
      detailContainer.defaultCssClass = "master-detail-detail";
      return detailContainer;
    },


    /**
     * Getter for the Master Container
     * @return {qx.ui.container.Drawer} The Master Container.
     */
    getMasterContainer : function() {
      return this.__masterContainer;
    },


    /**
     * Getter for the Detail Container
     * @return {qx.ui.Widget} The Detail Container.
     */
    getDetailContainer : function() {
      return this.__detailContainer;
    },


    /**
     * Returns the button for showing/hiding the masterContainer.
     * @return {qx.ui.Button}
     */
    getMasterButton : function() {
      return this.__masterButton;
    },


    /**
     * Returns the masterNavigation.
     * @return {qx.ui.container.Navigation}
     */
    getMasterNavigation : function() {
      return this.__masterNavigation;
    },


    /**
     * Returns the detailNavigation.
     * @return {qx.ui.container.Navigation}
     */
    getDetailNavigation : function() {
      return this.__detailNavigation;
    },


     /**
     * Factory method for the master button, which is responsible for showing/hiding masterContainer.
     * @return {qx.ui.Button}
     */
    _createMasterButton : function() {
      return new qx.ui.Button(this.masterTitle);
    },


    /**
     * Factory method for the hide master button, which is responsible for hiding masterContainer on Landscape view.
     * @return {qx.ui.Button}
     */
    _createHideMasterButton : function() {
      return new qx.ui.Button("Hide");
    },


    /**
    * Factory method for masterNavigation.
    * @return {qx.ui.container.Navigation}
    */
    _createMasterNavigation : function() {
      return new qx.ui.container.Navigation();
    },


    /**
     * Factory method for detailNavigation.
     * @return {qx.ui.container.Navigation}
     */
    _createDetailNavigation : function() {
      return new qx.ui.container.Navigation();
    },


    /**
     * Adds an array of NavigationPages to masterContainer, if __isTablet is true. Otherwise it will be added to detailContainer.
     * @param pages {qx.ui.page.NavigationPage[]|qx.ui.page.NavigationPage} Array of NavigationPages or single NavigationPage.
     */
    addMaster : function(pages) {
      if (this.__isTablet) {
        if(pages) {
          if(!qx.lang.Type.isArray(pages) || pages instanceof qxWeb) {
            pages = [pages];
          }

          for(var i = 0; i < pages.length; i++) {
            var masterPage = pages[i];
            masterPage.on("start", this._onMasterPageStart, this);
          }

          if(this.__masterPages) {
            this.__masterPages.concat(pages);
          } else {
            this.__masterPages = pages;
          }

          this._add(pages, this.__masterNavigation);
        }
      } else {
        this.addDetail(pages);
      }
    },


    /**
     * Adds an array of NavigationPage to the detailContainer.
     * @param pages {qx.ui.page.NavigationPage[]|qx.ui.page.NavigationPage} Array of NavigationPages or single NavigationPage.
     */
    addDetail : function(pages) {
      this._add(pages, this.__detailNavigation);

      if(pages && this.__isTablet) {
        if (!qx.lang.Type.isArray(pages) || pages instanceof qxWeb) {
          pages = [pages];
        }

        for(var i = 0; i < pages.length; i++) {
          var detailPage = pages[i];
          detailPage.on("start", this._onDetailPageStart, this);
        }

        if(this.__detailPages) {
          this.__detailPages.concat(pages);
        } else {
          this.__detailPages = pages;
        }
      }
    },


    /**
     * Called when a detailPage reaches lifecycle state "start".
     * @param evt {qx.event.type.Event} source event.
     */
    _onDetailPageStart : function(evt) {
      if(!qxWeb.env.isLandscape() && this.hideMasterOnDetailStart) {
        this.__masterContainer.hide();
      }
    },


    /**
     * Called when a masterPage reaches lifecycle state "start". Then property masterTitle will be update with masterPage's title.
     * @param evt {qx.event.type.Event} source event.
     */
    _onMasterPageStart : function(evt) {
      var masterPage = evt.getTarget();
      var masterPageTitle = masterPage.title;
      this.masterTitle = masterPageTitle;
    },


    /**
     * Adds an array of NavigationPage to the target container.
     * @param pages {qx.ui.page.NavigationPage[]|qx.ui.page.NavigationPage} Array of NavigationPages, or NavigationPage.
     * @param target {qx.ui.container.Navigation} target navigation container.
     */
    _add : function(pages, target) {
      if (!qx.lang.Type.isArray(pages) || pages instanceof qxWeb) {
        pages = [pages];
      }

      for (var i = 0; i < pages.length; i++) {
        var page = pages[i];

        if (qx.core.Environment.get("qx.debug"))
        {
          qx.core.Assert.assertInstance(page, qx.ui.page.NavigationPage);
        }

        if(this.__isTablet && !page.showBackButtonOnTablet) {
          page.showBackButton = false;
        }

        page.setIsTablet(this.__isTablet);
        target.append(page);
      }
    },


    /**
     * Called when masterContainer is updated.
     * @param widget {qx.ui.Widget} source widget.
     */
    _onMasterContainerUpdate : function(widget) {
      this.__hideMasterButton.remove();
      widget.getRightContainer().append(this.__hideMasterButton);
    },


    /**
     * Called when detailContainer is updated.
     * @param widget {qx.ui.Widget} source widget.
     */
    _onDetailContainerUpdate : function(widget) {
      this.__masterButton.remove();
      widget.getLeftContainer().append(this.__masterButton);
    },


    /**
    * Called when user taps on masterButton.
    */
    _onMasterButtonTap : function() {
      this.__masterContainer.show();
    },


    /**
    * Called when user taps on hideMasterButton.
    */
    _onHideMasterButtonTap : function() {
      this._removeDetailContainerGap();
      this.__masterContainer.hide();
    },


    /**
    * Event handler for <code>changeVisibility</code> event on master container.
    * @param value {String} The new visibility value
    */
    _onMasterChangeVisibility: function(data) {
      var isMasterVisible = ("visible" === data.value);

      if (qxWeb.env.isLandscape()) {
        if (this.allowMasterHideOnLandscape) {
          if (isMasterVisible) {
            this._createDetailContainerGap();
            this.__masterButton.exclude();
            this.__hideMasterButton.show();
          } else {
            this.__masterButton.show();
            this.__hideMasterButton.show();
          }
        } else {
          this.__masterButton.exclude();
          this.__hideMasterButton.exclude();
        }
      } else {
        this._removeDetailContainerGap();
        this.__masterButton.show();
        this.__hideMasterButton.show();
      }
    },


    /**
    * Called when layout of masterDetailContainer changes.
    */
    _onLayoutChange : function() {
      if (this.__isTablet) {
        if (qxWeb.env.isLandscape()) {
          this.__masterContainer.hideOnParentTap = false;
          if (this.__masterContainer.visibility !== "visible") {
            this.__masterContainer.show();
          } else {
            this._removeDetailContainerGap();
            this.__masterContainer.hide();
          }
        } else {
          this._removeDetailContainerGap();
          this.__masterContainer.hideOnParentTap = true;
          this.__masterContainer.hide();
        }
      }
    },


    /**
    * Returns the corresponding CSS property key which fits to the drawer's orientation.
    * @return {String} the CSS property key.
    */
    _getGapPropertyKey : function() {
      return "padding"+ qx.lang.String.capitalize(this.__masterContainer.orientation);
    },


    /**
     * Moves detailContainer to the right edge of MasterContainer.
     * Creates spaces for aligning master and detail container aside each other.
     */
    _createDetailContainerGap : function() {
      this.__detailContainer.setStyle(this._getGapPropertyKey(), this.__masterContainer.size / 16 + "rem");
      qxWeb(window).emit("resize");
    },


    /**
     * Moves detailContainer to the left edge of viewport.
     */
    _removeDetailContainerGap : function() {
      this.__detailContainer.setStyle(this._getGapPropertyKey(), null);
      qxWeb(window).emit("resize");
    },


    /**
    * Called on property changes of hideMasterButtonCaption.
    * @param value {String} new caption
    * @param old {String} previous caption
    */
    _applyHideMasterButtonCaption : function(value, old) {
      if(this.__isTablet) {
        this.__hideMasterButton.label = value;
      }
    },


    /**
    * Called on property changes of masterTitle.
    * @param value {String} new title
    * @param old {String} previous title
    */
    _applyMasterTitle : function(value, old) {
      if(this.__isTablet) {
        this.__masterButton.label = value;
      }
    },


    dispose : function() {
      if (this.__masterPages) {
        for(var i = 0; i < this.__masterPages.length; i++) {
          var masterPage = this.__masterPages[i];

          masterPage.off("start", this._onMasterPageStart, this);
        }
      }
      if (this.__detailPages) {
        for(var j = 0; j < this.__detailPages.length; j++) {
          var detailPage = this.__detailPages[j];

          detailPage.off("start", this._onDetailPageStart, this);
        }
      }

      if (this.__isTablet) {
        this.__masterContainer.off("changeVisibility", this._onMasterChangeVisibility, this);
        this.__masterContainer.off("resize", this._onLayoutChange, this);
        qxWeb(window).on("orientationchange", this._onLayoutChange, this);
      }

      this.__masterPages = this.__detailPages =  null;

      this.__detailNavigation.dispose();
      if (this.__masterNavigation) {
        this.__masterNavigation.dispose();
      }
      if (this.__masterButton) {
        this.__masterButton.dispose();
      }
    }
  }
});

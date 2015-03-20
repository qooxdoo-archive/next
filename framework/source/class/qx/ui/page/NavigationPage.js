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
 * Specialized page. This page includes already a {@link qx.ui.NavigationBar}
 * and and a {@link qx.ui.container.Scroll} container.
 * The NavigationPage can only be used with a page manager {@link qx.ui.page.Manager}.

 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *
 *  var manager = new qx.ui.page.Manager();
 *  var page = new qx.ui.page.NavigationPage();
 *  page.title = "Page Title";
 *  page.showBackButton = true;
 *  page.backButtonText = "Back";
 *  page.on("initialize", function()
 *  {
 *    var button = new qx.ui.Button("Next Page");
 *    page.getContent().append(button);
 *  },this);
 *
 *  page.on("back", function()
 *  {
 *    otherPage.show({animation:"cube", reverse:true});
 *  },this);
 *
 *  manager.addDetail(page);
 *  page.show();
 * </pre>
 *
 * This example creates a NavigationPage with a title and a back button. In the
 * <code>initialize</code> lifecycle method a button is added.
 *
 * @group(Widget)
 */
qx.Class.define("qx.ui.page.NavigationPage",
{
  extend : qx.ui.page.Page,
  implement : qx.ui.container.INavigation,


  /**
   * @param wrapContentByGroup {Boolean?} Defines whether a group box should wrap the content. This can be used for defining a page margin.
   * @param layout {qx.ui.layout.Abstract?} The layout of this page.
   * @param element {Element?} Existing DOM element to use
   * @attach {qxWeb, toNavigationPage}
   */
  construct : function(wrapContentByGroup, layout, element)
  {
    this.super(qx.ui.page.Page, "construct", layout, element);

    if (typeof wrapContentByGroup == "boolean") {
      this._wrapContentByGroup = wrapContentByGroup;
    }
  },


  events :
  {
    /** Fired when the user tapped on the navigation button */
    action : null
  },


  properties :
  {
    /** The title of the page */
    title :
    {
      check : "String",
      init : "",
      event : true,
      apply : "_applyTitle"
    },


    /** The back button text */
    backButtonText :
    {
      check : "String",
      init : "",
      apply : "_applyBackButtonText"
    },


    /** The action button text */
    buttonText :
    {
      check : "String",
      init : "",
      apply : "_applyActionButtonText"
    },


    /** The action button icon */
    buttonIcon :
    {
      check : "String",
      init : null,
      nullable : true,
      apply : "_applyActionButtonIcon"
    },


    /**
     * Whether to show the back button.
     */
    showBackButton:
    {
      check : "Boolean",
      init : false,
      apply : "_applyShowBackButton"
    },


    /**
     * Indicates whether the back button should be shown on tablet.
     */
    showBackButtonOnTablet:
    {
      check : "Boolean",
      init : false
    },


    /**
     * Whether to show the action button.
     */
    showButton:
    {
      check : "Boolean",
      init : false,
      apply : "_applyShowButton"
    },


    /**
     * Toggles visibility of NavigationBar in
     * wrapping container {@link qx.ui.container.Navigation}
     */
    navigationBarHidden:
    {
      check : "Boolean",
      init : false,
      event: true
    },


    /**
     * Sets the transition duration (in seconds) for the effect when hiding/showing
     * the NavigationBar through boolean property navigationBarHidden.
     */
    navigationBarToggleDuration:
    {
      check : "Number",
      init : 0.8
    },


    /**
     * The CSS class to add to the content per default.
     */
    contentCssClass :
    {
      check : "String",
      init : "content",
      nullable : true,
      apply : "_applyContentCssClass"
    }
  },


  members :
  {
    _isTablet : false,
    _wrapContentByGroup : true,
    __backButton : null,
    __actionButton : null,
    __content : null,
    __scrollContainer : null,
    __title : null,
    __navigationBar : null,
    __leftContainer : null,
    __rightContainer : null,


    // interface implementation
    getTitleElement: function () {
      if (!this.__title) {
        this.__title = qxWeb.create("<h1>").setHtml(this.title)
          .addClasses(['title', 'no-wrap', 'qx-flex1']);
      }
      return this.__title;
    },


    // property apply
    _applyTitle : function(value) {
      if (this.__title) {
        this.__title.setHtml(value);
      }
    },

    /**
     * Creates the navigation bar.
     *
     * @return {qx.ui.Widget} The created navigation bar
     */
    getNavigationBar : function() {
      if (!this.__navigationBar) {
        var classes = ['navigationbar', 'qx-hbox', 'qx-flex-align-center'];
        var navigationBar = this.__navigationBar = new qx.ui.Widget().addClasses(classes);

        var leftContainer = this.getLeftContainer();
        if (leftContainer) {
          navigationBar.append(leftContainer);
        }

        var title = this.getTitleElement();
        if (title) {
          title.layoutPrefs = {flex:1};
          navigationBar.append(title);
        }

        var rightContainer = this.getRightContainer();
        if (rightContainer) {
          navigationBar.append(rightContainer);
        }
      }

      return this.__navigationBar;
    },


    // interface implementation
    getLeftContainer : function() {
      if (!this.__leftContainer) {
        this.__leftContainer = this._createLeftContainer();
      }
      return this.__leftContainer;
    },


    // interface implementation
    getRightContainer : function() {
      if (!this.__rightContainer) {
        this.__rightContainer = this._createRightContainer();
      }
      return this.__rightContainer;
    },


    /**
     * Creates the left container for the navigation bar.
     *
     * @return {qx.ui.Widget} Creates the left container for the navigation bar.
     */
    _createLeftContainer : function() {
      var layout =new qx.ui.layout.HBox();
      var container = new qx.ui.Widget();
      container.layout = layout;
      container.addClass("left-container");
      this.__backButton = this._createBackButton();
      this.__backButton.on("tap", this._onBackButtonTap, this);
      this._showBackButton();
      container.append(this.__backButton);
      return container;
    },


    /**
     * Creates the right container for the navigation bar.
     *
     * @return {qx.ui.Widget} Creates the right container for the navigation bar.
     */
    _createRightContainer : function() {
      var layout = new qx.ui.layout.HBox();
      var container = new qx.ui.Widget();
      container.layout = layout;
      container.addClass("right-container");
      this.__actionButton = this._createButton();
      this.__actionButton.on("tap", this._onButtonTap, this);
      this._showButton();
      container.append(this.__actionButton);
      return container;
    },


    /**
      * Creates the navigation bar back button.
      * Creates the scroll container.
      *
      * @return {qx.ui.Button} The created back button widget
      */
    _createBackButton : function() {
      return new qx.ui.Button(this.backButtonText);
    },


    /**
      * Creates the navigation bar button.
      * Creates the content container.
      *
      * @return {qx.ui.Button} The created button widget
      */
    _createButton : function() {
      return new qx.ui.Button(this.buttonText, this.buttonIcon);
    },


    /**
     * Returns the content container. Add all your widgets to this container.
     *
     * @return {qx.ui.Widget} The content container
     */
    getContent : function()
    {
      return this.__content;
    },


    /**
     * Returns the back button widget.
     *
     * @return {qx.ui.Button} The back button widget
     */
    _getBackButton : function()
    {
      return this.__backButton;
    },


    /**
     * Returns the action button widget.
     *
     * @return {qx.ui.Button} The action button widget
     */
    _getButton : function()
    {
      return this.__actionButton;
    },


    /**
     * Sets the isTablet flag.
     * @param isTablet {Boolean} value of the isTablet flag.
     */
    setIsTablet : function (isTablet) {
      this._isTablet = isTablet;
    },


    /**
     * Returns the isTablet flag.
     * @return {Boolean} the isTablet flag of this page.
     */
    isTablet : function() {
      return this._isTablet;
    },


    /**
     * Returns the scroll container.
     *
     * @return {qx.ui.container.Scroll} The scroll container
     */
    _getScrollContainer : function()
    {
      return this.__scrollContainer;
    },


    /**
     * Adds a widget, below the NavigationBar.
     *
     * @param widget {qx.ui.Widget} The widget to add, after NavigationBar.
     */
    addAfterNavigationBar : function(widget) {
      if (widget && this.__scrollContainer) {
        widget.insertBefore(this.__scrollContainer);
      }
    },


    // property apply
    _applyBackButtonText : function(value)
    {
      if (this.__backButton) {
        this.__backButton.label = value;
      }
    },


    // property apply
    _applyActionButtonText : function(value)
    {
      if (this.__actionButton) {
        this.__actionButton.label = value;
      }
    },


    // property apply
    _applyActionButtonIcon : function(value)
    {
      if (this.__actionButton) {
        this.__actionButton.icon = value;
      }
    },


    // property apply
    _applyShowBackButton : function(value)
    {
      this._showBackButton();
    },


    // property apply
    _applyShowButton : function(value)
    {
      this._showButton();
    },


    // property apply
    _applyContentCssClass : function(value)
    {
      if (this.__content) {
        this.__content.defaultCssClass = value;
      }
    },


    /**
     * Helper method to show the back button.
     */
    _showBackButton : function()
    {
      if (this.__backButton)
      {
        if (this.showBackButton) {
          this.__backButton.show();
        } else {
          this.__backButton.exclude();
        }
      }
    },


    /**
     * Helper method to show the button.
     */
    _showButton : function()
    {
      if (this.__actionButton)
      {
        if (this.showButton) {
          this.__actionButton.show();
        } else {
          this.__actionButton.exclude();
        }
      }
    },


    // overridden
    _initialize : function()
    {
      this.super(qx.ui.page.Page, "_initialize");

      this.__scrollContainer = this._createScrollContainer();
      this.__content = this._createContent();

      if (this.__content) {
        this.__content.layoutPrefs = {flex :1};
        this.__scrollContainer.append(this.__content);
      }
      if (this.__scrollContainer) {
        this.__scrollContainer.layoutPrefs = {flex :1};
        this.append(this.__scrollContainer);
      }
    },


    /**
     * Creates the scroll container.
     *
     * @return {qx.ui.container.Scroll} The created scroll container
     */
    _createScrollContainer : function()
    {
      return new qx.ui.container.Scroll();
    },


    /**
     * Creates the content container.
     *
     * @return {qx.ui.Widget} The created content container
     */
    _createContent : function()
    {
      var content = new qx.ui.Widget();
      content.defaultCssClass = this.contentCssClass;

      if(this._wrapContentByGroup === true) {
        content.addClass("group");
      }

      return content;
    },


    /**
     * Event handler. Called when the tap event occurs on the back button.
     *
     */
    _onBackButtonTap : function()
    {
      this.back();
    },


    /**
     * Event handler. Called when the tap event occurs on the button.
     *
     */
    _onButtonTap : function()
    {
      this.emit("action");
    },


    dispose : function()
    {
      this.super(qx.ui.page.Page, "dispose");
      this.__leftContainer && this.__leftContainer.dispose();
      this.__rightContainer && this.__rightContainer.dispose();
      this.__backButton && this.__backButton.dispose();
      this.__actionButton && this.__actionButton.dispose();
      this.__leftContainer = this.__rightContainer = this.__backButton = this.__actionButton = null;
      this.__title = this.__content = this.__scrollContainer = null;
      this._isTablet = null;
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

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
 * The navigation controller includes already a {@link qx.ui.mobile.navigationbar.NavigationBar}
 * and a {@link qx.ui.mobile.Widget} container with a {@link qx.ui.mobile.layout.Card} layout.
 * All widgets that implement the {@link qx.ui.mobile.container.INavigation}
 * interface can be added to the container. The added widget provide the title
 * widget and the left/right container, which will be automatically merged into
 * navigation bar.
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *   var container = new qx.ui.mobile.container.Navigation();
 *   this.getRoot().add(container);
 *   var page = new qx.ui.mobile.page.NavigationPage();
 *   container.append(page);
 *   page.show();
 * </pre>
 */
qx.Bootstrap.define("qx.ui.mobile.container.Navigation",
{
  extend : qx.ui.mobile.Widget,


  construct : function()
  {
    this.base(qx.ui.mobile.Widget, "constructor");
    this.setLayout(new qx.ui.mobile.layout.VBox());

    this.__navigationBar = this._createNavigationBar();
    if (this.__navigationBar) {
      this._append(this.__navigationBar);
    }

    this.__content = this._createContent();
    this.__content.layoutPrefs = {flex: 1};
    this._append(this.__content);
  },


  properties : {
    // overridden
    defaultCssClass : {
      init : "navigation"
    }
  },


  events :
  {
    /** Fired when the navigation bar gets updated */
    "update" : "qx.ui.mobile.Widget"
  },


  members :
  {
    __navigationBar : null,
    __content : null,


    // overridden
    append : function(widget) {
      if (qx.core.Environment.get("qx.debug")) {
        qx.core.Assert.assertInterface(widget, qx.ui.mobile.container.INavigation);
      }

      this.getContent().append(widget);
    },


    /**
     * Returns the content container. Add all your widgets to this container.
     *
     * @return {qx.ui.mobile.Widget} The content container
     */
    getContent : function() {
      return this.__content;
    },


    /**
     * Returns the navigation bar.
     *
     * @return {qx.ui.mobile.navigationbar.NavigationBar} The navigation bar.
     */
    getNavigationBar : function()
    {
      return this.__navigationBar;
    },


    /**
     * Creates the content container.
     *
     * @return {qx.ui.mobile.Widget} The created content container
     */
    _createContent : function()
    {
      var layout = new qx.ui.mobile.layout.Card();
      layout.on("animationStart", this._onAnimationStart, this);
      layout.on("animationEnd", this._onAnimationEnd, this);

      var content = new qx.ui.mobile.Widget();
      content.on("addedChild", this._onAddedChild, this);
      content.on("removedChild", this._onRemovedChild, this);
      content.setLayout(layout);
      return content;
    },


    /**
    * Handler for the "animationStart" event on the layout.
    */
    _onAnimationStart : function() {
      this.addClass("blocked");
    },


    /**
    * Handler for the "animationEnd" event on the layout.
    */
    _onAnimationEnd : function() {
      this.removeClass("blocked");
    },


    /**
     * Triggers an update if a child becomes visible
     *
     * @param e {Map} changeVisibility event data
     */
    _onChangeChildVisibility : function(e) {
      if (e.value == "visible") {
        this._update(e.target);
      }
    },


    /**
     * Triggers an initial update if a child is added and listens for
     * visibility changes on the child
     *
     * @param child {qx.ui.mobile.Widget} added child
     */
    _onAddedChild : function(child) {
      this._update(child);
      child.on("changeVisibility", this._onChangeChildVisibility, this);
    },


    /**
     * Removes the visibility change listener from a removed child widget
     * and updates the view
     *
     * @param child {qx.ui.mobile.Widget} added child
     */
    _onRemovedChild : function(child) {
      child.off("changeVisibility", this._onChangeChildVisibility, this);
      this._update(child);
    },


    /**
     * Updates the navigation bar depending on the set widget.
     *
     * @param widget {qx.ui.mobile.Widget} The widget that should be merged into the navigation bar.
     */
    _update : function(widget) {
      var navigationBar = this.getNavigationBar();

      this.setStyle("transitionDuration", widget.navigationBarToggleDuration+"s");

      if(widget.navigationBarHidden) {
        this.addClass("hidden");
      } else {
        navigationBar.show();
        this.removeClass("hidden");
      }

      navigationBar.empty();

      if (widget.basename) {
        this.setData("target-page", widget.basename.toLowerCase());
      }

      var leftContainer = widget.getLeftContainer();
      if (leftContainer) {
        navigationBar.append(leftContainer);
      }

      var title = widget.getTitleWidget();
      if (title) {
        title.layoutPrefs = {flex:1};
        navigationBar.append(title);
      }

      var rightContainer = widget.getRightContainer();
      if (rightContainer) {
        navigationBar.append(rightContainer);
      }

      this.emit("update", widget);
    },


    /**
     * Creates the navigation bar.
     *
     * @return {qx.ui.mobile.navigationbar.NavigationBar} The created navigation bar
     */
    _createNavigationBar : function()
    {
      return new qx.ui.mobile.navigationbar.NavigationBar();
    },


    dispose : function()
    {
      this.base(qx.ui.mobile.Widget, "dispose");
      this.getContent().off("addedChild", this._onAddedChild, this)
        .off("removedChild", this._onRemovedChild, this);
      this.getContent().getLayout().off("animationStart",this._onAnimationStart, this);
      this.getContent().getLayout().off("animationEnd",this._onAnimationEnd, this);

      this.__navigationBar.dispose();
      this.__content.dispose();
    }
  }
});

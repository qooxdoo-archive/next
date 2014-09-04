"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2013-2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (wittemann)
     * Daniel Wagner (danielwagner)

************************************************************************ */

/**
 * TODOC
 *
 * @require(qx.module.MatchMedia)
 *
 * @group (Widget)
 */
qx.Bootstrap.define("qx.ui.website.Tabs", {

  extend : qx.ui.mobile.core.Widget,


  construct: function(align, orientation, element) {
    this.base(qx.ui.mobile.core.Widget, "constructor", element);
    this.init();
    if (align) {
      this.align = align;
    }

    if (orientation) {
      this.orientation = orientation;
    }
  },

  properties: {

    // overridden
    defaultCssClass :
    {
      init : "qx-tabs"
    },

    /**
     * A CSS media query string that will be used with a
     * media query listener to dynamically set the widget's
     * orientation. The widget will be rendered in vertical mode unless
     * the query matches.
     */
    mediaQuery: {
      init: null,
      nullable: true,
      check: "String",
      apply: "_applyMediaQuery"
    },

    /**
     * The index of the page that should be opened after initial
     * rendering, or <code>null</code> if no page should be opened.
     */
    preselected: {
      init: 0,
      check: "Number"
    },

    /**
     * Configuration for the alignment of the tab buttons in horizontal
     * mode. This possible values are <code>left</code>,
     * <code>justify</code> and
     * <code>right</code>
     */
    align: {
      init: "left",
      check: function(value) {
        return ["left", "right", "justify"].indexOf(value) !== -1;
      },
      apply: "_render"
    },

    /**
     * Controls the layout of the widget. "horizontal" renders it as a
     * tab bar appropriate for wide screens. "vertical" renders it as a
     * stack of collapsible panes (sometimes called an accordion) that
     * is better suited for narrow screens.
     */
    orientation: {
      init: "horizontal",
      check: function(value) {
        return ["horizontal", "vertical"].indexOf(value) !== -1;
      },
      apply: "_render"
    }
  },


  events: {
    /**
     * Fired when the selected page has changed. The value is
     * the newly selected page's index
     */
    "changeSelected": "Number"
  },


  members: {

    init: function() {
      if (this.mediaQuery) {
        this.orientation = this._initMediaQueryListener(this.mediaQuery);
      }

      this.addClasses([this.defaultCssClass, this.defaultCssClass + "-" + this.orientation]);
      // TODO: Use child widgets (Button)

      var buttons = this.find("." + this.defaultCssClass + "-button");
      buttons._forEachElementWrapped(function(button) {
        var pageSelector = button.getData(this.defaultCssClass + "-page");
        if (!pageSelector) {
          return;
        }
        button.addClass(this.defaultCssClass + "-button")
          .on("tap", this._onTap, this);

        var page = this._getPage(button);
        if (page.length > 0) {
          page.addClass(this.defaultCssClass + "-page");
        }

        this._showPage(null, button);

      }.bind(this));

      var active = buttons.filter("." + this.defaultCssClass + "-button-active");
      var preselected = this.preselected;
      if (active.length === 0 && typeof preselected == "number") {
        active = buttons.eq(preselected).addClass(this.defaultCssClass + "-button-active");
      }

      if (active.length > 0) {
        var activePage = this._getPage(active);
        this._showPage(active, null);
      }

      this.on("keydown", this._onKeyDown, this);

      if (this.orientation === "horizontal") {
        this._applyAlignment();
      }

      return true;
    },


    _render: function() {
      if (this.orientation === "horizontal") {
        return this._renderHorizontal();
      } else if (this.orientation === "vertical") {
        return this._renderVertical();
      }
    },


    _applyMediaQuery : function(value, old) {
      if (old) {
        this.__mediaQueryListener.dispose();
      }
      if (value) {
        this.orientation = this._initMediaQueryListener(value);
      }
    },


    /**
     * Initiates a media query listener for dynamic orientation switching
     * @param mediaQuery {String} CSS media query string
     * @return {String} The appropriate orientation: "horizontal" if the
     * media query matches, "vertical" if it doesn't
     */
    _initMediaQueryListener: function(mediaQuery) {
      var mql = this.__mediaQueryListener;
      if (mql) {
        mql.dispose();
      }

      mql = qxWeb.matchMedia(mediaQuery);
      this.__mediaQueryListener = mql;
      mql.on("change", function(query) {
        this.orientation = mql.matches ? "horizontal" : "vertical";
      }.bind(this));

      if (mql.matches) {
        return "horizontal";
      } else {
        return "vertical";
      }
    },


    /**
     * Render the widget in horizontal mode
     * @return {qx.ui.website.Tabs} The collection for chaining
     */
    _renderHorizontal: function() {
      this.setLayout(new qx.ui.mobile.layout.HBox());
      this.removeClass(this.defaultCssClass + "-vertical")
        .addClasses([this.defaultCssClass + "", this.defaultCssClass + "-horizontal"]);

      var selectedPage;
      this.find("." + this.defaultCssClass + "-button")._forEachElementWrapped(function(button) {
        var page = qxWeb(button.getData(this.defaultCssClass + "-page"));
        var previousParent = page[0].$$qxTabsParent || page.getParents()[0];

        page.appendTo(previousParent);
        page.hide();

        if (button.hasClass(this.defaultCssClass + "-button-active")) {
          selectedPage = page;
        }
      }.bind(this));

      if (!selectedPage) {
        var firstButton = this.find("." + this.defaultCssClass + "-button").eq(0)
          .addClass(this.defaultCssClass + "-button-active");
        selectedPage = this._getPage(firstButton);
      }
      selectedPage.show();

      this._applyAlignment();

      return this;
    },


    /**
     * Render the widget in vertical mode
     * @return {qx.ui.website.Tabs} The collection for chaining
     */
    _renderVertical: function() {
      this.setLayout(new qx.ui.mobile.layout.VBox());
      this.removeClass(this.defaultCssClass + "-horizontal")
      .addClasses([this.defaultCssClass + "", this.defaultCssClass + "-vertical"])
      .find("." + this.defaultCssClass + "-button")
      ._forEachElementWrapped(function(button) {
        var page = this._getPage(button);
        if (page.length === 0) {
          return;
        }

        page[0].$$qxTabsParent = page.getParents()[0];

        page.insertAfter(button);

        if (button.hasClass(this.defaultCssClass + "-button-active")) {
          page.show();
        } else {
          page.hide();
        }

      }.bind(this));

      return this;
    },


    /**
     * Selects a tab button
     *
     * @param index {Integer} index of the button to select
     * @return {qx.ui.website.Tabs} The collection for chaining
     */
    select: function(index) {
      var buttons = this.find("." + this.defaultCssClass + "-button");
      var oldButton = this.find("." + this.defaultCssClass + "-button-active")
        .removeClass(this.defaultCssClass + "-button-active");
      if (this.align == "right") {
        index = buttons.length - 1 - index;
      }
      var newButton = buttons.eq(index).addClass(this.defaultCssClass + "-button-active");
      this._showPage(newButton, oldButton);
      this.emit("changeSelected", index);

      return this;
    },


    /**
     * Initiates the page switch when a button was clicked/tapped
     *
     * @param e {Event} Tap event
     */
    _onTap: function(e) {
      if (!this.enabled) {
        return;
      }
      var orientation = this.orientation;
      var tappedButton = e.currentTarget;
      var oldButton = this.find("." + this.defaultCssClass + "-button-active");
      if (oldButton[0] == tappedButton && orientation == "horizontal") {
        return;
      }

      oldButton.removeClass(this.defaultCssClass + "-button-active");
      if (orientation == "vertical") {
        this._showPage(null, oldButton);
        if (oldButton[0] == tappedButton && orientation == "vertical") {
          return;
        }
      }

      var newButton;
      var buttons = this.find("." + this.defaultCssClass + "-button")
      ._forEachElementWrapped(function(button) {
        if (tappedButton === button[0]) {
          newButton = button;
        }
      });
      this._showPage(newButton, oldButton);
      newButton.addClass(this.defaultCssClass + "-button-active");
      var index = buttons.indexOf(newButton[0]);
      if (this.align == "right") {
        index = buttons.length - 1 - index;
      }
      this.emit("changeSelected", index);
    },


    /**
     * Allows tab selection using the left and right arrow keys
     *
     * @param e {Event} keydown event
     */
    _onKeyDown: function(e) {
      var key = e.getKeyIdentifier();
      if (!(key == "Left" || key == "Right")) {
        return;
      }
      var rightAligned = this.align == "right";
      var buttons = this.find("." + this.defaultCssClass + "-button");
      if (rightAligned) {
        buttons.reverse();
      }
      var active = this.find("." + this.defaultCssClass + "-button-active");
      var next;
      if (key == "Right") {
        if (!rightAligned) {
          next = active.getNext("." + this.defaultCssClass + "-button");
        } else {
          next = active.getPrev("." + this.defaultCssClass + "-button");
        }
      } else {
        if (!rightAligned) {
          next = active.getPrev("." + this.defaultCssClass + "-button");
        } else {
          next = active.getNext("." + this.defaultCssClass + "-button");
        }
      }

      if (next.length > 0) {
        var idx = buttons.indexOf(next);
        this.select(idx);
        next.getChildren("button").focus();
      }
    },


    /**
     * Initiates the page switch if a tab button is selected
     *
     * @param newButton {qxWeb} selected button
     * @param oldButton {qxWeb} previously active button
     */
    _showPage: function(newButton, oldButton) {
      var oldPage = this._getPage(oldButton);
      var newPage = this._getPage(newButton);
      if (this.orientation === "horizontal" && (oldPage[0] == newPage[0])) {
        return;
      }
      oldPage.hide();
      newPage.show();
    },


    /**
     * Returns the tab page associated with the given button
     *
     * @param button {qxWeb} Tab button
     * @return {qxWeb} Tab page
     */
    _getPage: function(button) {
      var pageSelector;
      if (button) {
        pageSelector = button.getData(this.defaultCssClass + "-page");
      }
      return qxWeb(pageSelector);
    },


    /**
     * Apply the CSS classes for the alignment
     *
     * @param tabs {qx.ui.website.Tabs[]} tabs collection
     */
    _applyAlignment: function() {
      var buttons = this.find(".qx-tabs-button");

      if (this.align == "justify") {
        buttons.addClass("qx-flex1");
      } else {
        buttons.removeClass("qx-flex1");
      }

      if (this.align == "right") {
        this.addClass("qx-flex-justify-end");
      } else {
        this.removeClass("qx-flex-justify-end");
      }
    },


    dispose: function() {
      var cssPrefix = this.defaultCssClass;

      this.find("." + this.defaultCssClass + "-button").off("tap", this._onTap, this);
      this.off("keydown", this._onKeyDown, this);

      this.setHtml("").removeClasses([cssPrefix]);
    }

  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

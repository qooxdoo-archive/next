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
 * @require(qx.module.event.Keyboard)
 * @require(qx.module.util.Function)
 *
 * @group (Widget)
 */
qx.Class.define("qx.ui.tabbar.TabBar", {

  extend : qx.ui.Widget,

  /**
   * @attach {qxWeb, toTabBar}
   * @return {qx.ui.tabbar.TabBar} The new tab bar widget.
   */
  construct: function(orientation, align, element) {
    this.super(qx.ui.Widget, "constructor", element);

    // prevent unnecessary _render calls when adding multiple children
    this._render = qxWeb.func.debounce(this._render.bind(this), 300, true);

    if (orientation) {
      this.orientation = orientation;
    } else if (this.mediaQuery) {
      this._initMediaQueryListener(this.mediaQuery);
    }

    if (align) {
      this.align = align;
    }

    if (!orientation && !this.mediaQuery && !align) {
      this.render();
    }

    this.on("keydown", this._onKeyDown, this);
    this.on("addedChild", this.render, this);
    this.on("removedChild", this._onRemovedChild, this);
  },

  properties: {

    // overridden
    defaultCssClass : {
      init : "qx-tabbar"
    },

    /**
     * The currently selected button
     */
    active: {
      nullable: true,
      init: null,
      check: "Element",
      apply: "_applyActive",
      event: true
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
     * Configuration for the alignment of the tab buttons in horizontal
     * mode. This possible values are <code>left</code>,
     * <code>justify</code> and
     * <code>right</code>
     */
    align: {
      init: "justify",
      check: function(value) {
        return ["left", "right", "justify"].indexOf(value) !== -1;
      },
      apply: "render"
    },

    /**
     * Controls the layout of the widget. "horizontal" renders it as a
     * tab bar appropriate for wide screens. "vertical" renders it as a
     * stack of collapsible panes (sometimes called an accordion) that
     * is better suited for narrow screens. Note that a configured
     * mediaQuery will override this setting.
     */
    orientation: {
      init: "horizontal",
      check: function(value) {
        return ["horizontal", "vertical"].indexOf(value) !== -1;
      },
      apply: "render"
    }
  },


  members: {

    __mediaQueryListener: null,


    /**
     * Returns the tab page associated with the given button
     *
     * @param button {qxWeb} Tab button
     * @return {qxWeb} Tab page
     */
    getPage: function(button) {
      if (button) {
        var selector = button.getData("qxConfigPage");
        var page = this.find(selector);
        if (page.length === 0) {
          page = qxWeb(selector);
        }
        return page;
      }
      return null;
    },


    _onRemovedChild : function(child) {
      child.removeClass("selected");
      if (this.orientation === "horizontal" &&
        this.active === child[0]) {
        var buttons = this.find("> .button");
        for (var i=0, l=buttons.length; i<l; i++) {
          if (buttons[i] !== child[0]) {
            this.active = buttons[i];
            return;
          }
        }
      }
    },


    /**
     * Triggers (re-)rendering of the widget
     * @return {qx.ui.TabBar} The widget for chaining
     */
    render: function() {
      if (this.isRendered()) {
        this._render();
        return this;
      }
      else {
        this.once("appear", this._render, this);
        return this;
      }
    },


    /**
     * Renders thr widget
     * @return {qx.ui.TabBar} The widget for chaining
     */
    _render: function() {
      // initialize button widgets in predefined markup
      this.find("> *").forEach(function(el) {
        el = qxWeb(el);
        if (el.is(".button") && !el.hasListener("tap", this._onTap, this)) {
          el.on("tap", this._onTap, this);
        }
      }.bind(this));

      if (this.orientation === "horizontal") {
        return this.renderHorizontal();
      } else if (this.orientation === "vertical") {
        return this.renderVertical();
      }
    },


    /**
     * Render the widget in horizontal mode
     * @return {qx.ui.TabBar} The collection for chaining
     */
    renderHorizontal: function() {
      this.layout = new qx.ui.layout.HBox();

      var selectedButton = null;
      this.find("> .button")._forEachElementWrapped(function(button) {
        var page = this.getPage(button);
        if (page.length == 1 && page.exclude) {
          var previousParent = page[0].$$qxTabPageParent;
          if (previousParent) {
            page.appendTo(previousParent);
          }
          else if(page.getParents() === this) {
            page.insertAfter(this);
          }
          page.exclude();
        }

        if (button.hasClass("selected")) {
          selectedButton = button;
        }
      }.bind(this));

      if (!selectedButton) {
        var firstButton = this.find("> .button").eq(0);
        if (firstButton.length === 1) {
          // eq returns a generic collection
          selectedButton = qxWeb(firstButton[0]);
        }
      }
      this.active = null;
      this.active = selectedButton[0];

      this._applyAlignment(this.align);

      return this;
    },


    /**
     * Render the widget in vertical mode
     * @return {qx.ui.TabBar} The collection for chaining
     */
    renderVertical: function() {
      this.layout = new qx.ui.layout.VBox();
      var buttons = this.find("> .button")
      ._forEachElementWrapped(function(button) {
        var page = this.getPage(button);
        if (page.length == 1) {
          // save the page's parent element for re-rendering in horizontal mode
          var parent = page.getParents()[0];
          if (parent !== this[0]) {
            page[0].$$qxTabPageParent = page.getParents()[0];
          }

          page.insertAfter(button);
        }

        if (button.hasClass("selected")) {
          this.active = button[0];
        } else {
          var page = this.getPage(button);
          if (page.length > 0 && page.exclude) {
            page.exclude();
          }
        }

        // first button will sometimes be rendered incorrectly in Chrome
        if (button[0].clientHeight === 0) {
          this.removeClass("qx-vbox");
          setTimeout(function() {
            this.addClass("qx-vbox");
          }.bind(this), 0);
        }

      }.bind(this));

      return this;
    },


    /**
     * Shows the newly selected page and hides any previously selected page.
     * Also adds/removes the 'active' class from the corresponding buttons
     * @param value {qxWeb?} The newly selected page
     * @param old {qxWeb?} The previously selected page
     */
    _applyActive : function(value, old) {
      this.find("> .button")._forEachElementWrapped(function(button) {
        if (value === button[0]) {
          button.addClass("selected");
          this.getPage(button).show();
        } else {
          button.removeClass("selected");
          var page = this.getPage(button);
          // empty collections do not have an hide method
          if (page && page.exclude) {
            page.exclude();
          }
        }
      }.bind(this));
    },


    /**
     * Creates a change listener for the configured media query string
     * @param value {String} New media query string
     * @param old {String} Previous media query string
     */
    _applyMediaQuery : function(value, old) {
      if (old) {
        this.__mediaQueryListener.dispose();
      }
      if (value) {
        this._initMediaQueryListener(value);
      }
    },


    /**
     * Apply the CSS classes for the alignment (horizontal mode only)
     * @param value {String} New alignment value
     * @param old {String} Previous alignment value
     */
    _applyAlignment: function(value, old) {
      var buttons = this.find("> .button");

      if (value == "justify") {
        buttons.addClass("qx-flex1");
      } else {
        buttons.removeClass("qx-flex1");
      }

      if (value == "right") {
        this.addClass("qx-flex-justify-end");
      } else {
        this.removeClass("qx-flex-justify-end");
      }
    },


    /**
     * Initializes a media query listener for dynamic orientation switching
     * @param mediaQuery {String} CSS media query string
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

      this.orientation =  mql.matches ? "horizontal" : "vertical";
    },


    /**
     * Initiates the page switch when a button was clicked or tapped
     *
     * @param e {Event} Tap event
     */
    _onTap: function(e) {
      if (!this.enabled) {
        return;
      }
      var tappedButton = e.currentTarget;
      var oldButton = this.find("> ." + "selected");

      if (oldButton[0] == tappedButton && this.orientation == "vertical") {
        this.active = null;
        return;
      }

      this.active = tappedButton;
    },


    /**
     * Allows tab selection using the arrow keys
     *
     * @param e {Event} keydown event
     */
    _onKeyDown: function(e) {
      var next;
      var buttons = this.find("> .button");
      var index = buttons.indexOf(e.target);
      if (index === -1) {
        return;
      }
      var key = e.getKeyIdentifier();

      if (key == "Right" || key == "Down") {
        next = buttons.eq(index + 1);

      } else if (key == "Left" || key == "Up") {
        next = buttons.eq(index - 1);
      }

      if (next && next.length > 0) {
        this.active = next;
        next.focus();
      }
    },


    dispose: function() {
      this.find("> .button").off("tap", this._onTap, this)
        .off("keydown", this._onKeyDown, this)
        .off("addedChild", this.render, this)
        .off("removedChild", this._onRemovedChild, this)
        .mediaQuery = null;
    }

  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

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
 * Mixin for the {@link Scroll} container. Used when the variant
 * <code>qx.mobile.nativescroll</code> is set to "off". Uses the iScroll script to simulate
 * the CSS position:fixed style. Position fixed is not available in iOS and
 * Android < 2.2.
 *
 * @ignore(iScroll)
 * @require(qx.module.Io)
 * @asset(qx/mobile/js/iscroll*.js)
 */
qx.Mixin.define("qx.ui.mobile.container.MIScroll",
{

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __scroll : null,


    /**
     * Initializes this mixin. Should be called from the including class'
     * constructor.
     */
    initMIScroll : function()
    {
      this.__initScroll();
      this.__registerEventListeners();
    },


    /**
     * Mixin method. Creates the scroll element.
     *
     * @return {Element} The scroll element
     */
    _createScrollElement : function() {
      return qxWeb.create("<div class='iscroll'>")[0];
    },


    /**
     * Mixin method. Returns the scroll content element..
     *
     * @return {qxWeb} The scroll content element
     */
    _getScrollContentElement : function() {
      return this.getChildren().eq(0);
    },



    /**
    * Returns the current scroll position
    * @return {Array} an array with the <code>[scrollLeft,scrollTop]</code>.
    */
    _getPosition : function() {
      return [this._currentX, this._currentY];
    },


    /**
    * Returns the scrolling height of the inner container.
    * @return {Number} the scrolling height.
    */
    _getScrollHeight : function() {
      if(!this[0]) {
        return 0;
      }
      return this._getScrollContentElement()[0].scrollHeight - this[0].offsetHeight;
    },


    /**
    * Returns the scrolling width of the inner container.
    * @return {Number} the scrolling width.
    */
    _getScrollWidth : function() {
      if(!this[0]) {
        return 0;
      }
      return this._getScrollContentElement()[0].scrollWidth - this[0].offsetWidth;
    },


    /**
    * Scrolls the wrapper contents to the x/y coordinates in a given period.
    *
    * @param x {Integer} X coordinate to scroll to.
    * @param y {Integer} Y coordinate to scroll to.
    * @param time {Integer} Time slice in which scrolling should
    *              be done.
    */
    _scrollTo : function(x, y, time)
    {
      if (this.__scroll && this._isScrollable()) {
        // Normalize scrollable values
        var lowerLimitY = this._getScrollContentElement().getHeight() - this[0].offsetHeight;
        if (y > lowerLimitY) {
          y = lowerLimitY;
        }

        var lowerLimitX = this._getScrollContentElement().getWidth() - this[0].offsetWidth;
        if (x > lowerLimitX) {
          x = lowerLimitX;
        }

        if(this.__scroll) {
          this.__scroll.scrollTo(-x, -y, time);
        } else {
          // Case when iScroll is not loaded yet, but user tries
          // to set a different scroll position. Position is applied on "__onScrollLoaded".
          this._setCurrentY(x);
          this._setCurrentY(y);
        }
      }
    },


    /**
     * Loads and inits the iScroll instance.
     *
     * @ignore(iScroll)
     */
    __initScroll : function()
    {
      if (!window.iScroll)
      {
        var resource;
        if (qx.core.Environment.get("qx.debug"))
        {
          resource = "qx/mobile/js/iscroll.js";
        } else {
          resource = "qx/mobile/js/iscroll.min.js";
        }
        var path = qx.util.ResourceManager.getInstance().toUri(resource);
        if (qx.core.Environment.get("qx.debug")) {
          path += "?" + new Date().getTime();
        }
        qxWeb.io.script()
          .on("load", this.__onScrollLoaded, this)
          .open("GET", path)
          .send();
      } else {
        this.once("appear", function() {
          this._setScroll(this.__createScrollInstance());
        }, this);
      }
    },


    /**
     * Creates the iScroll instance.
     *
     * @return {Object} The iScroll instance
     * @ignore(iScroll)
     */
    __createScrollInstance : function()
    {
      var defaultScrollProperties = this._getDefaultScrollProperties();
      var customScrollProperties = {};

      if(this._scrollProperties != null) {
        customScrollProperties = this._scrollProperties;
      }

      var iScrollProperties = qx.lang.Object.mergeWith(defaultScrollProperties, customScrollProperties, true);

      return new iScroll(this[0], iScrollProperties);
    },


    /**
     * Returns a map with default iScroll properties for the iScroll instance.
     * @return {Object} Map with default iScroll properties
     */
    _getDefaultScrollProperties : function() {
      var container = this;

      return {
        hideScrollbar: true,
        fadeScrollbar: true,
        hScrollbar : false,
        scrollbarClass: "scrollbar",
        useTransform: true,
        onScrollEnd : function() {
          // Alert interested parties that we scrolled to end of page.
          if (qx.core.Environment.get("qx.mobile.nativescroll") == false)
          {
            container._setCurrentX(-this.x);
            container._setCurrentY(-this.y);
            container.emit("scrollEnd");
          }
        },
        onScrollMove : function() {
          // Alert interested parties that we scrolled to end of page.
          if (qx.core.Environment.get("qx.mobile.nativescroll") == false)
          {
            container._setCurrentX(-this.x);
            container._setCurrentY(-this.y);
          }
        },
        onBeforeScrollStart : function(e) {
          // QOOXDOO ENHANCEMENT: Do not prevent default for form elements
          /* When updating iScroll, please check out that doubleTapTimer is not active (commented out)
           * in code. DoubleTapTimer creates a fake click event. Android 4.1. and newer
           * is able to fire native events, which  create side effect with the fake event of iScroll. */
          var target = e.target;
          while (target.nodeType != 1) {
            target = target.parentNode;
          }

          if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA' && target.tagName != 'LABEL') {
            // Remove focus from input elements, so that the keyboard and the mouse cursor is hidden
            var elements = [];
            var inputElements = qx.lang.Array.cast(document.getElementsByTagName("input"), Array);
            var textAreaElements = qx.lang.Array.cast(document.getElementsByTagName("textarea"), Array);
            elements = elements.concat(inputElements);
            elements = elements.concat(textAreaElements);

            for (var i=0, length = elements.length; i < length; i++) {
              elements[i].blur();
            }

            e.preventDefault();
          }
        }
      };
    },


    /**
     * Stops event propagation
     * @param e {Event} Event
     */
    _stopPropagation : function(e) {
      e.stopPropagation();
    },


    /**
     * Registers all needed event listener.
     */
    __registerEventListeners : function()
    {
      qxWeb(window).on("orientationchange", this._refresh, this)
        .on("resize", this._refresh, this);
      this.on("touchmove", this._stopPropagation)
        .on("appear", this._refresh, this); // TODO refresh on content size change (was domUpdated event)
    },


    /**
     * Unregisters all needed event listener.
     */
    __unregisterEventListeners : function()
    {
      qxWeb(window).off("orientationchange", this._refresh, this)
        .off("resize", this._refresh, this);
      this.off("touchmove", this._stopPropagation)
        .off("appear", this._refresh, this);
    },


    /**
     * Load callback. Called when the iScroll script is loaded.
     *
     * @param request {qx.bom.request.Script} The Script request object
     */
    __onScrollLoaded : function(request)
    {
      if (request.status < 400)
      {
        // if(!this.isDisposed()) { TODO
          this._setScroll(this.__createScrollInstance());
          this._scrollTo(this._currentX, this._currentY);
        // }
      } else {
        if (qx.core.Environment.get("qx.debug"))
        {
          this.error("Could not load iScroll");
        }
      }
    },


    /**
     * Setter for the scroll instance.
     *
     * @param scroll {Object} iScroll instance.
     */
    _setScroll : function(scroll)
    {
      this.__scroll = scroll;
    },


    /**
     * Delegation method for iScroll. Disabled the iScroll objects.
     * Prevents any further scrolling of this container.
     */
    disable : function() {
      if(this.__scroll) {
        this.__scroll.disable();
      }
    },


    /**
     * Delegation method for iScroll. Enables the iScroll object.
     */
    enable : function() {
      if(this.__scroll) {
        this.__scroll.enable();
      }
    },


    /**
     * Calls the refresh function of iScroll. Needed to recalculate the
     * scrolling container.
     */
    _refresh : function()
    {
      if (this.__scroll) {
        this.__scroll.refresh();
      }
    },


    disposeMIScroll : function() {
      this.__unregisterEventListeners();

      // Cleanup iScroll
      if (this.__scroll) {
        this.__scroll.dispose();
      }
      this.__scroll = null;
    }
  }
});

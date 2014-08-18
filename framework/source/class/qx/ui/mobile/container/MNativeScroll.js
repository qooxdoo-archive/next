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
 * @require(qx.module.Animation)
 * @require(qx.module.Manipulating)
 *
 * Mixin for the {@link Scroll} container. Used when the variant
 * <code>qx.mobile.nativescroll</code> is set to "on".
 */
qx.Mixin.define("qx.ui.mobile.container.MNativeScroll",
{

  members :
  {
    _snapPoints : null,
    _onTrack : null,
    _snapTimeoutId : null,


    /**
     * Initializes this mixin. Should be called from the including class'
     * constructor.
     */
     initMNativeScroll : function() {
      this.addClass("native");

      this._snapPoints = [];

      this.once("appear", this._onAppear, this);
      this.on("trackstart", this._onTrackStart, this);
      this.on("trackend", this._onTrackEnd, this);

      this.on("scroll", this._onScroll, this);

      if (qx.core.Environment.get("os.name") == "ios") {
        this.on("touchmove", this._onTouchMove, this);
      }
    },


    /**
    * Event handler for <code>appear</code> event.
    */
    _onAppear: function() {
      this._calcSnapPoints();
    },


    /**
    * Event handler for <code>touchmove</code> event.
    * Needed for preventing iOS page bounce.
    * @param evt {qx.event.type.Touch} touchmove event.
    */
    _onTouchMove : function(evt) {
      // If scroll container is scrollable
      if (this._isScrollableY()) {
        evt.stopPropagation();
      } else {
        evt.preventDefault();
      }
    },


    /**
     * Event handler for <code>trackstart</code> events.
     */
    _onTrackStart: function(evt) {
      this._onTrack = true;

      if (qx.core.Environment.get("os.name") == "ios") {
        this._preventPageBounce();
      }
    },


    /**
     * Prevents the iOS page bounce if scroll container reaches the upper or lower vertical scroll limit.
     */
    _preventPageBounce: function() {
      // If scroll container is scrollable
      if (this._isScrollableY()) {
        var element = this[0];
        var scrollTop = element.scrollTop;
        var maxScrollTop = element.scrollHeight - this.getLayoutParent().getContentElement().offsetHeight;
        if (scrollTop === 0) {
          element.scrollTop = 1;
        } else if (scrollTop == maxScrollTop) {
          element.scrollTop = maxScrollTop - 1;
        }
      }
    },


    /**
    * Event handler for <code>trackend</code> events.
    * @param evt {qx.event.type.Track} the <code>track</code> event
    */
    _onTrackEnd: function(evt) {
      this._onTrack = false;

      if(this._snapTimeoutId) {
        clearTimeout(this._snapTimeoutId);
      }
      this._snapTimeoutId = setTimeout(function() {
        this._snap();
      }.bind(this), 100);

      evt.stopPropagation();
    },


    /**
    * Event handler for <code>scroll</code> events.
    */
    _onScroll : function() {
      var scrollLeft = this[0].scrollLeft;
      var scrollTop = this[0].scrollTop;

      this._setCurrentX(scrollLeft);
      this._setCurrentY(scrollTop);

      if(this._snapTimeoutId) {
        clearTimeout(this._snapTimeoutId);
      }
      this._snapTimeoutId = setTimeout(function() {
        if(!this._onTrack) {
          this._snap();
        }
      }.bind(this), 100);
    },


    /**
    * Calculates the snapping points for the x/y axis.
    */
    _calcSnapPoints: function() {
      if (this._scrollProperties) {
        var snap = this._scrollProperties.snap;
        if (snap) {
          this._snapPoints = [];
          var snapTargets = this[0].querySelectorAll(snap);
          for (var i = 0; i < snapTargets.length; i++) {
            var snapPoint = this._getContentElement.getRelativeDistance(snapTargets[i], "scroll", "scroll");
            this._snapPoints.push(snapPoint);
          }
        }
      }
    },


    /**
    * Determines the next snap points for the passed current position.
    * @param current {Integer} description
    * @param snapProperty {String} "top" or "left"
    * @return {Integer} the determined snap point.
    */
    _determineSnapPoint: function(current, snapProperty) {
      for (var i = 0; i < this._snapPoints.length; i++) {
        var snapPoint = this._snapPoints[i];
        if (current <= -snapPoint[snapProperty]) {
          if (i > 0) {
            var previousSnapPoint = this._snapPoints[i - 1];
            var previousSnapDiff = Math.abs(current + previousSnapPoint[snapProperty]);
            var nextSnapDiff = Math.abs(current + snapPoint[snapProperty]);
            if (previousSnapDiff < nextSnapDiff) {
              return -previousSnapPoint[snapProperty];
            } else {
              return -snapPoint[snapProperty];
            }
          } else {
            return -snapPoint[snapProperty];
          }
        }
      }
      return current;
    },


    /**
    * Snaps the scrolling area to the nearest snap point.
    */
    _snap : function() {
      this.fireEvent("scrollEnd");
      var element = this[0];

      if(element.scrollTop < 1 || element.scrollTop > this._getScrollHeight()) {
        return;
      }
      var current = this._getPosition();
      var nextX = this._determineSnapPoint(current[0], "left");
      var nextY = this._determineSnapPoint(current[1], "top");

      if (nextX != current[0] || nextY != current[1]) {
        this._scrollTo(nextX, nextY, 300);
      }
    },


    /**
     * Refreshes the scroll container. Recalculates the snap points.
     */
    _refresh : function() {
      this._calcSnapPoints();
    },


    /**
     * Mixin method. Creates the scroll element.
     *
     * @return {Element} The scroll element
     */
    _createScrollElement: function() {
      return null;
    },


    /**
     * Returns the current scroll position
     * @return {Array} an array with <code>[scrollLeft,scrollTop]</code>.
     */
    _getPosition: function() {
      return [this[0].scrollLeft, this[0].scrollTop];
    },


    /**
     * Mixin method. Returns the scroll content element.
     *
     * @return {qxWeb} The scroll content element
     */
    _getScrollContentElement: function() {
      return null;
    },


    /**
    * Returns the scrolling height of the inner container.
    * @return {Number} the scrolling height.
    */
    _getScrollHeight : function() {
      if(!this[0]) {
        return 0;
      }

      return this[0].scrollHeight - this[0].offsetHeight;
    },


    /**
    * Returns the scrolling width of the inner container.
    * @return {Number} the scrolling width.
    */
    _getScrollWidth : function() {
      if(!this[0]) {
        return 0;
      }

      return this[0].scrollWidth - this[0].offsetWidth;
    },


    /**
     * Scrolls the wrapper contents to the x/y coordinates in a given period.
     *
     * @param x {Integer} X coordinate to scroll to.
     * @param y {Integer} Y coordinate to scroll to.
     * @param time {Integer} is always <code>0</code> for this mixin.
     */
    _scrollTo: function(x, y, time) {
      var element = this[0];
      if(!time) {
        element.scrollLeft = x;
        element.scrollTop = y;
        return;
      }

      var startY = element.scrollTop;
      var startX = element.scrollLeft;

      if (element) {
        this.animate({
          "duration": time,
          "keyFrames": {
            0: {
              "scrollTop": startY,
              "scrollLeft": startX
            },
            100: {
              "scrollTop": y,
              "scrollLeft": x
            }
          },
          "keep": 100,
          "timing": "ease-out"
        });
      }
    },


    disposeMNativeScroll : function() {
      this.off("scroll", this._onScroll, this)
        .off("touchmove", this._onTouchMove, this)
        .off("appear", this._onAppear, this)
        .off("trackstart", this._onTrackStart, this)
        .off("trackend", this._onTrackEnd, this);
    }
  }
});

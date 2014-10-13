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
     * Tobias Oberrauch (toberrauch)

************************************************************************ */

/**
 * Creates a Carousel widget.
 * A carousel is a widget which can switch between several sub pages {@link  qx.ui.mobile.Widget}.
 * A page switch is triggered by a swipe to left, for next page, or a swipe to right for
 * previous page.
 *
 * A carousel shows by default a pagination indicator at the bottom of the carousel.
 * This pagination indicator can be hidden by property <code>showPagination</code>.
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *
 *  var carousel = new qx.ui.mobile.container.Carousel();
 *  var carouselPage1 = new qx.ui.mobile.Widget();
 *  var carouselPage2 = new qx.ui.mobile.Widget();
 *
 *  carouselPage1.append(new qx.ui.mobile.basic.Label("This is a carousel. Please swipe left."));
 *  carouselPage2.append(new qx.ui.mobile.basic.Label("Now swipe right."));
 *
 *  carousel.append(carouselPage1);
 *  carousel.append(carouselPage2);
 * </pre>
 *
 *
 * @require(qx.module.Transform)
 */
qx.Class.define("qx.ui.mobile.container.Carousel",
{
  extend : qx.ui.mobile.Widget,
  include : qx.ui.mobile.core.MResize,


  /**
  * @param transitionDuration {Integer ? 0.4} transition duration on carouselPage change in seconds.
  */
  construct : function(transitionDuration, element)
  {
    this.base(qx.ui.mobile.Widget, "constructor", element);
    if (transitionDuration) {
      this.transitionDuration = transitionDuration;
    }

    this.__snapPointsX = [];
    this.__onMoveOffset = [0, 0];
    this.__lastOffset = [0, 0];
    this.__boundsX = [0, 0];
    this.__pages = [];
    this.__paginationLabels = [];

    this.on("touchmove", this._onTouchmove, this);
    this.on("appear", this._onContainerUpdate, this);

    var pagination = this.__pagination = new qx.ui.mobile.Widget();
    pagination.layout = new qx.ui.mobile.layout.HBox();
    pagination.transformUnit = "px";
    pagination.addClass("qx-carousel-pagination");

    this.layout = new qx.ui.mobile.layout.VBox();

    if (q('.qx-carousel-scroller').length > 0)  {
      var carouselScroller = this.__carouselScroller = new qx.ui.mobile.Widget(q('.qx-carousel-scroller')[0]);
    } else {
      var carouselScroller = this.__carouselScroller = new qx.ui.mobile.Widget();
      carouselScroller.addClass("qx-carousel-scroller");
    }
    carouselScroller.layout = new qx.ui.mobile.layout.HBox();
    carouselScroller.transformUnit = "px";

    q('.qx-carousel-scroller .qx-carousel-page').forEach(function (page) {
      this.append(new qx.ui.mobile.Widget(page));
    }.bind(this));

    carouselScroller.on("pointerdown", this._onPointerDown, this);
    carouselScroller.on("pointerup", this._onPointerUp, this);
    carouselScroller.on("track", this._onTrack, this);
    carouselScroller.on("swipe", this._onSwipe, this);

    this.__carouselScroller.on("transitionend",this._onScrollerTransitionEnd, this);
    qxWeb(window).on("orientationchange", this._onContainerUpdate, this)
      .on("resize", this._onContainerUpdate, this);
    this.on("scroll", this._onNativeScroll, this);

    carouselScroller.layoutPrefs = {flex: 1};
    this._append(carouselScroller);
    pagination.layoutPrefs = {flex: 1};
    this._append(pagination);
  },


  properties : {
    // overridden
    defaultCssClass : {
      init : "qx-carousel"
    },


    /** Property for setting visibility of pagination indicator */
    showPagination : {
      check : "Boolean",
      init : true,
      apply : "_applyShowPagination"
    },


    /** Defines whether the carousel should scroll back to first or last page
     * when the start/end of carousel pages is reached  */
    scrollLoop : {
      check : "Boolean",
      init : true
    },


    /**
     * Defines the height of the carousel. If value is equal to <code>null</code>
     * the height is set to <code>100%</code>.
     */
    height : {
      check : "Number",
      init : null,
      nullable : true,
      apply : "_updateCarouselLayout"
    },


    /**
     * The current visible page index.
     */
    currentIndex : {
      check : "Number",
      init : 0,
      apply : "_scrollToPage",
      event : true
    },


    /**
     * Duration of the carousel page transition.
     */
    transitionDuration : {
      check : "Number",
      init : 0.5
    }
  },


  members :
  {
    __carouselScroller : null,
    __carouselScrollerWidth : null,
    __carouselWidth : null,
    __paginationLabels : null,
    __pagination : null,
    __snapPointsX : null,
    __onMoveOffset : null,
    __lastOffset : null,
    __boundsX : null,
    __pages : null,
    __showTransition : null,
    __isPageScrollTarget : null,
    __deltaX : null,
    __deltaY : null,


    // overridden
    /**
     * Adds a page to the end of the carousel.
     * @param page {qx.ui.mobile.Widget} The composite which should be added as a page to the end of carousel.
     */
    append : function(page) {
      this.base(qx.ui.mobile.Widget, "append", page);
      if (qx.core.Environment.get("qx.debug")) {
        if (!page instanceof qx.ui.mobile.Widget) {
          throw new Error("Page is expected to be an instance of qx.ui.mobile.Widget.");
        }
      }

      page.addClass("qx-carousel-page");

      this.__pages.push(page);
      page.layoutPrefs = {flex: 1};
      this.__carouselScroller.append(page);

      var paginationLabel = this._createPaginationLabel();
      this.__paginationLabels.push(paginationLabel);
      this.__pagination.append(paginationLabel);

      this._setTransitionDuration(0);
      this._onContainerUpdate();
    },


    /**
     * Removes a carousel page from carousel identified by its index.
     * @param pageIndex {Integer} The page index which should be removed from carousel.
     * @return {qx.ui.mobile.Widget} the page which was removed from carousel.
     */
    removePageByIndex : function(pageIndex) {
      if (this.__pages && this.__pages.length > pageIndex) {
        if (pageIndex <= this.currentIndex && this.currentIndex !== 0) {
          this.currentIndex = this.currentIndex - 1;
        }

        var targetPage = this.__pages[pageIndex];
        var paginationLabel = this.__paginationLabels[pageIndex];

        targetPage.remove();
        paginationLabel.remove();

        paginationLabel.off("tap", this._onPaginationLabelTap, {
          self: this,
          targetIndex: pageIndex - 1
        });
        paginationLabel.dispose();

        this.__pages.splice(pageIndex, 1);
        this.__paginationLabels.splice(pageIndex, 1);

        this._onContainerUpdate();

        return targetPage;
      }
    },


    // overridden
    removeAll : function() {
      var removedPages = [];

      if (this.__pages) {
        for (var i = this.__pages.length - 1; i >= 0; i--) {
          removedPages.push(this.removePageByIndex(i));
        }
      }
      return removedPages;
    },


    /**
     * Scrolls the carousel to next page.
     */
    nextPage : function() {
      if (this.currentIndex == this.__pages.length - 1) {
        if (this.scrollLoop && this.__pages.length > 1) {
          this._doScrollLoop();
        }
      } else {
        this.currentIndex = this.currentIndex + 1;
      }
    },


    /**
     * Scrolls the carousel to previous page.
     */
    previousPage : function() {
      if (this.currentIndex === 0) {
        if (this.scrollLoop && this.__pages.length > 1) {
          this._doScrollLoop();
        }
      } else {
        this.currentIndex = this.currentIndex - 1;
      }
    },


    /**
    * Returns the current page count of this carousel.
    * @return {Integer} the current page count
    */
    getPageCount : function() {
      if(this.__pages) {
        return this.__pages.length;
      }

      return 0;
    },


    /**
     * Scrolls the carousel to the page with the given pageIndex.
     * @param pageIndex {Integer} the target page index, which should be visible
     * @param showTransition {Boolean ? true} flag if a transition should be shown or not
     */
    _scrollToPage : function(pageIndex, showTransition) {
      if (pageIndex >= this.__pages.length || pageIndex < 0) {
        return;
      }

      this._updatePagination(pageIndex);

      var snapPoint = -pageIndex * this.__carouselWidth;
      this._updateScrollerPosition(snapPoint);

      // Update lastOffset, because snapPoint has changed.
      this.__lastOffset[0] = snapPoint;
    },


    /**
     * Manages the the scroll loop. First fades out carousel scroller >>
     * waits till fading is done >> scrolls to pageIndex >> waits till scrolling is done
     * >> fades scroller in.
     */
    _doScrollLoop : function() {
      this._setTransitionDuration(this.transitionDuration);
      setTimeout(function() {
        this._setScrollersOpacity(0);
      }.bind(this), 0);
    },


    /**
    * Event handler for <code>transitionEnd</code> event on carouselScroller.
    */
    _onScrollerTransitionEnd : function() {
      this.__carouselScroller.getStyle("opacity");
      var opacity = this.__carouselScroller.getStyle("opacity");
      if (opacity === 0) {
        var pageIndex = null;
        if (this.currentIndex == this.__pages.length - 1) {
          pageIndex = 0;
        }

        if (this.currentIndex === 0) {
          pageIndex = this.__pages.length - 1;
        }
        this._setTransitionDuration(0);
        this.currentIndex = pageIndex;

        setTimeout(function() {
          this._setTransitionDuration(this.transitionDuration);
          this._setScrollersOpacity(1);
        }.bind(this), 0);
      }
    },


    /**
     * Factory method for a paginationLabel.
     * @return {qx.ui.mobile.Widget} the created pagination label.
     */
    _createPaginationLabel : function() {
      var paginationIndex = this.__pages.length;
      var paginationLabel = new qx.ui.mobile.Widget();
      var paginationLabelText = new qx.ui.mobile.basic.Label("" + paginationIndex);
      paginationLabel.append(paginationLabelText);

      paginationLabel.addClass("qx-carousel-pagination-label");
      paginationLabel.on("tap", this._onPaginationLabelTap, {
        self: this,
        targetIndex: paginationIndex - 1
      });
      return paginationLabel;
    },


    /**
     * Changes the opacity of the carouselScroller element.
     * @param opacity {Integer} the target value of the opacity.
     */
    _setScrollersOpacity : function(opacity) {
      if (this.__carouselScroller.length > 0) {
        this.__carouselScroller.setStyle("opacity", opacity);
      }
    },


    /**
     * Called when showPagination property is changed.
     * Manages <code>show()</code> and <code>hide()</code> of pagination container.
     */
    _applyShowPagination : function(value, old) {
      if (value) {
        if (this.__pages.length > 1) {
          this.__pagination.show();
        }
      } else {
        this.__pagination.hide();
      }
    },


    /**
     * Handles a tap on paginationLabel.
     */
    _onPaginationLabelTap : function() {
      this.self.currentIndex = this.targetIndex;
    },


    /**
     * Updates the layout of the carousel the carousel scroller and its pages.
     */
    _updateCarouselLayout : function() {
      if (!this[0]) {
        return;
      }
      this.__carouselWidth = this.getWidth();

      if (this.height !== null) {
        this.setStyle("height", this.height / 16 + "rem");
      } else {
        this.setStyle("height", "100%");
      }

      this.__carouselScroller.setStyle("width", this.__pages.length * this.__carouselWidth + "px");

      for (var i = 0; i < this.__pages.length; i++) {
        this.__pages[i].setStyles({
          width:  this.__carouselWidth + "px",
          height: this.getHeight() + "px"
        });
      }

      if (this.__pages.length == 1) {
        this.__pagination.exclude();
      } else {
        if (this.showPagination) {
          this.__pagination.show();
        }
      }

      this._refreshScrollerPosition();
    },


    /**
     * Synchronizes the positions of the scroller to the current shown page index.
     */
    _refreshScrollerPosition : function() {
      this.__carouselScrollerWidth = this.__carouselScroller.getWidth();
      this._scrollToPage(this.currentIndex);
    },


    /**
     * Prevents the touchmove event's default behavior
     *
     * @param e {Event} touchmove event
     */
    _onTouchmove: function(e) {
      e.preventDefault();
    },


    /**
     * Handles window resize, device orientatonChange or page appear events.
     */
    _onContainerUpdate : function() {
      this._setTransitionDuration(0);
      this._updateCarouselLayout();
      this._refreshScrollerPosition();
    },


    /**
     * Returns the current horizontal position of the carousel scrolling container.
     * @return {Number} the horizontal position
     */
    _getScrollerOffset : function() {
      var transformMatrix = this.__carouselScroller.getStyle("transform");
      var transformValueArray = transformMatrix.substr(7, transformMatrix.length - 8).split(', ');

      var i = 4;
      // Check if MSCSSMatrix is used.
      if('MSCSSMatrix' in window) {
        i = transformValueArray.length - 4;
      }

      return Math.floor(parseInt(transformValueArray[i], 10));
    },


    /**
     * Event handler for <code>pointerdown</code> events.
     * @param evt {qx.event.type.Pointer} The pointer event.
     */
    _onPointerDown : function(evt) {
      if(!evt.isPrimary) {
        return;
      }

      this.__lastOffset[0] = this._getScrollerOffset();
      this.__isPageScrollTarget = null;

      this.__boundsX[0] = -this.__carouselScrollerWidth + this.__carouselWidth;

      this._updateScrollerPosition(this.__lastOffset[0]);
    },


    /**
     * Event handler for <code>track</code> events.
     * @param evt {qx.event.type.Track} The track event.
     */
    _onTrack : function(evt) {
      if(!evt._original.isPrimary) { // TODO: add 'isPrimary' property to track event?
        return;
      }

      this._setTransitionDuration(0);

      this.__deltaX = evt._original.delta.x; // TODO: add 'delta' property to track event?
      this.__deltaY = evt._original.delta.y;

      if (this.__isPageScrollTarget === null) {
        this.__isPageScrollTarget = (evt._original.delta.axis == "y");
      }

      if (!this.__isPageScrollTarget) {
        this.__onMoveOffset[0] = Math.floor(this.__deltaX + this.__lastOffset[0]);

        if (this.__onMoveOffset[0] >= this.__boundsX[1]) {
          this.__onMoveOffset[0] = this.__boundsX[1];
        }

        if (this.__onMoveOffset[0] <= this.__boundsX[0]) {
          this.__onMoveOffset[0] = this.__boundsX[0];
        }
        this._updateScrollerPosition(this.__onMoveOffset[0]);

        evt.preventDefault();
      }
    },


    /**
    * Handler for <code>pointerup</code> event on carousel scroller.
    * @param evt {qx.event.type.Pointer} the pointerup event.
    */
    _onPointerUp : function(evt) {
      if(!evt.isPrimary) {
        return;
      }

      this._setTransitionDuration(this.transitionDuration);
      this._refreshScrollerPosition();
    },


    /**
     * Handler for swipe event on carousel scroller.
     * @param evt {qx.event.type.Swipe} The swipe event.
     */
    _onSwipe : function(evt) {
      if(!evt._original.isPrimary) { // TODO
        return;
      }

      if (evt.swipe.duration < 750 && Math.abs(evt.swipe.distance) > 50) {
        var duration = this._calculateTransitionDuration(this.__deltaX, evt.swipe.duration);
        duration = Math.min(this.transitionDuration, duration);

        this._setTransitionDuration(duration);
        if (evt.swipe.direction == "left") {
          this.nextPage();
        } else if (evt.swipe.direction == "right") {
          this.previousPage();
        }
      } else {
        this._snapCarouselPage();
      }
    },


    /**
    * Calculates the duration the transition will need till the next carousel
    * snap point is reached.
    * @param deltaX {Integer} the distance on axis between pointerdown and pointerup.
    * @param duration {Number} the swipe duration.
    * @return {Number} the transition duration.
    */
    _calculateTransitionDuration : function(deltaX, duration) {
      var distanceX = this.__carouselWidth - Math.abs(deltaX);
      var transitionDuration = (distanceX / Math.abs(deltaX)) * duration;
      return (transitionDuration / 1000);
    },


    /**
     * Handles the native scroll event on the carousel container.
     * This is needed for preventing "scrollIntoView" method.
     *
     * @param evt {qx.event.type.Native} the native scroll event.
     */
    _onNativeScroll : function(evt) {
      var nativeEvent = evt.getNativeEvent();
      nativeEvent.srcElement.scrollLeft = 0;
      nativeEvent.srcElement.scrollTop = 0;
    },

    /**
    * Applies the CSS property "transitionDuration" to the carouselScroller.
    * @param value {Number} the target value of the transitionDuration.
    */
    _setTransitionDuration : function(value) {
      this.__carouselScroller.setStyle("transitionDuration", value+"s");
    },

    /**
     * Snaps carouselScroller offset to a carouselPage.
     * It determines which carouselPage is the nearest and moves
     * carouselScrollers offset till nearest carouselPage's left border is aligned to carousel's left border.
     */
    _snapCarouselPage : function() {
      this._setTransitionDuration(this.transitionDuration);

      var leastDistance = 10000;
      var nearestPageIndex = 0;

      // Determine nearest snapPoint.
      for (var i = 0; i < this.__pages.length; i++) {
        var snapPoint = -i * this.__carouselWidth;
        var distance = this.__onMoveOffset[0] - snapPoint;
        if (Math.abs(distance) < leastDistance) {
          leastDistance = Math.abs(distance);
          nearestPageIndex = i;
        }
      }

      if (this.currentIndex == nearestPageIndex) {
        this._refreshScrollerPosition();
      } else {
        this.currentIndex = nearestPageIndex;
      }
    },


    /**
     * Updates the pagination indicator of this carousel.
     * Removes the active state from from paginationLabel with oldActiveIndex,
     * Adds actives state to paginationLabel new ActiveIndex.
     * @param newActiveIndex {Integer} Index of paginationLabel which should have active state
     */
    _updatePagination : function(newActiveIndex) {
      for (var i = 0; i < this.__paginationLabels.length; i++) {
        this.__paginationLabels[i].removeClass("active");
      }

      var newActiveLabel = this.__paginationLabels[newActiveIndex];
      if (newActiveLabel && newActiveLabel[0]) {
        newActiveLabel.addClass("active");
      }

      if (this.__paginationLabels.length) {
        var paginationStyle = getComputedStyle(this.__pagination[0]);
        var paginationWidth = parseFloat(paginationStyle.width,10);

        if(isNaN(paginationWidth)) {
          return;
        }

        var paginationLabelWidth = paginationWidth/this.__paginationLabels.length;

        var left = null;
        var translate = (this.__carouselWidth / 2) - newActiveIndex * paginationLabelWidth - paginationLabelWidth / 2;

        if (paginationWidth < this.__carouselWidth) {
          left = this.__carouselWidth / 2 - paginationWidth / 2 + "px";
          translate = 0;
        }

        this.__pagination.setStyle("left", left);

        this.__pagination.translate([translate + "px", 0, 0]);
      }
    },


    /**
     * Assign new position of carousel scrolling container.
     * @param x {Integer} scroller's x position.
     */
    _updateScrollerPosition : function(x) {
      if(isNaN(x) || this.__carouselScroller.length === 0) {
        return;
      }
      this.__carouselScroller.translate([x + "px", 0, 0]);
    },


    /**
     * Remove all listeners.
     */
    _removeListeners : function() {
      if (this.__carouselScroller) {
        this.__carouselScroller.off("pointerdown", this._onPointerDown, this);
        this.__carouselScroller.off("track", this._onTrack, this);
        this.__carouselScroller.off("pointerup", this._onPointerUp, this);
        this.__carouselScroller.off("swipe", this._onSwipe, this);
        this.__carouselScroller.off("touchmove", this._onTouchmove, this);
      }

      this.off("appear", this._onContainerUpdate, this);

      qxWeb(window).off("orientationchange", this._onContainerUpdate, this)
        .off("resize", this._onContainerUpdate, this);
      this.off("scroll", this._onNativeScroll, this);
    },

    dispose : function() {
      this._removeListeners();

      this.__carouselScroller.dispose();
      this.__pagination.dispose();

      qx.util.DisposeUtil.disposeContainer(this);
      qx.util.DisposeUtil.disposeArray(this,"__paginationLabels");

      this.__pages = this.__paginationLabels = this.__snapPointsX = this.__onMoveOffset = this.__lastOffset = this.__boundsX = this.__isPageScrollTarget = null;
      this.base(qx.ui.mobile.Widget, "dispose");
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

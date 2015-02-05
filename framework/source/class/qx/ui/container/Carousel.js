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
     * Romeo Kenfack Tsakem (rkenfack)

************************************************************************ */

/**
 * Creates a Carousel widget.
 * A carousel is a widget which can switch between several sub pages {@link  qx.ui.Widget}.
 * A page switch is triggered by a swipe to left, for next page, or a swipe to right for
 * previous page.
 *
 * A carousel shows by default a pagination indicator at the bottom of the carousel.
 * This pagination indicator can be hidden by property <code>showPagination</code>.
 *
 * @require(qx.module.Transform)
 * @require(qx.module.event.TrackHandler)
 * @group(Widget)
 */
qx.Class.define("qx.ui.container.Carousel",
{
  extend : qx.ui.Widget,
  include : qx.ui.core.MResize,


  /**
   * @param transitionDuration {Integer?null} transition duration on carouselPage change in seconds.
   * @param element {Element?null} The new carousel widget.
   * @attach {qxWeb, toCarousel}
   * @return {qx.ui.container.Carousel} The new carousel widget.
   */
  construct : function(transitionDuration, element) {
    this.super(qx.ui.Widget, "construct", element);

    if (transitionDuration) {
      this.transitionDuration = transitionDuration;
    }

    this.__onMoveOffset = [0, 0];
    this.__lastOffset = [0, 0];
    this.__boundsX = [0, 0];
    this.__pages = [];
    this.__paginationLabels = [];

    this.on("touchmove", this._onTouchmove, this);
    this.on("appear", this._onContainerUpdate, this);

    var pagination = this.__pagination = new qx.ui.Widget();
    pagination.layout = new qx.ui.layout.HBox();
    pagination.addClass("qx-carousel-pagination");

    this.layout = new qx.ui.layout.VBox();

    if (qxWeb('.qx-carousel-scroller', this[0]).length > 0)  {
      var carouselScroller = this.__carouselScroller = new qx.ui.Widget(qxWeb('.qx-carousel-scroller', this[0])[0]);
    } else {
      var carouselScroller = this.__carouselScroller = new qx.ui.Widget();
      carouselScroller.addClass("qx-carousel-scroller");
    }
    carouselScroller.layout = new qx.ui.layout.HBox();
    carouselScroller.on("removedChild", this._onRemovedChild, this);

    var pages = qxWeb('.qx-carousel-scroller .qx-carousel-page', this[0]);

    if(pages.length > 0) {
      pages.forEach(function(page) {
        this.__pages.push(new qx.ui.Widget(page));
      }.bind(this));
      this._initPages();
    }

    carouselScroller.on("pointerdown", this._onPointerDown, this);
    carouselScroller.on("pointerup", this._onPointerUp, this);
    carouselScroller.on("pointerout", this._onPointerUp, this);
    carouselScroller.on("track", this._onTrack, this);

    this.__carouselScroller.on(qx.core.Environment.get("css.transition")["end-event"],
      this._onScrollerTransitionEnd, this);
    qxWeb(window).on("orientationchange", this._onContainerUpdate, this)
      .on("resize", this._onContainerUpdate, this);
    this.on("scroll", this._onNativeScroll, this);

    carouselScroller.layoutPrefs = {flex: 1};
    this._append(carouselScroller);
    pagination.layoutPrefs = {flex: 1};
    this._append(pagination);

    this.on("addedChild", this._onAddedChild, this);
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


    /**
     * Defines the height of the carousel. If value is equal to <code>null</code>
     * the height is set to/ <code>100%</code>.
     */
    height : {
      check : "Number",
      init : null,
      nullable : true,
      apply : "_updateCarouselLayout"
    },


    /**
     * The currently visible page.
     */
    active : {
      check : "Element",
      apply : "_applyActive",
      event : true,
      nullable : true
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
    __onMoveOffset : null,
    __lastOffset : null,
    __boundsX : null,
    __pages : null,
    __isPageScrollTarget : null,
    __deltaX : null,
    __deltaY : null,
    __direction : null,
    __centerChanged : false,
    __steps : null,
    __moved : false,
    __touchStarted : false,
    __leftBufferSize : null,
    __rightBufferSize : null,
    __leftSwipeCount : 0,
    __rightSwipeCount : 0,
    __locked : false,
    __duration : 0,
    __currentIndex : 0,
    __lastCompletedIndex : 0,


    /**
     * Adds a page to the end of the carousel.
     * @param page {qx.ui.Widget} The composite which should be added as a page to the end of carousel.
     */
    _onAddedChild : function(page) {
      // initial selection
      if (!this.active) {
        this.active = page[0];
      }

      if (qx.core.Environment.get("qx.debug")) {
        if (!page instanceof qx.ui.Widget) {
          throw new Error("Page is expected to be an instance of qx.ui.Widget.");
        }
      }

      page.addClass("qx-carousel-page");

      var pageCount = this.__pages.length;

      this.__pages.push(page);

      page.layoutPrefs = {flex: 1};

      if(pageCount < 2) {
        this.__carouselScroller.append(page);
      } else {
        page.insertBefore(this.__pages[0]);
        if( pageCount % 2 != 0) {
         this._orderPages("left", 1);
        }
      }

      var paginationLabel = this._createPaginationLabel();
      this.__paginationLabels.push(paginationLabel);
      this.__pagination.append(paginationLabel);

      this._setTransitionDuration(0);

      this._onContainerUpdate();
    },


    /**
    * Initializes carousel pages if they are already present in the DOM
    */
    _initPages : function() {
      var pages = this.__pages.slice(0);
      var l = this.__pages.length - 1;
      var rightLength = Math.ceil(l/2);

      var left = pages.splice(rightLength + 1).reverse();

      left.forEach(function(page, index){
        page.insertBefore( this.__carouselScroller.getChildren().getFirst());
      }.bind(this));

      this.__pages.forEach(function(page, index) {
        var paginationLabel = this._createPaginationLabel(index);
        this.__paginationLabels.push(paginationLabel);
        this.__pagination.append(paginationLabel);
      }.bind(this));

      this._setTransitionDuration(0);

      this._onContainerUpdate();
    },


    /**
     * Removes a carousel page from carousel identified by its index.
     * @param pageIndex {Integer} The page index which should be removed from carousel.
     * @return {qx.ui.Widget} the page which was removed from carousel.
     */
    _onRemovedChild : function(child) {
      if (!this.__pages || this.__pages.length <= pageIndex) {
        return;
      }

      var pageIndex = this.__pages.map(function(item) {return item[0];}).indexOf(child[0]);

      var center = this.__pages[this.__currentIndex];

      var centeredIndex = this.__carouselScroller.getChildren().indexOf(center);
      var indexToRemove =child.priorPosition;

      var targetPage = this.__pages[pageIndex];
      var paginationLabel = this.__paginationLabels[pageIndex];

      targetPage.remove();
      paginationLabel.remove();

      var pages = qxWeb(".qx-carousel-page", this[0]);
      var last = pages.getLast();
      var first = pages.getFirst();

      paginationLabel.off("tap", paginationLabel.tapHandler);
      paginationLabel.empty();

      this.__pages.splice(pageIndex, 1);
      this.__paginationLabels.splice(pageIndex, 1);

      if(indexToRemove < centeredIndex) {
        if(this.__pages.length%2 !== 0) {
          last.insertBefore(first);
        }
      }

      if(indexToRemove > centeredIndex) {
        if(this.__pages.length%2 === 0) {
          first.insertAfter(last);
        }
      }

      this.__direction = indexToRemove < centeredIndex ? "left" : "right";
      this.__steps = Math.abs(indexToRemove - centeredIndex);

      this.__carouselScroller.setStyle("width", this.__pages.length * this.__carouselWidth + "px");

      if(pageIndex == this.__currentIndex) {
        if(this.__currentIndex >= this.__pages.length) {

          if(this.__pages.length%2 == 1) {
            last.insertBefore(first);
          }

          if((this.__currentIndex >= this.__pages.length) && (this.__pages.length > 0)) {
            this.__currentIndex = this.__pages.length - 1;
            this.active = this.__pages[this.__currentIndex];
          } else if(this.__pages.length === 0) {
            this.__currentIndex = null;
            this.active = null;
          }
          this._scrollToPage(this.__currentIndex)
        } else {
          if(this.__pages.length % 2 === 0) {
            first.insertAfter(last);
          } else {
            this.active = this.__pages[this.__currentIndex][0];
          }
        }
      } else {
        this.__currentIndex = this.__pages.indexOf(center);
        this.active = this.__pages[this.__currentIndex][0];
      }

      this.__direction = null;

      this._onContainerUpdate();

      return targetPage;
    },


    /**
     * Scrolls the carousel to next page.
     */
    nextPage : function() {
      this._setTransitionDuration(this.transitionDuration);
      this.__currentIndex = (this.__currentIndex + 1) % this.__pages.length;
      this.active = this.__pages[this.__currentIndex][0];
    },


    /**
     * Scrolls the carousel to previous page.
     */
    previousPage : function() {
      this._setTransitionDuration(this.transitionDuration);
      this.__currentIndex = (this.__currentIndex - 1 + this.__pages.length) % this.__pages.length;
      this.active = this.__pages[this.__currentIndex][0];
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


    _applyActive: function(value, old) {
      var pageElements = this.__pages.map(function(item) {return item[0];});
      var index = pageElements.indexOf(value);
      var oldIndex = pageElements.indexOf(old);
      this._scrollToPage(index, oldIndex);
    },


    /**
     * Scrolls the carousel to the page with the given pageIndex.
     * @param pageIndex {Integer} the target page index, which should be visible
     * @param oldIndex {Boolean} The index of the old centered page
     */
    _scrollToPage : function(pageIndex, oldIndex) {

      if (pageIndex >= this.__pages.length || pageIndex < 0) {
        return;
      }

      this._updatePagination(pageIndex);

      this._centerPage(this.__pages[pageIndex]);

      this.__centerChanged = (oldIndex !== undefined) && (oldIndex != this.__currentIndex);

      /* If the currentIndex has been changed externally
      * detect detect the direction and calculate the steps
      */
      if((oldIndex !== undefined) && (this.__direction === null)) {
        var buffer = this.__carouselScroller.getChildren();
        var prevPos = buffer.indexOf(this.__pages[oldIndex]);
        var nextPos = buffer.indexOf(this.__pages[pageIndex]);
        this.__steps = Math.abs(prevPos - nextPos);
        this.__direction = nextPos > prevPos ? "left" : "right";
        this._orderPages(this.__direction, this.__steps);
      } else if(this.__duration === 0 && this.__direction !== null) {
        this._orderPages(this.__direction, this.__steps);
      }

      if (this.__duration === 0) {
        this.__direction = null;
        this.__steps = null;
      }

    },


    /**
    * Position a specific page into the viewport
    * @param page {qx.ui.Widget} The page which should be centered.
    */
    _centerPage : function(page) {

      if (!page) {
        return;
      }
      // get the center of the clipper element
      var clipperCenter = this.__carouselWidth/2;

      var snapPoint = - page[0].offsetLeft + clipperCenter - page.getWidth()/2;

      this._updateScrollerPosition(snapPoint);

      // Update lastOffset, because snapPoint has changed.
      this.__lastOffset[0] = snapPoint;
    },


    /**
    * Reorganizes the carousel pages after a page switch
    * @param direction {String} The direction in which the carousel has been moved
    * @parem steps {Integer} The number of pages moved
    */
    _orderPages : function (direction, steps) {

      var items = qxWeb(".qx-carousel-page", this.__carouselScroller[0]);

      if(direction == "left") {
        qxWeb(items.slice(0, steps)).appendTo(this.__carouselScroller);
      } else {
        qxWeb(items.slice(items.length - steps)).insertBefore(items.eq(0));
      }

      this._setTransitionDuration(0);

      this._centerPage(this.__pages[this.__currentIndex]);
    },


    /**
    * Event handler for <code>transitionEnd</code> event on carouselScroller.
    */
    _onScrollerTransitionEnd : function() {

      if (this.__lastCompletedIndex != this.__currentIndex) {
        var items = qxWeb(".qx-carousel-page", this.__carouselScroller[0]);
        var currentIndex = items.indexOf(this.__pages[this.__currentIndex][0]);
        var prevIndex = items.indexOf(this.__pages[this.__lastCompletedIndex][0]);
        var dir = currentIndex > prevIndex ? "left" : "right";
        var steps = Math.abs(currentIndex - prevIndex);
        this._orderPages(dir, steps);
      }

      this.__lastCompletedIndex = this.__currentIndex;

      this._setTransitionDuration(0);

      // Reset flags
      this.__moved = false;
      this.__centerChanged = false;
      this.__direction = null;
      this.__steps = null;
      this.__leftSwipeCount = 0;
      this.__rightSwipeCount = 0;
      this.__locked = false;
    },


    /**
     * Factory method for a paginationLabel.
     * @return {qx.ui.Widget} the created pagination label.
     * @param pageIndex {Integer} The page index
     */
    _createPaginationLabel : function(pageIndex) {
      var paginationIndex = this.__pages.length;

      var paginationLabel = qxWeb.create('<div class="qx-carousel-pagination-label"></div>');
      var paginationLabelText = qxWeb.create('<div class="label">' + paginationIndex + '</div>');

      if (typeof pageIndex != "undefined") {
        paginationIndex = pageIndex + 1;
      }

      paginationLabel.append(paginationLabelText);

      paginationLabel.tapHandler = this._onPaginationLabelTap.bind(this, paginationIndex - 1);
      paginationLabel.on("tap", paginationLabel.tapHandler);

      return paginationLabel;
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
    _onPaginationLabelTap : function(targetIndex, e) {
      if (targetIndex != this.__currentIndex) {
        this._setTransitionDuration(0);
        this.__direction = null;
        this.__lastCompletedIndex = targetIndex;
        this.__currentIndex = targetIndex;
        this.active = this.__pages[this.__currentIndex][0];
      }
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
      this._scrollToPage(this.__currentIndex, this.__currentIndex);
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
      var l = this.__pages.length - 1;
      this.__leftBufferSize = Math.floor(l/2);
      this.__rightBufferSize = l -  this.__leftBufferSize;
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

       if(this.__locked) {
        return;
      }

      this._setTransitionDuration(0);

      this.__moved = false;
      this.__touchStarted = true;
      this.__direction = null;

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

      if(!evt._original.isPrimary || !this.__touchStarted) { // TODO: add 'isPrimary' property to track event?
        return;
      }

      this._setTransitionDuration(0);

      this.__deltaX = evt.delta.x;
      this.__deltaY = evt.delta.y;

      if (this.__isPageScrollTarget === null) {
        this.__isPageScrollTarget = (evt.delta.axis == "y");
      }

      if (!this.__isPageScrollTarget) {

        this.__direction = this.__deltaX > 0 ? "right" : "left";

        this.__onMoveOffset[0] = Math.floor(this.__deltaX + this.__lastOffset[0]);

        if (this.__onMoveOffset[0] >= this.__boundsX[1]) {
          this.__onMoveOffset[0] = this.__boundsX[1];
        }

        if (this.__onMoveOffset[0] <= this.__boundsX[0]) {
          this.__onMoveOffset[0] = this.__boundsX[0];
        }

        this.__moved = true;

        this._updateScrollerPosition(this.__onMoveOffset[0]);

        evt.preventDefault();
      }

    },


    /**
    * Handler for <code>pointerup</code> event on carousel scroller.
    * @param evt {qx.event.type.Pointer} the pointerup event.
    */
    _onPointerUp : function(evt) {

      if(!evt.isPrimary || this.__locked) {
        return;
      }

      var relatedTarget = qxWeb(evt.relatedTarget);
      if((evt.type == "pointerout")) {
        if(((relatedTarget.length > 0) && relatedTarget.isChildOf(this.__carouselScroller)) || this.__direction === null || !this.__moved) {
          return;
        }
      }

      if((this.__direction === null) || (Math.abs(this.__deltaX) < 50)) {
        this._setTransitionDuration(this.transitionDuration);
        this._refreshScrollerPosition();
        return;
      }

      if(this.__direction == "left") {
        this.__leftSwipeCount ++;
        if(this.__rightSwipeCount > 0) {
          this.__rightSwipeCount --;
        }
      } else {
        this.__rightSwipeCount ++;
        if(this.__leftSwipeCount > 0) {
          this.__leftSwipeCount --;
        }
      }

      // Max possible swipes without dom update reached. First rearrange the dom before release the lock
      if((this.__leftSwipeCount == this.__rightBufferSize) || (this.__rightSwipeCount == this.__leftBufferSize)) {
        this.__locked = true;

      }

      this.__touchStarted = false;
      this.__moved = false;

      if(this.__direction == "left") {
        this.nextPage();
      } else if(this.__direction == "right") {
        this.previousPage();
      }

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
      this.__duration = value;
      this.__carouselScroller.setStyle("transitionDuration", value+"s");
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
        this.__carouselScroller.off("pointerout", this._onPointerUp, this);
        this.__carouselScroller.off("touchmove", this._onTouchmove, this);
        this.__carouselScroller.off("removedChild", this._onRemovedChild, this);
      }

      this.off("appear", this._onContainerUpdate, this)
        .off("addedChild", this._onAddedChild, this)
        .off("scroll", this._onNativeScroll, this);

      qxWeb(window).off("orientationchange", this._onContainerUpdate, this).off("resize", this._onContainerUpdate, this);
    },


    dispose : function() {
      this._removeListeners();

      this.__carouselScroller.dispose();
      this.__pagination.dispose();

      qx.util.DisposeUtil.disposeContainer(this);
      this.__paginationLabels.forEach(function(el) {
        qxWeb(el).allOff();
      });

      this.__pages = this.__paginationLabels = this.__onMoveOffset = this.__lastOffset = this.__boundsX = this.__isPageScrollTarget = null;
      this.super(qx.ui.Widget, "dispose");
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});
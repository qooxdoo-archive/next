"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014-2015 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

************************************************************************ */

/**
 * TODOC
 * @require(qx.module.Transform)
 */
qx.Class.define("qx.ui.FlexCarousel",
{
  extend : qx.ui.Widget,

  properties: {
    defaultCssClass : {
      init : "flexcarousel"
    },

    active: {
      check: "qxWeb",
      apply: "_update",
      event: true
    },

    showPagination: {
      check: "Boolean",
      init: true,
      apply: "_applyShowPagination"
    },

    pageSwitchDuration: {
      check: "Number",
      init: 500
    }
  },

  construct: function(element) {
    this.super(qx.ui.Widget, "construct", element);
    var outerContainer = new qx.ui.container.Scroll({
        snap: ".qx-hbox > .flexcarousel-page"
      })
      .addClass("flexcarousel-container")
      .on("scroll", this._onScroll, this)
      .appendTo(this);

    this.__pageContainer = (new qx.ui.Widget())
      .addClass("qx-hbox")
      .on("removedChild", this._onRemovedChild, this)
      .appendTo(outerContainer);

    this.__paginationLabels = [];
    this.__pagination = new qx.ui.Widget()
      .set({
        layout: new qx.ui.layout.HBox(),
        layoutPrefs: {flex: 1}
      })
      .addClass("flexcarousel-pagination")
      .appendTo(this);

    this.on("addedChild", this._onAddedChild, this);
  },

  members: {
    __pageContainer: null,
    __paginationLabels: null,


    nextPage: function() {
      this._scrollContainer(this.getWidth() * 2, this.pageSwitchDuration);
      if (this.pageSwitchDuration < 50) {
        // Chrome won't fire a scroll event for low duration values
        this._onScroll();
      }
    },


    previousPage: function() {
      this._scrollContainer(0, this.pageSwitchDuration);
      if (this.pageSwitchDuration < 50) {
        // Chrome won't fire a scroll event for low duration values
        this._onScroll();
      }
    },


    _scrollContainer: function(left, time) {
      var container = this.find(".flexcarousel-container");
      container
        .off("scroll", this._onScroll, this)
        .once("animationEnd", function() {
          container.on("scroll", this._onScroll, this);
        }, this)
        .scrollTo(left, 0, time);
    },


    _onAddedChild: function(child) {
      child.addClasses(["qx-flex1", "flexcarousel-page"])
        .appendTo(this.__pageContainer)
        .setStyle("width", this.getWidth() + "px");

      var paginationLabel = this._createPaginationLabel();
      this.__paginationLabels.push(paginationLabel);
      this.__pagination.append(paginationLabel);

      this._updateWidth();

      if (!this.active) {
        this.active = child;
      } else {
        this._update();
      }

      if (this.__pageContainer.find(".flexcarousel-page").length === 3) {
        this.find(".flexcarousel-container")[0].scrollLeft = this.getWidth();
      }
    },


    _onRemovedChild: function(child) {
      this._updateWidth();

      if (this.active[0] == child[0]) {
        this.active = this.__pageContainer.find(".flexcarousel-page").eq(0);
      } else {
        this._update();
      }

      this.__paginationLabels.splice(child.priorPosition, 1)[0].remove();
      for (var i = 0; i < this.__paginationLabels.length; i++) {
        this.__paginationLabels[i].getChildren(".label").setHtml((i + 1) + "");
      }
    },


    _update: function(value, old) {
      var direction = this._updateOrder();
      var container = this.find(".flexcarousel-container");
      if (container[0].scrollLeft !== this.getWidth()) {
        if (direction == "right") {
          this._scrollContainer(container[0].scrollLeft - container.getWidth(), 0);
        } else if (direction == "left") {
          this._scrollContainer(container[0].scrollLeft + container.getWidth(), 0);
        }
      }

      this._updatePagination();
    },


    _updateOrder: function() {
      var scrollDirection;
      var pages = this.__pageContainer.find(".flexcarousel-page");
      var orderBefore = parseInt(this.active.getStyle("order"), 10);
      if (orderBefore > 0) {
        scrollDirection = "right";
      } else if (orderBefore < 0) {
        scrollDirection = "left";
      }
      if (orderBefore === 0 && pages.length == 3) {
        scrollDirection = "right";
      }

      var activeIndex = pages.indexOf(this.active);
      this.active.setStyle("order", 0);
      var order = 1;

      for (var i = activeIndex + 1; i < pages.length; i++) {
        if (activeIndex === 0 && i == pages.length - 1) {
          order = -1;
        }
        qxWeb(pages[i]).setStyle("order", order++);
      }

      for (var i = 0; i < activeIndex; i++) {
        // move the last page to the left of the active page
        if (i == activeIndex - 1) {
          order = -1;
        }
        qxWeb(pages[i]).setStyle("order", order++);
      }

      return scrollDirection;
    },


    _updateWidth: function() {
      var containerWidth = this.getWidth() * this.__pageContainer.find(".flexcarousel-page").length;
      this.__pageContainer.setStyle("width", containerWidth + "px");
    },


    _onScroll: function(e) {
      var container = this.find(".flexcarousel-container");
      var width = this.getWidth();
      var pages = this.__pageContainer.find(".flexcarousel-page");
      if (container[0].scrollLeft < (width - width / 2)) {
        var prev = this.active.getPrev();
        if (prev.length == 0) {
          prev = pages.eq(pages.length - 1);
        }
        this.active = prev;
      } else if (container[0].scrollLeft > (width + width / 2)) {
        var next = this.active.getNext();
        if (next.length == 0) {
          next = pages.eq(0);
        }
        this.active = next;
      }
    },


    _applyShowPagination : function(value, old) {
      if (value) {
        if (this.__pageContainer.find(".flexcarousel-page").length > 1) {
          this.__pagination.show();
        }
      } else {
        this.__pagination.hide();
      }
    },


    /**
     * Factory method for a paginationLabel.
     * @return {qx.ui.Widget} the created pagination label.
     * @param pageIndex {Integer} The page index
     */
    _createPaginationLabel : function(pageIndex) {
      var paginationIndex = this.__pageContainer.find(".flexcarousel-page").length;

      var paginationLabel = qxWeb.create('<div class="flexcarousel-pagination-label"></div>')
        .on("tap", this._onPaginationLabelTap, this)
        .append(qxWeb.create('<div class="label">' + paginationIndex + '</div>'));

      return paginationLabel;
    },


    _onPaginationLabelTap: function(e) {
      this.__paginationLabels.forEach(function(label, idx) {
        if (label[0] === e.currentTarget ) {
          this.active = this.__pageContainer.find(".flexcarousel-page").eq(idx);
        }
      }.bind(this));
    },


    /**
     * Updates the pagination indicator of this carousel.
     * Adds the 'active' CSS class to the currently visible page's
     * pagination button.
     */
    _updatePagination : function() {
      this.find(".flexcarousel-pagination-label").removeClass("active");
      var pages = this.__pageContainer.find(".flexcarousel-page");
      this.__paginationLabels[pages.indexOf(this.active)].addClass("active");
    }
  }
});
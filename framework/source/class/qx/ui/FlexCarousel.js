qx.Class.define("qx.ui.FlexCarousel",
{
  extend : qx.ui.Widget,

  properties: {
    defaultCssClass : {
      init : "flexcarousel"
    },

    active: {
      check: "qxWeb",
      apply: "_update"
    }
  },

  construct: function(element) {
    this.super(qx.ui.Widget, "construct", element);
    var outerContainer = new qx.ui.container.Scroll()
      .addClass("flexcarousel-container")
      .on("scroll", this._onScroll, this)
      .appendTo(this);

    this.__pageContainer = (new qx.ui.Widget())
      .addClass("qx-hbox")
      .on("removedChild", this._onRemovedChild, this)
      .appendTo(outerContainer);

    this.on("addedChild", this._onAddedChild, this);
  },

  members: {
    __pageContainer: null,


    nextPage: function() {
      var container = this.find(".flexcarousel-container");
      container[0].scrollLeft = this.getWidth() * 2;
    },


    previousPage: function() {
      var container = this.find(".flexcarousel-container");
      container[0].scrollLeft = 0;
    },


    _onAddedChild: function(child) {
      child.addClasses(["qx-flex1", "flexcarousel-page"])
        .appendTo(this.__pageContainer)
        .setStyle("width", this.getWidth() + "px");

      this._updateWidth();
      if (!this.active) {
        this.active = child;
      } else {
        this._update();
      }
    },


    _onRemovedChild: function(child) {
      this._updateWidth();

      if (this.active[0] == child[0]) {
        this.active = this.__pageContainer.find(".flexcarousel-page").eq(0);
      } else {
        this._update();
      }
    },


    _update: function(value, old) {
      var direction = this._updateOrder();
      var container = this.find(".flexcarousel-container");
      if (direction == "right") {
        container[0].scrollLeft -= container.getWidth();
      } else if (direction == "left") {
        container[0].scrollLeft += container.getWidth();
      }
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
    }
  }
});
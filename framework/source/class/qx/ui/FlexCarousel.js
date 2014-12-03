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
    var outerContainer = qxWeb.create("<div>")
      .addClass("flexcarousel-container")
      .on("scroll", this._onScroll, this)
      // .once("pointerdown", function(e) {
      //   this._scroll(qxWeb(e.currentTarget));
      // }, this)
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
      var pages = this.__pageContainer.find(".flexcarousel-page");
      this.active = pages.eq((pages.indexOf(this.active) + 1) % pages.length);
    },


    _onAddedChild: function(child) {
      child.addClasses(["qx-flex1", "flexcarousel-page"])
        .appendTo(this.__pageContainer)
        .setStyle("width", this.getWidth() + "px");

      this._updateWidth();
      if (!this.active) {
        this.active = child;
      }
      this._update();
    },


    _onRemovedChild: function(child) {
      if (this.active[0] == child[0]) {
        this.active = this.__pageContainer.find(".flexcarousel-page").eq(0);
      }
      this._update();
    },


    _update: function() {
      this._updateOrder();
      var container = this.find(".flexcarousel-container");
      container.setScrollLeft(container.getWidth());
    },


    _updateOrder: function() {
      var pages = this.__pageContainer.find(".flexcarousel-page");
      var activeIndex = pages.indexOf(this.active);

      this.active.setStyle("order", 0);
      var order = 1;

      for (var i = activeIndex + 1; i < pages.length; i++) {
        if (activeIndex == 0 && i == pages.length - 1) {
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
    },


    _updateWidth: function() {
      var containerWidth = this.getWidth() * this.__pageContainer.find(".flexcarousel-page").length;
      this.__pageContainer.setStyles({
        width: containerWidth + "px"
        // ,
        // paddingLeft: "10px",
        // paddingRight: "10px"
      });
      this.__pageContainer.find(".flexcarousel-page")[0].scrollLeft = 10;
    },


    _onScroll: function(ev) {
      var container = qxWeb(ev.target);
      this._scroll(container);
    },


    _scroll: function(container) {
      console.log("scroll")
      var containerWidth = container.getWidth();
      var shiftPage;
      var pages = container.find(".flexcarousel-page");

      if (container[0].scrollLeft < containerWidth) {
        for (var i = pages.length - 1; i >= 0; i--) {
          var page = qxWeb(pages[i]);
          var computedOrder = parseInt(page.getStyle("order"), 10) + 1;
          page.setStyle("order", computedOrder);
          if (!shiftPage || parseInt(shiftPage.getStyle("order"), 10) < computedOrder) {
            shiftPage = page;
          }
        }

        var newOrder = parseInt(shiftPage.getStyle("order"), 10) - 1;
        shiftPage.setStyle("order", newOrder);
        container[0].scrollLeft += containerWidth;
      }
    }
  }
});
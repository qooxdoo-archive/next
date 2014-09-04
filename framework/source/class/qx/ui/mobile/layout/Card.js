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
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/**
 * A card layout.
 *
 * The card layout lays out widgets in a stack. Call show to display a widget.
 * Only the widget which show method is called is displayed. All other widgets are excluded.
 *
 *
 * *Example*
 *
 * Here is a little example of how to use the Card layout.
 *
 * <pre class="javascript">
 * var layout = new qx.ui.mobile.layout.Card());
 * var container = new qx.ui.mobile.core.Widget();
 * container.setLayout(layout);
 *
 * var label1 = new qx.ui.mobile.basic.Label("1");
 * container.append(label1);
 * var label2 = new qx.ui.mobile.basic.Label("2");
 * container.append(label2);
 *
 * label2.show();
 * </pre>
 *
 * @require(qx.module.Animation)
 * @require(qx.module.AnimationFrame)
 */
qx.Bootstrap.define("qx.ui.mobile.layout.Card",
{
  extend : qx.ui.mobile.layout.Abstract,


  construct : function()
  {
    this.base(qx.ui.mobile.layout.Abstract, "constructor");

    this.__cardAnimation = new qx.ui.mobile.layout.CardAnimation();
  },


  events :
  {
    /** 
     * Fired when the animation of a page transition starts 
     * [fromWidget, toWidget]
     */
    animationStart : "Array",

    /** 
     * Fired when the animation of a page transition ends
     * [fromWidget, toWidget]
     */
    animationEnd : "Array"
  },


  properties :
  {
    /** The default animation to use for page transition */
    defaultAnimation :
    {
      check : "String",
      init : "slide"
    },


    /** Flag which indicates, whether animation is needed, or widgets should only swap. */
    showAnimation :
    {
      check : "Boolean",
      init : true
    },


    /** Transition duration of each animation. */
    animationDuration :
    {
      check : "Number",
      init : 350
    }
  },


  members :
  {
    __nextWidget : null,
    __currentWidget : null,
    __inAnimation : null,
    __animation : null,
    __reverse : null,
    __cardAnimation : null,


    // overridden
    _getCssClasses : function() {
      return ["layout-card","qx-vbox"];
    },


    // overridden
    connectToChildWidget : function(widget) {
      this.base(qx.ui.mobile.layout.Abstract, "connectToChildWidget");
      if (widget) {
        widget.addClass("layout-card-item");
        widget.addClass("qx-flex1");
        widget.exclude();
      }
    },


    // overridden
    disconnectFromChildWidget : function(widget) {
      this.base(qx.ui.mobile.layout.Abstract, "disconnectFromChildWidget");
      widget.removeClass("layout-card-item");
    },


    // overridden
    updateLayout : function(widget, action, properties) {
      if (action == "visible") {
        this._showWidget(widget, properties);
      }
      this.base(qx.ui.mobile.layout.Abstract, "updateLayout", widget, action, properties);
    },


    /**
     * Setter for this.__cardAnimation.
     * @param value {qx.ui.mobile.layout.CardAnimation} the new CardAnimation object.
     */
    setCardAnimation : function(value) {
      this.__cardAnimation = value;
    },


    /**
     * Getter for this.__cardAnimation.
     * @return {qx.ui.mobile.layout.CardAnimation} the current CardAnimation object.
     */
    getCardAnimation : function() {
      return this.__cardAnimation;
    },


    /**
     * Shows the widget with the given properties.
     *
     * @param widget {qx.ui.mobile.core.Widget} The target widget
     * @param properties {Map} The layout properties to set. Key / value pairs.
     */
    _showWidget : function(widget, properties)
    {
      if (this.__nextWidget == widget) {
        return;
      }

      if (this.__inAnimation) {
        this.__stopAnimation();
      }

      this.__nextWidget = widget;


      if (this.__currentWidget && this.showAnimation && qx.core.Environment.get("css.transform.3d")) {
        properties = properties || {};

        // both are explicit identity checks for null
        if (properties.animation === null || this.getCardAnimation().getMap()[properties.animation] === null) {
          this._swapWidget();
          return;
        }

        this.__animation = properties.animation || this.defaultAnimation;

        if (properties.action && properties.action === "back") {
          this.__reverse = true;
        } else {
          properties.reverse = properties.reverse === null ? false : properties.reverse;
          this.__reverse = properties.reverse;
        }

        qxWeb.requestAnimationFrame(function() {
          this.__startAnimation(widget);
        }, this);
      } else {
        this._swapWidget();
      }
    },


    /**
     * Excludes the current widget and sets the next widget to the current widget.
     */
    _swapWidget : function() {
      if (this.__currentWidget) {
        this.__currentWidget.removeClass("active");
        this.__currentWidget.exclude();
      }
      this.__currentWidget = this.__nextWidget;
      this.__currentWidget.addClass("active");
    },


    /**
     * Fix size, only if widget has mixin MResize set,
     * and nextWidget is set.
     *
     * @param widget {qx.ui.mobile.core.Widget} The target widget which should have a fixed size.
     */
    _fixWidgetSize : function(widget) {
      if(widget) {
        var hasResizeMixin = qx.Mixin.getClassByMixin(widget.constructor,qx.ui.mobile.core.MResize);
        if(hasResizeMixin) {
          // Size has to be fixed for animation.
          widget.fixSize();
        }
      }
    },


    /**
     * Releases recently fixed widget size (width/height). This is needed for allowing further
     * flexbox layouting.
     *
     * @param widget {qx.ui.mobile.core.Widget} The target widget which should have a flexible size.
     */
    _releaseWidgetSize : function(widget) {
      if(widget) {
        var hasResizeMixin = qx.Mixin.getClassByMixin(widget.constructor,qx.ui.mobile.core.MResize);
        if(hasResizeMixin) {
          // Size has to be released after animation.
          widget.releaseFixedSize();
        }
      }
    },


    /**
     * Starts the animation for the page transition.
     *
     * @param widget {qx.ui.mobile.core.Widget} The target widget
     */
    __startAnimation : function(widget)
    {
      // TODO
      // if (widget.isDisposed()) {
      //   return;
      // }
      // Fix size of current and next widget, then start animation.
      this.__inAnimation = true;

      this.emit("animationStart", [this.__currentWidget, widget]);
      var fromElement = this.__currentWidget;
      var toElement = widget;

      var onAnimationEnd = qx.lang.Function.bind(this._onAnimationEnd, this);

      if(qx.core.Environment.get("browser.name") == "iemobile" || qx.core.Environment.get("browser.name") == "ie") {
        fromElement.on("MSAnimationEnd", onAnimationEnd, false);
        toElement.on("MSAnimationEnd", onAnimationEnd, false);
      } else {
        fromElement.on("animationEnd", this._onAnimationEnd, this);
        toElement.on("animationEnd", this._onAnimationEnd, this);
      }

      var fromCssClasses = this.__getAnimationClasses("out");
      var toCssClasses = this.__getAnimationClasses("in");

      this._widget.addClass("animationParent");

      var toElementAnimation = this.__cardAnimation.getAnimation(this.__animation, "in", this.__reverse);
      var fromElementAnimation = this.__cardAnimation.getAnimation(this.__animation, "out", this.__reverse);

      toElement.addClasses(toCssClasses);
      fromElement.addClasses(fromCssClasses);

      toElement.animate(toElementAnimation);
      fromElement.animate(fromElementAnimation);
    },


    /**
     * Event handler. Called when the animation of the page transition ends.
     *
     * @param evt {qx.event.type.Event} The causing event
     */
    _onAnimationEnd : function(evt)
    {
      this.__stopAnimation();
      this.emit("animationEnd", [this.__currentWidget, this.__nextWidget]);
    },


    /**
     * Stops the animation for the page transition.
     */
    __stopAnimation : function()
    {
      if (this.__inAnimation) {
        if (qx.core.Environment.get("browser.name") == "iemobile" || qx.core.Environment.get("browser.name") == "ie") {
          this.__currentWidget.off("MSAnimationEnd", this._onAnimationEnd, false);
          this.__nextWidget.off("MSAnimationEnd", this._onAnimationEnd, false);
        } else {
          this.__currentWidget.off("animationEnd", this._onAnimationEnd, this);
          this.__nextWidget.off("animationEnd", this._onAnimationEnd, this);
        }

        this.__currentWidget.removeClasses(this.__getAnimationClasses("out"));
        this.__nextWidget.removeClasses(this.__getAnimationClasses("in"));

        this._swapWidget();
        this._widget.removeClass("animationParent");
        this.__inAnimation = false;
      }
    },


    /**
     * Returns the animation CSS classes for a given direction. The direction
     * can be <code>in</code> or <code>out</code>.
     *
     * @param direction {String} The direction of the animation. <code>in</code> or <code>out</code>.
     * @return {String[]} The CSS classes for the set animation.
     */
    __getAnimationClasses : function(direction)
    {
      var classes = ["animationChild", this.__animation, direction];
      if (this.__reverse) {
        classes.push("reverse");
      }
      return classes;
    }
  }
});

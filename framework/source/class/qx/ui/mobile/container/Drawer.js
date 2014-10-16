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

************************************************************************ */

/**
 * Creates a drawer widget inside the given parent widget. The parent widget can
 * be assigned as a constructor argument. If no parent is set, the application's
 * root will be assumed as parent. A drawer widget can be assigned to left, right,
 * top or bottom edge of its parent by property <code>orientation</code>. The drawer floats
 * in on <code>show()</code> and floats out on <code>hide()</code>. Additionally the drawer is shown by
 * swiping in reverse direction on the parent edge to where the drawer is placed
 * to: Orientation: <code>left</code>, Swipe: <code>right</code> on parents edge: Drawer is shown etc.
 * The drawer is hidden when user taps the parent area outside of the drawer.
 * This behaviour can be deactivated by the property <code>hideOnParentTap</code>.
 *
 * <pre class='javascript'>
 *
 *  var drawer = new qx.ui.mobile.container.Drawer();
 *  drawer.orientation = "right";
 *  drawer.setTapOffset(100);
 *
 *  var button = new qx.ui.mobile.Button("A Button");
 *  drawer.append(button);
 * </pre>
 *
 * @require(qx.module.Transform)
 */
qx.Class.define("qx.ui.mobile.container.Drawer",
{
  extend : qx.ui.mobile.Widget,


  /**
   * @param layout {qx.ui.mobile.layout.Abstract?null} The layout that should be
   * used for this container.
   * @param element {Element?null} The new drawer widget.
   */
  construct : function(layout, element)
  {
    this.base(qx.ui.mobile.Widget, "constructor", element);

    if (layout) {
      this.layout = layout;
    }
    this.orientation = undefined;
    this.positionZ = undefined;

    var parents = this.getParents();
    if (parents.length > 0) {
      this._onAttachToParent(parents);
    }

    this.on("addedToParent", this._onAttachToParent, this);
    this.on("removedFromParent", this._onRemovedFromParent, this);

    this.__pointerStartPosition = [0, 0];
  },


  events :
  {
    /**
     * Fired when the drawer changes its size.
     */
    resize : "qx.event.type.Data"
  },


  properties : {
    // overridden
    defaultCssClass : {
      init : "drawer"
    },


    /** Property for setting the orientation of the drawer.
     * Allowed values are: <code>left</code>,<code>right</code>,<code>top</code>,<code>bottom</code> */
    orientation : {
      check : "String",
      init : "left",
      apply : "_applyOrientation"
    },


    /** The size of the drawer in <code>px</code>. This value is interpreted as width if
    * orientation is <code>left | right</code>, as height if orientation is
    * <code>top | bottom</code>. */
    size : {
      check : "Number",
      init : 300,
      apply : "_applySize",
      event : true
    },


    /** Indicates whether the drawer should hide when the parent area of it is tapped.  */
    hideOnParentTap : {
      check : "Boolean",
      init : true
    },


    /** Sets the size of the tapping area, where the drawer reacts on swipes for opening itself. */
    tapOffset : {
      check : "Number",
      init : 20
    },


    /** The duration time of the transition between shown/hidden state in ms. */
    transitionDuration : {
      check : "Number",
      init : 500,
      apply : "_applyTransitionDuration"
    },


    /** Sets the drawer zIndex position relative to its parent. */
    positionZ : {
      check : [ "above", "below"],
      init : "above",
      apply : "_applyPositionZ"
    }
  },


  members :
  {
    __pointerStartPosition : null,
    __transitionEnabled : null,
    __inTransition : null,


    /**
     * Initializes the given parent as widget
     *
     * @param parent {Element} The parent widget that contains this drawer widget.
     */
    _onAttachToParent: function (parent) {
      parent.addClass("drawer-parent")
        .on("swipe", this._onParentSwipe, this)
        .on("pointerdown", this._onParentPointerDown, this);

      this.forceHide();
    },

    _onRemovedFromParent: function (parent) {
      parent.removeClass("drawer-parent")
        .off("swipe", this._onParentSwipe, this)
        .off("pointerdown", this._onParentPointerDown, this);
    },


    // property apply
    _applyOrientation : function(value, old) {
      this.removeClass(old);
      this.addClass(value);

      // Reapply width of height size depending on orientation.
      this._applySize(this.size);
    },


    // property apply
    _applyPositionZ : function(value, old) {
      this.removeClass(old);
      this.addClass(value);

      var parent = this._getParentWidget();
      if (parent) {
        parent.translate([0, 0]);
      }
    },


    // property apply
    _applySize : function(value) {
      var height = null;
      var width = null;

      var remSize = (value / 16);

      if (this.orientation == "left" || this.orientation == "right") {
        width = remSize + "rem";
      } else {
        height = remSize + "rem";
      }

      this.setStyle("height", height);
      this.setStyle("width", width);
    },


    // property apply
    _applyTransitionDuration : function(value,old) {
      this.__transitionEnabled = value > 0;
    },


    /**
     * Shows the drawer.
     */
    show : function()
    {
      var parent = this._getParentWidget()
      if (!parent) {
        return this;
      }

      if (!this.isHidden() || this.__inTransition === true) {
        return this;
      }

      this.__inTransition = true;

      // Make drawer visibile before "changeVisibility" event is fired, after transition.
      this.setStyle("visibility", "visible");

      parent.addClass("blocked");

      if (this.positionZ == "below") {
        if (this.orientation == "left") {
          parent.translate([this.size + "px", 0]);
        } else if (this.orientation == "right") {
          parent.translate([(-this.size) + "px", 0]);
        } else if (this.orientation == "top") {
          parent.translate([0, this.size + "px"]);
        } else if (this.orientation == "bottom") {
          parent.translate([0, (-this.size) + "px"]);
        }
      }

      if (this.transitionDuration > 0) {
        this._enableTransition();

        var transitionTarget = this._getTransitionTarget();
        var onTransitionEnd = function(evt) {
          this.base(qx.ui.mobile.Widget, "show");
          this._disableTransition();
          this.__inTransition = false;
          transitionTarget.off("transitionend", onTransitionEnd, this);
        };
        transitionTarget.on("transitionend", onTransitionEnd, this);

        window.setTimeout(function() {
          this.removeClass("hidden");
        }.bind(this), 0);
      } else {
        this.base(qx.ui.mobile.Widget, "show");
        this.__inTransition = false;
        this.removeClass("hidden");
      }

      return this;
    },


    /**
     * Hides the drawer.
     */
    hide : function() {
      var parent = this._getParentWidget();
      if (!parent) {
        return this;
      }

      if (this.isHidden() || this.__inTransition === true) {
        return this;
      }

      this.__inTransition = true;

      if (this.positionZ == "below") {
        parent.translate([0, 0]);
      }

      if (this.transitionDuration > 0) {
        this._enableTransition();

        var transitionTarget = this._getTransitionTarget();
        var listenerId = transitionTarget.on("transitionend", function(evt) {
          this.base(qx.ui.mobile.Widget, "hide");
          this._disableTransition();
          parent.removeClass("blocked");
          this.__inTransition = false;
          transitionTarget.offById(listenerId);
        }, this).getListenerId();

        window.setTimeout(function() {
          this.addClass("hidden");
        }.bind(this), 0);
      } else {
        this.base(qx.ui.mobile.Widget, "hide");
        this.addClass("hidden");
        this.__inTransition = false;
        parent.removeClass("blocked");
      }

      return this;
    },


    /**
     * Strict way to hide this drawer. Removes the blocker from the parent,
     * and hides the drawer without any animation. Should be called when drawer's
     * parent is animated and drawer should hide immediately.
     */
    forceHide : function() {
      var parent = this._getParentWidget();
      if (!parent) {
        return this;
      }

      this._disableTransition();

      if (this.positionZ == "below") {
        parent.translate(0, 0);
      }

      parent.removeClass("blocked");

      return this.addClass("hidden");
    },


    // overridden
    isHidden : function() {
      return this.hasClass("hidden");
    },


    /**
     * Enables the transition on this drawer.
     */
    _enableTransition : function() {
      this._getTransitionTarget().setStyle("transition", "all " + this.transitionDuration + "ms ease-in-out");
    },


   /**
     * Disables the transition on this drawer.
     */
    _disableTransition : function() {
      this._getTransitionTarget().setStyle("transition", null);
    },


    /**
    * Returns the target widget which is responsible for the transition handling.
    * @return {qx.ui.mobile.Widget} the transition target widget.
    */
    _getTransitionTarget : function() {
      if (this.positionZ == "below") {
        return this._getParentWidget();
      } else {
        return this;
      }
    },


    /**
     * Toggle the visibility of the drawer.
     * @return {Boolean} the new visibility state.
     */
    toggleVisibility : function() {
      if(this.isHidden()) {
        this.show();
        return true;
      } else {
        this.hide();
        return false;
      }
    },


    /**
     * Handles a tap on drawers's root.
     * @param evt {qx.module.event.Pointer} Handled pointer event.
     */
    _onParentPointerDown : function(evt) {
      this.__pointerStartPosition = [evt.getViewportLeft(),evt.getViewportTop()];

      var isShown = !this.hasClass("hidden");
      if(isShown && this.hideOnParentTap) {
        var location = this.getPosition();
        var orientation = this.orientation;
        if (orientation == "left" && this.__pointerStartPosition[0] > location.right
        || orientation == "top" && this.__pointerStartPosition[1] > location.bottom
        || orientation == "bottom" && this.__pointerStartPosition[1] < location.top
        || orientation == "right" && this.__pointerStartPosition[0] < location.left)
        {
          // First event on overlayed page should be ignored.
          evt.preventDefault();

          this.hide();
        }
      }
    },


    /**
     * Handles a swipe on layout parent.
     * @param evt {qx.module.event.Pointer} Handled pointer event.
     */
    _onParentSwipe : function(evt) {
      var direction = evt.swipe.direction;
      var isHidden = this.hasClass("hidden");
      if(isHidden) {
        var location = this.getPosition();

        if (
          (direction == "right"
          && this.orientation == "left"
          && this.__pointerStartPosition[0] < location.right + this.tapOffset
          && this.__pointerStartPosition[0] > location.right)
          ||
          (direction == "left"
          && this.orientation == "right"
          && this.__pointerStartPosition[0] > location.left - this.tapOffset
          && this.__pointerStartPosition[0] < location.left)
          ||
          (direction == "down"
          && this.orientation == "top"
          && this.__pointerStartPosition[1] < this.tapOffset + location.bott
          && this.__pointerStartPosition[1] > location.bottom)
          ||
          (direction == "up"
          && this.orientation == "bottom"
          && this.__pointerStartPosition[1] > location.top - this.tapOffset
          && this.__pointerStartPosition[1] < location.top)
        )
        {
          this.show();
        }
      }
    },

    dispose : function()
    {
      this.base(qx.ui.mobile.Widget, "dispose");
      qx.core.Init.getApplication().off("back", this.forceHide, this);

      var parent = this._getParentWidget();
      this._onRemovedFromParent(parent);

      qx.util.DisposeUtil.disposeContainer(this);

      this.__pointerStartPosition = this.__transitionEnabled = null;
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

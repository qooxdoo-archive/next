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
 *  var button = new qx.ui.mobile.form.Button("A Button");
 *  drawer.add(button);
 * </pre>
 *
 *
 */
qx.Bootstrap.define("qx.ui.mobile.container.Drawer",
{
  extend : qx.ui.mobile.container.Composite,


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param parent {qx.ui.mobile.container.Composite?null} The widget to which
   * the drawer should be added, if null it is added to app root.
   * @param layout {qx.ui.mobile.layout.Abstract?null} The layout that should be
   * used for this container.
   */
  construct : function(parent, layout)
  {
    this.base(arguments);

    if (layout) {
      this.setLayout(layout);
    }

    this.orientation = "left";
    this.positionZ = undefined;

    if (parent) {
      if (qx.core.Environment.get("qx.debug")) {
        this.assertInstance(parent, qx.ui.mobile.container.Composite);
      }

      parent.add(this);

      qx.core.Init.getApplication().addListener("back", this.forceHide, this);
    } else {
      qx.core.Init.getApplication().getRoot().add(this);
    }

    this.__parent = this.getLayoutParent();
    this.__parent.addCssClass("drawer-parent");

    this.__parent.addListener("swipe", this._onParentSwipe,this);
    this.__parent.addListener("pointerdown", this._onParentPointerDown,this);

    this.__pointerStartPosition = [0,0];

    this.forceHide();
  },


  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events :
  {
    /**
     * Fired when the drawer changes its size.
     */
    resize : "qx.event.type.Data"
  },


  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */
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
      event : "resize"
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


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */
  members :
  {
    __pointerStartPosition : null,
    __parent : null,
    __transitionEnabled : null,
    __inTransition : null,


    // property apply
    _applyOrientation : function(value, old) {
      this.removeCssClass(old);
      this.addCssClass(value);

      // Reapply width of height size depending on orientation.
      this._applySize(this.size);
    },


    // property apply
    _applyPositionZ : function(value,old) {
      this.removeCssClass(old);
      this.addCssClass(value);

      if(this.__parent) {
        this.__parent.translateX = 0;
        this.__parent.translateY = 0;
      }
    },


    /**
    * @deprecated {3.5} Please use the size property instead.
    * Sets the user value of the property width.
    * @param value {Integer} New value for property
    */
    setWidth : function(value) {
      if (qx.core.Environment.get("qx.debug"))
      {
        qx.log.Logger.deprecatedMethodWarning(arguments.callee,"The method 'setWidth()' is deprecated. Please use the 'size' property instead.");
      }
      this.size = value;
    },


    /**
    * @deprecated {3.5} Please use getSize() instead.
    * Gets the user value of the property width.
    * @return {Integer} the value.
    */
    getWidth : function() {
      if (qx.core.Environment.get("qx.debug"))
      {
        qx.log.Logger.deprecatedMethodWarning(arguments.callee,"The method 'getWidth()' is deprecated. Please use 'getSize()' instead.");
      }
      return this.size;
    },


    /**
    * @deprecated {3.5} Please use 'size = undefined' instead.
    * Resets the user value of the property width.
    */
    resetWidth : function() {
      if (qx.core.Environment.get("qx.debug"))
      {
        qx.log.Logger.deprecatedMethodWarning(arguments.callee,"The method 'resetWidth()' is deprecated. Please use 'size = undefined' instead.");
      }
      this.size = undefined;
    },


    /**
    * @deprecated {3.5} Please use the size property instead.
    * Sets the user value of the property height.
    * @param value {Integer} New value for property
    */
    setHeight : function(value) {
      if (qx.core.Environment.get("qx.debug"))
      {
        qx.log.Logger.deprecatedMethodWarning(arguments.callee,"The method 'setHeight()' is deprecated. Please use the 'size' property instead.");
      }
      this.size = value;
    },


    /**
    * @deprecated {3.5} Please use the 'size' property instead.
    * Gets the user value of the property height.
    * @return {Integer} the value.
    */
    getHeight : function() {
      if (qx.core.Environment.get("qx.debug"))
      {
        qx.log.Logger.deprecatedMethodWarning(arguments.callee,"The method 'getHeight()' is deprecated. Please use the 'size' property instead.");
      }
      return this.size;
    },


    /**
    * @deprecated {3.5} Please use 'size = undefined' instead.
    * Resets the user value of the property height.
    */
    resetHeight : function() {
      if (qx.core.Environment.get("qx.debug"))
      {
        qx.log.Logger.deprecatedMethodWarning(arguments.callee,"The method 'resetHeight()' is deprecated. Please use 'size = undefined' instead.");
      }
      this.size = undefined;
    },


    /**
     * @deprecated {3.5} Please use this.__parent.toggleCssClass instead.
     */
    _toggleParentBlockedState : function() {
      this.__parent.toggleCssClass("blocked");
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

      this._setStyle("height", height);
      this._setStyle("width", width);
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
      if(!this.isHidden() || this.__inTransition === true) {
        return;
      }

      this.__inTransition = true;

      // Make drawer visibile before "changeVisibility" event is fired, after transition.
      this._setStyle("visibility", "visible");

      this.__parent.addCssClass("blocked");

      if (this.positionZ == "below") {
        if (this.orientation == "left") {
          this.__parent.translateX = this.size;
        } else if (this.orientation == "right") {
          this.__parent.translateX = -this.size;
        } else if (this.orientation == "top") {
          this.__parent.translateY = this.size;
        } else if (this.orientation == "bottom") {
          this.__parent.translateY = -this.size;
        }
      }

      if (this.transitionDuration > 0) {
        this._enableTransition();

        var callArguments = arguments;
        var transitionTarget = this._getTransitionTarget().getContentElement();
        var listenerId = qx.bom.Element.addListener(transitionTarget, "transitionEnd", function(evt) {
          this.base(callArguments);
          this._disableTransition();
          this.__inTransition = false;
          qx.bom.Element.removeListenerById(transitionTarget, listenerId);
        }, this);

        setTimeout(function() {
          this.removeCssClass("hidden");
        }.bind(this), 0);
      } else {
        this.base(arguments);
        this.__inTransition = false;
        this.removeCssClass("hidden");
      }
    },


    /**
     * Hides the drawer.
     */
    hide : function() {
      if(this.isHidden() || this.__inTransition === true) {
        return;
      }

      this.__inTransition = true;

      if (this.positionZ == "below") {
        this.__parent.translateX = 0;
        this.__parent.translateY = 0;
      }

      if (this.transitionDuration > 0) {
        this._enableTransition();

        var callArguments = arguments;
        var transitionTarget = this._getTransitionTarget().getContentElement();
        var listenerId = qx.bom.Element.addListener(transitionTarget, "transitionEnd", function(evt) {
          this.base(callArguments);
          this._disableTransition();
          this.__parent.removeCssClass("blocked");
          this.__inTransition = false;
          qx.bom.Element.removeListenerById(transitionTarget, listenerId);
        }, this);

        setTimeout(function() {
          this.addCssClass("hidden");
        }.bind(this), 0);
      } else {
        this.base(arguments);
        this.addCssClass("hidden");
        this.__inTransition = false;
        this.__parent.removeCssClass("blocked");
      }
    },


    /**
     * Strict way to hide this drawer. Removes the blocker from the parent,
     * and hides the drawer without any animation. Should be called when drawer's
     * parent is animated and drawer should hide immediately.
     */
    forceHide : function() {
      this._disableTransition();

      if (this.positionZ == "below") {
        this.__parent.translateX = 0;
        this.__parent.translateY = 0;
      }

      this.__parent.removeCssClass("blocked");

      this.addCssClass("hidden");
    },


    // overridden
    isHidden : function() {
      return this.hasCssClass("hidden");
    },


    /**
     * Enables the transition on this drawer.
     */
    _enableTransition : function() {
      qx.bom.element.Style.set(this._getTransitionTarget().getContentElement(), "transition", "all "+this.transitionDuration+"ms ease-in-out");
    },


   /**
     * Disables the transition on this drawer.
     */
    _disableTransition : function() {
      qx.bom.element.Style.set(this._getTransitionTarget().getContentElement(),"transition", null);
    },


    /**
    * Returns the target widget which is responsible for the transition handling.
    * @return {qx.ui.mobile.core.Widget} the transition target widget.
    */
    _getTransitionTarget : function() {
      if (this.positionZ == "below") {
        return this.__parent;
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

      var isShown = !this.hasCssClass("hidden");
      if(isShown && this.hideOnParentTap) {
        var location = qx.bom.element.Location.get(this.getContainerElement());
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
      var direction = evt.getDirection();
      var isHidden = this.hasCssClass("hidden");
      if(isHidden) {
        var location = qx.bom.element.Location.get(this.getContainerElement());

        if (
          (direction == "right"
          && this.orientation == "left"
          && this.__pointerStartPosition[0] < location.right + this.getTapOffset()
          && this.__pointerStartPosition[0] > location.right)
          ||
          (direction == "left"
          && this.orientation == "right"
          && this.__pointerStartPosition[0] > location.left - this.getTapOffset()
          && this.__pointerStartPosition[0] < location.left)
          ||
          (direction == "down"
          && this.orientation == "top"
          && this.__pointerStartPosition[1] < this.getTapOffset() + location.bottom
          && this.__pointerStartPosition[1] > location.bottom)
          ||
          (direction == "up"
          && this.orientation == "bottom"
          && this.__pointerStartPosition[1] > location.top - this.getTapOffset()
          && this.__pointerStartPosition[1] < location.top)
        )
        {
          this.show();
        }
      }
    },

    dispose : function()
    {
      qx.core.Init.getApplication().removeListener("back", this.forceHide, this);

      this.__parent.removeListener("swipe", this._onParentSwipe, this);
      this.__parent.removeListener("pointerdown", this._onParentPointerDown, this);

      qx.util.DisposeUtil.destroyContainer(this);

      this.__pointerStartPosition = this.__parent = this.__transitionEnabled = null;
      this.base(arguments);
    }
  }
});

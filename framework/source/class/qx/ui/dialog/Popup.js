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
     * Gabriel Munteanu (gabios)
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/**
 * The popup represents a widget that gets shown above other widgets,
 * usually to present more info/details regarding an item in the application.
 *
 * There are 3 usages for now:
 *
 * <pre class='javascript'>
 * var widget = new qx.ui.Button("Error!");
 * var popup = new qx.ui.dialog.Popup(widget);
 * popup.show();
 * </pre>
 * Here we show a popup consisting of a single buttons alerting the user
 * that an error has occured.
 * It will be centered to the screen.
 * <pre class='javascript'>
 * var label = new qx.ui.Label("Item1");
 * var widget = new qx.ui.Button("Error!");
 * var popup = new qx.ui.dialog.Popup(widget, label);
 * popup.show();
 * widget.on("tap", function(){
 *   popup.hide();
 * });
 *
 * </pre>
 *
 * In this case everything is as above, except that the popup will get shown next to "label"
 * so that the user can understand that the info presented is about the "Item1"
 * we also add a tap listener to the button that will hide out popup.
 *
 * Once created, the instance is reused between show/hide calls.
 *
 * <pre class='javascript'>
 * var widget = new qx.ui.Button("Error!");
 * var popup = new qx.ui.dialog.Popup(widget);
 * popup.placeTo(25,100);
 * popup.show();
 * </pre>
 *
 * Same as the first example, but this time the popup will be shown at the 25,100 coordinates.
 *
 * @require(qx.module.Blocker)
 *
 * @group(Widget)
 */
qx.Class.define("qx.ui.dialog.Popup",
{
  extend : qx.ui.Widget,

  /**
   * @param widget {qx.ui.Widget} the widget that will be shown in the popup
   * @param anchor {qx.ui.Widget?} optional parameter, a widget to attach this popup to
   * @attach {qxWeb, toPopup}
   * @return {qx.ui.dialog.Popup} The new popup widget.
   */
  construct : function(widget, anchor, element)
  {
    this.super(qx.ui.Widget, "construct", element);
    this.exclude();

    this.__anchor = anchor;

    qxWeb(document.body).append(this);

    this._initializeChild(widget);
  },


  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "popup"
    },


    /**
     * The label/caption/text of the qx.ui.Atom instance
     */
    title :
    {
      apply : "_applyTitle",
      nullable : true,
      check : "String",
      event : true
    },


    /**
     * Any URI String supported by qx.ui.Image to display an icon
     */
    icon :
    {
      check : "String",
      apply : "_applyIcon",
      nullable : true,
      event : true
    },


    /**
     * Whether the popup should be displayed modal.
     */
    modal :
    {
      init : false,
      check : "Boolean",
      nullable: false
    },


    /**
     * Indicates whether the modal popup should disappear when user taps/clicks on Blocker.
     */
    hideOnBlockerTap :
    {
      check : "Boolean",
      init : false
    }
  },


  members :
  {
    __isShown : false,
    __childrenContainer : null,
    __percentageTop : null,
    __anchor: null,
    __widget: null,
    __titleWidget: null,
    __lastPopupDimension : null,

    /**
     * Event handler. Called whenever the position of the popup should be updated.
     */
    _updatePosition : function()
    {
      var anchorClasses = ['top', 'bottom', 'left', 'right', 'anchor'];
      this.removeClasses(anchorClasses);

      var parent = this._getParentWidget();
      if (this.__anchor && parent)
      {
        this.addClass('anchor');

        var rootHeight = parent.getHeight();
        var rootWidth = parent.getWidth();
        var rootPosition = parent.getLocation();
        var anchorPosition = this.__anchor.getLocation();
        var popupDimension = {
          width: this.getWidth(),
          height: this.getHeight()
        };

        this.__lastPopupDimension = popupDimension;

        var computedPopupPosition = qx.util.placement.Placement.compute(popupDimension, {
          width: rootPosition.left + rootWidth,
          height: rootPosition.top + rootHeight
        }, anchorPosition, {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }, "bottom-left", "keep-align", "keep-align");

        // Reset Anchor.
        this._resetPosition();

        var isTop = anchorPosition.top > computedPopupPosition.top;
        var isLeft = anchorPosition.left > computedPopupPosition.left;

        computedPopupPosition.top = computedPopupPosition.top - rootPosition.top;
        computedPopupPosition.left = computedPopupPosition.left - rootPosition.left;

        if (isTop) {
          this.addClass('bottom');
        } else {
          this.addClass('top');
        }
        if (isLeft) {
          this.addClass('right');
        } else {
          this.addClass('left');
        }

        this.placeTo(computedPopupPosition.left, computedPopupPosition.top);
      } else if (this.__childrenContainer) {
        // No Anchor
        this._positionToCenter();
      }
    },


    /**
     * Update position on scroll
     */
    _onRoll: function() {
      setTimeout(function() {
        this._updatePosition();
      }.bind(this), 0);
    },


    /**
     * This method shows the popup.
     * First it updates the position, then registers the event handlers, and shows it.
     */
    show : function()
    {
      if (!this.__isShown)
      {
        this.__registerEventListener();

        // Move outside of viewport
        this.placeTo(-1000,-1000);

        // Needs to be added to screen, before rendering position, for calculating
        // objects height.
        this.super(qx.ui.Widget, "show");

        // Now render position.
        this._updatePosition();
      }
      this.__isShown = true;

      if(this.modal === true)
      {
        qxWeb(document).block();

        if(this.hideOnBlockerTap) {
          qxWeb(document).getBlocker().on("tap", this.hide, this);
        }
      }
    },


    /**
     * Hides the popup.
     */
    hide : function()
    {
      if (this.__isShown)
      {
        this.__unregisterEventListener();

        this.exclude();
      }
      this.__isShown = false;

      if(this.modal)
      {
        qxWeb(document).unblock();
      }

      qxWeb(document).getBlocker().off("tap", this.hide, this);
    },


    /**
     * Hides the popup after a given time delay.
     * @param delay {Integer} time delay in ms.
     */
    hideWithDelay : function(delay) {
      if (delay) {
        qx.lang.Function.delay(this.hide, delay, this);
      } else {
        this.hide();
      }
    },


    /**
     * Returns the shown state of this popup.
     * @return {Boolean} whether the popup is shown or not.
     */
    isShown : function() {
      return this.__isShown;
    },


    /**
     * Toggles the visibility of this popup.
     */
    toggleVisibility : function() {
      if(this.__isShown == true) {
        this.hide();
      } else {
        this.show();
      }
    },


    /**
     * This method positions the popup widget at the coordinates specified.
     * @param left {Integer} - the value the will be set to container's left style property
     * @param top {Integer} - the value the will be set to container's top style property
     */
    placeTo : function(left, top)
    {
      this.setStyle("left", left + "px");
      this.setStyle("top", top + "px");
    },


    /**
     * Tracks the user tap on root and hides the widget if <code>pointerdown</code> event
     * occurs outside of the widgets bounds.
     * @param evt {qx.event.type.Pointer} the pointer event.
     */
    _trackUserTap : function(evt) {
      var clientX = evt.getViewportLeft();
      var clientY = evt.getViewportTop();

      var popupLocation = this.getPosition();

      var isOutsideWidget =  clientX < popupLocation.left
        || clientX > popupLocation.left + this.__lastPopupDimension.width
        || clientY > popupLocation.top + this.__lastPopupDimension.height
        || clientY < popupLocation.top;

      if(isOutsideWidget) {
        this.hide();
      }
    },


    /**
     * Centers this widget to window's center position.
     */
    _positionToCenter : function()
    {
      var container = this[0];
      container.style.position = "absolute";
      container.style.marginLeft = -(container.offsetWidth/2) + "px";
      container.style.marginTop = -(container.offsetHeight/2) + "px";
      container.style.left = "50%";
      container.style.top = "50%";
    },


    /**
     * Resets the position of this element (left, top, margins...)
     */
    _resetPosition : function()
    {
      var container = this[0];
      container.style.left = "0px";
      container.style.top = "0px";
      container.style.marginLeft = null;
      container.style.marginTop = null;
    },


    /**
     * Registers all needed event listeners
     */
    __registerEventListener : function()
    {
      var parentWidget = this._getParentWidget();
      if (parentWidget) {
        parentWidget.on("stop", this.hide, this);
        parentWidget.on("popup", this.hide, this);
      }

      qxWeb(window).on("resize", this._updatePosition, this);

      if (this.__anchor) {
        qxWeb(document.documentElement).on("roll", this._onRoll, this);
        this.__anchor.addClass("anchor-target");

        if (parentWidget) {
          parentWidget.on("pointerdown",this._trackUserTap, this);
          parentWidget.on("popup", this.hide, this);
        }
      }
    },


    /**
     * Unregisters all needed event listeners
     */
    __unregisterEventListener : function()
    {
      var parentWidget = this._getParentWidget();
      if (parentWidget) {
        parentWidget.off("stop", this.hide, this);
        parentWidget.off("popup", this.hide, this);
        parentWidget.off("pointerdown", this._trackUserTap, this);
      }
      if(this.__anchor) {
        qxWeb(this.__anchor).removeClass("anchor-target");
      }
      qxWeb(window).off("resize", this._updatePosition, this);
      qxWeb(document.documentElement).off("roll", this._onRoll, this);
    },


    /**
     * This method creates the container where the popup's widget will be placed
     * and adds it to the popup.
     * @param widget {qx.ui.Widget} - what to show in the popup
     *
     */
    _initializeChild : function(widget)
    {
      if (!this.__childrenContainer) {
        this.__childrenContainer = new qx.ui.Widget();
        this.__childrenContainer.layout = new qx.ui.layout.VBox();
        this.__childrenContainer.defaultCssClass = "popup-content";
        this._append(this.__childrenContainer);
      }

      if (this._getTitleWidget()) {
        this._getTitleWidget().remove();
        this.__childrenContainer.append(this._getTitleWidget());
      }

      widget.layoutPrefs = {flex: 1};
      this.__childrenContainer.append(widget);

      this.__widget = widget;
    },


    /**
     * Creates the title atom widget.
     *
     * @return {qx.ui.Atom} The title atom widget.
     */
    _getTitleWidget : function()
    {
      if (this.__titleWidget) {
        return this.__titleWidget;
      }
      if (this.title || this.icon) {
        this.__titleWidget = new qx.ui.Atom(this.title, this.icon);
        this.__titleWidget.addClass('popup-title');
        return this.__titleWidget;
      }
      else {
        return null;
      }
    },


    // property apply
    _applyTitle : function(value, old)
    {
      if(value) {
        if(this.__titleWidget)
        {
          this.__titleWidget.label = value;
        }
        else
        {
          this.__titleWidget = new qx.ui.Atom(value, this.icon);
          this.__titleWidget.addClass('popup-title');

          if(this.__widget) {
            this._getTitleWidget().insertBefore(this.__widget);
          } else {
            if(this.__childrenContainer) {
              this.__childrenContainer.append(this._getTitleWidget());
            }
          }
        }
      }
    },


    // property apply
    _applyIcon : function(value, old)
    {
      if (value) {
        if (this.__titleWidget) {
          this.__titleWidget.icon = value;
        } else {
          this.__titleWidget = new qx.ui.Atom(this.title, value);
          this.__titleWidget.addClass('popup-title');

          if (this.__widget) {
            this._getTitleWidget().insertBefore(this.__widget);
          } else {
            if (this.__childrenContainer) {
              this.__childrenContainer.append(this._getTitleWidget());
            }
          }
        }
      }
    },


    /**
     * Adds the widget that will be shown in this popup. This method can be used in the case when you have removed the widget from the popup
     * or you haven't passed it in the constructor.
     * @param widget {qx.ui.Widget} - what to show in the popup
     */
    append : function(widget) {
      this.removeWidget();
      this._initializeChild(widget);
    },


    /**
     * A widget to attach this popup to.
     *
     * @param widget {qx.ui.Widget} The anchor widget.
     */
    setAnchor : function(widget) {
      this.__anchor = widget;
      this._updatePosition();
    },


    /**
     * Returns the title widget.
     *
     * @return {qx.ui.Atom} The title widget.
     */
    getTitleWidget : function() {
      return this.__titleWidget;
    },


    /**
     * This method removes the widget shown in the popup.
     * @return {qx.ui.Widget|null} The removed widget or <code>null</code>
     * if the popup doesn't have an attached widget
     */
    removeWidget : function()
    {
      if(this.__widget)
      {
        this.__widget.remove();
        return this.__widget;
      }
      else
      {
        if (qx.core.Environment.get("qx.debug")) {
          qx.log.Logger.debug(this, "this popup has no widget attached yet");
        }
        return null;
      }
    },


    dispose : function() {
      this.super(qx.ui.Widget, "dispose");
      this.__unregisterEventListener();
      if (this.__childrenContainer) {
        this.__childrenContainer.dispose();
      }

      this.__isShown = this.__percentageTop = this._anchor = this.__widget = this.__lastPopupDimension = null;
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

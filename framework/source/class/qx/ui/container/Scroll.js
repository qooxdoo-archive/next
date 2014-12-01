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

************************************************************************ */

/**
 * Container, which allows, depending on the set variant <code>qx.mobile.nativescroll</code>,
 * vertical and horizontal scrolling if the contents is larger than the container.
 *
 * Note that this class can only have one child widget. This container has a
 * fixed layout, which cannot be changed.
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *   // create the scroll widget
 *   var scroll = new qx.ui.container.Scroll()
 *
 *   // add a children
 *   scroll.append(new qx.ui.Label("Name: "));
 *
 *   this.getRoot().append(scroll);
 * </pre>
 *
 * This example creates a scroll container and adds a label to it.
 *
 * @group(Widget)
 */
qx.Class.define("qx.ui.container.Scroll",
{
  extend : qx.ui.Widget,
  include : [qx.ui.container.MNativeScroll],

  /**
  * @param scrollProperties {Object?} A map with scroll properties which are passed to the scrolling container (may contain iScroll properties).
  * @attach {qxWeb, toScroll}
  * @return {qx.ui.container.Scroll} The new scroll widget.
  */
  construct : function(scrollProperties, element)
  {
    this.super(qx.ui.Widget, "construct", element);

    if(scrollProperties) {
      this._scrollProperties = scrollProperties;
    }

    this.on("appear", this._updateWaypoints, this);

    this._waypointsX = [];
    this._waypointsY = [];

    if (this.initMIScroll) {
      this.initMIScroll();
    }
    if (this.initMNativeScroll) {
      this.initMNativeScroll();
    }
  },


  events :
  {
    /** Fired when the scroll container reaches its end position (including momentum/inertia). */
    scrollEnd : null,


    /** Fired when the user scrolls to the end of scroll area. */
    pageEnd : "qx.event.type.Event",


    /** Fired when a vertical or horizontal waypoint is triggered. Data:
    * <code> {"offset": 0,
    *        "input": "10%",
    *        "index": 0,
    *        "element" : 0}</code>
    */
    waypoint : "Object",


    /**
    * Fired when a momentum starts on an iOS device.
    */
    momentumStart : "qx.event.type.Event", //TODO: could be removed

    /**
    * Fired when a momentum ends on an iOS device.
    */
    momentumEnd : "qx.event.type.Data" //TODO: could be removed
  },


  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "scroll"
    },


    /**
     * Delegation object which can have one or more functions defined by the
     * {@link qx.ui.container.IScrollDelegate} interface.
     *
     * @internal
     */
    delegate :
    {
      init: null,
      nullable: true
    }
  },


  members: {
    _scrollProperties: null,
    _activeWaypointX : null,
    _activeWaypointY : null,
    _waypointsX: null,
    _waypointsY: null,
    _calculatedWaypointsX : null,
    _calculatedWaypointsY : null,
    _currentX : 0,
    _currentY : 0,


    /**
    * Sets the current x position.
    * @param value {Number} the current horizontal position.
    */
    _setCurrentX : function(value) {
      var old = this._currentX;
      this._currentX = value;
      this._fireWaypoint(value, old, "x");
    },


    /**
    * Sets the current y position.
    * @param value {Number} the current vertical position.
    */
    _setCurrentY : function(value) {
      var old = this._currentY;
      this._currentY = value;
      this._fireWaypoint(value, old,  "y");
    },


   /**
    * Sets the horizontal trigger points, where a <code>waypoint</code> event will be fired.
    * @param waypoints {Array} description
    * @return {qx.ui.container.Scroll} The widget for chaining
    */
    setWaypointsX : function(waypoints) {
      this._waypointsX = waypoints;
      return this;
    },


    /**
     * Sets the vertical trigger points, where a <code>waypoint</code> event will be fired.
     * @param waypoints {Array} an array with waypoint descriptions. Allowed are percentage description as string, or pixel trigger points defined as numbers. <code>["20%",200]</code>
     * @return {qx.ui.container.Scroll} The widget for chaining
     */
    setWaypointsY : function(waypoints) {
      this._waypointsY = waypoints;
      return this;
    },


    /**
     * Returns the scroll height.
     * @return {Number} the scroll height.
     */
    getScrollHeight: function() {
      return this._getScrollHeight();
    },


    /**
     * Returns the scroll width.
     * @return {Number} the scroll width.
     */
    getScrollWidth: function() {
      return this._getScrollWidth();
    },


    /**
     * Re-calculates the internal waypoint offsets.
     */
    _updateWaypoints: function() {
      this._calculatedWaypointsX = [];
      this._calculatedWaypointsY = [];
      this._calcWaypoints(this._waypointsX, this._calculatedWaypointsX, this.getScrollWidth());
      this._calcWaypoints(this._waypointsY, this._calculatedWaypointsY, this.getScrollHeight());
    },


    /**
     * Validates and checks the waypoint offsets.
     * @param waypoints {Array} an array with waypoint descriptions.
     * @param results {Array} the array where calculated waypoints will be added.
     * @param scrollSize {Number} the vertical or horizontal scroll size.
     */
    _calcWaypoints: function(waypoints, results, scrollSize) {
      for (var i = 0; i < waypoints.length; i++) {
        var waypoint = waypoints[i];
        if (qx.lang.Type.isString(waypoint)) {
          if (qx.lang.String.endsWith(waypoint, "%")) {
            var offset = parseInt(waypoint, 10) * (scrollSize / 100);
            results.push({
              "offset": offset,
              "input": waypoint,
              "index": i,
              "element": null
            });
          } else {
            // Dynamically created waypoints, based upon a selector.
            var element = this[0];
            var waypointElements = qxWeb(waypoint, element);
            for (var j = 0; j < waypointElements.length; j++) {
              var position = qxWeb(waypointElements[j]).getRelativeDistance(element);
              results.push({
                "offset": position.top + this[0].scrollTop,
                "input": waypoint,
                "index": i,
                "element" : j
              });
            }
          }
        } else if (qx.lang.Type.isNumber(waypoint)) {
          results.push({
            "offset": waypoint,
            "input": waypoint,
            "index": i,
            "element": null
          });
        }
      }

      results.sort(function(a, b) {
        return a.offset - b.offset;
      });
    },


    /**
     * Fires a waypoints event when scroll position changes.
     * @param value {Number} old scroll position.
     * @param old {Number} old scroll position.
     * @param axis {String} "x" or "y".
     */
    _fireWaypoint: function(value, old, axis) {
      var waypoints = this._calculatedWaypointsY;
      if (axis === "x") {
        waypoints = this._calculatedWaypointsX;
      }

      if(waypoints === null) {
        return;
      }

      var nextWaypoint = null;
      for (var i = 0; i < waypoints.length; i++) {
        var waypoint = waypoints[i];
        if (waypoint.offset !== null) {

          if ((value > -1 && value >= waypoint.offset) ||
           (value < 0 && waypoint.offset < 0 && value <= waypoint.offset)) {
            nextWaypoint = waypoint;
          } else {
            break;
          }
        }
      }

      if (nextWaypoint === null) {
        if (axis === "x") {
          this._activeWaypointX = null;
        } else {
          this._activeWaypointY = null;
        }
        return;
      }

      var direction = null;
      if (old <= value) {
        direction = "down";
        if (axis == "x") {
          direction = "left";
        }
      } else {
        direction = "up";
        if (axis == "x") {
          direction = "right";
        }
      }

      var activeWaypoint = this._activeWaypointY;
      if (axis === "x") {
        activeWaypoint = this._activeWaypointX;
      }

      if (activeWaypoint === null || (activeWaypoint.index !== nextWaypoint.index || activeWaypoint.element !== nextWaypoint.element)) {
        activeWaypoint = nextWaypoint;
        this._activeWaypointY = activeWaypoint;
        if (axis === "x") {
          this._activeWaypointX = activeWaypoint;
        }

        this.emit("waypoint", {
          "axis": axis,
          "index": nextWaypoint.index,
          "element": nextWaypoint.element,
          "direction": direction
        });
      }
    },


    // overridden
    _createContainerElement: function() {
      var element = this.super(qx.ui.Widget, "_createContainerElement");
      var scrollElement = this._createScrollElement();
      if (scrollElement) {
        return scrollElement;
      }

      return element;
    },


    /**
     * Calls the refresh function the used scrolling method. Needed to recalculate the
     * scrolling container.
     */
    refresh: function() {
      this._refresh();
      this._updateWaypoints();
    },


    /**
     * Scrolls the wrapper contents to the x/y coordinates in a given time.
     *
     * @param x {Integer} X coordinate to scroll to.
     * @param y {Integer} Y coordinate to scroll to.
     * @param time {Integer} Time slice in which scrolling should
     *              be done.
     */
    scrollTo: function(x, y, time) {
      this._scrollTo(x, y, time);
    },


    /**
     * Returns the current scroll position
     * @return {Array} an array with <code>[scrollLeft,scrollTop]</code>.
     */
    getPosition: function() {
      return this._getPosition();
    },


    /**
     * Detects whether this scroll container is scrollable or not.
     * @return {Boolean} <code>true</code> or <code>false</code>
     */
    isScrollable: function() {
      return this._isScrollable();
    },


    /**
     * Detects whether this scroll container is scrollable or not.
     * @return {Boolean} <code>true</code> or <code>false</code>
     */
    _isScrollable: function() {
      return this._isScrollableX() || this._isScrollableY();
    },


    /**
     * Detects whether this scroll container is scrollable on x axis or not.
     * @return {Boolean} <code>true</code> or <code>false</code>
     */
    _isScrollableX: function() {
      if (!this._getParentWidget()) {
        return false;
      }

      var contentEl = this[0];
      var scrollContentElement = this._getScrollContentElement();
      if (scrollContentElement) {
        contentEl = scrollContentElement;
      }

      var parentWidth = this[0].clientWidth; // TODO: container vs content?
      var contentWidth = contentEl[0].scrollWidth;

      return parentWidth < contentWidth;
    },


    /**
     * Detects whether this scroll container is scrollable on y axis or not.
     * @return {Boolean} <code>true</code> or <code>false</code>
     */
    _isScrollableY: function() {
      if (!this._getParentWidget()) {
        return false;
      }

      var contentEl = this[0];
      var scrollContentElement = this._getScrollContentElement();
      if (scrollContentElement) {
        contentEl = scrollContentElement;
      }

      var parentHeight = this[0].clientHeight; // TODO: container vs content?
      var contentHeight = contentEl[0].scrollHeight;

      return parentHeight < contentHeight;
    },


    /**
     * Scrolls the wrapper contents to the widgets coordinates in a given
     * period.
     *
     * @param target {Element} the element to which the scroll container should scroll to.
     * @param time {Integer?0} Time slice in which scrolling should
     *              be done (in seconds).
     *
     */
    scrollToElement: function(target, time) {
      this._scrollToElement(target, time);
    },


    /**
    * Scrolls the wrapper contents to the widgets coordinates in a given
    * period.
    *
    * @param element {String} the element to which the scroll container should scroll to.
    * @param time {Integer?0} Time slice in which scrolling should be done (in seconds).
    *
    */
    _scrollToElement : function(element, time)
    {
      var contentElement = this._getScrollContentElement();
      if (contentElement) {
        contentElement  = this;
      }
      if (contentElement && this._isScrollable()) {
        if (typeof time === "undefined") {
          time = 0;
        }

        var location = contentElement.getRelativeDistance(element, "scroll", "scroll");
        var offset = this._getScrollOffset();

        this._scrollTo(-location.left - offset[0], -location.top - offset[1], time);
      }
    },


    /**
     *
     * Determines the scroll offset for the <code>_scrollToElement</code> method.
     * If a delegate is available, the method calls
     * <code>qx.ui.container.IScrollDelegate.getScrollOffset()</code> for offset calculation.
     *
     * @return {Array} an array with x,y offset.
     */
    _getScrollOffset : function()
    {
      var delegate = this.delegate;
      if (delegate != null && delegate.getScrollOffset) {
        return delegate.getScrollOffset.bind(this)();
      } else {
        return [0, 0];
      }
    },


    /**
     * Scrolls the wrapper contents to the widgets coordinates in a given
     * period.
     *
     * @param widget {qx.ui.Widget} the widget, the scroll container should scroll to.
     * @param time {Integer} Time slice in which scrolling should
     *              be done.
     */
    scrollToWidget: function(widget, time) {
      if (widget) {
        this._scrollToElement(widget[0], time);
      }
    },


    dispose : function() {
      this.super(qx.ui.Widget, "dispose");
      this.off("appear", this._updateWaypoints, this);

      this._waypointsX = this._waypointsY = null;

      if (this.disposeMNativeScroll) {
        this.disposeMNativeScroll();
      }

      if (this.disposeMIScroll) {
        this.disposeMIScroll();
      }
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Fabian Jakobs (fjakobs)
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

/**
 * Contains methods to compute a position for any object which should
 * be positioned relative to another object.
 */
qx.Bootstrap.define("qx.util.placement.Placement",
{
  extend : Object,

  construct : function() {
    this.__defaultAxis = qx.util.placement.DirectAxis;
  },


  properties :
  {
    /**
     * The axis object to use for the horizontal placement
     */
    axisX : {
      check: "Object"
    },

    /**
     * The axis object to use for the vertical placement
     */
    axisY : {
      check: "Object"
    },

    /**
     * Specify to which edge of the target object, the object should be attached
     */
    edge : {
      check: ["top", "right", "bottom", "left"],
      init: "top"
    },

    /**
     * Specify with which edge of the target object, the object should be aligned
     */
    align : {
      check: ["top", "right", "bottom", "left", "center", "middle"],
      init: "right"
    }
  },


  statics :
  {
    __instance : null,

    /**
     * DOM and widget independent method to compute the location
     * of an object to make it relative to any other object.
     *
     * @param size {Map} With the keys <code>width</code> and <code>height</code>
     *   of the object to align
     * @param area {Map} Available area to position the object. Has the keys
     *   <code>width</code> and <code>height</code>. Normally this is the parent
     *   object of the one to align.
     * @param target {Map} Location of the object to align the object to. This map
     *   should have the keys <code>left</code>, <code>top</code>, <code>right</code>
     *   and <code>bottom</code>.
     * @param offsets {Map} Map with all offsets for each direction.
     *   Comes with the keys <code>left</code>, <code>top</code>,
     *   <code>right</code> and <code>bottom</code>.
     * @param position {String} Alignment of the object on the target, any of
     *   "top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right",
     *   "left-top", "left-middle", "left-bottom", "right-top", "right-middle", "right-bottom".
     * @param modeX {String} Horizontal placement mode. Valid values are:
     *   <ul>
     *   <li><code>direct</code>: place the object directly at the given
     *   location.</li>
     *   <li><code>keep-align</code>: if parts of the object is outside of the visible
     *   area it is moved to the best fitting 'edge' and 'alignment' of the target.
     *   It is guaranteed the the new position attaches the object to one of the
     *   target edges and that that is aligned with a target edge.</li>
     *   <li>best-fit</li>: If parts of the object are outside of the visible
     *   area it is moved into the view port ignoring any offset, and position
     *   values.
     *   </ul>
     * @param modeY {String} Vertical placement mode. Accepts the same values as
     *   the 'modeX' argument.
     * @return {Map} A map with the final location stored in the keys
     *   <code>left</code> and <code>top</code>.
     */
    compute: function(size, area, target, offsets, position, modeX, modeY)
    {
      this.__instance = this.__instance || new qx.util.placement.Placement();

      var splitted = position.split("-");
      var edge = splitted[0];
      var align = splitted[1];

      if (qx.core.Environment.get("qx.debug"))
      {
        if (align === "center" || align === "middle")
        {
          var expected = "middle";
          if (edge === "top" || edge === "bottom") {
            expected = "center";
          }
          qx.core.Assert.assertEquals(expected, align, "Please use '" + edge + "-" + expected + "' instead!");
        }
      }

      this.__instance.axisX = this.__getAxis(modeX);
      this.__instance.axisY = this.__getAxis(modeY);
      this.__instance.edge = edge;
      this.__instance.align = align;

      return this.__instance.compute(size, area, target, offsets);
    },


    __direct : null,
    __keepAlign : null,
    __bestFit : null,

    /**
     * Get the axis implementation for the given mode
     *
     * @param mode {String} One of <code>direct</code>, <code>keep-align</code> or
     *   <code>best-fit</code>
     * @return {qx.util.placement.AbstractAxis}
     */
    __getAxis : function(mode)
    {
      switch(mode)
      {
        case "direct":
          this.__direct = this.__direct || qx.util.placement.DirectAxis;
          return this.__direct;

        case "keep-align":
          this.__keepAlign = this.__keepAlign || qx.util.placement.KeepAlignAxis;
          return this.__keepAlign;

        case "best-fit":
          this.__bestFit = this.__bestFit || qx.util.placement.BestFitAxis;
          return this.__bestFit;

        default:
          throw new Error("Invalid 'mode' argument!'");
      }
    }
  },


  members :
  {
    __defaultAxis : null,

    /**
     * DOM and widget independent method to compute the location
     * of an object to make it relative to any other object.
     *
     * @param size {Map} With the keys <code>width</code> and <code>height</code>
     *   of the object to align
     * @param area {Map} Available area to position the object. Has the keys
     *   <code>width</code> and <code>height</code>. Normally this is the parent
     *   object of the one to align.
     * @param target {Map} Location of the object to align the object to. This map
     *   should have the keys <code>left</code>, <code>top</code>, <code>right</code>
     *   and <code>bottom</code>.
     * @param offsets {Map} Map with all offsets for each direction.
     *   Comes with the keys <code>left</code>, <code>top</code>,
     *   <code>right</code> and <code>bottom</code>.
     * @return {Map} A map with the final location stored in the keys
     *   <code>left</code> and <code>top</code>.
     */
    compute : function(size, area, target, offsets)
    {
      if (qx.core.Environment.get("qx.debug"))
      {
        qx.core.Assert.assertObject(size, "size");
        qx.core.Assert.assertNumber(size.width, "size.width");
        qx.core.Assert.assertNumber(size.height, "size.height");

        qx.core.Assert.assertObject(area, "area");
        qx.core.Assert.assertNumber(area.width, "area.width");
        qx.core.Assert.assertNumber(area.height, "area.height");

        qx.core.Assert.assertObject(target, "target");
        qx.core.Assert.assertNumber(target.top, "target.top");
        qx.core.Assert.assertNumber(target.right, "target.right");
        qx.core.Assert.assertNumber(target.bottom, "target.bottom");
        qx.core.Assert.assertNumber(target.left, "target.left");

        qx.core.Assert.assertObject(offsets, "offsets");
        qx.core.Assert.assertNumber(offsets.top, "offsets.top");
        qx.core.Assert.assertNumber(offsets.right, "offsets.right");
        qx.core.Assert.assertNumber(offsets.bottom, "offsets.bottom");
        qx.core.Assert.assertNumber(offsets.left, "offsets.left");
      }

      var axisX = this.axisX || this.__defaultAxis;
      var left = axisX.computeStart(
        size.width,
        {start: target.left, end: target.right},
        {start: offsets.left, end: offsets.right},
        area.width,
        this.__getPositionX()
      );

      var axisY = this.axisY || this.__defaultAxis;
      var top = axisY.computeStart(
        size.height,
        {start: target.top, end: target.bottom},
        {start: offsets.top, end: offsets.bottom},
        area.height,
        this.__getPositionY()
      );

      return {
        left: left,
        top: top
      }
    },


    /**
     * Get the position value for the horizontal axis
     *
     * @return {String} the position
     */
    __getPositionX : function()
    {
      var edge = this.edge;
      var align = this.align;

      if (edge == "left") {
        return "edge-start";
      } else if (edge == "right") {
        return "edge-end";
      } else if (align == "left") {
        return "align-start";
      } else if (align == "center") {
        return "align-center";
      } else if (align == "right") {
        return "align-end";
      }
    },


    /**
     * Get the position value for the vertical axis
     *
     * @return {String} the position
     */
    __getPositionY : function()
    {
      var edge = this.edge;
      var align = this.align;

      if (edge == "top") {
        return "edge-start";
      } else if (edge == "bottom") {
        return "edge-end";
      } else if (align == "top") {
        return "align-start";
      } else if (align == "middle") {
        return "align-center";
      } else if (align == "bottom") {
        return "align-end";
      }
    }
  }
});
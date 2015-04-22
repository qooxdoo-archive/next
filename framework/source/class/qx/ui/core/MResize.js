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
     * Tino Butz (tbtz)
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/**
 * This mixin resizes the container element to the height of the parent element.
 * Use this when the height can not be set by CSS.
 *
 */
qx.Mixin.define("qx.ui.core.MResize",
{

  members :
  {
    __lastHeight : null,
    __lastWidth : null,


    /**
     * Removes fixed size from container.
     */
    releaseFixedSize : function() {
      var parent = this._getParentWidget();

      if (parent && parent[0]) {
        this.setStyles({
          "height": "auto",
          "width": "auto"
        });
      }
    },


    /**
     * Resizes the container element to the height of the parent element.
     */
    fixSize : function()
    {
      var parent = this._getParentWidget();

      if (parent && parent[0]) {
        var height = parent[0].offsetHeight;
        var width = parent[0].offsetWidth;

        // Only fix size, when value are above zero.
        if(height === 0 || width === 0) {
          return;
        }

        this._setHeight(height);
        this._setWidth(width);
      }
    },


    /**
     * Sets the height of the container element.
     *
     * @param height {Integer} The height to set
     */
    _setHeight : function(height) {
      this.setStyle("minHeight", height + "px");
    },



    /**
     * Sets the width of the container element.
     *
     * @param width {Integer} The width to set
     */
    _setWidth : function(width) {
      this.setStyle("minWidth", width + "px");
    }
  }
});

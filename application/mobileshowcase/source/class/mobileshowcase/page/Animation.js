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

define(["class/mobileshowcase/page/Abstract"], function(AbstractPage) {

/**
 * Mobile page responsible for showing the "animation" showcase.
 */
return qx.Class.define(null,
{
  extend : AbstractPage,

  construct : function()
  {
    this.super(AbstractPage, "construct");
    this.title = "Page Transitions";
  },


  statics: {
    ANIMATION_DATA: [{
      title: "Slide",
      animation: "slide"
    }, {
      title: "Pop",
      animation: "pop"
    }, {
      title: "Fade",
      animation: "fade"
    }, {
      title: "Slide up",
      animation: "slideup"
    }, {
      title: "Flip",
      animation: "flip"
    }, {
      title: "Swap",
      animation: "swap"
    }, {
      title: "Cube",
      animation: "cube"
    }]
  },


  members :
  {
    // overridden
    _initialize : function()
    {
      this.super(AbstractPage, "_initialize");

      var list = new qx.ui.List({
        configureItem : function(item, data, row)
        {
          item.setTitle(data.title);
          item.showArrow = true;
        }
      });

      list.addClass("animation-list-1");

      list.model = new qx.data.Array(this.constructor.Animation.ANIMATION_DATA);
      list.on("selected", function(el) {
        // In Tablet Mode, animation should be shown for this showcase part.
        // On animation landing >> showAnimation is set to false.
        this._getParentWidget().layout.showAnimation = true;
        var index = el.getData("row");
        var animation = this.constructor.ANIMATION_DATA[index].animation;
        qx.core.Init.getApplication().getRouting().executeGet("/animation/" + animation);
      }, this);
      this.getContent().append(list);
    }
  }
});

});
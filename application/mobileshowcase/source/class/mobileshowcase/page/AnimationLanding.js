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

define([
  "class/mobileshowcase/page/Abstract",
  "class/mobileshowcase/page/Animation"
], function(AbstractPage, AnimationPage) {


/**
 * Mobile page responsible for showing the landing page for the "animation" showcase.
 */
return qx.Class.define(null,
{
  extend : AbstractPage,

  construct : function()
  {
    this.super(AbstractPage, "construct", true);
    this.title = "Page Transitions";
    this.showBackButtonOnTablet = true;
  },

  properties :
  {
    /**
     * The current animaton.
     */
    animation :
    {
      check : "String",
      init : ""
    }
  },

  members :
  {
    // overridden
    _initialize : function()
    {
      this.super(AbstractPage, "_initialize");


      if (this._isTablet) {
        this.on("disappear", this.__deactiveAnimation, this);
      }

      var list = new qx.ui.List({
        configureItem: function(item, data, row) {
          item.setTitle(data.title);
          item.showArrow = true;
        }
      });
      list.addClass("animation-list-2");

      var animationData = AnimationPage.ANIMATION_DATA;

      list.model = new qx.data.Array(animationData);
      list.on("selected", function(el) {
        var index = el.getData("row");
        // In Tablet Mode, animation should be shown for this showcase part.
        // On animation landing >> showAnimation is set to false.
        this._getParentWidget().layout.showAnimation = true;
        qx.core.Init.getApplication().getRouting().executeGet("/animation/" + animationData[index].animation);
      }, this);
      this.getContent().append(list);
    },


    /**
     * Deactivates the animation on parentContainer's layout.
     */
    __deactiveAnimation : function() {
      this._getParentWidget().layout.showAnimation = false;
    },


    // overridden
    _back : function() {
      qx.core.Init.getApplication().getRouting().executeGet("/animation", {animation: this.animation, reverse: true});
    }
  }
});

});
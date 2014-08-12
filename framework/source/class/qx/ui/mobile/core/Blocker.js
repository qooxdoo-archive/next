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
 * This class blocks events.
 *
 */
qx.Bootstrap.define("qx.ui.mobile.core.Blocker",
{

  extend : qx.ui.mobile.core.Widget,


  statics:
  {
    ROOT : null,

    __instance: null,

    /**
     * Returns the singleton instance of this class
     * @return {qx.ui.mobile.core.Blocker} The Blocker singleton
     */
    getInstance: function() {
      var clazz = qx.ui.mobile.core.Blocker;
      if (!clazz.__instance) {
        clazz.__instance = new clazz();
      }
      return clazz.__instance;
    }
  },


  construct : function()
  {
    if (qx.ui.mobile.core.Blocker.__instance) {
      throw new Error("'" + this.classname + "' is a singleton class and can not be instantiated directly. Please use '" + this.classnme + ".getInstance()' instead.");
    }

    this.base(qx.ui.mobile.core.Widget, "constructor");

    if(qx.ui.mobile.core.Blocker.ROOT == null) {
      qx.ui.mobile.core.Blocker.ROOT = qx.core.Init.getApplication().getRoot();
    }
    this.forceHide();
    qx.ui.mobile.core.Blocker.ROOT.add(this);
  },


  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "blocker"
    }
  },


  members :
  {
    __count : 0,


    /**
     * Shows the blocker. When the show method is called a counter is incremented.
     * The {@link #hide} method needs to be called as many times as the {@link #show}
     * method. This behavior is useful, when you want to show a loading indicator.
     */
    show : function()
    {
      if (this.__count == 0)
      {
        this._updateSize();
        this.__registerEventListener();
        this.base(qx.ui.mobile.core.Widget, "show");
      }
      this.__count++;
      return this;
    },


    /**
     * Hides the blocker. The blocker is only hidden when the hide method
     * is called as many times as the {@link #show} method.
     */
    hide : function()
    {
      this.__count--;
      if (this.__count <= 0)
      {
        this.__count = 0;
        this.__unregisterEventListener();
        this.exclude();
      }
      return this;
    },


    /**
     * Force the blocker to hide, even when the show counter is larger than
     * zero.
     */
    forceHide : function()
    {
      this.__count = 0;
      this.hide();
      return this;
    },


    /**
     * Whether the blocker is shown or not.
     * @return {Boolean} <code>true</code> if the blocker is shown
     */
    isShown : function() {
      return this.__count > 0;
    },


    /**
     * Event handler. Called whenever the size of the blocker should be updated.
     */
    _updateSize : function()
    {
      if(qx.ui.mobile.core.Blocker.ROOT == this._getParentWidget())
      {
        this[0].style.top = qx.bom.Viewport.getScrollTop() + "px";
        this[0].style.left = qx.bom.Viewport.getScrollLeft() + "px";
        this[0].style.width = qx.bom.Viewport.getWidth() + "px";
        this[0].style.height = qx.bom.Viewport.getHeight()  + "px";
      }
      else if(this._getParentWidget() != null)
      {
        var dimension = qx.bom.element.Dimension.getSize(this._getParentWidget()[0]);
        this[0].style.width = dimension.width + "px";
        this[0].style.height = dimension.height  + "px";
      }
    },


    /**
     * Event handler. Called when the scroll event occurs.
     *
     * @param evt {Event} The scroll event
     */
    _onScroll : function(evt)
    {
      this._updateSize();
    },


    /**
     * Registers all needed event listener.
     */
    __registerEventListener : function()
    {
      qxWeb(window).on("resize", this._updateSize, this)
        .on("scroll", this._onScroll, this);
      this.on("pointerdown", qx.bom.Event.preventDefault, this);
      this.on("pointerup", qx.bom.Event.preventDefault, this);
    },


    /**
     * Unregisters all needed event listener.
     */
    __unregisterEventListener : function()
    {
      qxWeb(window).off("resize", this._updateSize, this)
        .off("scroll", this._onScroll, this);
      this.off("pointerdown", qx.bom.Event.preventDefault, this);
      this.off("pointerup", qx.bom.Event.preventDefault, this);
    },


    dispose : function() {
      this.base(qx.ui.mobile.core.Widget, "dispose");
      qx.ui.mobile.core.Blocker.ROOT.remove(this);
      this.__unregisterEventListener();
      delete qx.ui.mobile.core.Blocker.__instance;
    }
  }
});

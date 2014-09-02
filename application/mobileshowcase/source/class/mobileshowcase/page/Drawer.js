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
 * Mobile page showing the "Drawer" showcase.
 */
qx.Bootstrap.define("mobileshowcase.page.Drawer",
{
  extend : mobileshowcase.page.Abstract,

  construct : function()
  {
    this.base(mobileshowcase.page.Abstract, "constructor", false);
    this.title = "Drawer";
  },


  members :
  {
    /** Factory method for creation of drawers. */
    _createDrawer : function(orientation) {
      var drawer = new qx.ui.mobile.container.Drawer(this, new qx.ui.mobile.layout.VBox());
      drawer.orientation = orientation;
      drawer.tapOffset = 0;
      drawer.positionZ = "below";
      return drawer;
    },


    /** Factory method for the a demo drawer's content. */
    _createDrawerContent : function(target) {
      var closeDrawerButton = new qx.ui.mobile.Button("Close");
      closeDrawerButton.on("tap", function() {
        target.hide();
      }, this);

      var drawerContent = new qx.ui.mobile.form.Group([new qx.ui.mobile.form.Label("This is the "+target.orientation+" drawer."), closeDrawerButton]);
      return drawerContent;
    },


    /** Factory method for the a drawer menu. */
    _createDrawerMenu : function(drawers) {
      var drawerGroup = new qx.ui.mobile.form.Group();
      for(var i = 0; i < drawers.length; i++) {
        var openDrawerButton = new qx.ui.mobile.Button("Open "+drawers[i].orientation +" drawer");
        openDrawerButton.on("tap", drawers[i].show, drawers[i]);
        drawerGroup.append(openDrawerButton);
      }

      return drawerGroup;
    },


    // overridden
    _initialize : function()
    {
      this.base(mobileshowcase.page.Abstract, "_initialize");

      // DRAWERS

      var drawerSize = 175;

      var drawerBottom = this._createDrawer("bottom");
      drawerBottom.size = drawerSize;
      drawerBottom.append(this._createDrawerContent(drawerBottom));

      var drawerTop = this._createDrawer("top");
      drawerTop.size = drawerSize;
      drawerTop.append(this._createDrawerContent(drawerTop));

      var drawerLeft = this._createDrawer("left");
      drawerLeft.size = drawerSize;
      drawerLeft.append(this._createDrawerContent(drawerLeft));

      var drawerRight = this._createDrawer("right");
      drawerRight.size = drawerSize;
      drawerRight.append(this._createDrawerContent(drawerRight));

      // Z POSITION TOGGLE BUTTON

      var frontBackToggleButton = new qx.ui.mobile.form.ToggleButton(false, "Above","Below");

      frontBackToggleButton.on("changeValue",function() {
        this._togglePositionZ(drawerLeft);
        this._togglePositionZ(drawerRight);
        this._togglePositionZ(drawerTop);
        this._togglePositionZ(drawerBottom);
      },this);

      // PAGE CONTENT

      var toggleModeGroup = new qx.ui.mobile.form.Group([frontBackToggleButton]);

      this.getContent().append(new qx.ui.mobile.form.Title("Position"));
      this.getContent().append(toggleModeGroup);

      this.getContent().append(new qx.ui.mobile.form.Title("Action"));
      this.getContent().append(this._createDrawerMenu([drawerTop, drawerRight, drawerBottom, drawerLeft]));
    },


    /**
     * Toggles the z-Index position of the target drawer.
     */
    _togglePositionZ : function(target) {
      target.setStyle("transitionDuration", "0s");
      target.setStyle("position", "relative");

      if(target.positionZ == "above") {
        target.positionZ = "below";
      }
      else {
        target.positionZ = "above";
      }

      window.setTimeout(function() {
        this.setStyle("transitionDuration", null);
        this.setStyle("position", null);
      }.bind(target), 0);
    }
  }
});
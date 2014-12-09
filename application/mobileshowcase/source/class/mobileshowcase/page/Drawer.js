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
qx.Class.define("mobileshowcase.page.Drawer",
{
  extend : mobileshowcase.page.Abstract,

  construct : function()
  {
    this.super(mobileshowcase.page.Abstract, "construct", false);
    this.title = "Drawer";
  },


  members :
  {
    /** Factory method for creation of drawers. */
    _createDrawer : function(orientation) {
      var drawer = new qx.ui.container.Drawer(new qx.ui.layout.VBox());
      drawer.appendTo(this);
      drawer.orientation = orientation;
      drawer.tapOffset = 0;
      drawer.positionZ = "below";
      return drawer;
    },


    /** Factory method for the a demo drawer's content. */
    _createDrawerContent : function(target) {
      var closeDrawerButton = new qx.ui.Button("Close");
      closeDrawerButton.on("tap", function() {
        target.hide();
      }, this);

      var drawerContent = new qx.ui.form.Group("This is the " + target.orientation + " drawer.")
        .append(closeDrawerButton);
      return drawerContent;
    },


    /** Factory method for the a drawer menu. */
    _createDrawerMenu : function(drawers) {
      var drawerGroup = new qx.ui.form.Group();
      for(var i = 0; i < drawers.length; i++) {
        var openDrawerButton = new qx.ui.Button("Open "+ drawers[i].orientation + " drawer");
        openDrawerButton.on("tap", drawers[i].show, drawers[i]);
        drawerGroup.append(openDrawerButton);
      }

      return drawerGroup;
    },


    // overridden
    _initialize : function()
    {
      this.super(mobileshowcase.page.Abstract, "_initialize");

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

      var positionGroup = new qx.ui.form.Group("Position");
      var radioAbove = new qx.ui.form.RadioButton().set({
        name: "above",
        value: false
      });
      new qx.ui.form.Row(radioAbove, "Above")
        .appendTo(positionGroup);

      radioAbove.on("tap", function() {
        radioBelow.value = false;
        radioAbove.value = true;
        this._togglePositionZ(radioAbove.name, drawerLeft);
        this._togglePositionZ(radioAbove.name, drawerRight);
        this._togglePositionZ(radioAbove.name, drawerTop);
        this._togglePositionZ(radioAbove.name, drawerBottom);
      }, this);


      var radioBelow = new qx.ui.form.RadioButton().set({
        name: "below",
        value: true
      });
      new qx.ui.form.Row(radioBelow, "Below")
        .appendTo(positionGroup);

      radioBelow.on("tap", function() {
        radioAbove.value = false;
        radioBelow.value = true;
        this._togglePositionZ(radioBelow.name, drawerLeft);
        this._togglePositionZ(radioBelow.name, drawerRight);
        this._togglePositionZ(radioBelow.name, drawerTop);
        this._togglePositionZ(radioBelow.name, drawerBottom);
      }, this);

      // PAGE CONTENT
      this.getContent().append(positionGroup);
      var actionButtonGroup = new qx.ui.form.Group("Action")
       .append(this._createDrawerMenu([drawerTop, drawerRight, drawerBottom, drawerLeft]));

      this.getContent().append(actionButtonGroup);
    },


    /**
     * Toggles the z-Index position of the target drawer.
     */
    _togglePositionZ : function(position,target) {
      target.setStyle("transitionDuration", "0s");
      target.setStyle("position", "relative");

      if(position.indexOf("above")!= -1) {
        target.positionZ = "above";

      }
      else if (position.indexOf("below")!= -1) {
        target.positionZ = "below";

      }

      window.setTimeout(function() {
        this.setStyle("transitionDuration", null);
        this.setStyle("position", null);
      }.bind(target), 0);
    }
  }
});

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
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/*
 * If you have added resources to your app remove the leading '*' in the
 * following line to make use of them.


************************************************************************ */


define([
  "class/mobileshowcase/page/Overview",
  "class/mobileshowcase/page/Event",
  "class/mobileshowcase/page/Carousel",
  "class/mobileshowcase/page/Drawer",
  "class/mobileshowcase/page/List",
  "class/mobileshowcase/page/Tab",
  "class/mobileshowcase/page/Toolbar",
  "class/mobileshowcase/page/Form",
  "class/mobileshowcase/page/Animation",
  "class/mobileshowcase/page/AnimationLanding",
  "class/mobileshowcase/page/Basic",
  "class/mobileshowcase/page/Dialog",
  "class/mobileshowcase/page/DataBinding",
  "class/mobileshowcase/page/Maps",
  "class/mobileshowcase/page/Canvas",
  "class/mobileshowcase/page/Theming",
  "class/mobileshowcase/page/Tree"
], function(
  Overview,
  Event,
  Carousel,
  Drawer,
  List,
  Tab,
  Toolbar,
  Form,
  Animation,
  AnimationLanding,
  Basic,
  Dialog,
  DataBinding,
  Maps,
  Canvas,
  Theming,
  Tree
) {
/**
 * This is the main application class for the mobile showcase app.
 * @require(qx.log.appender.Console)
 * @asset(mobileshowcase/*)
 */
return qx.Class.define(null,
{
  extend : qx.application.Mobile,


  members :
  {
    /**
     * This method contains the initial application code and gets called
     * during startup of the application
     */
    main : function()
    {
      // Call super class
      this.super(qx.application.Mobile, "main");

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */

      // Create the pages
      var overview = new Overview();
      var events = new Event();
      var carousel = new Carousel();
      var drawer = new Drawer();
      var list = new List();
      var tab = new Tab();
      var toolbar = new Toolbar();
      var form = new Form();
      var animation = new Animation();
      var animationLanding = new AnimationLanding();
      var basic = new Basic();
      var dialogs = new Dialog();
      var dataBinding = new DataBinding();
      var maps = new Maps();
      var canvas = new Canvas();
      var theming = new Theming();
      var tree = new Tree();

      // Add the pages to the page manager
      var manager = new qx.ui.page.Manager();
      manager.addMaster(overview);
      manager.addDetail([
        basic,
        events,
        carousel,
        drawer,
        list,
        tab,
        toolbar,
        form,
        animation,
        animationLanding,
        dialogs,
        dataBinding,
        maps,
        canvas,
        theming,
        tree
      ]);

      // Initialize the navigation
      var routing = this.getRouting();

      if (qxWeb.env.get("device.type") == "tablet" ||
       qxWeb.env.get("device.type") == "desktop") {
        routing.onGet("/.*", this._show, overview);
        routing.onGet("/", this._show, basic);
      }

      routing.onGet("/", this._show, overview);
      routing.onGet("/basic", this._show, basic);
      routing.onGet("/dialog", this._show, dialogs);
      routing.onGet("/tab", this._show, tab);
      routing.onGet("/form", this._show, form);
      routing.onGet("/list", this._show, list);
      routing.onGet("/toolbar", this._show, toolbar);
      routing.onGet("/carousel", this._show, carousel);
      routing.onGet("/drawer", this._show, drawer);
      routing.onGet("/databinding", this._show, dataBinding);
      routing.onGet("/event", this._show, events);
      routing.onGet("/maps", this._show, maps);
      routing.onGet("/canvas", this._show, canvas);
      routing.onGet("/theming", this._show, theming);
      routing.onGet("/tree", this._show, tree);
      routing.onGet("/animation", this._show, animation);

      routing.onGet("/animation/{animation}", function(data) {
        animationLanding.animation = data.params.animation;
        if (animationLanding.visibility === "visible") {
          animation.show({
            "animation": data.params.animation
          });
        } else {
          animationLanding.show({
            "animation": data.params.animation
          });
        }
      }, this);

      routing.init();
    },


    /**
     * Default behaviour when a route matches. Displays the corresponding page on screen.
     * @param data {Map} the animation properties
     */
    _show : function(data) {
      this.show(data.customData);
    }
  }
});

});
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

define(function() {

/**
 * Mobile page responsible for showing the different showcases.
 */
return qx.Class.define(null, {
  extend : qx.ui.page.NavigationPage,

  construct : function()
  {
    this.super(qx.ui.page.NavigationPage, "construct");
    this.title = "Overview";
  },


  events :
  {
    /** The page to show */
    "show" : "qx.event.type.Data"
  },


  members :
  {
    // overridden
    _initialize : function()
    {
      this.super(qx.ui.page.NavigationPage, "_initialize");

      var list = new qx.ui.List({
        configureData : function(data) {
          data.showArrow = true;
          return data;
        }
      });

      var data = [
          {title : "Basic Widgets", subtitle : "Buttons, Labels, Images, Atoms...", path:"basic"},
          {title : "Dialog Widgets", subtitle : "Popups, Confirm Dialogs...", path:"dialog"},
          {title : "Form Elements", subtitle : "TextField, TextArea, Checkboxes...", path:"form"},
          {title : "List", subtitle : "A large list", path:"list"},
          {title : "Carousel", subtitle : "A carousel container", path:"carousel"},
          {title : "Drawer", subtitle : "Create a drawer container", path:"drawer"},
          {title : "Tab Bar/Accordion", subtitle : "Using tabs to switch views", path:"tab"},
          {title : "Toolbar", subtitle : "Toolbar buttons and separators", path:"toolbar"},
          {title : "Maps", subtitle : "Geolocation on a fullscreen map", path:"maps"},
          {title : "Canvas", subtitle : "Draw onto a HTML5 canvas", path:"canvas"},
          {title : "Events", subtitle : "Touch, Tap, Swipe...", path:"event"},
          {title : "Data Binding", subtitle : "See how data binding works", path:"databinding"},
          {title : "Page Transitions", subtitle : "Slide, Fade, Cube...", path:"animation"},
          {title : "Theming", subtitle : "Modify the look of an app...", path:"theming"},
          {title : "Tree", subtitle : "See how the tree widget works.", path:"tree"}
      ];

      list.model = new qx.data.Array(data);
      list.on("selected", function(el) {
        var row = el.getData("row");
        var path = data[row].path;
        qx.core.Init.getApplication().getRouting().executeGet("/"+path);
      }, this);

      this.getContent().append(list);

    }
  }
});

});
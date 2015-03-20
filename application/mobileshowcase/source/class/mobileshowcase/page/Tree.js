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

************************************************************************ */

/**
 * Mobile page showing the "Tree" showcase.
 */
qx.Class.define("mobileshowcase.page.Tree",
{
  extend : mobileshowcase.page.Abstract,

  construct : function()
  {
    this.super(mobileshowcase.page.Abstract, "construct");
    this.title = "Tree";
  },


  members :
  {
    // overridden
    _initialize : function()
    {
      this.super(mobileshowcase.page.Abstract, "_initialize");

      var data = {
        "result": {
          "id": 1, "name": "/",
          "children" : [
            {
              "id": "f1_1", "name": "My Pictures",
              "children" :
              [
                { "id": "f1_2", "name": "Work", "children": [] },
                {
                  "id": "f1_3", "name": "Vacations",
                  "children" :
                  [
                    { "id": "f1_3_1", "name": "France", "children": [] },
                    { "id": "f1_3_2", "name": "Italy", "children": [] },
                    { "id": "f1_3_3", "name": "Romania", "children": [] },
                    { "id": "f1_3_4", "name": "Spain", "children": [] },
                    { "id": "f1_3_5", "name": "Japan", "children": [] }
                  ]
                },
                { "id": "f1_4", "name": "Friends", "children": [] },
                { "id": "f1_5", "name": "Family", "children": [] },
                { "id": "f1_6", "name": "Wallpapers", "children": [] },
                { "id": "f1_7", "name": "Icons", "children": [] }
              ]
            },
            {
              "id": "f2_1", "name": "My Documents",
              "children" : [
                { "id": "f2_2", "name": "Homework", "children": [] },
                { "id": "f2_3", "name": "Reports", "children": [] }
              ]
            },
            { "id": "f3_1", "name": "My Music", "children": [] }
          ]
        }
      };

      var tree = new qx.ui.Tree();
      tree.appendTo(this.getContent());

      tree.setModel(data.result);

      // tree.on("selected", function(folder) {
      //   var label = qxWeb(folder).find("span:first-child");
      //   console.log("Selected Folder:", label.getHtml());
      // });
    }
  }
});

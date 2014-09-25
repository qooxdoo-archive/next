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
    this.base(mobileshowcase.page.Abstract, "constructor");
    this.title = "Tree";
  },


  members :
  {
    // overridden
    _initialize : function()
    {
      this.base(mobileshowcase.page.Abstract, "_initialize");

      var data = {
        "result": {
          "id": 1, "name": "/",
          "children" : [
            {
              "id": "1_1", "name": "My Pictures",
              "children" :
              [
                { "id": "1_2", "name": "Work", "children": [] },
                {
                  "id": "1_3", "name": "Vacations",
                  "children" :
                  [
                    { "id": "1_3_1", "name": "France", "children": [] },
                    { "id": "1_3_2", "name": "Italy", "children": [] },
                    { "id": "1_3_3", "name": "Romania", "children": [] },
                    { "id": "1_3_4", "name": "Spain", "children": [] },
                    { "id": "1_3_5", "name": "Japan", "children": [] }
                  ]
                },
                { "id": "1_4", "name": "Friends", "children": [] },
                { "id": "1_5", "name": "Family", "children": [] },
                { "id": "1_6", "name": "Wallpapers", "children": [] },
                { "id": "1_7", "name": "Icons", "children": [] }
              ]
            },
            {
              "id": "2_1", "name": "My Documents",
              "children" : [
                { "id": "2_2", "name": "Homework", "children": [] },
                { "id": "2_3", "name": "Reports", "children": [] }
              ]
            },
            { "id": "3_1", "name": "My Music", "children": [] }
          ]
        }
      };

      var tree = new qx.ui.mobile.tree.Tree();
      tree.appendTo(this.getContent());

      tree.setModel(data.result);

      tree.on("selectedFolder", function(e) {
        console.log("Selected Folder:", e);
      });
    }
  }
});
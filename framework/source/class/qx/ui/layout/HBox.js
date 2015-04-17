define(['qx/Class', 'qx/ui/layout/AbstractBox'], function(Dep0,Dep1) {
var qx = {
  "Class": Dep0,
  "ui": {
    "layout": {
      "AbstractBox": Dep1,
      "HBox": null
    }
  }
};

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
 * A horizontal box layout.
 *
 * The horizontal box layout lays out widgets in a horizontal row, from left
 * to right.
 *
 * *Item Properties*
 *
 * <ul>
 * <li><strong>flex</strong> <em>(Integer)</em>: The flex property determines how the container
 *   distributes remaining empty space among its children. If items are made
 *   flexible, they can grow or shrink accordingly. Their relative flex values
 *   determine how the items are being resized, i.e. the larger the flex ratio
 *   of two items, the larger the resizing of the first item compared to the
 *   second.
 * </li>
 * </ul>
 *
 * *Example*
 *
 * Here is a little example of how to use the HBox layout.
 *
 * <pre class="javascript">
 * var layout = new qx.ui.layout.HBox().set({alignX:"center"});
 *
 * var container = new qx.ui.Widget();
 * container.layout = layout;
 *
 * container.append(new qx.ui.Label("1"));
 * var item2 = new qx.ui.Label("2");
 * item2.layoutPrefs = {flex:1};
 * container.append(item2);
 * container.append(new qx.ui.Label("3"));
 * </pre>
 */
var clazz = qx.Class.define("qx.ui.layout.HBox",
{
  extend : qx.ui.layout.AbstractBox,


  members :
  {
    // overridden
    _getCssClasses : function(){
      return ["qx-hbox"];
    }
  }
});

 qx.ui.layout.HBox = clazz;
return clazz;
});

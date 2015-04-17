define(['qx/Class', 'qx/ui/Widget', 'qxWeb'], function(Dep0,Dep1,Dep2) {
var qx = {
  "Class": Dep0,
  "ui": {
    "Widget": Dep1,
    "form": {
      "Group": null
    }
  }
};
var qxWeb = Dep2;

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

/**
 * TODOC
 */
var clazz = qx.Class.define("qx.ui.form.Group",
{
  extend : qx.ui.Widget,

  /**
   * @attach {qxWeb, toGroup}
   * @return {qx.ui.form.Group} The new form group widget.
   */
  construct : function(title, element) {
    this.super("construct", element);
    if (title) {
      qxWeb.create('<h2 class="form-title">' + title + '</h2>').appendTo(this);
    }
  },


  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "group"
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

 qx.ui.form.Group = clazz;
return clazz;
});

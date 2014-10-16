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
 * A group widget visually arranges several widgets.
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *   var title = new qx.ui.mobile.form.Title("Group");
 *   var list = new qx.ui.mobile.list.List();
 *   var group = new qx.ui.mobile.form.Group([list]);
 *
 *   this.getRoot.append(title);
 *   this.getRoot.append(group);
 * </pre>
 *
 * This example creates a group and adds a list to it.
 */
qx.Class.define("qx.ui.mobile.form.Group",
{
  extend : qx.ui.mobile.Widget,

  construct : function(title) {
    this.base(qx.ui.mobile.Widget, "constructor");
    if (title) {
      qxWeb.create('<h2 class="form-title">' + title + '</h2>').appendTo(this);
    }
  },


  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "form-group"
    }
  }
});

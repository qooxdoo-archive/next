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
 * The Html widget embeds plain HTML code into the application
 *
 * *Example*
 *
 * Here is a little example of how to use the html widget.
 *
 * <pre class='javascript'>
 * var html = new qx.ui.mobile.embed.Html();
 * html.html = "<h1>Hello World</h1>";
 * </pre>
 *
 */
qx.Bootstrap.define("qx.ui.mobile.embed.Html",
{
  extend : qx.ui.mobile.Widget,


  /**
   * @param html {String?null} Initial HTML content
   */
  construct : function(html)
  {
    this.base(qx.ui.mobile.Widget, "constructor");
    if (html) {
      this.html = html;
    }
  },


  properties :
  {
    /** Any text string which can contain HTML, too */
    html :
    {
      check : "String",
      init : null,
      nullable : true,
      event : true,
      apply : "_applyHtml"
    }
  },


  members :
  {
    // property apply
    _applyHtml : function(value, old)
    {
      this.setHtml(value);
    }
  }
});

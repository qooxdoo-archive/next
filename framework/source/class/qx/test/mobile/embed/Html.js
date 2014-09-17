/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

qx.Class.define("qx.test.mobile.embed.Html",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testHtml : function() {
      var html = new qx.ui.mobile.embed.Html("<strong>affe</strong>");
      this.getRoot().append(html);

      this.assertString(html.html);
      this.assertEquals(html.html, "<strong>affe</strong>");
      this.assertEquals(html.html, html.getHtml());

      this.assertEventFired(html, "changeHtml", function() {
        html.html = "";
      });

      this.assertEquals(html.html, "");
      this.assertNull(html.getHtml());

      html.dispose();
    }
  }

});

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

qx.Class.define("qx.test.mobile.navigationbar.NavigationBar",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testCreate : function()
    {
      var bar = new qx.ui.navigationbar.NavigationBar();
      this.getRoot().append(bar);

      var back = new qx.ui.Button("Back");
      bar.append(back);

      var title = new qx.ui.navigationbar.Title("Title");
      bar.append(title);

      var button = new qx.ui.Button("Action");
      bar.append(button);

      this.assertEquals(3, bar.getChildren().length);

      back.dispose();
      title.dispose();
      button.dispose();
      bar.dispose();
    }
  }

});

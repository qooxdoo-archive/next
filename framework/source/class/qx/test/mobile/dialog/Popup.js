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

qx.Bootstrap.define("qx.test.mobile.dialog.Popup",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testShow: function() {
      var label = new qx.ui.mobile.basic.Label("test");
      var popup = new qx.ui.mobile.dialog.Popup(label);

      this.assertNotEquals("visible", popup.visibility);

      popup.show();

      this.assertEquals("visible", popup.visibility);

      label.dispose();
      popup.dispose();
    },


    testShowHide : function() {
      this.require(["debug"]);

      var popup = new qx.ui.mobile.dialog.Popup(new qx.ui.mobile.core.Widget());

      // Modal mode false test cases, no changes expected.
      popup.modal = false;
      popup.show();

      this.assertEquals("visible", popup.visibility, 'popup should be visible.');
      this.assertEquals(0, qxWeb(document.body).getChildren(".blocker").length, 'Modal mode is false, blocker should be still hidden.');

      popup.hide();

      this.assertNotEquals("visible", popup.visibility, 'popup should not be visible.');
      this.assertEquals(0, qxWeb(document.body).getChildren(".blocker").length, 'Modal mode is false, called popup.hide(), blocker should be still hidden.');

      popup.show();

      this.assertEquals(0, qxWeb(document.body).getChildren(".blocker").length, 'Modal mode is false, called popup.show(), blocker should be still hidden.');
      this.assertEquals("visible", popup.visibility, 'popup should be visible.');

      // Modal mode true test cases
      popup.modal = true;
      popup.show();

      this.assertEquals(1, qxWeb(document.body).getChildren(".blocker").length, 'Modal mode is true, called popup.show(), Blocker should be shown.');

      popup.hide();
      this.assertEquals(0, qxWeb(document.body).getChildren(".blocker").length, 'Modal mode is true, called dialog.hide(), Blocker should not be shown.');
      popup.dispose();
    },


    hasDebug: function() {
      return qx.core.Environment.get("qx.debug");
    }
  }

});

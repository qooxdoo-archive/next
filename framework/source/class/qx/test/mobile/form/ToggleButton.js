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

qx.Class.define("qx.test.mobile.form.ToggleButton",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testValue : function()
    {
      var button = new qx.ui.form.ToggleButton(true);
      this.getRoot().append(button);

      this.assertBoolean(button.getValue());
      this.assertTrue(button.getValue());
      this.assertTrue(button.hasClass("checked"));

      this.assertEventFired(button, "changeValue", function() {
        button.setValue(false);
      });

      this.assertFalse(button.getValue());

      button.dispose();
    },


    testToggle : function()
    {
      var button = new qx.ui.form.ToggleButton(true);
      this.getRoot().append(button);

      this.assertBoolean(button.getValue());
      this.assertTrue(button.getValue());

      button.toggle();
      this.assertFalse(button.getValue());

      button.toggle();
      this.assertTrue(button.getValue());

      button.dispose();
    }
  }

});

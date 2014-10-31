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

qx.Class.define("qx.test.mobile.form.CheckBox",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testValue : function()
    {
      var checkBox = new qx.ui.form.CheckBox(false);
      this.getRoot().append(checkBox);

      this.assertEquals(false,checkBox.getValue());
      this.assertEquals(false, qxWeb(checkBox[0]).hasClass("checked"));

      checkBox.setValue(true);
      this.assertEquals(true,checkBox.getValue());
      this.assertEquals(true, qxWeb(checkBox[0]).hasClass("checked"));

      checkBox.dispose();
    },

    testEnabled : function()
    {
      var checkBox = new qx.ui.form.CheckBox();
      this.getRoot().append(checkBox);
      checkBox.enabled = false;
      this.assertEquals(false,checkBox.enabled);
      this.assertEquals(true,qx.bom.element.Class.has(checkBox[0],'disabled'));

      checkBox.dispose();
    },

    testFactory: function() {
      var checkBox = qxWeb.create("<div>").checkBox().appendTo(this.getRoot());
      this.assertInstance(checkBox, qx.ui.form.CheckBox);
      this.assertEquals(checkBox, checkBox[0].$$widget);
      this.wait(100, function() {
        this.assertEquals("qx.ui.form.CheckBox", checkBox.getData("qxWidget"));
      }, this);
    }

  }
});

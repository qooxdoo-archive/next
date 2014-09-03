/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2011-2013 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

qx.Bootstrap.define("qx.test.mobile.form.Label",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testLabelForTarget : function()
    {
      var label = new qx.ui.mobile.form.Label("foo-label");
      var target = new qx.ui.mobile.form.TextField("foo");
      label.setLabelFor(target.getAttribute("id"));

      var foundValue = label.getAttribute("for");

      this.assertEquals(target.getAttribute("id"),foundValue,"'For' attribute has an unexpected value.");

      label.dispose();
      target.dispose();
    },


    testDisableTarget : function()
    {
      var label = new qx.ui.mobile.form.Label("foo-label");
      var target = new qx.ui.mobile.form.TextField("foo");

      target.enabled = false;

      label.setLabelFor(target.getAttribute("id"));

      // check if state is considered before label.for is set.
      this.assertFalse(label.enabled);

      target.enabled = true;

      this.assertTrue(label.enabled);

      target.enabled = false;

      this.assertFalse(label.enabled);

      label.dispose();
      target.dispose();
    }
  }

});

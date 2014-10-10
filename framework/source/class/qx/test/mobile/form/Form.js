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

qx.Class.define("qx.test.mobile.form.Form",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {

    __form: null,
    __username: null,

    setUp: function() {
      this.base(qx.test.mobile.MobileTestCase, "setUp");
      this.__form = this.__createForm();
    },

    tearDown: function() {
      this.base(qx.test.mobile.MobileTestCase, "tearDown");
      this.__username.dispose();
      this.__form.dispose();
    },

    testCheckValidity: function() {
      this.assertFalse(this.__form.checkValidity());

      this.__username.setValue('myusername');
      this.assertTrue(this.__form.checkValidity());
    },

    testChangeRequired: function() {
      this.assertFalse(this.__form.checkValidity());

      this.__username.required = false;
      this.assertTrue(this.__form.checkValidity());
    },

    testReset: function() {
      this.__username.value = "Foo";
      this.assertEquals("Foo", this.__username.value);
      this.assertTrue(this.__form.checkValidity());
      this.__form.reset();
      this.assertEquals(null, this.__username.value);
      this.assertFalse(this.__form.checkValidity());
    },

    testResetRemoved: function() {
      this.__username.value = "Foo";
      this.assertEquals("Foo", this.__username.value);
      this.assertTrue(this.__form.checkValidity());
      this.__username.remove();
      this.__form.reset();
      this.assertEquals("Foo", this.__username.value);
      this.assertTrue(this.__form.checkValidity());
    },

    __createForm: function()
    {
      var form = new qx.ui.mobile.form.Form()
        .appendTo(this.getRoot());

      var username = this.__username = new qx.ui.mobile.form.TextField();
      username.placeholder = "Username";
      username.required = true;
      username.appendTo(form);

      return form;
    }

  }
});

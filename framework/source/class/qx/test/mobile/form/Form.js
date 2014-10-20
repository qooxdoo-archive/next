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
      this.super(qx.test.mobile.MobileTestCase, "setUp");
      this.__form = this.__createForm();
    },

    tearDown: function() {
      this.super(qx.test.mobile.MobileTestCase, "tearDown");
      this.__username.dispose();
      this.__form.dispose();
    },

    testReset: function() {
      this.__username.value = "Foo";
      this.assertEquals("Foo", this.__username.value);
      this.__form.reset();
      this.assertEquals(null, this.__username.value);
    },

    testResetRemoved: function() {
      this.__username.value = "Foo";
      this.assertEquals("Foo", this.__username.value);
      this.__username.remove();
      this.__form.reset();
      this.assertEquals("Foo", this.__username.value);
    },

    __createForm: function()
    {
      var form = new qx.ui.mobile.form.Form()
        .appendTo(this.getRoot());

      var username = this.__username = new qx.ui.mobile.form.TextField();
      username.placeholder = "Username";
      username.required = true;
      new qx.ui.mobile.form.Row(username, "User Name").appendTo(form);

      return form;
    }

  }
});

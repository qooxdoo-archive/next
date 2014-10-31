/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

************************************************************************ */

qx.Class.define("qx.test.mobile.form.Row",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {

    __tf: null,
    __row: null,
    __nameInvalidMsg: "Please enter a value",

    setUp: function() {
      this.super(qx.test.mobile.MobileTestCase, "setUp");
      this.__tf = new qx.ui.form.TextField().set({
        required: true,
        validationMessage: this.__nameInvalidMsg
      });
      this.__row = new qx.ui.form.Row(this.__tf, "Name")
        .appendTo(this.getRoot());
    },

    tearDown: function() {
      this.super(qx.test.mobile.MobileTestCase, "tearDown");
      this.__tf.dispose();
      this.__row.dispose();
    },

    testChangeInvalid: function() {
      this.assertEquals(0, this.__row.find(".form-element-error").length);
      this.__tf.validate();
      this.assertEquals(1, this.__row.find(".form-element-error").length);
      this.assertEquals(this.__nameInvalidMsg, this.__row.find(".form-element-error")[0].textContent);
      this.__tf.value = "Foo";
      this.assertEquals(0, this.__row.find(".form-element-error").length);
    }

  }
});

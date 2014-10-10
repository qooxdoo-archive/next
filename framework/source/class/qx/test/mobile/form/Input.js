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

qx.Class.define("qx.test.mobile.form.Input", {

  extend: qx.test.mobile.MobileTestCase,

  members: {

    setUp: function() {
      this.base(qx.test.mobile.MobileTestCase, "setUp");
      this.__item = new qx.ui.mobile.form.Input();
      this.getRoot().append(this.__item);
    },

    testCreation: function() {
      this.assertEquals("input", this.__item[0].nodeName.toLowerCase());
      this.__item.type = "text";
      this.assertEquals("text", this.__item.getAttribute("type"));
    },

    testRequired: function() {
      this.assertFalse(this.__item.getAttribute("required"));
      this.assertFalse(this.__item.hasClass("invalid"));
      this.__item.required = true;
      this.assertTrue(this.__item.getAttribute("required"));
      this.assertTrue(this.__item.hasClass("invalid"));
      this.__item.required = false;
      this.assertFalse(this.__item.getAttribute("required"));
      this.assertFalse(this.__item.hasClass("invalid"));
    },

    testValidity: function() {
      this.__item.type = "text";
      this.assertTrue(this.__item.validity.valid);
      this.assertFalse(this.__item.hasClass("invalid"));
      this.__item.required = true;
      this.assertFalse(this.__item.validity.valid);
      this.assertTrue(this.__item.hasClass("invalid"));
      this.__item.setValue("Foo");
      this.assertTrue(this.__item.validity.valid);
      this.assertFalse(this.__item.hasClass("invalid"));
      this.__item.setValue("");
      this.assertFalse(this.__item.validity.valid);
      this.assertTrue(this.__item.hasClass("invalid"));
    },

    testValueMissing: function() {
      this.__item.type = "text";
      this.assertFalse(this.__item.validity.valueMissing);
      this.__item.required = true;
      this.assertTrue(this.__item.validity.valueMissing);
      this.__item.setValue("Foo");
      this.assertFalse(this.__item.validity.valueMissing);
      this.__item.setValue("");
      this.assertTrue(this.__item.validity.valueMissing);
    },

    testSetCustomValidity: function() {
      var msg = "Invalid value";
      this.__item.setCustomValidity(msg);
      this.assertFalse(this.__item.validity.valid);
      this.assertTrue(this.__item.hasClass("invalid"));
      this.assertEquals(msg, this.__item.validationMessage);
      this.__item.setCustomValidity("");
      this.assertTrue(this.__item.validity.valid);
      this.assertFalse(this.__item.hasClass("invalid"));
      this.assertEquals("", this.__item.validationMessage);
    },

    testInvalidEvent: function() {
      this.__item.required = true;
      this.assertEventFired(this.__item, "invalid", function() {
        this.assertFalse(this.__item.checkValidity());
        this.assertFalse(this.__item.validity.valid);
        this.assertTrue(this.__item.hasClass("invalid"));
      }.bind(this));
    }
  }
});
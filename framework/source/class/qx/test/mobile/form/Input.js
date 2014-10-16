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
      this.__item.required = true;
      this.assertTrue(this.__item.valid);
      this.assertFalse(this.__item.hasClass("invalid"));

      this.assertEventFired(this.__item, "changeValid", function() {
        this.__item.validate();
      }.bind(this), function(e) {
        this.assertFalse(e.target.valid);
        this.assertTrue(this.__item.hasClass("invalid"));
      }.bind(this));

      this.assertEventFired(this.__item, "changeValid", function() {
        this.__item.value = "Foo";
      }.bind(this), function(e) {
        this.assertTrue(e.target.valid);
        this.assertFalse(this.__item.hasClass("invalid"));
      }.bind(this));

      this.__item.value = null;
      this.assertFalse(this.__item.valid);
      this.assertTrue(this.__item.hasClass("invalid"));

      this.assertEventFired(this.__item, "changeValid", function() {
        this.__item.required = false;
      }.bind(this), function(e) {
        this.assertTrue(e.target.valid);
        this.assertFalse(this.__item.hasClass("invalid"));
      }.bind(this));
    },

    testCustomValidator: function() {
      this.assertTrue(this.__item.valid);
      var validator = function(value) {
        return false;
      };

      this.assertEventFired(this.__item, "changeValid", function() {
        this.__item.validator = validator;
      }.bind(this), function(e) {
        this.assertFalse(e.value);
        this.assertTrue(e.old);
        this.assertFalse(e.target.valid);
      }.bind(this));

      this.assertEventFired(this.__item, "changeValid", function() {
        this.__item.validator = null;
      }.bind(this), function(e) {
        this.assertTrue(e.value);
        this.assertFalse(e.old);
        this.assertTrue(e.target.valid);
      }.bind(this));
    }
  }
});
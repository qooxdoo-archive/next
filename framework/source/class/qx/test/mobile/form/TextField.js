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

qx.Class.define("qx.test.mobile.form.TextField",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    setUp: function() {
      this.base(qx.test.mobile.MobileTestCase, "setUp");
      this.__tf = new qx.ui.mobile.form.TextField()
        .appendTo(this.getRoot());
    },

    testValue : function()
    {
      this.getRoot().append(this.__tf);

      this.assertEquals(null,this.__tf.value);
      this.assertEquals(null,qx.bom.element.Attribute.get(this.__tf[0],'value'));
      this.assertEventFired(this.__tf, "changeValue", function() {
        this.__tf.value = "mytext";
      }.bind(this));
      this.assertEquals('mytext',this.__tf.value);
      this.assertEquals('mytext',qx.bom.element.Attribute.get(this.__tf[0],'value'));

      this.__tf.dispose();

      this.__tf = new qx.ui.mobile.form.TextField('affe');
      this.getRoot().append(this.__tf);
      this.assertEquals('affe',this.__tf.value);
      this.assertEquals('affe',qx.bom.element.Attribute.get(this.__tf[0],'value'));
      this.__tf.dispose();
    },


    testEnabled : function()
    {
      this.getRoot().append(this.__tf);
      this.assertEquals(true,this.__tf.enabled);
      this.assertFalse(qx.bom.element.Class.has(this.__tf[0],'disabled'));

      this.__tf.enabled = false;
      this.assertEquals(false,this.__tf.enabled);
      this.assertEquals(true,qx.bom.element.Class.has(this.__tf[0],'disabled'));

      this.__tf.dispose();
    },


    testPattern: function() {
      var pattern = ".{3,}";
      this.__tf.pattern = pattern;
      this.assertTrue(this.__tf.valid);

      this.assertEventFired(this.__tf, "changeValid", function() {
        this.__tf.value = "aa";
      }.bind(this), function(e) {
        this.assertFalse(e.value);
        this.assertTrue(e.old);
        this.assertFalse(e.target.valid);
      }.bind(this));

      this.assertEventFired(this.__tf, "changeValid", function() {
        this.__tf.value = "Foo";
      }.bind(this), function(e) {
        this.assertTrue(e.value);
        this.assertFalse(e.old);
        this.assertTrue(e.target.valid);
      }.bind(this));

      this.assertEventFired(this.__tf, "changeValid", function() {
        this.__tf.pattern = "aa";
      }.bind(this), function(e) {
        this.assertFalse(e.value);
        this.assertTrue(e.old);
        this.assertFalse(e.target.valid);
      }.bind(this));

      this.assertEventFired(this.__tf, "changeValid", function() {
        this.__tf.value = "";
      }.bind(this), function(e) {
        this.assertTrue(e.target.valid);
      }.bind(this));
    },


    testMaxLength: function() {
      this.__tf.maxLength = 1;
      this.__tf.value = "Foo";
      this.assertEquals("F", this.__tf.value);
      this.__tf.maxLength = null;
      this.__tf.value = "Foo";
      this.assertEquals("Foo", this.__tf.value);
      this.__tf.maxLength = 1;
      this.assertEquals("F", this.__tf.value);
    },


    testMaxLengthIllegal: function() {
      this.__tf.maxLength = 1;
      this.__tf[0].value = "Foo";
      this.assertEventFired(this.__tf, "changeValid", function() {
        this.__tf.validate();
      }.bind(this), function(e) {
        this.assertFalse(e.value);
        this.assertTrue(e.old);
        this.assertFalse(e.target.valid);
      }.bind(this));
    },


    testTypeEmail: function() {
      this.__tf.type = "email";
      this.assertEquals("email", this.__tf[0].getAttribute("type"));
      this.assertTrue(this.__tf.valid);

      this.assertEventFired(this.__tf, "changeValid", function() {
        this.__tf.value = "Foo";
      }.bind(this), function(e) {
        this.assertFalse(e.value);
        this.assertTrue(e.old);
        this.assertFalse(e.target.valid);
      }.bind(this));

      this.assertEventFired(this.__tf, "changeValid", function() {
        this.__tf.value = "foo@example.com";
      }.bind(this), function(e) {
        this.assertTrue(e.value);
        this.assertFalse(e.old);
        this.assertTrue(e.target.valid);
      }.bind(this));
    },


    testTypeUrl: function() {
      this.__tf.type = "url";
      this.assertEquals("url", this.__tf[0].getAttribute("type"));
      this.assertTrue(this.__tf.valid);

      this.assertEventFired(this.__tf, "changeValid", function() {
        this.__tf.value = "Foo";
      }.bind(this), function(e) {
        this.assertFalse(e.value);
        this.assertTrue(e.old);
        this.assertFalse(e.target.valid);
      }.bind(this));

      this.assertEventFired(this.__tf, "changeValid", function() {
        this.__tf.value = "http://www.example.com";
      }.bind(this), function(e) {
        this.assertTrue(e.value);
        this.assertFalse(e.old);
        this.assertTrue(e.target.valid);
      }.bind(this));
    }

  }
});

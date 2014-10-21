/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

qx.Class.define("qx.test.mobile.form.NumberField",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    setUp: function() {
      this.super(qx.test.mobile.MobileTestCase, "setUp");
      this.__nf = new qx.ui.mobile.form.NumberField()
        .appendTo(this.getRoot());
    },

    tearDown: function() {
      this.super(qx.test.mobile.MobileTestCase, "tearDown");
      this.__nf.dispose();
    },

    testValue : function()
    {
      this.assertEquals(null, this.__nf.getValue());
      this.assertEquals(null, qx.bom.element.Attribute.get(this.__nf[0],'value'));
      this.assertEventFired(this.__nf, "changeValue", function() {
        this.__nf.setValue(15);
      }.bind(this));

      this.assertEquals(15, this.__nf.getValue());
      this.assertEquals(15, qx.bom.element.Attribute.get(this.__nf[0],'value'));
    },


    testMinimum : function()
    {
      this.assertUndefined(this.__nf.minimum);
      this.assertNull(this.__nf.getAttribute("min"));

      this.__nf.minimum = 42;
      this.assertEquals(42, this.__nf.minimum);
      this.assertEquals(42, this.__nf.getAttribute("min"));
      this.assertTrue(this.__nf.valid);

      this.assertEventFired(this.__nf, "changeValid", function() {
        this.__nf.value = 41;
        this.assertEquals(41, this.__nf.value);
        this.assertFalse(this.__nf.valid);
      }.bind(this));

      this.__nf.minimum = null;
      this.assertTrue(this.__nf.valid);
    },


    testMaximum : function()
    {
      this.assertUndefined(this.__nf.maximum);
      this.assertNull(this.__nf.getAttribute("max"));

      this.__nf.maximum = 42;
      this.assertEquals(42, this.__nf.maximum);
      this.assertEquals(42, this.__nf.getAttribute("max"));
      this.assertTrue(this.__nf.valid);

      this.assertEventFired(this.__nf, "changeValid", function() {
        this.__nf.value = 43;
        this.assertEquals(43, this.__nf.value);
        this.assertFalse(this.__nf.valid);
      }.bind(this));

      this.__nf.maximum = null;
      this.assertTrue(this.__nf.valid);
    },


    testStep : function()
    {
      this.assertUndefined(this.__nf.step);

      this.__nf.step = 10;
      this.assertEquals(10, this.__nf.step);
      this.assertEquals(10, this.__nf.getAttribute("step"));
      this.assertTrue(this.__nf.valid);

      this.assertEventFired(this.__nf, "changeValid", function() {
        this.__nf.value = 12;
        this.assertEquals(12, this.__nf.value);
        this.assertFalse(this.__nf.valid);
      }.bind(this));

      this.__nf.step = null;
      this.assertTrue(this.__nf.valid);
    },


    testResetValue : function()
    {
      this.assertEquals(null, this.__nf.getValue());
      this.assertNull(qx.bom.element.Attribute.get(this.__nf[0],'value'));

      this.__nf.setValue(15);
      this.assertEquals(15,this.__nf.getValue());

      this.__nf.resetValue();

      this.assertNull(qx.bom.element.Attribute.get(this.__nf[0],'value'));
      this.assertEquals(null,this.__nf.getValue());
    },


    testEnabled : function()
    {
      this.assertTrue(this.__nf.enabled);
      this.assertFalse(qx.bom.element.Class.has(this.__nf[0],'disabled'));

      this.__nf.enabled = false;
      this.assertFalse(this.__nf.enabled);
      this.assertTrue(qx.bom.element.Class.has(this.__nf[0],'disabled'));
    }

  }
});

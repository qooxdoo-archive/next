/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */

/**
 * Test-Class for testing the single value binding
 */
qx.Class.define("qx.test.data.singlevalue.WithQxWeb",
{
  extend : qx.dev.unit.TestCase,
  include : qx.dev.unit.MRequirements,

  construct : function() {
    this.C = qx.Class.define(null, {
      extend : qxWeb,
      properties : {
        p1: {
          event: true,
          nullable: true
        },
        p2: {
          event: true,
          nullable: true
        }
      }
    });
  },

  members :
  {
    __a : null,
    __b: null,

    setUp : function() {
      this.__a = new this.C();
      this.__b = new this.C();
      this.__c = new this.C();

      this.__a.add(qxWeb.create("<div>"));
      this.__b.add(qxWeb.create("<div>"));
      this.__c.add(qxWeb.create("<div>"));
    },


    testStringPropertyBinding : function()
    {
      qx.data.SingleValueBinding.bind(this.__a, "p1", this.__b, "p2");
      this.__a.p1 = "affe";
      this.assertEquals("affe", this.__b.p2, "String binding does not work!");

      this.__c.p1 = "Jonny";
      qx.data.SingleValueBinding.bind(this.__c, "p1", this.__b, "p1");
      this.assertEquals("Jonny", this.__b.p1, "String binding does not work!");
    },


    testDepthOf2: function() {
      // create a hierarchy
      // a[p1] --> b
      this.__a.p1 = this.__b;

      // create the binding
      // a[p1] = b[p1] --> a[p2]
      qx.data.SingleValueBinding.bind(this.__a, "p1.p1", this.__a, "p2");

      // just set the name of the second component
      this.__b.p1 = "B";
      this.assertEquals("B", this.__a.p2, "Deep binding does not work with updating the first parameter.");
      // change the second component
      // a[p1] = c[p1] --> a[p2]
      this.__c.p1 = "C";
      this.__a.p1 = this.__c;
      this.assertEquals("C", this.__a.p2, "Deep binding does not work with updating the first parameter.");
      // check for the null value
      // a --> null
      this.__a.p1 = null;
      this.assertNull(this.__a.p2, "Binding does not work with null.");
    },


    testDeepTarget: function() {
      this.__a.p1 = "1";
      this.__a.p2 = this.__b;
      qx.data.SingleValueBinding.bind(this.__a, "p1", this.__a, "p2.p1");

      this.assertEquals("1", this.__b.p1, "Deep binding on the target does not work.");

      this.__a.p1 = "123";
      this.assertEquals("123", this.__b.p1, "Deep binding on the target does not work.");

      this.__a.p2 = this.__c;
      this.assertEquals("123", this.__c.p1, "Deep binding on the target does not work.");
    }
  }
});

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

 
  //include : qx.dev.unit.MRequirements,

  // construct : function() {
  //   C = qx.Class.define(null, {
  //     extend : qxWeb,
  //     properties : {
  //       p1: {
  //         event: true,
  //         nullable: true
  //       },
  //       p2: {
  //         event: true,
  //         nullable: true
  //       }
  //     }
  //   });
  // }

  
   var __a = null;
   var __b = null;
describe("data.singlevalue.WithQxWeb", function() {
  C = qx.Class.define(null, {
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

  beforeEach (function () {
    __a = new C();
    __b = new C();
    __c = new C();

    __a.add(qxWeb.create("<div>"));
    __b.add(qxWeb.create("<div>"));
    __c.add(qxWeb.create("<div>"));
  });
 
 it("StringPropertyBinding", function() {
      qx.data.SingleValueBinding.bind(__a, "p1", __b, "p2");
      __a.p1 = "affe";
      assert.equal("affe", __b.p2, "String binding does not work!");

      __c.p1 = "Jonny";
      qx.data.SingleValueBinding.bind(__c, "p1", __b, "p1");
      assert.equal("Jonny", __b.p1, "String binding does not work!");
  });
 
  it("DepthOf2", function() {
      // create a hierarchy
      // a[p1] --> b
      __a.p1 = __b;

      // create the binding
      // a[p1] = b[p1] --> a[p2]
      qx.data.SingleValueBinding.bind(__a, "p1.p1", __a, "p2");

      // just set the name of the second component
      __b.p1 = "B";
      assert.equal("B", __a.p2, "Deep binding does not work with updating the first parameter.");
      // change the second component
      // a[p1] = c[p1] --> a[p2]
      __c.p1 = "C";
      __a.p1 = __c;
      assert.equal("C", __a.p2, "Deep binding does not work with updating the first parameter.");
      // check for the null value
      // a --> null
      __a.p1 = null;
      assert.isNull(__a.p2, "Binding does not work with null.");
  });
 
  it("DeepTarget", function() {
      __a.p1 = "1";
      __a.p2 = __b;
      qx.data.SingleValueBinding.bind(__a, "p1", __a, "p2.p1");

      assert.equal("1", __b.p1, "Deep binding on the target does not work.");

      __a.p1 = "123";
      assert.equal("123", __b.p1, "Deep binding on the target does not work.");

      __a.p2 = __c;
      assert.equal("123", __c.p1, "Deep binding on the target does not work.");
  });
});

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
describe("data.singlevalue.WithQxWeb", function() {
  var __c;

  beforeEach(function() {
    var C = qx.Class.define(null, {
      extend: qxWeb,
      properties: {
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

    this.__a = new C();
    this.__b = new C();
    __c = new C();

    this.__a.add(qxWeb.create("<div>"));
    this.__b.add(qxWeb.create("<div>"));
    __c.add(qxWeb.create("<div>"));
  });


  it("StringPropertyBinding", function() {
    qx.data.SingleValueBinding.bind(this.__a, "p1", this.__b, "p2");
    this.__a.p1 = "affe";
    assert.equal("affe", this.__b.p2, "String binding does not work!");

    __c.p1 = "Jonny";
    qx.data.SingleValueBinding.bind(__c, "p1", this.__b, "p1");
    assert.equal("Jonny", this.__b.p1, "String binding does not work!");
  });


  it("DepthOf2", function() {
    // create a hierarchy
    // a[p1] --> b
    this.__a.p1 = this.__b;

    // create the binding
    // a[p1] = b[p1] --> a[p2]
    qx.data.SingleValueBinding.bind(this.__a, "p1.p1", this.__a, "p2");

    // just set the name of the second component
    this.__b.p1 = "B";
    assert.equal("B", this.__a.p2, "Deep binding does not work with updating the first parameter.");
    // change the second component
    // a[p1] = c[p1] --> a[p2]
    __c.p1 = "C";
    this.__a.p1 = __c;
    assert.equal("C", this.__a.p2, "Deep binding does not work with updating the first parameter.");
    // check for the null value
    // a --> null
    this.__a.p1 = null;
    assert.isNull(this.__a.p2, "Binding does not work with null.");
  });


  it("DeepTarget", function() {
    this.__a.p1 = "1";
    this.__a.p2 = this.__b;
    qx.data.SingleValueBinding.bind(this.__a, "p1", this.__a, "p2.p1");

    assert.equal("1", this.__b.p1, "Deep binding on the target does not work.");

    this.__a.p1 = "123";
    assert.equal("123", this.__b.p1, "Deep binding on the target does not work.");

    this.__a.p2 = __c;
    assert.equal("123", __c.p1, "Deep binding on the target does not work.");
  });
});

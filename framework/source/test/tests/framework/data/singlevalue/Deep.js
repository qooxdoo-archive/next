/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */
/**
 * Test-Class for testing the single value binding
 *
 * @ignore(qx.test.MultiBinding)
 */
// define a test class
qx.Class.define("qx.test.MultiBinding", {

  extend: Object,
  include: [qx.event.MEmitter],

  properties: {
    child: {
      event: true,
      nullable: true
    },

    childWithout: {
      nullable: true
    },

    name: {
      check: "String",
      nullable: true,
      init: "Juhu",
      event: true
    },

    array: {
      init: null,
      event: true
    },

    lab: {
      event: true
    }
  }
});

describe("data.singlevalue.Deep", function() {

  var __a = null;
  var __b1 = null;
  var __b2 = null;
  var __label = null;

  beforeEach(function() {
    __a = new qx.test.MultiBinding();
    __a.name = "a";
    __a.lab = new data.singlevalue.TextFieldDummy("");
    __a.array = new qx.data.Array(["one", "two", "three"]);

    __b1 = new qx.test.MultiBinding();
    __b1.name = "b1";
    __b1.lab = new data.singlevalue.TextFieldDummy("");
    __b1.array = new qx.data.Array(["one", "two", "three"]);

    __b2 = new qx.test.MultiBinding();
    __b2.name = "b2";
    __b2.lab = new data.singlevalue.TextFieldDummy("");
    __b2.array = new qx.data.Array(["one", "two", "three"]);

    __label = new data.singlevalue.TextFieldDummy();
  });


  it("ConverterChainBroken", function() {
    var m = qx.data.marshal.Json.createModel({
      a: {
        a: 1
      },
      b: 2
    });
    var called = 0;
    qx.data.SingleValueBinding.bind(m, "a.a", m, "b", {
      converter: function(data) {
        called++;
        return 3;
      }
    });
    // check the init values
    assert.equal(1, called);
    assert.equal(3, m.b);

    // set the binding leaf to null
    m.a.a = null;
    assert.equal(2, called);
    assert.equal(3, m.b);

    // set the binding root to null
    m.a = null;
    assert.equal(3, called);
    assert.equal(3, m.b);
  });


  it("ConverterChainBrokenInitialNull", function() {
    var m = qx.data.marshal.Json.createModel({
      a: null
    });
    var t = qx.data.marshal.Json.createModel({
      a: null
    });

    var spy = sinon.spy(function() {
      return 123;
    });
    qx.data.SingleValueBinding.bind(m, "a.b", t, "a", {
      converter: spy
    });
    assert(spy.calledOnce);
    assert(spy.calledWith(undefined, undefined, m, t))
    assert.equal(123, t.a);
  });


  it("DepthOf2", function() {
    // create a hierarchy
    // a --> b1
    __a.child = (__b1);

    // create the binding
    // a --> b1 --> label
    qx.data.SingleValueBinding.bind(__a, "child.name", __label, "value");

    // just set the name of the second component
    __b1.name = ("B1");
    assert.equal("B1", __label.value, "Deep binding does not work with updating the first parameter.");
    // change the second component
    // a --> b2 --> label
    __a.child = (__b2);
    assert.equal("b2", __label.value, "Deep binding does not work with updating the first parameter.");
    // check for the null value
    // a --> null
    __a.child = (null);
    assert.isNull(__label.value, "Binding does not work with null.");
  });


  it("DepthOf3", function() {
    // create a hierarchy
    var c1 = new qx.test.MultiBinding();
    c1.name = "c1";
    var c2 = new qx.test.MultiBinding();
    c2.name = "c2";

    // a --> b1 --> c1 --> label
    //       b2 --> c2
    __a.child = (__b1);
    __b1.child = (c1);
    __b2.child = (c2);

    // create the binding
    qx.data.SingleValueBinding.bind(__a, "child.child.name", __label, "value");

    // just set the name of the last component
    c1.name = ("C1");
    assert.equal("C1", __label.value, "Deep binding does not work with updating the third parameter.");

    // change the middle child
    // a --> b2 --> c2 --> label
    __a.child = (__b2);
    assert.equal("c2", __label.value, "Deep binding does not work with updating the second parameter.");

    // set the middle child to null
    // a --> null
    __a.child = (null);
    assert.isNull(__label.value, "Deep binding does not work with first null child.");

    // set only two childs
    // a --> b1 --> null
    __b1.child = (null);
    __a.child = (__b1);
    assert.isNull(__label.value, "Deep binding does not work with second null child.");

    // set the childs in a row
    // a --> b1 --> c1 --> label
    __b1.child = (c1);
    assert.equal("C1", __label.value, "Deep binding does not work with updating the third parameter.");
  });



  it("DepthOf5", function() {
    // create a hierarchy
    var c = new qx.test.MultiBinding();
    c.name = "c";
    var d = new qx.test.MultiBinding();
    d.anme = "d";
    var e = new qx.test.MultiBinding();
    e.name = "e";

    // a --> b1 --> c --> d --> e --> label
    __a.child = (__b1);
    __b1.child = (c);
    c.child = (d);
    d.child = (e);

    // create the binding
    qx.data.SingleValueBinding.bind(__a, "child.child.child.child.name", __label, "value");

    // test if the binding did work
    assert.equal("e", __label.value, "Deep binding does not work with updating the third parameter.");
  });


  it("WrongDeep", function() {
    // create a hierarchy
    __a.child = (__b1);

    var a = __a;
    var label = __label;

    // only in source version
    if (qx.core.Environment.get("qx.debug")) {
      // set a wrong first parameter in the chain
      assert.throw(function() {
        qx.data.SingleValueBinding.bind(a, "chiild.name", label, "value");
      }, qx.core.AssertionError, null, "Wrong property name.");

      // set a wrong second parameter in the chain
      assert.throw(function() {
        qx.data.SingleValueBinding.bind(a, "child.naame", label, "value");
      }, qx.core.AssertionError, null, "Wrong property name.");

      // set a complete wrong chain
      assert.throw(function() {
        qx.data.SingleValueBinding.bind(a, "affe", label, "value");
      }, qx.core.AssertionError, null, "Wrong property name.");
    }
  });


  it("Single", function() {
    // set only one property in the chain
    qx.data.SingleValueBinding.bind(__a, "name", __label, "value");

    // chech the initial value
    assert.equal("a", __label.value, "Single property names dont work!");
    // check the binding
    __a.name = ("A");
    assert.equal("A", __label.value, "Single property names dont work!");
  });


  it("Debug", function() {
    // build the structure
    __a.child = (__b1);
    // bind the stuff together
    var id = qx.data.SingleValueBinding.bind(__a, "child.name", __label, "value");

    // log this binding in the console
    qx.data.SingleValueBinding.showBindingInLog(__a, id);
  });


  it("Remove", function() {
    // build the structure
    __a.child = (__b1);
    // bind the stuff together
    var id = qx.data.SingleValueBinding.bind(__a, "child.name", __label, "value");

    // check the binding
    __b1.name = ("A");
    assert.equal("A", __label.value, "Single property names dont work!");

    // remove the binding
    qx.data.SingleValueBinding.removeBindingFromObject(__a, id);

    // check the binding again
    __a.name = ("A2");
    assert.equal("A", __label.value, "Removing does not work!");

    // smoke Test for the remove
    qx.data.SingleValueBinding.bind(__a, "child.name", __label, "value");
    qx.data.SingleValueBinding.bind(__a, "child.name", __label, "value");
    qx.data.SingleValueBinding.bind(__a, "child.name", __label, "value");
  });


  it("ArrayDeep", function() {
    __a.array.dispose();
    __a.array = (new qx.data.Array([__b1]));
    __b1.child = (__b2);
    __b2.child = (__b1);

    qx.data.SingleValueBinding.bind(__a, "array[0].child.name", __label, "value");

    assert.equal("b2", __label.value, "Deep binding does not work.");

    __a.array.pop();
    assert.isNull(__label.value, "Deep binding does not work.");

    __a.array.push(__b2);
    assert.equal("b1", __label.value, "Deep binding does not work.");

    __b1.name = ("B1");
    assert.equal("B1", __label.value, "Deep binding does not work.");
  });


  it("DeepTarget", function() {
    qx.data.SingleValueBinding.bind(__a, "name", __b1, "lab.value");

    assert.equal("a", __b1.lab.value, "Deep binding on the target does not work.");
  });


  it("DeepTarget2", function() {
    __b2.child = (__b1);
    qx.data.SingleValueBinding.bind(__a, "name", __b2, "child.lab.value");

    assert.equal("a", __b1.lab.value, "Deep binding on the target does not work.");
  });


  it("DeepTargetNull", function() {
    qx.data.SingleValueBinding.bind(__a, "name", __b2, "child.lab.value");

    assert.equal("", __b1.lab.value, "Deep binding on the target does not work.");
  });


  it("DeepTargetArray", function() {
    __a.array.dispose();
    __a.array = (new qx.data.Array([__b1]));

    qx.data.SingleValueBinding.bind(__a, "name", __a, "array[0].lab.value");

    assert.equal("a", __b1.lab.value, "Deep binding on the target does not work.");
  });


  it("DeepTargetArrayLast", function() {
    __a.array.dispose();
    __a.array = (new qx.data.Array([__b1]));

    qx.data.SingleValueBinding.bind(__a, "name", __a, "array[last].lab.value");

    assert.equal("a", __b1.lab.value, "Deep binding on the target does not work.");
  });


  it("DeepTargetChange", function() {
    var oldLabel = __b1.lab;
    var newLabel = new data.singlevalue.TextFieldDummy("x");

    qx.data.SingleValueBinding.bind(__a, "name", __b1, "lab.value");

    __b1.lab = (newLabel);
    assert.equal("a", __b1.lab.value);

    __a.name = ("l");
    assert.equal("a", oldLabel.value);
    assert.equal("l", __b1.lab.value);
  });


  it("DeepTargetChangeConverter", function() {
    var oldLabel = __b1.lab;
    var newLabel = new data.singlevalue.TextFieldDummy("x");

    qx.data.SingleValueBinding.bind(
      __a, "name", __b1, "lab.value", {
        converter: function(data) {
          return data + "...";
        }
      }
    );

    __b1.lab = (newLabel);
    assert.equal("a...", __b1.lab.value);

    __a.name = ("l");
    assert.equal("a...", oldLabel.value);
    assert.equal("l...", __b1.lab.value);
  });


  it("DeepTargetChange3", function() {
    // set up the target chain
    __a.child = (__b1);
    __b1.child = (__b2);
    __b2.child = (__b1);

    qx.data.SingleValueBinding.bind(__label, "value", __a, "child.child.lab.value");

    // check the default set
    __label.value = ("123");
    assert.equal("123", __b2.lab.value);

    // change the child of __a
    __a.child = (__b2);
    assert.equal("123", __b1.lab.value);

    // set another label value
    __label.value = ("456");
    assert.equal("123", __b2.lab.value);
    assert.equal("456", __b1.lab.value);
  });


  it("DeepTargetChange3Remove", function() {
    // set up the target chain
    __a.child = (__b1);
    __b1.child = (__b2);
    __b2.child = (__b1);

    var id = qx.data.SingleValueBinding.bind(__label, "value", __a, "child.child.lab.value");

    // check the default set
    __label.value = ("123");
    assert.equal("123", __b2.lab.value, "0");

    qx.data.SingleValueBinding.removeBindingFromObject(__label, id);

    // change the child of __a
    __a.child = (__b2);
    assert.equal("", __b1.lab.value, "listener still there");

    // set another label value
    __label.value = ("456");
    assert.equal("123", __b2.lab.value, "1");
    assert.equal("", __b1.lab.value, "2");
  });


  it("DeepTargetChangeArray", function() {
    qx.data.SingleValueBinding.bind(__label, "value", __a, "array[0]");

    __label.value = ("123");
    assert.equal("123", __a.array.getItem(0));

    var newArray = new qx.data.Array([0, 1, 0]);
    var oldArray = __a.array;
    __a.array = (newArray);
    assert.equal("123", __a.array.getItem(0), "initial set");

    __label.value = ("456");
    assert.equal("456", newArray.getItem(0));
    assert.equal("123", oldArray.getItem(0));

    oldArray.dispose();
    newArray.dispose();
  });


  it("DeepTargetChangeArrayLast", function() {
    qx.data.SingleValueBinding.bind(__label, "value", __a, "array[last]");

    __label.value = ("123");
    assert.equal("123", __a.array.getItem(2));

    var newArray = new qx.data.Array([0, 1, 0]);
    var oldArray = __a.array;
    __a.array = (newArray);
    assert.equal("123", __a.array.getItem(2), "initial set");

    __label.value = ("456");
    assert.equal("456", newArray.getItem(2));
    assert.equal("123", oldArray.getItem(2));

    oldArray.dispose();
    newArray.dispose();
  });


  it("DeepTargetChange3Array", function() {
    // set up the target chain
    __a.child = (__b1);
    __b1.child = (__b2);
    __b2.child = (__b1);

    qx.data.SingleValueBinding.bind(__label, "value", __a, "child.child.array[0]");

    // check the default set
    __label.value = ("123");
    assert.equal("123", __b2.array.getItem(0));

    // change the child of __a
    __a.child = (__b2);
    assert.equal("123", __b1.array.getItem(0));

    // set another label value
    __label.value = ("456");
    assert.equal("456", __b1.array.getItem(0));
    assert.equal("123", __b2.array.getItem(0), "binding still exists");
  });


  it("DeepTargetChangeMiddleArray", function() {
    var oldArray = __a.array;
    var array = new qx.data.Array([__b1, __b2]);
    __a.array = (array);
    oldArray.dispose();

    qx.data.SingleValueBinding.bind(__label, "value", __a, "array[0].lab.value");

    __label.value = ("123");
    assert.equal("123", __b1.lab.value);

    array.reverse();
    assert.equal("123", __b2.lab.value);

    __label.value = ("456");
    assert.equal("456", __b2.lab.value);
    assert.equal("123", __b1.lab.value);
  });


  it("DeepTargetChangeMiddleArrayLast", function() {
    var oldArray = __a.array;
    var array = new qx.data.Array([__b2, __b1]);
    __a.array = array;
    oldArray.dispose();

    qx.data.SingleValueBinding.bind(__label, "value", __a, "array[last].lab.value");

    __label.value = ("123");
    assert.equal("123", __b1.lab.value);

    array.reverse();
    assert.equal("123", __b2.lab.value);

    __label.value = ("456");
    assert.equal("456", __b2.lab.value);
    assert.equal("123", __b1.lab.value);
  });


  it("DeepTargetChangeWithoutEvent", function() {
    __a.childWithout = (__b1);

    qx.data.SingleValueBinding.bind(__label, "value", __a, "childWithout.name");

    __label.value = ("123");
    assert.equal("123", __b1.name);

    __a.childWithout = (__b2);
    assert.equal("b2", __b2.name);

    __label.value = ("456");
    assert.equal("456", __b2.name);
    assert.equal("123", __b1.name);
  });


  it("DeepTargetChangeWithoutEvent3", function() {
    __a.child = (__b1);
    __b1.childWithout = (__b2);
    __b2.childWithout = (__b1);

    qx.data.SingleValueBinding.bind(__label, "value", __a, "child.childWithout.name");

    __label.value = ("123");
    assert.equal("123", __b2.name);

    __a.child = (__b2);
    assert.equal("123", __b1.name);

    __b2.childWithout = (__a);
    assert.equal("a", __a.name);

    __label.value = ("456");
    assert.equal("456", __a.name);
    assert.equal("123", __b1.name);
  });


  it("DeepTargetChange3ResetNotNull", function() {
    // set up the target chain
    __a.child = (__b1);
    __b1.child = (__b2);
    __b2.child = (__b1);

    __a.name = (null);

    qx.data.SingleValueBinding.bind(__a, "name", __a, "child.child.name");
    assert.equal(__a.name, __b2.name);

    __a.name = ("nnnnn");
    assert.equal(__a.name, __b2.name);

    __a.name = (null);
    assert.equal(__a.name, __b2.name);
  });
});

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
 * @ignore(qx.test.data.singlevalue.Array_MultiBinding)
 */

/**
 * Test-Class for testing the single value binding
 */
describe("data.singlevalue.Array", function() {
  // define a test class
  qx.Class.define("data.singlevalue.Array_MultiBinding", {
    extend: Object,
    include: [qx.event.MEmitter, qx.data.MBinding],

    construct: function() {
      this.array = new qx.data.Array(["one", "two", "three"]);
    },

    properties: {
      child: {
        event: true,
        nullable: true
      },

      children: {
        event: true,
        nullable: true,
        init: null
      },

      name: {
        check: "String",
        event: true,
        nullable: true
      },

      array: {
        init: null,
        event: true
      }
    }
  });


  beforeEach(function() {
    __a = new data.singlevalue.Array_MultiBinding();
    __a.name = "a";
    __a.children = new qx.data.Array();

    __b1 = new data.singlevalue.Array_MultiBinding();
    __b1.name = "b1";
    __b1.children = new qx.data.Array();

    __b2 = new data.singlevalue.Array_MultiBinding();
    __b2.name = "b2";
    __b2.children = new qx.data.Array();
    __label = new data.singlevalue.TextFieldDummy();
  });


  it("ChangeItem", function() {
    // bind the first element of the array
    qx.data.SingleValueBinding.bind(__a, "array[0]", __label, "value");
    // check the binding
    assert.equal("one", __label.value, "Array[0] binding does not work!");
    // change the value
    __a.array.setItem(0, "ONE");
    assert.equal("ONE", __label.value, "Array[0] binding does not work!");
  });


  it("ChangeArray", function() {
    // bind the first element of the array
    qx.data.SingleValueBinding.bind(__a, "array[0]", __label, "value");

    // change the array itself
    __a.array = (new qx.data.Array(1, 2, 3));
    qx.log.Logger.debug(__a.array.getItem(0));
    // check the binding
    assert.equal("1", __label.value, "Changing the array does not work!");
  });


  it("Last", function() {
    // bind the last element
    qx.data.SingleValueBinding.bind(__a, "array[last]", __label, "value");
    // check the binding
    assert.equal("three", __label.value, "Array[last] binding does not work!");

    // change the value
    __a.array.setItem(2, "THREE");
    assert.equal("THREE", __label.value, "Array[last] binding does not work!");
  });


  it("PushPop", function() {
    // bind the last element
    qx.data.SingleValueBinding.bind(__a, "array[last]", __label, "value");
    // check the binding
    assert.equal("three", __label.value, "Array[last] binding does not work!");

    // pop the last element
    __a.array.pop();
    // check the binding
    assert.equal("two", __label.value, "Array[last] binding does not work!");

    // push a new element to the end
    __a.array.push("new");
    // check the binding
    assert.equal("new", __label.value, "Array[last] binding does not work!");
  });


  it("ShiftUnshift", function() {
    // bind the last element
    qx.data.SingleValueBinding.bind(__a, "array[0]", __label, "value");
    // check the binding
    assert.equal("one", __label.value, "Array[last] binding does not work!");

    // pop the last element
    __a.array.shift();
    // check the binding
    assert.equal("two", __label.value, "Array[last] binding does not work!");

    // push a new element to the end
    __a.array.unshift("new");
    // check the binding
    assert.equal("new", __label.value, "Array[last] binding does not work!");
  });


  it("ChildArray", function() {
    // create the objects
    __a.child = (__b1);
    __b1.array = (new qx.data.Array("eins", "zwei", "drei"));
    __b2.array = (new qx.data.Array("1", "2", "3"));

    // bind the last element
    qx.data.SingleValueBinding.bind(__a, "child.array[0]", __label, "value");
    // check the binding
    assert.equal("eins", __label.value, "child.array[0] binding does not work!");

    // change the child
    __a.child = (__b2);
    // check the binding
    assert.equal("1", __label.value, "child.array[0] binding does not work!");
  });


  it("Children", function() {
    // create the objects
    __a.children.push(__b1);
    __a.children.push(__b2);

    // bind the element
    qx.data.SingleValueBinding.bind(__a, "children[0].name", __label, "value");
    // check the binding
    assert.equal("b1", __label.value, "children[0].name binding does not work!");

    // remove the first element
    __a.children.shift();
    // check the binding
    assert.equal("b2", __label.value, "children[0].name binding does not work!");

    // change the name of b2
    __b2.name = ("AFFE");
    // check the binding
    assert.equal("AFFE", __label.value, "children[0].name binding does not work!");
  });


  it("2Arrays", function() {
    // create the objects
    __a.children.push(__b1);
    __b1.children.push(__b2);

    // bind the element
    qx.data.SingleValueBinding.bind(__a, "children[0].children[0].name", __label, "value");
    // check the binding
    assert.equal("b2", __label.value, "children[0].children[0].name binding does not work!");

    // rename the last element
    __b2.name = ("OHJE");
    // check the binding
    assert.equal("OHJE", __label.value, "children[0].name binding does not work!");
  });


  it("Splice", function() {
    // bind the first element
    qx.data.SingleValueBinding.bind(__a, "array[0]", __label, "value");

    // remove the first and add "eins" at popsition 0
    var array = __a.array.splice(0, 1, "eins");

    // check the binding
    assert.equal("eins", __label.value, "Array[last] binding does not work!");
  });


  it("WrongInput", function() {
    var a = __a;
    var label = __label;

    // bind a senseless value
    assert.throw(function() {
      qx.data.SingleValueBinding.bind(a, "array[affe]", label, "value");
    }, Error, null, "Affe not an array value.");

    // bind empty array
    assert.throw(function() {
      qx.data.SingleValueBinding.bind(a, "array[]", label, "value");
    }, Error, null, "'' not an array value.");

    // bind 2 arrays
    assert.throw(function() {
      qx.data.SingleValueBinding.bind(a, "array[0][0]", label, "value");
    }, Error, null, "array[][] not an array value.");

    // bind an float
    assert.throw(function() {
      qx.data.SingleValueBinding.bind(a, "array[1.5]", label, "value");
    }, Error, null, "1.5 not an array value.");

    // bind strange value
    assert.throw(function() {
      qx.data.SingleValueBinding.bind(a, "array[[affe]]", label, "value");
    }, Error, null, "'[[affe]]' not an array value.");

    // test map in array
    assert.throw(function() {
      qx.data.SingleValueBinding.bind(a, "array[{name: 'a'}]", label, "value");
    }, Error, null, "'[affe]' not an array value.");

    // test null in the array
    assert.throw(function() {
      qx.data.SingleValueBinding.bind(a, "array[null]", label, "value");
    }, Error, null, "'null' not an array value.");
  });


  it("LateBinding", function() {
    // create the precondition
    __a.array = (new qx.data.Array());
    // bind the last element
    qx.data.SingleValueBinding.bind(__a, "array[last]", __label, "value");

    // check the binding
    assert.isNull(__label.value, "Late binding does not work!");

    // set a value and check it
    __a.array.push("1");
    assert.equal("1", __label.value, "Late binding does not work!");

    // set another value and check it
    __a.array.push("2");
    assert.equal("2", __label.value, "Late binding does not work!");
  });

  it("RemoveArrayItem", function() {
    // bind the last element
    qx.data.SingleValueBinding.bind(__a, "array[last]", __label, "value");
    // check the binding
    assert.equal("three", __label.value, "Array[last] binding does not work!");

    // pop all 3 elements
    __a.array.pop();
    __a.array.pop();
    __a.array.pop();

    // check the binding
    assert.isNull(__label.value, "Array[last] binding does not work!");
  });


  it("Bidirectional", function() {
    // two way binding
    // model.name <-- bind --> model.child.array[0]

    // create model: model.child.array
    var model = new data.singlevalue.Array_MultiBinding();
    model.child = (new data.singlevalue.Array_MultiBinding());

    // set up the two way binding
    model.bind("name", model, "child.array[0]");
    model.bind("child.array[0]", model, "name");

    // set the value of the textfield
    model.name = ("affe");
    assert.equal("affe", model.child.array.getItem(0), "affe not set in the model array.");

    // set the value in the model
    model.child.array.setItem(0, "stadtaffe");
    assert.equal("stadtaffe", model.name, "stadtaffe not set in the model.");

    // set the models name to null
    model.name = (null);
    assert.equal(null, model.child.array.getItem(0), "model array not reseted to initial.");

    // set the model array item to null
    model.child.array.setItem(0, null);
    assert.equal(null, model.name, "model not reseted.");
  });


  it("Direct", function() {
    // bind the first element of the array
    qx.data.SingleValueBinding.bind(__a.array, "[0]", __label, "value");

    // check the binding
    assert.equal("one", __label.value, "[0] binding does not work!");
    // change the value
    __a.array.setItem(0, "ONE");
    assert.equal("ONE", __label.value, "[0] binding does not work!");
  });


  it("DirectTarget", function() {
    __label.value = ("affe");
    // bind the first element of the array
    qx.data.SingleValueBinding.bind(__label, "value", __a.array, "[0]");

    // check the binding
    assert.equal("affe", __a.array.getItem(0), "[0] binding does not work!");
    // change the value
    __label.value = ("AFFE");
    assert.equal("AFFE", __a.array.getItem(0), "[0] binding does not work!");
  });


  it("ChildrenDirect", function() {
    // create the objects
    __a.children.push(__b1);
    __a.children.push(__b2);

    // bind the element
    qx.data.SingleValueBinding.bind(__a.children, "[0].name", __label, "value");
    // check the binding
    assert.equal("b1", __label.value, "[0].name binding does not work!");

    // remove the first element
    __a.children.shift();
    // check the binding
    assert.equal("b2", __label.value, "[0].name binding does not work!");

    // change the name of b2
    __b2.name = ("AFFE");
    // check the binding
    assert.equal("AFFE", __label.value, "[0].name binding does not work!");
  });


  it("TargetChildren", function() {
    // create the objects
    __a.children.push(__b1);
    __a.children.push(__b2);

    // bind the element
    __label.value = ("l");
    qx.data.SingleValueBinding.bind(__label, "value", __a.children, "[0].name");
    // check the binding
    assert.equal("l", __a.children.getItem(0).name, "[0].name binding does not work!");

    // remove the first element
    __a.children.shift();
    // check the binding
    assert.equal("l", __a.children.getItem(0).name, "[0].name binding does not work!");

  });
});

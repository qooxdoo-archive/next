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
qx.Bootstrap.define("qx.test.data.singlevalue.Array",
{
  extend : qx.dev.unit.TestCase,

  construct : function() {
    this.base(qx.dev.unit.TestCase, "constructor");

    // define a test class
    qx.Bootstrap.define("qx.test.data.singlevalue.Array_MultiBinding",
    {
      extend : qx.event.Emitter,
      include : qx.data.MBinding,

      construct : function() {
        this.array = new qx.data.Array(["one", "two", "three"]);
      },

      properties :
      {
        child : {
          event : true,
          nullable : true
        },

        children : {
          event : true,
          nullable: true,
          init : null
        },

        name : {
          check : "String",
          event : true,
          nullable: true
        },

        array : {
          init : null,
          event: true
        }
      }
    });
  },


  members :
  {
    __a: null,
    __b1: null,
    __b2: null,
    __label: null,

    setUp : function()
    {
      this.__a = new qx.test.data.singlevalue.Array_MultiBinding();
      this.__a.name = "a";
      this.__a.children = new qx.data.Array();

      this.__b1 = new qx.test.data.singlevalue.Array_MultiBinding();
      this.__b1.name = "b1";
      this.__b1.children = new qx.data.Array();

      this.__b2 = new qx.test.data.singlevalue.Array_MultiBinding();
      this.__b2.name = "b2";
      this.__b2.children = new qx.data.Array();

      this.__label = new qx.test.data.singlevalue.TextFieldDummy();
    },


    testChangeItem : function() {
      // bind the first element of the array
      qx.data.SingleValueBinding.bind(this.__a, "array[0]", this.__label, "value");

      // check the binding
      this.assertEquals("one", this.__label.value, "Array[0] binding does not work!");
      // change the value
      this.__a.array.setItem(0, "ONE");
      this.assertEquals("ONE", this.__label.value, "Array[0] binding does not work!");
    },


    testChangeArray: function() {
      // bind the first element of the array
      qx.data.SingleValueBinding.bind(this.__a, "array[0]", this.__label, "value");

      // change the array itself
      this.__a.array = (new qx.data.Array(1, 2, 3));
      qx.log.Logger.debug(this.__a.array.getItem(0));
      // check the binding
      this.assertEquals("1", this.__label.value, "Changing the array does not work!");
    },


    testLast: function() {
      // bind the last element
      qx.data.SingleValueBinding.bind(this.__a, "array[last]", this.__label, "value");
      // check the binding
      this.assertEquals("three", this.__label.value, "Array[last] binding does not work!");

      // change the value
      this.__a.array.setItem(2,"THREE");
      this.assertEquals("THREE", this.__label.value, "Array[last] binding does not work!");
    },


    testPushPop: function() {
      // bind the last element
      qx.data.SingleValueBinding.bind(this.__a, "array[last]", this.__label, "value");
      // check the binding
      this.assertEquals("three", this.__label.value, "Array[last] binding does not work!");

      // pop the last element
      this.__a.array.pop();
      // check the binding
      this.assertEquals("two", this.__label.value, "Array[last] binding does not work!");

      // push a new element to the end
      this.__a.array.push("new");
      // check the binding
      this.assertEquals("new", this.__label.value, "Array[last] binding does not work!");
    },


    testShiftUnshift: function() {
      // bind the last element
      qx.data.SingleValueBinding.bind(this.__a, "array[0]", this.__label, "value");
      // check the binding
      this.assertEquals("one", this.__label.value, "Array[last] binding does not work!");

      // pop the last element
      this.__a.array.shift();
      // check the binding
      this.assertEquals("two", this.__label.value, "Array[last] binding does not work!");

      // push a new element to the end
      this.__a.array.unshift("new");
      // check the binding
      this.assertEquals("new", this.__label.value, "Array[last] binding does not work!");
    },


    testChildArray: function() {
      // create the objects
      this.__a.child = (this.__b1);
      this.__b1.array = (new qx.data.Array("eins", "zwei", "drei"));
      this.__b2.array = (new qx.data.Array("1", "2", "3"));

      // bind the last element
      qx.data.SingleValueBinding.bind(this.__a, "child.array[0]", this.__label, "value");
      // check the binding
      this.assertEquals("eins", this.__label.value, "child.array[0] binding does not work!");

      // change the child
      this.__a.child = (this.__b2);
      // check the binding
      this.assertEquals("1", this.__label.value, "child.array[0] binding does not work!");
    },


    testChildren: function() {
      // create the objects
      this.__a.children.push(this.__b1);
      this.__a.children.push(this.__b2);

      // bind the element
      qx.data.SingleValueBinding.bind(this.__a, "children[0].name", this.__label, "value");
      // check the binding
      this.assertEquals("b1", this.__label.value, "children[0].name binding does not work!");

      // remove the first element
      this.__a.children.shift();
      // check the binding
      this.assertEquals("b2", this.__label.value, "children[0].name binding does not work!");

      // change the name of b2
      this.__b2.name = ("AFFE");
      // check the binding
      this.assertEquals("AFFE", this.__label.value, "children[0].name binding does not work!");
    },


    test2Arrays: function() {
      // create the objects
      this.__a.children.push(this.__b1);
      this.__b1.children.push(this.__b2);

      // bind the element
      qx.data.SingleValueBinding.bind(this.__a, "children[0].children[0].name", this.__label, "value");
      // check the binding
      this.assertEquals("b2", this.__label.value, "children[0].children[0].name binding does not work!");

      // rename the last element
      this.__b2.name = ("OHJE");
      // check the binding
      this.assertEquals("OHJE", this.__label.value, "children[0].name binding does not work!");
    },


    testSplice: function() {
      // bind the first element
      qx.data.SingleValueBinding.bind(this.__a, "array[0]", this.__label, "value");

      // remove the first and add "eins" at popsition 0
      var array = this.__a.array.splice(0, 1, "eins");

      // check the binding
      this.assertEquals("eins", this.__label.value, "Array[last] binding does not work!");
    },


    testWrongInput: function() {
      var a = this.__a;
      var label = this.__label;

      // bind a senseless value
      this.assertException(function() {
        qx.data.SingleValueBinding.bind(a, "array[affe]", label, "value");
      }, Error, null, "Affe not an array value.");

      // bind empty array
      this.assertException(function() {
        qx.data.SingleValueBinding.bind(a, "array[]", label, "value");
      }, Error, null, "'' not an array value.");

      // bind 2 arrays
      this.assertException(function() {
        qx.data.SingleValueBinding.bind(a, "array[0][0]", label, "value");
      }, Error, null, "array[][] not an array value.");

      // bind an float
      this.assertException(function() {
        qx.data.SingleValueBinding.bind(a, "array[1.5]", label, "value");
      }, Error, null, "1.5 not an array value.");

      // bind strange value
      this.assertException(function() {
        qx.data.SingleValueBinding.bind(a, "array[[affe]]", label, "value");
      }, Error, null, "'[[affe]]' not an array value.");

      // test map in array
      this.assertException(function() {
        qx.data.SingleValueBinding.bind(a, "array[{name: 'a'}]", label, "value");
      }, Error, null, "'[affe]' not an array value.");

      // test null in the array
      this.assertException(function() {
        qx.data.SingleValueBinding.bind(a, "array[null]", label, "value");
      }, Error, null, "'null' not an array value.");
    },


    testLateBinding: function() {
      // create the precondition
      this.__a.array = (new qx.data.Array());
      // bind the last element
      qx.data.SingleValueBinding.bind(this.__a, "array[last]", this.__label, "value");

      // check the binding
      this.assertNull(this.__label.value, "Late binding does not work!");

      // set a value and check it
      this.__a.array.push("1");
      this.assertEquals("1", this.__label.value, "Late binding does not work!");

      // set another value and check it
      this.__a.array.push("2");
      this.assertEquals("2", this.__label.value, "Late binding does not work!");
    },


    testRemoveArrayItem: function() {
      // bind the last element
      qx.data.SingleValueBinding.bind(this.__a, "array[last]", this.__label, "value");
      // check the binding
      this.assertEquals("three", this.__label.value, "Array[last] binding does not work!");

      // pop all 3 elements
      this.__a.array.pop();
      this.__a.array.pop();
      this.__a.array.pop();

      // check the binding
      this.assertNull(this.__label.value, "Array[last] binding does not work!");
    },


    testBidirectional: function() {
      // two way binding
      // model.name <-- bind --> model.child.array[0]

      // create model: model.child.array
      var model = new qx.test.data.singlevalue.Array_MultiBinding();
      model.child = (new qx.test.data.singlevalue.Array_MultiBinding());

      // set up the two way binding
      model.bind("name", model, "child.array[0]");
      model.bind("child.array[0]", model, "name");

      // set the value of the textfield
      model.name = ("affe");
      this.assertEquals("affe", model.child.array.getItem(0), "affe not set in the model array.");

      // set the value in the model
      model.child.array.setItem(0, "stadtaffe");
      this.assertEquals("stadtaffe", model.name, "stadtaffe not set in the model.");

      // set the models name to null
      model.name = (null);
      this.assertEquals(null, model.child.array.getItem(0), "model array not reseted to initial.");

      // set the model array item to null
      model.child.array.setItem(0, null);
      this.assertEquals(null, model.name, "model not reseted.");
    },


    testDirect : function()
    {
      // bind the first element of the array
      qx.data.SingleValueBinding.bind(this.__a.array, "[0]", this.__label, "value");

      // check the binding
      this.assertEquals("one", this.__label.value, "[0] binding does not work!");
      // change the value
      this.__a.array.setItem(0, "ONE");
      this.assertEquals("ONE", this.__label.value, "[0] binding does not work!");
    },


    testDirectTarget : function()
    {
      this.__label.value = ("affe");
      // bind the first element of the array
      qx.data.SingleValueBinding.bind(this.__label, "value", this.__a.array, "[0]");

      // check the binding
      this.assertEquals("affe", this.__a.array.getItem(0), "[0] binding does not work!");
      // change the value
      this.__label.value = ("AFFE");
      this.assertEquals("AFFE", this.__a.array.getItem(0), "[0] binding does not work!");
    },


    testChildrenDirect : function()
    {
      // create the objects
      this.__a.children.push(this.__b1);
      this.__a.children.push(this.__b2);

      // bind the element
      qx.data.SingleValueBinding.bind(this.__a.children, "[0].name", this.__label, "value");
      // check the binding
      this.assertEquals("b1", this.__label.value, "[0].name binding does not work!");

      // remove the first element
      this.__a.children.shift();
      // check the binding
      this.assertEquals("b2", this.__label.value, "[0].name binding does not work!");

      // change the name of b2
      this.__b2.name = ("AFFE");
      // check the binding
      this.assertEquals("AFFE", this.__label.value, "[0].name binding does not work!");
    },


    testTargetChildren : function() {
      // create the objects
      this.__a.children.push(this.__b1);
      this.__a.children.push(this.__b2);

      // bind the element
      this.__label.value = ("l");
      qx.data.SingleValueBinding.bind(this.__label, "value", this.__a.children, "[0].name");
      // check the binding
      this.assertEquals("l", this.__a.children.getItem(0).name, "[0].name binding does not work!");

      // remove the first element
      this.__a.children.shift();
      // check the binding
      this.assertEquals("l", this.__a.children.getItem(0).name, "[0].name binding does not work!");
    }

  }
});

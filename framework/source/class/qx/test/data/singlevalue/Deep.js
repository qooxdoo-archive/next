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
qx.Class.define("qx.test.data.singlevalue.Deep",
{
  extend : qx.dev.unit.TestCase,
  include : [qx.dev.unit.MMock],

  construct : function() {
    this.base(qx.dev.unit.TestCase, "constructor");
    this.initMMock();

    // define a test class
    qx.Class.define("qx.test.MultiBinding",
    {
      extend : Object,
      include : [qx.event.MEmitter],

      properties :
      {
        child : {
          event : true,
          nullable : true
        },

        childWithout : {
          nullable : true
        },

        name : {
          check : "String",
          nullable: true,
          init : "Juhu",
          event : true
        },

        array : {
          init : null,
          event: true
        },

        lab : {
          event: true
        }
      }
    });
  },


  members :
  {
    __a : null,
    __b1 : null,
    __b2 : null,
    __label : null,

    setUp : function()
    {
      this.__a = new qx.test.MultiBinding();
      this.__a.name = "a";
      this.__a.lab = new qx.test.data.singlevalue.TextFieldDummy("");
      this.__a.array = new qx.data.Array(["one", "two", "three"]);

      this.__b1 = new qx.test.MultiBinding();
      this.__b1.name = "b1";
      this.__b1.lab = new qx.test.data.singlevalue.TextFieldDummy("");
      this.__b1.array = new qx.data.Array(["one", "two", "three"]);

      this.__b2 = new qx.test.MultiBinding();
      this.__b2.name = "b2";
      this.__b2.lab = new qx.test.data.singlevalue.TextFieldDummy("");
      this.__b2.array = new qx.data.Array(["one", "two", "three"]);

      this.__label = new qx.test.data.singlevalue.TextFieldDummy();
    },


    testConverterChainBroken : function() {
      var m = qx.data.marshal.Json.createModel({a: {a: 1}, b: 2});
      var called = 0;
      qx.data.SingleValueBinding.bind(m, "a.a", m, "b", {converter : function(data) {
        called++;
        return 3;
      }});
      // check the init values
      this.assertEquals(1, called);
      this.assertEquals(3, m.b);

      // set the binding leaf to null
      m.a.a = null;
      this.assertEquals(2, called);
      this.assertEquals(3, m.b);

      // set the binding root to null
      m.a = null;
      this.assertEquals(3, called);
      this.assertEquals(3, m.b);
    },


    testConverterChainBrokenInitialNull : function() {
      var m = qx.data.marshal.Json.createModel({a: null});
      var t = qx.data.marshal.Json.createModel({a: null});

      var spy = this.spy(function() {
        return 123;
      });
      qx.data.SingleValueBinding.bind(m, "a.b", t, "a", {converter : spy});

      this.assertCalledOnce(spy);
      this.assertCalledWith(spy, undefined, undefined, m, t);
      this.assertEquals(123, t.a);
    },


    testDepthOf2: function() {
      // create a hierarchy
      // a --> b1
      this.__a.child = (this.__b1);

      // create the binding
      // a --> b1 --> label
      qx.data.SingleValueBinding.bind(this.__a, "child.name", this.__label, "value");

      // just set the name of the second component
      this.__b1.name = ("B1");
      this.assertEquals("B1", this.__label.value, "Deep binding does not work with updating the first parameter.");
      // change the second component
      // a --> b2 --> label
      this.__a.child = (this.__b2);
      this.assertEquals("b2", this.__label.value, "Deep binding does not work with updating the first parameter.");
      // check for the null value
      // a --> null
      this.__a.child = (null);
      this.assertNull(this.__label.value, "Binding does not work with null.");
    },


    testDepthOf3: function(attribute) {
      // create a hierarchy
      var c1 = new qx.test.MultiBinding();
      c1.name = "c1";
      var c2 = new qx.test.MultiBinding();
      c2.name = "c2";

      // a --> b1 --> c1 --> label
      //       b2 --> c2
      this.__a.child = (this.__b1);
      this.__b1.child = (c1);
      this.__b2.child = (c2);

      // create the binding
      qx.data.SingleValueBinding.bind(this.__a, "child.child.name", this.__label, "value");

      // just set the name of the last component
      c1.name = ("C1");
      this.assertEquals("C1", this.__label.value, "Deep binding does not work with updating the third parameter.");

      // change the middle child
      // a --> b2 --> c2 --> label
      this.__a.child = (this.__b2);
      this.assertEquals("c2", this.__label.value, "Deep binding does not work with updating the second parameter.");

      // set the middle child to null
      // a --> null
      this.__a.child = (null);
      this.assertNull(this.__label.value, "Deep binding does not work with first null child.");

      // set only two childs
      // a --> b1 --> null
      this.__b1.child = (null);
      this.__a.child = (this.__b1);
      this.assertNull(this.__label.value, "Deep binding does not work with second null child.");

      // set the childs in a row
      // a --> b1 --> c1 --> label
      this.__b1.child = (c1);
      this.assertEquals("C1", this.__label.value, "Deep binding does not work with updating the third parameter.");
    },



    testDepthOf5: function(attribute) {
      // create a hierarchy
      var c = new qx.test.MultiBinding();
      c.name = "c";
      var d = new qx.test.MultiBinding();
      d.anme = "d";
      var e = new qx.test.MultiBinding();
      e.name = "e";

      // a --> b1 --> c --> d --> e --> label
      this.__a.child = (this.__b1);
      this.__b1.child = (c);
      c.child = (d);
      d.child = (e);

      // create the binding
      qx.data.SingleValueBinding.bind(this.__a, "child.child.child.child.name", this.__label, "value");

      // test if the binding did work
      this.assertEquals("e", this.__label.value, "Deep binding does not work with updating the third parameter.");
    },


    testWrongDeep: function() {
      // create a hierarchy
      this.__a.child = (this.__b1);

      var a = this.__a;
      var label = this.__label;

      // only in source version
      if (qx.core.Environment.get("qx.debug")) {
        // set a wrong first parameter in the chain
        this.assertException(function() {
          qx.data.SingleValueBinding.bind(a, "chiild.name", label, "value");
        }, qx.core.AssertionError, null, "Wrong property name.");

        // set a wrong second parameter in the chain
        this.assertException(function() {
          qx.data.SingleValueBinding.bind(a, "child.naame", label, "value");
        }, qx.core.AssertionError, null, "Wrong property name.");

        // set a complete wrong chain
        this.assertException(function() {
          qx.data.SingleValueBinding.bind(a, "affe", label, "value");
        }, qx.core.AssertionError, null, "Wrong property name.");
      }
    },


    testSingle: function() {
      // set only one property in the chain
      qx.data.SingleValueBinding.bind(this.__a, "name", this.__label, "value");

      // chech the initial value
      this.assertEquals("a", this.__label.value, "Single property names dont work!");
      // check the binding
      this.__a.name = ("A");
      this.assertEquals("A", this.__label.value, "Single property names dont work!");
    },


    testDebug: function(attribute) {
      // build the structure
      this.__a.child = (this.__b1);
      // bind the stuff together
      var id = qx.data.SingleValueBinding.bind(this.__a, "child.name", this.__label, "value");

      // log this binding in the console
      qx.data.SingleValueBinding.showBindingInLog(this.__a, id);
    },


    testRemove: function() {
      // build the structure
      this.__a.child = (this.__b1);
      // bind the stuff together
      var id = qx.data.SingleValueBinding.bind(this.__a, "child.name", this.__label, "value");

      // check the binding
      this.__b1.name = ("A");
      this.assertEquals("A", this.__label.value, "Single property names dont work!");

      // remove the binding
      qx.data.SingleValueBinding.removeBindingFromObject(this.__a, id);

      // check the binding again
      this.__a.name = ("A2");
      this.assertEquals("A", this.__label.value, "Removing does not work!");

      // smoke Test for the remove
      qx.data.SingleValueBinding.bind(this.__a, "child.name", this.__label, "value");
      qx.data.SingleValueBinding.bind(this.__a, "child.name", this.__label, "value");
      qx.data.SingleValueBinding.bind(this.__a, "child.name", this.__label, "value");
    },


    testArrayDeep: function() {
      this.__a.array.dispose();
      this.__a.array = (new qx.data.Array([this.__b1]));
      this.__b1.child = (this.__b2);
      this.__b2.child = (this.__b1);

      qx.data.SingleValueBinding.bind(this.__a, "array[0].child.name", this.__label, "value");

      this.assertEquals("b2", this.__label.value, "Deep binding does not work.");

      this.__a.array.pop();
      this.assertNull(this.__label.value, "Deep binding does not work.");

      this.__a.array.push(this.__b2);
      this.assertEquals("b1", this.__label.value, "Deep binding does not work.");

      this.__b1.name = ("B1");
      this.assertEquals("B1", this.__label.value, "Deep binding does not work.");
    },


    testDeepTarget: function() {
      qx.data.SingleValueBinding.bind(this.__a, "name", this.__b1, "lab.value");

      this.assertEquals("a", this.__b1.lab.value, "Deep binding on the target does not work.");
    },

    testDeepTarget2: function() {
      this.__b2.child = (this.__b1);
      qx.data.SingleValueBinding.bind(this.__a, "name", this.__b2, "child.lab.value");

      this.assertEquals("a", this.__b1.lab.value, "Deep binding on the target does not work.");
    },

    testDeepTargetNull: function() {
      qx.data.SingleValueBinding.bind(this.__a, "name", this.__b2, "child.lab.value");

      this.assertEquals("", this.__b1.lab.value, "Deep binding on the target does not work.");
    },

    testDeepTargetArray: function() {
      this.__a.array.dispose();
      this.__a.array = (new qx.data.Array([this.__b1]));

      qx.data.SingleValueBinding.bind(this.__a, "name", this.__a, "array[0].lab.value");

      this.assertEquals("a", this.__b1.lab.value, "Deep binding on the target does not work.");
    },

    testDeepTargetArrayLast: function() {
      this.__a.array.dispose();
      this.__a.array = (new qx.data.Array([this.__b1]));

      qx.data.SingleValueBinding.bind(this.__a, "name", this.__a, "array[last].lab.value");

      this.assertEquals("a", this.__b1.lab.value, "Deep binding on the target does not work.");
    },


    testDeepTargetChange : function()
    {
      var oldLabel = this.__b1.lab;
      var newLabel = new qx.test.data.singlevalue.TextFieldDummy("x");

      qx.data.SingleValueBinding.bind(this.__a, "name", this.__b1, "lab.value");

      this.__b1.lab = (newLabel);
      this.assertEquals("a", this.__b1.lab.value);

      this.__a.name = ("l");
      this.assertEquals("a", oldLabel.value);
      this.assertEquals("l", this.__b1.lab.value);
    },


    testDeepTargetChangeConverter : function()
    {
      var oldLabel = this.__b1.lab;
      var newLabel = new qx.test.data.singlevalue.TextFieldDummy("x");

      qx.data.SingleValueBinding.bind(
        this.__a, "name", this.__b1, "lab.value",
        {converter : function(data) {return data + "...";}}
      );

      this.__b1.lab = (newLabel);
      this.assertEquals("a...", this.__b1.lab.value);

      this.__a.name = ("l");
      this.assertEquals("a...", oldLabel.value);
      this.assertEquals("l...", this.__b1.lab.value);
    },


    testDeepTargetChange3 : function()
    {
      // set up the target chain
      this.__a.child = (this.__b1);
      this.__b1.child = (this.__b2);
      this.__b2.child = (this.__b1);

      qx.data.SingleValueBinding.bind(this.__label, "value", this.__a, "child.child.lab.value");

      // check the default set
      this.__label.value = ("123");
      this.assertEquals("123", this.__b2.lab.value);

      // change the child of __a
      this.__a.child = (this.__b2);
      this.assertEquals("123", this.__b1.lab.value);

      // set another label value
      this.__label.value = ("456");
      this.assertEquals("123", this.__b2.lab.value);
      this.assertEquals("456", this.__b1.lab.value);
    },


    testDeepTargetChange3Remove : function()
    {
      // set up the target chain
      this.__a.child = (this.__b1);
      this.__b1.child = (this.__b2);
      this.__b2.child = (this.__b1);

      var id = qx.data.SingleValueBinding.bind(this.__label, "value", this.__a, "child.child.lab.value");

      // check the default set
      this.__label.value = ("123");
      this.assertEquals("123", this.__b2.lab.value, "0");

      qx.data.SingleValueBinding.removeBindingFromObject(this.__label, id);

      // change the child of __a
      this.__a.child = (this.__b2);
      this.assertEquals("", this.__b1.lab.value, "listener still there");

      // set another label value
      this.__label.value = ("456");
      this.assertEquals("123", this.__b2.lab.value, "1");
      this.assertEquals("", this.__b1.lab.value, "2");
    },


    testDeepTargetChangeArray : function()
    {
      qx.data.SingleValueBinding.bind(this.__label, "value", this.__a,"array[0]");

      this.__label.value = ("123");
      this.assertEquals("123", this.__a.array.getItem(0));

      var newArray = new qx.data.Array([0, 1, 0]);
      var oldArray = this.__a.array;
      this.__a.array = (newArray);
      this.assertEquals("123", this.__a.array.getItem(0), "initial set");

      this.__label.value = ("456");
      this.assertEquals("456", newArray.getItem(0));
      this.assertEquals("123", oldArray.getItem(0));

      oldArray.dispose();
      newArray.dispose();
    },


    testDeepTargetChangeArrayLast : function()
    {
      qx.data.SingleValueBinding.bind(this.__label, "value", this.__a,"array[last]");

      this.__label.value = ("123");
      this.assertEquals("123", this.__a.array.getItem(2));

      var newArray = new qx.data.Array([0, 1, 0]);
      var oldArray = this.__a.array;
      this.__a.array = (newArray);
      this.assertEquals("123", this.__a.array.getItem(2), "initial set");

      this.__label.value = ("456");
      this.assertEquals("456", newArray.getItem(2));
      this.assertEquals("123", oldArray.getItem(2));

      oldArray.dispose();
      newArray.dispose();
    },


    testDeepTargetChange3Array : function()
    {
      // set up the target chain
      this.__a.child = (this.__b1);
      this.__b1.child = (this.__b2);
      this.__b2.child = (this.__b1);

      qx.data.SingleValueBinding.bind(this.__label, "value", this.__a, "child.child.array[0]");

      // check the default set
      this.__label.value = ("123");
      this.assertEquals("123", this.__b2.array.getItem(0));

      // change the child of __a
      this.__a.child = (this.__b2);
      this.assertEquals("123", this.__b1.array.getItem(0));

      // set another label value
      this.__label.value = ("456");
      this.assertEquals("456", this.__b1.array.getItem(0));
      this.assertEquals("123", this.__b2.array.getItem(0), "binding still exists");
    },


    testDeepTargetChangeMiddleArray : function()
    {
      var oldArray = this.__a.array;
      var array = new qx.data.Array([this.__b1, this.__b2]);
      this.__a.array = (array);
      oldArray.dispose();

      qx.data.SingleValueBinding.bind(this.__label, "value", this.__a, "array[0].lab.value");

      this.__label.value = ("123");
      this.assertEquals("123", this.__b1.lab.value);

      array.reverse();
      this.assertEquals("123", this.__b2.lab.value);

      this.__label.value = ("456");
      this.assertEquals("456", this.__b2.lab.value);
      this.assertEquals("123", this.__b1.lab.value);
    },


    testDeepTargetChangeMiddleArrayLast : function()
    {
      var oldArray = this.__a.array;
      var array = new qx.data.Array([this.__b2, this.__b1]);
      this.__a.array = array;
      oldArray.dispose();

      qx.data.SingleValueBinding.bind(this.__label, "value", this.__a, "array[last].lab.value");

      this.__label.value = ("123");
      this.assertEquals("123", this.__b1.lab.value);

      array.reverse();
      this.assertEquals("123", this.__b2.lab.value);

      this.__label.value = ("456");
      this.assertEquals("456", this.__b2.lab.value);
      this.assertEquals("123", this.__b1.lab.value);
    },


    testDeepTargetChangeWithoutEvent : function()
    {
      this.__a.childWithout = (this.__b1);

      qx.data.SingleValueBinding.bind(this.__label, "value", this.__a, "childWithout.name");

      this.__label.value = ("123");
      this.assertEquals("123", this.__b1.name);

      this.__a.childWithout = (this.__b2);
      this.assertEquals("b2", this.__b2.name);

      this.__label.value = ("456");
      this.assertEquals("456", this.__b2.name);
      this.assertEquals("123", this.__b1.name);
    },


    testDeepTargetChangeWithoutEvent3 : function()
    {
      this.__a.child = (this.__b1);
      this.__b1.childWithout = (this.__b2);
      this.__b2.childWithout = (this.__b1);

      qx.data.SingleValueBinding.bind(this.__label, "value", this.__a, "child.childWithout.name");

      this.__label.value = ("123");
      this.assertEquals("123", this.__b2.name);

      this.__a.child = (this.__b2);
      this.assertEquals("123", this.__b1.name);

      this.__b2.childWithout = (this.__a);
      this.assertEquals("a", this.__a.name);

      this.__label.value = ("456");
      this.assertEquals("456", this.__a.name);
      this.assertEquals("123", this.__b1.name);
    },


    testDeepTargetChange3ResetNotNull : function()
    {
      // set up the target chain
      this.__a.child = (this.__b1);
      this.__b1.child = (this.__b2);
      this.__b2.child = (this.__b1);

      this.__a.name = (null);

      qx.data.SingleValueBinding.bind(this.__a, "name", this.__a, "child.child.name");
      this.assertEquals(this.__a.name, this.__b2.name);

      this.__a.name = ("nnnnn");
      this.assertEquals(this.__a.name, this.__b2.name);

      this.__a.name = (null);
      this.assertEquals(this.__a.name, this.__b2.name);
    }

  }
});

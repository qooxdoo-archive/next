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
 * @ignore(qx.test.SVB)
 * @ignore(qx.test.TwoProperties)
 * @ignore(qx.Target)
 * @ignore(qx.Test)
 */
qx.Bootstrap.define("qx.test.data.singlevalue.Simple",
{
  extend : qx.dev.unit.TestCase,
  include : qx.dev.unit.MRequirements,

  members :
  {
    __a : null,
    __b: null,

    setUp : function() {
      // create the widgets
      this.__a = new qx.test.data.singlevalue.TextFieldDummy();
      this.__b = new qx.test.data.singlevalue.TextFieldDummy();
    },


    tearDown : function() {
      qx.data.SingleValueBinding.removeAllBindingsForObject(this.__a);
      qx.data.SingleValueBinding.removeAllBindingsForObject(this.__b);
    },


    testStringPropertyBinding : function()
    {
      qx.data.SingleValueBinding.bind(this.__a, "appearance", this.__b, "appearance");
      this.__a.appearance = "affe";
      this.assertEquals("affe", this.__b.appearance, "String binding does not work!");

      var affe = new qx.test.data.singlevalue.TextFieldDummy();
      affe.appearance = "Jonny";
      qx.data.SingleValueBinding.bind(affe, "appearance", this.__b, "appearance");
      this.assertEquals("Jonny", this.__b.appearance, "String binding does not work!");
    },


    testBooleanPropertyBinding : function()
    {
      qx.data.SingleValueBinding.bind(this.__a, "enabled", this.__b, "enabled");
      this.__a.enabled = false;
      this.assertFalse(this.__b.enabled, "Boolean binding does not work!");
    },


    testNumberPropertyBinding : function()
    {
      qx.data.SingleValueBinding.bind(this.__a, "zIndex", this.__b, "zIndex");
      this.__a.zIndex = 2456;
      this.assertEquals(2456, this.__b.zIndex, "Number binding does not work!");
    },


    testColorPropertyBinding : function()
    {
      qx.data.SingleValueBinding.bind(this.__a, "backgroundColor", this.__b, "backgroundColor");
      this.__a.backgroundColor = "red";
      this.assertEquals("red", this.__b.backgroundColor, "Color binding does not work!");
    },


    testWrongPropertyNames : function()
    {
      if (qx.core.Environment.get("qx.debug")) {
        var a = this.__a;
        var b = this.__b;

        // wrong source
        this.assertException(function() {
          qx.data.SingleValueBinding.bind(a, "BacccccckgroundColor", b, "backgroundColor");
        }, qx.core.AssertionError, null, "Not a wrong property name? (source)");
      }
    },


    testWrongEventType : function() {
      if (qx.core.Environment.get("qx.debug")) {
        var a = this.__a;
        var b = this.__b;

        // wrong eventName
        this.assertException(function() {
          qx.data.SingleValueBinding.bind(a, "affe", b, "backgroundColor");
        }, null, null, "Not a wrong event name? (source)");
      }
    },


    testDefaultConversion : function() {
      // String to number
      this.__a.appearance = "0";
      qx.data.SingleValueBinding.bind(this.__a, "appearance", this.__b, "zIndex");
      this.__a.appearance = "4879";
      this.assertEquals(4879, this.__b.zIndex, "String --> Number does not work!");

      // number to String
      this.__a.zIndex = 568;
      qx.data.SingleValueBinding.bind(this.__a, "zIndex", this.__b, "appearance");
      this.__a.zIndex = 1234;
      this.assertEquals("1234", this.__b.appearance, "Number --> String does not work!");

      // boolean to string
      qx.data.SingleValueBinding.bind(this.__a, "enabled", this.__b, "appearance");
      this.__a.enabled = true;
      this.assertEquals("true", this.__b.appearance, "Boolean --> String does not work!");

      // string to float
      var s = new qx.test.data.singlevalue.TextFieldDummy();
      s.floatt = 0;

      qx.data.SingleValueBinding.bind(s, "floatt", this.__b, "appearance");
      s.floatt = 13.5;
      this.assertEquals("13.5", this.__b.appearance, "Float --> String does not work!");

      qx.data.SingleValueBinding.removeAllBindingsForObject(s);
    },


    testRemoveBinding: function(){
      // add a binding
      var id = qx.data.SingleValueBinding.bind(this.__a, "appearance", this.__b, "appearance");
      // set and chech the name
      this.__a.appearance = "hans";
      this.assertEquals("hans", this.__b.appearance, "String binding does not work!");

      // remove the binding
      qx.data.SingleValueBinding.removeBindingFromObject(this.__a, id);
      // set and check the name
      this.__a.appearance = "hans2";
      this.assertEquals("hans", this.__b.appearance, "Did not remove the binding!");

      // test if the binding is not listed anymore
      var bindings = qx.data.SingleValueBinding.getAllBindingsForObject(this.__a);
      this.assertEquals(0, bindings.length, "Binding still in the registry!");

      // only in source version
      if (qx.core.Environment.get("qx.debug")) {
        // test wrong binding id
        var a = this.__a;
        this.assertException(function() {
          qx.data.SingleValueBinding.removeBindingFromObject(a, null);
        }, Error, null, "No exception thrown.");
      }
    },


    testGetAllBindingsForObject: function(){
      // add two binding
      var id = qx.data.SingleValueBinding.bind(this.__a, "appearance", this.__b, "appearance");
      var id2 = qx.data.SingleValueBinding.bind(this.__a, "zIndex", this.__b, "zIndex");
      // set and chech the binding
      this.__a.appearance = "hans";
      this.assertEquals("hans", this.__b.appearance, "String binding does not work!");
      this.__a.zIndex = (89);
      this.assertEquals(89, this.__b.zIndex, "Number binding does not work!");

      // check the method
      var bindings = qx.data.SingleValueBinding.getAllBindingsForObject(this.__a);
      this.assertEquals(2, bindings.length, "There are more than 2 bindings!");
      this.assertEquals(id, bindings[0][0], "Binding 1 not in the array.");
      this.assertEquals(id2, bindings[1][0], "Binding 2 not in the array.");

      // check for a non existing binding
      var noBindings = qx.data.SingleValueBinding.getAllBindingsForObject(this);
      this.assertEquals(0, noBindings.length, "There are bindings for this?");
    },


    testRemoveAllBindingsForObject: function() {
      // add two bindings
      qx.data.SingleValueBinding.bind(this.__a, "appearance", this.__b, "appearance");
      qx.data.SingleValueBinding.bind(this.__a, "zIndex", this.__b, "zIndex");
      // set and check the binding
      this.__a.appearance = ("hans");
      this.assertEquals("hans", this.__b.appearance, "String binding does not work!");
      this.__a.zIndex = (89);
      this.assertEquals(89, this.__b.zIndex, "Number binding does not work!");

      // remove the bindings at once
      qx.data.SingleValueBinding.removeAllBindingsForObject(this.__a);

      // set and check the binding
      this.__a.appearance = ("hans2");
      this.assertEquals("hans", this.__b.appearance, "String binding not removed!");
      this.__a.zIndex = (892);
      this.assertEquals(89, this.__b.zIndex, "Number binding not removed!");

      // check if they are internaly removed
      var bindings = qx.data.SingleValueBinding.getAllBindingsForObject(this.__a);
      this.assertEquals(0, bindings.length, "Still bindings there!");

      // only test in the source version
      if (qx.core.Environment.get("qx.debug")) {
        // test for null object
        this.assertException(function() {
          qx.data.SingleValueBinding.removeAllBindingsForObject(null);
        }, qx.core.AssertionError, null, "Null is not possible!");
      }

   },


    testGetAllBindings: function(){
      // add three bindings
      var id1 = qx.data.SingleValueBinding.bind(this.__a, "appearance", this.__b, "appearance");
      var id2 = qx.data.SingleValueBinding.bind(this.__a, "zIndex", this.__b, "zIndex");
      var id3 = qx.data.SingleValueBinding.bind(this.__b, "zIndex", this.__a, "zIndex");

      // get all bindings
      var allBindings = qx.data.SingleValueBinding.getAllBindings();

      this.assertEquals(2, allBindings[this.__a.$$bindingHash].length, "Too much or too less objects in the array!");
      this.assertEquals(1, allBindings[this.__b.$$bindingHash].length, "Too much or too less objects in the array!");
      // check for the binding ids
      // this.assertEquals(id1, allBindings[this.__a.toHashCode()][0][0], "This id should be in!");
      // this.assertEquals(id2, allBindings[this.__a.toHashCode()][1][0], "This id should be in!");
      // this.assertEquals(id3, allBindings[this.__b.toHashCode()][0][0], "This id should be in!");
      //
      // // check for the length
      // this.assertEquals(2, allBindings[this.__a.toHashCode()].length, "Not the right amount in the data!");
      // this.assertEquals(1, allBindings[this.__b.toHashCode()].length, "Not the right amount in the data!");
    },


    testDebugStuff: function(){
      // just a test if the method runs threw without an exception
      var id1 = qx.data.SingleValueBinding.bind(this.__a, "appearance", this.__b, "appearance");
      qx.data.SingleValueBinding.bind(this.__a, "zIndex", this.__b, "zIndex");
      qx.data.SingleValueBinding.bind(this.__b, "appearance", this.__a, "appearance");
      qx.data.SingleValueBinding.bind(this.__b, "zIndex", this.__a, "zIndex");
      // test the single log
      qx.data.SingleValueBinding.showBindingInLog(this.__a, id1);
    },


    testMixinSupport: function() {
      // create a new Binding
      var id1 = qx.data.SingleValueBinding.bind(this.__a, "appearance", this.__b, "appearance");
      this.__a.appearance = ("hulk");
      this.assertEquals("hulk", this.__b.appearance, "String binding does not work!");

      // remove the binding
      qx.data.SingleValueBinding.removeBindingFromObject(this.__a, id1);
      this.__a.appearance = ("hulk2");
      this.assertEquals("hulk", this.__b.appearance, "Unbinding does not work!");

      // add another two bindings
      id1 = qx.data.SingleValueBinding.bind(this.__a, "changeAppearance", this.__b, "appearance");
      var id2 = qx.data.SingleValueBinding.bind(this.__a, "zIndex", this.__b, "zIndex");

      // get the current bindings
      var bindings = qx.data.SingleValueBinding.getAllBindingsForObject(this.__a);
      this.assertEquals(id1, bindings[0][0], "First binding is not there.");
      this.assertEquals(id2, bindings[1][0], "Second binding is not there.");

      // remove all bindings
      qx.data.SingleValueBinding.removeAllBindingsForObject(this.__a);
      bindings = qx.data.SingleValueBinding.getAllBindingsForObject(this.__a);
      this.assertEquals(0, bindings.length, "Still bindings there?");
    },


    testDebugListenerMessages: function() {
      // enable debugging
      qx.data.SingleValueBinding.DEBUG_ON = true;

      // just do some bindings and invoke the changes
      qx.data.SingleValueBinding.bind(this.__a, "appearance", this.__b, "appearance");
      this.__a.appearance = ("affe");
      this.assertEquals("affe", this.__b.appearance, "String binding does not work!");

      var affe = new qx.test.data.singlevalue.TextFieldDummy();
      affe.appearance = ("Jonny");
      qx.data.SingleValueBinding.bind(affe, "appearance", this.__b, "appearance");
      this.assertEquals("Jonny", this.__b.appearance, "String binding does not work!");
      qx.data.SingleValueBinding.removeAllBindingsForObject(affe);
    },


    testFallback: function() {
      // change + "name" binding
      qx.data.SingleValueBinding.bind(this.__a, "value", this.__b, "value");

      this.__a.value = ("affe");
      this.assertEquals(this.__a.value, this.__b.value, "change event binding is not working.");

      // event binding
      qx.data.SingleValueBinding.bind(this.__a, "changeZIndex", this.__b, "zIndex");

      this.__a.zIndex = (123);
      this.assertEquals(this.__a.zIndex, this.__b.zIndex, "Event binding is not working.");
    },


    testNullWithConverter: function() {
      var t = {};
      // define the converter
      var options = {
        converter : function(data) {
          if (data == null) {
            return "affe";
          }
          return data + "";
        }
      };

      // starting point
      this.__a.zIndex = (null);
      qx.data.SingleValueBinding.bind(this.__a, "zIndex", t, "a", options);
      this.assertEquals("affe", t.a, "Converter will not be executed.");

      this.__a.zIndex = (10);
      this.assertEquals(this.__a.zIndex + "", t.a, "Wrong start binding.");

      // set the zIndex to null
      this.__a.zIndex = (null);
      this.assertEquals("affe", t.a, "Converter will not be executed.");
    },


    testCallbacksOnInitialSet: function() {
      // create a test class
      qx.Bootstrap.define("qx.Target", {
        properties :
        {
          value : {
            init: "Some String!",
            check: "String"
          }
        }
      });
      var target = new qx.Target();

      // some test flags
      var ok = false;

      // callback methods
      var that = this;
      var options = {
        onUpdate : function(sourceObject, targetObject, value) {
          ok = true;
          that.assertEquals(sourceObject, that.__a, "Wrong source object.");
          that.assertEquals(targetObject, target, "Wrong target object.");
          that.assertEquals(value, "affe", "Wrong value.");
        }
      };

      // set a valid initial value
      this.__a.value = ("affe");
      qx.data.SingleValueBinding.bind(this.__a, "value", target, "value", options);

      this.assertEquals("affe", target.value, "Binding not set anyway!");
      this.assertTrue(ok, "onUpdate not called.");


      // reset the checks
      qx.data.SingleValueBinding.removeAllBindingsForObject(this.__a);
      ok = false;

      // set an invalid initial value
      this.__a.floatt = [];
      this.assertException(function() {
        qx.data.SingleValueBinding.bind(this.__a, "floatt", target, "value", options);
      });
    },


    testConversionClass : function()
    {
      qx.Bootstrap.define("qx.test.TwoProperties", {
        extend : qx.event.Emitter,
        properties : {
          a : { event : true, nullable : true },
          b : { event : true, nullable : true }
        }
      });

      var o = new qx.test.TwoProperties();

      // number to string
      var id = qx.data.SingleValueBinding.bind(
        o, "a", o, "b", qx.data.Conversion.TOSTRINGOPTIONS
      );
      o.a = (10);
      this.assertEquals("10", o.b, "Number -> String");
      qx.data.SingleValueBinding.removeBindingFromObject(o, id);

      // boolean to string
      id = qx.data.SingleValueBinding.bind(
        o, "a", o, "b", qx.data.Conversion.TOSTRINGOPTIONS
      );
      o.a = (true);
      this.assertEquals("true", o.b, "Boolean -> String");
      qx.data.SingleValueBinding.removeBindingFromObject(o, id);

      // date to string
      id = qx.data.SingleValueBinding.bind(
        o, "a", o, "b", qx.data.Conversion.TOSTRINGOPTIONS
      );
      o.a = (new Date());
      this.assertTrue(qx.lang.Type.isString(o.b), "Date -> String");
      qx.data.SingleValueBinding.removeBindingFromObject(o, id);

      // string to number
      id = qx.data.SingleValueBinding.bind(
        o, "a", o, "b", qx.data.Conversion.TONUMBEROPTIONS
      );
      o.a = ("123");
      this.assertEquals(123, o.b, "String -> Number");
      qx.data.SingleValueBinding.removeBindingFromObject(o, id);

      // string to boolean
      id = qx.data.SingleValueBinding.bind(
        o, "a", o, "b", qx.data.Conversion.TOBOOLEANOPTIONS
      );
      o.a = ("123");
      this.assertEquals(true, o.b, "String -> Boolean");
      qx.data.SingleValueBinding.removeBindingFromObject(o, id);

      // number to boolean
      id = qx.data.SingleValueBinding.bind(
        o, "a", o, "b", qx.data.Conversion.TOBOOLEANOPTIONS
      );
      o.a = (0);
      this.assertEquals(false, o.b, "Number -> Boolean");
      qx.data.SingleValueBinding.removeBindingFromObject(o, id);

    },


    testResetNotNull : function() {
      qx.Bootstrap.define("qx.test.SVB", {
        extend : qx.event.Emitter,
        properties : {
          x : {
            nullable: true,
            init: "affe",
            event: true
          }
        }
      });

      var a = new qx.test.SVB();
      var b = new qx.test.SVB();

      qx.data.SingleValueBinding.bind(a, "x", b, "x");

      a.x = ("x");
      this.assertEquals(a.x, b.x);
      a.x = (null);
      this.assertEquals(a.x, b.x);

      qx.data.SingleValueBinding.removeAllBindingsForObject(a);
      qx.data.SingleValueBinding.removeAllBindingsForObject(b);

      delete qx.test.SVB;
    },


    testResetNotNullInit : function() {
      qx.Bootstrap.define("qx.test.SVB", {
        extend : qx.event.Emitter,
        properties : {
          x : {
            nullable: true,
            init: "affe",
            event: true
          }
        }
      });

      var a = new qx.test.SVB();
      var b = new qx.test.SVB();

      a.x = (null);
      b.x = ("x");
      qx.data.SingleValueBinding.bind(a, "x", b, "x");

      this.assertEquals(a.x, b.x);

      qx.data.SingleValueBinding.removeAllBindingsForObject(a);
      qx.data.SingleValueBinding.removeAllBindingsForObject(b);

      delete qx.test.SVB;
    },


    testConverterParam : function() {
      var self = this;
      var options = {converter : function(data, model, source, target) {
        // will be called twice (init and set)
        self.assertEquals(self.__a, source);
        self.assertEquals(self.__b, target);
        return data;
      }};

      qx.data.SingleValueBinding.bind(
        this.__a, "appearance", this.__b, "appearance", options
      );
      this.__a.appearance = ("affe");
      this.assertEquals("affe", this.__b.appearance, "String binding does not work!");
    },


    testWrongArguments : function() {
      this.require(["qx.debug"]);

      this.assertException(function() {
        qx.data.SingleValueBinding.bind(this.__a, "appearance", this.__b, undefined);
      }, qx.core.AssertionError, "");

      this.assertException(function() {
        qx.data.SingleValueBinding.bind(this.__a, "appearance", undefined, "appearance");
      }, qx.core.AssertionError, "");

      this.assertException(function() {
        qx.data.SingleValueBinding.bind(this.__a, undefined, this.__b, "appearance");
      }, qx.core.AssertionError, "");

      this.assertException(function() {
        qx.data.SingleValueBinding.bind(undefined, "appearance", this.__b, "appearance");
      }, qx.core.AssertionError, "");
    }
  }
});

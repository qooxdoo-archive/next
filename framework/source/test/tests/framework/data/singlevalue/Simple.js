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
var __a  = null;
var __b = null;

  //include : qx.dev.unit.MRequirements,

describe("data.singlevalue.Simple", function() {
    beforeEach (function () {
      // create the widgets
      __a = new data.singlevalue.TextFieldDummy();
      __b = new data.singlevalue.TextFieldDummy();
    });


    afterEach (function () {
      qx.data.SingleValueBinding.removeAllBindingsForObject(__a);
      qx.data.SingleValueBinding.removeAllBindingsForObject(__b);
  });
 
  it("StringPropertyBinding", function() {
      qx.data.SingleValueBinding.bind(__a, "appearance", __b, "appearance");
      __a.appearance = "affe";
      assert.equal("affe", __b.appearance, "String binding does not work!");

      var affe = new data.singlevalue.TextFieldDummy();
      affe.appearance = "Jonny";
      qx.data.SingleValueBinding.bind(affe, "appearance", __b, "appearance");
      assert.equal("Jonny", __b.appearance, "String binding does not work!");
  });
 
  it("BooleanPropertyBinding", function() {
      qx.data.SingleValueBinding.bind(__a, "enabled", __b, "enabled");
      __a.enabled = false;
      assert.isFalse(__b.enabled, "Boolean binding does not work!");
  });
 
  it("NumberPropertyBinding", function() {
      qx.data.SingleValueBinding.bind(__a, "zIndex", __b, "zIndex");
      __a.zIndex = 2456;
      assert.equal(2456, __b.zIndex, "Number binding does not work!");
  });
 
  it("ColorPropertyBinding", function() {
      qx.data.SingleValueBinding.bind(__a, "backgroundColor", __b, "backgroundColor");
      __a.backgroundColor = "red";
      assert.equal("red", __b.backgroundColor, "Color binding does not work!");
  });
 
  it("WrongPropertyNames", function() {
      if (qx.core.Environment.get("qx.debug")) {
        var a = __a;
        var b = __b;

        // wrong source
        assert.throw(function() {
          qx.data.SingleValueBinding.bind(a, "BacccccckgroundColor", b, "backgroundColor");
        }, qx.core.AssertionError, null, "Not a wrong property name? (source)");
      }
  });
 
  it("WrongEventType", function() {
      if (qx.core.Environment.get("qx.debug")) {
        var a = __a;
        var b = __b;

        // wrong eventName
        assert.throw(function() {
          qx.data.SingleValueBinding.bind(a, "affe", b, "backgroundColor");
        }, null, null, "Not a wrong event name? (source)");
      }
  });
 
  it("DefaultConversion", function() {
      // String to number
      __a.appearance = "0";
      qx.data.SingleValueBinding.bind(__a, "appearance", __b, "zIndex");
      __a.appearance = "4879";
      assert.equal(4879, __b.zIndex, "String --> Number does not work!");

      // number to String
      __a.zIndex = 568;
      qx.data.SingleValueBinding.bind(__a, "zIndex", __b, "appearance");
      __a.zIndex = 1234;
      assert.equal("1234", __b.appearance, "Number --> String does not work!");

      // boolean to string
      qx.data.SingleValueBinding.bind(__a, "enabled", __b, "appearance");
      __a.enabled = true;
      assert.equal("true", __b.appearance, "Boolean --> String does not work!");

      // string to float
      var s = new data.singlevalue.TextFieldDummy();
      s.floatt = 0;

      qx.data.SingleValueBinding.bind(s, "floatt", __b, "appearance");
      s.floatt = 13.5;
      assert.equal("13.5", __b.appearance, "Float --> String does not work!");

      qx.data.SingleValueBinding.removeAllBindingsForObject(s);
  });
 
  it("RemoveBinding", function() {
      // add a binding
      var id = qx.data.SingleValueBinding.bind(__a, "appearance", __b, "appearance");
      // set and chech the name
      __a.appearance = "hans";
      assert.equal("hans", __b.appearance, "String binding does not work!");

      // remove the binding
      qx.data.SingleValueBinding.removeBindingFromObject(__a, id);
      // set and check the name
      __a.appearance = "hans2";
      assert.equal("hans", __b.appearance, "Did not remove the binding!");

      // test if the binding is not listed anymore
      var bindings = qx.data.SingleValueBinding.getAllBindingsForObject(__a);
      assert.equal(0, bindings.length, "Binding still in the registry!");

      // only in source version
      if (qx.core.Environment.get("qx.debug")) {
        // test wrong binding id
        var a = __a;
        assert.throw(function() {
          qx.data.SingleValueBinding.removeBindingFromObject(a, null);
        }, Error, null, "No exception thrown.");
      }
  });
 
  it("GetAllBindingsForObject", function() {
      // add two binding
      var id = qx.data.SingleValueBinding.bind(__a, "appearance", __b, "appearance");
      var id2 = qx.data.SingleValueBinding.bind(__a, "zIndex", __b, "zIndex");
      // set and chech the binding
      __a.appearance = "hans";
      assert.equal("hans", __b.appearance, "String binding does not work!");
      __a.zIndex = (89);
      assert.equal(89, __b.zIndex, "Number binding does not work!");

      // check the method
      var bindings = qx.data.SingleValueBinding.getAllBindingsForObject(__a);
      assert.equal(2, bindings.length, "There are more than 2 bindings!");
      assert.equal(id, bindings[0][0], "Binding 1 not in the array.");
      assert.equal(id2, bindings[1][0], "Binding 2 not in the array.");

      // check for a non existing binding
      var noBindings = qx.data.SingleValueBinding.getAllBindingsForObject(this);
      assert.equal(0, noBindings.length, "There are bindings for this?");
  });
 
  it("RemoveAllBindingsForObject", function() {
      // add two bindings
      qx.data.SingleValueBinding.bind(__a, "appearance", __b, "appearance");
      qx.data.SingleValueBinding.bind(__a, "zIndex", __b, "zIndex");
      // set and check the binding
      __a.appearance = ("hans");
      assert.equal("hans", __b.appearance, "String binding does not work!");
      __a.zIndex = (89);
      assert.equal(89, __b.zIndex, "Number binding does not work!");

      // remove the bindings at once
      qx.data.SingleValueBinding.removeAllBindingsForObject(__a);

      // set and check the binding
      __a.appearance = ("hans2");
      assert.equal("hans", __b.appearance, "String binding not removed!");
      __a.zIndex = (892);
      assert.equal(89, __b.zIndex, "Number binding not removed!");

      // check if they are internaly removed
      var bindings = qx.data.SingleValueBinding.getAllBindingsForObject(__a);
      assert.equal(0, bindings.length, "Still bindings there!");

      // only test in the source version
      if (qx.core.Environment.get("qx.debug")) {
        // test for null object
        assert.throw(function() {
          qx.data.SingleValueBinding.removeAllBindingsForObject(null);
        }, qx.core.AssertionError, null, "Null is not possible!");
      }

  });
 
  it("GetAllBindings", function() {
      // add three bindings
      var id1 = qx.data.SingleValueBinding.bind(__a, "appearance", __b, "appearance");
      var id2 = qx.data.SingleValueBinding.bind(__a, "zIndex", __b, "zIndex");
      var id3 = qx.data.SingleValueBinding.bind(__b, "zIndex", __a, "zIndex");

      // get all bindings
      var allBindings = qx.data.SingleValueBinding.getAllBindings();
      assert.isDefined(allBindings[__a.$$bindingHash]);
      assert.isDefined(allBindings[__b.$$bindingHash]);

      // check for the binding ids
      assert.equal(id1, allBindings[__a.$$bindingHash][0][0], "This id should be in!");
      assert.equal(id2, allBindings[__a.$$bindingHash][1][0], "This id should be in!");
      assert.equal(id3, allBindings[__b.$$bindingHash][0][0], "This id should be in!");

      // check for the length
      assert.equal(2, allBindings[__a.$$bindingHash].length, "Not the right amount in the data!");
      assert.equal(1, allBindings[__b.$$bindingHash].length, "Not the right amount in the data!");
  });
 
  it("DebugStuff", function() {
      // just a test if the method runs threw without an exception
      var id1 = qx.data.SingleValueBinding.bind(__a, "appearance", __b, "appearance");
      qx.data.SingleValueBinding.bind(__a, "zIndex", __b, "zIndex");
      qx.data.SingleValueBinding.bind(__b, "appearance", __a, "appearance");
      qx.data.SingleValueBinding.bind(__b, "zIndex", __a, "zIndex");
      // test the single log
      qx.data.SingleValueBinding.showBindingInLog(__a, id1);
  });
 
  it("MixinSupport", function() {
      // create a new Binding
      var id1 = qx.data.SingleValueBinding.bind(__a, "appearance", __b, "appearance");
      __a.appearance = ("hulk");
      assert.equal("hulk", __b.appearance, "String binding does not work!");

      // remove the binding
      qx.data.SingleValueBinding.removeBindingFromObject(__a, id1);
      __a.appearance = ("hulk2");
      assert.equal("hulk", __b.appearance, "Unbinding does not work!");

      // add another two bindings
      id1 = qx.data.SingleValueBinding.bind(__a, "changeAppearance", __b, "appearance");
      var id2 = qx.data.SingleValueBinding.bind(__a, "zIndex", __b, "zIndex");

      // get the current bindings
      var bindings = qx.data.SingleValueBinding.getAllBindingsForObject(__a);
      assert.equal(id1, bindings[0][0], "First binding is not there.");
      assert.equal(id2, bindings[1][0], "Second binding is not there.");

      // remove all bindings
      qx.data.SingleValueBinding.removeAllBindingsForObject(__a);
      bindings = qx.data.SingleValueBinding.getAllBindingsForObject(__a);
      assert.equal(0, bindings.length, "Still bindings there?");
  });
 
  it("DebugListenerMessages", function() {
      // enable debugging
      qx.data.SingleValueBinding.DEBUG_ON = true;

      // just do some bindings and invoke the changes
      qx.data.SingleValueBinding.bind(__a, "appearance", __b, "appearance");
      __a.appearance = ("affe");
      assert.equal("affe", __b.appearance, "String binding does not work!");

      var affe = new data.singlevalue.TextFieldDummy();
      affe.appearance = ("Jonny");
      qx.data.SingleValueBinding.bind(affe, "appearance", __b, "appearance");
      assert.equal("Jonny", __b.appearance, "String binding does not work!");
      qx.data.SingleValueBinding.removeAllBindingsForObject(affe);
  });
 
  it("Fallback", function() {
      // change + "name" binding
      qx.data.SingleValueBinding.bind(__a, "value", __b, "value");

      __a.value = ("affe");
      assert.equal(__a.value, __b.value, "change event binding is not working.");

      // event binding
      qx.data.SingleValueBinding.bind(__a, "changeZIndex", __b, "zIndex");

      __a.zIndex = (123);
      assert.equal(__a.zIndex, __b.zIndex, "Event binding is not working.");
  });
 
  it("NullWithConverter", function() {
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
      __a.zIndex = (null);
      qx.data.SingleValueBinding.bind(__a, "zIndex", t, "a", options);
      assert.equal("affe", t.a, "Converter will not be executed.");

      __a.zIndex = (10);
      assert.equal(__a.zIndex + "", t.a, "Wrong start binding.");

      // set the zIndex to null
      __a.zIndex = (null);
      assert.equal("affe", t.a, "Converter will not be executed.");
  });
 
  it("CallbacksOnInitialSet", function() {
      // create a test class
      qx.Class.define("qx.Target", {
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
      
      var options = {
        onUpdate : function(sourceObject, targetObject, value) {
          ok = true;
          assert.equal(sourceObject, __a, "Wrong source object.");
          assert.equal(targetObject, target, "Wrong target object.");
          assert.equal(value, "affe", "Wrong value.");
        }
      };

      // set a valid initial value
      __a.value = ("affe");
      qx.data.SingleValueBinding.bind(__a, "value", target, "value", options);

      assert.equal("affe", target.value, "Binding not set anyway!");
      assert.isTrue(ok, "onUpdate not called.");


      // reset the checks
      qx.data.SingleValueBinding.removeAllBindingsForObject(__a);
      ok = false;

      // set an invalid initial value
      __a.floatt = [];
      assert.throw(function() {
        qx.data.SingleValueBinding.bind(__a, "floatt", target, "value", options);
      });
  });
 
  it("ConversionClass", function() {
      qx.Class.define("TwoProperties", {
        extend : Object,
        include : [qx.event.MEmitter],
        properties : {
          a : { event : true, nullable : true },
          b : { event : true, nullable : true }
        }
      });

      var o = new TwoProperties();

      // number to string
      var id = qx.data.SingleValueBinding.bind(
        o, "a", o, "b", qx.data.Conversion.TOSTRINGOPTIONS
      );
      o.a = (10);
      assert.equal("10", o.b, "Number -> String");
      qx.data.SingleValueBinding.removeBindingFromObject(o, id);

      // boolean to string
      id = qx.data.SingleValueBinding.bind(
        o, "a", o, "b", qx.data.Conversion.TOSTRINGOPTIONS
      );
      o.a = (true);
      assert.equal("true", o.b, "Boolean -> String");
      qx.data.SingleValueBinding.removeBindingFromObject(o, id);

      // date to string
      id = qx.data.SingleValueBinding.bind(
        o, "a", o, "b", qx.data.Conversion.TOSTRINGOPTIONS
      );
      o.a = (new Date());
      assert.isTrue(qx.lang.Type.isString(o.b), "Date -> String");
      qx.data.SingleValueBinding.removeBindingFromObject(o, id);

      // string to number
      id = qx.data.SingleValueBinding.bind(
        o, "a", o, "b", qx.data.Conversion.TONUMBEROPTIONS
      );
      o.a = ("123");
      assert.equal(123, o.b, "String -> Number");
      qx.data.SingleValueBinding.removeBindingFromObject(o, id);

      // string to boolean
      id = qx.data.SingleValueBinding.bind(
        o, "a", o, "b", qx.data.Conversion.TOBOOLEANOPTIONS
      );
      o.a = ("123");
      assert.equal(true, o.b, "String -> Boolean");
      qx.data.SingleValueBinding.removeBindingFromObject(o, id);

      // number to boolean
      id = qx.data.SingleValueBinding.bind(
        o, "a", o, "b", qx.data.Conversion.TOBOOLEANOPTIONS
      );
      o.a = (0);
      assert.equal(false, o.b, "Number -> Boolean");
      qx.data.SingleValueBinding.removeBindingFromObject(o, id);

  });
 
  it("ResetNotNull", function() {
      qx.Class.define("SVB", {
        extend : Object,
        include : [qx.event.MEmitter],
        properties : {
          x : {
            nullable: true,
            init: "affe",
            event: true
          }
        }
      });

      var a = new SVB();
      var b = new SVB();

      qx.data.SingleValueBinding.bind(a, "x", b, "x");

      a.x = ("x");
      assert.equal(a.x, b.x);
      a.x = (null);
      assert.equal(a.x, b.x);

      qx.data.SingleValueBinding.removeAllBindingsForObject(a);
      qx.data.SingleValueBinding.removeAllBindingsForObject(b);

      delete SVB;
  });
 
  it("ResetNotNullInit", function() {
      qx.Class.define("SVB", {
        extend : Object,
        include : [qx.event.MEmitter],
        properties : {
          x : {
            nullable: true,
            init: "affe",
            event: true
          }
        }
      });

      var a = new SVB();
      var b = new SVB();

      a.x = (null);
      b.x = ("x");
      qx.data.SingleValueBinding.bind(a, "x", b, "x");

      assert.equal(a.x, b.x);

      qx.data.SingleValueBinding.removeAllBindingsForObject(a);
      qx.data.SingleValueBinding.removeAllBindingsForObject(b);

      delete SVB;
  });
 
  it("ConverterParam", function() {
      
      var options = {converter : function(data, model, source, target) {
        // will be called twice (init and set)
        assert.equal(__a, source);
        assert.equal(__b, target);
        return data;
      }};

      qx.data.SingleValueBinding.bind(
        __a, "appearance", __b, "appearance", options
      );
      __a.appearance = ("affe");
      assert.equal("affe", __b.appearance, "String binding does not work!");
  });
 
  it("WrongArguments", function() {
      //require(["qx.debug"]);

      assert.throw(function() {
        qx.data.SingleValueBinding.bind(__a, "appearance", __b, undefined);
      }, qx.core.AssertionError, "");

      assert.throw(function() {
        qx.data.SingleValueBinding.bind(__a, "appearance", undefined, "appearance");
      }, qx.core.AssertionError, "");

      assert.throw(function() {
        qx.data.SingleValueBinding.bind(__a, undefined, __b, "appearance");
      }, qx.core.AssertionError, "");

      assert.throw(function() {
        qx.data.SingleValueBinding.bind(undefined, "appearance", __b, "appearance");
      }, qx.core.AssertionError, "");
  });
 
  it("RemoveRelatedBindings", function() {
      var c = new data.singlevalue.TextFieldDummy();

      // add three bindings
      qx.data.SingleValueBinding.bind(__a, "appearance", __b, "appearance");
      qx.data.SingleValueBinding.bind(__a, "zIndex", __b, "zIndex");
      qx.data.SingleValueBinding.bind(__b, "zIndex", __a, "zIndex");

      // add another binding to __a, which should not be affected
      qx.data.SingleValueBinding.bind(c, "appearance", __a, "appearance");

      // add another binding to __b, which should not be affected
      qx.data.SingleValueBinding.bind(c, "appearance", __b, "appearance");

      // check if the bindings are there
      var bindingsA = qx.data.SingleValueBinding.getAllBindingsForObject(__a);
      var bindingsB = qx.data.SingleValueBinding.getAllBindingsForObject(__b);
      assert.equal(4, bindingsA.length, "There are more than 4 bindings!");
      assert.equal(4, bindingsB.length, "There are more than 3 bindings!");

      // remove related bindings between __a and __b, do not affect bindings to c
      qx.data.SingleValueBinding.removeRelatedBindings(__a, __b);

      // __a object should have one binding to object c
      bindingsA = qx.data.SingleValueBinding.getAllBindingsForObject(__a);
      assert.equal(1, bindingsA.length, "There must be one binding!");
      assert.isTrue(bindingsA[0][1] === c, "Source object of the binding must be object 'c'!");

      // __b object should have one binding to object c
      bindingsB = qx.data.SingleValueBinding.getAllBindingsForObject(__b);
      assert.equal(1, bindingsB.length, "There must be one binding!");
      assert.isTrue(bindingsA[0][1] === c, "Source object of the binding must be object 'c'!");
  });
  
});

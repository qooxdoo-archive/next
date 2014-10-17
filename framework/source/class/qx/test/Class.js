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
     * Fabian Jakobs (fjakobs)
     * Martin Wittemann (martinwittemann)

************************************************************************ */

/**
 * @ignore(qx.test.Construct.*, qx.test.ExtendError, qx.test.ExtendNull)
 * @ignore(qx.test.ExtendQxObject, qx.test.ExtendSuper.*, qx.test.Super.*)
 * @ignore(qx.test.ROOT, qx.test.MyClass.*, qx.test.Car, qx.test.Bmw.*)
 */
qx.Class.define("qx.test.Class",
{
  extend : qx.dev.unit.TestCase,
  include : qx.dev.unit.MMock,

  construct: function() {
    this.initMMock();
  },


  members :
  {
    testDefineAnonymous : function() {
      var clazz = qx.Class.define(null, {statics : {
        test : function() {
          return true;
        }
      }});

      this.assertTrue(clazz.test());

      clazz = qx.Class.define(null, {statics : {
        test2 : function() {
          return true;
        }
      }});

      this.assertTrue(clazz.test2());
    },


    testClassnameProperty : function() {
      qx.Class.define("qx.test.MyClass", {
        //extend : Object,
        members : {}
      });

      var o = new qx.test.MyClass();
      this.assertEquals("qx.test.MyClass", o.classname);
      this.assertEquals("qx.test.MyClass", o.$$name);

      delete qx.test.MyClass;
    },


    testAlternativeRoot : function() {
      var qq = {};
      var foobar = {};
      var myRoots = { "qq": qq, "foobar": foobar };
      qx.Class.setRoot(myRoots);

      var qqClass = qx.Class.define("qq.test.ROOT", {});
      var foobarClass = qx.Class.define("foobar.test.ROOT", {});
      var vanillebaerClass = qx.Class.define("vanillebaer.test.ROOT", {});

      this.assertEquals(qqClass, qq.test.ROOT);
      this.assertEquals(foobarClass, foobar.test.ROOT);
      this.assertEquals(vanillebaerClass, window.vanillebaer.test.ROOT);

      qx.Class.setRoot(undefined);
      delete vanillebaer.test.ROOT;
    },

    "test: merge methods of same class (statics optimization)" : function() {
      qx.Class.define("qx.test.MyClass", {
        statics : {
          methodA : function() {
            return true;
          }
        }
      });

      qx.Class.define("qx.test.MyClass", {
        statics : {
          methodB : function() {
            return true;
          }
        }
      });

      this.assertNotUndefined(qx.test.MyClass.methodA);
      this.assertNotUndefined(qx.test.MyClass.methodB);

      delete qx.test.MyClass;
    },

    "test: merge methods of same class (statics optimization) respect defer" : function() {
      qx.Class.define("qx.test.MyClass", {
        statics : {
          methodA : function() {
            return true;
          },
          methodB : function() {
            return true;
          }
        }
      });

      qx.Class.define("qx.test.MyClass", {
        statics : {
          methodA : null
        },
        classDefined : function(statics)
        {
          statics.methodA = function() { return true; };
        }
      });

      this.assertNotNull(qx.test.MyClass.methodA);
      this.assertNotUndefined(qx.test.MyClass.methodB);

      delete qx.test.MyClass;
    },

    "test: define class with contructor" : function()
    {
      var c = qx.Class.define("qx.test.Construct",
      {
        extend: Object,
        construct : function() {
          this.called = true;
        }
      });

      var obj = new qx.test.Construct();
      this.assertTrue(obj.called);

      this.assertEquals(c, qx.Class.getByName("qx.test.Construct"));
      this.assertEquals(qx.test.Construct, qx.Class.getByName("qx.test.Construct"));

      delete qx.test.Construct;
    },


    "test: define bootstrap class, which extends 'Error'" : function()
    {
      qx.Class.define("qx.test.ExtendError", {
        extend: Error
      });

      var obj = new qx.test.ExtendError();
      this.assertInstance(obj, Error);

      delete qx.test.ExtendError;
    },


    "test: extend from Bootstrap class" : function()
    {
      qx.Class.define("qx.test.Super", {
        members : {}
      });

      qx.Class.define("qx.test.ExtendSuper", {
        extend: qx.test.Super,
        members : {}
      });

      var obj = new qx.test.ExtendSuper();

      this.assertInstance(obj, Object);
      this.assertInstance(obj, qx.test.Super);
      this.assertInstance(obj, qx.test.ExtendSuper);

      delete qx.test.Super;
      delete qx.test.ExtendSuper;
    },


    "test: extended Bootstap class should append members to the prototype" : function()
    {
      qx.Class.define("qx.test.Super", {
        members : {
          foo : 10,
          baz: "juhu"
        }
      });

      qx.Class.define("qx.test.ExtendSuper", {
        extend: qx.test.Super,
        members : {
          bar : "affe",
          foo : 11
        }
      });

      var obj = new qx.test.ExtendSuper();
      this.assertEquals("affe", obj.bar);
      this.assertEquals(11, obj.foo);
      this.assertEquals("juhu", obj.baz);

      this.assertEquals(11, qx.test.ExtendSuper.prototype.foo);
      this.assertEquals(10, qx.test.Super.prototype.foo);

      delete qx.test.Super;
      delete qx.test.ExtendSuper;
    },

    "test: superclass calls aka basecalls (constructor and methods)" : function()
    {
      qx.Class.define("qx.test.Car",
      {
        construct : function(name) {
          this._name = name;
        },

        members :
        {
          startEngine : function() {
            return "start";
          },

          stopEngine : function() {
            return "stop";
          },

          getName : function() {
            return this._name;
          }
        }
      });

      var car = new qx.test.Car("Audi");
      this.assertEquals("start", car.startEngine());
      this.assertEquals("stop", car.stopEngine());
      this.assertEquals("Audi", car.getName());

      qx.Class.define("qx.test.Bmw",
      {
        extend : qx.test.Car,

        construct : function affe(name, prize) {
          this.base(qx.test.Car, "constructor", name);
        },

        members :
        {
          startEngine : function()
          {
            var ret = this.base(qx.test.Car, "startEngine");
            return "brrr " + ret;
          },

          stopEngine : function()
          {
            var ret = this.base(qx.test.Car, "stopEngine");
            return "brrr " + ret;
          },

          getWheels : function() {
            return qx.test.Bmw.WHEELS;
          },

          getMaxSpeed : function()
          {
            // call base in non overridden method
            this.base(qx.test.Car, "getMaxSpeed");
          }
        },

        statics : { WHEELS : 4 }
      });

      var bmw = new qx.test.Bmw("bmw", 44000);
      this.assertEquals("bmw", bmw.getName());
      this.assertEquals("brrr start", bmw.startEngine());
      this.assertEquals("brrr stop", bmw.stopEngine());
      this.assertEquals(4, bmw.getWheels());

      if (this.isDebugOn())
      {
        this.assertException(function() {
          bmw.getMaxSpeed();
        }, Error);
      }

      delete qx.test.Car;
      delete qx.test.Bmw;
    },

    testFunctionWrap : function()
    {
      var context = null;
      var result = 0;

      var add = function(a, b)
      {
        context = this;
        return a + b;
      };

      context = null;
      result = add(1, 2);

      this.assertEquals(context, window);
      this.assertEquals(3, result);

      context = null;
      var boundAdd = add.bind(this);
      result = boundAdd(1, 3);
      this.assertEquals(context, this);
      this.assertEquals(4, result);

      context = null;
      var addOne = add.bind(this, 1);
      result = addOne(4);
      this.assertEquals(context, this);
      this.assertEquals(5, result);
    },


    testDefineShadowedStatics : function()
    {
      qx.Class.define("qx.test.Construct",
      {
        extend: Object,
        statics : {
          "isPrototypeOf" : 10,
          "toLocaleString" : 12,
          "toString" : 13,
          "valueOf" : 14
        }
      });

      this.assertEquals(10, qx.test.Construct.isPrototypeOf);
      this.assertEquals(12, qx.test.Construct.toLocaleString);
      this.assertEquals(13, qx.test.Construct.toString);
      this.assertEquals(14, qx.test.Construct.valueOf);

      delete qx.test.Construct;
    },


    testPropertyInit : function() {
      var C = qx.Class.define(null, {
        properties : {
          a: {
            init: 11
          },
          b: {
            init: 12
          }
        }
      });

      var c = new C();
      this.assertEquals(11, c.a);
      this.assertEquals(12, c.b);

      c.a = 0;
      this.assertEquals(0, c.a);
    },


    testPropertyReset : function() {
      var C = qx.Class.define(null, {
        properties : {
          a: {
            init: 11
          },
          b: {
            check : "String",
            init: ""
          }
        }
      });

      var c = new C();
      this.assertEquals(11, c.a);
      c.a = "A";
      this.assertEquals("A", c.a);
      c.a = undefined;
      this.assertEquals(11, c.a);

      this.assertEquals("", c.b);
      c.b = "13";
      this.assertEquals("13", c.b);
      c.b = undefined;
      this.assertEquals("", c.b);
    },


    testPropertyNullable : function() {
      var C = qx.Class.define(null, {
        properties : {
          a: {
            nullable: true
          },
          b: {
            init: 12,
            nullable: false
          },
          c: {}
        }
      });

      var c = new C();

      this.assertUndefined(c.a);
      c.a = null;
      this.assertNull(c.a);
      c.a = undefined;
      this.assertUndefined(c.a);

      this.assertException(function() {
        c.b = null;
      });

      this.assertException(function() {
        c.c = null;
      });
    },


    testPropertyApply : function() {
      var self = this;
      var applyA = this.spy(function(value, old) {
        self.assertEquals(value, this.a);
      });
      var applyB = this.spy();
      var C = qx.Class.define(null, {
        properties : {
          a: {
            apply : "_applyA"
          },
          b: {
            apply : applyB,
            init: "b"
          }
        },
        members : {
          _applyA : applyA
        }
      });

      var c = new C();

      c.a = 11;
      this.assertCalledOnce(applyA);
      this.assertCalledWith(applyA, 11, undefined, "a");

      c.a = 12;
      this.assertCalledTwice(applyA);
      this.assertCalledWith(applyA, 12, 11, "a");

      c.b = 11;
      this.assertCalledOnce(applyB);
      this.assertCalledWith(applyB, 11, "b", "b");

      c.b = undefined;
      this.assertCalledTwice(applyB);
      this.assertCalledWith(applyB, "b", 11, "b");
    },


    testPropertyEventEmitter : function() {
      var C = qx.Class.define(null, {
        extend : Object,
        include : [qx.event.MEmitter],
        properties : {
          a: {
            event : true,
            init: 11
          }
        }
      });

      var c = new C();

      var handler = this.spy();
      c.on("changeA", handler);
      c.a = 12;

      this.assertCalledOnce(handler);
      this.assertCalledWith(handler, {value: 12, old: 11, target: c});
    },


    testPropertyEventFail : function() {
      var C = qx.Class.define(null, {
        properties : {
          a: {
            event : true,
            init: 11
          }
        }
      });

      var c = new C();
      this.assertException(function() {
        c.a = 1213123;
      });
    },


    testPropertyChecks : function() {
      var O = qx.Class.define(null, {
        implement: [qx.ui.core.ISingleSelectionProvider],
        members: {
          getItems: function() {},
          isItemSelectable: function() {}
        }
      });

      var C = qx.Class.define(null, {
        properties : {
          s: {
            check : "String"
          },
          b: {
            check : "Boolean"
          },
          n : {
            check: "Number"
          },
          o : {
            check: "Object"
          },
          a : {
            check : "Array"
          },
          f : {
            check : "Function"
          },
          d : {
            check : "Date"
          },
          e : {
            check : "Error"
          },
          r : {
            check : "RegExp"
          },
          q : {
            check : "qx.dev.unit.TestClass"
          },
          i : {
            check : "qx.ui.core.ISingleSelectionProvider"
          }
        }
      });

      var c = new C();
      c.s = "string";
      c.b = true;
      c.n = 12321.32423;
      c.o = {};
      c.a = [];
      c.f = function() {};
      c.d = new Date();
      c.e = new Error();
      c.r = /./g;
      c.q = new qx.dev.unit.TestClass();
      c.i = new O();

      this.assertException(function() {
        c.s = true;
      });
      this.assertException(function() {
        c.b = "string";
      });
      this.assertException(function() {
        c.n = {};
      });
      this.assertException(function() {
        c.o = 213;
      });
      this.assertException(function() {
        c.a = {};
      });
      this.assertException(function() {
        c.f = true;
      });
      this.assertException(function() {
        c.d = {};
      });
      this.assertException(function() {
        c.e = {};
      });
      this.assertException(function() {
        c.r = 83924;
      });
      this.assertException(function() {
        c.i = c;
      });
    },


    testPropertyCheckFunction : function() {
      var checkA = this.spy(function() {return true;});
      var checkB = this.spy(function() {return true;});
      var C = qx.Class.define(null, {
        properties : {
          a : {
            check : checkA
          },
          b : {
            check : "_checkB"
          }
        },
        members : {
          _checkB : checkB
        }
      });

      var c = new C();
      c.a = "a";
      c.b = "b";

      this.assertCalledOnce(checkA);
      this.assertCalledWith(checkA, "a");
      this.assertCalledOnce(checkB);
      this.assertCalledWith(checkB, "b");
    },


    testPropertyRefine : function() {
      var C = qx.Class.define("C", {
        properties : {
          a: {
            init: 11,
            check: "Number",
            event: false,
            apply: function() {}
          }
        }
      });

      var D = qx.Class.define("D", {
        extend : C,
        properties : {
          a: {
            init: 12
          }
        }
      });

      var c = new C();
      this.assertEquals(11, c.a);
      var d = new D();
      this.assertEquals(12, d.a);

      this.assertException(function() {
        qx.Class.define(null, {
          extend: C,
          properties: {
            a: {
              check: "String"
            }
          }
        });
      });

      this.assertException(function() {
        qx.Class.define(null, {
          extend: C,
          properties: {
            a: {
              event: true
            }
          }
        });
      });

      this.assertException(function() {
        qx.Class.define(null, {
          extend: C,
          properties: {
            a: {
              apply: function() {}
            }
          }
        });
      });

    },

    testPropertyOverrideMethod : function() {
      var A = qx.Class.define(null, {
        members: {
          foo: function() {}
        }
      });

      this.assertException(function() {
        var B = qx.Class.define(null, {
          extend: A,
          properties: {
            foo: {}
          }
        });
      });
    },


    testPropertyInheritance : function() {
      var apply = this.spy();
      var C = qx.Class.define(null, {
        properties : {
          a: {
            nullable: true,
            check: "String",
            apply: apply
          }
        }
      });

      var D = qx.Class.define(null, {
        extend : C,
        properties : {
          a: {
            init: "foo"
          }
        }
      });

      var d = new D();
      d.a = null;
      this.assertCalledOnce(apply);
      this.assertException(function() {
        d.a = 23;
      });
    },


    testClassDefined : function() {
      var classDefined = this.spy();
      var C = qx.Class.define(null, {
        extend: Object,
        classDefined: classDefined
      });

      new C();
      this.assertCalledOnce(classDefined);
    },

    testValidateConfig : function() {
      this.assertException(function() {
        qx.Class.define(null, {
          extend: Object,
          foo: {}
        });
      });

      this.assertException(function() {
        qx.Class.define(null, {
          extend: true
        });
      });

      this.assertException(function() {
        qx.Class.define(null, {
          implement: 23
        });
      });

      this.assertException(function() {
        qx.Class.define(null, {
          include: function() {}
        });
      });

      this.assertException(function() {
        qx.Class.define(null, {
          construct: {}
        });
      });

      this.assertException(function() {
        qx.Class.define(null, {
          statics: []
        });
      });

      this.assertException(function() {
        qx.Class.define(null, {
          properties: 42
        });
      });

      this.assertException(function() {
        qx.Class.define(null, {
          members: function() {}
        });
      });

      this.assertException(function() {
        qx.Class.define(null, {
          classDefined: false
        });
      });
    },

    testDefaultConstructor: function() {
      var construct = this.spy();
      var A = qx.Class.define(null, {
        extend: Object,
        construct: construct
      });

      var B = qx.Class.define(null, {
        extend: A
      });

      new B();
      this.assertCalledOnce(construct);
    },

    testCustomPropertyGetter: function() {
      var self = this;
      var getter = this.spy(function() {
        self.assertEquals(this, a);
      });
      var A = qx.Class.define(null, {
        extend: Object,
        properties: {
          foo: {
            get: getter
          },
          bar: {
            get: "_getBar"
          }
        },
        members: {
          _getBar: getter
        }
      });

      var a = new A();
      a.foo;
      this.assertCalledOnce(getter);
      a.bar;
      this.assertCalledTwice(getter);
    },

    testCustomPropertySetter: function() {
      var self = this;
      var setter = this.spy(function() {
        self.assertEquals(this, a);
      });
      var A = qx.Class.define(null, {
        extend: Object,
        properties: {
          foo: {
            set: setter
          },
          bar: {
            set: "_setBar"
          }
        },
        members: {
          _setBar: setter
        }
      });

      var a = new A();
      a.foo = true;
      this.assertCalledOnce(setter);
      this.assertCalledWith(setter, true);
      a.foo = false;
      this.assertCalledTwice(setter);
      this.assertCalledWith(setter, true);
    },


    testEvents : function() {
      var E1 = qx.Class.define(null, {
        extend : Object,
        events : {
          a: "Number"
        }
      });
      var E2 = qx.Class.define(null, {
        extend : E1,
        events : {
          b: "String"
        }
      });

      this.assertEquals("Number", qx.Class.getEventType(E1, "a"));
      this.assertUndefined(qx.Class.getEventType(E1, "b"));

      this.assertEquals("Number", qx.Class.getEventType(E2, "a"));
      this.assertEquals("String", qx.Class.getEventType(E2, "b"));
    },


    testMixinEvents : function() {
      var M = qx.Mixin.define(null, {
        events : {
          a: "Number"
        }
      });
      var E = qx.Class.define(null, {
        extend : Object,
        include : [M]
      });

      this.assertEquals("Number", qx.Class.getEventType(E, "a"));
    },


    testMixinEventsOverride : function() {
      var M = qx.Mixin.define(null, {
        events : {
          a: "Number"
        }
      });

      qx.Class.define(null, {
        extend : Object,
        include : [M],
        events : {
          a : "Number"
        }
      });

      this.assertException(function() {
        qx.Class.define(null, {
          extend : Object,
          include : [M],
          events : {
            a : "String"
          }
        });
      });
    },

    testGenericSet : function() {
      var C = qx.Class.define(null, {
        extend : Object,
        properties : {
          a : {},
          b : {}
        }
      });

      var c = new C();
      c.set({
        a: "foo",
        b: "bar"
      });

      this.assertEquals("foo", c.a);
      this.assertEquals("bar", c.b);
    },

    testGenericSetExists : function() {
      var meth = function() {};
      var C = qx.Class.define(null, {
        extend : Object,
        properties : {
          a : {},
          b : {}
        },
        members : {
          set : meth
        }
      });

      var c = new C();
      this.assertEquals(meth, c.set);
    }
  }
});
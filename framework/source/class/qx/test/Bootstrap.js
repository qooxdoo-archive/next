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
qx.Class.define("qx.test.Bootstrap",
{
  extend : qx.dev.unit.TestCase,
  include : qx.dev.unit.MMock,

  members :
  {
    testDefineAnonymous : function() {
      var clazz = qx.Bootstrap.define(null, {statics : {
        test : function() {
          return true;
        }
      }});

      this.assertTrue(clazz.test());

      clazz = qx.Bootstrap.define(null, {statics : {
        test2 : function() {
          return true;
        }
      }});

      this.assertTrue(clazz.test2());
    },


    testClassnameProperty : function() {
      qx.Bootstrap.define("qx.test.MyClass", {
        //extend : Object,
        members : {}
      });

      var o = new qx.test.MyClass();
      this.assertEquals("qx.test.MyClass", o.classname);
      this.assertEquals("qx.test.MyClass", o.$$name);

      qx.Bootstrap.undefine("qx.test.MyClass");
    },


    testAlternativeRoot : function() {
      var qq = {};
      var foobar = {};
      var myRoots = { "qq": qq, "foobar": foobar };
      qx.Bootstrap.setRoot(myRoots);

      var qqClass = qx.Bootstrap.define("qq.test.ROOT", {});
      var foobarClass = qx.Bootstrap.define("foobar.test.ROOT", {});
      var vanillebaerClass = qx.Bootstrap.define("vanillebaer.test.ROOT", {});

      this.assertEquals(qqClass, qq.test.ROOT);
      this.assertEquals(foobarClass, foobar.test.ROOT);
      this.assertEquals(vanillebaerClass, window.vanillebaer.test.ROOT);

      qx.Bootstrap.setRoot(undefined);
      qx.Bootstrap.undefine("vanillebaer.test.ROOT");
    },

    "test: merge methods of same class (statics optimization)" : function() {
      qx.Bootstrap.define("qx.test.MyClass", {
        statics : {
          methodA : function() {
            return true;
          }
        }
      });

      qx.Bootstrap.define("qx.test.MyClass", {
        statics : {
          methodB : function() {
            return true;
          }
        }
      });

      this.assertNotUndefined(qx.test.MyClass.methodA);
      this.assertNotUndefined(qx.test.MyClass.methodB);

      qx.Bootstrap.undefine("qx.test.MyClass");
    },

    "test: merge methods of same class (statics optimization) respect defer" : function() {
      qx.Bootstrap.define("qx.test.MyClass", {
        statics : {
          methodA : function() {
            return true;
          },
          methodB : function() {
            return true;
          }
        }
      });

      qx.Bootstrap.define("qx.test.MyClass", {
        statics : {
          methodA : null
        },
        defer : function(statics)
        {
          statics.methodA = function() { return true; };
        }
      });

      this.assertNotNull(qx.test.MyClass.methodA);
      this.assertNotUndefined(qx.test.MyClass.methodB);

      qx.Bootstrap.undefine("qx.test.MyClass");
    },

    "test: define class with contructor" : function()
    {
      var c = qx.Bootstrap.define("qx.test.Construct",
      {
        extend: Object,
        construct : function() {
          this.called = true;
        }
      });

      var obj = new qx.test.Construct();
      this.assertTrue(obj.called);

      this.assertEquals(c, qx.Bootstrap.getByName("qx.test.Construct"));
      this.assertEquals(qx.test.Construct, qx.Bootstrap.getByName("qx.test.Construct"));

      qx.Bootstrap.undefine("qx.test.Construct");
    },


    "test: define bootstrap class, which extends 'Error'" : function()
    {
      qx.Bootstrap.define("qx.test.ExtendError", {
        extend: Error
      });

      var obj = new qx.test.ExtendError();
      this.assertInstance(obj, Error);

      qx.Bootstrap.undefine("qx.test.ExtendError");
    },


    "test: extend from qx.core.Object" : function()
    {
      qx.Bootstrap.define("qx.test.ExtendQxObject", {
        extend: qx.core.Object
      });

      var obj = new qx.test.ExtendQxObject();
      this.assertInstance(obj, qx.core.Object);

      obj.dispose();

      qx.Bootstrap.undefine("qx.test.ExtendQxObject");
    },


    "test: extend from Bootstrap class" : function()
    {
      qx.Bootstrap.define("qx.test.Super", {
        members : {}
      });

      qx.Bootstrap.define("qx.test.ExtendSuper", {
        extend: qx.test.Super,
        members : {}
      });

      var obj = new qx.test.ExtendSuper();

      this.assertInstance(obj, Object);
      this.assertInstance(obj, qx.test.Super);
      this.assertInstance(obj, qx.test.ExtendSuper);

      qx.Bootstrap.undefine("qx.test.Super");
      qx.Bootstrap.undefine("qx.test.ExtendSuper");
    },


    "test: extended Bootstap class should append members to the prototype" : function()
    {
      qx.Bootstrap.define("qx.test.Super", {
        members : {
          foo : 10,
          baz: "juhu"
        }
      });

      qx.Bootstrap.define("qx.test.ExtendSuper", {
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

      qx.Bootstrap.undefine("qx.test.Super");
      qx.Bootstrap.undefine("qx.test.ExtendSuper");
    },

    "test: superclass calls aka basecalls (constructor and methods)" : function()
    {
      qx.Bootstrap.define("qx.test.Car",
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

      qx.Bootstrap.define("qx.test.Bmw",
      {
        extend : qx.test.Car,

        construct : function affe(name, prize) {
          this.base(arguments, name);
        },

        members :
        {
          startEngine : function()
          {
            var ret = this.base(arguments);
            return "brrr " + ret;
          },

          stopEngine : function()
          {
            var ret = arguments.callee.base.call();
            return "brrr " + ret;
          },

          getWheels : function() {
            return qx.test.Bmw.WHEELS;
          },

          getMaxSpeed : function()
          {
            // call base in non overridden method
            this.base(arguments);
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

      qx.Bootstrap.undefine("qx.test.Car");
      qx.Bootstrap.undefine("qx.test.Bmw");
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
      qx.Bootstrap.define("qx.test.Construct",
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

      qx.Bootstrap.undefine("qx.test.Construct");
    },


    testPropertyInit : function() {
      var C = qx.Bootstrap.define(null, {
        properties : {
          a: {
            init: 11
          },
          b: {
            init: 12
          },
          c : {}
        }
      });

      var c = new C();
      this.assertEquals(11, c.a);
      this.assertEquals(12, c.b);
      this.assertException(function() {
        var a = c.c;
      });

      c.a = 0;
      this.assertEquals(0, c.a);
    },


    testPropertyReset : function() {
      var C = qx.Bootstrap.define(null, {
        properties : {
          a: {
            init: 11
          },
          b : {
            nullable : false
          },
          c: {
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

      c.b = 12;
      c.b = undefined;
      this.assertException(function() {
        var a = c.b;
      });

      this.assertEquals("", c.c);
      c.c = "13";
      this.assertEquals("13", c.c);
      c.c = undefined;
      this.assertEquals("", c.c);
    },


    testPropertyNullable : function() {
      var C = qx.Bootstrap.define(null, {
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
      var C = qx.Bootstrap.define(null, {
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
      var C = qx.Bootstrap.define(null, {
        extend : qx.event.Emitter,
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
      this.assertCalledWith(handler, {value: 12, old: 11});
    },


    testPropertyEventCoreObject : function() {
      C = qx.Bootstrap.define("C", {
        extend : qx.core.Object,
        properties : {
          a: {
            event : true,
            init: 11
          }
        }
      });

      var c = new C();

      var handler = this.spy();
      c.addListener("changeA", handler);
      c.a = 12;

      this.assertCalledOnce(handler);
      this.assertEquals(12, handler.args[0][0].getData());
      this.assertEquals(11, handler.args[0][0].getOldData());
    },


    testPropertyEventFail : function() {
      var C = qx.Bootstrap.define(null, {
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
      var C = qx.Bootstrap.define(null, {
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
    },


    testPropertyCheckFunction : function() {
      var checkA = this.spy(function() {return true;});
      var checkB = this.spy(function() {return true;});
      var C = qx.Bootstrap.define(null, {
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
      var C = qx.Bootstrap.define("C", {
        properties : {
          a: {
            init: 11,
            check: "Number",
            event: false,
            apply: function() {}
          }
        }
      });

      var D = qx.Bootstrap.define("D", {
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
        qx.Bootstrap.define(null, {
          extend: C,
          properties: {
            a: {
              check: "String"
            }
          }
        });
      });

      this.assertException(function() {
        qx.Bootstrap.define(null, {
          extend: C,
          properties: {
            a: {
              event: true
            }
          }
        });
      });

      this.assertException(function() {
        qx.Bootstrap.define(null, {
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
      var A = qx.Bootstrap.define(null, {
        members: {
          foo: function() {}
        }
      });

      this.assertException(function() {
        var B = qx.Bootstrap.define(null, {
          extend: A,
          properties: {
            foo: {}
          }
        });
      });
    },


    testPropertyInheritance : function() {
      var apply = this.spy();
      var C = qx.Bootstrap.define(null, {
        properties : {
          a: {
            nullable: true,
            check: "String",
            apply: apply
          }
        }
      });

      var D = qx.Bootstrap.define(null, {
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


    testDefer : function() {
      var defer = this.spy();
      var C = qx.Bootstrap.define(null, {
        extend: Object,
        defer: defer
      });

      new C();
      this.assertCalledOnce(defer);
    },

    testValidateConfig : function() {
      this.assertException(function() {
        qx.Bootstrap.define(null, {
          extend: Object,
          foo: {}
        });
      });

      this.assertException(function() {
        qx.Bootstrap.define(null, {
          extend: true
        });
      });

      this.assertException(function() {
        qx.Bootstrap.define(null, {
          implement: 23
        });
      });

      this.assertException(function() {
        qx.Bootstrap.define(null, {
          include: function() {}
        });
      });

      this.assertException(function() {
        qx.Bootstrap.define(null, {
          construct: {}
        });
      });

      this.assertException(function() {
        qx.Bootstrap.define(null, {
          statics: []
        });
      });

      this.assertException(function() {
        qx.Bootstrap.define(null, {
          properties: 42
        });
      });

      this.assertException(function() {
        qx.Bootstrap.define(null, {
          members: function() {}
        });
      });

      this.assertException(function() {
        qx.Bootstrap.define(null, {
          defer: false
        });
      });
    },

    testDefaultConstructor: function() {
      var construct = this.spy();
      var A = qx.Bootstrap.define(null, {
        extend: Object,
        construct: construct
      });

      var B = qx.Bootstrap.define(null, {
        extend: A
      });

      new B();
      this.assertCalledOnce(construct);
    }
  }
});
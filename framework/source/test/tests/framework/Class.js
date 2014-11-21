"use strict";
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
describe("Class", function() {

  var sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("DefineAnonymous", function() {
    var clazz = qx.Class.define(null, {
      statics: {

        test: function() {
          return true;
        }
      }
    });

    assert.isTrue(clazz.test());

    clazz = qx.Class.define(null, {
      statics: {

        test2: function() {
          return true;
        }
      }
    });

    assert.isTrue(clazz.test2());
  });


  it("ClassnameProperty", function() {
    qx.Class.define("qx.test.MyClass", {
      //extend : Object,
      members: {}
    });

    var o = new qx.test.MyClass();
    assert.equal("qx.test.MyClass", o.classname);
    assert.equal("qx.test.MyClass", o.$$name);

    delete qx.test.MyClass;
  });


  it("AlternativeRoot", function() {
    var qq = {};
    var foobar = {};
    var myRoots = {
      "qq": qq,
      "foobar": foobar
    };
    qx.Class.setRoot(myRoots);

    var qqClass = qx.Class.define("qq.test.ROOT", {});
    var foobarClass = qx.Class.define("foobar.test.ROOT", {});
    var vanillebaerClass = qx.Class.define("vanillebaer.test.ROOT", {});

    assert.equal(qqClass, qq.test.ROOT);
    assert.equal(foobarClass, foobar.test.ROOT);
    assert.equal(vanillebaerClass, window.vanillebaer.test.ROOT);

    qx.Class.setRoot(undefined);
    delete vanillebaer.test.ROOT;
  });



  it("merge methods of same class (statics optimization)", function() {
    qx.Class.define("qx.test.MyClass", {
      statics: {
        methodA: function() {
          return true;
        }
      }
    });

    qx.Class.define("qx.test.MyClass", {
      statics: {
        methodB: function() {
          return true;
        }
      }
    });

    assert.isDefined(qx.test.MyClass.methodA);
    assert.isDefined(qx.test.MyClass.methodB);

    delete qx.test.MyClass;
  });



  it("merge methods of same class (statics optimization) respect defer", function() {
    qx.Class.define("qx.test.MyClass", {
      statics: {
        methodA: function() {
          return true;
        },
        methodB: function() {
          return true;
        }
      }
    });

    qx.Class.define("qx.test.MyClass", {
      statics: {
        methodA: null
      },
      classDefined: function(statics) {
        statics.methodA = function() {
          return true;
        };
      }
    });

    assert.isNotNull(qx.test.MyClass.methodA);
    assert.isDefined(qx.test.MyClass.methodB);

    delete qx.test.MyClass;
  });



  it("define class with contructor", function() {
    var c = qx.Class.define("qx.test.Construct", {
      extend: Object,
      construct: function() {
        this.called = true;
      }
    });

    var obj = new qx.test.Construct();
    assert.isTrue(obj.called);

    assert.equal(c, qx.Class.getByName("qx.test.Construct"));
    assert.equal(qx.test.Construct, qx.Class.getByName("qx.test.Construct"));

    delete qx.test.Construct;
  });




  it("define bootstrap class, which extends 'Error'", function() {
    qx.Class.define("qx.test.ExtendError", {
      extend: Error
    });

    var obj = new qx.test.ExtendError();
    assert.instanceOf(obj, Error);

    delete qx.test.ExtendError;
  });




  it("extend from Bootstrap class", function() {
    qx.Class.define("qx.test.Super", {
      members: {}
    });

    qx.Class.define("qx.test.ExtendSuper", {
      extend: qx.test.Super,
      members: {}
    });

    var obj = new qx.test.ExtendSuper();

    assert.instanceOf(obj, Object);
    assert.instanceOf(obj, qx.test.Super);
    assert.instanceOf(obj, qx.test.ExtendSuper);

    delete qx.test.Super;
    delete qx.test.ExtendSuper;
  });




  it("extended Bootstap class should append members to the prototype", function() {
    qx.Class.define("qx.test.Super", {
      members: {
        foo: 10,
        baz: "juhu"
      }
    });

    qx.Class.define("qx.test.ExtendSuper", {
      extend: qx.test.Super,
      members: {
        bar: "affe",
        foo: 11
      }
    });

    var obj = new qx.test.ExtendSuper();
    assert.equal("affe", obj.bar);
    assert.equal(11, obj.foo);
    assert.equal("juhu", obj.baz);

    assert.equal(11, qx.test.ExtendSuper.prototype.foo);
    assert.equal(10, qx.test.Super.prototype.foo);

    delete qx.test.Super;
    delete qx.test.ExtendSuper;
  });



  it("superclass calls aka basecalls (constructor and methods)", function() {
    qx.Class.define("qx.test.Car", {
      construct: function(name) {
        this._name = name;
      },

      members: {
        startEngine: function() {
          return "start";
        },

        stopEngine: function() {
          return "stop";
        },

        getName: function() {
          return this._name;
        }
      }
    });

    var car = new qx.test.Car("Audi");
    assert.equal("start", car.startEngine());
    assert.equal("stop", car.stopEngine());
    assert.equal("Audi", car.getName());

    qx.Class.define("qx.test.Bmw", {
      extend: qx.test.Car,

      construct: function affe(name, prize) {
        this.super(qx.test.Car, "constructor", name);
      },

      members: {
        startEngine: function() {
          var ret = this.super(qx.test.Car, "startEngine");
          return "brrr " + ret;
        },

        stopEngine: function() {
          var ret = this.super(qx.test.Car, "stopEngine");
          return "brrr " + ret;
        },

        getWheels: function() {
          return qx.test.Bmw.WHEELS;
        },

        getMaxSpeed: function() {
          // call super in non overridden method
          this.super(qx.test.Car, "getMaxSpeed");
        }
      },

      statics: {
        WHEELS: 4
      }
    });

    var bmw = new qx.test.Bmw("bmw", 44000);
    assert.equal("bmw", bmw.getName());
    assert.equal("brrr start", bmw.startEngine());
    assert.equal("brrr stop", bmw.stopEngine());
    assert.equal(4, bmw.getWheels());

    if (qx.core.Environment.get("qx.debug")) {
      assert.throw(function() {
        bmw.getMaxSpeed();
      }, Error);
    }

    delete qx.test.Car;
    delete qx.test.Bmw;
  });


  it("Try to rename construct to constructor at super call", function() {
    var constructSpyMethod = sandbox.spy();

    qx.Class.define("qx.test.Super", {
      construct: function () {
        constructSpyMethod();
      },
      members: {
      }
    });

    qx.Class.define("qx.test.ExtendSuper", {
      extend: qx.test.Super,
      construct: function () {
        this.super(qx.test.Super, "construct");
      }
    });

    new qx.test.ExtendSuper();

    sinon.assert.calledOnce(constructSpyMethod);

    delete qx.test.Super;
    delete qx.test.ExtendSuper;
  });


  it("Try to rename construct to constructor at super call when construct already defined as a member", function() {
    var constructSpyMethod = sandbox.spy();
    var memberConstructSpyMethod = sandbox.spy();

    qx.Class.define("qx.test.Super", {
      construct: function () {
        constructSpyMethod();
      },
      members: {
        construct: memberConstructSpyMethod
      }
    });

    qx.Class.define("qx.test.ExtendSuper", {
      extend: qx.test.Super,
      construct: function () {
        this.super(qx.test.Super, "construct");
      }
    });

    new qx.test.ExtendSuper();

    sinon.assert.notCalled(constructSpyMethod);
    sinon.assert.calledOnce(memberConstructSpyMethod);

    delete qx.test.Super;
    delete qx.test.ExtendSuper;
  });


  it("Try to rename construct to constructor at super call when construct already defined as a property", function() {
    var constructSpyMethod = sinon.spy();
    var propertyConstructSpyMethod = sinon.spy();

    qx.Class.define("qx.test.Super", {
      construct: function () {
        constructSpyMethod();
      },
      properties: {
        construct: {
          init: propertyConstructSpyMethod
        }
      }
    });

    qx.Class.define("qx.test.ExtendSuper", {
      extend: qx.test.Super,
      construct: function () {
        this.super(qx.test.Super, "construct");
      }
    });

    new qx.test.ExtendSuper();

    sinon.assert.notCalled(constructSpyMethod);
    sinon.assert.calledOnce(propertyConstructSpyMethod);

    delete qx.test.Super;
    delete qx.test.ExtendSuper;
  });


  it("FunctionWrap", function() {
    var context = null;
    var result = 0;

    var add = function(a, b) {
      context = this;
      return a + b;
    };

    context = null;
    result = add(1, 2);

    assert.equal(context, undefined);
    assert.equal(3, result);

    context = null;
    var boundAdd = add.bind(this);
    result = boundAdd(1, 3);
    assert.equal(context, this);
    assert.equal(4, result);

    context = null;
    var addOne = add.bind(this, 1);
    result = addOne(4);
    assert.equal(context, this);
    assert.equal(5, result);
  });


  it("DefineShadowedStatics", function() {
    qx.Class.define("qx.test.Construct", {
      extend: Object,
      statics: {
        "isPrototypeOf": 10,
        "toLocaleString": 12,
        "toString": 13,
        "valueOf": 14
      }
    });

    assert.equal(10, qx.test.Construct.isPrototypeOf);
    assert.equal(12, qx.test.Construct.toLocaleString);
    assert.equal(13, qx.test.Construct.toString);
    assert.equal(14, qx.test.Construct.valueOf);

    delete qx.test.Construct;
  });


  it("PropertyInit", function() {
    var C = qx.Class.define(null, {
      properties: {
        a: {
          init: 11
        },
        b: {
          init: 12
        }
      }
    });

    var c = new C();
    assert.equal(11, c.a);
    assert.equal(12, c.b);

    c.a = 0;
    assert.equal(0, c.a);
  });


  it("PropertyReset", function() {
    var C = qx.Class.define(null, {
      properties: {
        a: {
          init: 11
        },
        b: {
          check: "String",
          init: ""
        }
      }
    });

    var c = new C();
    assert.equal(11, c.a);
    c.a = "A";
    assert.equal("A", c.a);
    c.a = undefined;
    assert.equal(11, c.a);

    assert.equal("", c.b);
    c.b = "13";
    assert.equal("13", c.b);
    c.b = undefined;
    assert.equal("", c.b);
  });


  it("PropertyNullable", function() {
    var C = qx.Class.define(null, {
      properties: {
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

    assert.isUndefined(c.a);
    c.a = null;
    assert.isNull(c.a);
    c.a = undefined;
    assert.isUndefined(c.a);

    assert.throw(function() {
      c.b = null;
    });

    assert.throw(function() {
      c.c = null;
    });
  });


  it("PropertyNullable", function() {
    var C = qx.Class.define(null, {
      properties: {
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

    assert.isUndefined(c.a);
    c.a = null;
    assert.isNull(c.a);
    c.a = undefined;
    assert.isUndefined(c.a);

    assert.throw(function() {
      c.b = null;
    });

    assert.throw(function() {
      c.c = null;
    });
  });


  it("PropertyNotWritable", function() {
    var C = qx.Class.define(null, {
      properties: {
        a: {},
        b: {writable: true},
        c: {writable: false, init: 13}
      }
    });

    var c = new C();

    c.a = 11;
    assert.equal(11, c.a);

    c.b = 12;
    assert.equal(12, c.b);

    assert.equal(13, c.c);
    assert.throws(function() {
      c.c = 12323;
    });
    assert.equal(13, c.c);
  });


  it("PropertyNotWritableOverride", function() {
    var C = qx.Class.define(null, {
      properties: {
        a: {}
      }
    });

    var D = qx.Class.define(null, {
      extend : C,
      properties: {
        a: {init: 11, writable: false}
      }
    });

    var d = new D();

    assert.equal(11, d.a);
    assert.throws(function() {
      d.a = 123211;
    });
    assert.equal(11, d.a);
  });


  it("PropertyEventEmitter", function() {
    var C = qx.Class.define(null, {
      extend: Object,
      include: [qx.event.MEmitter],
      properties: {
        a: {
          event: true,
          init: 11
        }
      }
    });

    var c = new C();

    var handler = sinon.spy();
    c.on("changeA", handler);
    c.a = 12;

    sinon.assert.calledOnce(handler);
    sinon.assert.calledWith(handler, {
      value: 12,
      old: 11,
      target: c
    });
  });


  it("PropertyEventFail", function() {
    var C = qx.Class.define(null, {
      properties: {
        a: {
          event: true,
          init: 11
        }
      }
    });

    var c = new C();
    assert.throw(function() {
      c.a = 1213123;
    });
  });


  it("PropertyChecks", function() {
    var O = qx.Class.define(null, {
      implement: [qx.application.IApplication],
      members: {
        main : function() {},
        close : function() {},
        terminate : function() {}
      }
    });

    var C = qx.Class.define(null, {
      properties: {
        s: {
          check: "String"
        },
        b: {
          check: "Boolean"
        },
        n: {
          check: "Number"
        },
        o: {
          check: "Object"
        },
        a: {
          check: "Array"
        },
        f: {
          check: "Function"
        },
        d: {
          check: "Date"
        },
        e: {
          check: "Error"
        },
        r: {
          check: "RegExp"
        },
        q: {
          check: "qx.dev.unit.TestClass"
        },
        i: {
          check: "qx.application.IApplication"
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

    assert.throw(function() {
      c.s = true;
    });
    assert.throw(function() {
      c.b = "string";
    });
    assert.throw(function() {
      c.n = {};
    });
    assert.throw(function() {
      c.o = 213;
    });
    assert.throw(function() {
      c.a = {};
    });
    assert.throw(function() {
      c.f = true;
    });
    assert.throw(function() {
      c.d = {};
    });
    assert.throw(function() {
      c.e = {};
    });
    assert.throw(function() {
      c.r = 83924;
    });
    assert.throw(function() {
      c.i = c;
    });
  });


  it("PropertyCheckFunction", function() {
    var checkA = sinon.spy(function() {
      return true;
    });
    var checkB = sinon.spy(function() {
      return true;
    });
    var C = qx.Class.define(null, {
      properties: {
        a: {
          check: checkA
        },
        b: {
          check: "_checkB"
        }
      },
      members: {
        _checkB: checkB
      }
    });

    var c = new C();
    c.a = "a";
    c.b = "b";

    sinon.assert.calledOnce(checkA);
    sinon.assert.calledWith(checkA, "a");
    sinon.assert.calledOnce(checkB);
    sinon.assert.calledWith(checkB, "b");
  });


  it("PropertyRefine", function() {
    var C = qx.Class.define("C", {
      properties: {
        a: {
          init: 11,
          check: "Number",
          event: false,
          apply: function() {}
        }
      }
    });

    var D = qx.Class.define("D", {
      extend: C,
      properties: {
        a: {
          init: 12
        }
      }
    });

    var c = new C();
    assert.equal(11, c.a);
    var d = new D();
    assert.equal(12, d.a);

    assert.throw(function() {
      qx.Class.define(null, {
        extend: C,
        properties: {
          a: {
            check: "String"
          }
        }
      });
    });

    assert.throw(function() {
      qx.Class.define(null, {
        extend: C,
        properties: {
          a: {
            event: true
          }
        }
      });
    });

    assert.throw(function() {
      qx.Class.define(null, {
        extend: C,
        properties: {
          a: {
            apply: function() {}
          }
        }
      });
    });
  });


  it("PropertyOverrideMethod", function() {
    var A = qx.Class.define(null, {
      members: {
        foo: function() {}
      }
    });

    assert.throw(function() {
      var B = qx.Class.define(null, {
        extend: A,
        properties: {
          foo: {}
        }
      });
    });
  });


  it("PropertyInheritance", function() {
    var apply = sinon.spy();
    var C = qx.Class.define(null, {
      properties: {
        a: {
          nullable: true,
          check: "String",
          apply: apply
        }
      }
    });

    var D = qx.Class.define(null, {
      extend: C,
      properties: {
        a: {
          init: "foo"
        }
      }
    });

    var d = new D();
    d.a = null;
    sinon.assert.calledOnce(apply);
    assert.throw(function() {
      d.a = 23;
    });
  });


  it("ClassDefined", function() {
    var classDefined = sinon.spy();
    var C = qx.Class.define(null, {
      extend: Object,
      classDefined: classDefined
    });

    new C();
    sinon.assert.calledOnce(classDefined);
  });


  it("ValidateConfig", function() {
    assert.throw(function() {
      qx.Class.define(null, {
        extend: Object,
        foo: {}
      });
    });

    assert.throw(function() {
      qx.Class.define(null, {
        extend: true
      });
    });

    assert.throw(function() {
      qx.Class.define(null, {
        implement: 23
      });
    });

    assert.throw(function() {
      qx.Class.define(null, {
        include: function() {}
      });
    });

    assert.throw(function() {
      qx.Class.define(null, {
        construct: {}
      });
    });

    assert.throw(function() {
      qx.Class.define(null, {
        statics: []
      });
    });

    assert.throw(function() {
      qx.Class.define(null, {
        properties: 42
      });
    });

    assert.throw(function() {
      qx.Class.define(null, {
        members: function() {}
      });
    });

    assert.throw(function() {
      qx.Class.define(null, {
        classDefined: false
      });
    });
  });


  it("DefaultConstructor", function() {
    var construct = sinon.spy();
    var A = qx.Class.define(null, {
      extend: Object,
      construct: construct
    });

    var B = qx.Class.define(null, {
      extend: A
    });

    new B();
    sinon.assert.calledOnce(construct);
  });


  it("CustomPropertyGetter", function() {
    var self = this;
    var getter = sinon.spy(function() {
      assert.equal(this, a);
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
    sinon.assert.calledOnce(getter);
    a.bar;
    sinon.assert.calledTwice(getter);
  });


  it("CustomPropertySetter", function() {
    var self = this;
    var setter = sinon.spy(function() {
      assert.equal(this, a);
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
    sinon.assert.calledOnce(setter);
    sinon.assert.calledWith(setter, true);
    a.foo = false;
    sinon.assert.calledTwice(setter);
    sinon.assert.calledWith(setter, true);
  });


  it("Custom Property Setter Override", function() {
    var setterA = sinon.spy(function(){console.log("a");});
    var setterB = sinon.spy(function() {console.log("b");});

    var A = qx.Class.define(null, {
      extend: Object,
      properties: {
        a: {
          set: "_setA"
        }
      },
      members: {
        _setA: setterA
      }
    });

    var B = qx.Class.define(null, {
      extend : A,
      members : {
        _setA: setterB
      }
    });

    var b = new B();
    b.a = 123;
    sinon.assert.notCalled(setterA);
    sinon.assert.calledOnce(setterB);
  });


  it("Events", function() {
    var E1 = qx.Class.define(null, {
      extend: Object,
      events: {
        a: "Number"
      }
    });
    var E2 = qx.Class.define(null, {
      extend: E1,
      events: {
        b: "String"
      }
    });

    assert.equal("Number", qx.Class.getEventType(E1, "a"));
    assert.isUndefined(qx.Class.getEventType(E1, "b"));

    assert.equal("Number", qx.Class.getEventType(E2, "a"));
    assert.equal("String", qx.Class.getEventType(E2, "b"));
  });


  it("MixinEvents", function() {
    var M = qx.Mixin.define(null, {
      events: {
        a: "Number"
      }
    });
    var E = qx.Class.define(null, {
      extend: Object,
      include: [M]
    });

    assert.equal("Number", qx.Class.getEventType(E, "a"));
  });


  it("MixinEventsOverride", function() {
    var M = qx.Mixin.define(null, {
      events: {
        a: "Number"
      }
    });

    qx.Class.define(null, {
      extend: Object,
      include: [M],
      events: {
        a: "Number"
      }
    });

    assert.throw(function() {
      qx.Class.define(null, {
        extend: Object,
        include: [M],
        events: {
          a: "String"
        }
      });
    });
  });


  it("GenericSet", function() {
    var C = qx.Class.define(null, {
      extend: Object,
      properties: {
        a: {},
        b: {}
      }
    });

    var c = new C();
    c.set({
      a: "foo",
      b: "bar"
    });

    assert.equal("foo", c.a);
    assert.equal("bar", c.b);
  });


  it("GenericSetExists", function() {
    var meth = function() {};
    var C = qx.Class.define(null, {
      extend: Object,
      properties: {
        a: {},
        b: {}
      },
      members: {
        set: meth
      }
    });

    var c = new C();
    assert.equal(meth, c.set);

  });
});

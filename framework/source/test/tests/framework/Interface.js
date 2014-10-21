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

************************************************************************ */

/**
 * @ignore(qx.test.i.*)
 */
describe("Interface", function() {

  beforeEach(function() {
    qx.Interface.define("qx.test.i.ICar", {
      members: {
        startEngine: function() {
          return true;
        }
      },

      properties: {
        color: {}
      }
    });
  });


  afterEach(function() {
    delete qx.test.i.ICar;
  });


  it("ClassImplements", function() {
    // test correct implementations
    qx.Class.define("qx.test.i.Audi", {
      extend: Object,
      construct: function() {},
      implement: [qx.test.i.ICar],

      members: {
        startEngine: function() {
          return "start";
        }
      },

      statics: {
        honk: function() {
          return "honk";
        }
      },

      properties: {
        color: {}
      }
    });

    var audi = new qx.test.i.Audi("audi");

    assert.isTrue(qx.Interface.classImplements(qx.test.i.Audi, qx.test.i.ICar));
    delete qx.test.i.Audi;
  });


  it("EverythingImplemented", function() {
    qx.Class.define("qx.test.i.Bmw1", {
      extend: Object,
      construct: function() {},

      members: {
        startEngine: function() {
          return "start";
        }
      },

      statics: {
        honk: function() {
          return "honk";
        }
      },

      properties: {
        color: {}
      }
    });
    assert.isTrue(qx.Interface.classImplements(qx.test.i.Bmw1, qx.test.i.ICar));
    delete qx.test.i.Bmw1;
  });


  it("MissingMembers", function() {
    qx.Class.define("qx.test.i.Bmw2", {
      extend: Object,
      construct: function() {},
      statics: {
        honk: function() {
          return "honk";
        }
      },

      properties: {
        color: {}
      }
    });
    assert.isFalse(qx.Interface.classImplements(qx.test.i.Bmw2, qx.test.i.ICar));
    delete qx.test.i.Bmw2;
  });


  it("MissingStatics", function() {
    // (ie it does implement all necessary)
    qx.Class.define("qx.test.i.Bmw3", {
      extend: Object,
      construct: function() {},
      members: {
        startEngine: function() {
          return "start";
        }
      },

      properties: {
        color: {}
      }
    });
    assert.isTrue(qx.Interface.classImplements(qx.test.i.Bmw3, qx.test.i.ICar));
    delete qx.test.i.Bmw;
  });


  it("MissingProperties", function() {
    qx.Class.define("qx.test.i.Bmw4", {
      extend: Object,
      construct: function() {},
      members: {
        startEngine: function() {
          return "start";
        }
      },

      statics: {
        honk: function() {
          return "honk";
        }
      }
    });
    assert.isFalse(qx.Interface.classImplements(qx.test.i.Bmw4, qx.test.i.ICar));
    delete qx.test.i.Bmw4;
  });


  it("WithDebug", function() {

    if (qx.core.Environment.get("qx.debug")) {
      assert.throw(function() {
        var i = new qx.test.i.ICar();
      }, Error);


      // nothing defined
      assert.throw(function() {
          qx.Class.define("qx.test.i.Audi1", {
            extend: Object,
            construct: function() {},
            implement: [qx.test.i.ICar]
          });
        },
        Error, "does not implement the interface");

      // members not defined
      assert.throw(function() {
          qx.Class.define("qx.test.i.Audi2", {
            extend: Object,
            construct: function() {},
            implement: [qx.test.i.ICar],

            statics: {
              honk: function() {
                return "honk";
              }
            },

            properties: {
              color: {}
            }
          });
        },
        Error, "does not implement the interface");

      // property not defined
      assert.throw(function() {
          qx.Class.define("qx.test.i.Audi4", {
            extend: Object,
            construct: function() {},
            implement: [qx.test.i.ICar],

            members: {
              startEngine: function() {
                return "start";
              }
            },

            statics: {
              honk: function() {
                return "honk";
              }
            }
          });
        },
        Error, "does not implement the interface");
    }
  });


  it("Properties", function() {
    qx.Interface.define("qx.test.i.IProperties1", {
      properties: {
        value: {}
      }
    });

    qx.Class.define("qx.test.i.Properties1", {
      extend: Object,
      implement: [qx.test.i.IProperties1],

      properties: {
        value: {
          check: "Integer"
        }
      }
    });

    if (qx.core.Environment.get("qx.debug")) {
      assert.throw(function() {
        qx.Class.define("qx.test.i.Properties2", {
          extend: Object,
          implement: [qx.test.i.IProperties1],

          members: {
            getValue: function() {},
            setValue: function(value) {}
          }
        });
      });
    }

    qx.Interface.define("qx.test.i.IProperties2", {
      members: {
        getValue: function() {},
        setValue: function(value) {}
      }
    });

    qx.Class.define("qx.test.i.Properties3", {
      extend: Object,
      implement: [qx.test.i.IProperties2],

      members: {
        getValue: function() {},
        setValue: function(value) {}
      }
    });
  });


  it("ImplementMembers", function() {
    qx.Interface.define("IFoo", {
      members: {
        foo: function() {},
        bar: function() {}
      }
    });

    assert.throw(function() {
      qx.Class.define(null, {
        implement: [IFoo],
        members: {
          bar: function() {}
        }
      });
    });

    qx.Class.define(null, {
      implement: [IFoo],
      members: {
        bar: function() {},
        foo: function() {}
      }
    });
  });


  it("ImplementInheritedMembers", function() {
    qx.Interface.define("IFoo", {
      members: {
        foo: function() {},
        bar: function() {}
      }
    });

    var P = qx.Class.define(null, {
      members: {
        foo: function() {}
      }
    });

    qx.Class.define(null, {
      extend: P,
      implement: [IFoo],
      members: {
        bar: function() {}
      }
    });
  });


  it("ImplementProperties", function() {
    qx.Interface.define("IFoo", {
      properties: {
        bar: {
          init: 23
        }
      }
    });

    assert.throw(function() {
      qx.Class.define(null, {
        implement: [IFoo],
        properties: {
          foo: {}
        }
      });
    });

    qx.Class.define(null, {
      implement: [IFoo],
      properties: {
        bar: {
          init: 23
        }
      }
    });
  });


  it("ImplementInheritedProperties", function() {
    qx.Interface.define("IFoo", {
      properties: {
        foo: {},
        bar: {}
      }
    });

    var P = qx.Class.define(null, {
      properties: {
        foo: {}
      }
    });

    qx.Class.define(null, {
      extend: P,
      implement: [IFoo],
      properties: {
        bar: {}
      }
    });
  });


  it("InterfaceInheritance", function() {
    qx.Interface.define("IFoo", {
      members: {
        foo: function() {}
      },
      properties: {
        baz: {}
      }
    });

    qx.Interface.define("IBar", {
      extend: IFoo,
      members: {
        bar: function() {}
      },
      properties: {
        qux: {}
      }
    });

    assert.throw(function() {
      var C = qx.Class.define(null, {
        implement: [IBar],
        members: {
          bar: function() {}
        },
        properties: {
          qux: {}
        }
      });
    });

    var C = qx.Class.define(null, {
      implement: [IBar],
      members: {
        foo: function() {},
        bar: function() {}
      },
      properties: {
        baz: {},
        qux: {}
      }
    });
  });


  it("Includes", function() {
    qx.Interface.define("qx.test.i.IMember", {
      members: {
        sayJuhu: function() {}
      }
    });

    qx.Interface.define("qx.test.i.IProperties", {
      properties: {
        "color": {},
        "name": {}
      }
    });

    qx.Interface.define("qx.test.i.IAll", {
      extend: [qx.test.i.IMember, qx.test.i.IProperties]
    });

    qx.Interface.define("qx.test.i.IOther", {
      members: {
        bar: function() {
          return true;
        }
      }
    });

    var classDef = {
      extend: Object,
      implement: qx.test.i.IAll,

      members: {
        sayJuhu: function() {}
      },

      statics: {
        sayHello: function() {}
      },

      properties: {
        "color": {},
        "name": {}
      }
    };

    // all implemented
    var def = qx.lang.Object.clone(classDef);
    qx.Class.define("qx.test.i.Implement1", def);

    assert.isTrue(qx.Interface.classImplements(qx.test.i.Implement1, qx.test.i.IAll), "implements IAll");
    assert.isTrue(qx.Interface.classImplements(qx.test.i.Implement1, qx.test.i.IMember), "implements IMember");
    assert.isTrue(qx.Interface.classImplements(qx.test.i.Implement1, qx.test.i.IProperties), "implements IProperties");

    assert.isFalse(qx.Interface.classImplements(qx.test.i.Implement1, qx.test.i.IOther), "not implements IOther");

    // no members
    def = qx.lang.Object.clone(classDef);
    delete(def.members);

    if (qx.core.Environment.get("qx.debug")) {
      assert.throw(function() {
        qx.Class.define("qx.test.i.Implement2", def);
      }, Error, "does not implement", "No members defined.");
    }

    // no properties
    def = qx.lang.Object.clone(classDef);
    delete(def.properties);

    if (qx.core.Environment.get("qx.debug")) {
      assert.throw(function() {
        qx.Class.define("qx.test.i.Implement4", def);
      }, Error, new RegExp("does not implement"), "No properties defined.");
    }
  });
});

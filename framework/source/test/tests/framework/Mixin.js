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
 * @ignore(qx.Mix, qx.MLogger, qx.MMix1, qx.MMix1.foo)
 * @ignore(qx.MMix2)
 */
describe("Mixin", function() {

  it("MixinBasic", function() {
    qx.Mixin.define("qx.MMix1", {
      statics: {
        data: null,

        foo: function() {
          return "foo";
        }
      },

      members: {
        bar: function() {
          return "bar";
        }
      },

      properties: {
        color: {
          init: "red"
        }
      }
    });

    qx.Mixin.define("qx.MMix2", {
      members: {
        bar: function() {
          return "bar";
        }
      }
    });

    qx.Class.define("qx.Mix", {
      extend: Object,
      include: qx.MMix1,
      construct: function() {}
    });

    assert.equal("foo", qx.MMix1.foo());
    assert.equal("bar", new qx.Mix().bar());
    var mix = new qx.Mix();
    assert.equal("red", mix.color);

    if (qx.core.Environment.get("qx.debug")) {
      assert.throw(function() {
          qx.Class.define("qx.Mix1", {
            extend: Object,
            include: [qx.MMix1, qx.MMix2],
            construct: function() {}
          });
        },
        Error, "Overwriting member", "t1");

      assert.throw(function() {
          qx.Class.define("qx.Mix2", {
            extend: Object,
            include: qx.MMix1,
            construct: function() {},

            members: {
              bar: function() {
                return "bar";
              }
            }
          });
        },
        Error, "Overwriting member", "t2");
    }

    // this is allowed
    qx.Class.define("qx.Mix3", {
      extend: Object,
      include: qx.MMix1,
      construct: function() {},

      statics: {
        foo: function() {
          return "foo";
        }
      }
    });

    if (qx.core.Environment.get("qx.debug")) {
      assert.throw(function() {
        qx.Class.define("qx.Mix4", {
          extend: Object,
          include: qx.MMix1,
          construct: function() {},
          properties: {
            color: {}
          }
        });
      },
      Error, undefined, "t3");
    }
  });


  it("Mixin", function() {
    qx.Mixin.define("MFoo", {
      members: {
        foo: function() {}
      }
    });

    var C = qx.Class.define(null, {
      extend: Object,
      include: [MFoo]
    });

    var c = new C();
    c.foo();
  });


  it("MixinInterface", function() {
    qx.Interface.define("IFoo", {
      members: {
        foo: function() {},
        bar: function() {}
      },
      properties: {
        baz: {},
        qux: {}
      }
    });

    qx.Mixin.define("MFoo", {
      members: {
        foo: function() {}
      },
      properties: {
        baz: {}
      }
    });

    var C = qx.Class.define(null, {
      members: {
        bar: function() {}
      },
      properties: {
        qux: {}
      }
    });

  });
});

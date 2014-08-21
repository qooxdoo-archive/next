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
qx.Bootstrap.define("qx.test.Mixin",
{
  extend : qx.dev.unit.TestCase,

  members :
  {
    testMixinBasic : function()
    {
      qx.Mixin.define("qx.MMix1",
      {
        statics :
        {
          data : null,

          foo : function() {
            return "foo";
          }
        },

        members :
        {
          bar : function() {
            return "bar";
          }
        },

        properties : { color : {
          init: "red"
        } }
      });

      qx.Mixin.define("qx.MMix2",
      {
        members :
        {
          bar : function() {
            return "bar";
          }
        }
      });

      qx.Bootstrap.define("qx.Mix",
      {
        extend    : Object,
        include   : qx.MMix1,
        construct : function() {}
      });

      this.assertEquals("foo", qx.MMix1.foo());
      this.assertEquals("bar", new qx.Mix().bar());
      var mix = new qx.Mix();
      this.assertEquals("red", mix.color);

      if (this.isDebugOn())
      {
        this.assertException(function()
        {
          qx.Bootstrap.define("qx.Mix1",
          {
            extend    : Object,
            include   : [ qx.MMix1, qx.MMix2 ],
            construct : function() {}
          });
        },
        Error, "Overwriting member", "t1");

        this.assertException(function()
        {
          qx.Bootstrap.define("qx.Mix2",
          {
            extend : Object,
            include : qx.MMix1,
            construct : function() {},

            members :
            {
              bar : function() {
                return "bar";
              }
            }
          });
        },
        Error, "Overwriting member", "t2");
      }

      // this is allowed
      qx.Bootstrap.define("qx.Mix3",
      {
        extend : Object,
        include : qx.MMix1,
        construct : function() {},

        statics :
        {
          foo : function() {
            return "foo";
          }
        }
      });

      if (this.isDebugOn())
      {
        this.assertException(function()
        {
          qx.Bootstrap.define("qx.Mix4",
          {
            extend     : Object,
            include    : qx.MMix1,
            construct  : function() {},
            properties : { color : { } }
          });
        },
        Error, "Cannot redefine property", "t3");
      }
    },


    testMixin : function() {
      qx.Mixin.define("MFoo", {
        members: {
          foo: function() {}
        }
      });

      var C = qx.Bootstrap.define(null, {
        extend: Object,
        include: [MFoo]
      });

      var c = new C();
      c.foo();
    },


    testMixinInterface : function() {
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

      var C = qx.Bootstrap.define(null, {
        members: {
          bar: function() {}
        },
        properties: {
          qux: {}
        }
      });
    }
  }
});

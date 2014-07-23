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
 * @ignore(qx.ExtendUseLog1, qx.Mix, qx.MLogger, qx.MMix1, qx.MMix1.foo)
 * @ignore(qx.MMix2, qx.MPatch, qx.Patch1, qx.Patch2, qx.UseLog1, qx.UseLog2)
 * @ignore(qx.UseLog3)
 */


qx.Class.define("qx.test.Mixin",
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


    testInclude : function()
    {
      qx.Mixin.define("qx.MLogger",
      {
        members :
        {
          log : function(msg) {
            return msg;
          }
        }
      });

      // normal usage
      qx.Bootstrap.define("qx.UseLog1",
      {
        extend    : Object,
        construct : function() {}
      });

      qx.Mixin.include(qx.UseLog1, qx.MLogger);
      this.assertEquals("Juhu", new qx.UseLog1().log("Juhu"));

      // not allowed to overwrite!
      qx.Bootstrap.define("qx.UseLog2",
      {
        extend : Object,
        construct : function() {},

        members :
        {
          log : function() {
            return "foo";
          }
        }
      });

      if (this.isDebugOn())
      {
        this.assertException(function() {
          qx.Mixin.include(qx.UseLog2, qx.MLogger);
        }, Error, "Overwriting member");
      }

      // allowed to overwrite!
      qx.Bootstrap.define("qx.UseLog3",
      {
        extend : Object,
        construct : function() {},

        members :
        {
          log : function() {
            return "foo";
          }
        }
      });

      this.assertEquals("foo", new qx.UseLog3().log("Juhu"));
      qx.Mixin.include(qx.UseLog3, qx.MLogger, true);
      this.assertEquals("Juhu", new qx.UseLog3().log("Juhu"));

      // extended classes must have included methods as well
      qx.Bootstrap.define("qx.ExtendUseLog1", { extend : qx.UseLog1 });
      this.assertEquals("Juhu", new qx.ExtendUseLog1().log("Juhu"));
    },

    testPatchOverwritten : function()
    {
      qx.Bootstrap.define("qx.Patch1", {
        extend : qx.core.Object,

        members : {
          sayJuhu : function() { return "Juhu"; }
        }
      });

      qx.Bootstrap.define("qx.Patch2", {
        extend : qx.core.Object,

        members : {
          sayJuhu : function() { return "Huhu"; }
        }

      });

      qx.Mixin.define("qx.MPatch",
      {
        members :
        {
          sayJuhu : function() {
            return "Kinners";
          }
        }
      });


      if (this.isDebugOn())
      {
        this.assertException(function() {
          qx.Mixin.include(qx.Patch1, qx.MPatch);
        }, Error, new RegExp('Overwriting member ".*" of Class ".*" is not allowed!'));
      }

      qx.Mixin.include(qx.Patch1, qx.MPatch, true);
      qx.Mixin.include(qx.Patch2, qx.MPatch, true);

      var o = new qx.Patch1();
      this.assertEquals("Kinners", o.sayJuhu());
      o.dispose();

      o = new qx.Patch2();
      this.assertEquals("Kinners", o.sayJuhu());
      o.dispose();
    }
  }
});

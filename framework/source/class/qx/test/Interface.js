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
qx.Class.define("qx.test.Interface",
{
  extend : qx.dev.unit.TestCase,

  members :
  {
    setUp : function() {
      qx.Interface.define("qx.test.i.ICar",
      {
        members :
        {
          startEngine : function() {
            return true;
          }
        },

        properties : { color : {} }
      });
    },


    tearDown : function() {
      qx.Bootstrap.undefine("qx.test.i.ICar");
    },


    testClassImplements : function()
    {
      // test correct implementations
      qx.Bootstrap.define("qx.test.i.Audi",
      {
        extend : Object,
        construct : function() {},
        implement : [ qx.test.i.ICar ],

        members :
        {
          startEngine : function() {
            return "start";
          }
        },

        statics :
        {
          honk : function() {
            return "honk";
          }
        },

        properties : { color : { } }
      });

      var audi = new qx.test.i.Audi("audi");

      this.assertTrue(qx.Interface.classImplements(qx.test.i.Audi, qx.test.i.ICar));
      qx.Bootstrap.undefine("qx.test.i.Audi");
    },


    testEverythingImplemented : function() {
      qx.Bootstrap.define("qx.test.i.Bmw1",
        {
          extend : Object,
          construct : function() {},

          members :
          {
            startEngine : function() {
              return "start";
            }
          },

          statics :
          {
            honk : function() {
              return "honk";
            }
          },

          properties : { color : { } }
        });
      this.assertTrue(qx.Interface.classImplements(qx.test.i.Bmw1, qx.test.i.ICar));
      qx.Bootstrap.undefine("qx.test.i.Bmw1");
    },


    testMissingMembers : function() {
      qx.Bootstrap.define("qx.test.i.Bmw2",
        {
          extend : Object,
          construct : function() {},
          statics :
          {
            honk : function() {
              return "honk";
            }
          },

          properties : { color : { } }
        });
      this.assertFalse(qx.Interface.classImplements(qx.test.i.Bmw2, qx.test.i.ICar));
      qx.Bootstrap.undefine("qx.test.i.Bmw2");
    },


    testMissingStatics : function() {
      // (ie it does implement all necessary)
      qx.Bootstrap.define("qx.test.i.Bmw3",
        {
          extend : Object,
          construct : function() {},
          members :
          {
            startEngine : function() {
              return "start";
            }
          },

          properties : { color : { } }
        });
      this.assertTrue(qx.Interface.classImplements(qx.test.i.Bmw3, qx.test.i.ICar));
      qx.Bootstrap.undefine("qx.test.i.Bmw3");
    },


    testMissingProperties : function() {
      qx.Bootstrap.define("qx.test.i.Bmw4",
        {
          extend : Object,
          construct : function() {},
          members :
          {
            startEngine : function() {
              return "start";
            }
          },

          statics :
          {
            honk : function() {
              return "honk";
            }
          }
        });
      this.assertFalse(qx.Interface.classImplements(qx.test.i.Bmw4, qx.test.i.ICar));
      qx.Bootstrap.undefine("qx.test.i.Bmw4");
    },


    testWithDebug : function() {

      if (this.isDebugOn())
      {
        this.assertException(function() {
          var i = new qx.test.i.ICar();
        }, Error);


        // nothing defined
        this.assertException(function()
        {
          qx.Bootstrap.define("qx.test.i.Audi1",
          {
            extend    : Object,
            construct : function() {},
            implement : [ qx.test.i.ICar ]
          });
        },
        Error, "does not implement the member 'startEngine'");

        // members not defined
        this.assertException(function()
        {
          qx.Bootstrap.define("qx.test.i.Audi2",
          {
            extend : Object,
            construct : function() {},
            implement : [ qx.test.i.ICar ],

            statics :
            {
              honk : function() {
                return "honk";
              }
            },

            properties : { color : { } }
          });
        },
        Error, "does not implement the member 'startEngine'");

        // property not defined
        this.assertException(function()
        {
          qx.Bootstrap.define("qx.test.i.Audi4",
          {
            extend : Object,
            construct : function() {},
            implement : [ qx.test.i.ICar ],

            members :
            {
              startEngine : function() {
                return "start";
              }
            },

            statics :
            {
              honk : function() {
                return "honk";
              }
            }
          });
        },
        Error, "does not implement the property 'color'");
      }
    },


    testProperties : function()
    {
      qx.Interface.define("qx.test.i.IProperties1", {
        properties : {
          value : {}
        }
      });

      qx.Bootstrap.define("qx.test.i.Properties1",
      {
        extend : qx.core.Object,
        implement : [qx.test.i.IProperties1],

        properties :
        {
          value : { check : "Integer"}
        }
      });

      if (this.isDebugOn())
      {
        this.assertException(function() {
          qx.Bootstrap.define("qx.test.i.Properties2",
          {
            extend : qx.core.Object,
            implement : [qx.test.i.IProperties1],

            members :
            {
              getValue : function() {},
              setValue : function(value) {}
            }
          });
        });
      }


      qx.Interface.define("qx.test.i.IProperties2",
      {
        members :
        {
          getValue : function() {},
          setValue : function(value) {}
        }
      });

      qx.Bootstrap.define("qx.test.i.Properties3",
      {
        extend : qx.core.Object,
        implement : [qx.test.i.IProperties2],

        members :
        {
          getValue : function() {},
          setValue : function(value) {}
        }
      });
    },


    testImplementMembers : function() {
      qx.Interface.define("IFoo", {
        members: {
          foo: function() {},
          bar: function() {}
        }
      });

      this.assertException(function() {
        qx.Bootstrap.define(null, {
          implement: [IFoo],
          members: {
            bar: function() {}
          }
        });
      });

      qx.Bootstrap.define(null, {
        implement: [IFoo],
        members: {
          bar: function() {},
          foo: function() {}
        }
      });
    },


    testImplementInheritedMembers : function() {
      qx.Interface.define("IFoo", {
        members: {
          foo: function() {},
          bar: function() {}
        }
      });

      var P = qx.Bootstrap.define(null, {
        members: {
          foo: function() {}
        }
      });

      qx.Bootstrap.define(null, {
        extend: P,
        implement: [IFoo],
        members: {
          bar: function() {}
        }
      });
    },


    testImplementProperties : function() {
      qx.Interface.define("IFoo", {
        properties: {
          bar: {
            init: 23
          }
        }
      });

      this.assertException(function() {
        qx.Bootstrap.define(null, {
          implement: [IFoo],
          properties: {
            foo: {}
          }
        });
      });

      qx.Bootstrap.define(null, {
        implement: [IFoo],
        properties: {
          bar: {
            init: 23
          }
        }
      });
    },


    testImplementInheritedProperties : function() {
      qx.Interface.define("IFoo", {
        properties: {
          foo: {},
          bar: {}
        }
      });

      var P = qx.Bootstrap.define(null, {
        properties: {
          foo: {}
        }
      });

      qx.Bootstrap.define(null, {
        extend: P,
        implement: [IFoo],
        properties: {
          bar: {}
        }
      });
    },


    testInterfaceInheritance : function() {
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

      this.assertException(function() {
        var C = qx.Bootstrap.define(null, {
          implement: [IBar],
          members: {
            bar: function() {}
          },
          properties: {
            qux: {}
          }
        });
      });

      var C = qx.Bootstrap.define(null, {
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

    },


    testIncludes : function()
    {
      qx.Interface.define("qx.test.i.IMember",
      {
        members : {
          sayJuhu : function() {}
        }
      });

      qx.Interface.define("qx.test.i.IProperties",
      {
        properties : {
          "color" : {},
          "name"  : {}
        }
      });

      qx.Interface.define("qx.test.i.IAll", {
        extend : [ qx.test.i.IMember, qx.test.i.IProperties ]
      });

      qx.Interface.define("qx.test.i.IOther",
      {
        members :
        {
          bar : function() {
            return true;
          }
        }
      });

      var classDef =
      {
        extend : Object,
        implement : qx.test.i.IAll,

        members : {
          sayJuhu : function() {}
        },

        statics : {
          sayHello : function() {}
        },

        properties :
        {
          "color" : { },
          "name"  : { }
        }
      };

      // all implemented
      var def = qx.lang.Object.clone(classDef);
      qx.Bootstrap.define("qx.test.i.Implement1", def);

      this.assertTrue(qx.Interface.classImplements(qx.test.i.Implement1, qx.test.i.IAll), "implements IAll");
      this.assertTrue(qx.Interface.classImplements(qx.test.i.Implement1, qx.test.i.IMember), "implements IMember");
      this.assertTrue(qx.Interface.classImplements(qx.test.i.Implement1, qx.test.i.IProperties), "implements IProperties");

      this.assertFalse(qx.Interface.classImplements(qx.test.i.Implement1, qx.test.i.IOther), "not implements IOther");

      // no members
      def = qx.lang.Object.clone(classDef);
      delete (def.members);

      if (this.isDebugOn())
      {
        this.assertException(function() {
          qx.Bootstrap.define("qx.test.i.Implement2", def);
        }, Error, "does not implement the member", "No members defined.");
      }

      // no properties
      def = qx.lang.Object.clone(classDef);
      delete (def.properties);

      if (this.isDebugOn())
      {
        this.assertException(function() {
          qx.Bootstrap.define("qx.test.i.Implement4", def);
        }, Error, new RegExp("does not implement the property"), "No properties defined.");
      }
    }
  }
});

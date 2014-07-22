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
      qx.Class.undefine("qx.test.i.ICar");
    },


    testClassImplements : function()
    {
      // test correct implementations
      qx.Class.define("qx.test.i.Audi",
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
      qx.Class.undefine("qx.test.i.Audi");
    },


    testEverythingImplemented : function() {
      qx.Class.define("qx.test.i.Bmw1",
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
      qx.Class.undefine("qx.test.i.Bmw1");
    },


    testMissingMembers : function() {
      qx.Class.define("qx.test.i.Bmw2",
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
      qx.Class.undefine("qx.test.i.Bmw2");
    },


    testMissingStatics : function() {
      // (ie it does implement all necessary)
      qx.Class.define("qx.test.i.Bmw3",
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
      qx.Class.undefine("qx.test.i.Bmw3");
    },


    testMissingProperties : function() {
      qx.Class.define("qx.test.i.Bmw4",
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
      qx.Class.undefine("qx.test.i.Bmw4");
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
          qx.Class.define("qx.test.i.Audi1",
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
          qx.Class.define("qx.test.i.Audi2",
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
          qx.Class.define("qx.test.i.Audi4",
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

      qx.Class.define("qx.test.i.Properties1",
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
          qx.Class.define("qx.test.i.Properties2",
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
      };


      qx.Interface.define("qx.test.i.IProperties2",
      {
        members :
        {
          getValue : function() {},
          setValue : function(value) {}
        }
      });

      qx.Class.define("qx.test.i.Properties3",
      {
        extend : qx.core.Object,
        implement : [qx.test.i.IProperties2],

        properties :
        {
          value : { check : "Integer"}
        }
      });

      qx.Class.define("qx.test.i.Properties4",
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


    testIncludes : function()
    {
      qx.Interface.define("qx.test.i.IMember",
      {
        members :
        {
          sayJuhu : function() {
            return true;
          }
        }
      });

      qx.Interface.define("qx.test.i.IProperties",
      {
        properties :
        {
          "color" : {},
          "name"  : {}
        }
      });

      qx.Interface.define("qx.test.i.IAll", { extend : [ qx.test.i.IMember, qx.test.i.IProperties ] });

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

        members :
        {
          sayJuhu : function() {}
        },

        statics :
        {
          sayHello : function() {
            return true;
          }
        },

        properties :
        {
          "color" : { },
          "name"  : { }
        }
      };

      // all implemented
      var def = qx.lang.Object.clone(classDef);
      qx.Class.define("qx.test.i.Implement1", def);

      this.assertTrue(qx.Class.implementsInterface(qx.test.i.Implement1, qx.test.i.IAll), "implements IAll");
      this.assertTrue(qx.Class.implementsInterface(qx.test.i.Implement1, qx.test.i.IMember), "implements IMember");
      this.assertTrue(qx.Class.implementsInterface(qx.test.i.Implement1, qx.test.i.IProperties), "implements IProperties");

      this.assertFalse(qx.Class.implementsInterface(qx.test.i.Implement1, qx.test.i.IOther), "not implements IOther");

      // no members
      var def = qx.lang.Object.clone(classDef);
      delete (def.members);

      if (this.isDebugOn())
      {
        this.assertException(function() {
          qx.Class.define("qx.test.i.Implement2", def);
        }, Error, "does not implement the member", "No members defined.");
      };

      // no properties
      var def = qx.lang.Object.clone(classDef);
      delete (def.properties);

      if (this.isDebugOn())
      {
        this.assertException(function() {
          qx.Class.define("qx.test.i.Implement4", def);
        }, Error, new RegExp("does not implement the property"), "No properties defined.");
      };
    },


    testGeneratedIsMethods: function() {
      qx.Interface.define("qx.test.i.IIs",
      {
        members :
        {
          isProp : function() {}
        }
      });

      qx.Class.define("qx.test.i.Is", {
        extend : qx.core.Object,
        implement : qx.test.i.IIs,

        properties : {
          prop : {
            check : "Boolean",
            init : true
          }
        }
      });


    }
  }
});

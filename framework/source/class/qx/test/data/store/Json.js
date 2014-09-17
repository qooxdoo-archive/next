/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)
     * Tristan Koch (tristankoch)

************************************************************************ */

/* ************************************************************************
************************************************************************ */

/**
 *
 * @asset(qx/test/*)
 * @ignore(qx.data.model, qx.test.O, qx.test.M, qx.test.M1, qx.test.M2)
 * @require(qx.io.request.Xhr)
 */

qx.Class.define("qx.test.data.store.Json",
{
  extend : qx.dev.unit.TestCase,
  include : qx.dev.unit.MMock,

  construct : function() {
    this.initMMock();
  },

  members :
  {
    __store : null,
    __data : null,
    __propertyNames : null,


    /**
     * @lint ignoreDeprecated(eval)
     */
    setUp : function()
    {
      this.__store = new qx.data.store.Json();

      this.__data = eval("({s: 'String', n: 12, b: true})");
      this.__propertyNames = ["s", "n", "b"];

      this.url = qx.util.ResourceManager.getInstance().
        toUri("qx/test/primitive.json");
    },


    setUpFakeRequest : function()
    {
      var req = this.request = new qx.io.request.Xhr(this.url);
      req.send = req.setParser = function() {};
      req.dispose = qx.io.request.Xhr.prototype.dispose;
      this.stub(qx.io.request, "Xhr").returns(this.stub(req));
    },


    tearDown : function()
    {
      this.getSandbox().restore();

      if (this.request) {

        // Restore manually (is unreachable from sandbox)
        if (typeof this.request.dispose.restore == "function") {
          this.request.dispose.restore();
        }

        // Dispose
        this.request.dispose();
      }

      this.__store.dispose();

      if (qx.data.model) {
        delete qx.data.model.o;
        delete qx.data.model['a"b'];
      }
    },


    testConfigureNewTransportConstructor : function()
    {
      var store = new qx.data.store.Json(this.url, null, false);
      store.dispose();
    },


    testLoadUrl : function() {
      this.__store.on("loaded", function() {
        this.resume(function() {
          var model = this.__store.model;
          this.assertEquals("String", model.string, "The model is not created how it should!");
        }, this);
      }, this);

      var url = this.url;
      this.__store.url = url;

      this.wait();
    },


    testProgressStates : function() {
      var url = this.url,
          states = [];

      this.__store.on("changeState", function(evt) {
        var state = evt.value;
        states.push(state);

        if (state == "completed") {
          this.resume(function() {
            var expected = ["sending", "receiving", "completed"];
            this.assertArrayEquals(expected, states);
          });
        }
      }, this);

      this.__store.url = url;
      this.wait();
    },


    testLoadResource : function() {
      this.__store.on("loaded", function() {
        this.resume(function() {
          var model = this.__store.model;
          this.assertEquals("String", model.string, "The model is not created how it should!");
        }, this);
      }, this);

      var resource = "qx/test/primitive.json";
      this.__store.url = resource;

      this.wait();
    },


    testLoadAlias : function() {
      this.__store.on("loaded", function() {
        this.resume(function() {
          var model = this.__store.model;
          this.assertEquals("String", model.string, "The model is not created how it should!");
          qx.util.AliasManager.getInstance().remove("testLoadResource");
        }, this);
      }, this);

      // invoke alias handling
      qx.util.AliasManager.getInstance().add("testLoadResource", "qx/test");

      var alias = "testLoadResource/primitive.json";
      this.__store.url = alias;

      this.wait();
    },


    testDispose: function() {
      this.__store.url = this.url;
      this.__store.dispose();
    },


    testWholePrimitive: function() {
      this.__store.on("loaded", function() {
        this.resume(function() {
          var model = this.__store.model;
          this.assertEquals("String", model.string, "The model is not created how it should!");
          this.assertEquals(12, model.number, "The model is not created how it should!");
          this.assertEquals(true, model.boolean, "The model is not created how it should!");
          this.assertNull(model["null"], "The model is not created how it should!");
        }, this);
      }, this);

      var url = this.url;
      this.__store.url = url;

      this.wait();
    },


    testWholeArray: function() {
      this.__store.on("loaded", function() {
        this.resume(function() {
          var model = this.__store.model;
          this.assertNotNull(model.array, "The model is not created how it should!");
          this.assertEquals("qx.data.Array", model.array.classname, "Wrong array class.");
          this.assertEquals("a", model.array.getItem(0), "Wrong content of the array.");
          this.assertEquals("b", model.array.getItem(1), "Wrong content of the array.");
          this.assertEquals("c", model.array.getItem(2), "Wrong content of the array.");
        }, this);
      }, this);

      var url = qx.util.ResourceManager.getInstance().toUri("qx/test/array.json");
      this.__store.url = url;
      this.wait();
    },


    testWholeObject: function() {
      this.__store.on("loaded", function() {
        this.resume(function() {
          var model = this.__store.model;
          this.assertNotNull(model.o, "The model is not created how it should!");
          this.assertEquals("a", model.o.a, "Wrong content of the object.");
          this.assertEquals("b", model.o.b, "Wrong content of the object.");

        }, this);
      }, this);

      var url = qx.util.ResourceManager.getInstance().toUri("qx/test/object.json");
      this.__store.url = url;
      this.wait();
    },


    testOwnClassWith: function() {
      // define a test class
      qx.Class.define("qx.test.AB",
      {
        extend : Object,
        include : [qx.event.MEmitter],

        properties :
        {
          a : {
            check : "String",
            event : true
          },

          b : {
            check : "String",
            event : true
          }
        }
      });

      var delegate = {
        getModelClass : function(properties) {
          if (properties == 'a"b') {
            return qx.Class.getByName("qx.test.AB");
          }
          return null;
        }
      };
      this.__store = new qx.data.store.Json(null, delegate);

      this.__store.on("loaded", function() {
        this.resume(function() {
          var model = this.__store.model;
          this.assertNotNull(model.o, "The model is not created how it should!");

          this.assertEquals("qx.test.AB", model.o.classname, "Not the given class used!");

          this.assertEquals("a", model.o.a, "Wrong content of the object.");
          this.assertEquals("b", model.o.b, "Wrong content of the object.");

        }, this);
      }, this);

      var url = qx.util.ResourceManager.getInstance().toUri("qx/test/object.json");
      this.__store.url = url;

      this.wait();
    },


    testOwnClassWithout: function() {

      var delegate = {
        getModelClass : function(properties) {
          return null;
        }
      };
      this.__store = new qx.data.store.Json(null, delegate);

      this.__store.on("loaded", function() {
        this.resume(function() {
          var model = this.__store.model;
          this.assertNotNull(model.o, "The model is not created how it should!");
          this.assertEquals("a", model.o.a, "Wrong content of the object.");
          this.assertEquals("b", model.o.b, "Wrong content of the object.");

        }, this);
      }, this);

      var url = qx.util.ResourceManager.getInstance().toUri("qx/test/object.json");
      this.__store.url = url;
      this.wait();
    },


    testOwnSuperclassWith: function() {
      // define a test class
      qx.Class.define("qx.test.O",
      {
        extend : Object,
        include : [qx.event.MEmitter]
      });

      var delegate = {
        getModelSuperClass : function(properties) {
          return qx.test.O;
        }
      };
      this.__store = new qx.data.store.Json(null, delegate);

      this.__store.on("loaded", function() {
        this.resume(function() {
          var model = this.__store.model;
          this.assertTrue(qx.Class.isSubClassOf(model.constructor, qx.test.O));
          this.assertNotNull(model.o, "The model is not created how it should!");
          this.assertTrue(qx.Class.isSubClassOf(model.o.constructor, qx.test.O));
          this.assertEquals("a", model.o.a, "Wrong content of the object.");
          this.assertEquals("b", model.o.b, "Wrong content of the object.");
        }, this);
      }, this);

      var url = qx.util.ResourceManager.getInstance().toUri("qx/test/object.json");
      this.__store.url = url;

      this.wait();
    },


    testOwnSuperclassWithout: function() {
      // define a test class
      qx.Class.define("qx.test.O",
      {
        extend : Object
      });

      var delegate = {
        getModelSuperClass : function(properties) {
          return null;
        }
      };
      this.__store = new qx.data.store.Json(null, delegate);

      this.__store.on("loaded", function() {
        this.resume(function() {
          var model = this.__store.model;
          this.assertNotNull(model.o, "The model is not created how it should!");
          this.assertEquals("a", model.o.a, "Wrong content of the object.");
          this.assertEquals("b", model.o.b, "Wrong content of the object.");
        }, this);
      }, this);

      var url = qx.util.ResourceManager.getInstance().toUri("qx/test/object.json");
      this.__store.url = url;

      this.wait();
    },


    testOwnMixinWithout: function() {
      var delegate = {
        getModelMixins : function(properties) {
          return null;
        }
      };
      this.__store = new qx.data.store.Json(null, delegate);

      this.__store.on("loaded", function() {
        this.resume(function() {
          var model = this.__store.model;
          this.assertNotNull(model.o, "The model is not created how it should!");
          this.assertEquals("a", model.o.a, "Wrong content of the object.");
          this.assertEquals("b", model.o.b, "Wrong content of the object.");
        }, this);
      }, this);

      var url = qx.util.ResourceManager.getInstance().toUri("qx/test/object.json");
      this.__store.url = url;

      this.wait();
    },


    testOwnMixinWith: function() {
      // define a test class
      qx.Mixin.define("qx.test.M",
      {
        members :
        {
          foo: function() {
            return true;
          }
        }
      });

      var delegate = {
        getModelMixins : function(properties) {
          return qx.test.M;
        }
      };
      this.__store = new qx.data.store.Json(null, delegate);

      this.__store.on("loaded", function() {
        this.resume(function() {
          var model = this.__store.model;
          this.assertTrue(model.foo(), "Mixin not included.");
          this.assertNotNull(model.o, "The model is not created how it should!");
          this.assertTrue(model.o.foo(), "Mixin not included.");
          this.assertEquals("a", model.o.a, "Wrong content of the object.");
          this.assertEquals("b", model.o.b, "Wrong content of the object.");
        }, this);
      }, this);

      var url = qx.util.ResourceManager.getInstance().toUri("qx/test/object.json");
      this.__store.url = url;

      this.wait();
    },

    testOwnMixinWithMultiple: function() {
      // define a test class
      qx.Mixin.define("qx.test.M1",
      {
        members :
        {
          foo: function() {
            return true;
          }
        }
      });
      qx.Mixin.define("qx.test.M2",
      {
        members :
        {
          bar: function() {
            return true;
          }
        }
      });


      var delegate = {
        getModelMixins : function(properties) {
          return [qx.test.M1, qx.test.M2];
        }
      };
      this.__store = new qx.data.store.Json(null, delegate);

      this.__store.on("loaded", function() {
        this.resume(function() {
          var model = this.__store.model;
          this.assertTrue(model.foo(), "Mixin not included.");
          this.assertTrue(model.bar(), "Mixin not included.");
          this.assertNotNull(model.o, "The model is not created how it should!");
          this.assertTrue(model.o.foo(), "Mixin not included.");
          this.assertEquals("a", model.o.a, "Wrong content of the object.");
          this.assertEquals("b", model.o.b, "Wrong content of the object.");
        }, this);
      }, this);

      var url = qx.util.ResourceManager.getInstance().toUri("qx/test/object.json");
      this.__store.url = url;

      this.wait();
    },


    testManipulatePrimitive: function() {
      var delegate = {manipulateData : function(data) {
        return data;
      }};

      this.spy(delegate, "manipulateData");

      this.__store.dispose();
      this.__store = new qx.data.store.Json(null, delegate);

      this.__store.on("loaded", function() {
        this.resume(function() {
          this.assertCalled(delegate.manipulateData);
        }, this);
      }, this);

      var url = this.url;
      this.__store.url = url;

      this.wait();
    },


    testConfigureRequestPrimitive: function() {
      var delegate,
          self = this;

      delegate = {configureRequest : function(request) {
        self.assertInstance(request, qx.io.request.Xhr);
      }};

      this.spy(delegate, "configureRequest");

      this.__store.dispose();
      this.__store = new qx.data.store.Json(null, delegate);

      this.__store.on("loaded", function() {
        this.resume(function() {
          this.assertCalled(delegate.configureRequest);
        }, this);
      }, this);

      var url = this.url;
      this.__store.url = url;

      this.wait();
    },


    testDisposeRequest: function() {
      this.setUpFakeRequest();
      this.__store.url = (this.url);
      this.__store.dispose();

      this.assertCalled(this.request.dispose);
    },


    testDisposeRequestDone: function() {
      this.setUpFakeRequest();
      var url = this.url;
      this.__store.on("loaded", function() {
        this.resume(function() {
          this.__store.dispose();
          this.assertCalled(this.request.dispose);
        }, this);
      }, this);
      this.__store.url = url;
    },


    testErrorEvent : function() {
      this.__store.on("error", function(ev) {
        this.resume(function() {
          this.assertNotNull(ev);
        }, this);
      }, this);

      this.__store.url = ("not-found");

      this.wait();
    },

    "test Internal Server Error" : function() {
      this.useFakeServer();

      var server = this.getServer();
      server.respondWith("GET", "/foo", [ 500,
        {"Content-Type": "application/json"}, "SERVER ERROR" ]);

      this.__store.on("error", function(req)
      {
        this.resume(function() {
          this.assertEquals("statusError", req.getPhase());
        }, this);
      }, this);

      window.setTimeout(function()
      {
        this.__store.url = ("/foo");
        server.respond();
      }.bind(this), 500)

      this.wait(1000);
    }
  }
});

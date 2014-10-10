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
 * @asset(framework/source/resource/qx/test/*)
 * @ignore(qx.data.model, qx.test.O, qx.test.M, qx.test.M1, qx.test.M2)
 * @require(qx.io.request.Xhr)
 */

describe("data.store.Json", function(){

   var __store = null;
   var __data = null;
   var __propertyNames = null;
   var xhr = null;
   var requests = [];
   var request = null;
   var url="affe";


    function setUpFakeRequest() 
    {
      // xhr = sinon.useFakeXMLHttpRequest();
      // requests = [];
      // xhr.onCreate = function (req) { requests.push(req); };
      var req = request = new qx.io.request.Xhr(url);
      req.send = req.setParser = function() {};
      req.dispose = qx.io.request.Xhr.prototype.dispose;
      sinon.stub(qx.io.request, "Xhr").returns(sinon.stub(req));
    }



    /**
     * @lint ignoreDeprecated(eval)
     */
    beforeEach (function ()
    {
      var sandbox = sinon.sandbox.create();
      __store = new qx.data.store.Json();

      __data = eval("({s: 'String', n: 12, b: true})");
      __propertyNames = ["s", "n", "b"];

      console.log("before before", url)
      url = qx.util.ResourceManager.getInstance().
        toUri("/framework/source/resource/qx/test/primitive.json");
        console.log("before", url)
    });

    afterEach (function () {
      console.log("after 1", url)
      sinon.sandbox.restore();
      //getSandbox.restore();
      if (request) {

        // Restore manually (is unreachable from sandbox)
        if (typeof request.dispose.restore == "function") {
          request.dispose.restore();
        }

        // Dispose
        request.dispose();
      }

      __store.dispose();

      if (qx.data.model) {
        delete qx.data.model.o;
        delete qx.data.model['a"b'];
      }
      console.log("after 2", url)
  });
 
  it("ConfigureNewTransportConstructor", function() {
    console.log("ConfigureNewTransportConstructor 1", url)
      var store = new qx.data.store.Json(url, null, false);
      store.dispose();
      console.log("ConfigureNewTransportConstructor 2", url)
  });
 
  it("LoadUrl", function(done) {

      __store.on("loaded", function() {
        setTimeout(function(){
          var model = __store.model;
          assert.equal("String", model.string, "The model is not created how it should!");
          done();
        },0);
      }, this);
      __store.url = url;
  });
 
  it("ProgressStates", function(done) {
    console.log("ProgressStates", url)
      var states = [];

      __store.on("changeState", function(evt) {
        var state = evt.value;
        states.push(state);

        if (state == "completed") {
          setTimeout(function () {
            var expected = ["sending", "receiving", "completed"];
            assert.deepEqual(expected, states);
            console.log("done")
            done();

          },0);
        }
      }, this);

      __store.url = url;

  });
 
  it("LoadResource", function(done) {
      __store.on("loaded", function() {
        setTimeout (function () {
          var model = __store.model;
          assert.equal("String", model.string, "The model is not created how it should!");
          done();
        },0 );
      }, this);

      var resource = "/framework/source/resource/qx/test/primitive.json";
      __store.url = resource;
  });
 
  it("LoadAlias", function(done) {
      __store.on("loaded", function() {
        setTimeout (function () {
          var model = __store.model;
          assert.equal("String", model.string, "The model is not created how it should!");
          qx.util.AliasManager.getInstance().remove("testLoadResource");
          done();
        }, 0);
      }, this);

      // invoke alias handling
      qx.util.AliasManager.getInstance().add("testLoadResource", "/../framework/source/resource/qx/test");

      var alias = "testLoadResource/primitive.json";
      __store.url = alias;

  });
 
  it("Dispose", function() {
      __store.url = url;
      __store.dispose();
  });
 
  it("WholePrimitive", function(done) {
      __store.on("loaded", function() {
        setTimeout (function () {
          var model = __store.model;
          assert.equal("String", model.string, "The model is not created how it should!");
          assert.equal(12, model.number, "The model is not created how it should!");
          assert.equal(true, model.boolean, "The model is not created how it should!");
          assert.isNull(model["null"], "The model is not created how it should!");
          done();
        }, 0);
      }, this);


      __store.url = url;

  });
 
  it("WholeArray", function(done) {
      __store.on("loaded", function() {
        setTimeout (function () {
          var model = __store.model;
          assert.isNotNull(model.array, "The model is not created how it should!");
          assert.equal("qx.data.Array", model.array.classname, "Wrong array class.");
          assert.equal("a", model.array.getItem(0), "Wrong content of the array.");
          assert.equal("b", model.array.getItem(1), "Wrong content of the array.");
          assert.equal("c", model.array.getItem(2), "Wrong content of the array.");
          done();
        }, 0);
      }, this);

      var url = qx.util.ResourceManager.getInstance().toUri("/framework/source/resource/qx/test/array.json");
      __store.url = url;
  });
 
  it("WholeObject", function(done) {
      __store.on("loaded", function() {
        setTimeout (function () {
          var model = __store.model;
          assert.isNotNull(model.o, "The model is not created how it should!");
          assert.equal("a", model.o.a, "Wrong content of the object.");
          assert.equal("b", model.o.b, "Wrong content of the object.");
          done();
        }, 0);
      }, this);

      var url = qx.util.ResourceManager.getInstance().toUri("/framework/source/resource/qx/test/object.json");
      __store.url = url;
  });
 
  it("OwnClassWith", function(done) {
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
      __store = new qx.data.store.Json(null, delegate);

      __store.on("loaded", function() {
        setTimeout (function () {
          var model = __store.model;
          assert.isNotNull(model.o, "The model is not created how it should!");

          assert.equal("qx.test.AB", model.o.classname, "Not the given class used!");

          assert.equal("a", model.o.a, "Wrong content of the object.");
          assert.equal("b", model.o.b, "Wrong content of the object.");
          done();
        }, 0);
      }, this);

      var url = qx.util.ResourceManager.getInstance().toUri("/framework/source/resource/qx/test/object.json");
      __store.url = url;

  });
 
  it("OwnClassWithout", function(done) {

      var delegate = {
        getModelClass : function(properties) {
          return null;
        }
      };
      __store = new qx.data.store.Json(null, delegate);

      __store.on("loaded", function() {
        setTimeout (function () {
          var model = __store.model;
          assert.isNotNull(model.o, "The model is not created how it should!");
          assert.equal("a", model.o.a, "Wrong content of the object.");
          assert.equal("b", model.o.b, "Wrong content of the object.");
          done();
        }, 0);
      }, this);

      var url = qx.util.ResourceManager.getInstance().toUri("/framework/source/resource/qx/test/object.json");
      __store.url = url;
  });
 
  it("OwnSuperclassWith", function(done) {
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
      __store = new qx.data.store.Json(null, delegate);

      __store.on("loaded", function() {
        setTimeout (function () {
          var model = __store.model;
          assert.isTrue(qx.Class.isSubClassOf(model.constructor, qx.test.O));
          assert.isNotNull(model.o, "The model is not created how it should!");
          assert.isTrue(qx.Class.isSubClassOf(model.o.constructor, qx.test.O));
          assert.equal("a", model.o.a, "Wrong content of the object.");
          assert.equal("b", model.o.b, "Wrong content of the object.");
          done();
        }, 0);
      }, this);

      var url = qx.util.ResourceManager.getInstance().toUri("/framework/source/resource/qx/test/object.json");
      __store.url = url;

  });
 
  it("OwnSuperclassWithout", function(done) {
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
      __store = new qx.data.store.Json(null, delegate);

      __store.on("loaded", function() {
        setTimeout (function () {
          var model = __store.model;
          assert.isNotNull(model.o, "The model is not created how it should!");
          assert.equal("a", model.o.a, "Wrong content of the object.");
          assert.equal("b", model.o.b, "Wrong content of the object.");
          done();
        }, 0);
      }, this);

      var url = qx.util.ResourceManager.getInstance().toUri("/framework/source/resource/qx/test/object.json");
      __store.url = url;

  });
 
  it("OwnMixinWithout", function(done) {
      var delegate = {
        getModelMixins : function(properties) {
          return null;
        }
      };
      __store = new qx.data.store.Json(null, delegate);

      __store.on("loaded", function() {
        setTimeout (function () {
          var model = __store.model;
          assert.isNotNull(model.o, "The model is not created how it should!");
          assert.equal("a", model.o.a, "Wrong content of the object.");
          assert.equal("b", model.o.b, "Wrong content of the object.");
          done();
        }, 0);
      }, this);

      var url = qx.util.ResourceManager.getInstance().toUri("/framework/source/resource/qx/test/object.json");
      __store.url = url;

  });
 
  it("OwnMixinWith", function(done) {
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
      __store = new qx.data.store.Json(null, delegate);

      __store.on("loaded", function() {
        setTimeout (function () {
          var model = __store.model;
          assert.isTrue(model.foo(), "Mixin not included.");
          assert.isNotNull(model.o, "The model is not created how it should!");
          assert.isTrue(model.o.foo(), "Mixin not included.");
          assert.equal("a", model.o.a, "Wrong content of the object.");
          assert.equal("b", model.o.b, "Wrong content of the object.");
          done();
        }, 0);
      }, this);

      var url = qx.util.ResourceManager.getInstance().toUri("/framework/source/resource/qx/test/object.json");
      __store.url = url;

  });
 
  it("OwnMixinWithMultiple", function(done) {
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
      __store = new qx.data.store.Json(null, delegate);

      __store.on("loaded", function() {
        setTimeout (function () {
          var model = __store.model;
          assert.isTrue(model.foo(), "Mixin not included.");
          assert.isTrue(model.bar(), "Mixin not included.");
          assert.isNotNull(model.o, "The model is not created how it should!");
          assert.isTrue(model.o.foo(), "Mixin not included.");
          assert.equal("a", model.o.a, "Wrong content of the object.");
          assert.equal("b", model.o.b, "Wrong content of the object.");
          done();
        }, 0);
      }, this);

      var url = qx.util.ResourceManager.getInstance().toUri("/framework/source/resource/qx/test/object.json");
      __store.url = url;

  });
 
  it("ManipulatePrimitive", function(done) {

      var delegate = {manipulateData : function(data) {
        return data;
      }};

      sinon.spy(delegate, "manipulateData");

      __store.dispose();
      __store = new qx.data.store.Json(null, delegate);

      __store.on("loaded", function() {
        setTimeout (function () {
          sinon.assert.called(delegate.manipulateData);
          done();
        }, 0);
      }, this);


      __store.url = url;

  });
 
  it("ConfigureRequestPrimitive", function(done) {
      var delegate,
          

      delegate = {configureRequest : function(request) {
        assert.instanceOf(request, qx.io.request.Xhr);
      }};

      sinon.spy(delegate, "configureRequest");

      __store.dispose();
      __store = new qx.data.store.Json(null, delegate);

      __store.on("loaded", function() {
        setTimeout (function () {
          sinon.assert.called(delegate.configureRequest);
          done();
        }, 0);
      }, this);


      __store.url = url;

  });
 
  it("DisposeRequest", function() {
      setUpFakeRequest();
      __store.url = (url);
      __store.dispose();

      sinon.assert.called(request.dispose);
  });
 
  it("DisposeRequestDone", function(done) {
      setUpFakeRequest();
      __store.on("loaded", function() {
        setTimeout (function () {
          __store.dispose();
          sinon.assert.called(request.dispose);
          done();
        }, 0);
      }, this);
      __store.url = url;
  });
 
  it("ErrorEvent", function(done) {
      __store.on("error", function(ev) {
        setTimeout (function () {
          assert.isNotNull(ev);
          done();
        }, 0);
      }, this);

      __store.url = ("not-found");

  });
 
  it(" Internal Server Error", function(done) {
      useFakeServer();

      var server = getServer();
      server.respondWith("GET", "/foo", [ 500,
        {"Content-Type": "application/json"}, "SERVER ERROR" ]);

      __store.on("error", function(req)
      {
        setTimeout (function () {
          assert.equal("statusError", req.getPhase());
          done();
        }, 0);
      }, this);

      window.setTimeout(function()
      {
        __store.url = ("/foo");
        server.respond();
      }.bind(this), 500)

      wait(1000);
    
  });
});

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

describe("data.store.Json", function() {

  this.timeout(6000);
  var __store = null;
  var __data = null;
  var __propertyNames = null;
  var xhr = null;
  var url = "tests/data/store/primitive.json";


  beforeEach(function() {
    __store = new qx.data.store.Json();

    __data = eval("({s: 'String', n: 12, b: true})");
    __propertyNames = ["s", "n", "b"];
  });


  afterEach(function() {
    if(__store){
      __store.dispose();
    }


    if (qx.data.model) {
      delete qx.data.model.o;
      delete qx.data.model['a"b'];
    }
  });


  it("ConfigureNewTransportConstructor", function() {
    var store = new qx.data.store.Json(url, null, false);
    store.dispose();
  });


  it("LoadUrl", function(done) {
    __store.on("loaded", function() {

      var model = __store.model;
      assert.equal("String", model.string, "The model is not created how it should!");
      done();
    }, this);
    __store.url = url;
  });


  it("ProgressStates", function(done) {
    var states = [];
    __store.on("changeState", function(evt) {
      var state = evt.value;
      states.push(state);
      if (state == "completed") {
        setTimeout(function() {
          var expected = ["sending", "receiving", "completed"];
          assert.deepEqual(expected, states);
          done();
        }, 0);
      }
    }, this);
    __store.url = url;

  });


  it("LoadResource", function(done) {
    __store.on("loaded", function() {
      setTimeout(function() {
        var model = __store.model;
        assert.equal("String", model.string, "The model is not created how it should!");
        done();
      }, 0);
    }, this);

    __store.url = "tests/data/store/primitive.json";
  });


  it("LoadAlias", function(done) {
    __store.on("loaded", function() {
      setTimeout(function() {
        var model = __store.model;
        assert.equal("String", model.string, "The model is not created how it should!");
        qx.util.AliasManager.getInstance().remove("testLoadResource");
        done();
      }, 0);
    }, this);

    // invoke alias handling
    qx.util.AliasManager.getInstance().add("testLoadResource", "../resource/qx/test");


    __store.url = "tests/data/store/primitive.json";
  });


  it("Dispose", function() {
    __store.url = url;
    __store.dispose();
  });


  it("WholePrimitive", function(done) {
    __store.on("loaded", function() {
      setTimeout(function() {
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
      setTimeout(function() {
        var model = __store.model;
        assert.isNotNull(model.array, "The model is not created how it should!");
        assert.equal("qx.data.Array", model.array.classname, "Wrong array class.");
        assert.equal("a", model.array.getItem(0), "Wrong content of the array.");
        assert.equal("b", model.array.getItem(1), "Wrong content of the array.");
        assert.equal("c", model.array.getItem(2), "Wrong content of the array.");
        done();
      }, 0);
    }, this);

    __store.url = "tests/data/store/array.json";
  });


  it("WholeObject", function(done) {
    __store.on("loaded", function() {
      setTimeout(function() {
        var model = __store.model;
        assert.isNotNull(model.o, "The model is not created how it should!");
        assert.equal("a", model.o.a, "Wrong content of the object.");
        assert.equal("b", model.o.b, "Wrong content of the object.");
        done();
      }, 0);
    }, this);

    __store.url = "tests/data/store/object.json";
  });


  it("OwnClassWith", function(done) {
    // define a test class
    qx.Class.define("qx.test.AB", {
      extend: Object,
      include: [qx.event.MEmitter],

      properties: {
        a: {
          check: "String",
          event: true
        },

        b: {
          check: "String",
          event: true
        }
      }
    });

    var delegate = {
      getModelClass: function(properties) {
        if (properties == 'a"b') {
          return qx.Class.getByName("qx.test.AB");
        }
        return null;
      }
    };
    __store = new qx.data.store.Json(null, delegate);

    __store.on("loaded", function() {
      setTimeout(function() {
        var model = __store.model;
        assert.isNotNull(model.o, "The model is not created how it should!");

        assert.equal("qx.test.AB", model.o.classname, "Not the given class used!");

        assert.equal("a", model.o.a, "Wrong content of the object.");
        assert.equal("b", model.o.b, "Wrong content of the object.");
        done();
      }, 0);
    }, this);

    __store.url = "tests/data/store/object.json";
  });


  it("OwnClassWithout", function(done) {
    var delegate = {
      getModelClass: function(properties) {
        return null;
      }
    };
    __store = new qx.data.store.Json(null, delegate);

    __store.on("loaded", function() {
      setTimeout(function() {
        var model = __store.model;
        assert.isNotNull(model.o, "The model is not created how it should!");
        assert.equal("a", model.o.a, "Wrong content of the object.");
        assert.equal("b", model.o.b, "Wrong content of the object.");
        done();
      }, 0);
    }, this);

    __store.url = "tests/data/store/object.json";
  });


  it("OwnSuperclassWith", function(done) {
    // define a test class
    qx.Class.define("qx.test.O", {
      extend: Object,
      include: [qx.event.MEmitter]
    });

    var delegate = {
      getModelSuperClass: function(properties) {
        return qx.test.O;
      }
    };
    __store = new qx.data.store.Json(null, delegate);

    __store.on("loaded", function() {
      setTimeout(function() {
        var model = __store.model;
        assert.isTrue(qx.Class.isSubClassOf(model.constructor, qx.test.O));
        assert.isNotNull(model.o, "The model is not created how it should!");
        assert.isTrue(qx.Class.isSubClassOf(model.o.constructor, qx.test.O));
        assert.equal("a", model.o.a, "Wrong content of the object.");
        assert.equal("b", model.o.b, "Wrong content of the object.");
        done();
      }, 0);
    }, this);

    __store.url = "tests/data/store/object.json";
  });


  it("OwnSuperclassWithout", function(done) {
    // define a test class
    qx.Class.define("qx.test.1", {
      extend: Object
    });

    var delegate = {
      getModelSuperClass: function(properties) {
        return null;
      }
    };
    __store = new qx.data.store.Json(null, delegate);

    __store.on("loaded", function() {
      setTimeout(function() {
        var model = __store.model;
        assert.isNotNull(model.o, "The model is not created how it should!");
        assert.equal("a", model.o.a, "Wrong content of the object.");
        assert.equal("b", model.o.b, "Wrong content of the object.");
        done();
      }, 0);
    }, this);

    __store.url = "tests/data/store/object.json";
  });


  it("OwnMixinWithout", function(done) {
    var delegate = {
      getModelMixins: function(properties) {
        return null;
      }
    };
    __store = new qx.data.store.Json(null, delegate);

    __store.on("loaded", function() {
      setTimeout(function() {
        var model = __store.model;
        assert.isNotNull(model.o, "The model is not created how it should!");
        assert.equal("a", model.o.a, "Wrong content of the object.");
        assert.equal("b", model.o.b, "Wrong content of the object.");
        done();
      }, 0);
    }, this);

    __store.url = "tests/data/store/object.json";
  });


  it("OwnMixinWith", function(done) {
    // define a test class
    qx.Mixin.define("qx.test.M", {
      members: {
        foo: function() {
          return true;
        }
      }
    });

    var delegate = {
      getModelMixins: function(properties) {
        return qx.test.M;
      }
    };
    __store = new qx.data.store.Json(null, delegate);

    __store.on("loaded", function() {
      setTimeout(function() {
        var model = __store.model;
        assert.isTrue(model.foo(), "Mixin not included.");
        assert.isNotNull(model.o, "The model is not created how it should!");
        assert.isTrue(model.o.foo(), "Mixin not included.");
        assert.equal("a", model.o.a, "Wrong content of the object.");
        assert.equal("b", model.o.b, "Wrong content of the object.");
        done();
      }, 0);
    }, this);

    __store.url = "tests/data/store/object.json";
  });


  it("OwnMixinWithMultiple", function(done) {
    // define a test class
    qx.Mixin.define("qx.test.M1", {
      members: {
        foo: function() {
          return true;
        }
      }
    });
    qx.Mixin.define("qx.test.M2", {
      members: {
        bar: function() {
          return true;
        }
      }
    });
    var delegate = {
      getModelMixins: function(properties) {
        return [qx.test.M1, qx.test.M2];
      }
    };
    __store = new qx.data.store.Json(null, delegate);

    __store.on("loaded", function() {
      setTimeout(function() {
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

    __store.url = "tests/data/store/object.json";
  });


  it("ManipulatePrimitive", function(done) {
    var delegate = {
      manipulateData: function(data) {
        return data;
      }
    };

    sinonSandbox.spy(delegate, "manipulateData");

    __store = new qx.data.store.Json(null, delegate);

    __store.on("loaded", function() {
      setTimeout(function() {
        sinon.assert.called(delegate.manipulateData);
        done();
      }, 0);
    }, this);


    __store.url = url;
  });


  it("ConfigureRequestPrimitive", function(done) {

    var delegate = {
      configureRequest: function(request) {
        assert.instanceOf(request, qx.io.request.Xhr);
      }
    };

    sinonSandbox.spy(delegate, "configureRequest");

    __store = new qx.data.store.Json(null, delegate);

    __store.on("loaded", function() {
      setTimeout(function() {
        sinon.assert.called(delegate.configureRequest);
        done();
      }, 0);
    }, this);

    __store.url = url;
  });


  it("DisposeRequest", function() {
    __store.url = url;
    __store.dispose();

    assert.isTrue(__store._getRequest().$$disposed);
  });


  it("DisposeRequestDone", function(done) {
    __store.on("loaded", function() {
      __store.dispose();
      assert.isTrue(__store._getRequest().$$disposed);
      done();
    }, this);
    __store.url = url;
  });


  it("ErrorEvent", function(done) {
    __store.on("error", function(ev) {
      setTimeout(function() {
        assert.isNotNull(ev);
        done();
      }, 0);
    }, this);

    __store.url = "not-found";
  });


  it("test Internal Server Error", function(done) {
    sinonSandbox.useFakeServer();

    var server = sinonSandbox.server;
    server.respondWith("GET", "/foo", [ 500,
      {"Content-Type": "application/json"}, "SERVER ERROR" ]);

    __store.on("error", function(req) {
      assert.equal("statusError", req.phase);
      done();
    }, this);

    setTimeout(function() {
      __store.url = "/foo";
      server.respond();
    }, 500);
  });
});

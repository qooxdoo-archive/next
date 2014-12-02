/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tristan Koch (tristankoch)

************************************************************************ */

describe("data.store.Rest", function() {

  var reg;
  var res;
  var marshal;


  beforeEach(function() {
    req = setUpDoubleRequest();
    res = setUpResource();
    store = new qx.data.store.Rest(res, "index");
  });


  afterEach(function() {
    qx.io.request.Xhr.restore();
    store.dispose();
    res.dispose();
  });



  function __getOwnProperties(object, targetClazz) {
    var clazz = object.constructor,
      clazzes = [],
      properties = [];

    // Find classes in inheritance chain up to targetClazz
    if (targetClazz) {
      while (clazz.superclass) {
        clazzes.push(clazz);
        clazz = clazz.superclass;
        if (clazz == targetClazz.superclass) {
          break;
        }
      }
    }

    // Check if property is own in one of the classes in chain
    for (var prop in object) {

      if (clazzes.length) {
        var found = clazzes.some(function(clazz) {
          return clazz.prototype.hasOwnProperty(prop);
        });
        if (!found) {
          continue;
        }
      }

      properties.push(prop);
    }

    return properties;
  }


  function __stubProperty(object, prop) {
    // Leave constructor and properties intact
    if (prop === "constructor" || typeof object[prop] !== "function") {
      return;
    }

    sinonSandbox.stub(object, prop);
  }


  function injectStub(object, property, customStub) {
    var stub = customStub || this.deepStub(new object[property]);

    sinonSandbox.stub(object, property).returns(stub);
    return stub;
  }


  function shallowStub(object, targetClazz, propsToExclude) {
    __getOwnProperties(object, targetClazz).forEach(function(prop) {
      if (propsToExclude && propsToExclude.indexOf(prop) >= 0) {
        // don't stub excluded prop
        return;
      }
      __stubProperty(object, prop);
    }, this);

    return object;
  };


  function setUpResource() {
    var description = {
      "index": {
        method: "GET",
        url: "/photos"
      }
    };
    return res = new qx.io.rest.Resource(description);
  }


  function setUpDoubleRequest() {
    var req = new qx.io.request.Xhr();

    // Stub request methods, leave event system intact
    req = shallowStub(req, qx.io.request.AbstractRequest, ["dispose", "emit", "on", "once", "off", "offById", "getListenerId",
      "hasListener", "getListeners", "getEntryById", "_getStorage"
    ]);

    // Inject double and return
    injectStub(qx.io.request, "Xhr", req);

    return req;
  }


  afterEach(function() {
    req.dispose();
    store.dispose();
  });


  it("construct with res and action name", function() {
    assert.strictEqual(store.resource, res);
    assert.strictEqual(store.actionName, "index");
  });


  it("construct throws with missing res", function() {
    // require(["debug"]);
    // Unfortunately, qx.core.Property throws a generic error
    assert.throw(function() {
      store = new qx.data.store.Rest(null, "index");
    }, Error, (/property 'resource'/));
    //store.dispose();
  });


  it("construct throws with erroneous res", function() {
    // require(["debug"]);

    var store;
    assert.throw(function() {
      store = new qx.data.store.Rest({}, "index");
    });
    //store && store.dispose();
  });


  it("construct throws with missing action", function() {
    // require(["debug"]);

    var store;

    assert.throw(function() {
      store = new qx.data.store.Rest(res, null);
    }, Error, (/property 'actionName'/));
    store && store.dispose();
  });


  it("add listener for actionSuccess to res", function() {
    var store;

    sinonSandbox.stub(res, "on");
    store = new qx.data.store.Rest(res, "index");
    sinon.assert.called(res.on);
    store.dispose();
  });


  it("marshal response", function() {
    sinonSandbox.stub(store._marshaler, "toModel");

    var data = {
      "key": "value"
    };
    res.index();
    respond(data);

    sinon.assert.calledOnce(store._marshaler.toModel);
    sinon.assert.calledWith(store._marshaler.toModel, data);

    store._marshaler.toModel.restore();
  });


  it("populates model property with marshaled response", function() {
    var res = setUpResource();
    var store = new qx.data.store.Rest(res, "index");

    res.index();
    respond({
      "name": "Affe"
    });
    // assert.equal("Affe", store.getModel().getName());
    store.dispose();
  });


  it("fires changeModel", function() {
    var res = setUpResource(),
      store = new qx.data.store.Rest(res, "index");

    res.index();
    qx.core.Assert.assertEventFired(store, "changeModel", function() {
      respond({
        "name": "Affe"
      });
    });

    store.dispose();
    res.dispose();
  });


  it("configure request with delegate", function() {
    var configureRequest = sinonSandbox.spy(function(req) {
      req.affe = true;
    });

    var delegate = {
      configureRequest: configureRequest
    };

    var store = new qx.data.store.Rest(res, "index", delegate);

    // Configure before sending
    sinon.assert.notCalled(req.send);

    res.index();
    assert.isTrue(configureRequest.calledWith(req));
    assert.isTrue(req.affe);
    sinon.assert.called(req.send);

    store.dispose();
  });


  it("manipulate data with delegate before marshaling", function() {
    var data = {
      "name": "Tiger"
    };

    var manipulateData = sinonSandbox.spy(function(data) {
      data.name = "Maus";
      return data;
    });

    var delegate = {
      manipulateData: manipulateData
    };

    var store = new qx.data.store.Rest(res, "index", delegate);
    sinonSandbox.stub(store._marshaler, "toModel");

    res.index();
    respond(data);
    assert.isTrue(manipulateData.calledWith(data));
    assert.isTrue(store._marshaler.toModel.calledWith({
      "name": "Maus"
    }));

    store.dispose();
    store._marshaler.toModel.restore();
  });


  // Fake response
  var respond = function(response) {
    response = response || "";
    req.phase = "success";

    // Set parsed response
    req.getResponse.returns(response);

    req.emit("success");
  }
});

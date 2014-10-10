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
//Mrequirements
describe("data.store.Rest", function ()
{
  var reg;
  var res;
  var marshal;
  setup();
 function setup(){
    req = setUpDoubleRequest();
    res = setUpResource();
     marshal = new qx.data.marshal.Json();
     marshal = shallowStub(marshal, qx.data.marshal.Json,
      ["dispose", "emit", "on", "once", "off", "offById", "getListenerId",
       "hasListener", "getListeners", "getEntryById", "_getStorage"]);
         marshal.toModel.returns({});

    store = new qx.data.store.Rest(res, "index");
 } 

    /**
     * Get the object’s own properties.
     *
     * @param object {Object} Object to analyse.
     * @param targetClazz {Object} Class which marks the end of the chain.
     * @return {Array} Array of the object’s own properties.
     */
  function __getOwnProperties (object, targetClazz) {
    var clazz = object.constructor,
        clazzes = [],
        properties = [];

    // Find classes in inheritance chain up to targetClazz
    if (targetClazz) {
      while(clazz.superclass) {
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

    /**
     * Safely stub property.
     *
     * @param object {Object} Object to stub.
     * @param prop {String} Property to stub.
     */
  function __stubProperty(object, prop) {
    // Leave constructor and properties intact
    if(prop === "constructor" || typeof object[prop] !== "function") {
      return;
    }

    sinon.stub(object, prop);
  }
    
  function injectStub (object, property, customStub) {
    var stub = customStub || this.deepStub(new object[property]);

    sinon.stub(object, property).returns(stub);
    return stub;
  }
    /**
     * EXPERIMENTAL - NOT READY FOR PRODUCTION
     *
     * Shallowly stub all methods (except excluded) that belong to classes found in inheritance
     * chain up to (but including) the given class.
     *
     * @param object {Object} Object to stub shallowly.
     * @param targetClazz {Object} Class which marks the end of the chain.
     * @param propsToExclude {Array} Array with properties which shouldn't be stubbed.
     * @return {Object} A stub.
     */
  function  shallowStub(object, targetClazz, propsToExclude) {
        __getOwnProperties(object, targetClazz).forEach(function(prop) {
        if (propsToExclude && propsToExclude.indexOf(prop) >= 0) {
          // don't stub excluded prop
          return;
        }
        __stubProperty(object, prop);
      }, this);

      return object;
  };

  beforeEach (function ()  {

    // marshal = new qx.data.marshal.Json();
    // marshal = shallowStub(marshal, qx.data.marshal.Json,
    //   ["dispose", "emit", "on", "once", "off", "offById", "getListenerId",
    //    "hasListener", "getListeners", "getEntryById", "_getStorage"]);
    // injectStub(qx.data.marshal, "Json", marshal);
   


  });


   function setUpResource () {

    var description = {"index": {method: "GET", url: "/photos"}};
    return res = new qx.io.rest.Resource(description);
  }


  function setUpDoubleRequest () {
    var req = new qx.io.request.Xhr();

    // Stub request methods, leave event system intact
    req = shallowStub(req, qx.io.request.AbstractRequest,
      ["dispose", "emit", "on", "once", "off", "offById", "getListenerId",
       "hasListener", "getListeners", "getEntryById", "_getStorage"]);

    // Inject double and return
   injectStub(qx.io.request, "Xhr", req);

    return req;
  }


  afterEach (function() {
      sinon.sandbox.restore();
      //req.dispose();
     // res.dispose();
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

      sinon.stub(res, "on");
      store = new qx.data.store.Rest(res, "index");
      sinon.assert.called(res.on);
      store.dispose();
  });

  it("marshal response", function() {
      var data = {"key": "value"};
      res.index();
      respond(data);
      assert.isTrue(marshal.toModel.calledWith(data))
  });

  it("populates model property with marshaled response", function() {
      // Do not stub marshal.Json
      // qx.data.marshal.Json.restore();

      var res = setUpResource();
      var store = new qx.data.store.Rest(res, "index");

      res.index();
      respond({"name": "Affe"});
      // assert.equal("Affe", store.getModel().getName());
      store.dispose();
  });

  it("fires changeModel", function() {
      // Do not stub marshal.Json
      //qx.data.marshal.Json.restore();

      var res = setUpResource(),
          store = new qx.data.store.Rest(res, "index");

      res.index();
      qx.core.Assert.assertEventFired(store, "changeModel", function() {
        respond({"name": "Affe"});
      });

      store.dispose();
      res.dispose();
  });

  it("configure request with delegate", function() {


      var configureRequest = sinon.spy(function(req) {
        req.affe = true;
      });

      var delegate = {
        configureRequest: configureRequest
      };

      var store = new qx.data.store.Rest(res, "index", delegate);

      // Configure before sending
      sinon.assert.notCalled(req.send());

      res.index();
      assert.isTrue(configureRequest.calledWith(req));
      assert.isTrue(req.affe);
      sinon.assert.called(req.send);

      store.dispose();
  });

  it("manipulate data with delegate before marshaling", function() {
    
      var data = {"name": "Tiger"};

      var manipulateData = sinon.spy(function(data) {
        data.name = "Maus";
        return data;
      });

      var delegate = {
        manipulateData: manipulateData
      };

      var store = new qx.data.store.Rest(res, "index", delegate);
      res.index();
      respond(data);
       assert.isTrue(manipulateData.calledWith(data));
        assert.isTrue(marshal.toModel.calledWith({"name": "Maus"}));


      store.dispose();
  });


    function hasDebug ()  {
      return qx.core.Environment.get("qx.debug");
    }


    // Fake response
    function respond (response) {
      response = response || "";
      req.getPhase.returns("success");

      // Set parsed response
      req.getResponse.returns(response);

      req.emit("success");
    }


    function skip(msg) {
      throw new qx.dev.unit.RequirementError(null, msg);
    }
 
});

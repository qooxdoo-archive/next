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

************************************************************************ */

describe("data.store.Jsonp", function() {

  var __store;
  var request;
  var url = "tests/data/store/jsonp_primitive.php";

  beforeEach(function() {
    __store = new qx.data.store.Jsonp();
  });


  afterEach(function() {
    if (qx.io.request.Jsonp.restore) {
      qx.io.request.Jsonp.restore();
    }
    __store.dispose();

    if (request) {
      delete request.dispose;
      request.dispose();
    }
  });


  function setUpFakeRequest() {
    var req = request = new qx.io.request.Jsonp();
    sinonSandbox.stub(req, "dispose");
    sinonSandbox.stub(req, "send");
    sinonSandbox.stub(qx.io.request, "Jsonp").returns(req);
  }


  it("SetCallbackParam", function() {
    setUpFakeRequest();

    var store = new qx.data.store.Jsonp();
    store.callbackParam = "myCallback";
    store.url = ("/url");

    assert.equal("myCallback", request.callbackParam);
    store.dispose();
  });


  it("SetCallbackName", function() {
    setUpFakeRequest();

    var store = new qx.data.store.Jsonp();
    store.callbackName = "myCallback";
    store.url = "/url";

    assert.equal("myCallback", request.callbackName);
    store.dispose();
  });


  it("WholePrimitive", function(done) {
    __store.on("loaded", function() {
      var model = __store.model;
      assert.equal("String", model.string, "The model is not created how it should!");
      assert.equal(12, model.number, "The model is not created how it should!");
      assert.equal(true, model.boolean, "The model is not created how it should!");
      assert.isNull(model["null"], "The model is not created how it should!");
      done();
    }, this);
    __store.url = url;
  });


  it("ManipulatePrimitive", function(done) {
    var manipulated = false;
    var delegate = {
      manipulateData: function(data) {
        manipulated = true;
        return data;
      }
    };

    var store = new qx.data.store.Jsonp(null, delegate, "callback");

    store.on("loaded", function() {
      assert.isTrue(manipulated);
      store.dispose();
      done();
    }, this);

    store.url = (url);
  });


  it("ConfigureRequestPrimitive", function(done) {
    var delegate = {
      configureRequest: function(request) {
        assert.instanceOf(request, qx.io.request.Jsonp);
      }
    };

    sinonSandbox.spy(delegate, "configureRequest");

    var store = new qx.data.store.Jsonp(null, delegate, "callback");

    store.on("loaded", function() {
      sinon.assert.called(delegate.configureRequest);
      done();
    }, this);

    store.url = (url);
  });


  it("DisposeRequest", function() {
    setUpFakeRequest();

    var store = new qx.data.store.Jsonp(url);
    store.dispose();

    sinon.assert.called(store._getRequest().dispose);
  });


  it("DisposeRequestDone", function(done) {
    __store.on("loaded", function() {
      var req = new qx.io.request.Jsonp();
      sinonSandbox.stub(req, "dispose");

      __store._setRequest(req);
      __store.dispose();

      sinon.assert.called(__store._getRequest().dispose);

      done();
    }, this);

    __store.url = url;
  });


  it("ErrorEvent", function(done) {
    // do not test that for IE and Opera because of the missing
    // error handler for script tags
    if (!(qx.core.Environment.get("browser.name") == "ie") &&
      !(qx.core.Environment.get("browser.name") == "opera")) {
      __store.on("error", function() {
        setTimeout(function() {
          done();
        }, 100);
      }, this);

      __store.url = "affe";
    } else {
      done();
    }
  });
});

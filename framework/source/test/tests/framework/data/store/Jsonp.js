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

/* ************************************************************************


************************************************************************ */
/**
 * @ignore(qx.data.model)
 *
 * @asset(qx/test/*)
 */

describe("data.store.Jsonp", function(){
  // include : [qx.dev.unit.MRequirements,
  //            qx.dev.unit.MMock],

    var __store = null;

    beforeEach (function () {
  
      //require(["php"]);
      __store = new qx.data.store.Jsonp();

      url = qx.util.ResourceManager.getInstance().
        toUri("qx/test/jsonp_primitive.php");
    });


    afterEach (function () {
     
       sinon.sandbox.restore();
      __store.dispose();

      if (request) {

        // From prototype
        delete request.dispose;

        // Dispose
        request.dispose();
      }
    });


    var isLocal = function() {
      return window.location.protocol == "file:";
    };


    function setUpFakeRequest (){
    
      var req = request = new qx.io.request.Jsonp();
      req.send = req.dispose = function() {};
      sinon.stub(qx.io.request, "Jsonp").returns(sinon.stub(req));
    };
 
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
      store.url = ("/url");

      assert.equal("myCallback", request.callbackName);
      store.dispose();
  });
 
  it("WholePrimitive", function(done) {
      __store.on("loaded", function() {
        setTimeout(function() {
          var model = __store.model;
          assert.equal("String", model.string, "The model is not created how it should!");
          assert.equal(12, model.number, "The model is not created how it should!");
          assert.equal(true, model.boolean, "The model is not created how it should!");
          assert.isNull(model["null"], "The model is not created how it should!");
        }, 0);
      }, this);
      __store.url = (url);

  });
 
  it("ManipulatePrimitive", function(done) {
      var manipulated = false;
      var delegate = {manipulateData : function(data) {
        manipulated = true;
        return data;
      }};

      var store = new qx.data.store.Jsonp(null, delegate, "callback");

      store.on("loaded", function() {
        setTimeout(function() {
          assert.isTrue(manipulated);
          done();
        }, 0);
      }, this);

      store.url = (url);

      store.dispose();
  });
 
  it("ConfigureRequestPrimitive", function(done) {
      var delegate,

      delegate = {configureRequest : function(request) {
        assert.instanceOf(request, qx.io.request.Jsonp);
      }};

      sinon.spy(delegate, "configureRequest");

      var store = new qx.data.store.Jsonp(null, delegate, "callback");

      store.on("loaded", function() {
        setTimeout(function() {
          assertCalled(delegate.configureRequest);
          done();
        }, 0);
      }, this);
      
      store.url = (url);

  });
 
  it("DisposeRequest", function() {
      setUpFakeRequest();

      var store = new qx.data.store.Jsonp(url);
      store.dispose();

      assertCalled(request.dispose);
  });
 
  it("DisposeRequestDone", function(done) {
      setUpFakeRequest();
      
      __store.on("loaded", function() {
        setTimeout(function() {
          __store.dispose();
          assertCalled(request.dispose);
          done();
        }, 0);
      }, this);
      __store.url = (url);
  });
 
  it("ErrorEvent", function(done) {
      // do not test that for IE and Opera because of the missing
      // error handler for script tags
      if (
        !(qx.core.Environment.get("browser.name") == "ie") &&
        !(qx.core.Environment.get("browser.name") == "opera"))
        {
        __store.on("error", function() {
          setTimeout(function() {
            done();
          }, 0);
        }, this);

        __store.url = ("affe");
      }
  });
});
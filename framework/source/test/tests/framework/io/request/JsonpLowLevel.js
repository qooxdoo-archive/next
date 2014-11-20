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

/* ************************************************************************


************************************************************************ */

/* ************************************************************************


************************************************************************ */
/**
 *
 * @asset(../resource/qx/test/script.js)
 * @asset(../resource/qx/test/jsonp_primitive.php)
 *
 * @ignore(myExistingCallback)
 */

describe("io.request.JsonpLowLevel", function() {
  var req;
  var url;
  /*
  var res;
  var __reqs;
  var sandbox;
  */

  beforeEach(function() {
    // require(["php"]);

    req = new qx.io.request.Jsonp();
    url = "../resource/qx/test/jsonp_primitive.php";
  });


  afterEach(function() {
    window.SCRIPT_LOADED = undefined;
    sinon.sandbox.restore();
    req.callbackName = "";
    req.dispose();
  });

  //
  // Callback
  //

  it("callbackParam", function() {
    req.callbackParam = "myMethod";
    req.url = url;
    req.send();

    assert.match(req.getGeneratedUrl(), /(myMethod=)/);
  });


  it("callbackName", function() {
    req.callbackName = "myCallback";
    req.url = url;
    req.send();

    assert.match(req.getGeneratedUrl(), /(=myCallback)/);
    req.callbackName = "";
  });


  it("has default callback param and name", function() {
    var regExp;

    req.url = url;
    req.send();

    // String is URL encoded
    regExp = /\?callback=qx\.io\.request\.Jsonp.*\d{16,}.*\.callback/;
    assert.match(req.getGeneratedUrl(), regExp);
  });

  /**
   * @ignore(myExistingCallback)
   */


  it("not overwrite existing callback", function(done) {
    // User provided callback that must not be overwritten
    window.myExistingCallback = function() {
      return "Affe";
    };

    req.callbackName = "myExistingCallback";

    req.on("load", function() {
      setTimeout(function() {
        assert.equal("Affe", myExistingCallback());
        window.myExistingCallback = undefined;
        done();
      }, 100);
    });

    request();
  });

  //
  // Properties
  //

  it("response holds response with default callback", function(done) {
    req.on("load", function() {
      setTimeout(function() {
        var data = req.response;
        assert.isObject(data);
        assert.isTrue(data["boolean"]);
        done();
      }, 100);
    });

    request();
  });


  it("reset response when reopened", function(done) {
    req.on("load", function() {
      setTimeout(function() {
        req._open("GET", "/url");
        assert.isNull(req.response);
        done();
      }, 100);
    });

    request();
  });


  it("status indicates success when default callback called", function(done) {
    req.on("load", function() {
      setTimeout(function() {
        assert.equal(200, req.status);
        done();
      }, 100);
    });

    request();
  });

  it("status indicates success when custom callback called", function(done) {
    req.on("load", function() {
      setTimeout(function() {
        assert.equal(200, req.status);
        done();
      }, 100);
    });

    req.callbackName = "myOtherCallback";
    request();
  });

  // Error handling

  it("status indicates failure when default callback not called", function(done) {
    req.on("error", function() {
      setTimeout(function() {
        assert.equal(500, req.status);
        done();
      }, 100);
    });

    request("../resource/qx/test/script999.js");
  });


  it("status indicates failure when custom callback not called", function(done) {
    req.on("load", function() {
      setTimeout(function() {
        assert.equal(500, req.status);
        done();
      }, 100);
    });

    req.callbackName = "myCallback";
    request("../resource/qx/test/script.js");
  });


  it("status indicates failure when callback not called on second request", function(done) {
    var count = 0;

    req.on("load", function() {
      count += 1;

      if (count == 2) {
        setTimeout(function() {
          assert.equal(500, req.status);
          done();
        }, 100);
        return;
      }

      request("../resource/qx/test/script.js");
    });

    request();
  });

  //
  // Event handlers
  //



  it("call onload", function(done) {
    req.on("load", function() {
      setTimeout(function() { done(); }, 100);
    });

    request();
  });

  // Error handling



  it("call onerror on network error", function(done) {
    // For legacy IEs, timeout needs to be lower than browser timeout
    // or false "load" is fired. Alternatively, a false "load"
    // can be identified by checking status property.
    if (qx.core.Environment.get("engine.name") == "mshtml" &&
      qx.core.Environment.get("browser.documentmode") < 9) {
      req.timeout = 2000;
    }

    req.on("error", function() {
      setTimeout(function() { done(); }, 500);
    });

    request("http://fail.tld");
  });


  it("call onloadend on network error", function(done) {
    req.on("loadend", function() {
      setTimeout(function() { done(); }, 500);
    });

    request("http://fail.tld");
  });

  function request(customUrl) {
    req.url = customUrl || url;
    req.send();
  }

  function skip(msg) {
    throw new qx.dev.unit.RequirementError(null, msg);
  }


});

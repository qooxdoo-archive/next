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
 * @asset(qx/test/script.js)
 * @asset(qx/test/jsonp_primitive.php)
 *
 * @ignore(myExistingCallback)
 */

describe("bom.request.Jsonp", function() {

  var req;
  var url;

  beforeEach(function() {
    //require(["php"]);
    sinon.sandbox.create();
    req = new qx.bom.request.Jsonp();
    url = "../resource/qx/test/jsonp_primitive.php";
  });


  afterEach(function() {
    window.SCRIPT_LOADED = undefined;
    sinon.sandbox.restore();
    req.dispose();
  });

  //
  // Callback
  //

  it("setCallbackParam()", function() {
    req.setCallbackParam("myMethod");
    req.open("GET", url);
    req.send();

    assert.match(req._getUrl(), /(myMethod=)/);
  });


  it("setCallbackName()", function() {
    req.setCallbackName("myCallback");
    req.open("GET", url);
    req.send();

    assert.match(req._getUrl(), /(=myCallback)/);
  });


  it("has default callback param and name", function() {
    var regExp;
    req.open("GET", url);
    req.send();

    // String is URL encoded
    regExp = /\?callback=qx\.bom\.request\.Jsonp.*\d{16,}.*\.callback/;
    assert.match(req._getUrl(), regExp);
  });

  /**
   * @ignore(myExistingCallback)
   */

  it("not overwrite existing callback", function(done) {
    // User provided callback that must not be overwritten
    window.myExistingCallback = function() {
      return "Affe";
    };

    req.setCallbackName("myExistingCallback");

    req.onload = function() {
      assert.equal("Affe", myExistingCallback());
      window.myExistingCallback = undefined;
      done();
    };
    setTimeout(function() {
      request();
    }, 0);
  });

  //
  // Properties
  //
  it("responseJson holds response with default callback", function(done) {
    req.onload = function() {
      var data = req.responseJson;
      assert.isObject(data);
      assert.isTrue(data["boolean"]);
      done();

    };

    setTimeout(function() {
      request();
    }, 10);
  });


  it("reset responseJson when reopened", function(done) {
    req.onload = function() {
      req.open("GET", "/url");
      assert.isNull(req.responseJson);
      done();
    };

    setTimeout(function() {
      request();
    }, 10);

  });


  it("status indicates success when default callback called", function(done) {
    req.onload = function() {
      assert.equal(200, req.status);
      done();
    };
    setTimeout(function() {
      request();
    }, 100);
  });


  it("status indicates success when custom callback called", function(done) {
    req.onload = function() {
      assert.equal(200, req.status);
      done();
    };

    req.setCallbackName("myCallback");
    setTimeout(function() {
      request();
    }, 100);

  });

  // Error handling
  it("status indicates failure when default callback not called", function(done) {
    req.onload = function() {
      assert.equal(500, req.status);
      done();
    };

    setTimeout(function() {
      request("../resource/qx/test/script.js");
    }, 100);
  });


  it("status indicates failure when custom callback not called", function(done) {
    req.onload = function() {
      assert.equal(500, req.status);
      done();
    };

    req.setCallbackName("myCallback");
    setTimeout(function() {
      request("../resource/qx/test/script.js");
    }, 100);

  });


  it("status indicates failure when callback not called on second request", function(done) {
    var count = 0;
    req.onload = function() {
      count += 1;

      if (count == 2) {
        assert.equal(500, req.status);
        done();
        return;
      }
    };
    setTimeout(function() {
      request("../resource/qx/test/script.js");
    }, 100);
    setTimeout(function() {
      request();
    }, 100);

  });

  //
  // Event handlers
  //
  it("call onload", function(done) {

    req.onload = function() {
      done();
    };
    setTimeout(function() {
      request();
    }, 0);
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

    req.onerror = function() {
      done();
    };

    setTimeout(function() {
      request("http://fail.tld");
    }, 100);
  });


  it("call onloadend on network error", function(done) {
    req.onloadend = function() {
      done();
    };
    setTimeout(function() {
      request("http://fail.tld");
    }, 100);
  });


  function request(customUrl) {
    req.open("GET", customUrl || url);
    req.send();
  }


  function skip(msg) {
    throw new qx.dev.unit.RequirementError(null, msg);
  }

});

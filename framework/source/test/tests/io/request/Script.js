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

/**
 *
 * @asset(qx/test/jsonp_primitive.php)
 * @asset(qx/test/script.js)
 * @asset(qx/test/xmlhttp/sample.txt)
 * @ignore(SCRIPT_LOADED)
 */
describe("io.request.Script", function() {

  var req;
  var url;

  beforeEach(function() {
    req = new qx.io.request.Script();
    url = "../resource/qx/test/script.js";
  });


  afterEach(function() {
    req.dispose();
  });

  //
  // General
  //

  it("create instance", function() {
    assert.isObject(req);
  });


  it("dispose() removes script from DOM", function() {
    var script;

    req.open();
    req.send();
    script = req._getScriptElement();
    req.dispose();

    assert.isFalse(isInDom(script));
  });


  it("isDisposed()", function() {
    assert.isFalse(req.isDisposed());
    req.dispose();
    assert.isTrue(req.isDisposed());
  });


  it("allow many requests with same object", function(done) {
    var count = 0;

    req.on("load", function() {
      count += 1;
      if (count == 6) {
        done();
        return;
      }
      request();
    });

    request();
  });

  //
  // Event helper
  //

  it("fire event", function() {
    var event = sinonSandbox.spy();
    req.on("event", event);
    req.emit("event");
    sinon.assert.called(event);
  });

  //
  // Properties
  //

  it("properties indicate success when request completed", function(done) {
    req.on("load", function() {
      assert.equal(4, req.readyState);
      assert.equal(200, req.status);
      assert.equal("200", req.statusText);
      done();
    });

    request();
  });

  /**
   * @ignore(SCRIPT_LOADED)
   */

  it("status indicates success when determineSuccess returns true", function(done) {
    req.on("load", function() {
      assert.equal(200, req.status);
      done();
    });

    req.setDetermineSuccess(function() {
      return SCRIPT_LOADED === true;
    });

    request("../resource/qx/test/script.js");
  });

  // Error handling

  it("properties indicate failure when request failed", function(done) {
    this.timeout(7000);
    req.on("error", function() {
      assert.equal(4, req.readyState);
      assert.equal(0, req.status);
      assert.isNull(req.statusText);
      done();
    });

    request("http://fail.tld");
  });


  it("properties indicate failure when request timed out", function(done) {
    this.timeout(7000);
    // Known to fail in legacy IEs
    if (isIeBelow(9)) {
      this.test.skip = true;
      done();
    }

    req.timeout = 25;
    req.on("timeout", function() {
      assert.equal(4, req.readyState);
      assert.equal(0, req.status);
      assert.isNull(req.statusText);
      done();
    });

    requestPending();
  });


  it("status indicates failure when determineSuccess returns false", function(done) {
    req.on("load", function() {
      assert.equal(500, req.status);
      done();
    });

    req.setDetermineSuccess(function() {
      return false;
    });

    request();
  });


  it("reset XHR properties when reopened", function(done) {
    req.on("load", function() {
      req.open("GET", "/url");
      assert.strictEqual(1, req.readyState);
      assert.strictEqual(0, req.status);
      assert.strictEqual("", req.statusText);
      done();
    });

    request();
  });

  //
  // open()
  //

  it("open() stores URL", function() {
    req.open("GET", url);
    assert.equal(url, req._getUrl());
  });

  //
  // send()
  //

  it("send() adds script element to DOM", function() {
    // Helper triggers send()
    request();

    assert(isInDom(req._getScriptElement()), "Script element not in DOM");
  });


  it("send() sets script src to URL", function() {
    request();
    assert.match(req._getScriptElement().src, /qx\/test\/script.js$/);
  });


  //
  // abort()
  //

  it("abort() removes script element", function() {
    requestPending();
    req.abort();

    assert.isFalse(isInDom(req._getScriptElement()), "Script element in DOM");
  });


  it("abort() makes request not fire load", function(done) {
    var globalStack = [];

    // test preparation
    var emitOrig = req.emit;
    sinonSandbox.stub(req, "emit", function(evt) {
      globalStack.push(evt);
      emitOrig.call(this, evt);
    });

    if (isIe()) {
      request(noCache(url));
    } else {
      request();
    }

    req.abort();

    setTimeout(function() {
      assert.isTrue(globalStack.indexOf("onload") === -1);
      done();
    }, 100);
  });

  //
  // setRequestHeader()
  //

  it("setRequestHeader() throws error when other than OPENED", function() {
    assert.throw(function() {
      req.setRequestHeader();
    }, null, "Invalid state");
  });


  it("setRequestHeader() appends to URL", function() {
    req.open("GET", "/affe");
    req.setRequestHeader("key1", "value1");
    req.setRequestHeader("key2", "value2");

    assert.match(req._getUrl(), /key1=value1/);
    assert.match(req._getUrl(), /key2=value2/);
  });

  //
  // Event handlers
  //

  it("call onload", function(done) {
    // More precisely, the request completes when the browser
    // has loaded and parsed the script
    req.on("load", function() {
      done();
    });

    request();
  });


  it("call onreadystatechange and have appropriate readyState", function(done) {
    var readyStates = [];

    req.on("readystatechange", function() {
      readyStates.push(req.readyState);

      if (req.readyState === 4) {
        assert.deepEqual([1, 2, 3, 4], readyStates);
        done();
      }
    });

    if (isIe()) {
      request(noCache(url));
    } else {
      request();
    }
  });

  // Error handling

  it("call onloadend on network error", function(done) {
    this.timeout(7000);
    req.on("loadend", function() {
      done();
    });

    request("http://fail.tld");
  });


  it("call onloadend when request completes", function(done) {
    req.on("loadend", function() {
      done();
    });

    request();
  });


  it("not call onload when loading failed because of network error", function(done) {
    this.timeout(7000);
    // After a short delay, readyState progresses to "loaded" even
    // though the resource could not be loaded.
    req.on("load", function() {
      throw Error("Called onload");
    });

    req.on("error", function() {
      done();
    });

    request("http://fail.tld");
  });


  it("call onerror on network error", function(done) {
    this.timeout(7000);
    req.on("error", function() {
      done();
    });

    request("http://fail.tld");
  });


  it("not call onerror when request exceeds timeout limit", function(done) {
    var globalStack = [];

    // test preparation
    var emitOrig = req.emit;
    sinonSandbox.stub(req, "emit", function(evt) {
      globalStack.push(evt);
      emitOrig.call(this, evt);
    });

    // Known to fail in browsers not supporting the error event
    // because timeouts are used to fake the "error"
    if (!supportsErrorHandler()) {
      this.test.skip = true;
      done();
    }

    req.timeout = 25;
    requestPending();

    setTimeout(function() {
      assert.isTrue(globalStack.indexOf("onload") === -1);
      done();
    }, 20);
  });


  it("call ontimeout when request exceeds timeout limit", function(done) {
    req.timeout = 25;
    req.on("timeout", function() {
      done();
    });

    requestPending();
  });


  it("not call ontimeout when request is within timeout limit", function(done) {
    var spy = sinonSandbox.spy(req, "_onTimeout");

    req.on("load", function() {
      sinon.assert.notCalled(spy);
      done();
    });

    req.timeout = 100;
    request();
  });


  it("call onabort when request was aborted", function() {
    sinonSandbox.spy(req, "emit");
    request();
    req.abort();

    sinon.assert.calledWith(req.emit, "abort");
  });

  //
  // Clean-Up
  //

  it("remove script from DOM when request completed", function(done) {
    var script;

    req.on("load", function() {
      script = req._getScriptElement();
      assert.isFalse(isInDom(script));
      done();
    });

    request();
  });


  it("remove script from DOM when request failed", function(done) {
    this.timeout(7000);
    var script;

    req.on("error", function() {
      script = req._getScriptElement();
      assert.isFalse(isInDom(script));
      done();
    });

    request("http://fail.tld");
  });


  it("remove script from DOM when request timed out", function(done) {
    var script;

    req.timeout = 25;
    req.on("timeout", function() {
      script = req._getScriptElement();
      assert.isFalse(isInDom(script));
      done();
    });

    requestPending();
  });


  function request(customUrl) {
    req.open("GET", customUrl || url, true);
    req.send();
  }


  function requestPending(sleep) {
    // TODO: Maybe use FakeServer instead
    var url = noCache("../resource/qx/test/jsonp_primitive.php");

    // In legacy browser, a long running script request blocks subsequent requests
    // even if the script element is removed. Keep duration very low to work around.
    //
    // Sleep 50ms
    url += "&sleep=" + (sleep || 50);
    request(url);
  }


  function isInDom(elem) {
    return elem.parentNode ? true : false;
  }


  function isIe(version) {
    return (qx.core.Environment.get("engine.name") === "mshtml");
  }


  function isIeBelow(version) {
    return qx.core.Environment.get("engine.name") === "mshtml" &&
      qx.core.Environment.get("browser.documentmode") < version;
  }


  function supportsErrorHandler() {
    var isLegacyIe = qx.core.Environment.get("engine.name") === "mshtml" &&
      qx.core.Environment.get("browser.documentmode") < 9;

    return !(isLegacyIe);
  }


  function noCache(url) {
    return url + "?nocache=" + (new Date()).valueOf();
  }
});

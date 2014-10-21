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

describe("bom.request.Xhr", function() {

  var UNSENT = 0;
  var OPENED = 1;
  var HEADERS_RECEIVED = 2;
  var LOADING = 3;
  var DONE = 4;

  /**
   * The faked XMLHttpRequest.
   */
  var fakedXhr = null;

  /**
   * Holds instances created by the faked XMLHttpRequest.
   */
  var fakeReqs = null;

  /**
   * The request to test.
   */
  var req = null;

  beforeEach(function() {
    sinon.sandbox.create();
    fakeNativeXhr();
    req = new qx.bom.request.Xhr();
  });


  afterEach(function() {
    req = null;
    sinon.sandbox.restore();
  });

  //
  // General
  //
  it("create instance", function() {
    assert.isObject(req);
  });


  it("detect native XHR", function() {
    var nativeXhr = req.getRequest();

    assert.isObject(nativeXhr);
    assert.isNotNull(nativeXhr.readyState);
  });

  //
  // open()
  //

  it("open request", function() {
    var fakeReq = getFakeReq();
    sinon.spy(fakeReq, "open");

    var url = "/foo";
    var method = "GET";
    req.open(method, url);

    sinon.assert.calledWith(fakeReq.open, method, url);
  });


  it("open request throws when missing arguments", function() {

    var msg = /Not enough arguments/;
    assert.throw(function() {
      req.open();
    }, Error, msg);
    assert.throw(function() {
      req.open("GET");
    }, Error, msg);
  });


  it("open async request on default", function() {
    var fakeReq = getFakeReq();
    sinon.spy(fakeReq, "open");

    req.open(null, null);
    assert.isTrue(fakeReq.open.args[0][2], "async must be true");
  });


  it("open sync request", function() {
    var fakeReq = getFakeReq();
    sinon.spy(fakeReq, "open");

    req.open(null, null, false);
    assert.isFalse(fakeReq.open.args[0][2], "async must be false");
  });


  it("open request with username and password", function() {
    var fakeReq = getFakeReq();
    sinon.spy(fakeReq, "open");

    req.open(null, null, null, "affe", "geheim");
    assert.equal("affe", fakeReq.open.args[0][3], "Unexpected user");
    assert.equal("geheim", fakeReq.open.args[0][4], "Unexpected password");
  });

  //
  // setRequestHeader()
  //

  it("set request header", function() {
    var fakeReq = getFakeReq();
    sinon.spy(fakeReq, "setRequestHeader");

    // Request must be opened before request headers can be set
    req.open("GET", "/");

    req.setRequestHeader("header", "value");
    sinon.assert.calledWith(fakeReq.setRequestHeader, "header", "value");
  });

  //
  // send()
  //

  it("send() with data", function() {
    var fakeReq = getFakeReq();
    sinon.spy(fakeReq, "send");

    var data = "AFFE";
    req.open("GET", "/affe");
    req.send(data);

    sinon.assert.calledWith(fakeReq.send, data);
  });

  // BUGFIXES

  it("send() without data", function() {
    var fakeReq = getFakeReq();
    sinon.spy(fakeReq, "send");

    req.open("GET", "/affe");
    req.send();

    sinon.assert.calledWith(fakeReq.send, null);
  });

  //
  // abort()
  //

  it("abort() aborts native Xhr", function() {
    var fakeReq = getFakeReq();
    sinon.spy(fakeReq, "abort");

    req.abort();
    sinon.assert.called(fakeReq.abort);
  });


  it("abort() resets readyState", function() {
    req.open("GET", "/");
    req.abort();

    assert.equal(UNSENT, req.readyState, "Must be UNSENT");
  });

  //
  // Event helper
  //

  it("call event handler", function() {
    req.onevent = sinon.spy();
    req._emit("event");
    sinon.assert.called(req.onevent);
  });


  it("fire event", function() {
    var event = sinon.spy();
    req.onevent = sinon.spy();
    req.on("event", event);
    req._emit("event");
    sinon.assert.called(event);
  });

  //
  //
  // onreadystatechange()
  //

  it("responseText set before onreadystatechange is called", function() {
    var fakeReq = getFakeReq();

    req.onreadystatechange = function() {
      assert.equal("Affe", req.responseText);
    };
    fakeReq.responseText = "Affe";
    fakeReq.readyState = 4;
    fakeReq.responseHeaders = {};
    fakeReq.onreadystatechange();
  });


  it("emit readystatechange when reopened", function() {

    var fakeReq = getFakeReq();
    sinon.stub(req, "_emit");

    // Send and respond
    req.open("GET", "/");
    req.send();
    fakeReq.respond();

    // Reopen
    req.open("GET", "/");

    sinon.assert.calledWith(req._emit, "readystatechange");
  });

  // BUGFIXES

  it("ignore onreadystatechange when readyState is unchanged", function() {
    var fakeReq = getFakeReq();
    sinon.spy(req, "onreadystatechange");

    req.readyState = OPENED;
    fakeReq.onreadystatechange();
    fakeReq.onreadystatechange();

    sinon.assert.calledOnce(req.onreadystatechange);
  });


  it("native onreadystatechange is disposed once DONE", function() {

    var fakeReq = getFakeReq();

    req.onreadystatechange = function() {
      return "OP";
    };
    req.open("GET", "/");
    req.send();

    fakeReq.respond();
    assert.isUndefined(req.getRequest().onreadystatechange());
  });

  //
  // onload()
  //

  it("emit load on successful request", function() {

    var fakeReq = getFakeReq();

    sinon.stub(req._emitter, "emit");
    req.open("GET", "/");
    req.send();

    // Status does not matter. Set a non-empty response for file:// workaround.
    fakeReq.respond(200, {}, "RESPONSE");

    sinon.assert.calledWith(req._emitter.emit, "load");
    assert.equal(6, req._emitter.emit.callCount);
  });

  //
  // onerror()
  //
  // See XhrWithBackend
  //

  //
  // onabort()
  //

  it("emit abort", function() {
    sinon.spy(req, "_emit");
    req.open("GET", "/");
    req.send();
    req.abort();

    sinon.assert.calledWith(req._emit, "abort");
  });


  it("emit abort before loadend", function() {
    var emit = sinon.stub(req, "_emit");
    var abort = emit.withArgs("abort");
    var loadend = emit.withArgs("loadend");

    req.open("GET", "/");
    req.send();
    req.abort();

    sinon.assert.callOrder(abort, loadend);
  });

  //
  // ontimeout()
  //

  it("emit timeout", function() {
    var timeout = sinon.stub(req, "_emit").withArgs("timeout");

    req.timeout = 10;
    req.open("GET", "/");
    req.send();

    setTimeout(function() {
      sinon.assert.calledOnce(timeout);
    }, 20);
  });


  it("not emit error when timeout", function(done) {

    var error = sinon.stub(req, "_emit").withArgs("error");

    req.timeout = 10;
    req.open("GET", "/");
    req.send();

    setTimeout(function() {
      sinon.assert.notCalled(error);
      done();
    }, 20);
  });


  it("not emit error when aborted immediately", function() {


    var error = sinon.stub(req, "_emit").withArgs("error");

    req.open("GET", "/");
    req.send();
    req.abort();

    sinon.assert.notCalled(error);
  });


  it("cancel timeout when DONE", function(done) {
    var fakeReq = getFakeReq();
    sinon.spy(req, "ontimeout");

    req.timeout = 10;
    req.open("GET", "/");
    req.send();
    fakeReq.respond();

    setTimeout(function() {
      sinon.assert.notCalled(req.ontimeout);
      done();
    }, 20);
  });


  it("cancel timeout when handler throws", function(done) {
    var fakeReq = getFakeReq();
    sinon.spy(req, "ontimeout");

    req.timeout = 10;
    req.open("GET", "/");
    req.send();

    // Simulate error in handler for readyState DONE
    req.onreadystatechange = function() {
      if (req.readyState === 4) {
        // Throw only once
        req.onreadystatechange = function() {};
        throw new Error();
      }
    };

    try {
      fakeReq.respond();
    } catch (e) {

    } finally {
      setTimeout(function() {
        sinon.assert.notCalled(req.ontimeout);
        done();
      }, 20);
    }
  });

  //
  // onloadend()
  //

  it("fire loadend when request complete", function() {

    var fakeReq = getFakeReq();

    var loadend = sinon.stub(req, "_emit").withArgs("loadend");
    req.open("GET", "/");
    req.send();

    // Status does not matter
    fakeReq.respond();

    sinon.assert.called(loadend);
  });

  //
  // Events
  //


  //
  // readyState
  //

  it("set readyState appropriate to native readyState", function() {

    var fakeReq = getFakeReq();

    // Created
    assert.equal(UNSENT, req.readyState);

    // Open
    req.open("GET", "/affe");
    assert.equal(OPENED, req.readyState);

    // Send (and receive)
    req.send();
    fakeReq.respond(DONE);
    assert.equal(DONE, req.readyState);
  });

  //
  // responseText
  //

  it("responseText is empty string when OPEN", function() {
    req.open("GET", "/affe");
    assert.strictEqual("", req.responseText);
  });


  it("responseText is empty string when reopened", function() {
    var fakeReq = getFakeReq();

    // Send and respond

    req.open("GET", "/");
    req.send();
    fakeReq.respond(200, {
      "Content-Type": "text/html"
    }, "Affe");

    // Reopen
    req.open("GET", "/elefant");
    assert.strictEqual("", req.responseText);
  });


  it("responseText is set when DONE", function() {

    var fakeReq = getFakeReq();

    req.open("GET", "/");
    req.send();
    fakeReq.respond(200, {
      "Content-Type": "text/html"
    }, "Affe");

    assert.equal("Affe", req.responseText);
  });

  // BUGFIXES

  it("query responseText when available", function() {

    var fakeReq = getFakeReq();

    function success(state) {

      // sinon.Stub and prepare success
      fakeReq.readyState = state;
      fakeReq.responseText = "YIPPIE";
      fakeReq.responseHeaders = {};

      // Trigger readystatechange handler
      fakeReq.onreadystatechange();

      assert.equal("YIPPIE", req.responseText,
        "When readyState is " + state);
    }

    success(DONE);

    // Assert responseText to be set when in progress
    // in browsers other than IE < 9
    if (!isIEBelow(9)) {
      success(HEADERS_RECEIVED);
      success(LOADING);
    }

  });


  it("not query responseText if unavailable", function() {

    var fakeReq = getFakeReq();

    function trap(state) {

      // sinon.Stub and set trap
      fakeReq.readyState = state;
      fakeReq.responseText = "BOGUS";

      // Trigger readystatechange handler
      fakeReq.onreadystatechange();

      assert.notEqual("BOGUS", req.responseText,
        "When readyState is " + state);
    }

    if (isIEBelow(9)) {
      trap(UNSENT);
      trap(OPENED);
      trap(HEADERS_RECEIVED);
      trap(LOADING);
    }

  });

  //
  // responseXML
  //

  it("responseXML is null when not DONE", function() {
    assert.isNull(req.responseXML);
  });


  it("responseXML is null when reopened", function() {
    var fakeReq = getFakeReq();

    // Send and respond

    req.open("GET", "/");
    req.send();
    fakeReq.respond(200, {
      "Content-Type": "application/xml"
    }, "<affe></affe>");

    // Reopen
    req.open("GET", "/");
    assert.isNull(req.responseXML);
  });


  it("responseXML is parsed document with XML response", function() {

    var fakeReq = getFakeReq();

    req.open("GET", "/");
    req.send();

    var headers = {
      "Content-Type": "application/xml"
    };
    var body = "<animals><monkey/><mouse/></animals>";
    fakeReq.respond(200, headers, body);

    assert.isObject(req.responseXML);
  });

  //
  // status and statusText
  //

  it("http status is 0 when UNSENT", function() {
    assert.strictEqual(0, req.status);
  });


  it("http status is 0 when OPENED", function() {

    req.open("GET", "/");

    assert.strictEqual(0, req.status);
  });


  it("http status is 0 when aborted immediately", function() {
    // require(["http"]);


    req.open("GET", "/");
    req.send();
    req.abort();

    assert.strictEqual(0, req.status);
  });


  it("http status when DONE", function() {

    var fakeReq = getFakeReq();
    req.open("GET", "/");
    fakeReq.respond(200);

    assert.strictEqual(200, req.status);
  });


  it("statusText is empty string when UNSENT", function() {
    assert.strictEqual("", req.statusText);
  });


  it("statusText is set when DONE", function() {
    var fakeReq = getFakeReq();

    req.open("GET", "/");
    fakeReq.respond(200);

    assert.strictEqual("OK", req.statusText);
  });


  it("status is set when LOADING", function() {
    var fakeReq = getFakeReq();

    req.open("GET", "/");
    fakeReq.readyState = LOADING;
    fakeReq.status = 200;
    fakeReq.responseHeaders = {};
    fakeReq.onreadystatechange();

    assert.strictEqual(200, req.status);
  });


  it("reset status when reopened", function() {
    var fakeReq = getFakeReq();

    req.open("GET", "/");
    fakeReq.respond(200);
    req.open("GET", "/");

    assert.strictEqual(0, req.status);
    assert.strictEqual("", req.statusText);
  });

  // BUGFIXES

  it("normalize status 1223 to 204", function() {
    var fakeReq = getFakeReq();

    req.open("GET", "/");
    req.send();
    fakeReq.respond(1223);

    assert.strictEqual(204, req.status);
  });


  it("normalize status 0 to 200 when DONE and file protocol", function() {
    var fakeReq = getFakeReq();

    req.open("GET", "/");
    req.send();

    sinon.stub(req, "_getProtocol").returns("file:");
    fakeReq.respond(0, {}, "Response");

    assert.equal(200, req.status);
  });


  it("keep status 0 when not yet DONE and file protocol", function() {
    var fakeReq = getFakeReq();

    sinon.stub(req, "_getProtocol").returns("file:");
    req.open("GET", "/");

    fakeReq.readyState = 3;
    fakeReq.onreadystatechange();

    assert.equal(0, req.status);
  });


  it("keep status 0 when DONE with network error and file protocol", function() {
    var fakeReq = getFakeReq();

    req.open("GET", "/");
    req.send();

    sinon.stub(req, "_getProtocol").returns("file:");

    // Indicate network error
    fakeReq.readyState = 4;
    fakeReq.responseText = "";
    fakeReq.onreadystatechange();

    assert.equal(0, req.status);
  });

  //
  // _getProtocol()
  //

  it("read protocol from requested URL when it contains protocol", function() {

    req.open("GET", "http://example.org/index.html");

    assert.equal("http:", req._getProtocol());
  });


  it("read protocol from window if requested URL is without protocol", function() {
    //require(["http"]);


    req.open("GET", "index.html");

    assert.match(req._getProtocol(), (/https?:/));
  });

  //
  // getResponseHeader()
  //

  it("getResponseHeader()", function() {
    var fakeReq = getFakeReq();
    fakeReq.open();
    fakeReq.setResponseHeaders({
      "key": "value"
    });

    var responseHeader = req.getResponseHeader("key");
    assert.equal("value", responseHeader);
  });

  //
  // getAllResponseHeaders()
  //

  it("getAllResponseHeaders()", function() {
    var fakeReq = getFakeReq();
    fakeReq.open();
    fakeReq.setResponseHeaders({
      "key1": "value1",
      "key2": "value2"
    });

    var responseHeaders = req.getAllResponseHeaders();
    assert.match(responseHeaders, /key1: value1/);
    assert.match(responseHeaders, /key2: value2/);
  });

  //
  // dispose()
  //

  it("dispose() deletes native Xhr", function() {
    req.dispose();

    assert.isNull(req.getRequest());
  });


  it("dispose() aborts", function() {


    sinon.spy(req, "abort");
    req.dispose();

    sinon.assert.called(req.abort);
  });


  it("isDisposed()", function() {
    assert.isFalse(req.isDisposed());
    req.dispose();
    assert.isTrue(req.isDisposed());
  });


  it("invoking public method throws when disposed", function() {

    var assertDisposedException = qx.lang.Function.bind(function(callback) {
      assert.throw(qx.lang.Function.bind(callback, this),
        Error, /Already disposed/);
    }, this);

    req.dispose();
    assertDisposedException(function() {
      req.open("GET", "/");
    });
    assertDisposedException(function() {
      req.setRequestHeader();
    });
    assertDisposedException(function() {
      req.send();
    });
    assertDisposedException(function() {
      req.abort();
    });
    assertDisposedException(function() {
      req.getResponseHeader();
    });
    assertDisposedException(function() {
      req.getAllResponseHeaders();
    });
  });

  function fakeNativeXhr() {
    fakedXhr = sinon.sandbox.useFakeXMLHttpRequest();

    // Reset pre-existing request so that it uses the faked XHR
    if (req) {
      req = new qx.bom.request.Xhr();
    }
  }


  function getFakeReq() {
    return fakedXhr.requests.slice(-1)[0];
  }


  function isIEBelow(targetVersion) {
    var name = qx.core.Environment.get("engine.name");
    var version = qx.core.Environment.get("engine.version");

    return name == "mshtml" && version < targetVersion;
  }


  function isFFBelow(targetVersion) {
    var name = qx.core.Environment.get("engine.name");
    var version = qx.core.Environment.get("browser.version");

    return name == "gecko" && parseFloat(version) < targetVersion;
  }


  function hasIEBelow9() {
    return isIEBelow(9);
  }


  function skip(msg) {
    throw new qx.dev.unit.RequirementError(null, msg);
  }
});

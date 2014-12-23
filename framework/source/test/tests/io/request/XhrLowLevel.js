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

describe("io.request.XhrLowLevel", function() {

  var statics = {
    UNSENT: 0,
    OPENED: 1,
    HEADERS_RECEIVED: 2,
    LOADING: 3,
    DONE: 4
  };

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
    fakeNativeXhr();
    req = new qx.io.request.Xhr();
  });

  afterEach(function() {
    req = null;

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
    sinonSandbox.spy(fakeReq, "open");

    var url = "/foo";
    var method = "GET";
    req._open(method, url);

    sinon.assert.calledWith(fakeReq.open, method, url);
  });


  it("open request throws when missing arguments", function() {
    var msg = /Not enough arguments/;
    assert.throw(function() {
      req._open();
    }, Error, msg);
    assert.throw(function() {
      req._open("GET");
    }, Error, msg);
  });


  it("open async request on default", function() {
    var fakeReq = getFakeReq();
    sinonSandbox.spy(fakeReq, "open");

    req._open(null, null);
    assert.isTrue(fakeReq.open.args[0][2], "async must be true");
  });


  it("open sync request", function() {
    var fakeReq = getFakeReq();
    sinonSandbox.spy(fakeReq, "open");

    req._open(null, null, false);
    assert.isFalse(fakeReq.open.args[0][2], "async must be false");
  });


  it("open request with username and password", function() {
    var fakeReq = getFakeReq();
    sinonSandbox.spy(fakeReq, "open");

    req._open(null, null, null, "affe", "geheim");
    assert.equal("affe", fakeReq.open.args[0][3], "Unexpected user");
    assert.equal("geheim", fakeReq.open.args[0][4], "Unexpected password");
  });

  //
  // setRequestHeader()
  //

  it("set request header", function() {
    var fakeReq = getFakeReq();
    sinonSandbox.spy(fakeReq, "setRequestHeader");

    // Request must be opened before request headers can be set
    req._open("GET", "/");

    req._setRequestHeader("header", "value");
    sinon.assert.calledWith(fakeReq.setRequestHeader, "header", "value");
  });

  //
  // send()
  //

  it("send() with data", function() {
    var fakeReq = getFakeReq();
    sinonSandbox.spy(fakeReq, "send");

    var data = "AFFE";
    req._open("GET", "/affe");
    req._send(data);

    sinon.assert.calledWith(fakeReq.send, data);
  });

  // BUGFIXES

  it("send() without data", function() {
    var fakeReq = getFakeReq();
    sinonSandbox.spy(fakeReq, "send");

    openAndSend("GET", "/affe");

    sinon.assert.calledWith(fakeReq.send, null);
  });

  //
  // abort()
  //

  it("abort() aborts native Xhr", function() {
    var fakeReq = getFakeReq();
    sinonSandbox.spy(fakeReq, "abort");

    req._abort();
    sinon.assert.called(fakeReq.abort);
  });


  it("abort() resets readyState", function() {
    req._open("GET", "/");
    req.abort();

    assert.equal(statics.UNSENT, req.readyState, "Must be UNSENT");
  });

  //
  // Event helper
  //

  it("fire event", function() {
    var event = sinonSandbox.spy();
    req.onevent = sinonSandbox.spy();
    req.on("event", event);
    req.emit("event");
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
    sinonSandbox.stub(req, "emit");

    // Send and respond
    openAndSend("GET", "/");
    fakeReq.respond();

    // Reopen
    req._open("GET", "/");

    sinon.assert.calledWith(req.emit, "readystatechange");
  });

  // BUGFIXES

  it("ignore onreadystatechange when readyState is unchanged", function() {
    var fakeReq = getFakeReq();
    var globalStack = [];

    sinonSandbox.stub(req, "emit", function(evt) {
      globalStack.push(evt);
    });

    req.readyState = statics.OPENED;
    fakeReq.onreadystatechange();
    fakeReq.onreadystatechange();

    var expected = ["readystatechange"];
    assert.deepEqual(expected, globalStack);
  });


  it("native onreadystatechange is disposed once DONE", function() {
    var fakeReq = getFakeReq();

    req.onreadystatechange = function() {
      return "OP";
    };
    openAndSend("GET", "/");

    fakeReq.respond();
    assert.isUndefined(req.getRequest().onreadystatechange());
  });

  //
  // onload()
  //

  it("emit load on successful request", function() {
    var fakeReq = getFakeReq();

    sinonSandbox.stub(req, "emit");
    openAndSend("GET", "/");

    // Status does not matter. Set a non-empty response for file:// workaround.
    fakeReq.respond(200, {}, "RESPONSE");

    sinon.assert.calledWith(req.emit, "load");
    assert.equal(6, req.emit.callCount);
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
    sinonSandbox.spy(req, "emit");

    openAndSend("GET", "/");
    req._abort();

    sinon.assert.calledWith(req.emit, "abort");
  });


  it("emit abort before loadend", function() {
    var emit = sinonSandbox.stub(req, "emit");
    var abort = emit.withArgs("abort");
    var loadend = emit.withArgs("loadend");

    openAndSend("GET", "/");
    req._abort();

    sinon.assert.callOrder(abort, loadend);
  });

  //
  // ontimeout()
  //

  it("emit timeout", function(done) {
    var timeout = sinonSandbox.stub(req, "emit").withArgs("timeout");

    req.timeout = 10;
    openAndSend("GET", "/");

    setTimeout(function() {
      sinon.assert.calledOnce(timeout);
      done();
    },20);
  });


  it("not emit error when timeout", function(done) {
    var error = sinonSandbox.stub(req, "emit").withArgs("error");

    req.timeout = 10;
    openAndSend("GET", "/");

    setTimeout(function() {
      sinon.assert.notCalled(error);
      done();
   },20);
  });


  it("not emit error when aborted immediately", function() {


    var error = sinonSandbox.stub(req, "emit").withArgs("error");

    openAndSend("GET", "/");
    req._abort();

    sinon.assert.notCalled(error);
  });


  it("cancel timeout when DONE", function(done) {
    var fakeReq = getFakeReq();
    req.timeout = 10;
    openAndSend("GET", "/");
    fakeReq.respond();

    setTimeout(function() {
      assert.isNull(req.__timerId);
      done();
   },20);
  });


  it("cancel timeout when handler throws", function(done) {
    var fakeReq = getFakeReq();
    req.timeout = 10;
    openAndSend("GET", "/");

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
        assert.isNull(req.__timerId);
        done();
      },20);
    }
  });

  //
  // onloadend()
  //

  it("fire loadend when request complete", function() {
    var fakeReq = getFakeReq();

    var loadend = sinonSandbox.stub(req, "emit").withArgs("loadend");
    openAndSend("GET", "/");

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
    assert.equal(statics.UNSENT, req.readyState);

    // Open
    req._open("GET", "/affe");
    assert.equal(statics.OPENED, req.readyState);

    // Send (and receive)
    req._send();
    fakeReq.respond(statics.DONE);
    assert.equal(statics.DONE, req.readyState);
  });

  //
  // responseText
  //

  it("responseText is empty string when OPEN", function() {
    req._open("GET", "/affe");
    assert.strictEqual("", req.responseText);
  });


  it("responseText is empty string when reopened", function() {
    var fakeReq = getFakeReq();

    // Send and respond

    openAndSend("GET", "/");
    fakeReq.respond(200, {
      "Content-Type": "text/html"
    }, "Affe");

    // Reopen
    req._open("GET", "/elefant");
    assert.strictEqual("", req.responseText);
  });


  it("responseText is set when DONE", function() {
    var fakeReq = getFakeReq();

    openAndSend("GET", "/");
    fakeReq.respond(200, {
      "Content-Type": "text/html"
    }, "Affe");

    assert.equal("Affe", req.responseText);
  });

  // BUGFIXES

  it("query responseText when available", function() {
    var fakeReq = getFakeReq();

    function success(state) {

      // Stub and prepare success
      fakeReq.readyState = state;
      fakeReq.responseText = "YIPPIE";
      fakeReq.responseHeaders = {};

      // Trigger readystatechange handler
      fakeReq.onreadystatechange();

      assert.equal("YIPPIE", req.responseText,
        "When readyState is " + state);
    }

    success(statics.DONE);

    // Assert responseText to be set when in progress
    // in browsers other than IE < 9
    if (!isIEBelow(9)) {
      success(statics.HEADERS_RECEIVED);
      success(statics.LOADING);
    }

  });


  it("not query responseText if unavailable", function() {
    var fakeReq = getFakeReq();

    function trap(state) {

      // Stub and set trap
      fakeReq.readyState = state;
      fakeReq.responseText = "BOGUS";

      // Trigger readystatechange handler
      fakeReq.onreadystatechange();

      assert.notEqual("BOGUS", req.responseText,
        "When readyState is " + state);
    }

    if (isIEBelow(9)) {
      trap(statics.UNSENT);
      trap(statics.OPENED);
      trap(statics.HEADERS_RECEIVED);
      trap(statics.LOADING);
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

    openAndSend("GET", "/");
    fakeReq.respond(200, {
      "Content-Type": "application/xml"
    }, "<affe></affe>");

    // Reopen
    req._open("GET", "/");
    assert.isNull(req.responseXML);
  });


  it("responseXML is parsed document with XML response", function() {

    var fakeReq = getFakeReq();

    openAndSend("GET", "/");

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

    req._open("GET", "/");

    assert.strictEqual(0, req.status);
  });


  it("http status is 0 when aborted immediately", function() {
    // require(["http"]);

    openAndSend("GET", "/");
    req._abort();

    assert.strictEqual(0, req.status);
  });


  it("http status when DONE", function() {

    var fakeReq = getFakeReq();
    req._open("GET", "/");
    fakeReq.respond(200);

    assert.strictEqual(200, req.status);
  });


  it("statusText is empty string when UNSENT", function() {
    assert.strictEqual("", req.statusText);
  });


  it("statusText is set when DONE", function() {
    var fakeReq = getFakeReq();

    req._open("GET", "/");
    fakeReq.respond(200);

    assert.strictEqual("OK", req.statusText);
  });


  it("status is set when LOADING", function() {
    var fakeReq = getFakeReq();

    req._open("GET", "/");
    fakeReq.readyState = statics.LOADING;
    fakeReq.status = 200;
    fakeReq.responseHeaders = {};
    fakeReq.onreadystatechange();

    assert.strictEqual(200, req.status);
  });


  it("reset status when reopened", function() {
    var fakeReq = getFakeReq();

    req._open("GET", "/");
    fakeReq.respond(200);
    req._open("GET", "/");

    assert.strictEqual(0, req.status);
    assert.strictEqual("", req.statusText);
  });

  // BUGFIXES



  it("normalize status 1223 to 204", function() {
    var fakeReq = getFakeReq();

    openAndSend("GET", "/");
    fakeReq.respond(1223);

    assert.strictEqual(204, req.status);
  });


  it("normalize status 0 to 200 when DONE and file protocol", function() {
    var fakeReq = getFakeReq();

    openAndSend("GET", "/");

    sinonSandbox.stub(req, "_getProtocol").returns("file:");
    fakeReq.respond(0, {}, "Response");

    assert.equal(200, req.status);
  });


  it("keep status 0 when not yet DONE and file protocol", function() {
    var fakeReq = getFakeReq();

    sinonSandbox.stub(req, "_getProtocol").returns("file:");
    req._open("GET", "/");

    fakeReq.readyState = 3;
    fakeReq.onreadystatechange();

    assert.equal(0, req.status);
  });


  it("keep status 0 when DONE with network error and file protocol", function() {
    var fakeReq = getFakeReq();

    sinonSandbox.stub(req, "_getProtocol").returns("file:");
    openAndSend("GET", "/");

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

    req._open("GET", "http://example.org/index.html");

    assert.equal("http:", req._getProtocol());
  });


  it("read protocol from window if requested URL is without protocol", function() {
    // require(["http"]);

    req._open("GET", "index.html");

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
    req._dispose();

    assert.isNull(req.getRequest());
  });


  it("dispose() aborts", function() {
    sinonSandbox.spy(req, "abort");
    req._dispose();

    sinon.assert.called(req.abort);
  });


  it("isDisposed()", function() {
    assert.isFalse(req.isDisposed());
    req._dispose();
    assert.isTrue(req.isDisposed());
  });


  it("invoking public method throws when disposed", function() {

    var assertDisposedException = qx.lang.Function.bind(function(callback) {
      assert.throw(qx.lang.Function.bind(callback,
        Error, /Already disposed/));
    });

    req._dispose();
    assertDisposedException(function() {
      req._open("GET", "/");
    });
    assertDisposedException(function() {
      req._setRequestHeader();
    });
    assertDisposedException(function() {
      req._send();
    });
    assertDisposedException(function() {
      req._abort();
    });
    assertDisposedException(function() {
      req.getResponseHeader();
    });
    assertDisposedException(function() {
      req.getAllResponseHeaders();
    });

  });


  function openAndSend(method, url) {
    // use API of io.XHR only
    req._open(method, url);
    req._send();

    // use API of io.AbstractRequest
    /*
    req.setMethod(method);
    req.setUrl(url);
    req.send()
    */
  }


  function fakeNativeXhr() {
    fakedXhr = sinonSandbox.useFakeXMLHttpRequest();

    // Reset pre-existing request so that it uses the faked XHR
    if (req) {
      req = new qx.io.request.Xhr();
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
});

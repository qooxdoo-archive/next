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
    this.fakeNativeXhr();
    this.req = new qx.io.request.Xhr();
  });

  afterEach(function() {
    this.req = null;
    this.getSandbox().restore();
  });

  //
  // General
  //

  it("create instance", function() {
    assert.isObject(this.req);
  });


  it("detect native XHR", function() {
    var nativeXhr = this.req.getRequest();

    assert.isObject(nativeXhr);
    assert.isNotNull(nativeXhr.readyState);
  });

  //
  // open()
  //

  it("open request", function() {
    var fakeReq = this.getFakeReq();
    this.spy(fakeReq, "open");

    var url = "/foo";
    var method = "GET";
    this.req._open(method, url);

    this.assertCalledWith(fakeReq.open, method, url);
  });


  it("open request throws when missing arguments", function() {
    var req = this.req;
    var msg = /Not enough arguments/;
    assert.throw(function() {
      req._open();
    }, Error, msg);
    assert.throw(function() {
      req._open("GET");
    }, Error, msg);
  });


  it("open async request on default", function() {
    var fakeReq = this.getFakeReq();
    this.spy(fakeReq, "open");

    this.req._open(null, null);
    assert.isTrue(fakeReq.open.args[0][2], "async must be true");
  });


  it("open sync request", function() {
    var fakeReq = this.getFakeReq();
    this.spy(fakeReq, "open");

    this.req._open(null, null, false);
    assert.isFalse(fakeReq.open.args[0][2], "async must be false");
  });


  it("open request with username and password", function() {
    var fakeReq = this.getFakeReq();
    this.spy(fakeReq, "open");

    this.req._open(null, null, null, "affe", "geheim");
    assert.equal("affe", fakeReq.open.args[0][3], "Unexpected user");
    assert.equal("geheim", fakeReq.open.args[0][4], "Unexpected password");
  });

  //
  // setRequestHeader()
  //

  it("set request header", function() {
    var fakeReq = this.getFakeReq();
    this.spy(fakeReq, "setRequestHeader");

    // Request must be opened before request headers can be set
    this.req._open("GET", "/");

    this.req._setRequestHeader("header", "value");
    this.assertCalledWith(fakeReq.setRequestHeader, "header", "value");
  });

  //
  // send()
  //

  it("send() with data", function() {
    var fakeReq = this.getFakeReq();
    this.spy(fakeReq, "send");

    var data = "AFFE";
    this.req._open("GET", "/affe");
    this.req._send(data);

    this.assertCalledWith(fakeReq.send, data);
  });

  // BUGFIXES

  it("send() without data", function() {
    var fakeReq = this.getFakeReq();
    this.spy(fakeReq, "send");

    this.openAndSend("GET", "/affe");

    this.assertCalledWith(fakeReq.send, null);
  });

  //
  // abort()
  //

  it("abort() aborts native Xhr", function() {
    var req = this.req;
    var fakeReq = this.getFakeReq();
    this.spy(fakeReq, "abort");

    req._abort();
    this.assertCalled(fakeReq.abort);
  });


  it("abort() resets readyState", function() {
    var req = this.req;
    req._open("GET", "/");
    req.abort();

    assert.equal(this.constructor.UNSENT, req.readyState, "Must be UNSENT");
  });

  //
  // Event helper
  //

  it("fire event", function() {
    var req = this.req;
    var event = this.spy();
    req.onevent = this.spy();
    req.on("event", event);
    req.emit("event");
    this.assertCalled(event);
  });

  //
  //
  // onreadystatechange()
  //

  it("responseText set before onreadystatechange is called", function() {
    var req = this.req;
    var fakeReq = this.getFakeReq();

    var that = this;
    req.onreadystatechange = function() {
      assert.equal("Affe", req.responseText);
    };
    fakeReq.responseText = "Affe";
    fakeReq.readyState = 4;
    fakeReq.responseHeaders = {};
    fakeReq.onreadystatechange();
  });


  it("emit readystatechange when reopened", function() {
    var req = this.req;
    var fakeReq = this.getFakeReq();
    this.stub(req, "emit");

    // Send and respond
    this.openAndSend("GET", "/");
    fakeReq.respond();

    // Reopen
    req._open("GET", "/");

    this.assertCalledWith(req.emit, "readystatechange");
  });

  // BUGFIXES

  it("ignore onreadystatechange when readyState is unchanged", function() {
    var req = this.req;
    var fakeReq = this.getFakeReq();
    var globalStack = [];

    this.stub(req, "emit", function(evt) {
      globalStack.push(evt);
    });

    req.readyState = this.constructor.OPENED;
    fakeReq.onreadystatechange();
    fakeReq.onreadystatechange();

    var expected = ["readystatechange"];
    assert.deepEqual(expected, globalStack);
  });


  it("native onreadystatechange is disposed once DONE", function() {
    var req = this.req;
    var fakeReq = this.getFakeReq();

    req.onreadystatechange = function() {
      return "OP";
    };
    this.openAndSend("GET", "/");

    fakeReq.respond();
    assert.isUndefined(req.getRequest().onreadystatechange());
  });

  //
  // onload()
  //

  it("emit load on successful request", function() {
    var req = this.req;
    var fakeReq = this.getFakeReq();

    this.stub(req, "emit");
    this.openAndSend("GET", "/");

    // Status does not matter. Set a non-empty response for file:// workaround.
    fakeReq.respond(200, {}, "RESPONSE");

    this.assertCalledWith(req.emit, "load");
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
    var req = this.req;

    this.spy(req, "emit");

    this.openAndSend("GET", "/");
    req._abort();

    this.assertCalledWith(req.emit, "abort");
  });


  it("emit abort before loadend", function() {
    var req = this.req;

    var emit = this.stub(req, "emit");
    var abort = emit.withArgs("abort");
    var loadend = emit.withArgs("loadend");

    this.openAndSend("GET", "/");
    req._abort();

    this.assertCallOrder(abort, loadend);
  });

  //
  // ontimeout()
  //

  it("emit timeout", function() {
    var req = this.req,
      that = this;

    var timeout = this.stub(req, "emit").withArgs("timeout");

    req.timeout = 10;
    this.openAndSend("GET", "/");

    this.wait(20, function() {
      this.assertCalledOnce(timeout);
    }, this);
  });


  it("not emit error when timeout", function() {
    var req = this.req;

    var error = this.stub(req, "emit").withArgs("error");

    req.timeout = 10;
    this.openAndSend("GET", "/");

    this.wait(20, function() {
      this.assertNotCalled(error);
    }, this);
  });


  it("not emit error when aborted immediately", function() {
    var req = this.req;

    var error = this.stub(req, "emit").withArgs("error");

    this.openAndSend("GET", "/");
    req._abort();

    this.assertNotCalled(error);
  });


  it("cancel timeout when DONE", function() {
    var fakeReq = this.getFakeReq(),
      req = this.req;

    req.timeout = 10;
    this.openAndSend("GET", "/");
    fakeReq.respond();

    this.wait(20, function() {
      assert.isNull(req.__timerId);
    }, this);
  });


  it("cancel timeout when handler throws", function() {
    var fakeReq = this.getFakeReq(),
      req = this.req;

    req.timeout = 10;
    this.openAndSend("GET", "/");

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
      this.wait(20, function() {
        assert.isNull(req.__timerId);
      }, this);
    }
  });

  //
  // onloadend()
  //

  it("fire loadend when request complete", function() {
    var req = this.req;
    var fakeReq = this.getFakeReq();

    var loadend = this.stub(req, "emit").withArgs("loadend");
    this.openAndSend("GET", "/");

    // Status does not matter
    fakeReq.respond();

    this.assertCalled(loadend);
  });

  //
  // Events
  //


  //
  // readyState
  //

  it("set readyState appropriate to native readyState", function() {
    var req = this.req;
    var fakeReq = this.getFakeReq();

    // Created
    assert.equal(this.constructor.UNSENT, req.readyState);

    // Open
    req._open("GET", "/affe");
    assert.equal(this.constructor.OPENED, req.readyState);

    // Send (and receive)
    req._send();
    fakeReq.respond(this.constructor.DONE);
    assert.equal(this.constructor.DONE, req.readyState);
  });

  //
  // responseText
  //

  it("responseText is empty string when OPEN", function() {
    this.req._open("GET", "/affe");
    this.assertIdentical("", this.req.responseText);
  });


  it("responseText is empty string when reopened", function() {
    var fakeReq = this.getFakeReq();

    // Send and respond
    var req = this.req;
    this.openAndSend("GET", "/");
    fakeReq.respond(200, {
      "Content-Type": "text/html"
    }, "Affe");

    // Reopen
    req._open("GET", "/elefant");
    this.assertIdentical("", req.responseText);
  });


  it("responseText is set when DONE", function() {
    var req = this.req;
    var fakeReq = this.getFakeReq();

    this.openAndSend("GET", "/");
    fakeReq.respond(200, {
      "Content-Type": "text/html"
    }, "Affe");

    assert.equal("Affe", req.responseText);
  });

  // BUGFIXES

  it("query responseText when available", function() {
    var that = this;
    var req = this.req;
    var fakeReq = this.getFakeReq();

    function success(state) {

      // Stub and prepare success
      fakeReq.readyState = state;
      fakeReq.responseText = "YIPPIE";
      fakeReq.responseHeaders = {};

      // Trigger readystatechange handler
      fakeReq.onreadystatechange();

      that.assertEquals("YIPPIE", req.responseText,
        "When readyState is " + state);
    }

    success(this.constructor.DONE);

    // Assert responseText to be set when in progress
    // in browsers other than IE < 9
    if (!this.isIEBelow(9)) {
      success(this.constructor.HEADERS_RECEIVED);
      success(this.constructor.LOADING);
    }

  });


  it("not query responseText if unavailable", function() {
    var that = this;
    var req = this.req;
    var fakeReq = this.getFakeReq();

    function trap(state) {

      // Stub and set trap
      fakeReq.readyState = state;
      fakeReq.responseText = "BOGUS";

      // Trigger readystatechange handler
      fakeReq.onreadystatechange();

      that.assertNotEquals("BOGUS", req.responseText,
        "When readyState is " + state);
    }

    if (this.isIEBelow(9)) {
      trap(this.constructor.UNSENT);
      trap(this.constructor.OPENED);
      trap(this.constructor.HEADERS_RECEIVED);
      trap(this.constructor.LOADING);
    }

  });

  //
  // responseXML
  //


  it("responseXML is null when not DONE", function() {
    assert.isNull(this.req.responseXML);
  });


  it("responseXML is null when reopened", function() {
    var fakeReq = this.getFakeReq();

    // Send and respond
    var req = this.req;
    this.openAndSend("GET", "/");
    fakeReq.respond(200, {
      "Content-Type": "application/xml"
    }, "<affe></affe>");

    // Reopen
    req._open("GET", "/");
    assert.isNull(req.responseXML);
  });


  it("responseXML is parsed document with XML response", function() {
    var req = this.req;
    var fakeReq = this.getFakeReq();

    this.openAndSend("GET", "/");

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
    this.assertIdentical(0, this.req.status);
  });


  it("http status is 0 when OPENED", function() {
    var req = this.req;
    req._open("GET", "/");

    this.assertIdentical(0, req.status);
  });


  it("http status is 0 when aborted immediately", function() {
    this.require(["http"]);

    var req = this.req;
    this.openAndSend("GET", "/");
    req._abort();

    this.assertIdentical(0, req.status);
  });


  it("http status when DONE", function() {
    var req = this.req;
    var fakeReq = this.getFakeReq();
    req._open("GET", "/");
    fakeReq.respond(200);

    this.assertIdentical(200, req.status);
  });


  it("statusText is empty string when UNSENT", function() {
    this.assertIdentical("", this.req.statusText);
  });


  it("statusText is set when DONE", function() {
    var fakeReq = this.getFakeReq();
    var req = this.req;
    req._open("GET", "/");
    fakeReq.respond(200);

    this.assertIdentical("OK", req.statusText);
  });


  it("status is set when LOADING", function() {
    var fakeReq = this.getFakeReq();
    var req = this.req;
    req._open("GET", "/");
    fakeReq.readyState = this.constructor.LOADING;
    fakeReq.status = 200;
    fakeReq.responseHeaders = {};
    fakeReq.onreadystatechange();

    this.assertIdentical(200, req.status);
  });


  it("reset status when reopened", function() {
    var fakeReq = this.getFakeReq();
    var req = this.req;
    req._open("GET", "/");
    fakeReq.respond(200);
    req._open("GET", "/");

    this.assertIdentical(0, req.status);
    this.assertIdentical("", req.statusText);
  });

  // BUGFIXES



  it("normalize status 1223 to 204", function() {
    var fakeReq = this.getFakeReq();
    var req = this.req;
    this.openAndSend("GET", "/");
    fakeReq.respond(1223);

    this.assertIdentical(204, req.status);
  });


  it("normalize status 0 to 200 when DONE and file protocol", function() {
    var fakeReq = this.getFakeReq();
    var req = this.req;
    this.openAndSend("GET", "/");

    this.stub(req, "_getProtocol").returns("file:");
    fakeReq.respond(0, {}, "Response");

    assert.equal(200, req.status);
  });


  it("keep status 0 when not yet DONE and file protocol", function() {
    var fakeReq = this.getFakeReq();
    var req = this.req;
    this.stub(req, "_getProtocol").returns("file:");
    req._open("GET", "/");

    fakeReq.readyState = 3;
    fakeReq.onreadystatechange();

    assert.equal(0, req.status);
  });


  it("keep status 0 when DONE with network error and file protocol", function() {
    var fakeReq = this.getFakeReq();
    var req = this.req;

    this.stub(req, "_getProtocol").returns("file:");
    this.openAndSend("GET", "/");

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
    var req = this.req;
    req._open("GET", "http://example.org/index.html");

    assert.equal("http:", req._getProtocol());
  });


  it("read protocol from window if requested URL is without protocol", function() {
    this.require(["http"]);

    var req = this.req;
    req._open("GET", "index.html");

    assert.match(req._getProtocol(), (/https?:/));
  });

  //
  // getResponseHeader()
  //

  it("getResponseHeader()", function() {
    var fakeReq = this.getFakeReq();
    fakeReq.open();
    fakeReq.setResponseHeaders({
      "key": "value"
    });

    var responseHeader = this.req.getResponseHeader("key");
    assert.equal("value", responseHeader);
  });

  //
  // getAllResponseHeaders()
  //

  it("getAllResponseHeaders()", function() {
    var fakeReq = this.getFakeReq();
    fakeReq.open();
    fakeReq.setResponseHeaders({
      "key1": "value1",
      "key2": "value2"
    });

    var responseHeaders = this.req.getAllResponseHeaders();
    assert.match(responseHeaders, /key1: value1/);
    assert.match(responseHeaders, /key2: value2/);
  });

  //
  // dispose()
  //

  it("dispose() deletes native Xhr", function() {
    this.req._dispose();

    assert.isNull(this.req.getRequest());
  });


  it("dispose() aborts", function() {
    var req = this.req;

    this.spy(req, "abort");
    this.req._dispose();

    this.assertCalled(req.abort);
  });


  it("isDisposed()", function() {
    assert.isFalse(this.req.isDisposed());
    this.req._dispose();
    assert.isTrue(this.req.isDisposed());
  });


  it("invoking public method throws when disposed", function() {
    var req = this.req;
    var assertDisposedException = qx.lang.Function.bind(function(callback) {
      assert.throw(qx.lang.Function.bind(callback, this),
        Error, /Already disposed/);
    }, this);

    this.req._dispose();
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
    this.req._open(method, url);
    this.req._send();

    // use API of io.AbstractRequest
    /*
    this.req.setMethod(method);
    this.req.setUrl(url);
    this.req.send()
    */
  }


  function fakeNativeXhr() {
    this.fakedXhr = this.useFakeXMLHttpRequest();

    // Reset pre-existing request so that it uses the faked XHR
    if (this.req) {
      this.req = new qx.io.request.Xhr();
    }
  }


  function getFakeReq() {
    return this.getRequests().slice(-1)[0];
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
    return this.isIEBelow(9);
  }


  function skip(msg) {
    throw new qx.dev.unit.RequirementError(null, msg);
  }


});

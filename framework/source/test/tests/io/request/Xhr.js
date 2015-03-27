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
 * @ignore(Klass)
 * @asset(qx/test/xmlhttp/*)
 */

/**
 * Tests asserting behavior
 *
 * - special to io.request.Xhr and
 * - common to io.request.* (see {@link qx.test.io.request.MRequest})
 *
 * Tests defined in MRequest run with appropriate context, i.e.
 * a transport that is an instance of qx.bom.request.Xhr
 * (see {@link #setUpFakeTransport}).
 *
 */
describe("io.request.Xhr", function() {
  var req;

  beforeEach(function() {
    setUpRequest();
    setUpFakeTransport();

    // preparation for _MRequest
    this.currentTest.req = req;
  });

  function setUpRequest() {
    req && req.dispose();
    req = new qx.io.request.Xhr();
    req.url = "url";
  }

  function setUpFakeTransport() {
    // if already stubbed just return
    if (req && req._send && req._send.restore) {
      return;
    }

    // Stub transport methods which in this case are methods of qx.io.request.Xhr itself
    sinonSandbox.stub(req, "_open");
    sinonSandbox.stub(req, "_setRequestHeader");
    sinonSandbox.stub(req, "setRequestHeader");
    sinonSandbox.stub(req, "_send");
    sinonSandbox.stub(req, "_abort");
    sinonSandbox.stub(req, "getResponseHeader");
    sinonSandbox.stub(req, "getAllResponseHeaders");
    sinonSandbox.stub(req, "overrideMimeType");
    sinonSandbox.stub(req, "getRequest");
  }

  function setUpFakeServer() {
    sinonSandbox.useFakeServer();
    setUpRequest();

    sinonSandbox.server.respondWith("GET", "/found", [200, {
      "Content-Type": "text/html"
    }, "FOUND"]);

    sinonSandbox.server.respondWith("GET", "/found.json", [200, {
      "Content-Type": "application/json; charset=utf-8"
    }, "JSON"]);

    sinonSandbox.server.respondWith("GET", "/found.other", [200, {
      "Content-Type": "application/other"
    }, "OTHER"]);
  }


  afterEach(function() {
    req.dispose();
    this.currentTest.req.dispose();

    // May fail in IE
    try {
      delete Klass;
    } catch (e) {}
  });

  //
  // General (cont.)
  //

  it("set url property on construct", function() {
    var req = new qx.io.request.Xhr("url");
    assert.equal("url", req.url);
    req.dispose();
  });


  it("set method property on construct", function() {
    var req = new qx.io.request.Xhr("url", "POST");
    assert.equal("POST", req.method);
    req.dispose();
  });

  //
  // Send (cont.)
  //

  it("send POST request", function() {
    setUpFakeTransport();
    req.method = "POST";
    req.send();

    sinon.assert.calledWith(req._open, "POST");
  });


  it("send sync request", function() {
    // TODO: Maybe use FakeServer instead
    setUpFakeTransport();
    req.async = false;
    req.send();

    sinon.assert.calledWith(req._open, "GET", "url", false);
    sinon.assert.called(req._send);
  });

  //
  // Data (cont.)
  //

  it("set content type urlencoded for POST request with body when no type given", function() {
    setUpFakeTransport();
    req.method = "POST";
    req.requestData = "Affe";
    req.send();

    sinon.assert.calledWith(req._setRequestHeader,
      "Content-Type", "application/x-www-form-urlencoded");
  });


  it("not set content type urlencoded for POST request with body when type given", function() {
    var msg;

    setUpFakeTransport();
    req.method = "POST";
    req.requestData = "Affe";
    req.setRequestHeader("Content-Type", "application/json");
    req.send();

    msg = "Must not set content type urlencoded when other type given";
    assert(!req.setRequestHeader.calledWith("Content-Type",
      "application/x-www-form-urlencoded"), msg);
  });


  it("send string data with POST request", function() {
    setUpFakeTransport();
    req.method = "POST";
    req.requestData = "str";
    req.send();

    sinon.assert.calledWith(req._send, "str");
  });


  it("send obj data with POST request", function() {
    setUpFakeTransport();
    req.method = "POST";
    req.requestData = {
      "af fe": true
    };
    req.send();

    sinon.assert.calledWith(req._send, "af+fe=true");
  });


  it("send qooxdoo obj data with POST request", function() {
    setUpFakeTransport();
    qx.Class.define("Klass", {
      extend: Object,

      properties: {
       affe: {
          init: true
        }
      }
    });

    var obj = new Klass();
    req.method = "POST";
    req.requestData = obj;
    req.send();

    sinon.assert.calledWith(req._send, "affe=true");
  });


  it("send blob data with POST request", function() {
    if (typeof window.Blob == "undefined") {
      this.test.skipped = true;
      return;
    }

    var blob = new window.Blob(['abc123'], {type: 'text/plain'});
    setUpFakeTransport();
    req.method = "POST";
    req.requestData = blob;
    req.send();

    sinon.assert.calledWith(req._send, blob);
  });


  it("send array buffer data with POST request", function() {
    if (typeof window.ArrayBuffer == "undefined") {
      this.test.skipped = true;
      return;
    }
    var array = new window.ArrayBuffer(512);
    setUpFakeTransport();
    req.method = "POST";
    req.requestData = array;
    req.send();

    sinon.assert.calledWith(req._send, array);
  });


  it("serialize data", function() {
      var data = {
        "abc": "def",
        "uvw": "xyz"
      },
      contentType = "application/json";

    req.setRequestHeader.restore();

    assert.isNull(req._serializeData(null));
    assert.equal("leaveMeIntact", req._serializeData("leaveMeIntact"));
    assert.equal("abc=def&uvw=xyz", req._serializeData(data));

    req.setRequestHeader("Content-Type", "arbitrary/contentType");
    assert.equal("abc=def&uvw=xyz", req._serializeData(data));

    req.setRequestHeader("Content-Type", contentType);
    assert.equal('{"abc":"def","uvw":"xyz"}', req._serializeData(data));

    req.setRequestHeader("Content-Type", contentType);
    assert.equal('[1,2,3]', req._serializeData([1, 2, 3]));
  });

  //
  // Header and Params (cont.)
  //



  it("set requested-with header", function() {
    setUpFakeTransport();
    req.send();

    sinon.assert.calledWith(req._setRequestHeader, "X-Requested-With", "XMLHttpRequest");
  });


  it("not set requested-with header when cross-origin", function() {
    setUpFakeTransport();
    var spy = req.setRequestHeader.withArgs("X-Requested-With", "XMLHttpRequest");

    req.url = "http://example.com";
    req.send();

    sinon.assert.notCalled(spy);
  });


  it("set cache control header", function() {
    setUpFakeTransport();
    req.cache = "no-cache";
    req.send();

    sinon.assert.calledWith(req._setRequestHeader, "Cache-Control", "no-cache");
  });


  it("set accept header", function() {
    setUpFakeTransport();
    req.accept = "application/json";
    req.send();

    sinon.assert.calledWith(req._setRequestHeader, "Accept", "application/json");
  });


  it("get response content type", function() {
    // stub(req, "getResponseHeader");
    req.getResponseContentType();

    sinon.assert.calledWith(req.getResponseHeader, "Content-Type");
  });

  //
  // Handler
  //

  // Documentation only

  it("event handler receives request", function() {
    setUpFakeTransport();

    req.readyState = 4;
    req.status = 200;
    req.responseText = "Affe";

    req.on("success", function(origReq) {
      assert.equal(origReq, req);
      assert.equal("Affe", origReq.responseText);
    });

    req.emit("readystatechange");
  });

  //
  // Properties
  //

  it("sync XHR properties for every readyState", function() {
    // TODO: Maybe use FakeServer instead
    setUpFakeServer();
      var readyStates = [],
      statuses = [];

    req.url = "/found";
    req.method = "GET";

    readyStates.push(req.readyState);
    req.on("readystatechange", function() {
      readyStates.push(req.readyState);
      statuses.push(req.status);
    });

    req.send();
    sinonSandbox.server.respond();

    assert.deepEqual([0, 1, 2, 3, 4], readyStates);
    assert.deepEqual([0, 200, 200, 200], statuses);
    assert.equal("text/html", req.getResponseHeader("Content-Type"));
    assert.equal("OK", req.statusText);
    assert.equal("FOUND", req.responseText);
  });

  //
  // Response
  //

  it("get response", function() {
    setUpFakeTransport();

    req.readyState = 4;
    req.status = 200;
    req.responseText = "Affe";
    req.emit("readystatechange");

    assert.equal("Affe", req.response);
  });


  it("get response on 400 status", function() {
    setUpFakeTransport();

    req.readyState = 4;
    req.status = 400;
    req.responseText = "Affe";
    req.emit("readystatechange");

    assert.equal("Affe", req.response);
  });


  it("get response by change event", function() {
    setUpFakeTransport();

    req.readyState = 4;
    req.status = 200;
    req.responseText = "Affe";

    qx.core.Assert.assertEventFired(req, "changeResponse", function() {
      req.emit("readystatechange");
    }, function(e) {
      assert.equal("Affe", e.value);
    });

  });

  //
  // Parsing
  //

  it("_getParsedResponse", function() {
    var json = '{"animals": 3}',
      contentType = "application/json",
      stubbedParser = req._createResponseParser();

    req.responseText = json;
    sinonSandbox.stub(req, "getResponseContentType").returns(contentType);

    // replace real parser with stub
    sinonSandbox.stub(stubbedParser, "parse");
    req._parser = stubbedParser;

    req._getParsedResponse();
    sinon.assert.calledWith(stubbedParser.parse, json, contentType);
  });


  it("setParser", function() {
    var customParser = function() {},
      stubbedParser = req._createResponseParser();

    // replace real parser with stub
    sinonSandbox.stub(stubbedParser, "setParser");
    req._parser = stubbedParser;

    req.setParser(customParser);
    sinon.assert.calledWith(stubbedParser.setParser, customParser);
  });

  //
  // Auth
  //

  it("basic auth", function() {
    setUpFakeTransport();

    var auth, call, key, credentials;

    auth = new qx.io.request.authentication.Basic("affe", "geheim");
    req.authentication = auth;
    req.send();

    call = req._setRequestHeader.getCall(1);
    key = "Authorization";
    credentials = /Basic\s(.*)/.exec(call.args[1])[1];
    assert.equal(key, call.args[0]);
    assert.equal("affe:geheim", qx.util.Base64.decode(credentials));
  });

  // shared tests from mixin
  var sharedTests = _MRequest();
  for (var testName in sharedTests) {
    it(testName, sharedTests[testName]);
  }


});

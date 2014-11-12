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
qx.Class.define("qx.test.io.request.Xhr",
{
  extend : qx.dev.unit.TestCase,

  include : [qx.test.io.request.MRequest,
             qx.dev.unit.MMock,
             qx.dev.unit.MRequirements],

  construct: function() {
    this.initMMock();
  },

  members :
  {
    setUp: function() {
      this.setUpRequest();
      this.setUpFakeTransport();
    },

    setUpRequest: function() {
      this.req && this.req.dispose();
      this.req = new qx.io.request.Xhr();
      this.req.url = "url";
    },

    setUpFakeTransport: function() {
      // if already stubbed just return
      if (this.req && this.req._send && this.req._send.restore) { return; }

      // Stub transport methods which in this case are methods of qx.io.request.Xhr itself
      this.stub(this.req, "_open");
      this.stub(this.req, "_setRequestHeader");
      this.stub(this.req, "setRequestHeader");
      this.stub(this.req, "_send");
      this.stub(this.req, "_abort");
      this.stub(this.req, "getResponseHeader");
      this.stub(this.req, "getAllResponseHeaders");
      this.stub(this.req, "overrideMimeType");
      this.stub(this.req, "getRequest");
    },

    setUpFakeServer: function() {
      // Not fake transport
      this.getSandbox().restore();

      this.useFakeServer();
      this.setUpRequest();

      this.server = this.getServer();

      this.server.respondWith("GET", "/found",
        [200, {"Content-Type": "text/html"}, "FOUND"]);

      this.server.respondWith("GET", "/found.json",
        [200, {"Content-Type": "application/json; charset=utf-8"}, "JSON"]);

      this.server.respondWith("GET", "/found.other",
        [200, {"Content-Type": "application/other"}, "OTHER"]);
    },

    setUpFakeXhr: function() {
      // Not fake transport
      this.getSandbox().restore();

      this.useFakeXMLHttpRequest();
      this.setUpRequest();
    },

    tearDown: function() {
      this.getSandbox().restore();
      this.req.dispose();

      // May fail in IE
      try { delete Klass; } catch(e) {}
    },

    //
    // General (cont.)
    //

    "test: set url property on construct": function() {
      var req = new qx.io.request.Xhr("url");
      this.assertEquals("url", req.url);
      req.dispose();
    },

    "test: set method property on construct": function() {
      var req = new qx.io.request.Xhr("url", "POST");
      this.assertEquals("POST", req.method);
      req.dispose();
    },

    //
    // Send (cont.)
    //

    "test: send POST request": function() {
      this.setUpFakeTransport();
      this.req.method = "POST";
      this.req.send();

      this.assertCalledWith(this.req._open, "POST");
    },

    "test: send sync request": function() {
      this.require(["http"]);

      this.setUpFakeTransport();
      this.req.async = false;
      this.req.send();

      this.assertCalledWith(this.req._open, "GET", "url", false);
      this.assertCalled(this.req._send);
    },

    //
    // Data (cont.)
    //

    "test: set content type urlencoded for POST request with body when no type given": function() {
      this.setUpFakeTransport();
      this.req.method = "POST";
      this.req.requestData = "Affe";
      this.req.send();

      this.assertCalledWith(this.req._setRequestHeader,
           "Content-Type", "application/x-www-form-urlencoded");
    },

    "test: not set content type urlencoded for POST request with body when type given": function() {
      var msg;

      this.setUpFakeTransport();
      this.req.method = "POST";
      this.req.requestData = "Affe";
      this.req.setRequestHeader("Content-Type", "application/json");
      this.req.send();

      msg = "Must not set content type urlencoded when other type given";
      this.assert(!this.req.setRequestHeader.calledWith("Content-Type",
        "application/x-www-form-urlencoded"), msg);
    },

    "test: send string data with POST request": function() {
      this.setUpFakeTransport();
      this.req.method = "POST";
      this.req.requestData = "str";
      this.req.send();

      this.assertCalledWith(this.req._send, "str");
    },

    "test: send obj data with POST request": function() {
      this.setUpFakeTransport();
      this.req.method = "POST";
      this.req.requestData = {"af fe": true};
      this.req.send();

      this.assertCalledWith(this.req._send, "af+fe=true");
    },

    "test: send qooxdoo obj data with POST request": function() {
      this.setUpFakeTransport();
      this.setUpKlass();
      var obj = new Klass();
      this.req.method = "POST";
      this.req.requestData = obj;
      this.req.send();

      this.assertCalledWith(this.req._send, "affe=true");
    },

    "test: serialize data": function() {
      var req = this.req,
          data = {"abc": "def", "uvw": "xyz"},
          contentType = "application/json";

      req.setRequestHeader.restore();

      this.assertNull(req._serializeData(null));
      this.assertEquals("leaveMeIntact", req._serializeData("leaveMeIntact"));
      this.assertEquals("abc=def&uvw=xyz", req._serializeData(data));

      req.setRequestHeader("Content-Type", "arbitrary/contentType");
      this.assertEquals("abc=def&uvw=xyz", req._serializeData(data));

      req.setRequestHeader("Content-Type", contentType);
      this.assertEquals('{"abc":"def","uvw":"xyz"}', req._serializeData(data));

      req.setRequestHeader("Content-Type", contentType);
      this.assertEquals('[1,2,3]', req._serializeData([1,2,3]));
    },

    //
    // Header and Params (cont.)
    //

    "test: set requested-with header": function() {
      this.setUpFakeTransport();
      this.req.send();

      this.assertCalledWith(this.req._setRequestHeader, "X-Requested-With", "XMLHttpRequest");
    },

    "test: not set requested-with header when cross-origin": function() {
      this.setUpFakeTransport();
      var spy = this.req.setRequestHeader.withArgs("X-Requested-With", "XMLHttpRequest");

      this.req.url = "http://example.com";
      this.req.send();

      this.assertNotCalled(spy);
    },

    "test: set cache control header": function() {
      this.setUpFakeTransport();
      this.req.cache = "no-cache";
      this.req.send();

      this.assertCalledWith(this.req._setRequestHeader, "Cache-Control", "no-cache");
    },

    "test: set accept header": function() {
      this.setUpFakeTransport();
      this.req.accept = "application/json";
      this.req.send();

      this.assertCalledWith(this.req._setRequestHeader, "Accept", "application/json");
    },

    "test: override response content type": function() {
      this.setUpFakeTransport();
      this.req.overrideResponseContentType("text/plain;charset=Shift-JIS");

      this.assertCalledWith(this.req.overrideMimeType, "text/plain;charset=Shift-JIS");
    },

    "test: get response content type": function() {
      // this.stub(this.req, "getResponseHeader");
      this.req.getResponseContentType();

      this.assertCalledWith(this.req.getResponseHeader, "Content-Type");
    },

    //
    // Handler
    //

    // Documentation only
    "test: event handler receives request": function() {
      this.setUpFakeTransport();
      var req = this.req,
          that = this;

      req.readyState = 4;
      req.status = 200;
      req.responseText = "Affe";

      req.on("success", function(e) {
        that.assertEquals(e.target, req);
        that.assertEquals("Affe", e.target.responseText);
      });

      req.emit("readystatechange");
    },

    //
    // Properties
    //

    "test: sync XHR properties for every readyState": function() {
      this.require(["http"]);

      this.setUpFakeServer();
      var req = this.req,
          server = this.server,
          readyStates = [],
          statuses = [];

      req.url = "/found";
      req.method = "GET";

      readyStates.push(req.readyState);
      req.on("readystatechange", function() {
        readyStates.push(req.readyState);
        statuses.push(req.status);
      }, this);

      req.send();
      server.respond();

      this.assertArrayEquals([0, 1, 2, 3, 4], readyStates);
      this.assertArrayEquals([0, 200, 200, 200], statuses);
      this.assertEquals("text/html", req.getResponseHeader("Content-Type"));
      this.assertEquals("OK", req.statusText);
      this.assertEquals("FOUND", req.responseText);
    },

    //
    // Response
    //

    "test: get response": function() {
      this.setUpFakeTransport();
      var req = this.req;

      req.readyState = 4;
      req.status = 200;
      req.responseText = "Affe";
      req.emit("readystatechange");

      this.assertEquals("Affe", req.getResponse());
    },

    "test: get response on 400 status": function() {
      this.setUpFakeTransport();
      var req = this.req;

      req.readyState = 4;
      req.status = 400;
      req.responseText = "Affe";
      req.emit("readystatechange");

      this.assertEquals("Affe", req.getResponse());
    },

    "test: get response by change event": function() {
      this.setUpFakeTransport();
      var req = this.req,
          that = this;

      req.readyState = 4;
      req.status = 200;
      req.responseText = "Affe";

      this.assertEventFired(req, "changeResponse", function() {
        req.emit("readystatechange");
      }, function(e) {
        that.assertEquals("Affe", e.value);
      });

    },

    //
    // Parsing
    //

    "test: _getParsedResponse": function() {
      var req = this.req,
          json = '{"animals": 3}',
          contentType = "application/json",
          stubbedParser = req._createResponseParser();

      req.responseText = json;
      this.stub(req, "getResponseContentType").returns(contentType);

      // replace real parser with stub
      this.stub(stubbedParser, "parse");
      req._parser = stubbedParser;

      req._getParsedResponse();
      this.assertCalledWith(stubbedParser.parse, json, contentType);
    },

    "test: setParser": function() {
      var req = this.req,
          customParser = function() {},
          stubbedParser = req._createResponseParser();

      // replace real parser with stub
      this.stub(stubbedParser, "setParser");
      req._parser = stubbedParser;

      req.setParser(customParser);
      this.assertCalledWith(stubbedParser.setParser, customParser);
    },

    //
    // Auth
    //

    "test: basic auth": function() {
      this.setUpFakeTransport();

      var auth, call, key, credentials;

      auth = new qx.io.request.authentication.Basic("affe", "geheim");
      this.req.authentication = auth;
      this.req.send();

      call = this.req._setRequestHeader.getCall(1);
      key = "Authorization";
      credentials = /Basic\s(.*)/.exec(call.args[1])[1];
      this.assertEquals(key, call.args[0]);
      this.assertEquals("affe:geheim", qx.util.Base64.decode(credentials));
    }
  }
});

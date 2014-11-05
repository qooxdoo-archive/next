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
 * Tests asserting shared behavior of io.request.* classes. Also provides
 * common helpers.
 *
 * It should be noted that tests defined here fake an ideal transport. The
 * transport itself is tested elsewhere (see {@link qx.test.bom.request}).
 */
qx.Mixin.define("qx.test.io.request.MRequest",
{

  members :
  {

    setUpKlass: function() {
      qx.Class.define("Klass", {
        extend : Object,

        properties :
        {
          affe: {
            init: true
          }
        }
      });
    },

    //
    // Send
    //

    "test: send() GET": function() {
      this.req.send();

      this.assertCalledWith(this.req._open, "GET", "url");
      this.assertCalled(this.req._send);
    },

    "test: drop fragment from URL": function() {
      this.req.url = "example.com#fragment";
      this.req.send();

      this.assertCalledWith(this.req._open, "GET", "example.com");
    },

    //
    // Abort
    //

    "test: abort request": function() {
      this.req.abort();

      this.assertCalled(this.req._abort);
    },

    //
    // Data
    //

    "test: not send data with GET request": function() {
      this.req.requestData = "str";
      this.req.send();

      this.assertCalledWith(this.req._send, undefined);
    },

    "test: append string data to URL with GET request": function() {
      this.req.requestData = "str";
      this.req.send();

      this.assertCalledWith(this.req._open, "GET", "url?str");
    },

    "test: append obj data to URL with GET request": function() {
      this.req.requestData = {affe: true};
      this.req.send();

      this.assertCalledWith(this.req._open, "GET", "url?affe=true");
    },

    "test: append qooxdoo obj data to URL with GET request": function() {
      this.setUpKlass();
      var obj = new Klass();
      this.req.requestData = obj;
      this.req.send();

      this.assertCalledWith(this.req._open, "GET", "url?affe=true");
    },

    //
    // Header and Params
    //

    "test: set request header": function() {
      this.req.setRequestHeader("key", "value");
      this.req.send();

      this.assertCalledWith(this.req.setRequestHeader, "key", "value");
    },

    "test: set request header does not append": function() {
      var stub = this.req._setRequestHeader.withArgs("key", "value");

      this.req.setRequestHeader.restore();

      this.req.setRequestHeader("key", "value");
      this.req.setRequestHeader("key", "value");
      this.req.send();

      this.assertCalledOnce(stub.withArgs("key", "value"));
    },

    "test: get request header": function() {
      this.req.setRequestHeader.restore();

      this.req.setRequestHeader("key", "value");

      this.assertEquals("value", this.req.getRequestHeader("key"));
    },

    "test: remove request header": function() {
      var stub;

      this.req.setRequestHeader("key", "value");
      this.req.removeRequestHeader("key");

      stub = this.req._setRequestHeader.withArgs("key", "value");
      this.req.send();

      this.assertNotCalled(stub);
    },

    "test: get all request headers": function() {
      this.req.setRequestHeader.restore();

      this.req.setRequestHeader("key", "value");
      this.req.setRequestHeader("otherkey", "value");

      this.assertEquals("value", this.req._getAllRequestHeaders()["key"]);
      this.assertEquals("value", this.req._getAllRequestHeaders()["otherkey"]);
    },

    "test: get all request headers includes configuration dependent headers": function() {
      this.req.setRequestHeader.restore();

      this.req.setRequestHeader("key", "value");
      this.req._getConfiguredRequestHeaders = function() { return {"otherkey": "value"}; };

      this.assertEquals("value", this.req._getAllRequestHeaders()["key"]);
      this.assertEquals("value", this.req._getAllRequestHeaders()["otherkey"]);
    },

    "test: not append cache parameter to URL": function() {
      this.req.send();

      var msg = "nocache parameter must not be set";
      this.assertFalse(/\?nocache/.test(this.req._open.args[0][1]), msg);
    },

    "test: append nocache parameter to URL": function() {
      this.req.cache = false;
      this.req.send();

      var msg = "nocache parameter must be set to number";
      this.assertTrue(/\?nocache=\d{13,}/.test(this.req._open.args[0][1]), msg);
    },

    //
    // Events
    //

    "test: fire readyStateChange": function() {
      var req = this.req,
          readystatechange = this.spy();

      req.on("readyStateChange", readystatechange);
      this.respond();

      this.assertCalledOnce(readystatechange);
    },

    "test: fire success": function() {
      var req = this.req,
          success = this.spy();

      req.on("success", success);
      this.respond();

      this.assertCalledOnce(success);
    },

    "test: not fire success on erroneous status": function() {
      var req = this.req,
          success = this.spy();

      req.on("success", success);
      this.respond(500);

      this.assertNotCalled(success);
    },

    "test: fire load": function() {
      var req = this.req,
          load = this.spy();

      req.on("load", load);
      this.respond();

      this.assertCalledOnce(load);
    },

    "test: fire loadEnd": function() {
      var req = this.req,
          loadEnd = this.spy();

      req.on("loadEnd", loadEnd);
      this.respond();

      this.assertCalledOnce(loadEnd);
    },

    "test: fire abort": function() {
      var req = this.req,
          abort = this.spy();

      req.on("abort", abort);
      this.req.onabort();

      this.assertCalledOnce(abort);
    },

    "test: fire timeout": function() {
      var req = this.req,
          timeout = this.spy();

      req.timeout = 100;
      req.send();

      req.on("timeout", timeout);
      req.ontimeout();

      this.assertEquals(100, req.timeout);
      this.assertCalledOnce(timeout);
    },

    "test: fire error": function() {
      var req = this.req,
          error = this.spy();

      req.on("error", error);
      this.respondError();

      this.assertCalledOnce(error);
    },

    "test: fire statusError": function() {
      var req = this.req,
          statusError = this.spy();

      req.on("statusError", statusError);
      this.respond(500);

      this.assertCalledOnce(statusError);
    },

    "test: fire fail on erroneous status": function() {
      var req = this.req,
          fail = this.spy();

      req.on("fail", fail);
      this.respond(500);

      this.assertCalledOnce(fail);
    },

    "test: fire fail on network error": function() {
      var req = this.req,
          fail = this.spy();

      req.on("fail", fail);
      this.respondError();

      this.assertCalledOnce(fail);
    },

    "test: fire fail on timeout": function() {
      var req = this.req,
          fail = this.spy();

      req.on("fail", fail);
      this.timeout();

      this.assertCalledOnce(fail);
    },

    "test: fire changePhase": function() {
      var req = this.req,
          that = this;

      this.assertEventFired(req, "changePhase", function() {
        that.respond();
      }, function(evt) {
        that.assertMatch(evt.value, "load|success");
      });
    },

    //
    // Phase
    //

    "test: phase is unsent": function() {
      this.assertEquals("unsent", this.req.phase);
    },

    "test: phase was open before send": function() {
      var req = this.req,
          phases = [];

      req.on("changePhase", function() {
        phases.push(req.phase);
      });

      req.url = "/url";
      req.send();

      this.assertArrayEquals(["opened", "sent"], phases);
    },

    "test: phase is sent": function() {
      var req = this.req;

      req.url = "/url";
      req.send();

      this.assertEquals("sent", req.phase);
    },

    "test: phase is loading": function() {
      var req = this.req;

      req.readyState = 3;
      req.onreadystatechange();

      this.assertEquals("loading", req.phase);
    },

    "test: phase is load intermediately": function() {
      var req = this.req,
          phases = [];

      req.on("changePhase", function() {
        phases.push(req.phase);
      });

      req.readyState = 4;
      req.onreadystatechange();

      // phases = ["load", "statusError"]
      this.assertEquals("load", phases[0]);
    },

    "test: phase is success": function() {
      var req = this.req;

      this.respond();
      this.assertEquals("success", req.phase);
    },

    // Error handling

    "test: phase is statusError": function() {
      var req = this.req;

      this.respond(500);
      this.assertEquals("statusError", req.phase);
    },

    "test: phase is abort": function() {
      var req = this.req;

      req.abort();
      req.onabort();

      // switch to readyState DONE on abort
      req.readyState = 4;
      req.onreadystatechange();

      this.assertEquals("abort", req.phase);
    },

    "test: phase is abort when from cache": function() {
      var req = this.req;

      req.abort();
      req.onabort();

      // Synchronously served from cached
      req.status = 304;

      // switch to readyState DONE on abort
      req.readyState = 4;
      req.onreadystatechange();

      this.assertEquals("abort", req.phase);
    },

    "test: phase is abort on readyState DONE when aborted before": function() {
      var req = this.req;

      req.on("readyStateChange", function() {
        if (req.readyState == 4) {
          this.assertEquals("abort", req.phase);
        }
      }, this);

      req.send();
      req.abort();

      // switch to readyState DONE on abort
      req.readyState = 4;
      req.onreadystatechange();

      req.onabort();
    },

    "test: phase is abort on readyState DONE when aborting loading": function() {
      var req = this.req;

      req.on("readyStateChange", function() {
        if (req.readyState == 4) {
          this.assertEquals("abort", req.phase);
        }
      }, this);

      req.send();

      // Loading
      req.readyState = 3;
      req.onreadystatechange();

      // Abort loading
      req.abort();

      // switch to readyState DONE on abort
      req.readyState = 4;
      req.onreadystatechange();
      req.onabort();
    },

    "test: phase is abort on loadEnd when aborted before": function() {
      var req = this.req;

      req.on("loadEnd", function() {
        this.assertEquals("abort", req.phase);
      }, this);

      req.send();
      req.abort();

      // fire "onloadend" on abort
      req.readyState = 4;
      req.onloadend();

      req.onabort();
    },

    "test: phase is timeout": function() {
      var req = this.req;

      this.timeout();
      this.assertEquals("timeout", req.phase);
    },

    getFakeReq: function() {
      return this.getRequests().slice(-1)[0];
    },

    noCache: function(url) {
      return qx.util.Uri.appendParamsToUrl(url, "nocache=" + Date.now());
    },

    respond: function(status, error) {
      this.req.status = typeof status === "undefined" ? 200 : status;
      this.req.readyState = 4;
      this.req.onreadystatechange();

      (function(req) {
        if (error === "timeout") {
          req.ontimeout();
          return;
        }

        if (error === "network") {
          req.onerror();
          return;
        }

        req.onload();
      })(this.req);

      this.req.onloadend();
    },

    respondError: function() {
      this.respond(0, "network");
    },

    timeout: function() {
      this.respond(0, "timeout");
    }
  }
});

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
describe("io.request.MRequest", function() {
  var req;
  function setUpKlass() {
    qx.Class.define("Klass", {
      extend: Object,

      properties: {
        affe: {
          init: true
        }
      }
    });
  }

  //
  // Send
  //

  it("send() GET", function() {
    req.send();

    sinon.assert.calledWith(req._open, "GET", "url");
    sinon.assert.called(req._send);
  });


  it("drop fragment from URL", function() {
    req.url = "example.com#fragment";
    req.send();

    sinon.assert.calledWith(req._open, "GET", "example.com");
  });

  //
  // Abort
  //

  it("abort request", function() {
    req.abort();

    sinon.assert.called(req._abort);
  });

  //
  // Data
  //

  it("not send data with GET request", function() {
    req.requestData = "str";
    req.send();

    sinon.assert.calledWith(req._send, undefined);
  });


  it("append string data to URL with GET request", function() {
    req.requestData = "str";
    req.send();

    sinon.assert.calledWith(req._open, "GET", "url?str");
  });


  it("append obj data to URL with GET request", function() {
    req.requestData = {
      affe: true
    };
    req.send();

    sinon.assert.calledWith(this.req._open, "GET", "url?affe=true");
  });


  it("append qooxdoo obj data to URL with GET request", function() {
    setUpKlass();
    var obj = new Klass();
    req.requestData = obj;
    req.send();

    sinon.assert.calledWith(req._open, "GET", "url?affe=true");
  });

  //
  // Header and Params
  //

  it("set request header", function() {
    req.setRequestHeader("key", "value");
    req.send();

    sinon.assert.calledWith(req.setRequestHeader, "key", "value");
  });


  it("set request header does not append", function() {
    var stub = req._setRequestHeader.withArgs("key", "value");

    req.setRequestHeader.restore();

    req.setRequestHeader("key", "value");
    req.setRequestHeader("key", "value");
    req.send();

    sinon.assert.calledOnce(stub.withArgs("key", "value"));
  });


  it("get request header", function() {
    req.setRequestHeader.restore();

    req.setRequestHeader("key", "value");

    assert.equal("value", req.getRequestHeader("key"));
  });


  it("remove request header", function() {
    var stub;

    req.setRequestHeader("key", "value");
    req.removeRequestHeader("key");

    stub = req._setRequestHeader.withArgs("key", "value");
    req.send();

    sinon.assert.notCalled(stub);
  });


  it("get all request headers", function() {
    req.setRequestHeader.restore();

    req.setRequestHeader("key", "value");
    req.setRequestHeader("otherkey", "value");

    assert.equal("value", req._getAllRequestHeaders()["key"]);
    assert.equal("value", req._getAllRequestHeaders()["otherkey"]);
  });


  it("get all request headers includes configuration dependent headers", function() {
    req.setRequestHeader.restore();

    req.setRequestHeader("key", "value");
    req._getConfiguredRequestHeaders = function() {
      return {
        "otherkey": "value"
      };
    };

    assert.equal("value", req._getAllRequestHeaders()["key"]);
    assert.equal("value", req._getAllRequestHeaders()["otherkey"]);
  });


  it("not append cache parameter to URL", function() {
    req.send();

    var msg = "nocache parameter must not be set";
    assert.isFalse(/\?nocache/.test(req._open.args[0][1]), msg);
  });


  it("append nocache parameter to URL", function() {
    req.cache = false;
    req.send();

    var msg = "nocache parameter must be set to number";
    assert.isTrue(/\?nocache=\d{13,}/.test(req._open.args[0][1]), msg);
  });

  //
  // Events
  //

  it("fire readystatechange", function() {
    var readystatechange = sinon.spy();

    req.on("readystatechange", readystatechange);
    respond();

    sinon.assert.calledOnce(readystatechange);
  });


  it("fire success", function() {
    var success = sinon.spy();

    req.on("success", success);
    respond();

    sinon.assert.calledOnce(success);
  });


  it("not fire success on erroneous status", function() {
    var success = sinon.spy();

    req.on("success", success);
    respond(500);

    sinon.assert.notCalled(success);
  });


  it("fire load", function() {
    var load = sinon.spy();

    req.on("load", load);
    this.respond();

    sinon.assert.calledOnce(load);
  });


  it("fire loadend", function() {
    var loadend = sinon.spy();

    req.on("loadend", loadend);
    respond();

    sinon.assert.calledOnce(loadend);
  });


  it("fire abort", function() {
    var abort = sinon.spy();

    req.on("abort", abort);
    req.emit("abort");

    sinon.assert.calledOnce(abort);
  });


  it("fire timeout", function() {
    var timeout = sinon.spy();

    req.timeout = 100;
    req.send();

    req.on("timeout", timeout);
    req.emit("timeout");

    assert.equal(100, req.timeout);
    assert.calledOnce(timeout);
  });


  it("fire error", function() {
    var req = this.req,
      error = sinon.spy();

    req.on("error", error);
    this.respondError();

    this.assertCalledOnce(error);
  });


  it("fire statusError", function() {
    var req = this.req,
      statusError = sinon.spy();

    req.on("statusError", statusError);
    this.respond(500);

    this.assertCalledOnce(statusError);
  });


  it("fire fail on erroneous status", function() {
    var req = this.req,
      fail = sinon.spy();

    req.on("fail", fail);
    this.respond(500);

    this.assertCalledOnce(fail);
  });


  it("fire fail on network error", function() {
    var fail = sinon.spy();

    req.on("fail", fail);
    respondError();

   sinon.assert.calledOnce(fail);
  });


  it("fire fail on timeout", function() {
    var fail = sinon.spy();

    req.on("fail", fail);
    timeout();

    sinon.assert.calledOnce(fail);
  });


  it("fire changePhase", function() {

    qx.core.Assert.assertEventFired(req, "changePhase", function() {
      respond();
    }, function(evt) {
      assert.match(evt.value, "load|success");
    });
  });

  //
  // Phase
  //

  it("phase is unsent", function() {
    assert.equal("unsent", this.req.phase);
  });


  it("phase was open before send", function() {
    var phases = [];

    req.on("changePhase", function() {
      phases.push(req.phase);
    });

    req.url = "/url";
    req.send();

    assert.deepEqual(["opened", "sent"], phases);
  });


  it("phase is sent", function() {
    req.url = "/url";
    req.send();

    assert.equal("sent", req.phase);
  });


  it("phase is loading", function() {
    req.readyState = 3;
    req.emit("readystatechange");

    assert.equal("loading", req.phase);
  });


  it("phase is load intermediately", function() {
    var phases = [];

    req.on("changePhase", function() {
      phases.push(req.phase);
    });

    req.readyState = 4;
    req.emit("readystatechange");

    // phases = ["load", "statusError"]
    assert.equal("load", phases[0]);
  });


  it("phase is success", function() {

    respond();
    assert.equal("success", req.phase);
  });

  // Error handling

  it("phase is statusError", function() {
    respond(500);
    assert.equal("statusError", req.phase);
  });


  it("phase is abort", function() {
    req.abort();
    req.emit("abort");

    // switch to readyState DONE on abort
    req.readyState = 4;
    req.emit("readystatechange");

    assert.equal("abort", req.phase);
  });


  it("phase is abort when from cache", function() {

    req.abort();
    req.emit("abort");

    // Synchronously served from cached
    req.status = 304;

    // switch to readyState DONE on abort
    req.readyState = 4;
    req.emit("readystatechange");

    assert.equal("abort", req.phase);
  });


  it("phase is abort on readyState DONE when aborted before", function() {

    req.on("readystatechange", function() {
      if (req.readyState == 4) {
        assert.equal("abort", req.phase);
      }
    }, this);

    req.send();
    req.abort();

    // switch to readyState DONE on abort
    req.readyState = 4;
    req.emit("readystatechange");

    req.emit("abort");
  });


  it("phase is abort on readyState DONE when aborting loading", function() {
    req.on("readystatechange", function() {
      if (req.readyState == 4) {
        assert.equal("abort", req.phase);
      }
    }, this);

    req.send();

    // Loading
    req.readyState = 3;
    req.emit("readystatechange");

    // Abort loading
    req.abort();

    // switch to readyState DONE on abort
    req.readyState = 4;
    req.emit("readystatechange");
    req.emit("abort");
  });


  it("phase is abort on loadEnd when aborted before", function() {

    req.on("loadEnd", function() {
      assert.equal("abort", req.phase);
    }, this);

    req.send();
    req.abort();

    // fire "onloadend" on abort
    req.readyState = 4;
    req.emit("load");

    req.emit("abort");
  });


  it("phase is timeout", function() {

    timeout();
    assert.equal("timeout", req.phase);
  });

  function getFakeReq() {
    return this.getRequests().slice(-1)[0];
  }

  function noCache(url) {
    return qx.util.Uri.appendParamsToUrl(url, "nocache=" + Date.now());
  }

  function respond(status, error) {
    req.status = typeof status === "undefined" ? 200 : status;
    req.readyState = 4;
    req.emit("readystatechange");

    (function(req) {
      if (error === "timeout") {
        req.emit("timeout");
        return;
      }

      if (error === "network") {
        req.emit("error");
        return;
      }

      req.emit("load");
    })(req);
    req.emit("loadend");
  }

  function respondError() {
    this.respond(0, "network");
  }

  function timeout() {
    this.respond(0, "timeout");
  }

});

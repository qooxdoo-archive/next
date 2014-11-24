var _MRequest = function() {

  //
  // helper functions
  //

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
    respond(0, "network");
  }

  function timeout() {
    respond(0, "timeout");
  }

  return {

    //
    // Send
    //

    "send() GET": function() {
      // see beforeEach()
      req = this.test.req;

      req.send();

      sinon.assert.calledWith(req._open, "GET", "url");
      sinon.assert.called(req._send);
    },


    "drop fragment from URL": function() {
      // see beforeEach()
      req = this.test.req;

      req.url = "example.com#fragment";
      req.send();

      sinon.assert.calledWith(req._open, "GET", "example.com");
    },


    //
    // Abort
    //

    "abort request": function() {
      // see beforeEach()
      req = this.test.req;

      req.abort();

      sinon.assert.called(req._abort);
    },


    //
    // Data
    //

    "not send data with GET request": function() {
      // see beforeEach()
      req = this.test.req;

      req.requestData = "str";
      req.send();

      sinon.assert.calledWith(req._send, undefined);
    },


    "append string data to URL with GET request": function() {
      // see beforeEach()
      req = this.test.req;

      req.requestData = "str";
      req.send();

      sinon.assert.calledWith(req._open, "GET", "url?str");
    },


    "append obj data to URL with GET request": function() {
      // see beforeEach()
      req = this.test.req;

      req.requestData = {
        affe: true
      };
      req.send();

      sinon.assert.calledWith(req._open, "GET", "url?affe=true");
    },


    "append qooxdoo obj data to URL with GET request": function() {
      // see beforeEach()
      req = this.test.req;

      qx.Class.define("Klass", {
        extend: Object,

        properties: {
         affe: {
            init: true
          }
        }
      });

      var obj = new Klass();
      req.requestData = obj;
      req.send();

      sinon.assert.calledWith(req._open, "GET", "url?affe=true");
    },

    //
    // Header and Params
    //

    "set request header": function() {
      // see beforeEach()
      req = this.test.req;

      req.setRequestHeader("key", "value");
      req.send();

      sinon.assert.calledWith(req.setRequestHeader, "key", "value");
    },


    "set request header does not append": function() {
      // see beforeEach()
      req = this.test.req;

      var stub = req._setRequestHeader.withArgs("key", "value");

      req.setRequestHeader.restore();

      req.setRequestHeader("key", "value");
      req.setRequestHeader("key", "value");
      req.send();

      sinon.assert.calledOnce(stub.withArgs("key", "value"));
    },


    "get request header": function() {
      // see beforeEach()
      req = this.test.req;

      req.setRequestHeader.restore();

      req.setRequestHeader("key", "value");

      assert.equal("value", req.getRequestHeader("key"));
    },


    "remove request header": function() {
      // see beforeEach()
      req = this.test.req;

      var stub;

      req.setRequestHeader("key", "value");
      req.removeRequestHeader("key");

      stub = req._setRequestHeader.withArgs("key", "value");
      req.send();

      sinon.assert.notCalled(stub);
    },


    "get all request headers": function() {
      // see beforeEach()
      req = this.test.req;

      req.setRequestHeader.restore();

      req.setRequestHeader("key", "value");
      req.setRequestHeader("otherkey", "value");

      assert.equal("value", req._getAllRequestHeaders()["key"]);
      assert.equal("value", req._getAllRequestHeaders()["otherkey"]);
    },


    "get all request headers includes configuration dependent headers": function() {
      // see beforeEach()
      req = this.test.req;

      req.setRequestHeader.restore();

      req.setRequestHeader("key", "value");
      req._getConfiguredRequestHeaders = function() {
        return {
          "otherkey": "value"
        };
      };

      assert.equal("value", req._getAllRequestHeaders()["key"]);
      assert.equal("value", req._getAllRequestHeaders()["otherkey"]);
    },


    "not append cache parameter to URL": function() {
      // see beforeEach()
      req = this.test.req;

      req.send();

      var msg = "nocache parameter must not be set";
      assert.isFalse(/\?nocache/.test(req._open.args[0][1]), msg);
    },


    "append nocache parameter to URL": function() {
      // see beforeEach()
      req = this.test.req;

      req.cache = false;
      req.send();

      var msg = "nocache parameter must be set to number";
      assert.isTrue(/\?nocache=\d{13,}/.test(req._open.args[0][1]), msg);
    },


    //
    // Events
    //

    "fire readystatechange": function() {
      // see beforeEach()
      req = this.test.req;

      var readystatechange = sinon.spy();

      req.on("readystatechange", readystatechange);
      respond();

      sinon.assert.calledOnce(readystatechange);
    },


    "fire success": function() {
      // see beforeEach()
      req = this.test.req;

      var success = sinon.spy();

      req.on("success", success);
      respond();

      sinon.assert.calledOnce(success);
    },


    "not fire success on erroneous status": function() {
      // see beforeEach()
      req = this.test.req;

      var success = sinon.spy();

      req.on("success", success);
      respond(500);

      sinon.assert.notCalled(success);
    },


    "fire load": function() {
      // see beforeEach()
      req = this.test.req;

      var load = sinon.spy();

      req.on("load", load);
      respond();

      sinon.assert.calledOnce(load);
    },


    "fire loadend": function() {
      // see beforeEach()
      req = this.test.req;

      var loadend = sinon.spy();

      req.on("loadend", loadend);
      respond();

      sinon.assert.calledOnce(loadend);
    },


    "fire abort": function() {
      // see beforeEach()
      req = this.test.req;

      var abort = sinon.spy();

      req.on("abort", abort);
      req.emit("abort");

      sinon.assert.calledOnce(abort);
    },


    "fire timeout": function() {
      // see beforeEach()
      req = this.test.req;

      var timeout = sinon.spy();

      req.timeout = 100;
      req.send();

      req.on("timeout", timeout);
      req.emit("timeout");

      assert.equal(100, req.timeout);
      sinon.assert.calledOnce(timeout);
    },


    "fire error": function() {
      // see beforeEach()
      req = this.test.req;

      var error = sinon.spy();

      req.on("error", error);
      respondError();

      sinon.assert.calledOnce(error);
    },


    "fire statusError": function() {
      // see beforeEach()
      req = this.test.req;

      var statusError = sinon.spy();

      req.on("statusError", statusError);
      respond(500);

      sinon.assert.calledOnce(statusError);
    },


    "fire fail on erroneous status": function() {
      // see beforeEach()
      req = this.test.req;

      var fail = sinon.spy();

      req.on("fail", fail);
      respond(500);

      sinon.assert.calledOnce(fail);
    },


    "fire fail on network error": function() {
      // see beforeEach()
      req = this.test.req;

      var fail = sinon.spy();

      req.on("fail", fail);
      respondError();

     sinon.assert.calledOnce(fail);
    },


    "fire fail on timeout": function() {
      // see beforeEach()
      req = this.test.req;

      var fail = sinon.spy();

      req.on("fail", fail);
      timeout();

      sinon.assert.calledOnce(fail);
    },


    "fire changePhase": function() {
      // see beforeEach()
      req = this.test.req;


      qx.core.Assert.assertEventFired(req, "changePhase", function() {
        respond();
      }, function(evt) {
        assert.match(evt.value, /load|success/);
      });
    },


    //
    // Phase
    //

    "phase is unsent": function() {
      // see beforeEach()
      req = this.test.req;

      assert.equal("unsent", req.phase);
    },


    "phase was open before send": function() {
      // see beforeEach()
      req = this.test.req;

      var phases = [];

      req.on("changePhase", function() {
        phases.push(req.phase);
      });

      req.url = "/url";
      req.send();

      assert.deepEqual(["opened", "sent"], phases);
    },


    "phase is sent": function() {
      // see beforeEach()
      req = this.test.req;

      req.url = "/url";
      req.send();

      assert.equal("sent", req.phase);
    },


    "phase is loading": function() {
      // see beforeEach()
      req = this.test.req;

      req.readyState = 3;
      req.emit("readystatechange");

      assert.equal("loading", req.phase);
    },


    "phase is load intermediately": function() {
      // see beforeEach()
      req = this.test.req;

      var phases = [];

      req.on("changePhase", function() {
        phases.push(req.phase);
      });

      req.readyState = 4;
      req.emit("readystatechange");

      // phases = ["load", "statusError"]
      assert.equal("load", phases[0]);
    },


    "phase is success": function() {
      // see beforeEach()
      req = this.test.req;


      respond();
      assert.equal("success", req.phase);
    },


    // Error handling

    "phase is statusError": function() {
      // see beforeEach()
      req = this.test.req;

      respond(500);
      assert.equal("statusError", req.phase);
    },


    "phase is abort": function() {
      // see beforeEach()
      req = this.test.req;

      req.abort();
      req.emit("abort");

      // switch to readyState DONE on abort
      req.readyState = 4;
      req.emit("readystatechange");

      assert.equal("abort", req.phase);
    },


    "phase is abort when from cache": function() {
      // see beforeEach()
      req = this.test.req;


      req.abort();
      req.emit("abort");

      // Synchronously served from cached
      req.status = 304;

      // switch to readyState DONE on abort
      req.readyState = 4;
      req.emit("readystatechange");

      assert.equal("abort", req.phase);
    },


    "phase is abort on readyState DONE when aborted before": function() {
      // see beforeEach()
      req = this.test.req;


      req.on("readystatechange", function() {
        if (req.readyState == 4) {
          assert.equal("abort", req.phase);
        }
      });

      req.send();
      req.abort();

      // switch to readyState DONE on abort
      req.readyState = 4;
      req.emit("readystatechange");

      req.emit("abort");
    },


    "phase is abort on readyState DONE when aborting loading": function() {
      // see beforeEach()
      req = this.test.req;

      req.on("readystatechange", function() {
        if (req.readyState == 4) {
          assert.equal("abort", req.phase);
        }
      });

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
    },


    "phase is abort on loadEnd when aborted before": function() {
      // see beforeEach()
      req = this.test.req;


      req.on("loadEnd", function() {
        assert.equal("abort", req.phase);
      });

      req.send();
      req.abort();

      // fire "onloadend" on abort
      req.readyState = 4;
      req.emit("load");

      req.emit("abort");
    },


    "phase is timeout": function() {
      // see beforeEach()
      req = this.test.req;

      timeout();
      assert.equal("timeout", req.phase);
    }
  };
};

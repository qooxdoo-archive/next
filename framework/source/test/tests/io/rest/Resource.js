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
     * Richard Sternagel (rsternagel)

************************************************************************ */

describe("io.rest.Resource", function() {
  var req;
  var res;
  var requests;

  beforeEach(function() {
    setUpDoubleRequest();
    setUpResource();
  });


  function setUpDoubleRequest() {
    // Restore Xhr when wrapped before
    if (typeof qx.io.request.Xhr.restore == "function") {
      qx.io.request.Xhr.restore();
    }

    req = new qx.io.request.Xhr();

    // Stub request methods, leave event system intact
    req = shallowStub(req, qx.io.request.AbstractRequest, [
      "dispose",
      "emit",
      "on",
      "once",
      "off",
      "offById",
      "getListenerId",
      "hasListener",
      "getListeners",
      "getEntryById",
      "_getStorage",
      "_getParsedResponse"
    ]);
    // Inject double and return
    injectStub(qx.io.request, "Xhr", req);

    // Remember request for later disposal
    if (!requests) {
      requests = [];
    }
    requests.push(req);

    return req;
  }

  function setUpResource() {

    res && res.dispose();
    res = new qx.io.rest.Resource();

    // Default routes
    res.map("get", "GET", "/photos");
    res.map("post", "POST", "/photos");
  }

  afterEach(function() {
    res.dispose();
    requests.forEach(function(req) {
      req.dispose();
    });
  });

  //
  // Configuration
  //

  it("configure request receives pre-configured but unsent request", function() {
    // overwrite manually to ensure proper setting of GET
    req.method = "POST";

    res.configureRequest(function(req) {
      assert.equal(req.method, "GET");
      assert.equal(req.url, "/photos");
      sinon.assert.notCalled(req.send);
    }.bind(this));

    res.get();
  });


  it("configure request receives invocation details", function() {
    var params = {};
    var data = {};
    var callback;

    callback = sinonSandbox.spy(function(req, _action, _params, _data) {
      assert.equal("get", _action, "Unexpected action");
      assert.equal(params, _params, "Unexpected params");
      assert.equal(data, _data, "Unexpected data");
    }.bind(this));
    res.configureRequest(callback);

    res.get(params, data);
    sinon.assert.called(callback);
  });

  //
  // Route
  //
  it("map action", function() {
    var params;

    params = res._getRequestConfig("get");

    assert.equal("GET", params.method);
    assert.equal("/photos", params.url);
  });


  it("map action when base URL", function() {
    var params;

    res.setBaseUrl("http://example.com");
    params = res._getRequestConfig("get");

    assert.equal("http://example.com/photos", params.url);
  });


  it("map existing action", function() {
    var params;

    res.map("post", "GET", "/articles");
    params = res._getRequestConfig("post");

    assert.equal("/articles", params.url);
  });


  it("map action creates method", function() {
    assert.isFunction(res.get);
  });


  it("map action throws when existing method", function() {
    if (!qx.core.Environment.get("qx.debug")) {
      this.test.skipped = true;
      return;
    }

    // For whatever reason
    res.popular = function() {};

    assert.throw(function() {
      res.map("popular", "GET", "/photos/popular");
    }, Error);
  });


  it("map action does not throw when existing method is empty", function() {
    if (!qx.core.Environment.get("qx.debug")) {
      this.test.skipped = true;
      return;
    }
    res.get = (function() {});

    res.map("get", "GET", "/photos/popular");
  });


  it("dynamically created action forwards arguments", function() {
    sinonSandbox.spy(res, "invoke");
    res.get({}, "1", "2", "3");

    sinon.assert.calledWith(res.invoke, "get", {}, "1", "2", "3");
  });


  it("dynamically created action returns what invoke returns", function() {
    var id = 1;
    sinonSandbox.stub(res, "invoke").returns(id);
    assert.equal(id, res.get());
  });


  it("map actions from description", function() {
    var req,
      description,
      res,
      check = {},
      params;

    description = {
      get: {
        method: "GET",
        url: "/photos"
      },
      create: {
        method: "POST",
        url: "/photos",
        check: check
      }
    };

    res = new qx.io.rest.Resource(description);

    params = res._getRequestConfig("get");
    assert.equal("GET", params.method);
    assert.equal("/photos", params.url);

    params = res._getRequestConfig("create");
    assert.equal("POST", params.method);
    assert.equal("/photos", params.url);
    assert.equal(check, params.check);

    res.dispose();
  });


  it("map action from description throws with non-object", function() {
    if (!qx.core.Environment.get("qx.debug")) {
      this.test.skipped = true;
      return;
    }

    assert.throw(function() {
      var res = new qx.io.rest.Resource([]);
    });
  });


  it("map action from description throws with incomplete route", function() {
    if (!qx.core.Environment.get("qx.debug")) {
      this.test.skipped = true;
      return;
    }

    res.dispose();
    assert.throw(function() {
      var description = {
        get: {
          method: "GET"
        }
      };
      res = new qx.io.rest.Resource(description);
    }, Error, /Expected value to be a string but found 'undefined'!/);
  });

  //
  // Invoke
  //

  it("invoke action generically", function() {
    var result = res.invoke("get");

    assertSend();
  });


  it("invoke action", function() {
    res.get();

    assertSend();
  });


  it("invoke action returns id of request", function() {
    assert.isNumber(res.invoke("get"));
  });


  it("invoke action while other is in progress", function() {
    var req1, req2;

    req1 = req;
    res.get();

    setUpDoubleRequest();

    req2 = req;
    res.post();

    sinon.assert.calledOnce(req1.send);
    sinon.assert.calledOnce(req2.send);
  });


  it("invoke same action handles multiple requests", function() {
    var req1, req2,
      getSuccess = sinonSandbox.spy();

    res.on("getSuccess", getSuccess);

    req1 = req;
    res.get();

    setUpDoubleRequest();

    req2 = req;
    res.get();

    respond("", req1);
    respond("", req2);

    sinon.assert.calledTwice(getSuccess);
  });


  it("invoke action with positional params", function() {
    res.map("get", "GET", "/photos/{id}");
    res.get({
      id: "1"
    });

    assert.equal("/photos/1", req.url);
  });


  it("invoke action with positional params that evaluate to false", function() {
    res.map("get", "GET", "/photos/{id}");
    res.get({
      id: 0
    });

    assert.equal("/photos/0", req.url);
  });


  it("invoke action with non-string params", function() {
    res.map("get", "GET", "/photos/{id}");
    res.get({
      id: 1
    });

    assert.equal("/photos/1", req.url);
  });


  it("invoke action with params and data", function() {
    res.map("put", "PUT", "/articles/{id}");
    res.put({
      id: "1"
    }, {
      article: '{title: "Affe"}'
    });

    // Note that with method GET, parameters are appended to the URLs query part.
    // Please refer to the API docs of qx.io.request.AbstractRequest#requestData.
    //
    // res.get({id: "1"}, {lang: "de"});
    // --> /articles/1/?lang=de

    qx.core.Assert.assertJsonEquals({
      article: '{title: "Affe"}'
    }, req.requestData);
  });


  it("invoke action with multiple positional params", function() {
    res.map("get", "GET", "/photos/{id}/comments/{commentId}");
    res.get({
      id: "1",
      commentId: "2"
    });

    assert.equal("/photos/1/comments/2", req.url);
  });


  it("invoke action with positional params in query", function() {
    res.map("get", "GET", "/photos/{id}/comments?id={commentId}");
    res.get({
      id: "1",
      commentId: "2"
    });

    assert.equal("/photos/1/comments?id=2", req.url);
  });


  it("invoke action with undefined params", function() {
    res.get();
    sinon.assert.called(req.send);
  });


  it("invoke action with null params", function() {
    res.get(null);
    sinon.assert.called(req.send);
  });


  it("invoke action when content type json", function() {
    req.setRequestHeader.restore();
    req.getRequestHeader.restore();

    res.configureRequest(function(req) {
      req.setRequestHeader("Content-Type", "application/json");
    });

    sinonSandbox.spy(JSON, "stringify");
    var data = {
      location: "Karlsruhe"
    };
    res.map("post", "POST", "/photos/{id}/meta");
    res.post({
      id: 1
    }, data);

    qx.core.Assert.assertJsonEquals('{"location":"Karlsruhe"}', req.requestData);
    sinon.assert.calledWith(JSON.stringify, data);

    JSON.stringify.restore();
  });


  it("invoke action when content type json and get", function() {
    sinonSandbox.spy(JSON, "stringify");
    req.getRequestHeader.withArgs("Content-Type").returns("application/json");
    res.get();

    sinon.assert.notCalled(JSON.stringify);

    JSON.stringify.restore();
  });


  it("invoke action for url with port", function() {
    res.map("get", "GET", "http://example.com:8080/photos/{id}");
    res.get({
      id: "1"
    });

    assert.equal("http://example.com:8080/photos/1", req.url);
  });


  it("invoke action for relative url", function() {
    res.map("get", "GET", "{page}");
    res.get({
      page: "index"
    });
    assert.equal("index", req.url);
  });


  it("invoke action for relative url with dots", function() {
    res.map("get", "GET", "../{page}");
    res.get({
      page: "index"
    });
    assert.equal("../index", req.url);
  });


  it("invoke action for route with check", function() {
    res.map("get", "GET", "/photos/zoom/{id}", {
      id: /\d+/
    });
    res.get({
      id: "123"
    });

    assertSend("GET", "/photos/zoom/123");
  });


  it("invoke action fills in empty string when missing param and no default", function() {
    res.map("get", "GET", "/photos/{tag}");
    res.get();

    assertSend("GET", "/photos/");
  });


  it("invoke action fills in default when missing param", function() {
    res.map("get", "GET", "/photos/{tag=recent}/{size}");
    res.get({
      size: "large"
    });

    assertSend("GET", "/photos/recent/large");
  });


  it("invoke action throws when missing required positional param", function() {
    // Require positional param
    res.map("get", "GET", "/photos/{tag}", {
      tag: qx.io.rest.Resource.REQUIRED
    });
    assert.throw(function() {
      res.get();
    }, Error, "Missing parameter 'tag'");
  });


  it("invoke action throws when missing required request param", function() {
    var res = new qx.io.rest.Resource();

    // Require request body param
    res.map("post", "POST", "/photos/", {
      photo: qx.io.rest.Resource.REQUIRED
    });
    assert.throw(function() {
      res.post();
    }, Error, "Missing parameter 'photo'");
  });


  it("invoke action throws when param not match check", function() {
    res.map("get", "GET", "/photos/{id}", {
      id: /\d+/
    });
    assert.throw(function() {
      res.get({
        id: "FAIL"
      });
    }, Error, "Parameter 'id' is invalid");
  });


  it("invoke action ignores invalid check in production", function() {
    if (!qx.core.Environment.get("qx.debug")) {
      this.test.skipped = true;
      return;
    }

    var setting = sinonSandbox.stub(qx.core.Environment, "get").withArgs("qx.debug");
    setting.returns(false);

    // Invalid check
    res.map("get", "GET", "/photos/{id}", {
      id: ""
    });
    res.get({
      id: 1
    });
  });

  //
  // Abort
  //
  it("abort action", function() {
    res.get();
    res.abort("get");

    sinon.assert.calledOnce(req.abort);
  });


  it("abort action when multiple requests", function() {
    req1 = setUpDoubleRequest();
    res.get();

    req2 = setUpDoubleRequest();
    res.get();

    res.abort("get");

    sinon.assert.calledOnce(req1.abort);
    sinon.assert.calledOnce(req2.abort);
  });


  it("abort by action id", function() {
    var id = res.get();
    res.abort(id);

    sinon.assert.calledOnce(req.abort);
  });


  //
  // Helper
  //
  it("refresh action", function() {
    res.get();
    assertSend();

    res.refresh("get");
    assertSend();
  });


  it("refresh action replaying previous params", function() {
    res.map("get", "GET", "/photos/{id}");
    res.get({
      id: "1"
    });
    assertSend("GET", "/photos/1");

    res.refresh("get");
    assertSend("GET", "/photos/1");
  });


  it("poll action", function() {
    sinonSandbox.useFakeTimers();
    sinonSandbox.spy(res, "refresh");

    res.poll("get", 10);
    respond();
    sinonSandbox.clock.tick(20);

    sinon.assert.calledWith(res.refresh, "get");
    sinon.assert.calledOnce(res.refresh);
  });


  it("not poll action when no response received yet", function() {
    sinonSandbox.useFakeTimers();
    sinonSandbox.spy(res, "refresh");

    res.poll("get", 10);
    sinonSandbox.clock.tick(20);

    sinon.assert.notCalled(res.refresh);
  });


  it("poll action immediately", function() {
    sinonSandbox.spy(res, "invoke");
    res.poll("get", 10, undefined, true);
    sinon.assert.called(res.invoke);
  });


  it("poll action sets initial params", function() {
    res.map("get", "GET", "/photos/{id}");
    sinonSandbox.stub(res, "invoke");

    res.poll("get", 10, {
      id: "1"
    }, true);
    sinon.assert.calledWith(res.invoke, "get", {
      id: "1"
    });
  });


  it("poll action replaying previous params", function() {
    res.map("get", "GET", "/photos/{id}");
    res.get({
      id: "1"
    });
    assertSend("GET", "/photos/1");

    res.poll("get");
    assertSend("GET", "/photos/1");
  });


  it("poll action repeatedly ends previous timer", function() {
    var msg;

    sinonSandbox.useFakeTimers();
    sinonSandbox.stub(res, "refresh");

    res.poll("get", 10);
    respond();
    sinonSandbox.clock.tick(20);

    res.poll("get", 100);
    respond();
    sinonSandbox.clock.tick(100);

    sinon.assert.calledTwice(res.refresh);
  });


  it("poll many actions", function() {
    var spy;
    var get;
    var post;

    sinonSandbox.stub(req, "dispose");
    sinonSandbox.useFakeTimers();

    spy = sinonSandbox.spy(res, "refresh");
    get = spy.withArgs("get");
    post = spy.withArgs("post");

    res.poll("get", 10);
    res.poll("post", 10);
    respond();
    sinonSandbox.clock.tick(20);

    sinon.assert.calledOnce(get);
    sinon.assert.calledOnce(post);

    req.dispose.restore();
    req.dispose();
  });


  it("end poll action", function() {
    var timer,
      numCalled;

    sinonSandbox.useFakeTimers();

    sinonSandbox.spy(res, "refresh");
    res.poll("get", 10);
    respond();

    // 10ms invoke, 20ms refresh, 30ms refresh
    sinonSandbox.clock.tick(30);
    res.stopPollByAction("get");
    sinonSandbox.clock.tick(100);

    sinon.assert.calledTwice(res.refresh);
  });


  it("end poll action does not end polling of other action", function() {
    var timer;
    var spy;

    sinonSandbox.useFakeTimers();
    spy = sinonSandbox.spy(res, "refresh").withArgs("get");
    respond();

    res.poll("get", 10);
    timer = res.poll("post", 10);
    sinonSandbox.clock.tick(20);
    window.clearInterval(timer);
    sinonSandbox.clock.tick(10);

    sinon.assert.calledTwice(spy);
  });


  it("restart poll action", function() {
    var timer;

    sinonSandbox.useFakeTimers();
    respond();

    res.poll("get", 10);
    sinonSandbox.clock.tick(10);
    res.stopPollByAction("get");

    sinonSandbox.spy(res, "refresh");
    res.restartPollByAction("get");
    sinonSandbox.clock.tick(10);
    sinon.assert.called(res.refresh);
  });


  it("long poll action", function() {
    var responses = [];

    // sinonSandbox.stub(req, "dispose");

    res.on("getSuccess", function(e) {
      responses.push(e.response);
    }, this);
    res.longPoll("get");

    // longPoll() sets up new request when receiving a response
    respond("1");
    respond("2");
    respond("3");

    assert.deepEqual(["1", "2", "3"], responses);
  });


  it("throttle long poll", function() {
    sinonSandbox.stub(req, "dispose");
    sinonSandbox.spy(res, "refresh");
    qx.io.rest.Resource.POLL_THROTTLE_COUNT = 3;

    res.longPoll("get");

    // A number of immediate responses, above count
    for (var i = 0; i < 4; i++) {
      respond();
    }

    res.refresh = function() {
      throw new Error("With throttling in effect, " +
        "must not make new request.");
    };

    // Throttling
    respond();

    // reset default value
    qx.io.rest.Resource.POLL_THROTTLE_COUNT = 30;
  });


  it("not throttle long poll when not received within limit", function() {
    sinonSandbox.stub(req, "dispose");

    sinonSandbox.useFakeTimers();
    res.longPoll("get");

    // A number of delayed responses, above count
    for (var i = 0; i < 31; i++) {
      sinonSandbox.clock.tick(101);
      respond();
    }

    sinonSandbox.spy(res, "refresh");
    sinonSandbox.clock.tick(101);

    respond();
    sinon.assert.called(res.refresh);

    res.refresh.restore();
  });


  it("not throttle long poll when not received subsequently", function() {

    sinonSandbox.stub(req, "dispose");

    sinonSandbox.useFakeTimers();
    res.longPoll("get");

    // A number of immediate responses
    for (var i = 0; i < 30; i++) {
      respond();
    }

    // Delayed response
    sinonSandbox.clock.tick(101);
    respond();

    // More immediate responses, total count above limit
    sinonSandbox.spy(res, "refresh");
    for (i = 0; i < 10; i++) {
      respond();
    }

    sinon.assert.callCount(res.refresh, 10);

    res.refresh.restore();
  });


  it("end long poll action", function() {
    var handlerId, msg;

    sinonSandbox.stub(req, "dispose");
    sinonSandbox.spy(res, "refresh");

    handlerId = res.longPoll("get");

    respond();
    respond();

    res.offById(handlerId);
    respond();

    sinon.assert.calledTwice(res.refresh);

    res.refresh.restore();
  });

  //
  // Events
  //
  it("fire actionSuccess", function() {
    res.get();
    qx.core.Assert.assertEventFired(res, "getSuccess", function() {
      respond("Affe");
    }, function(e) {
      assert.equal("Affe", e.response);
      assert.equal("get", e.action);
      assert.equal(req, e.request);
      assert.isNumber(e.id);
    });
  });


  it("fire success", function() {
    res.get();
    qx.core.Assert.assertEventFired(res, "success", function() {
      respond("Affe");
    }, function(e) {
      assert.equal("Affe", e.response);
      assert.equal("get", e.action);
      assert.equal(req, e.request);
      assert.isNumber(e.id);
    });
  });


  it("fire actionError", function() {
    res.get();
    qx.core.Assert.assertEventFired(res, "getError", function() {
      respondError("statusError");
    }, function(e) {
      assert.equal("statusError", e.phase);
      assert.equal(req, e.request);
    });
  });


  it("fire error", function() {
    res.get();
    qx.core.Assert.assertEventFired(res, "error", function() {
      respondError("statusError");
    }, function(e) {
      assert.equal("statusError", e.phase);
      assert.equal(req, e.request);
    });
  });

  //
  // Dispose
  //
  it("dispose requests", function() {
    var req1, req2;

    req1 = req;
    res.get();

    setUpDoubleRequest();

    req2 = req;
    res.post();

    sinonSandbox.spy(req1, "dispose");
    sinonSandbox.spy(req2, "dispose");

    res.dispose();

    sinon.assert.called(req1.dispose);
    sinon.assert.called(req2.dispose);
  });


  it("dispose requests of same action", function() {
    var req1, req2;

    req1 = req;
    res.get();

    setUpDoubleRequest();

    req2 = req;
    res.get();

    sinonSandbox.spy(req1, "dispose");
    sinonSandbox.spy(req2, "dispose");

    res.dispose();

    sinon.assert.called(req1.dispose);
    sinon.assert.called(req2.dispose);
  });


  it("dispose request on loadEnd", function(done) {
    sinonSandbox.spy(req, "dispose");

    res.get();
    respond();

    setTimeout(function() {
      sinon.assert.calledOnce(req.dispose);
      done();
    }, 100);
  });


  function assertSend(method, url) {

    method = method || "GET";
    url = url || "/photos";

    assert.equal(method, req.method);
    assert.equal(url, req.url);
    sinon.assert.called(req.send);
  }

  function hasDebug() {
    return qx.core.Environment.get("qx.debug");
  }


  // Fake response
  function respond(response, aReq) {
    var myReq = aReq || req;
    response = response || "";
    myReq.isDone.returns(true);
    myReq.phase = "success";
    myReq.response = response;
    myReq.emit("success");
    myReq.emit("loadEnd");
  }


  // Fake erroneous response
  function respondError(phase) {
    phase = phase || "statusError";
    req.phase = phase;
    req.emit("fail");
    req.emit("error");
    req.emit("loadEnd");
  }


  function __stubProperty(object, prop) {
    // Leave constructor and properties intact
    if (prop === "constructor" || typeof object[prop] !== "function") {
      return;
    }

    sinonSandbox.stub(object, prop);
  }


  function injectStub(object, property, customStub) {
    var stub = customStub || this.deepStub(new object[property]);

    sinonSandbox.stub(object, property).returns(stub);
    return stub;
  }


  function shallowStub(object, targetClazz, propsToExclude) {
    __getOwnProperties(object, targetClazz).forEach(function(prop) {
      if (propsToExclude && propsToExclude.indexOf(prop) >= 0) {
        // don't stub excluded prop
        return;
      }
      __stubProperty(object, prop);
    }, this);

    return object;
  };


  function __getOwnProperties(object, targetClazz) {
    var clazz = object.constructor,
      clazzes = [],
      properties = [];

    // Find classes in inheritance chain up to targetClazz
    if (targetClazz) {
      while (clazz.superclass) {
        clazzes.push(clazz);
        clazz = clazz.superclass;
        if (clazz == targetClazz.superclass) {
          break;
        }
      }
    }

    // Check if property is own in one of the classes in chain
    for (var prop in object) {

      if (clazzes.length) {
        var found = clazzes.some(function(clazz) {
          return clazz.prototype.hasOwnProperty(prop);
        });
        if (!found) {
          continue;
        }
      }

      properties.push(prop);
    }

    return properties;
  }
});

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

describe("io.request.XhrWithRemoteLowLevel", function() {

  var req;

  beforeEach(function() {
    req = new qx.io.request.Xhr();
  });


  afterEach(function() {
    req.dispose();
  });

  //
  // Basic
  //

  it("GET with event attribute handler", function(done) {

    var url = "../resource/qx/test/xmlhttp/sample.txt";

    req.on("readystatechange", function() {
      if (req.readyState == 4) {
        assert.equal(req.responseText, "SAMPLE");
        done();
      }
    });
    openAndSend("GET", noCache(url));

  });


  it("GET with event", function(done) {
    var url = "../resource/qx/test/xmlhttp/sample.txt";

    var onreadystatechange = function() {
      if (req.readyState == 4) {
        assert.equal(req.responseText, "SAMPLE");
        done();
      }
    };
    req.on("readystatechange", onreadystatechange);
    openAndSend("GET", noCache(url));
  });


  it("GET XML", function(done) {
    var url = "../resource/qx/test/xmlhttp/sample.xml";

    req.on("readystatechange", function() {
      if (req.readyState == 4) {
        assert.isObject(req.responseXML.documentElement, "Must be XML object");
        done();
      }
    });
    openAndSend("GET", noCache(url));

  });


  it("handle arbitrary XML", function(done) {
    // TODO: Maybe use FakeServer instead

    // Content-Type: foo/bar+xml
    var url = "../resource/qx/test/xmlhttp/xml.php";

    req.on("readystatechange", function() {
      if (req.readyState == 4) {
        assert.isObject(req.responseXML.documentElement, "Must be XML object");
        done();
      }
    });
    openAndSend("GET", noCache(url));

  });


  it("handle invalid XML", function(done) {
    var url = "../resource/qx/test/xmlhttp/invalid.xml";

    req.on("readystatechange", function() {
      if (req.readyState == 4) {
        req.responseXML;
        done();
      }
    });

    openAndSend("GET", url);
  });


  it("POST", function(done) {
    // TODO: Maybe use FakeServer instead

    var url = "../resource/qx/test/xmlhttp/echo_post_request.php";
    req._open("POST", noCache(url));
    req._setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    req.on("readystatechange", function() {
      if (req.readyState == 4) {
        assert.equal('{"affe":"true"}', req.responseText);
        done();
      }
    });
    req._send("affe=true");
  });


  it("have readyState UNSENT", function() {
    assert.strictEqual(0, req.readyState);
  });


  it("have readyState OPENED", function() {
    // TODO: Maybe use FakeServer instead
    var url = "../resource/qx/test/xmlhttp/echo_post_request.php";
    req._open("GET", noCache(url));

    assert.strictEqual(1, req.readyState);
  });


  it("abort pending request", function() {
    // TODO: Maybe use FakeServer instead
    var url = "../resource/qx/test/xmlhttp/echo_get_request.php";

    req._open("GET", noCache(url));
    req.abort();

    assert.notEqual(4, req.readyState, "Request must not complete");
  });


  it("have status 200 when modified", function(done) {
    // TODO: Maybe use FakeServer instead

    var url = "../resource/qx/test/xmlhttp/echo_get_request.php";

    req.on("readystatechange", function() {
      if (req.readyState == 4) {
        assert.equal(200, req.status);
        done();
      }
    });
    // Make sure resource is not served from cache
    openAndSend("GET", noCache(url));
  });


  it("validate freshness", function(done) {
    // TODO: Maybe use FakeServer instead
    if (qx.core.Environment.get("browser.name") == "ie") {
      done();
      return;
    }

    var url = "../resource/qx/test/xmlhttp/time.php";

    var send = function() {
      req._open("GET", url);
      req._send();
    };
    var count = 0;
    var results = [];
    req.on("load", function() {
      count += 1;
      results.push(req.responseText);
      if (count < 2) {
        send();
      } else {
        assert.notEqual(results[0], results[1], "Response must differ");
        done();
      }
    });

    send();
  });


  it("open throws error with insecure method", function() {
    url = "../resource/qx/test/xmlhttp/sample.txt";

    assert.throw(function() {
      // Type of error is of no interest
      try {
        req._open("TRACE", url);
      } catch (e) {
        throw Error();
      }
    });
  });


  it("overrideMimeType content type unchanged", function(done) {
    // TODO: Maybe use FakeServer instead
    if (qx.core.Environment.get("browser.name") == "ie") {
      done();
      return;
    }

    var onloadAssertContentTypeUnchanged = function() {
      assert.equal("text/html;charset=iso-8859-1", req.getResponseHeader("Content-Type"));
      assert.equal("ƒeƒXƒg", req.responseText);
      done();
    };

    var query = "?type=" + encodeURIComponent("text/html;charset=iso-8859-1") + "&content=%83%65%83%58%83%67";
    var url = "../resource/qx/test/xmlhttp/get_content.php" + query;

    req.on("load", onloadAssertContentTypeUnchanged);
    openAndSend("GET", url);
  });


  it("overrideMimeType content type override", function(done) {
    // TODO: Maybe use FakeServer instead
    if (qx.core.Environment.get("browser.name") == "ie") {
      done();
      return;
    }

    var onloadAssertContentTypeOverride = function() {
      // may or may not work - see API docs of overrideMimeType
      // assert.equal("text/plain;charset=Shift-JIS", req.getResponseHeader("Content-Type"));
      assert.equal("テスト", req.responseText);
      done();
    };

    var query = "?type=" + encodeURIComponent("text/html;charset=iso-8859-1") + "&content=%83%65%83%58%83%67";
    var url = "../resource/qx/test/xmlhttp/get_content.php" + query;

    req.on("load", onloadAssertContentTypeOverride);
    openAndSend("GET", url);
    req.overrideMimeType("text/plain;charset=Shift-JIS");
  });

  // BUGFIXES


  it("progress to readyState DONE", function(done) {
    // This is a mess, see
    // http://www.quirksmode.org/blog/archives/2005/09/xmlhttp_notes_r_2.html.

    var states = [];

    req.on("readystatechange", function() {
      states.push(req.readyState);
      if (req.readyState == 4) {
        assert.deepEqual([1, 2, 3, 4], states);
        done();
      }
    });

    var url = "../resource/qx/test/xmlhttp/sample.txt";
    openAndSend("GET", noCache(url));
  });


  it("progress to readyState DONE when sync", function() {
    var states = [];

    req.on("readystatechange", function() {
      states.push(req.readyState);
    });

    var url = "../resource/qx/test/xmlhttp/sample.txt";
    req._open("GET", noCache(url), false);
    req._send();

    // There is no HEADERS_RECEIVED and LOADING when sync.
    // See http://www.w3.org/TR/XMLHttpRequest/#the-send-method
    assert.deepEqual([1, 4], states);
  });


  it("progress to readyState DONE when from cache", function(done) {
    var primeReq = req,
      url = noCache("../resource/qx/test/xmlhttp/sample.txt"),
      states = [],
      count = 0;

    primeReq.on("readystatechange", function() {
      if (primeReq.readyState == 4) {
        // From cache with new request
        var req = new qx.io.request.Xhr();

        req.on("readystatechange", function() {
          states.push(req.readyState);
          if (req.readyState == 4) {
            assert.deepEqual([1, 2, 3, 4], states);
            done();
          }
        });

        req._open("GET", url);
        req._send();
      }
    });

    // Prime cache
    primeReq._open("GET", url);
    primeReq._send();

  });


  it("have status 304 when cache is fresh", function(done) {
    // TODO: Maybe use FakeServer instead
    var url = "../resource/qx/test/xmlhttp/not_modified.php";

    req.on("readystatechange", function() {
      if (req.readyState == 4) {
        assert.strictEqual(304, req.status);
        done();
      }
    });
    req._open("GET", url);

    // Pretend that client has a fresh representation of
    // this resource in its cache. Please note the ETag given
    // must be in sync with the current ETag of the file requested.
    //
    // XMLHttpRequest states:
    //
    // For 304 Not Modified responses that are a result of a user
    // agent generated conditional request the user agent must act
    // as if the server gave a 200 OK response with the appropriate
    // content. The user agent must allow setRequestHeader() to
    // override automatic cache validation by setting request
    // headers (e.g. If-None-Match or If-Modified-Since),
    // in which case 304 Not Modified responses must be passed through.
    //
    // Copied from:
    //
    // XMLHttpRequest [http://www.w3.org/TR/XMLHttpRequest/]
    // W3C Candidate Recommendation
    // Copyright © 2009 W3C® (MIT, ERCIM, Keio), All Rights Reserved.
    //

    // The actual ETag is not of importance here, since the server
    // is returning 304 anyway. We're just triggering the behavior
    // specified above.
    req.setRequestHeader("If-None-Match", "\"4893a3a-b0-49ea970349b00\"");
    req._send();
  });


  it("allow many requests with same object", function(done) {

    var url = "../resource/qx/test/xmlhttp/sample.txt";
    var count = 0;

    function request() {
      req._open("GET", noCache(url));
      req._send();
    }

    req.on("readystatechange", function() {
      if (req.readyState == 4) {
        if (++count < 3) {
          request();
        } else {
          assert.equal(3, count);
          done();
        }
      }
    });
    request();
  });

  //
  // onreadystatechange()
  //


  it("call onreadystatechange for OPEN", function(done) {
    var url = "../resource/qx/test/xmlhttp/sample.txt";

    var count = 0;
    req.on("readystatechange", function() {
      // Count call for state OPENED
      if (req.readyState == 1) {
        count = count + 1;
      }

      // Assert when DONE
      if (req.readyState == 4) {
        // onreadystatechange should only be called
        // once for state OPENED
        assert.equal(1, count);
        done();
      }
    });
    openAndSend("GET", noCache(url));

  });


  it("not call onreadystatechange when aborting OPENED", function(done) {
    // OPENED, without send flag
    var url = "../resource/qx/test/xmlhttp/sample.txt";
    req._open("GET", noCache(url));

    // after open readyState is 1
    assert.equal(req.readyState, 1);
    req.abort();

    setTimeout(function() {
      // after abort readyState is 0
      assert.equal(req.readyState, 0);
      done();
    }, 100);
  });


  it("call onreadystatechange when aborting LOADING", function(done) {
    // TODO: Maybe use FakeServer instead
    if (qx.core.Environment.get("browser.name") == "ie" &&
      qx.core.Environment.get("browser.documentmode") < 10)
    {
      done();
      return;
    }

    req.on("readystatechange", function() {
      if (req.readyState == 4) {
        done();
      }
    });

    // Will "never" complete
    // OPENED, finally LOADING
    var url = "../resource/qx/test/xmlhttp/loading.php";
    req._open("GET", url + "?duration=120");
    req._send();

    window.setTimeout(function() {
      req.abort();
    }, 30);

  });


  it("call onloadend when aborting LOADING", function(done) {
    this.timeout(200);

    // TODO: Maybe use FakeServer instead
    if (qx.core.Environment.get("browser.name") == "ie" &&
      qx.core.Environment.get("browser.documentmode") < 10)
    {
      done();
      return;
    }

    req.on("loadend", function() {
      done();
    });

    // Will "never" complete
    // OPENED, finally LOADING
    var url = "../resource/qx/test/xmlhttp/loading.php";
    openAndSend("GET", url + "?duration=130");
    req.abort();
  });

  //
  // onerror()
  //

  it("call onerror on network error", function(done) {
    req.on("error", function() {
      // May take a while to detect network error
      assert.equal(4, req.readyState);
      done();
    });

    openAndSend("GET", "http://fail.tld");
  });


  it("throw error on network error when sync", function() {
    // Network error (sync)
    openAndSend("GET", "http://fail.tld", false);

    assert.throw(function() {
      try {
        req.send();
      } catch (e) {
        throw Error();
      }
    });
  });

  //
  // ontimeout()
  //


  it("not call ontimeout when DONE and sync", function(done) {
    var url = "../resource/qx/test/xmlhttp/sample.txt";

    // Assume that request completes in given interval
    req.timeout = 400;

    var spy = sinonSandbox.spy(req, "_onTimeout");

    req._open("GET", url, false);
    req._send();
    setTimeout(function() {
      sinon.assert.notCalled(spy);
      done();
    }, 500);
  });


  it("timeout triggers timeout error", function(done) {
    // "timeout error" is specified here
    // http://www.w3.org/TR/XMLHttpRequest2/#timeout-error
    var globalStack = [];
    var expected = [
      "readystatechange",
      "changePhase",
      "timeout",
      "changePhase",
      "fail",
      "loadend"
    ];
    var url = "http://lkhfdsukfahdsiaufh";

    var fakeServer = qx.dev.FakeServer.getInstance();
    fakeServer.getFakeServer().autoRespondAfter = 200;
    fakeServer.respondWith("GET", url, "");

    var req = new qx.io.request.Xhr(url, "GET");
    req.timeout = 10;
    req.on("loadend", function() {
      qx.dev.FakeServer.getInstance().restore();
      qx.dev.FakeServer.getInstance().getFakeServer().autoRespondAfter = 10;
      assert.deepEqual(globalStack, expected);
      done();
    });
    req.send();

    var emitOrig = req.emit;
    sinonSandbox.stub(req, "emit", function(evt, data) {
      globalStack.push(evt);
      emitOrig.call(req, evt, data);
    });
  });


  it("timeout not call onabort", function(done) {
    // TODO: Maybe use FakeServer instead

    var url = "../resource/qx/test/xmlhttp/loading.php",
      globalStack = [];

    req.on("timeout", function() {
      assert.isTrue(globalStack.indexOf("abort") === -1);
      done();
    });

    req.timeout = 100;

    var emitOrig = req.emit;
    sinonSandbox.stub(req, "emit", function(evt) {
      globalStack.push(evt);
      emitOrig.call(this, evt);
    });

    req._open("GET", url + "?duration=110");
    req._send();
  });

  //
  // onloadend()
  //

  it("call onloadend on network error", function(done) {
    req.on("loadend", function() {
      // May take a while to detect network error
      setTimeout(function() {
        done();
      }, 100);
    });

    openAndSend("GET", "http://fail.tld");
  });

  //
  // Call order
  //

  it("call handlers in order when request successful", function(done) {
    var url = "../resource/qx/test/xmlhttp/sample.txt";

    var globalStack = [];
    var expected = [
      "readystatechange",
      "readystatechange",
      "readystatechange",
      "changePhase",
      "readystatechange",
      "changePhase",
      "changeResponse",
      "changePhase",
      "success",
      "load",
      "loadend"
    ];

    req.on("loadend", function() {
      assert.deepEqual(expected, globalStack);
      done();
    });

    var emitOrig = req.emit;
    sinonSandbox.stub(req, "emit", function(evt) {
      globalStack.push(evt);
      emitOrig.call(this, evt);
    });

    openAndSend("GET", url);
  });


  it("call handler in order when request failed", function(done) {
    var globalStack = [];

    var expected = [
      "readystatechange",
      "readystatechange",
      "changePhase",
      "error",
      "fail",
      "loadend"
    ];
    if (qxWeb.env.get("engine.name") == "gecko") {
      // different readyState sequence in Firefox, see bug #8924
      expected.unshift("readystatechange");
    }

    req.on("loadend", function() {
      // May take a while to detect network error
      setTimeout(function() {
        assert.deepEqual(globalStack, expected);
        done();
      }, 500);
    });
    var emitOrig = req.emit;
    sinonSandbox.stub(req, "emit", function(evt) {
      globalStack.push(evt);
      emitOrig.call(this, evt);
    });

    req._open("GET", "http://fail.tld");
    req._send();
  });

  //
  // Disposing
  //

  it("dispose hard-working", function(done) {
    var url = "../resource/qx/test/xmlhttp/sample.txt";
    req._open("GET", noCache(url));

    req.on("readystatechange", function() {
      if (req.readyState == 4) {
        // Must not throw error
        req.dispose();
        done();
      }
    });
    req._send();
  });


  function openAndSend(method, url, data) {
    // use API of io.XHR only
    req._open(method, url);
    if (data) {
      req._send(data);
    } else {
      req._send();
    }

    // use API of io.AbstractRequest
    /*
    this.req.setMethod(method);
    this.req.setUrl(url);
    if (data) {
      this.req.setRequestData(data);
    }
    this.req.send()
    */
  }


  function noCache(url) {
    return url + "?nocache=" + (new Date()).valueOf();
  }

});

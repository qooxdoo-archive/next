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
 *
 * @asset(qx/test/xmlhttp/*)
 */

describe("bom.request.XhrWithRemote", function() {

  var req;

  beforeEach(function() {
    req = new qx.bom.request.Xhr();
  });

  afterEach(function() {
    req.dispose();
  });

  function __skip(skipOs) {
    // certain tests fail if loaded through the Selenium proxy on Windows and OS X
    if (qx.core.Environment.get("browser.name") == "chrome" &&
      qx.lang.Array.contains(skipOs, qx.core.Environment.get("os.name"))) {
      ////require(["noSelenium"]);
    }
  }

  //
  // Basic
  //

  it("GET with event attribute handler", function(done) {

    var url = ("../resource/qx/test/xmlhttp/sample.txt");
    req.open("GET", noCache(url));

    req.onreadystatechange = function() {
      if (req.readyState == 4) {
        setTimeout(function() {
          assert.equal(req.responseText, "SAMPLE");
          done();
        }, 0);
      }
    };
    req.send();
  });


  it("GET with event", function(done) {

    var url = ("../resource/qx/test/xmlhttp/sample.txt");
    req.open("GET", noCache(url));

    var onreadystatechange = function() {
      if (req.readyState == 4) {
        setTimeout(function() {
          assert.equal(req.responseText, "SAMPLE");
          done();
        }, 0);
      }
    };
    req.on("readystatechange", onreadystatechange);
    req.send();
  });


  it("GET XML", function(done) {

    var url = ("../resource/qx/test/xmlhttp/sample.xml");

    req.open("GET", noCache(url));

    req.onreadystatechange = function() {
      if (req.readyState == 4) {
        setTimeout(function() {
          assert.isObject(req.responseXML.documentElement, "Must be XML object");
          done();
        }, 0);
      }
    };
    req.send();
  });


  it("handle arbitrary XML", function(done) {
    //require(["php"]);

    // Content-Type: foo/bar+xml
    var url = ("../resource/qx/test/xmlhttp/xml.php");

    req.open("GET", noCache(url));

    req.onreadystatechange = function() {
      if (req.readyState == 4) {
        setTimeout(function() {
          assert.isObject(req.responseXML.documentElement, "Must be XML object");
          done();
        }, 0);
      }
    };
    req.send();
  });


  it("handle invalid XML", function(done) {
    var url = ("../resource/qx/test/xmlhttp/invalid.xml");

    req.onreadystatechange = function() {
      if (req.readyState == 4) {
        setTimeout(function() {
          req.responseXML;
          done();
        }, 0);
      }
    };

    req.open("GET", url);
    req.send();
  });


  it("POST", function(done) {
    //require(["php"]);


    var url = ("../resource/qx/test/xmlhttp/echo_post_request.php");
    req.open("POST", noCache(url));
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    req.onreadystatechange = function() {
      if (req.readyState == 4) {
        setTimeout(function() {
          assert.equal('{"affe":"true"}', req.responseText);
          done();
        }, 0);
      }
    };
    req.send("affe=true");

  });

  it("have readyState UNSENT", function() {

    assert.strictEqual(0, req.readyState);
  });


  it("have readyState OPENED", function() {
    //require(["php"]);


    var url = ("../resource/qx/test/xmlhttp/echo_post_request.php");
    req.open("GET", noCache(url));

    assert.strictEqual(1, req.readyState);
  });


  it("abort pending request", function() {
    //require(["php"]);


    var url = ("../resource/qx/test/xmlhttp/echo_get_request.php");

    req.open("GET", noCache(url));
    req.abort();

    assert.notEqual(4, req.readyState, "Request must not complete");
  });


  it("have status 200 when modified", function(done) {
    //require(["php"]);
    var url = ("../resource/qx/test/xmlhttp/echo_get_request.php");

    // Make sure resource is not served from cache
    req.open("GET", noCache(url));

    req.onreadystatechange = function() {
      if (req.readyState == 4) {
        setTimeout(function() {
          assert.equal(200, req.status);
          done();
        }, 0);
      }
    };
    req.send();
  });


  it("validate freshness", function(done) {
    //require(["php", "noIe"]);
    var url = ("../resource/qx/test/xmlhttp/time.php");

    var send = function() {
      req.open("GET", url);
      req.send();
    };

    var count = 0;
    var results = [];
    req.onload = function() {
      count += 1;
      results.push(req.responseText);
      if (count < 2) {
        send();
      } else {
        setTimeout(function() {
          assert.notEqual(results[0], results[1], "Response must differ");
          done();
        }, 0);
      }
    };

    send();

  });

  //

  //it("GET simultaneously", function(done) {
  //   var count = 1,
  //       upTo = 20,
  //       startedAt = new Date(),
  //       duration = 0,
  //       that = this;
  //
  //   for (var i=0; i<upTo; i++) {
  //     (function() {
  //       var req = new qx.bom.request.Xhr(),
  //           url = noCache(getUrl("qx/test/xmlhttp/loading.php")) + "&duration=2";
  //
  //       req.onreadystatechange = function() {
  //         if (req.readyState != 4) {
  //           return;
  //         }
  //
  //         setTimeout(function () {
  //
  //           // In seconds
  //           duration = (new Date() - startedAt) / 1000;
  //           debug("Request #" + count + " completed (" +  duration + ")");
  //
  //           if (count == upTo) {
  //             return;
  //           }
  //
  //           ++count;
  //
  //         });
  //       }
  //
  //       req.open("GET", url);
  //       req.send();
  //     })();
  //   }
  //
  //   // Provided two concurrent requests are made (each 6s), 20 requests
  //   // (i.e. 10 packs of requests) should complete after 60s
  //   wait(15000 + 1000);
  // },

  it("open throws error with insecure method", function() {
    var url = ("../resource/qx/test/xmlhttp/sample.txt");

    assert.throw(function() {
      // Type of error is of no interest
      try {
        req.open("TRACE", url);
      } catch (e) {
        throw Error();
      }
    });
  });


  it("overrideMimeType content type unchanged", function(done) {
    //require(["php", "noIe"]);

    var onloadAssertContentTypeUnchanged = function() {
      setTimeout(function() {
        assert.equal("text/html;charset=iso-8859-1", req.getResponseHeader("Content-Type"));
        assert.equal("ƒeƒXƒg", req.responseText);
        done();
      }, 0);
    };

    var query = "?type=" + encodeURIComponent("text/html;charset=iso-8859-1") + "&content=%83%65%83%58%83%67";
    var url = ("../resource/qx/test/xmlhttp/get_content.php") + query;

    req.onload = onloadAssertContentTypeUnchanged;
    req.open("GET", url);
    req.send();

  });


  it("overrideMimeType content type override", function(done) {
    //require(["php", "noIe"]);

    var onloadAssertContentTypeOverride = function() {
      setTimeout(function() {
        // may or may not work - see API docs of overrideMimeType
        // assert.equal("text/plain;charset=Shift-JIS", req.getResponseHeader("Content-Type"));
        assert.equal("テスト", req.responseText);
        done();
      }, 0);
    };

    var query = "?type=" + encodeURIComponent("text/html;charset=iso-8859-1") + "&content=%83%65%83%58%83%67";
    var url = ("../resource/qx/test/xmlhttp/get_content.php") + query;

    req.onload = onloadAssertContentTypeOverride;
    req.open("GET", url);
    req.overrideMimeType("text/plain;charset=Shift-JIS");
    req.send();

  });

  // BUGFIXES

  it("progress to readyState DONE", function(done) {
    // This is a mess, see
    // http://www.quirksmode.org/blog/archives/2005/09/xmlhttp_notes_r_2.html.
    var states = [];

    req.onreadystatechange = function() {
      states.push(req.readyState);
      if (req.readyState == 4) {
        setTimeout(function() {
          assert.deepEqual([1, 2, 3, 4], states);
          done();
        }, 0);
      }
    };

    var url = ("../resource/qx/test/xmlhttp/sample.txt");
    req.open("GET", noCache(url));
    req.send();
  });


  it("progress to readyState DONE when sync", function() {
    var states = [];

    req.onreadystatechange = function() {
      states.push(req.readyState);
    };

    var url = ("../resource/qx/test/xmlhttp/sample.txt");
    req.open("GET", noCache(url), false);
    req.send();

    // There is no HEADERS_RECEIVED and LOADING when sync.
    // See http://www.w3.org/TR/XMLHttpRequest/#the-send-method
    assert.deepEqual([1, 4], states);
  });


  it("progress to readyState DONE when from cache", function(done) {
    var primeReq = req,
      url = noCache(("../resource/qx/test/xmlhttp/sample.txt")),
      states = [],
      count = 0;


    primeReq.onreadystatechange = function() {
      if (primeReq.readyState == 4) {

        setTimeout(function() {
          // From cache with new request
          var req = new qx.bom.request.Xhr();

          req.onreadystatechange = function() {
            states.push(req.readyState);
            if (req.readyState == 4) {
              setTimeout(function() {
                assert.deepEqual([1, 2, 3, 4], states);
                done();
              }, 0);
            }
          };

          req.open("GET", url);
          req.send();


        });
      }
    };

    // Prime cache
    primeReq.open("GET", url);
    primeReq.send();
  });


  it("have status 304 when cache is fresh", function(done) {
    //require(["php"]);


    var url = ("../resource/qx/test/xmlhttp/not_modified.php");

    req.onreadystatechange = function() {
      if (req.readyState == 4) {
        setTimeout(function() {
          assert.strictEqual(304, req.status);
          done();
        }, 0);
      }
    };
    req.open("GET", url);

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
    req.send();
  });


  it("allow many requests with same object", function(done) {

    var url = ("../resource/qx/test/xmlhttp/sample.txt");
    var count = 0;

    function request() {
      req.open("GET", noCache(url));
      req.send();
    }

    req.onreadystatechange = function() {
      if (req.readyState == 4) {
        setTimeout(function() {
          if (++count < 3) {
            request();

          } else {
            assert.equal(3, count);
          }
          done();
        }, 0);
      }
    };
    request();
  });

  //
  // onreadystatechange()
  //

  it("call onreadystatechange for OPEN", function(done) {

    var url = ("../resource/qx/test/xmlhttp/sample.txt");

    var count = 0;
    req.onreadystatechange = function() {
      // Count call for state OPENED
      if (req.readyState == 1) {
        count = count + 1;
      }

      // Assert when DONE
      if (req.readyState == 4) {
        setTimeout(function() {
          // onreadystatechange should only be called
          // once for state OPENED
          assert.equal(1, count);
          done();
        }, 0);
      }
    };
    req.open("GET", noCache(url));
    req.send();
  });


  it("not call onreadystatechange when aborting OPENED", function(done) {


    // OPENED, without send flag
    var url = ("../resource/qx/test/xmlhttp/sample.txt");
    req.open("GET", noCache(url));

    sinon.spy(req, "onreadystatechange");
    req.abort();

    setTimeout(function() {
      sinon.assert.notCalled(req.onreadystatechange);
      done();
    }, 100);
  });


  it("call onreadystatechange when aborting LOADING", function(done) {
    //require(["php", "noIe9"]);

    req.onreadystatechange = function() {
      if (req.readyState == 4) {
        setTimeout(function() {
          done();
        }, 0);
      }
    };

    // Will "never" complete
    // OPENED, finally LOADING
    var url = ("../resource/qx/test/xmlhttp/loading.php");
    req.open("GET", url + "?duration=100");
    req.send();

    window.setTimeout(function() {
      req.abort();
    }, 0);
  });


  it("call onloadend when aborting LOADING", function(done) {
    //require(["php", "noIe9"]);
    req.onloadend = function() {
      setTimeout(function() {
        done();
      }, 10);
    };

    // Will "never" complete
    // OPENED, finally LOADING
    var url = ("../resource/qx/test/xmlhttp/loading.php");
    req.open("GET", url + "?duration=100");
    req.send();

    window.setTimeout(function() {
      req.abort();
    }, 0);
  });

  //
  // onerror()
  //

  it("call onerror on network error", function(done) {
    // this.timeout(15000);
    __skip(["win", "osx"]);

    req.onerror = function() {
      setTimeout(function() {
        assert.equal(4, req.readyState);
        done();
      }, 10);
    };

    // Network error (async)
    // Is sync in Opera >= 11.5
    window.setTimeout(function() {
      req.open("GET", "http://fail.tld");
      req.send();
    }, 0);

    // May take a while to detect network error
  });


  it("call onerror on file error", function(done) {
    //require(["file"]);
    req.onerror = function() {
      setTimeout(function() {
        assert.equal(4, req.readyState);
        done();
      }, 10);
    };
    window.setTimeout(function() {
      req.open("GET", "not-found");
      req.send();
    }, 0);
  });


  it("throw error on network error when sync", function() {
    __skip(["win", "osx"]);
    // Network error (sync)
    req.open("GET", "http://fail.tld", false);

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

    var url = ("../resource/qx/test/xmlhttp/sample.txt");
    sinon.spy(req, "ontimeout");

    // Assume that request completes in given interval
    req.timeout = 400;

    req.open("GET", url, false);
    req.send();

    setTimeout(function() {
      sinon.assert.notCalled(req.ontimeout);
      done();
    }, 500);
  });


  it("timeout triggers timeout error", function(done) {
    // "timeout error" is specified here
    // http://www.w3.org/TR/XMLHttpRequest2/#timeout-error

    //require(["php"]);

    var url = ("../resource/qx/test/xmlhttp/loading.php");


    req.onloadend = function() {
      setTimeout(function() {
        assert.equal(4, req.readyState);
        assert.strictEqual("", req.responseText);
        assert.strictEqual(null, req.responseXML);
        sinon.assert.callOrder(req.onreadystatechange, req.ontimeout, req.onloadend);
        done();
      }, 150);
    };

    req.timeout = 100;
    req.open("GET", url + "?duration=100");
    req.send();

    sinon.spy(req, "onreadystatechange");
    sinon.spy(req, "onerror");
    sinon.spy(req, "ontimeout");
    sinon.spy(req, "onloadend");
  });


  it("timeout not call onabort", function(done) {
    //require(["php"]);
    var url = ("../resource/qx/test/xmlhttp/loading.php");

    req.ontimeout = function() {
      setTimeout(function() {
        sinon.assert.notCalled(req.onabort);
        done();
      }, 10);
    };

    req.timeout = 100;
    req.open("GET", url + "?duration=100");
    req.send();
    sinon.spy(req, "onabort");
  });

  //
  // onloadend()
  //

  it("call onloadend on network error", function(done) {
    req.onloadend = function() {
      setTimeout(function() {
        done();
      }, 10);
    };
    // Network error
    // Is sync in Opera >= 11.5
    window.setTimeout(function() {
      req.open("GET", "http://fail.tld");
      req.send();
    }, 0);

    // May take a while to detect network error
  });

  //
  // Call order
  //

  it("call handlers in order when request successful", function(done) {

    var url = ("../resource/qx/test/xmlhttp/sample.txt");

    req.onloadend = function() {
      setTimeout(function() {
        sinon.assert.callOrder(
          req.onreadystatechange,
          req.onload,
          req.onloadend);
        done();
      }, 0);
    };
    sinon.spy(req, "onreadystatechange");
    sinon.spy(req, "onload");
    sinon.spy(req, "onloadend");
    req.open("GET", url);
    req.send();
  });


  it("call handler in order when request failed", function(done) {
    __skip(["win", "osx"]);

    req.onloadend = function() {
      setTimeout(function() {
        sinon.assert.callOrder(req.onreadystatechange, req.onerror, req.onloadend);
        done();
      }, 10);
    };
    sinon.spy(req, "onreadystatechange");
    sinon.spy(req, "onerror");
    sinon.spy(req, "onloadend");

    // Is sync in Opera >= 11.5
    window.setTimeout(function() {
      req.open("GET", "http://fail.tld");
      req.send();
    }, 0);

    // May take a while to detect network error
  });

  //
  // Disposing
  //

  it("dispose hard-working", function(done) {

    var url = ("../resource/qx/test/xmlhttp/sample.txt");
    req.open("GET", noCache(url));

    req.onreadystatechange = function() {
      if (req.readyState == 4) {
        setTimeout(function() {
          // Must not throw error
          req.dispose();
          done();
        }, 100);
      }
    };
    req.send();
  });


  function noCache(url) {
    return url + "?nocache=" + (new Date()).valueOf();
  }


  function hasNoIe() {
    return !(qx.core.Environment.get("engine.name") == "mshtml");
  }


  function hasNoIe9() {
    return (qx.core.Environment.get("engine.name") !== "mshtml" ||
      qx.core.Environment.get("browser.documentmode") !== 9);
  }


  function hasFile() {
    return location.protocol === "file:";
  }

});
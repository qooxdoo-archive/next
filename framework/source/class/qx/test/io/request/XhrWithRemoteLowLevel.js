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

qx.Class.define("qx.test.io.request.XhrWithRemoteLowLevel",
{
  extend : qx.dev.unit.TestCase,

  include : [qx.test.io.MRemoteTest,
             qx.dev.unit.MMock,
             qx.dev.unit.MRequirements],

  construct : function()
  {
    this.initMMock();
  },

  members :
  {

    req : null,

    setUp: function() {
      this.req = new qx.io.request.Xhr();
    },

    tearDown: function() {
      this.req.dispose();
    },

    __skip : function(skipOs) {
      // certain tests fail if loaded through the Selenium proxy on Windows and OS X
      if (qx.core.Environment.get("browser.name") == "chrome" &&
          qx.lang.Array.contains(skipOs, qx.core.Environment.get("os.name")))
      {
        this.require(["noSelenium"]);
      }
    },

    //
    // Basic
    //

    "test: GET with event attribute handler": function() {
      var req = this.req;
      var url = this.getUrl("qx/test/xmlhttp/sample.txt");

      var that = this;
      req.on("readystatechange", function() {
        if (req.readyState == 4) {
          that.resume(function() {
            that.assertEquals(req.responseText, "SAMPLE");
          });
        }
      });
      this.openAndSend("GET", this.noCache(url));

      this.wait();
    },

    "test: GET with event": function() {
      var req = this.req;
      var url = this.getUrl("qx/test/xmlhttp/sample.txt");

      var that = this;
      var onreadystatechange = function() {
        if (req.readyState == 4) {
          that.resume(function() {
            that.assertEquals(req.responseText, "SAMPLE");
          });
        }
      };
      req.on("readystatechange", onreadystatechange);
      this.openAndSend("GET", this.noCache(url));

      this.wait();
    },

    "test: GET XML": function() {
      var req = this.req;
      var url = this.getUrl("qx/test/xmlhttp/sample.xml");

      var that = this;
      req.on("readystatechange", function() {
        if (req.readyState == 4) {
          that.resume(function() {
            that.assertObject(req.responseXML.documentElement, "Must be XML object");
          });
        }
      });
      this.openAndSend("GET", this.noCache(url));

      this.wait();
    },

    "test: handle arbitrary XML": function() {
      this.require(["php"]);

      // Content-Type: foo/bar+xml
      var url = this.getUrl("qx/test/xmlhttp/xml.php");

      var req = this.req;

      var that = this;
      req.on("readystatechange", function() {
        if (req.readyState == 4) {
          that.resume(function() {
            that.assertObject(req.responseXML.documentElement, "Must be XML object");
          });
        }
      });
      this.openAndSend("GET", this.noCache(url));

      this.wait();
    },

    "test: handle invalid XML": function() {
      var url = this.getUrl("qx/test/xmlhttp/invalid.xml"),
          req = this.req,
          that = this;

      req.on("readystatechange", function() {
        if (req.readyState == 4) {
          that.resume(function() {
            req.responseXML;
          });
        }
      });

      this.openAndSend("GET", url);

      this.wait();
    },

    "test: POST": function() {
      this.require(["php"]);

      var req = this.req;
      var url = this.getUrl("qx/test/xmlhttp/echo_post_request.php");
      req._open("POST", this.noCache(url));
      req._setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      var that = this;
      req.on("readystatechange", function() {
        if (req.readyState == 4) {
          that.resume(function() {
            that.assertEquals('{"affe":"true"}', req.responseText);
          });
        }
      });
      req._send("affe=true");

      this.wait();
    },

    "test: have readyState UNSENT": function() {
      var req = this.req;
      this.assertIdentical(0, req.readyState);
    },

    "test: have readyState OPENED": function() {
      this.require(["php"]);

      var req = this.req;
      var url = this.getUrl("qx/test/xmlhttp/echo_post_request.php");
      req._open("GET", this.noCache(url));

      this.assertIdentical(1, req.readyState);
    },

    "test: abort pending request": function() {
      this.require(["php"]);

      var req = this.req;
      var url = this.getUrl("qx/test/xmlhttp/echo_get_request.php");

      req._open("GET", this.noCache(url));
      req.abort();

      this.assertNotEquals(4, req.readyState, "Request must not complete");
    },

    "test: have status 200 when modified": function() {
      this.require(["php"]);

      var req = this.req;
      var url = this.getUrl("qx/test/xmlhttp/echo_get_request.php");

      var that = this;
      req.on("readystatechange", function() {
        if (req.readyState == 4) {
          that.resume(function() {
            that.assertEquals(200, req.status);
          });
        }
      });
      // Make sure resource is not served from cache
      this.openAndSend("GET", this.noCache(url));

      this.wait();
    },

    "test: validate freshness": function() {
      this.require(["php", "noIe"]);

      var req = this.req;
      var url = this.getUrl("qx/test/xmlhttp/time.php");

      var send = function() {
        req._open("GET", url);
        req._send();
      };

      var that = this;
      var count = 0;
      var results = [];
      req.on("load", function() {
        count += 1;
        results.push(req.responseText);
        if (count < 2) {
          send();
        } else {
          that.resume(function() {
            that.assertNotEquals(results[0], results[1], "Response must differ");
          });
        }
      });

      send();
      this.wait();
    },

    "test: open throws error with insecure method": function() {
      var req = this.req,
          url = this.getUrl("qx/test/xmlhttp/sample.txt");

      this.assertException(function() {
        // Type of error is of no interest
        try {
          req._open("TRACE", url);
        } catch(e) {
          throw Error();
        }
      });
    },

    "test: overrideMimeType content type unchanged": function() {
      this.require(["php", "noIe"]);

      var req = this.req,
          that = this;

      var onloadAssertContentTypeUnchanged = function() {
        that.resume(function() {
          that.assertEquals("text/html;charset=iso-8859-1", req.getResponseHeader("Content-Type"));
          that.assertEquals("ƒeƒXƒg", req.responseText);
        });
      };

      var query = "?type="+encodeURIComponent("text/html;charset=iso-8859-1")+"&content=%83%65%83%58%83%67";
      var url = this.getUrl("qx/test/xmlhttp/get_content.php") + query;

      req.on("load", onloadAssertContentTypeUnchanged);
      this.openAndSend("GET", url);
      this.wait();
    },


    "test: overrideMimeType content type override": function() {
      this.require(["php", "noIe"]);

      var req = this.req,
          that = this;

      var onloadAssertContentTypeOverride = function() {
        that.resume(function() {
          // may or may not work - see API docs of overrideMimeType
          // that.assertEquals("text/plain;charset=Shift-JIS", req.getResponseHeader("Content-Type"));
          that.assertEquals("テスト", req.responseText);
        });
      };

      var query = "?type="+encodeURIComponent("text/html;charset=iso-8859-1")+"&content=%83%65%83%58%83%67";
      var url = this.getUrl("qx/test/xmlhttp/get_content.php") + query;

      req.on("load",onloadAssertContentTypeOverride);
      this.openAndSend("GET", url);
      req.overrideMimeType("text/plain;charset=Shift-JIS");
      this.wait();
    },

    // BUGFIXES

    "test: progress to readyState DONE": function() {
      // This is a mess, see
      // http://www.quirksmode.org/blog/archives/2005/09/xmlhttp_notes_r_2.html.

      var req = this.req,
          states = [],
          that = this;

      req.on("readystatechange", function() {
        states.push(req.readyState);
        if (req.readyState == 4) {
          that.resume(function() {
            that.assertArrayEquals([1, 2, 3, 4], states);
          });
        }
      });

      var url = this.getUrl("qx/test/xmlhttp/sample.txt");
      this.openAndSend("GET", this.noCache(url));

      this.wait();
    },

    "test: progress to readyState DONE when sync": function() {
      var req = this.req,
          states = [];

      req.on("readystatechange", function() {
        states.push(req.readyState);
      });

      var url = this.getUrl("qx/test/xmlhttp/sample.txt");
      req._open("GET", this.noCache(url), false);
      req._send();

      // There is no HEADERS_RECEIVED and LOADING when sync.
      // See http://www.w3.org/TR/XMLHttpRequest/#the-send-method
      this.assertArrayEquals([1, 4], states);
    },

    "test: progress to readyState DONE when from cache": function() {
      var primeReq = this.req,
          url = this.noCache(this.getUrl("qx/test/xmlhttp/sample.txt")),
          states = [],
          count = 0,
          that = this;

      primeReq.on("readystatechange", function() {
        if (primeReq.readyState == 4) {

          that.resume(function() {
            // From cache with new request
            var req = new qx.io.request.Xhr();

            req.on("readystatechange", function() {
              states.push(req.readyState);
              if (req.readyState == 4) {
                that.resume(function() {
                  that.assertArrayEquals([1, 2, 3, 4], states);
                });
              }
            });

            req._open("GET", url);
            req._send();

            that.wait();
          });
        }
      });

      // Prime cache
      primeReq._open("GET", url);
      primeReq._send();

      this.wait();
    },

    "test: have status 304 when cache is fresh": function() {
      this.require(["php"]);

      var req = this.req;
      var url = this.getUrl("qx/test/xmlhttp/not_modified.php");

      var that = this;
      req.on("readystatechange", function() {
        if (req.readyState == 4) {
          that.resume(function() {
            that.assertIdentical(304, req.status);
          });
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

      this.wait();
    },

    "test: allow many requests with same object": function() {
      var req = this.req;
      var url = this.getUrl("qx/test/xmlhttp/sample.txt");
      var count = 0;

      var that = this;
      function request() {
        req._open("GET", that.noCache(url));
        req._send();
      }

      req.on("readystatechange", function() {
        if (req.readyState == 4) {
          that.resume(function() {
            if (++count < 3) {
              request();
              this.wait();
            } else {
              that.assertEquals(3, count);
            }
          });
        }
      });
      request();

      this.wait();
    },

    //
    // onreadystatechange()
    //

    "test: call onreadystatechange for OPEN": function() {
      var req = this.req;
      var url = this.getUrl("qx/test/xmlhttp/sample.txt");

      var that = this;
      var count = 0;
      req.on("readystatechange", function() {
        // Count call for state OPENED
        if (req.readyState == 1) {
          count = count + 1;
        }

        // Assert when DONE
        if (req.readyState == 4) {
          that.resume(function() {
            // onreadystatechange should only be called
            // once for state OPENED
            that.assertEquals(1, count);
          });
        }
      });

      this.openAndSend("GET", this.noCache(url));

      this.wait();
    },

    "test: not call onreadystatechange when aborting OPENED": function() {
      var req = this.req;

      // OPENED, without send flag
      var url = this.getUrl("qx/test/xmlhttp/sample.txt");
      req._open("GET", this.noCache(url));

      // after open readyState is 1
      this.assertEquals(req.readyState, 1);
      req.abort();

      this.wait(100, function() {
        // after abort readyState is 0
        this.assertEquals(req.readyState, 0);
      }, this);
    },

    "test: call onreadystatechange when aborting LOADING": function() {
      this.require(["php", "noIe9"]);

      var req = this.req;
      var that = this;

      req.on("readystatechange", function() {
        if (req.readyState == 4) {
          that.resume();
        }
      });

      // Will "never" complete
      // OPENED, finally LOADING
      var url = this.getUrl("qx/test/xmlhttp/loading.php");
      req._open("GET", url + "?duration=100");
      req._send();

      window.setTimeout(function() {
        req.abort();
      }, 0);

      this.wait();
    },

    "test: call onloadend when aborting LOADING": function() {
      this.require(["php", "noIe9"]);

      var req = this.req;
      var that = this;

      req.on("loadend", function() {
        that.resume();
      });

      // Will "never" complete
      // OPENED, finally LOADING
      var url = this.getUrl("qx/test/xmlhttp/loading.php");
      this.openAndSend("GET", url + "?duration=100");

      window.setTimeout(function() {
        req.abort();
      }, 0);

      this.wait(15000);
    },

    //
    // onerror()
    //

    "test: call onerror on network error": function() {
      this.__skip(["win", "osx"]);
      var req = this.req;

      var that = this;
      req.on("error", function() {
        that.resume(function() {
          that.assertEquals(4, req.readyState);
        });
      });

      // Network error (async)
      // Is sync in Opera >= 11.5
      window.setTimeout(function() {
        this.openAndSend("GET", "http://fail.tld");
      }.bind(this), 0);

      // May take a while to detect network error
      this.wait(15000);
    },

    "test: call onerror on file error": function() {
      this.require(["file"]);

      var req = this.req;

      var that = this;
      req.on("error", function() {
        that.resume(function() {
          that.assertEquals(4, req.readyState);
        });
      });

      this.openAndSend("GET", "not-found");

      this.wait();
    },

    "test: throw error on network error when sync": function() {
      this.__skip(["win", "osx"]);
      var req = this.req;

      // Network error (sync)
      this.openAndSend("GET", "http://fail.tld", false);

      this.assertException(function() {
        try {
          req.send();
        } catch(e) {
          throw Error();
        }
      });
    },

    //
    // ontimeout()
    //

    "test: not call ontimeout when DONE and sync": function() {
      var req = this.req;
      var url = this.getUrl("qx/test/xmlhttp/sample.txt");

      // Assume that request completes in given interval
      req.timeout = 400;

      req._open("GET", url, false);
      req._send();

      this.wait(function() {
        this.assertNull(req.__timerId);
      }, 500, this);
    },

    "test: timeout triggers timeout error": function() {
      // "timeout error" is specified here
      // http://www.w3.org/TR/XMLHttpRequest2/#timeout-error

      this.require(["php"]);

      var req = this.req,
          url = this.getUrl("qx/test/xmlhttp/loading.php"),
          that = this,
          globalStack = [];

      req.on("loadend", function() {
        that.resume(function() {
          that.assertEquals(4, req.readyState);
          that.assertIdentical("", req.responseText);
          that.assertIdentical(null, req.responseXML);
          var expected = ["readystatechange",
                          "readystatechange",
                          "changePhase",
                          "readystatechange",
                          "changePhase",
                          "changeResponse",
                          "changePhase",
                          "success",
                          "timeout",
                          "changePhase",
                          "fail",
                          "loadend"];
          that.assertArrayEquals(expected, globalStack);
        });
      });

      req.timeout = 10;
      req._open("GET", url + "?duration=10");
      req._send();

      var emitOrig = req.emit;
      this.stub(req, "emit", function(evt) {
        globalStack.push(evt);
        emitOrig.call(this, evt);
      });

      this.wait();
    },

    "test: timeout not call onabort": function() {
      this.require(["php"]);

      var req = this.req,
          url = this.getUrl("qx/test/xmlhttp/loading.php"),
          that = this,
          globalStack = [];

      req.on("timeout", function() {
        that.resume(function() {
          that.assertTrue(globalStack.indexOf("abort") === -1);
        });
      });

      req.timeout = 100;

      var emitOrig = req.emit;
      this.stub(req, "emit", function(evt) {
        globalStack.push(evt);
        emitOrig.call(this, evt);
      });

      req._open("GET", url + "?duration=100");
      req._send();

      this.wait();
    },

    //
    // onloadend()
    //

    "test: call onloadend on network error": function() {
      var req = this.req;

      var that = this;
      req.on("loadend", function() {
        that.resume();
      });

      // Network error
      // Is sync in Opera >= 11.5
      window.setTimeout(function() {
        this.openAndSend("GET", "http://fail.tld");
      }.bind(this), 0);

      // May take a while to detect network error
      this.wait(15000);
    },

    //
    // Call order
    //

    "test: call handlers in order when request successful": function() {
      var req = this.req;
      var url = this.getUrl("qx/test/xmlhttp/sample.txt");

      var globalStack = [];

      var that = this;
      req.on("loadend", function() {
        that.resume(function() {
          var expected = ["readystatechange",
                          "readystatechange",
                          "readystatechange",
                          "changePhase",
                          "readystatechange",
                          "changePhase",
                          "changeResponse",
                          "changePhase",
                          "success",
                          "load",
                          "loadend"];
          that.assertArrayEquals(expected, globalStack);
        });
      });
      var emitOrig = req.emit;
      this.stub(req, "emit", function(evt) {
        globalStack.push(evt);
        emitOrig.call(this, evt);
      });
      this.openAndSend("GET", url);

      this.wait();
    },

    "test: call handler in order when request failed": function() {
      this.__skip(["win", "osx"]);
      var req = this.req;

      var globalStack = [];

      var that = this;
      req.on("loadend", function() {
        that.resume(function() {
          var expected = ["readystatechange",
                          "readystatechange",
                          "changePhase",
                          "changeResponse",
                          "error",
                          "fail",
                          "loadend"];
          that.assertArrayEquals(expected, globalStack);
        });
      });
      var emitOrig = req.emit;
      this.stub(req, "emit", function(evt) {
        globalStack.push(evt);
        emitOrig.call(this, evt);
      });

      // Is sync in Opera >= 11.5
      window.setTimeout(function() {
        req._open("GET", "http://fail.tld");
        req._send();
      }.bind(this), 0);

      // May take a while to detect network error
      this.wait(15000);
    },

    //
    // Disposing
    //

    "test: dispose hard-working": function() {
      var req = this.req;
      var url = this.getUrl("qx/test/xmlhttp/sample.txt");
      req._open("GET", this.noCache(url));

      var that = this;
      req.on("readystatechange", function() {
        if (req.readyState == 4) {
          that.resume(function() {
            // Must not throw error
            req.dispose();
          });
        }
      });
      req._send();

      this.wait();
    },

    openAndSend: function(method, url, data) {
      // use API of io.XHR only
      this.req._open(method, url);
      if (data) {
        this.req._send(data);
      } else {
        this.req._send();
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
    },

    noCache: function(url) {
      return url + "?nocache=" + (new Date()).valueOf();
    },

    hasNoIe: function() {
      return !(qx.core.Environment.get("engine.name") == "mshtml");
    },

    hasNoIe9: function() {
      return (qx.core.Environment.get("engine.name") !== "mshtml" ||
        qx.core.Environment.get("browser.documentmode") !== 9);
    },

    hasFile: function() {
      return location.protocol === "file:";
    }
  }
});

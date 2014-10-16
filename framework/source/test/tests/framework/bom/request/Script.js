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
 *
 * @asset(../resource/qx/test/jsonp_primitive.php)
 * @asset(../resource/qx/test/script.js)
 * @asset(../resource/qx/test/xmlhttp/sample.txt)
 * @ignore(SCRIPT_LOADED)
 */

describe("bom.request.Script", function()
{
  var req;
   var url;
  beforeEach (function ()  {
    req = new qx.bom.request.Script();
    url = "../resource/qx/test/script.js";
  });

  afterEach (function() {
    sinon.sandbox.restore();
    req.dispose();
  });

    //
    // General
    //

 it("create instance", function() {
      assert.isObject(req);
  });
    
  it("dispose() removes script from DOM", function() {
      var script;
      req.open();
      req.send();
      script = req._getScriptElement();
      req.dispose();

      assert.isFalse(isInDom(script));
  });

  it("isDisposed()", function() {
      assert.isFalse(req.isDisposed());
      req.dispose();
      assert.isTrue(req.isDisposed());
  });

 
  it("allow many requests with same object", function(done) {
      var count = 0;
      req.onload = function() {
        count += 1;
        if (count == 2) {
            done();
          return;
        }
        setTimeout(function() {
          request(); 
         }, 10); 
      };
      setTimeout(function() {
        request();
       }, 10);      
  });

    //
    // Event helper
    //
 
 it("call event handler", function() {
      req.onevent = sinon.spy();
      req._emit("event");
      sinon.assert.called(req.onevent);
  });  
 
  it("fire event", function() {
      var event = sinon.spy();
      req.onevent = sinon.spy();
      req.on("event", event);
      req._emit("event");
      sinon.assert.called(event);
  });

    //
    // Properties
    //   
 
  it("properties indicate success when request completed", function(done) {
      req.onload = function() {
        setTimeout(function() {
          assert.equal(4, req.readyState);
          assert.equal(200, req.status);
          assert.equal("200", req.statusText);
          done();
        },0);
      };

      request();

  });

    /**
     * @ignore(SCRIPT_LOADED)
     */
    
 
 it("status indicates success when determineSuccess returns true", function(done) {

      req.onload = function() {
        setTimeout(function() {
          assert.equal(200, req.status);
          done();
        });
      };

      req.setDetermineSuccess(function() {
        return SCRIPT_LOADED === true;
      });

      request("../resource/qx/test/script.js");
  });

    // Error handling

  it("properties indicate failure when request failed", function(done) {

      req.onerror = function() {
          console.log("onerror");
          assert.equal(4, req.readyState);
          assert.equal(0, req.status);
          assert.isNull(req.statusText);
          done();
        
      };
      setTimeout(function() {
        console.log("request");
        request("http://fail.tld");
      },10);
  });
    
  it("properties indicate failure when request timed out", function(done) {

      // Known to fail in legacy IEs
      if (isIeBelow(9)) {
        skip();
      }

      req.timeout = 25;
      req.ontimeout = function() {
        setTimeout(function() {
          assert.equal(4, req.readyState);
          assert.equal(0, req.status);
          assert.isNull(req.statusText);
          done();
        },0);
      };

      requestPending();
  });
    
  it("status indicates failure when determineSuccess returns false", function(done) {
      req.onload = function() {
        setTimeout(function() {
          assert.equal(500, req.status);
          done();
        },0);
      };

      req.setDetermineSuccess(function() {
        return false;
      });

      request();
  });
    
  it("reset XHR properties when reopened", function(done) {

      req.onload = function() {
        setTimeout(function() {
          req.open("GET", "/url");
          assert.strictEqual(1, req.readyState);
          assert.strictEqual(0, req.status);
          assert.strictEqual("", req.statusText);
          done();
        }, 0);
      };

      request();

  });

    //
    // open()
    //
 
  it("open() stores URL", function() {
      req.open("GET", url);
      assert.equal(url, req._getUrl());
  });

    //
    // send()
    //
  it("send() adds script element to DOM", function() {

      // Helper triggers send()
      request();

      assert(isInDom(req._getScriptElement()), "Script element not in DOM");
  });
    
  it("send() sets script src to URL", function() {
      request();
      assert.match(req._getScriptElement().src, /qx\/test\/script.js$/);
  });

    //
    // abort()
    //

  it("abort() removes script element", function() {
      requestPending();
      req.abort();

      assert.isFalse(isInDom(req._getScriptElement()), "Script element in DOM");
  });
    
  it("abort() makes request not fire load", function(done) {
      sinon.spy(req, "onload");

      if (isIe()) {
        request(noCache(url));
      } else {
        request();
      }

      req.abort();

      setTimeout( function() {
        sinon.assert.notCalled(req.onload);
        done();
      }, 300);
    });

    //
    // setRequestHeader()
    //

  it("setRequestHeader() throws error when other than OPENED", function() {

      assert.throw(function() {
        req.setRequestHeader();
      }, null, "Invalid state");
  });
    
  it("setRequestHeader() appends to URL", function() {
      req.open("GET", "/affe");
      req.setRequestHeader("key1", "value1");
      req.setRequestHeader("key2", "value2");

      assert.match(req._getUrl(), /key1=value1/);
      assert.match(req._getUrl(), /key2=value2/);
  });

    //
    // Event handlers
    //

  it("call onload", function(done) {

      // More precisely, the request completes when the browser
      // has loaded and parsed the script

      req.onload = function() {
        setTimeout(function() {
          done();
        }, 0);
      };

      request();
  });
    
  it("call onreadystatechange and have appropriate readyState", function(done) {
      var readyStates = [];
          

      req.onreadystatechange = function() {
        readyStates.push(req.readyState);

        if (req.readyState === 4) {
          setTimeout(function() {
            assert.deepEqual([1, 2, 3, 4], readyStates);
            done();
          },0);
        }
      };

      if (isIe()) {
        request(noCache(url));
      } else {
        request();
      }

  });

    // Error handling

  it("call onloadend on network error", function(done) {

      req.onloadend = function() {
          done();
      };
    setTimeout(function() {
      request("http://fail.tld");
    }, 10);
  });

  it("call onloadend when request completes", function(done) {

      req.onloadend = function() {
        setTimeout(function() {
          done();
        }, 0);
      };

      request();
  });

  it("not call onload when loading failed because of network error", function(done) {

      // Known to fail in IE < 9,
      // i.e. all browsers using onreadystatechange event handlerattribute
      //
      // After a short delay, readyState progresses to "loaded" even
      // though the resource could not be loaded.


      req.onload = function() {
          done();
          throw Error("Called onload");
      };

      req.onerror = function() {
          done();
      };
      setTimeout(function(){
        request("http://fail.tld");
       },10);
  });

  it("call onerror on network error", function(done) {

      req.onerror = function() {
          done();
      };
      setTimeout(function() {
        request("http://fail.tld");
      }, 10);
  });

  it("not call onerror when request exceeds timeout limit", function(done) {

      sinon.spy(req, "onerror");
      req.timeout = 25;
      requestPending();

      setTimeout(function() {
        sinon.assert.notCalled(req.onerror);
        done();
      },10);
  });

  it("call ontimeout when request exceeds timeout limit", function(done) {

      req.timeout = 25;
      req.ontimeout = function() {
        setTimeout(function() {
          done();
        }, 0);
      };

      requestPending();

  });

  it("not call ontimeout when request is within timeout limit", function(done) {

      sinon.spy(req, "ontimeout");

      req.onload = function() {
          // Assert that onload() cancels timeout
            sinon.assert.notCalled(req.ontimeout);
            done();
      };

      req.timeout = 300;
      setTimeout(function() {
        request();
      },10);
  });

  it("call onabort when request was aborted", function() {

      sinon.spy(req, "onabort");
      request();
      req.abort();

      sinon.assert.called(req.onabort);
  });

    //
    // Clean-Up
    //

  it("remove script from DOM when request completed", function(done) {
      var script;

      req.onload = function() {
        
          script = req._getScriptElement();
          assert.isFalse(isInDom(script));
          done();
        
      };
      setTimeout(function() {
        request();
      },10);        
  });

  it("remove script from DOM when request failed", function(done) {
      var script;

      // In IE < 9, "load" is fired instead of "error"
      req.onerror = req.onload = function() {

          script = req._getScriptElement();
          assert.isFalse(isInDom(script));
          done();
        
      };
      setTimeout(function() {
        request("http://fail.tld");
      },10); 
  });

  it("remove script from DOM when request timed out", function(done) {

      var script;

      req.timeout = 25;
      req.ontimeout = function() {
        setTimeout(function() {
          script = req._getScriptElement();
          assert.isFalse(isInDom(script));
          done();
        },0);
      };

      requestPending();
  });

  function request (customUrl) {
    req.open("GET", customUrl || url, true);
    req.send();
  }

  function requestPending(sleep) {
    //require(["php"]);
    var url = noCache("../resource/qx/test/jsonp_primitive.php");

    // In legacy browser, a long running script request blocks subsequent requests
    // even if the script element is removed. Keep duration very low to work around.
    //
    // Sleep 50ms
    url += "&sleep=" + (sleep || 50);
    request(url);
  }

  function isInDom(elem) {
    return elem.parentNode ? true : false;
  }

  function isIe(version) {
    return (qx.core.Environment.get("engine.name") === "mshtml");
  }

  function isIeBelow(version) {
    return qx.core.Environment.get("engine.name") === "mshtml" &&
           qx.core.Environment.get("browser.documentmode") < version;
  }

  function noCache(url) {
    return url + "?nocache=" + (new Date()).valueOf();
  }

  function skip(msg) {
    throw new qx.dev.unit.RequirementError(null, msg);
  }
  
});

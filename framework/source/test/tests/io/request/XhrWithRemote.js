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

describe("io.request.XhrWithRemote", function() {
  var req;

  beforeEach(function() {
    req = new qx.io.request.Xhr();
    // TODO: Maybe use FakeServer instead
  });


  afterEach(function() {
    req.dispose();
  });

  it("fetch resource", function(done) {
    var url = noCache("../resource/qx/test/xmlhttp/sample.txt");

    req.on("success", function(origReq) {
      assert.equal("SAMPLE", origReq.responseText);
      done();
    });

    req.url = url;
    req.send();
  });


  it("recycle request", function(done) {
    var req = new qx.io.request.Xhr(),
      url1 = noCache("../resource/qx/test/xmlhttp/sample.txt" + "?1"),
      url2 = noCache("../resource/qx/test/xmlhttp/sample.txt" + "?2"),
      count = 0;

    req.on("success", function() {
      count++;

      if (count == 2) {
        done();
      } else {
        req.url = url2;
        req.send();
      }
    });

    req.url = url1;
    req.send();
  });


  it("progress phases", function(done) {
    var phases = [],
      expectedPhases = ["opened", "sent", "loading", "load", "success"],
      url = "../resource/qx/test/xmlhttp/sample.txt";

    req.on("changePhase", function() {
      phases.push(req.phase);

      if (req.phase === "success") {
        assert.deepEqual(expectedPhases, phases);
        done();
      }
    });

    req.url = url;
    req.send();
  });


  it("progress phases when abort after send", function() {
    var phases = [],
      expectedPhases = ["opened", "sent", "abort"],
      url = "../resource/qx/test/xmlhttp/sample.txt";

    req.on("changePhase", function() {
      phases.push(req.phase);

      if (req.phase === "abort") {
        assert.deepEqual(expectedPhases, phases);
      }

    });

    req.url = url;
    req.send();
    req.abort();
  });


  it("progress phases when abort after loading", function(done) {
    // Note:
    //   * Breaks in Selenium and IE because no intermediate loading event
    //     is fired while requesting "loading.php"
    //   * Breaks on Windows 7 in every browser because the loading phase
    //     is never entered
    // TODO: Use skip() and wrap with conditions

    var phases = [],
      expectedPhases = ["opened", "sent", "loading", "abort"],
      url = noCache("../resource/qx/test/xmlhttp/loading.php") + "&duration=100";

    req.on("changePhase", function() {
      phases.push(req.phase);

      if (req.phase === "abort") {
        assert.deepEqual(expectedPhases, phases);
        done();
      }
    });

    req.url = url;
    req.send();

    // Abort loading. Give remote some time to respond.
    window.setTimeout(function() {
      req.abort();
    }, 500);
  });

  // Not sure how to harmonize with XhrWithRemoteLowLevel
  // ontimeout tests. ontimeout handler of io.AbstractRequest
  // conflicts with _onTimeout from io.Xhr.


  it("timeout", function(done) {
    var url = noCache("../resource/qx/test/xmlhttp/loading.php") + "&duration=100";

    req.on("timeout", function() {
      assert.equal("timeout", req.phase);
      done();
    });

    req.url = url;
    req.timeout = 1 / 1000;
    req.send();
  });


  it("timeout with header call", function(done) {
    var url = noCache("../resource/qx/test/xmlhttp/loading.php") + "&duration=100";

    req.on("timeout", function() {
      try {
        req.getResponseHeader("X-UI-My-Header");
        throw new Error("DOM exception expected!");
      } catch (ex) {}
      done();
    });

    req.url = url;
    req.timeout = (1 / 1000);
    req.send();
  });


  function noCache(url) {
    return qx.util.Uri.appendParamsToUrl(url, "nocache=" + (new Date).valueOf());
  }

  // function hasNoIe() {
  //   return !(qx.core.Environment.get("engine.name") == "mshtml");
  // }
});

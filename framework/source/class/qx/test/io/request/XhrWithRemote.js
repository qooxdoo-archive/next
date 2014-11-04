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

qx.Class.define("qx.test.io.request.XhrWithRemote",
{
  extend: qx.dev.unit.TestCase,

  include: [qx.test.io.MRemoteTest,
            qx.dev.unit.MRequirements],

  members:
  {
    setUp: function() {
      this.req = new qx.io.request.Xhr();
      this.require(["http"]);
    },

    tearDown: function() {
      this.req.dispose();
    },

    "test: fetch resource": function() {

      var req = this.req,
          url = this.noCache(this.getUrl("qx/test/xmlhttp/sample.txt"));

      req.on("success", function(e) {
        this.resume(function() {
          this.assertEquals("SAMPLE", e.target.getResponseText());
        }, this);
      }, this);

      req.url = url;
      req.send();

      this.wait();
    },

    "test: recycle request": function() {
      var req = new qx.io.request.Xhr(),
          url1 = this.noCache(this.getUrl("qx/test/xmlhttp/sample.txt") + "?1"),
          url2 = this.noCache(this.getUrl("qx/test/xmlhttp/sample.txt") + "?2"),
          count = 0;

      req.on("success", function() {
        count++;

        if (count == 2) {
          this.resume();
        } else {
          req.url = url2;
          req.send();
        }
      }, this);

      req.url = url1;
      req.send();

      this.wait();
    },

    "test: progress phases": function() {
      var req = this.req,
          phases = [],
          expectedPhases = ["opened", "sent", "loading", "load", "success"],
          url = this.getUrl("qx/test/xmlhttp/sample.txt");

      req.on("changePhase", function() {
        phases.push(req.getPhase());

        if (req.getPhase() === "success") {
          this.resume(function() {
            this.assertArrayEquals(expectedPhases, phases);
          }, this);
        }

      }, this);

      req.url = url;
      req.send();

      this.wait();
    },

    "test: progress phases when abort after send": function() {
      var req = this.req,
          phases = [],
          expectedPhases = ["opened", "sent", "abort"],
          url = this.getUrl("qx/test/xmlhttp/sample.txt");

      req.on("changePhase", function() {
        phases.push(req.getPhase());

        if (req.getPhase() === "abort") {
          this.assertArrayEquals(expectedPhases, phases);
        }

      }, this);

      req.url = url;
      req.send();
      req.abort();
    },

    "test: progress phases when abort after loading": function() {
      // Note:
      //   * Breaks in Selenium and IE because no intermediate loading event
      //     is fired while requesting "loading.php"
      //   * Breaks on Windows 7 in every browser because the loading phase
      //     is never entered
      this.require(["noSelenium", "noIe", "noWin7"]);

      var req = this.req,
          phases = [],
          expectedPhases = ["opened", "sent", "loading", "abort"],
          url = this.noCache(this.getUrl("qx/test/xmlhttp/loading.php")) + "&duration=100";

      req.on("changePhase", function() {
        phases.push(req.getPhase());

        if (req.getPhase() === "abort") {
          this.resume(function() {
            this.assertArrayEquals(expectedPhases, phases);
          });
        }

      }, this);

      req.url = url;
      req.send();

      // Abort loading. Give remote some time to respond.
      window.setTimeout(function() {
        req.abort();
      }.bind(this), 500);

      this.wait();
    },

    // Not sure how to harmonize with XhrWithRemoteLowLevel
    // ontimeout tests. ontimeout handler of io.AbstractRequest
    // conflicts with _onTimeout from io.Xhr.
    /*
    "test: timeout": function() {
      var req = this.req,
          url = this.noCache(this.getUrl("qx/test/xmlhttp/loading.php")) + "&duration=100";

      req.on("timeout", function() {
        this.resume(function() {
          this.assertEquals("timeout", req.getPhase());
        });
      }, this);

      req.url = url;
      req.timeout = 1/1000;
      req.send();
      this.wait();
    },

    "test: timeout with header call": function() {
      var req = this.req,
          url = this.noCache(this.getUrl("qx/test/xmlhttp/loading.php")) + "&duration=100";

      req.on("timeout", function() {
        this.resume(function() {
          try {
            req.getResponseHeader("X-UI-My-Header");
            throw new Error("DOM exception expected!");
          } catch (ex) {}
        });
      }, this);

      req.url = url;
      req.timeout = (1/1000);
      req.send();
      this.wait();
    },
    */

    noCache: function(url) {
      return qx.util.Uri.appendParamsToUrl(url, "nocache=" + (new Date).valueOf());
    },

    hasNoIe: function() {
      return !(qx.core.Environment.get("engine.name") == "mshtml");
    }

  }
});

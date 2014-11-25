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
 * @asset(qx/test/xmlhttp/random.php)
 * @asset(qx/test/xmlhttp/long_poll.php)
 * @asset(qx/test/xmlhttp/sample.txt)
 */

describe("io.rest.ResourceWithRemote", function() {
  var res;

  beforeEach(function() {
    // require(["http"]);
    setUpRoot();
    res = new qx.io.rest.Resource();
  });

  afterEach(function() {
    res.dispose();
    tearDownRoot();
  });


  it("invoke action and handle response", function(done) {
    // Handles GET
    var url = "../resource/qx/test/xmlhttp/sample.txt";
    res.map("get", "GET", url);
    res.on("getSuccess", function(e) {
      setTimeout(function(){
        assert.equal("SAMPLE", e.response);
        done();
      },100);
    });

    res.get();
  });


  it("invoke action and handle failure", function(done) {
    // require(["http"]);
    var url = "/not-found";

    res.map("get", "GET", url);
    res.on("error", function(e) {
      setTimeout(function() {
        assert.equal("statusError", e.phase);
        assert.equal("get", e.action);
        done();
      }, 10);
    });

    res.get();
  });


  it("poll action", function(done) {
    // Handles GET
    var url = "../resource/qx/test/xmlhttp/random.php",
      count = 0,
      previousResponse = "";

    res.map("get", "GET", url);

    // Response headers must contain explicit cache control for this
    // to work in IE
    res.on("getSuccess", function(e) {
      var response = e.response;
      count++;

      assert(response.length === 32, "Response must be MD5");
      assert.notEqual(previousResponse, response,
        "Response must be different from previous");
      previousResponse = response;

      if (count >= 10) {
        setTimeout(function() {
          if (count === 10) {
            done();
          }
        }, 10);
      }
    });

    res.poll("get", 100);
  });


  it("long poll", function(done) {
    var url = "../resource/qx/test/xmlhttp/long_poll.php",
      count = 0,
      responses = [];

    res.map("get", "GET", url);
    res.on("getSuccess", function(e) {
      var response = e.response;
      responses.push(response);

      if (++count >= 5) {
        console.log(count);
        setTimeout(function() {
          assert(parseFloat(responses[4]) > parseFloat(responses[0]),
            "Must increase");
          if (count === 5) {
            done();
          }
        }, 100);
      }
    });

    res.longPoll("get");
  });

});

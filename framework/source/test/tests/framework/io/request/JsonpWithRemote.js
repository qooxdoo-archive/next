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
 * @asset(qx/test/jsonp_primitive.php)
 */

describe("io.request.JsonpWithRemote", function() {
  var req;

  beforeEach(function() {
    // TODO: Maybe use FakeServer instead
    // this.require(["http"]);
    req = createRequest();
    req = stubMethods(req);

    // preparation for _MRequest
    this.currentTest.req = req;
   });

  afterEach(function() {
    req.dispose();
    this.currentTest.req.dispose();
  });

  it("fetch json", function(done) {
    // execute real request so restore original methods
    req._send.restore();
    req._open.restore();

    var url = noCache("../resource/qx/test/jsonp_primitive.php");

    req.on("load", function(e) {
      setTimeout(function() {
        assert.isObject(req.response);
        assert.isTrue(req.response["boolean"]);
        done();
      }, 100);
    });

    req.url = url;
    req.send();
  });

  function createRequest() {
    req = new qx.io.request.Jsonp();
    req.url = "url";
    return req;
  }

  function stubMethods(req) {
    // if already stubbed just return
    if (req && req._send && req._send.restore) { return; }

    // TODO: use sandbox
    sinonSandbox.stub(req, "_open");
    sinonSandbox.stub(req, "_setRequestHeader");
    sinonSandbox.stub(req, "setRequestHeader");
    sinonSandbox.stub(req, "_send");
    sinonSandbox.stub(req, "_abort");
    return req;
  }

  function noCache(url) {
    return qx.util.Uri.appendParamsToUrl(url, "nocache=" + Date.now());
  }

  // shared tests from mixin
  var sharedTests = _MRequest();
  for (var testName in sharedTests) {
    it(testName, sharedTests[testName]);
  }

});

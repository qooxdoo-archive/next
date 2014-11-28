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
 * Tests asserting behavior
 *
 * - special to io.request.Jsonp and
 * - common to io.request.* (see {@link qx.test.io.request.MRequest})
 *
 * Tests defined in MRequest run with appropriate context, i.e.
 * a transport that is an instance of qx.bom.request.Jsonp
 * (see {@link #setUpFakeTransport}).
 *
 */
describe("io.request.Jsonp", function() {

  var req;
  beforeEach(function() {
    setUpRequest();
    setUpFakeTransport();
  });


  function setUpRequest() {
    req && req.dispose();
    req = new qx.io.request.Jsonp();
    req.url = "url";
  }


  // Also called in shared tests, i.e. shared tests
  // use appropriate transport
  function setUpFakeTransport() {
    // if already stubbed just return
    if (req && req._send && req._send.restore) {
      return;
    }

    SinonSandbox.stub(req, "_open");
    SinonSandbox.stub(req, "_setRequestHeader");
    SinonSandbox.stub(req, "setRequestHeader");
    SinonSandbox.stub(req, "_send");
    SinonSandbox.stub(req, "_abort");
  }


  afterEach(function() {
    req._dispose();

    // May fail in IE
    try {
      delete Klass;
    } catch (e) {}
  });

  //
  // General (cont.)
  //

  it("set url property on construct", function() {
    var req = new qx.io.request.Jsonp("url");
    assert.equal("url", req.url);
    req._dispose();
  });


  it("method or async should be readonly", function() {
    var req = new qx.io.request.Jsonp();
    // resetting method shouldn't be possible
    req.method = "POST";
    assert.equal("GET", req.method);
    req.async = false;
    assert.isTrue(req.async);
  });

});

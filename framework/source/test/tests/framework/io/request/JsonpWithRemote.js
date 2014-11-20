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


  beforeEach(function() {
    this.require(["http"]);
  });


  afterEach(function() {
    this.req.dispose();
  });



  it("fetch json", function() {
    var req = this.req = new qx.io.request.Jsonp(),
      url = this.noCache(this.getUrl("qx/test/jsonp_primitive.php"));

    req.on("load", function(e) {
      this.resume(function() {
        assert.isObject(req.response);
        assert.isTrue(req.response["boolean"]);
      }, this);
    }, this);

    req.url = url;
    req.send();

    this.wait();
  });


  function noCache(url) {
    return qx.util.Uri.appendParamsToUrl(url, "nocache=" + Date.now());
  }


});

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

describe("util.Request", function () {
  it(": isCrossDomain() returns true with cross-domain URL", function () {
    var location = window.location,
      origin = location.protocol + "//" + location.host,
      isCrossDomain = qx.util.Request.isCrossDomain;

    assert.isTrue(isCrossDomain("http://cross.domain"), "cross");
    assert.isTrue(isCrossDomain(origin + ":123456"), "port");
    assert.isTrue(isCrossDomain("foobar" + "://" + location.host), "protocol");
  });


  it(": isCrossDomain() returns false with same-origin URL", function () {
    var location = window.location,
      origin = location.protocol + "//" + location.host,
      isCrossDomain = qx.util.Request.isCrossDomain;

    assert.isFalse(isCrossDomain(origin));
    assert.isFalse(isCrossDomain("data.json"), "simple url");
    assert.isFalse(isCrossDomain("/data.json"), "absolute url");
    assert.isFalse(isCrossDomain("../data.json"), "relative url");
    assert.isFalse(isCrossDomain("../foo-bar/meep.in/data.json"), "strange url");
  });


  it(": isSuccessful() returns true with successful HTTP status", function () {
    var isSuccessful = qx.util.Request.isSuccessful;

    assert.isTrue(isSuccessful(200));
    assert.isTrue(isSuccessful(304));

    assert.isFalse(isSuccessful(404));
    assert.isFalse(isSuccessful(500));
  });


  it(": isMethod() returns true if HTTP method is known", function () {
    var isMethod = qx.util.Request.isMethod;

    assert.isTrue(isMethod("GET"));
    assert.isTrue(isMethod("POST"));

    assert.isFalse(isMethod(1));
    assert.isFalse(isMethod(null));
    assert.isFalse(isMethod(undefined));
    assert.isFalse(isMethod([]));
    assert.isFalse(isMethod({}));
  });


  it(": methodAllowsRequestBody() returns false when GET", function () {
    assert.isFalse(qx.util.Request.methodAllowsRequestBody("GET"));
  });


  it(": methodAllowsRequestBody() returns true when POST", function () {
    assert.isTrue(qx.util.Request.methodAllowsRequestBody("POST"));
  });

});

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

describe("util.Uri", function () {
  var __uri;

  beforeEach(function () {
    __uri = qx.util.Uri;
  });


  it(": appendParamsToUrl() with string", function () {
    var url = "http://example.com/path",
      params = "affe=true&maus=false",
      expected = "http://example.com/path?affe=true&maus=false",
      result = __uri.appendParamsToUrl(url, params);

    sinon.spy()(expected, result);
  });


  it("ToParameter", function () {
    var obj = {affe: true, maus: false};
    var str = qx.util.Uri.toParameter(obj);
    sinon.spy()("affe=true&maus=false", str);
  });


  it("ToParameterUmlauts", function () {
    var obj = {"äffe": "jøah", "maüs": "nö"};
    var str = qx.util.Uri.toParameter(obj);
    sinon.spy()("%C3%A4ffe=j%C3%B8ah&ma%C3%BCs=n%C3%B6", str);
  });


  it("ToParameterSpaces", function () {
    var obj = {"a f f e": true};
    var str = qx.util.Uri.toParameter(obj);
    sinon.spy()("a%20f%20f%20e=true", str);
  });


  it("ToParameterSpacesPost", function () {
    var obj = {"a f  f e": "j a"};
    var str = qx.util.Uri.toParameter(obj, true);
    sinon.spy()("a+f++f+e=j+a", str);
  });


  it("ToParameterArray", function () {
    var obj = {id: [1, 2, 3]};
    var str = qx.util.Uri.toParameter(obj);
    sinon.spy()("id=1&id=2&id=3", str);
  });


  it(": appendParamsToUrl() with string when existing query", function () {
    var url = "http://example.com/path?giraffe=true",
      params = "affe=true&maus=false",
      expected = "http://example.com/path?giraffe=true&affe=true&maus=false",
      result = __uri.appendParamsToUrl(url, params);

    sinon.spy()(expected, result);
  });


  it(": appendParamsToUrl() with map", function () {
    var url = "http://example.com/path",
      params = {affe: true, maus: false},
      result = __uri.appendParamsToUrl(url, params);

    assert.isTrue(/^http.*example.com\/path/.test(result));
    assert.isTrue(/affe=true/.test(result));
    assert.isTrue(/maus=false/.test(result));
  });


  it(": appendParamsToUrl() with undefined", function () {
    var url = "http://example.com/path",
      params = undefined,
      result = __uri.appendParamsToUrl(url, params);

    sinon.spy()(url, result);
  });


  it(": appendParamsToUrl() with empty map", function () {
    var url = "http://example.com/path",
      params = {},
      result = __uri.appendParamsToUrl(url, params);

    sinon.spy()(url, result);
  });


  it(": parseUri()", function () {
    var url = "http://www.example.com:80/foo/bar?affe=true#here",
      result = __uri.parseUri(url);

    // Some integration tests, parseUri is better covered here
    // http://stevenlevithan.com/demo/parseuri/js/
    sinon.spy()("http", result.protocol);
    sinon.spy()("www.example.com", result.host);
    sinon.spy()("80", result.port);
    sinon.spy()("/foo/bar?affe=true#here", result.relative);
    sinon.spy()("here", result.anchor);
  });

});

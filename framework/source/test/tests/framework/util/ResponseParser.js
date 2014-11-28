/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2013 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Richard Sternagel (rsternagel)

************************************************************************ */

describe("util.ResponseParser", function () {
  var __responseParser;

  beforeEach(function () {
    __responseParser = new qx.util.ResponseParser();
  });

  afterEach(function () {
    __responseParser = null;
  });


  var __assertParser = function (contentType, parser) {
    var msg = "Content type '" + contentType + "' handled incorrectly";
    sinonSandbox.spy()(parser, __responseParser._getParser(contentType), msg);
  };


  it(": getParser() returns undefined for unknown", function () {
    __assertParser("text/html", undefined);
    __assertParser("application/pdf", undefined);
  });


  it(": getParser() returns undefined for malformed", function () {
    __assertParser("", undefined);
    __assertParser("json", undefined);
    __assertParser("text/foo+json", undefined);
    __assertParser("application/foo+jsonish", undefined);
    __assertParser("application/foo+xmlish", undefined);
  });


  it(": getParser() detects json", function () {
    var json = qx.util.ResponseParser.PARSER.json;
    __assertParser("application/json", json);
    __assertParser("application/vnd.affe+json", json);
    __assertParser("application/prs.affe+json", json);
    __assertParser("application/vnd.oneandone.onlineoffice.email+json", json);
  });


  it(": getParser() detects xml", function () {
    var xml = qx.util.ResponseParser.PARSER.xml;
    __assertParser("application/xml", xml);
    __assertParser("application/vnd.oneandone.domains.domain+xml", xml);
    __assertParser("text/xml");  // Deprecated
  });


  it(": getParser() detects deprecated xml", function () {
    var xml = qx.util.ResponseParser.PARSER.xml;
    __assertParser("text/xml");
  });


  it(": getParser() handles character set", function () {
    var json = qx.util.ResponseParser.PARSER.json;
    __assertParser("application/json; charset=utf-8", json);
  });


  it(": setParser() function", function () {
    var customParser = function () {
    };
    __responseParser.setParser(customParser);
    sinonSandbox.spy()(customParser, __responseParser._getParser());
  });


  it(": setParser() symbolically", function () {
    __responseParser.setParser("json");
    assert.isFunction(__responseParser._getParser());
  });


  it(": parse() not parse empty response", function () {
    var expectedResponse = "",
      parsedResponse = __responseParser.parse("", "application/json");

    sinonSandbox.spy()(expectedResponse, parsedResponse);
  });


  it(": parse() not parse unknown response", function () {
    assert.isNull(__responseParser._getParser("application/idontexist"));
  });


  // JSON
  it(": parse() json response", function () {
    var json = '{"animals": ["monkey", "mouse"]}',
      expectedResponse = qx.util.ResponseParser.PARSER.json.call(this, json),
      parsedResponse = __responseParser.parse(json, "application/json");

    sinonSandbox.spy()(expectedResponse.animals[0], parsedResponse.animals[0]);
  });


  // XML
  it(": parse() xml response", function () {
    var xml = "<animals><monkey/><mouse/></animals>",
      expectedResponse = qx.util.ResponseParser.PARSER.xml.call(this, xml),
      parsedResponse = __responseParser.parse(xml, "application/xml");

    sinonSandbox.spy()(expectedResponse.documentElement.nodeName, parsedResponse.documentElement.nodeName);
  });


  it(": parse() arbitrary xml response", function () {
    var xml = "<animals><monkey/><mouse/></animals>",
      expectedResponse = qx.util.ResponseParser.PARSER.xml.call(this, xml),
      parsedResponse = __responseParser.parse(xml, "animal/affe+xml");

    sinonSandbox.spy()(expectedResponse.documentElement.nodeName, parsedResponse.documentElement.nodeName);
  });
});

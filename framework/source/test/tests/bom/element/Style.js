/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2013 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Alexander Steitz (aback)
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

describe("bom.element.Style", function() {

  var __element = null;

  beforeEach(function() {
    __element = document.createElement("div");
    document.body.appendChild(__element);
  });


  afterEach(function() {
    document.body.removeChild(__element);
    __element = null;
  });


  it("SetStylesWithCss3", function() {
    var styles = {
      "MozBoxShadow": "6px 6px 10px rgb(128, 128, 128)",
      "WebkitBoxShadow": "6px 6px 10px rgb(128, 128, 128)",
      "boxShadow": "6px 6px 10px rgb(128, 128, 128)"
    };

    qx.bom.element.Style.setStyles(__element, styles);

    var expected = qx.core.Environment.select("engine.name", {
      "webkit": "rgb(128, 128, 128) 6px 6px 10px",
      "mshtml": "6px 6px 10px rgb(128,128,128)",
      "default": "6px 6px 10px rgb(128, 128, 128)"
    });

    assert.equal(expected, __element.style.boxShadow);
  });


  it("SetAndGetCss", function() {
    var css = "font-weight: bold;";
    qx.bom.element.Style.setCss(__element, css);
    assert.match(qx.bom.element.Style.getCss(__element), /font-weight.*?bold/i);
  });


  it("Set", function() {
    var name = "border";
    var style = ["1px", "solid", "red"];

    qx.bom.element.Style.set(__element, name, style.join(" "));

    if (qx.core.Environment.get("engine.name") == "mshtml" &&
      qx.core.Environment.get("browser.documentmode") < 9) {
      assert.equal("red 1px solid", __element.style.border);
    } else {
      assert.equal(style.join(" "), __element.style.border);
    }

    assert.equal(style[0], __element.style.borderWidth);
    assert.equal(style[1], __element.style.borderStyle);
    assert.equal(style[2], __element.style.borderColor);
  });


  it("Get", function() {
    var name = "border";
    var style = "1px solid red";
    var engine = qx.core.Environment.get("engine.name");
    var expected = ["1px", "solid", "red"];
    var isOldSafari = (qx.core.Environment.get("browser.name") == "safari" &&
      qx.core.Environment.get("browser.version") < 6);

    if (engine == "webkit" && !isOldSafari) {
      expected = ["1px", "solid", "rgb(255, 0, 0)"];
    }

    qx.bom.element.Style.set(__element, name, style);
    if (qx.core.Environment.get("engine.name") == "mshtml" &&
      qx.core.Environment.get("browser.documentmode") < 9) {
      assert.equal("red 1px solid", qx.bom.element.Style.get(__element, name));
    } else {
      assert.equal(expected.join(" "), qx.bom.element.Style.get(__element, name));
    }
    assert.equal(expected[0], qx.bom.element.Style.get(__element, "borderWidth"));
    assert.equal(expected[1], qx.bom.element.Style.get(__element, "borderStyle"));
    assert.equal(expected[2], qx.bom.element.Style.get(__element, "borderColor"));
  });


  it("SetFloat", function() {
    qx.bom.element.Style.set(__element, "float", "left");
    assert.equal("left", __element.style.float);
  });


  //test fails
  it("CompileFloat", function() {
    var css = qx.bom.element.Style.compile({
      "float": "left"
    });
    assert.equal("float:left;", css);
  });


  it("CompileContent", function() {
    var css = qx.bom.element.Style.compile({
      "content": ""
    });
    assert.equal("content:\"\";", css);
  });
});

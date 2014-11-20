/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Daniel Wagner (d_wagner)

************************************************************************ */

describe("bom.Stylesheet", function() {

  afterEach(function() {

    if (this.currentTest.skip) {
      skipAfterTest(this.currentTest.parent.title,this.currentTest.title);
    }

    if (this.__sheet) {
      var ownerNode = this.__sheet.ownerNode || this.__sheet.owningNode;
      if (ownerNode && ownerNode.parentNode) {
        ownerNode.parentNode.removeChild(ownerNode);
      } else {
        qx.bom.Stylesheet.removeAllRules(this.__sheet);
      }
    }
  });


  it("AddImport", function() {
    var sheet = this.__sheet = qx.bom.Stylesheet.createElement();
    var uri = "../resource/qx/test/style.css";
    qx.bom.Stylesheet.addImport(sheet, uri);
    if (sheet.cssRules) {
      var rules = sheet.cssRules || sheet.rules;
      assert.equal(1, sheet.cssRules.length);
      assert.isDefined(sheet.cssRules[0].href);
    } else if (sheet.cssText) {
      assert.match(sheet.cssText, /@import/);
    }
  });


  it("AddRule", function() {
    var sheet = this.__sheet = qx.bom.Stylesheet.createElement();
    qx.bom.Stylesheet.addRule(sheet, "#foo", "color: red;");
    var rules = sheet.cssRules || sheet.rules;
    assert.equal(1, rules.length);
    assert.equal("#foo", rules[0].selectorText);
    if (qx.core.Environment.get("qx.debug")) {
      assert.throws(function() {
        qx.bom.Stylesheet.addRule(sheet, "#foo", "{color: red;}");
      }, qx.core.AssertionError);
    }
  });


  it("CreateElement", function() {
    var sheet = this.__sheet = qx.bom.Stylesheet.createElement();
    var rules = sheet.cssRules || sheet.rules;
    assert.isDefined(rules, "Created element is not a stylesheet!");
    assert.equal(0, rules.length);
  });


  it("CreateElementWithText", function() {
    var cssText = "#foo { color: red; }";
    var sheet = this.__sheet = qx.bom.Stylesheet.createElement(cssText);
    var rules = sheet.cssRules || sheet.rules;
    assert.isDefined(rules, "Created element is not a stylesheet!");
    assert.equal(1, rules.length);
    assert.equal("#foo", rules[0].selectorText);
  });


  it("IncludeFile", function() {
    var uri = "../resource/qx/test/style.css";
    qx.bom.Stylesheet.includeFile(uri);
    var linkElems = document.getElementsByTagName("link");
    var found = false;
    for (var i = 0, l = linkElems.length; i < l; i++) {
      if (linkElems[i].href.match(/test\/style\.css/)) {
        found = true;
        linkElems[i].parentNode.removeChild(linkElems[i]);
        break;
      }
    }
    assert(found, "Link element was not added to the document!");
  });


  it("RemoveAllImports", function() {
    // removing an @import rule breaks subsequent animation tests on Linux
    // and Windows
    if (qxWeb.env.get("os.name") !== "osx") {
      this.test.skip = true;
      return;
    }
    var sheet = this.__sheet = qx.bom.Stylesheet.createElement();
    var uri = "../resource/qx/test/style.css";
    qx.bom.Stylesheet.addImport(sheet, uri);
    qx.bom.Stylesheet.addImport(sheet, uri);
    qx.bom.Stylesheet.removeAllImports(sheet);
    if (sheet.cssRules) {
      var rules = sheet.cssRules || sheet.rules;
      assert.equal(0, sheet.cssRules.length);
    } else if (typeof sheet.cssText == "string") {
      assert.equal("", sheet.cssText);
    }
  });


  it("RemoveAllRules", function() {
    var sheet = this.__sheet = qx.bom.Stylesheet.createElement();
    qx.bom.Stylesheet.addRule(sheet, "#foo", "color: red;");
    qx.bom.Stylesheet.addRule(sheet, "#bar", "color: blue;");
    var rules = sheet.cssRules || sheet.rules;
    assert.equal(2, rules.length);

    qx.bom.Stylesheet.removeAllRules(sheet);
    rules = sheet.cssRules || sheet.rules;
    assert.equal(0, rules.length);
  });


  it("RemoveImport", function() {
    // removing an @import rule breaks subsequent animation tests on Linux
    // and Windows
    if (qxWeb.env.get("os.name") !== "osx") {
      this.test.skip = true;
      return;
    }
    var sheet = this.__sheet = qx.bom.Stylesheet.createElement();
    var uri = "../resource/qx/test/style.css";
    qx.bom.Stylesheet.addImport(sheet, uri);
    var rules = sheet.cssRules || sheet.rules;
    assert.equal(1, rules.length);
    assert.equal(0, rules[0].cssText.indexOf("@import"));

    qx.bom.Stylesheet.removeImport(sheet, uri);
    rules = sheet.cssRules || sheet.rules;
    if (rules) {
      assert.equal(0, rules.length);
    } else if (typeof sheet.cssText == "string") {
      assert.equal("", sheet.cssText);
    }
  });


  it("RemoveRule", function() {
    var sheet = this.__sheet = qx.bom.Stylesheet.createElement("#foo { color: red; }");
    qx.bom.Stylesheet.removeRule(sheet, "#foo");
    var rules = sheet.cssRules || sheet.rules;
    assert.equal(0, rules.length);
  });
});

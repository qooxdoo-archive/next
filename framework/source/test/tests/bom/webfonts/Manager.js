/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

************************************************************************ */

/* ************************************************************************
 ************************************************************************ */
/**
 *
 * @asset(../resource/qx/test/webfonts/*)
 */

describe("bom.webfonts.Manager", function() {

  this.timeout(6000);
  var nodesBefore;
  var sheetsBefore;
  var manager;

  var fontDefinitions =
  {
    finelinerScript: {
      family: "FinelinerScriptRegular",
      source: ["../resource/qx/test/webfonts/fineliner_script-webfont.woff",
        "../resource/qx/test/webfonts/fineliner_script-webfont.ttf",
        "../resource/qx/test/webfonts/fineliner_script-webfont.eot"
      ]
    },
    invalid: {
      family: "MonkeypooBold",
      source: ["404.woff",
        "404.ttf",
        "404.eot"
      ]
    }
  };

  function findRule(familyName) {
    var reg = new RegExp("@font-face.*?" + familyName, "m");
    var helper = function(cssText) {
      cssText = cssText.replace(/\n/g, "").replace(/\r/g, "");
      if (reg.exec(cssText)) {
        return true;
      }
      return false;
    };

    for (var i = 0, l = document.styleSheets.length; i < l; i++) {
      var sheet = document.styleSheets[i];
      if (sheet.cssText) {
        if (helper(sheet.cssText)) {
          return true;
        }
      } else if (sheet.cssRules) {
        for (var j = 0, m = sheet.cssRules.length; j < m; j++) {
          if (helper(sheet.cssRules[j].cssText)) {
            return true;
          }
        }
      }
    }
    return false;
  }


  beforeEach(function() {
    nodesBefore = document.body.childNodes.length;
    sheetsBefore = document.styleSheets.length;
    manager = qx.bom.webfonts.Manager.getInstance();
  });


  afterEach(function() {
    qx.bom.webfonts.Manager.VALIDATION_TIMEOUT = 5000;
    manager.dispose();
    delete qx.bom.webfonts.Manager.$$instance;
    manager = null;
    assert.equal(nodesBefore, document.body.childNodes.length, "Manager did not remove all nodes!");
    assert.equal(sheetsBefore, document.styleSheets.length, "Manager did not remove stylesheet!");
  });


  it("create rule for valid font", function(done) {
    qx.bom.webfonts.Manager.VALIDATION_TIMEOUT = 1000;
    var font = new qx.bom.webfonts.WebFont();
    font.size = 18;
    font.family = ["monospace"];
    font.sources = [fontDefinitions.finelinerScript];

    setTimeout(function() {
      var foundRule = findRule(fontDefinitions.finelinerScript.family);
      assert.isTrue(foundRule, "@font-face rule not found in document styles!");
      done();
    }, 1500);
  });


  it("do not create rule for invalid font", function(done) {
    qx.bom.webfonts.Manager.VALIDATION_TIMEOUT = 100;
    var font = new qx.bom.webfonts.WebFont();
    font.family = ["monospace"];
    font.sources = [fontDefinitions.invalid];

    setTimeout(function() {
      var foundRule = findRule(fontDefinitions.invalid.family);
      assert.isFalse(foundRule, "@font-face rule for invalid font found in document styles!");
      done();
    }, 500);
  });
});

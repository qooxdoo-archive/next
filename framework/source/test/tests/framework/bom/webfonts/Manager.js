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

describe("bom.webfonts.Manager", function () {
this.timeout(4000);
    var __fontDefinitions =
    {
      finelinerScript :
      {
        family : "FinelinerScriptRegular",
        source: [ qx.util.ResourceManager.getInstance().toUri("../resource/qx/test/webfonts/fineliner_script-webfont.woff"),
                  qx.util.ResourceManager.getInstance().toUri("../resource/qx/test/webfonts/fineliner_script-webfont.ttf"),
                  qx.util.ResourceManager.getInstance().toUri("../resource/qx/test/webfonts/fineliner_script-webfont.eot") ]
      },
      invalid :
      {
        family : "MonkeypooBold",
        source: [ "404.woff",
                  "404.ttf",
                  "404.eot" ]
      }
    }

    function __findRule(familyName)
    {
      var reg = new RegExp("@font-face.*?" + familyName, "m");
      var helper = function(cssText) {
        cssText = cssText.replace(/\n/g, "").replace(/\r/g, "");
        if (reg.exec(cssText)) {
          return true;
        }
        return false;
      };


      for (var i=0,l=document.styleSheets.length; i<l; i++) {
        var sheet = document.styleSheets[i];
        if (sheet.cssText) {
          if (helper(sheet.cssText)) {
            return true;
          }
        }
        else if (sheet.cssRules) {
          for (var j=0,m=sheet.cssRules.length; j<m; j++) {
            if (helper(sheet.cssRules[j].cssText)) {
              return true;
            }
          }
        }
      }
      return false;
    }

    beforeEach (function () 
    {
      //this.require(["webFontSupport"]);
      __nodesBefore = document.body.childNodes.length;
      __sheetsBefore = document.styleSheets.length;
      __manager = qx.bom.webfonts.Manager.getInstance();
    });

    afterEach (function () 
    {
      __manager.dispose();
      delete qx.bom.webfonts.Manager.$$instance;
      __manager = null;
      assert.equal(__nodesBefore, document.body.childNodes.length, "Manager did not remove all nodes!");
      assert.equal(__sheetsBefore, document.styleSheets.length, "Manager did not remove stylesheet!");
    });

    
 
  it("create rule for valid font", function(done) {
      var font = new qx.bom.webfonts.WebFont();
      font.size = 18;
      font.family = ["monospace"];
      font.sources = [__fontDefinitions.finelinerScript];

      setTimeout(function() {
        
          var foundRule = __findRule(__fontDefinitions.finelinerScript.family);
          assert.isTrue(foundRule, "@font-face rule not found in document styles!");
          done();
        }, 3000);
  });

    
 
  it("do not create rule for invalid font", function(done) {

      qx.bom.webfonts.Manager.VALIDATION_TIMEOUT = 100;
      var font = new qx.bom.webfonts.WebFont();
      font.family = ["monospace"];
      font.sources = [__fontDefinitions.invalid];

      setTimeout(function() {
          var foundRule = __findRule(__fontDefinitions.invalid.family);
          assert.isFalse(foundRule, "@font-face rule for invalid font found in document styles!");
          done();
        }, 3000);

  });
});

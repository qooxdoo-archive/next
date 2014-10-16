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

describe("bom.webfonts.Validator", function () {
   
  var __val = null; 
  beforeEach (function () 
  {
    __nodesBefore = document.body.childNodes.length;
    //require(["webFontSupport"]);
    __val = new qx.bom.webfonts.Validator;
  });

  afterEach (function () 
  {
    if (__val) {
      __val.dispose();
      delete __val;
    }
    qx.bom.webfonts.Validator.removeDefaultHelperElements();
    assert.equal(__nodesBefore, document.body.childNodes.length, "Validator did not clean up correctly!");
  });
 
 it("ValidFont", function(done) {
      __val.fontFamily = "monospace, courier";
      __val.on("changeStatus", function(result) {
        setTimeout( function (){
          assert.isTrue(result.valid);
          done();
        }, 1000);
      }, this);
      window.setTimeout(function() {
        __val.validate();
      }, 0);
      
  });
 
 it("InvalidFont", function(done) {
      __val.fontFamily = "zzzzzzzzzzzzzzz";
      __val.timeout = 250;
      __val.on("changeStatus", function(result) {
        setTimeout (function (){
          assert.isFalse(result.valid);
          done();
        }, 500);
      }, this);

      window.setTimeout(function() {
        __val.validate();
      }, 0);
  });
  
});
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

qx.Bootstrap.define("qx.test.bom.webfonts.Validator", {

  extend : qx.test.bom.webfonts.Abstract,

  include : [qx.dev.unit.MRequirements],

  members :
  {
    setUp : function()
    {
      this.__nodesBefore = document.body.childNodes.length;
      this.require(["webFontSupport"]);
      this.__val = new qx.bom.webfonts.Validator;
    },

    tearDown : function()
    {
      if (this.__val) {
        this.__val.dispose();
        delete this.__val;
      }
      qx.bom.webfonts.Validator.removeDefaultHelperElements();
      this.assertEquals(this.__nodesBefore, document.body.childNodes.length, "Validator did not clean up correctly!");
    },

    testValidFont : function()
    {
      this.__val.fontFamily = "monospace, courier";
      this.__val.on("changeStatus", function(result) {
        this.resume(function(ev) {
          this.assertTrue(result.valid);
        }, this);
      }, this);

      var that = this;
      window.setTimeout(function() {
        that.__val.validate();
      }, 0);
      this.wait(1000);
    },

    testInvalidFont : function()
    {
      this.__val.fontFamily = "zzzzzzzzzzzzzzz";
      this.__val.timeout = 250;
      this.__val.on("changeStatus", function(result) {
        this.resume(function(ev) {
          this.assertFalse(result.valid);
        }, this);
      }, this);

      var that = this;
      window.setTimeout(function() {
        that.__val.validate();
      }, 0);
      this.wait(500);
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

************************************************************************ */

describe("mobile.form.Input", function () {


    beforeEach (function ()  {
      setUpRoot();
      __item = new qx.ui.mobile.form.Input();
      getRoot().append(__item);
  });

  afterEach( function (){
     tearDownRoot();
  });
  
  it("Creation", function() {
      assert.equal("input", __item[0].nodeName.toLowerCase());
      __item.type = "text";
      assert.equal("text", __item.getAttribute("type"));
  });
 
  it("Required", function() {
      assert.isFalse(__item.getAttribute("required"));
      assert.isFalse(__item.hasClass("invalid"));
      __item.required = true;
      assert.isTrue(__item.getAttribute("required"));
      assert.isTrue(__item.hasClass("invalid"));
      __item.required = false;
      assert.isFalse(__item.getAttribute("required"));
      assert.isFalse(__item.hasClass("invalid"));
  });
 
  it("Validity", function() {
      __item.type = "text";
      assert.isTrue(__item.validity.valid);
      assert.isFalse(__item.hasClass("invalid"));
      __item.required = true;
      assert.isFalse(__item.validity.valid);
      assert.isTrue(__item.hasClass("invalid"));
      __item.setValue("Foo");
      assert.isTrue(__item.validity.valid);
      assert.isFalse(__item.hasClass("invalid"));
      __item.setValue("");
      assert.isFalse(__item.validity.valid);
      assert.isTrue(__item.hasClass("invalid"));
  });
 
  it("ValueMissing", function() {
      __item.type = "text";
      assert.isFalse(__item.validity.valueMissing);
      __item.required = true;
      assert.isTrue(__item.validity.valueMissing);
      __item.setValue("Foo");
      assert.isFalse(__item.validity.valueMissing);
      __item.setValue("");
      assert.isTrue(__item.validity.valueMissing);
  });
 
  it("SetCustomValidity", function() {
      var msg = "Invalid value";
      __item.setCustomValidity(msg);
      assert.isFalse(__item.validity.valid);
      assert.isTrue(__item.hasClass("invalid"));
      assert.equal(msg, __item.validationMessage);
      __item.setCustomValidity("");
      assert.isTrue(__item.validity.valid);
      assert.isFalse(__item.hasClass("invalid"));
      assert.equal("", __item.validationMessage);
  });
 
  it("InvalidEvent", function() {
      __item.required = true;
      qx.core.Assert.assertEventFired(__item, "invalid", function() {
        assert.isFalse(__item.checkValidity());
        assert.isFalse(__item.validity.valid);
        assert.isTrue(__item.hasClass("invalid"));
      }.bind(this));
  });
 
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

describe("mobile.form.TextField", function ()
{

  beforeEach (function ()  {
      setUpRoot();
      __tf = new qx.ui.mobile.form.TextField();
  });

  afterEach( function (){
     tearDownRoot();
  });
 
  it("Value", function() {
      getRoot().append(__tf);

      assert.equal(null,__tf.value);
      assert.equal(null,qx.bom.element.Attribute.get(__tf[0],'value'));
      qx.core.Assert.assertEventFired(__tf, "changeValue", function() {
        __tf.value = "mytext";
      }.bind(this));
      assert.equal('mytext',__tf.value);
      assert.equal('mytext',qx.bom.element.Attribute.get(__tf[0],'value'));

      __tf.dispose();

      __tf = new qx.ui.mobile.form.TextField('affe');
      getRoot().append(__tf);
      assert.equal('affe',__tf.value);
      assert.equal('affe',qx.bom.element.Attribute.get(__tf[0],'value'));
      __tf.dispose();
  });
 
  it("Enabled", function() {
      getRoot().append(__tf);
      assert.equal(true,__tf.enabled);
      assert.isFalse(qx.bom.element.Class.has(__tf[0],'disabled'));

      __tf.enabled = false;
      assert.equal(false,__tf.enabled);
      assert.equal(true,qx.bom.element.Class.has(__tf[0],'disabled'));

      __tf.dispose();
  });
 
  it("Pattern", function() {
      var pattern = "Foo";
      __tf.pattern = pattern;
      assert.equal(pattern, __tf.getAttribute("pattern"));
      // empty value is valid unless required
      assert.isTrue(__tf.validity.valid);
      __tf.value = "Bar";
      assert.isFalse(__tf.validity.valid);
      assert.isTrue(__tf.validity.patternMismatch);
      __tf.value = "Foo";
      assert.isTrue(__tf.validity.valid);
      assert.isFalse(__tf.validity.patternMismatch);
      __tf.pattern = "Bar";
      assert.isFalse(__tf.validity.valid);
      assert.isTrue(__tf.validity.patternMismatch);
      __tf.value = "";
      assert.isTrue(__tf.validity.valid);
      assert.isFalse(__tf.validity.patternMismatch);
  });
 
  it("MaxLength", function() {
      __tf.maxLength = 1;
      __tf.value = "Foo";
      assert.equal("F", __tf.value);
      __tf.maxLength = null;
      __tf.value = "Foo";
      assert.equal("Foo", __tf.value);
      __tf.maxLength = 1;
      assert.equal("F", __tf.value);
  });
});

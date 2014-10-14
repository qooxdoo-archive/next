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

describe("mobile.form.RadioButton", function ()
{
 
  beforeEach( function () {
     setUpRoot();
  });

  afterEach( function (){
     tearDownRoot();
  });
  
  it("Construct", function() {
      var radio1 = new qx.ui.mobile.form.RadioButton();
      var radio2 = new qx.ui.mobile.form.RadioButton();
      var radio3 = new qx.ui.mobile.form.RadioButton();
      var group = new qx.ui.mobile.form.RadioGroup(radio1,radio2,radio3);

      getRoot().append(radio1);
      getRoot().append(radio2);
      getRoot().append(radio3);

      // Verify: allow empty selection can only be false in this case,
      // so radio1 has to be true.
      assert.equal(true, radio1.getValue(),"Radio1 is expected to be true.");
      assert.equal(false, radio2.getValue(),"Radio2 is expected to be false.");
      assert.equal(false, radio3.getValue(),"Radio3 is expected to be false.");

      assert.equal(3, group.getItems().length);

       // Clean up tests
      radio1.dispose();
      radio2.dispose();
      radio3.dispose();
      group.dispose();
  });
 
  it("Value", function() {
      var radio1 = new qx.ui.mobile.form.RadioButton();
      var radio2 = new qx.ui.mobile.form.RadioButton();
      var radio3 = new qx.ui.mobile.form.RadioButton();
      var group = new qx.ui.mobile.form.RadioGroup();

      group.allowEmptySelection = true;
      group.add(radio1,radio2,radio3);

      getRoot().append(radio1);
      getRoot().append(radio2);
      getRoot().append(radio3);
      // Verify: inital all radios buttons should be disabled.
      assert.equal(false, radio1.getValue());
      assert.equal(false, radio2.getValue());
      assert.equal(false, radio3.getValue());

      assert.equal(false, radio1.hasClass("checked"));
      assert.equal(false, radio2.hasClass("checked"));
      assert.equal(false, radio3.hasClass("checked"));

      // Radio 1 enabled
      radio1.setValue(true);

      // Verify
      assert.equal(true, radio1.getValue());
      assert.equal(true, radio1.hasClass("checked"));
      assert.equal(false, radio2.getValue());
      assert.equal(false, radio3.getValue());

      // Radio 3 enabled
      radio3.setValue(true);

      // Verify
      assert.equal(true, radio3.getValue());
      assert.equal(false, radio2.getValue());
      assert.equal(false, radio1.getValue());

      // Clean up tests
      radio1.dispose();
      radio2.dispose();
      radio3.dispose();
      group.dispose();
  });
 
  it("Enabled", function() {
      var radio1 = new qx.ui.mobile.form.RadioButton();
      getRoot().append(radio1);

      radio1.enabled = false;

      assert.equal(false, radio1.enabled);
      assert.equal(true, qx.bom.element.Class.has(radio1[0],'disabled'));

      radio1.dispose();
  });

});

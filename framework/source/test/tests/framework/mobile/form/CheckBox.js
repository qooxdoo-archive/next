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

describe("mobile.form.CheckBox", function ()
{

  beforeEach( function () {
     setUpRoot();
  });

  afterEach( function (){
     tearDownRoot();
  });
  
 it("Value", function() {
      var checkBox = new qx.ui.mobile.form.CheckBox(false);
      getRoot().append(checkBox);

      assert.equal(false,checkBox.getValue());
      assert.equal(false, qxWeb(checkBox[0]).hasClass("checked"));

      checkBox.setValue(true);
      assert.equal(true,checkBox.getValue());
      assert.equal(true, qxWeb(checkBox[0]).hasClass("checked"));

      checkBox.dispose();
  });
 
  it("Enabled", function() {
      var checkBox = new qx.ui.mobile.form.CheckBox();
      getRoot().append(checkBox);
      checkBox.enabled = false;
      assert.equal(false,checkBox.enabled);
      assert.equal(true,qx.bom.element.Class.has(checkBox[0],'disabled'));

      checkBox.dispose();
  });
 
  it("Factory", function(done) {
      var checkBox = qxWeb.create("<div>").checkBox().appendTo(getRoot());
      assert.instanceOf(checkBox, qx.ui.mobile.form.CheckBox);
      assert.equal(checkBox, checkBox[0].$$widget);
      setTimeout (function() {
      assert.equal("qx.ui.mobile.form.CheckBox", checkBox.getData("qxWidget"));
      done();
      }, 100);
    

  });
});

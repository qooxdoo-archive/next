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

describe("mobile.basic.Label", function()
{
  
  beforeEach( function () {
     setUpRoot();
  });

  afterEach( function (){
     tearDownRoot();
  });
 
 it("Value", function() {

      var label = new qx.ui.mobile.basic.Label("affe");
      getRoot().append(label);

      assert.isString(label.value);
      assert.equal(label.value, "affe");
      assert.equal(label.value, label.getHtml());

      qx.core.Assert.assertEventFired(label, "changeValue", function() {
        label.value = "";
      });

      assert.equal(label.value, "");
      assert.isNull(label.getHtml());

      label.dispose();
    
  });

});
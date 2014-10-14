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

describe("mobile.container.Collapsible", function ()
{

  beforeEach( function () {
     setUpRoot();
  });

  afterEach( function (){
     tearDownRoot();
  });
  
  it("Factory", function() {
      var collapsible = q.create('<div>')
        .collapsible("Header")
        .appendTo(getRoot());

      assert.instanceOf(collapsible, qx.ui.mobile.container.Collapsible);
      assert.instanceOf(qxWeb(collapsible.getChildren()[0]), qx.ui.mobile.basic.Label);
      assert.instanceOf(collapsible.find(".collapsible-content"), qx.ui.mobile.Widget);
      collapsible.remove().dispose();
    
  });

});
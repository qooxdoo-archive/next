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

describe("mobile.layout.Card", function ()
{
  beforeEach( function () {
     setUpRoot();
  });

  afterEach( function (){
     tearDownRoot();
  });
  
  it("Add", function() {
      var composite = new qx.ui.mobile.Widget();
      composite.layout = new qx.ui.mobile.layout.Card();
      getRoot().append(composite);

      assert.isTrue(composite.hasClass("layout-card"));

      var widget1 = new qx.ui.mobile.Widget();
      composite.append(widget1);
      assert.isTrue(widget1.hasClass("layout-card-item"));

      var widget2 = new qx.ui.mobile.Widget();
      composite.append(widget2);
      assert.isTrue(widget2.hasClass("layout-card-item"));

      widget1.dispose();
      widget2.dispose();
      composite.dispose();
  });
 
  it("Remove", function() {
      var composite = new qx.ui.mobile.Widget();
      composite.layout = new qx.ui.mobile.layout.Card();
      getRoot().append(composite);

      var widget1 = new qx.ui.mobile.Widget();
      composite.append(widget1);
      widget1.remove();
      assert.isFalse(widget1.hasClass("layout-card-item"));

      var widget2 = new qx.ui.mobile.Widget();
      composite.append(widget2);
      widget2.remove();
      assert.isFalse(widget2.hasClass("layout-card-item"));


      composite.remove();
      assert.isTrue(composite.hasClass("layout-card"));

      widget1.dispose();
      widget2.dispose();
      composite.dispose();
  });
 
  it("Reset", function() {
      var composite = new qx.ui.mobile.Widget();
      composite.layout = new qx.ui.mobile.layout.Card();
      getRoot().append(composite);

      composite.layout = null;
      assert.isFalse(composite.hasClass("layout-card"));

      composite.dispose();
  });
 
  it("Show", function() {
      var composite = new qx.ui.mobile.Widget();
      composite.layout = new qx.ui.mobile.layout.Card();
      getRoot().append(composite);

      var widget1 = new qx.ui.mobile.Widget();
      composite.append(widget1);

      var widget2 = new qx.ui.mobile.Widget();
      composite.append(widget2);

      widget1.show();
      widget2.show();

      widget1.dispose();
      widget2.dispose();
      composite.dispose();
    
  });

});

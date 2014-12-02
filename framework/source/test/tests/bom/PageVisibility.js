/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (wittemann)

************************************************************************ */


describe("bom.PageVisibility", function() {

  beforeEach(function() {
    __visibility = new qx.bom.PageVisibility();
  });


  it("VisibilityState", function() {
    var possible = ["hidden", "visible", "prerender", "unloaded"];
    var value = __visibility.getVisibilityState();
    qx.core.Assert.assertInArray(value, possible);
  });


  it("Hidden", function() {
    assert.isBoolean(__visibility.isHidden());
  });


  it("GetInstance", function() {
    assert.equal(qx.bom.PageVisibility.getInstance(), qx.bom.PageVisibility.getInstance());
  });

});

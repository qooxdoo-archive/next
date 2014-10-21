/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

describe("mobile.container.Drawer", function() {

  beforeEach(function() {
    setUpRoot();
  });


  afterEach(function() {
    tearDownRoot();
  });


  it("InitComposite", function() {
    var parentContainer = new qx.ui.mobile.Widget();

    var drawer = new qx.ui.mobile.container.Drawer(parentContainer);

    var drawerCandidate = parentContainer.getChildren()[0];

    assert.equal(drawer[0], drawerCandidate, "Unexpected children of composite.");

    drawer.dispose();
  });


  it("InitRoot", function() {
    var drawer = new qx.ui.mobile.container.Drawer();

    var drawerCandidate = getRoot().getChildren()[0];

    assert.equal(drawer[0], drawerCandidate, "Unexpected children of root.");

    drawer.dispose();
  });


  it("ShowHide", function() {
    var drawer = new qx.ui.mobile.container.Drawer();

    drawer.transitionDuration = 0;

    // Initial hidden.
    assert.isTrue(drawer.isHidden(), "Drawer is asserted to be initially hidden.");

    // Show.
    drawer.show();

    assert.isFalse(drawer.isHidden(), "Drawer is asserted to be shown.");

    // Hide again.
    drawer.hide();

    assert.isTrue(drawer.isHidden(), "Drawer is asserted to be hidden.");

    drawer.dispose();
  });


  it("ToggleVisibility", function() {
    var drawer = new qx.ui.mobile.container.Drawer();

    drawer.transitionDuration = 0;

    // Initial hidden.
    assert.isTrue(drawer.isHidden(), "Drawer is asserted to be initially hidden.");

    // Toggle visibility.
    var targetVisibility = drawer.toggleVisibility();

    assert.isTrue(targetVisibility, "Drawer's targetVisibility is asserted to be true.");
    assert.isFalse(drawer.isHidden(), "Drawer is asserted to be shown.");

    // Toggle visibility again.
    targetVisibility = drawer.toggleVisibility();

    assert.isFalse(targetVisibility, "Drawer's targetVisibility is asserted to be false.");
    assert.isTrue(drawer.isHidden(), "Drawer is asserted to be hidden.");

    drawer.dispose();
  });

});

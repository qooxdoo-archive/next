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

describe("mobile.dialog.Popup", function() {

  beforeEach(function() {
    setUpRoot();
  });


  afterEach(function() {
    tearDownRoot();
  });


  it("Show", function() {
    var label = new qx.ui.mobile.basic.Label("test");
    var popup = new qx.ui.mobile.dialog.Popup(label);

    assert.notEqual("visible", popup.visibility);

    popup.show();

    assert.equal("visible", popup.visibility);

    label.dispose();
    popup.dispose();
  });


  it("ShowHide", function() {
    //this.require(["debug"]);
    var popup = new qx.ui.mobile.dialog.Popup(new qx.ui.mobile.Widget());

    // Modal mode false test cases, no changes expected.
    popup.modal = false;
    popup.show();

    assert.equal("visible", popup.visibility, 'popup should be visible.');
    assert.equal(0, qxWeb(document.body).getChildren(".blocker").length, 'Modal mode is false, blocker should be still hidden.');

    popup.hide();

    assert.notEqual("visible", popup.visibility, 'popup should not be visible.');
    assert.equal(0, qxWeb(document.body).getChildren(".blocker").length, 'Modal mode is false, called popup.hide(), blocker should be still hidden.');

    popup.show();

    assert.equal(0, qxWeb(document.body).getChildren(".blocker").length, 'Modal mode is false, called popup.show(), blocker should be still hidden.');
    assert.equal("visible", popup.visibility, 'popup should be visible.');

    // Modal mode true test cases
    popup.modal = true;
    popup.show();

    assert.equal(1, qxWeb(document.body).getChildren(".blocker").length, 'Modal mode is true, called popup.show(), Blocker should be shown.');

    popup.hide();
    assert.equal(0, qxWeb(document.body).getChildren(".blocker").length, 'Modal mode is true, called dialog.hide(), Blocker should not be shown.');
    popup.dispose();
  });
  // function hasDebug () {
  //   return qx.core.Environment.get("qx.debug");
  // }
});

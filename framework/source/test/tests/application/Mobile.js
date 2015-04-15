/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2015 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tobias Oberrauch (toberrauch)

************************************************************************ */
describe("application.Mobile", function () {

  var app = new qx.application.Mobile();
  app.main();

  it("main", function () {
    var Env = qx.core.Environment;

// has body classes
    qxWeb(document.body).hasClass(Env.get("os.name"));
    qxWeb(document.body).hasClass("v" + Env.get("os.version").charAt(0));
    qxWeb(document.body).hasClass(Env.get("device.type"));

    assert.isTrue(qxWeb(window).hasListener("orientationchange"));

    var flexboxSyntax = qx.core.Environment.get("css.flexboxSyntax");
    if (flexboxSyntax === "flex" || flexboxSyntax === "flexbox") {
      qxWeb(document.body).hasClass("qx-flex-ready");
    }
  });

  it("get and set root", function () {
    var root = app.getRoot();
    assert.instanceOf(root, qx.ui.core.Root);

    if (qx.core.Environment.get("qx.mobile.nativescroll") === false) {
      assert.isFalse(root.showScrollbarY);
    } else {
      assert.isTrue(root.showScrollbarY);
    }

    var myRoot = new qx.ui.core.Root();
    app.setRoot(myRoot);
    assert.isTrue(app.getRoot() === myRoot);
  });
});
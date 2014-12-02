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

describe("mobile.form.Group", function() {

  it("Group", function() {
    var button = new qx.ui.Button("affe");
    var group = new qx.ui.form.Group();
    group.append(button);
    sandbox.append(button);

    group.dispose();
    button.dispose();
  });


  it("Factory", function() {
    var group = qxWeb.create("<div>").toGroup().appendTo(sandbox);
    assert.instanceOf(group, qx.ui.form.Group);
    assert.equal(group, group[0].$$widget);
    assert.equal("qx.ui.form.Group", group.getData("qxWidget"));

    group.dispose();
  });

});

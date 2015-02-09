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

describe("ui.form.CheckBox", function() {

  it("Value", function() {
    var checkBox = new qx.ui.form.CheckBox(false);
    sandbox.append(checkBox);

    assert.equal(false, checkBox.getValue());
    assert.equal(false, qxWeb(checkBox[0]).hasClass("checked"));

    checkBox.setValue(true);
    assert.equal(true, checkBox.getValue());
    assert.equal(true, qxWeb(checkBox[0]).hasClass("checked"));

    checkBox.dispose();
  });


  it("Enabled", function() {
    var checkBox = new qx.ui.form.CheckBox();
    sandbox.append(checkBox);
    checkBox.enabled = false;
    assert.equal(false, checkBox.enabled);
    assert.equal(true, qx.bom.element.Class.has(checkBox[0], 'disabled'));

    checkBox.dispose();
  });


  it("Factory", function() {
    var checkBox = qxWeb.create("<div>").toCheckBox().appendTo(sandbox);
    assert.instanceOf(checkBox, qx.ui.form.CheckBox);
    assert.equal(checkBox, checkBox[0].$$widget);
    assert.equal("qx.ui.form.CheckBox", checkBox.getData("qxWidget"));

    checkBox.dispose();
  });
});

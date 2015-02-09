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
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

describe("ui.dialog.Menu", function() {

  it("Init", function() {
    var model = new qx.data.Array(["item1", "item2", "item3"]);
    var model2 = new qx.data.Array(["item4", "item5", "item6"]);

    var menu = new qx.ui.dialog.Menu(model).appendTo(sandbox);
    menu.model = model2;
    menu.dispose();
  });


  it("Factory", function() {
    var menu = qxWeb.create("<div>").toMenu().appendTo(sandbox);
    assert.instanceOf(menu, qx.ui.dialog.Menu);
    qx.core.Assert.assertEquals(menu, menu[0].$$widget);
    assert.equal("qx.ui.dialog.Menu", menu.getData("qxWidget"));

    menu.dispose();
  });


  it("Selected", function() {
    var model = new qx.data.Array(["item1", "item2", "item3"]);
    var menu = new qx.ui.dialog.Menu(model).appendTo(sandbox);

    var el = menu.find("*[data-row='1']")[0]; // item 1
    var spy = sinonSandbox.spy();
    menu.on("selected", spy);
    menu.find(".list").emit("tap", {target: el});

    sinon.assert.calledOnce(spy);
    assert.equal(spy.args[0][0][0], el);

    menu.dispose();
  });
});

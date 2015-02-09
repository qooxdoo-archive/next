/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2013 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tobias Oberrauch (toberrauch)

************************************************************************ */

describe("Tree", function() {
  var data;
  var tree;


  beforeEach(function() {
    data = {
      "id": 1, "name": "root",
      "children" : [
        {"id": "folder_1_1", "name": "My Documents", "children" : []},
        {"id": "folder_1_2", "name": "My Music", "children": [] }
      ]
    };

    tree = new qx.ui.Tree();
    tree.appendTo(document.body);
    tree.setModel(data);
  });


  afterEach(function() {
    tree.remove();
    tree.dispose();
  });


  it("selected", function() {
    var spy = sinonSandbox.spy();

    var folder = tree.find("#folder_1_1")[0];
    tree.on("selected", spy);
    tree.emit("tap", {target: folder});
    sinon.assert.calledOnce(spy);
    assert.equal(spy.args[0][0][0], folder);
  });
});
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

describe("tree.Tree", function() {
  var data;
  var tree;


  beforeEach(function() {
    data = {
      "id": 1, "name": "root",
      "children" : [
        {"id": "1_1", "name": "My Documents", "children" : []},
        {"id": "1_2", "name": "My Music", "children": [] }
      ]
    };

    tree = new qx.ui.tree.Tree();
    tree.appendTo(document.body);
    tree.setModel(data);
  });


  afterEach(function() {
    tree.remove();
    tree.dispose();
  });


  it("selected", function() {
    var spy = sinon.spy();

    var folder = tree.find("#1_1")[0];
    tree.on("selected", spy);
    tree.emit("tap", {target: folder});
    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, folder);
  });
});
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

describe("ui.form.Row", function() {

  it("Factory", function() {
    var row = qxWeb.create("<div>").toRow().appendTo(sandbox);
    assert.instanceOf(row, qx.ui.form.Row);
    assert.equal(row, row[0].$$widget);
    assert.equal("qx.ui.form.Row", row.getData("qxWidget"));

    row.dispose();
  });

});

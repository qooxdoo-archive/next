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

describe("ui.Button", function() {

  it("Label", function() {
      var button = new qx.ui.Button("affe");
      sandbox.append(button);

      assert.isString(button.label);
      assert.equal("affe", button.label );
      assert.equal(button.label, button.getLabelWidget().getHtml());

      qx.core.Assert.assertEventFired(button, "changeLabel", function() {
        button.label = "";
      });

      assert.equal("", button.label);
      assert.isNull(button.getLabelWidget().getHtml());

      button.dispose();
  });


  it("Factory", function() {
      var button = qxWeb.create("<div>").toButton().appendTo(sandbox);
      assert.instanceOf(button, qx.ui.Button);
      assert.equal(button, button[0].$$widget);
      assert.equal("qx.ui.Button", button.getData("qxWidget"));

      button.dispose();
  });

});

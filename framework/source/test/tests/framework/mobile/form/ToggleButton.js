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

describe("mobile.form.ToggleButton", function() {

  beforeEach(function() {
    setUpRoot();
  });


  afterEach(function() {
    tearDownRoot();
  });


  it("Value", function() {
    var button = new qx.ui.form.ToggleButton(true);
    getRoot().append(button);

    assert.isBoolean(button.getValue());
    assert.isTrue(button.getValue());
    assert.isTrue(button.hasClass("checked"));

    qx.core.Assert.assertEventFired(button, "changeValue", function() {
      button.setValue(false);
    });

    assert.isFalse(button.getValue());

    button.dispose();
  });


  it("Toggle", function() {
    var button = new qx.ui.form.ToggleButton(true);
    getRoot().append(button);

    assert.isBoolean(button.getValue());
    assert.isTrue(button.getValue());

    button.toggle();
    assert.isFalse(button.getValue());

    button.toggle();
    assert.isTrue(button.getValue());

    button.dispose();
  });


  it("Factory", function() {
    var toggleButton = qxWeb.create("<div>").toggleButton().appendTo(getRoot());
    assert.instanceOf(toggleButton, qx.ui.mobile.form.ToggleButton);
    assert.equal(toggleButton, toggleButton[0].$$widget);
    assert.equal("qx.ui.mobile.form.ToggleButton", toggleButton.getData("qxWidget"));

    toggleButton.dispose();
  });
});

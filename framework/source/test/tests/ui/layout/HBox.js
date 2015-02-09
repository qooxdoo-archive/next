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

describe("ui.layout.HBox", function() {

  it("Add", function() {
    var composite = new qx.ui.Widget();
    composite.layout = new qx.ui.layout.HBox();
    sandbox.append(composite);

    assert.isTrue(composite.hasClass("qx-hbox"));
    var widget1 = new qx.ui.Widget();
    composite.append(widget1);

    var widget2 = new qx.ui.Widget();
    composite.append(widget2);

    widget1.dispose();
    widget2.dispose();
    composite.dispose();
  });


  it("Flex", function() {
    var composite = new qx.ui.Widget();
    composite.layout = new qx.ui.layout.HBox();
    sandbox.append(composite);

    var widget1 = new qx.ui.Widget();
    widget1.layoutPrefs = {
      flex: 1
    };
    composite.append(widget1);
    assert.isTrue(widget1.hasClass("qx-flex1"));

    var widget2 = new qx.ui.Widget();
    widget2.layoutPrefs = {
      flex: 2
    };
    composite.append(widget2);
    assert.isTrue(widget2.hasClass("qx-flex2"));

    widget1.dispose();
    widget2.dispose();
    composite.dispose();
  });


  it("Remove", function() {
    var composite = new qx.ui.Widget();
    composite.layout = new qx.ui.layout.HBox();
    sandbox.append(composite);

    var widget1 = new qx.ui.Widget();
    widget1.layoutPrefs = {
      flex: 1
    };
    composite.append(widget1);
    widget1.remove();
    assert.isFalse(widget1.hasClass("qx-flex1"));

    var widget2 = new qx.ui.Widget();
    widget2.layoutPrefs = {
      flex: 2
    };
    composite.append(widget2);
    widget2.remove();
    assert.isFalse(widget2.hasClass("qx-flex2"));

    composite.remove();
    assert.isTrue(composite.hasClass("qx-hbox"));

    widget1.dispose();
    widget2.dispose();
    composite.dispose();
  });


  it("Reset", function() {
    var composite = new qx.ui.Widget();
    composite.layout = new qx.ui.layout.HBox();
    sandbox.append(composite);

    composite.layout = null;
    assert.isFalse(composite.hasClass("qx-hbox"));

    composite.dispose();
  });
});

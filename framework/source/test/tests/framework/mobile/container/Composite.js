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

describe("mobile.container.Composite", function() {

  beforeEach(function() {
    setUpRoot();
  });

  afterEach(function() {
    tearDownRoot();
  });


  it("Add", function() {
    var composite = new qx.ui.Widget();
    getRoot().append(composite);

    var widget1 = new qx.ui.Widget();
    composite.append(widget1);

    var widget2 = new qx.ui.Widget();
    composite.append(widget2);

    _assertChildren(composite, 2);

    widget1.dispose();
    widget2.dispose();
    composite.dispose();
  });


  it("AddSame", function() {
    var composite = new qx.ui.Widget();
    getRoot().append(composite);

    var widget1 = new qx.ui.Widget();
    composite.append(widget1);
    composite.append(widget1);

    _assertChildren(composite, 1);

    widget1.dispose();
    composite.dispose();
  });


  it("AddOther", function() {
    var composite1 = new qx.ui.Widget();
    getRoot().append(composite1);
    var composite2 = new qx.ui.Widget();
    getRoot().append(composite2);

    var widget = new qx.ui.Widget();
    composite1.append(widget);

    _assertChildren(composite1, 1);

    composite2.append(widget);

    _assertChildren(composite1, 0);
    assert.isFalse(composite1[0].hasChildNodes());

    _assertChildren(composite2, 1);
    assert.equal(composite2[0], widget[0].parentNode);

    widget.dispose();
    composite1.dispose();
    composite2.dispose();
  });


  it("AddBefore", function() {
    var composite = new qx.ui.Widget();
    getRoot().append(composite);

    var widget1 = new qx.ui.Widget();
    composite.append(widget1);

    var widget2 = new qx.ui.Widget();
    composite.append(widget2);

    if (qx.core.Environment.get("qx.debug")) {
      assert.throw(function() {
        widget2.insertBefore(widget3);
      });
    }

    var widget3 = new qx.ui.Widget();
    widget3.insertBefore(widget2);

    assert.equal(1, composite.getChildren().indexOf(widget3));

    assert.equal(widget3[0], composite[0].childNodes[1]);

    widget1.dispose();
    widget2.dispose();
    widget3.dispose();
    composite.dispose();
  });


  it("AddAfter", function() {
    var composite = new qx.ui.Widget();
    getRoot().append(composite);

    var widget1 = new qx.ui.Widget();
    composite.append(widget1);

    var widget2 = new qx.ui.Widget();
    composite.append(widget2);

    if (qx.core.Environment.get("qx.debug")) {
      assert.throw(function() {
        composite.insertAfter(widget2, widget3);
      });
    }

    var widget3 = new qx.ui.Widget();

    widget3.insertAfter(widget2);

    assert.equal(2, composite.getChildren().indexOf(widget3));

    assert.equal(widget3[0], composite[0].childNodes[2]);

    widget3.remove();

    widget3.insertAfter(widget1);

    assert.equal(widget3[0], composite[0].childNodes[1]);

    widget1.dispose();
    widget2.dispose();
    widget3.dispose();
    composite.dispose();
  });


  it("Destroy", function() {
    var composite = new qx.ui.Widget();
    getRoot().append(composite);

    var widget1 = new qx.ui.Widget();
    composite.append(widget1);

    var widget2 = new qx.ui.Widget();
    composite.append(widget2);

    _assertChildren(composite, 2);

    widget1.dispose();
    widget2.dispose();

    _assertChildren(composite, 0);

    composite.dispose();
  });


  it("Remove", function() {
    var composite = new qx.ui.Widget();
    getRoot().append(composite);

    var widget1 = new qx.ui.Widget();
    composite.append(widget1);

    var widget2 = new qx.ui.Widget();
    composite.append(widget2);

    _assertChildren(composite, 2);

    widget1.remove();
    _assertChildren(composite, 1);

    widget2.remove();
    _assertChildren(composite, 0);

    widget1.dispose();
    widget2.dispose();
    composite.dispose();
  });


  it("Empty", function() {
    var composite = new qx.ui.Widget();
    getRoot().append(composite);

    var widget1 = new qx.ui.Widget();
    composite.append(widget1);

    var widget2 = new qx.ui.Widget();
    composite.append(widget2);

    _assertChildren(composite, 2);

    composite.empty();
    _assertChildren(composite, 0);

    widget1.dispose();
    widget2.dispose();
    composite.dispose();
  });


  it("HasChildren", function() {
    var composite = new qx.ui.Widget();
    getRoot().append(composite);

    assert.equal(0, composite.getChildren().length);

    var widget = new qx.ui.Widget();
    composite.append(widget);

    assert.isTrue(composite.getChildren().length > 0);

    widget.dispose();

    assert.equal(0, composite.getChildren().length);

    composite.dispose();
  });


  it("IndexOf", function() {
    var composite = new qx.ui.Widget();
    getRoot().append(composite);

    var widget1 = new qx.ui.Widget();
    composite.append(widget1);

    var widget2 = new qx.ui.Widget();
    composite.append(widget2);

    assert.equal(0, composite.getChildren().indexOf(widget1));
    assert.equal(1, composite.getChildren().indexOf(widget2));

    widget1.dispose();
    widget2.dispose();
    composite.dispose();
  });


  function _assertChildren(composite, number) {
    var children = composite.getChildren();
    assert.isNotNull(children);
    var length = children.length;
    assert.equal(length, number);
    length = composite[0].childNodes.length;
    assert.equal(length, number);
  }
});

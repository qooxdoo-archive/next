/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2011-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

describe("mobile.form.SelectBox", function() {

  it("Value", function() {
    var selectBox = new qx.ui.form.SelectBox();
    var dd = new qx.data.Array(["Item 1", "Item 2", "Item 3"]);
    selectBox.model = dd;

    // Initial value ''
    assert.equal(null, selectBox.value);

    // Attempt to set value to "Item 3"
    selectBox.value = "Item 3";
    assert.equal("Item 3", selectBox.getAttribute("value"));

    // Attempting to set invalid value throws validation error.
    assert.throw(function() {
      selectBox.value = "Item 4";
    });

    assert.equal("Item 3", selectBox.value, "Nothing should be changed by input setValue('Item 4') because input value is not in model.");

    selectBox.dispose();
    dd.dispose();
  });


  it("ModelValue", function() {
    var selectBox = new qx.ui.form.SelectBox();
    var toString = function() {return this.id;};
    var items = [];
    items.push({title: "A", id: 1, toString: toString});
    items.push({title: "B", id: 2, toString: toString});
    var dd = new qx.data.Array(items);
    selectBox.model = dd;

    // Initial value ''
    assert.equal(null, selectBox.value);

    // Attempt to set value to "Item 3"
    selectBox.value = items[1];
    assert.equal("2", selectBox.getAttribute("value"));

    // Attempting to set invalid value throws validation error.
    assert.throw(function() {
      selectBox.value = "Item 4";
    });

    assert.equal(items[1], selectBox.value, "Nothing should be changed by input setValue('Item 4') because input value is not in model.");

    selectBox.dispose();
    dd.dispose();
  });


  it("ValueNoModel", function() {
    var selectBox = new qx.ui.form.SelectBox();
    assert.throw(function() {
      selectBox.value = "Anything";
    });

    selectBox.dispose();
  });


  it("ResetValue", function() {
    var model = new qx.data.Array(["Item 1", "Item 2", "Item 3"]);
    var selectBox = new qx.ui.form.SelectBox();
    selectBox.model = model;
    selectBox.value = "Item 3";

    selectBox.value = undefined;
    assert.equal(null, selectBox.value);

    selectBox.dispose();
  });


  it("ChangeModel", function() {
    var model = new qx.data.Array(["Item 1", "Item 2", "Item 3"]);
    var model2 = new qx.data.Array(["Item 11", "Item 22", "Item 33"]);
    var selectBox = new qx.ui.form.SelectBox();
    selectBox.model = model;
    selectBox.value = "Item 3";

    assert.equal("Item 3", selectBox.getAttribute("value"));
    selectBox.model = model2;
    assert.isNull(selectBox.getAttribute("value"));

    selectBox.dispose();
  });


  it("UpdateModel", function() {
    var model = new qx.data.Array(["Item 1", "Item 2", "Item 3"]);
    var selectBox = new qx.ui.form.SelectBox();
    selectBox.model = model;
    selectBox.value = "Item 3";

    assert.equal("Item 3", selectBox.getAttribute("value"));
    model.push("Item 4");
    assert.equal("Item 3", selectBox.getAttribute("value"));
    selectBox.value = "Item 4";
    assert.equal("Item 4", selectBox.getAttribute("value"));

    selectBox.dispose();
  });


  it("Factory", function() {
    var selectBox = qxWeb.create("<div>").toSelectBox().appendTo(sandbox);
    assert.instanceOf(selectBox, qx.ui.form.SelectBox);
    assert.equal(selectBox, selectBox[0].$$widget);
    assert.equal("qx.ui.form.SelectBox", selectBox.getData("qxWidget"));

    selectBox.dispose();
  });
});

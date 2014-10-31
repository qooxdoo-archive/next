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

  beforeEach(function() {
    setUpRoot();
  });


  afterEach(function() {
    tearDownRoot();
  });


  it("Value", function() {
    var selectBox = new qx.ui.form.SelectBox();
    var dd = new qx.data.Array(["Item 1", "Item 2", "Item 3"]);
    selectBox.model = dd;

    // Initial value '''
    assert.equal(null, selectBox.value);

    // Attempt to set value to "Item 3"
    selectBox.value = "Item 3";
    assert.equal(2, selectBox.selection);
    assert.equal("Item 3", selectBox.value);

    // Attempting to set invalid value throws validation error.
    assert.throw(function() {
      selectBox.value = "Item 4";
    });

    assert.equal("Item 3", selectBox.value, "Nothing should be changed by input setValue('Item 4') because input value is not in model.");

    selectBox.dispose();
    dd.dispose();
    dd = null;
  });


  it("Nullable", function() {
    var model = new qx.data.Array(["Item 1", "Item 2", "Item 3"]);
    var selectBox = new qx.ui.form.SelectBox();
    selectBox.model = model;

    // Default case: nullable is true, selection is null.
    assert.equal(null, selectBox.selection, "Default selection of SelectBox should be null.");

    // Switch to nullable true...
    selectBox.nullable = false;
    selectBox.selection = 0;

    // Attempting to set null value throws validation error.
    assert.throw(function() {
      selectBox.selection = null;
    });

    // Switch to nullable true... try to set selection to null..
    selectBox.nullable = true;
    selectBox.selection = null;
    assert.equal(null, selectBox.selection, "Value should be null.");

    // After
    selectBox.dispose();
    model.dispose();
    model = null;
  });


  it("SelectionNoModel", function() {
    var selectBox = new qx.ui.form.SelectBox();
    assert.throw(function() {
      selectBox.selection = 4;
    });

    selectBox.dispose();
  });


  it("ResetValue", function() {
    var model = new qx.data.Array(["Item 1", "Item 2", "Item 3"]);
    var selectBox = new qx.ui.form.SelectBox();
    selectBox.model = model;
    selectBox.nullable = true;
    selectBox.value = "Item 3";

    assert.equal(2, selectBox.selection);

    selectBox.value = undefined;

    assert.equal(null, selectBox.selection);

    // After
    selectBox.dispose();
    model.dispose();
    model = null;
  });


  it("ResetValueNotNullable", function() {
    var model = new qx.data.Array(["Item 1", "Item 2", "Item 3"]);
    var selectBox = new qx.ui.form.SelectBox();
    selectBox.model = model;
    selectBox.nullable = false;
    selectBox.value = "Item 3";

    assert.equal(2, selectBox.selection);

    selectBox.value = undefined;

    assert.equal(0, selectBox.selection);

    // After
    selectBox.dispose();
    model.dispose();
    model = null;
  });


  it("Selection", function() {
    var model = new qx.data.Array(["Item 1", "Item 2", "Item 3"]);
    var selectBox = new qx.ui.form.SelectBox();
    selectBox.model = model;

    // Default value of selectedIndex after setting model is 0.
    assert.equal(null, selectBox.selection);

    // Set selection success
    selectBox.selection = 2;
    assert.equal(2, selectBox.selection);
    assert.equal("Item 3", selectBox.value);

    // Set selection failure
    // Nothing is changed because invalid selectedIndex value.
    assert.throw(function() {
      selectBox.selection = 4;
    });

    assert.equal(2, selectBox.selection);
    assert.equal("Item 3", selectBox.value);

    // Negative values are not allowed. Nothing is changed.
    assert.throw(function() {
      selectBox.selection = -1;
    });

    assert.equal(2, selectBox.selection);
    assert.equal("Item 3", selectBox.value);

    // Only type Number is allowed. Nothing is changed.
    assert.throw(function() {
      selectBox.selection = "foo";
    });

    assert.equal(2, selectBox.selection);
    assert.equal("Item 3", selectBox.value);

    // After
    selectBox.dispose();
    model.dispose();
    model = null;
  });


  it("Factory", function() {
    var selectBox = qxWeb.create("<div>").selectBox().appendTo(getRoot());
    assert.instanceOf(selectBox, qx.ui.form.SelectBox);
    assert.equal(selectBox, selectBox[0].$$widget);
    assert.equal("qx.ui.form.SelectBox", selectBox.getData("qxWidget"));

    selectBox.dispose();
  });
});

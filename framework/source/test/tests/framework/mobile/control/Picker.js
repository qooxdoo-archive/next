/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

describe("mobile.control.Picker", function() {

  beforeEach(function() {
    setUpRoot();
  });


  afterEach(function() {
    tearDownRoot();
  });


  it("Init", function() {
    // SMOKE TEST for Picker widget.
    var pickerSlot1 = new qx.data.Array(["qx.Desktop", "qx.Mobile", "qx.Website", "qx.Server"]);
    var pickerSlot2 = new qx.data.Array(["1.5.1", "1.6.1", "2.0.4", "2.1.2", "3.0"]);

    var picker = new qx.ui.control.Picker();

    assert.isTrue(picker.getSlotCount() === 0, 'Unexpected picker slot count.');

    picker.addSlot(pickerSlot1);
    picker.addSlot(pickerSlot2);

    assert.isTrue(picker.getSlotCount() === 2, 'Unexpected picker slot count.');

    picker.removeSlot(0);

    assert.isTrue(picker.getSlotCount() === 1, 'Unexpected picker slot count.');
  });


  it("Factory", function() {
    var picker = qxWeb.create("<div>").toPicker().appendTo(getRoot());
    assert.instanceOf(picker, qx.ui.control.Picker);
    qx.core.Assert.assertEquals(picker, picker[0].$$widget);
    assert.equal("qx.ui.control.Picker", picker.getData("qxWidget"));

    picker.dispose();
  });


  it("DefaultSelection", function() {
    var picker = new qx.ui.control.Picker()
      .appendTo(getRoot());

    var pickerSlot1 = new qx.data.Array(["a", "b", "c"]);
    var pickerSlot2 = new qx.data.Array(["0", "1", "2"]);
    picker.addSlot(pickerSlot1);
    picker.addSlot(pickerSlot2);

    var sel = picker.find("*[data-row=0]");
    assert.equal(picker.selection[0], "a");
    assert.equal(picker.selection[1], "0");

    picker.dispose();
  });


  it("SelectionAddSlot", function() {
    var picker = new qx.ui.control.Picker()
      .appendTo(getRoot());

    var pickerSlot1 = new qx.data.Array(["a", "b", "c"]);
    var pickerSlot2 = new qx.data.Array(["0", "1", "2"]);

    picker.addSlot(pickerSlot1);
    var sel = picker.find("*[data-row=0]");
    assert.equal(picker.selection[0], "a");

    picker.addSlot(pickerSlot2);
    sel = picker.find("*[data-row=0]");
    assert.equal(picker.selection[0], "a");
    assert.equal(picker.selection[1], "0");

    picker.dispose();
  });


  it("SelectionRemoveSlot", function() {
    var picker = new qx.ui.control.Picker()
      .appendTo(getRoot());

    var pickerSlot1 = new qx.data.Array(["a", "b", "c"]);
    var pickerSlot2 = new qx.data.Array(["0", "1", "2"]);

    picker.addSlot(pickerSlot1);
    picker.addSlot(pickerSlot2);

    var sel = picker.find("*[data-row=0]");
    assert.equal(picker.selection[0], "a");
    assert.equal(picker.selection[1], "0");

    picker.removeSlot(1);
    sel = picker.find("*[data-row=0]");
    assert.equal(sel.length, 1);
    assert.equal(picker.selection[0], "a");
    assert.equal(picker.selection.length, 1);

    picker.dispose();
  });


  it("SelectionManipulationAdd", function() {
    var picker = new qx.ui.control.Picker()
      .appendTo(getRoot());

    var pickerSlot1 = new qx.data.Array(["a", "b", "c"]);
    var pickerSlot2 = new qx.data.Array(["0", "1", "2"]);

    picker.addSlot(pickerSlot1);
    picker.addSlot(pickerSlot2);

    var cb = sinon.spy();
    picker.on("selected", cb);
    picker.selection[1] = "2";
    sinon.assert.calledOnce(cb);
    assert.equal(cb.args[0][0][0], "a");
    assert.equal(cb.args[0][0][1], "2");

    picker.selection[2] = "bla";
    sinon.assert.calledOnce(cb);

    picker.dispose();
  });


  it("SelectionManipulationRemove", function() {
    var picker = new qx.ui.control.Picker()
      .appendTo(getRoot());

    var pickerSlot1 = new qx.data.Array(["a", "b", "c"]);
    var pickerSlot2 = new qx.data.Array(["0", "1", "2"]);

    picker.addSlot(pickerSlot1);
    picker.addSlot(pickerSlot2);

    picker.removeSlot(1);

    var cb = sinon.spy();
    picker.on("selected", cb);
    picker.selection[1] = "foo";
    sinon.assert.notCalled(cb);

    picker.dispose();
  });


  it("SelectionManipulationUpdate", function() {
    var picker = new qx.ui.control.Picker()
      .appendTo(getRoot());

    var pickerSlot1 = new qx.data.Array(["a", "b", "c"]);
    var pickerSlot2 = new qx.data.Array(["0", "1", "2"]);

    picker.addSlot(pickerSlot1);
    picker.addSlot(pickerSlot2);

    var oldSelection = picker.selection;
    picker.selection = ["b", "1"];
    var cb = sinon.spy();
    picker.on("selected", cb);
    oldSelection[1] = "foo";
    sinon.assert.notCalled(cb);
    picker.selection[0] = "c";
    sinon.assert.calledOnce(cb);

    picker.dispose();
  });


  it("Selected", function() {
    var picker = new qx.ui.control.Picker()
      .appendTo(getRoot());

    var pickerSlot1 = new qx.data.Array(["a", "b", "c"]);
    var pickerSlot2 = new qx.data.Array(["0", "1", "2"]);
    picker.addSlot(pickerSlot1);
    picker.addSlot(pickerSlot2);
    var spy = sinon.spy();
    picker.on("selected", spy);
    picker.selection = ["b", "1"];
    sinon.assert.calledOnce(spy);
    assert.equal(spy.args[0][0][0], "b");
    assert.equal(spy.args[0][0][1], "1");

    picker.dispose();
  });


  it("SelectInvalid", function() {
    var picker = new qx.ui.control.Picker()
      .appendTo(getRoot());

    var pickerSlot1 = new qx.data.Array(["a", "b", "c"]);
    var pickerSlot2 = new qx.data.Array(["0", "1", "2"]);
    picker.addSlot(pickerSlot1);
    picker.addSlot(pickerSlot2);

    var selection = ["affe"];
    assert.throws(function() {
      picker.selection = selection;
    });

    picker.dispose();
  });

});

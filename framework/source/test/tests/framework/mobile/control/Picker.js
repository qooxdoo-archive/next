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
    picker.title = "Picker";

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
    assert.equal(sel[0], picker.selected[0]);
    assert.equal(sel[1], picker.selected[1]);

    picker.dispose();
  });


  it("SelectionAddSlot", function() {
    var picker = new qx.ui.control.Picker()
      .appendTo(getRoot());

    var pickerSlot1 = new qx.data.Array(["a", "b", "c"]);
    var pickerSlot2 = new qx.data.Array(["0", "1", "2"]);

    picker.addSlot(pickerSlot1);
    var sel = picker.find("*[data-row=0]");
    assert.equal(sel[0], picker.selected[0]);

    picker.addSlot(pickerSlot2);
    sel = picker.find("*[data-row=0]");
    assert.equal(sel[0], picker.selected[0]);
    assert.equal(sel[1], picker.selected[1]);

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
    assert.equal(sel[0], picker.selected[0]);
    assert.equal(sel[1], picker.selected[1]);

    picker.removeSlot(1);
    sel = picker.find("*[data-row=0]");
    assert.equal(1, sel.length);
    assert.equal(sel[0], picker.selected[0]);
    assert.equal(1, picker.selected.length);

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
    var selection = picker.find("*[data-row=2]").toArray();
    picker.selected = selection;
    sinon.assert.calledOnce(spy);
    assert.equal(selection[0], spy.args[0][0][0]);
    assert.equal(selection[1], spy.args[0][0][1]);

    picker.dispose();
  });


  it("SelectInvalid", function() {
    var picker = new qx.ui.control.Picker()
      .appendTo(getRoot());

    var pickerSlot1 = new qx.data.Array(["a", "b", "c"]);
    var pickerSlot2 = new qx.data.Array(["0", "1", "2"]);
    picker.addSlot(pickerSlot1);
    picker.addSlot(pickerSlot2);
    var spy = sinon.spy();
    picker.on("selected", spy);
    var selection = ["affe"];
    assert.throws(function() {
      picker.selected = selection;
    });

    picker.dispose();
  });

});

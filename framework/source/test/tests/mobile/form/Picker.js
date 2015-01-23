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

describe("mobile.form.Picker", function() {

  it("Init", function() {
    // SMOKE TEST for Picker widget.
    var pickerSlot1 = new qx.data.Array(["qx.Desktop", "qx.Mobile", "qx.Website", "qx.Server"]);
    var pickerSlot2 = new qx.data.Array(["1.5.1", "1.6.1", "2.0.4", "2.1.2", "3.0"]);

    var picker = new qx.ui.form.Picker();

    assert.isTrue(picker.getSlotCount() === 0, 'Unexpected picker slot count.');

    picker.addSlot(pickerSlot1);
    picker.addSlot(pickerSlot2);

    assert.isTrue(picker.getSlotCount() === 2, 'Unexpected picker slot count.');

    picker.removeSlot(0);

    assert.isTrue(picker.getSlotCount() === 1, 'Unexpected picker slot count.');
  });


  it("Factory", function() {
    var picker = qxWeb.create("<div>").toPicker().appendTo(sandbox);
    assert.instanceOf(picker, qx.ui.form.Picker);
    qx.core.Assert.assertEquals(picker, picker[0].$$widget);
    assert.equal("qx.ui.form.Picker", picker.getData("qxWidget"));

    picker.dispose();
  });


  it("DefaultValue", function() {
    var picker = new qx.ui.form.Picker()
      .appendTo(sandbox);

    var pickerSlot1 = new qx.data.Array(["a", "b", "c"]);
    var pickerSlot2 = new qx.data.Array(["0", "1", "2"]);
    picker.addSlot(pickerSlot1);
    picker.addSlot(pickerSlot2);

    var sel = picker.find("*[data-row='0']");
    assert.equal(picker.value[0], "a");
    assert.equal(picker.value[1], "0");

    picker.dispose();
  });


  it("ValueAddSlot", function() {
    var picker = new qx.ui.form.Picker()
      .appendTo(sandbox);

    var pickerSlot1 = new qx.data.Array(["a", "b", "c"]);
    var pickerSlot2 = new qx.data.Array(["0", "1", "2"]);

    picker.addSlot(pickerSlot1);
    var sel = picker.find("*[data-row='0']");
    assert.equal(picker.value[0], "a");

    picker.addSlot(pickerSlot2);
    sel = picker.find("*[data-row='0']");
    assert.equal(picker.value[0], "a");
    assert.equal(picker.value[1], "0");

    picker.dispose();
  });


  it("ValueRemoveSlot", function() {
    var picker = new qx.ui.form.Picker()
      .appendTo(sandbox);

    var pickerSlot1 = new qx.data.Array(["a", "b", "c"]);
    var pickerSlot2 = new qx.data.Array(["0", "1", "2"]);

    picker.addSlot(pickerSlot1);
    picker.addSlot(pickerSlot2);

    var sel = picker.find("*[data-row='0']");
    assert.equal(picker.value[0], "a");
    assert.equal(picker.value[1], "0");

    picker.removeSlot(1);
    sel = picker.find("*[data-row='0']");
    assert.equal(sel.length, 1);
    assert.equal(picker.value[0], "a");
    assert.equal(picker.value.length, 1);

    picker.dispose();
  });


  it("ValueManipulationAdd", function() {
    var picker = new qx.ui.form.Picker()
      .appendTo(sandbox);

    var pickerSlot1 = new qx.data.Array(["a", "b", "c"]);
    var pickerSlot2 = new qx.data.Array(["0", "1", "2"]);

    picker.addSlot(pickerSlot1);
    picker.addSlot(pickerSlot2);

    var cb = sinonSandbox.spy();
    picker.on("changeValue", cb);
    picker.value[1] = "2";
    sinon.assert.calledOnce(cb);
    assert.equal(cb.args[0][0][0], "a");
    assert.equal(cb.args[0][0][1], "2");

    picker.value[2] = "bla";
    sinon.assert.calledOnce(cb);

    picker.dispose();
  });


  it("ValueManipulationRemove", function() {
    var picker = new qx.ui.form.Picker()
      .appendTo(sandbox);

    var pickerSlot1 = new qx.data.Array(["a", "b", "c"]);
    var pickerSlot2 = new qx.data.Array(["0", "1", "2"]);

    picker.addSlot(pickerSlot1);
    picker.addSlot(pickerSlot2);

    picker.removeSlot(1);

    var cb = sinonSandbox.spy();
    picker.on("changeValue", cb);
    picker.value[1] = "foo";
    sinon.assert.notCalled(cb);

    picker.dispose();
  });


  it("ValueManipulationUpdate", function() {
    var picker = new qx.ui.form.Picker()
      .appendTo(sandbox);

    var pickerSlot1 = new qx.data.Array(["a", "b", "c"]);
    var pickerSlot2 = new qx.data.Array(["0", "1", "2"]);

    picker.addSlot(pickerSlot1);
    picker.addSlot(pickerSlot2);

    qx.core.Assert.assertEventFired(
      picker,
      "changeValue",
      function () {
        assert.equal(picker.value[0], "a");
        assert.equal(picker.value[1], "0");

        picker.value = ["b", "1"];
      }.bind(this),
      function (event) {
        assert.equal(event.value[0], "b");
        assert.equal(event.value[1], "1");
        assert.equal(picker, event.target);
      }.bind(this)
    );

    picker.dispose();
  });


  it("ChangeValue", function() {
    var picker = new qx.ui.form.Picker()
      .appendTo(sandbox);

    var pickerSlot1 = new qx.data.Array(["a", "b", "c"]);
    var pickerSlot2 = new qx.data.Array(["0", "1", "2"]);
    picker.addSlot(pickerSlot1);
    picker.addSlot(pickerSlot2);
    var spy = sinonSandbox.spy();
    picker.on("changeValue", spy);
    picker.value = ["b", "1"];
    sinon.assert.calledOnce(spy);
    assert.equal(spy.args[0][0].value[0], "b");
    assert.equal(spy.args[0][0].value[1], "1");

    picker.dispose();
  });


  it("ValueInvalid", function() {
    var picker = new qx.ui.form.Picker()
      .appendTo(sandbox);

    var pickerSlot1 = new qx.data.Array(["d", "e", "f"]);
    var pickerSlot2 = new qx.data.Array(["3", "4", "5"]);
    picker.addSlot(pickerSlot1);
    picker.addSlot(pickerSlot2);

    var value = ["affe"];
    assert.throws(function() {
      picker.value = value;
    });

    picker.dispose();
  });

});

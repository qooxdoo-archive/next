/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Daniel Wagner (danielwagner)

************************************************************************ */

/**
 * @require(qx.ui.form.DatePicker)
 */
describe("ui.form.DatePicker", function() {
  it("ReadOnlyInputElement", function() {
    var datePickerHtml = q.create("<input type='text' id='datepicker' data-qx-class='qx.ui.form.DatePicker' data-qx-config-read-only='false' value='' />");
    sandbox.append(datePickerHtml);

    var datePicker = q("input#datepicker").toDatePicker();

    // config is set via data attribute 'data-qx-config-input-read-only'
    assert.isFalse(datePicker.getAttribute('readonly'));
    datePicker.dispose();
  });


  it("ReadOnlyInputElementWithConfig", function() {
    var datePickerHtml = q.create("<input type='text' class='datepicker' data-qx-class='qx.ui.form.DatePicker' data-qx-config-read-only='true' value='' />");
    sandbox.append(datePickerHtml);

    var datePicker = q("input.datepicker").toDatePicker();
    assert.isTrue(datePicker.readOnly);
    assert.isTrue(datePicker.getAttribute('readonly'));
    datePicker.readOnly = false;
    assert.isFalse(datePicker.getAttribute('readonly'));

    datePicker.dispose();
  });


  it("Factory", function() {
    var datePicker = qxWeb.create("<div>").toDatePicker().appendTo(sandbox);
    assert.instanceOf(datePicker, qx.ui.form.DatePicker);
    qx.core.Assert.assertEquals(datePicker, datePicker[0].$$widget);
    assert.equal("qx.ui.form.DatePicker", datePicker.getData("qxWidget"));

    datePicker.dispose();
  });
});

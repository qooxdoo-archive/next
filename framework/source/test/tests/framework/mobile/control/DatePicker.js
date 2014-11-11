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
 * @require(qx.ui.control.DatePicker)
 */
describe("mobile.control.DatePicker", function() {

  beforeEach(function() {
    setUpRoot();
  });

  afterEach(function() {
    tearDownRoot();
  });


  it("ReadOnlyInputElement", function() {
    var datePickerHtml = q.create("<input type='text' id='datepicker' data-qx-class='qx.ui.control.DatePicker' data-qx-config-readonly='false' value='' />");
    getRoot().append(datePickerHtml);

    var datePicker = q("input#datepicker").toDatePicker();

    // config is set via data attribute 'data-qx-config-input-read-only'
    assert.isFalse(datePicker.getAttribute('readonly'));
    datePicker.dispose();
  });


  it("ReadOnlyInputElementWithConfig", function() {
    var datePickerHtml = q.create("<input type='text' class='datepicker' data-qx-class='qx.ui.control.DatePicker' data-qx-config-readonly='true' value='' />");
    getRoot().append(datePickerHtml);

    var datePicker = q("input.datepicker").toDatePicker();
    assert.isTrue(datePicker.readonly);
    assert.isTrue(datePicker.getAttribute('readonly'));
    datePicker.readonly = false;
    assert.isFalse(datePicker.getAttribute('readonly'));

    datePicker.dispose();
  });


  it("IconOpener", function() {
    var datePickerHtml = q.create("<input type='text' class='datepicker' data-qx-class='qx.ui.control.DatePicker' value='' />");
    getRoot().append(datePickerHtml);

    var datePicker = q("input.datepicker").toDatePicker();
    datePicker.icon = 'framework/source/resource/qx/icon/Tango/22/apps/office-calendar.png';

    var icon = datePicker.getNext();
    assert.equal(1, icon.length);
    assert.equal('img', q.getNodeName(icon));
    assert.equal('qx-datepicker-icon', icon.getClass());

    datePicker.dispose();
  });


  it("IconOpenerToggle", function() {
    var datePickerHtml = q.create("<input type='text' class='datepicker' data-qx-class='qx.ui.control.DatePicker' value='' />");
    getRoot().append(datePickerHtml);

    var datePicker = q("input.datepicker").toDatePicker();
    datePicker.icon = 'framework/source/resource/qx/icon/Tango/22/apps/office-calendar.png';
    var icon = datePicker.getNext(".qx-datepicker-icon");
    assert.equal(1, icon.length);

    datePicker.icon = null;

    icon = datePicker.getNext(".qx-datepicker-icon");
    assert.equal(0, icon.length);

    datePicker.dispose();
  });


  it("Factory", function() {
    var datePicker = qxWeb.create("<div>").toDatePicker().appendTo(getRoot());
    assert.instanceOf(datePicker, qx.ui.control.DatePicker);
    qx.core.Assert.assertEquals(datePicker, datePicker[0].$$widget);
    assert.equal("qx.ui.control.DatePicker", datePicker.getData("qxWidget"));

    datePicker.dispose();
  });
});

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
 * @require(qx.ui.mobile.control.DatePicker)
 */
describe("mobile.control.DatePicker", function() {

  beforeEach(function() {
    setUpRoot();
  });

  afterEach(function() {
    tearDownRoot();
  });


  it("ReadOnlyInputElement", function() {
    getRoot().append("<input type='text' id='datepicker' data-qx-class='qx.ui.mobile.control.DatePicker' data-qx-config-readonly='false' value=''></input");

    var datepicker = q("input#datepicker").datePicker();

    // config is set via data attribute 'data-qx-config-input-read-only'
    assert.isFalse(datepicker.getAttribute('readonly'));
    datepicker.dispose();
  });


  it("ReadOnlyInputElementWithConfig", function() {
    getRoot().append("<input type='text' class='datepicker' data-qx-class='qx.ui.mobile.control.DatePicker' data-qx-config-readonly='true' value=''></input");
    var datepicker = q("input.datepicker").datePicker();
    assert.isTrue(datepicker.readonly);
    assert.isTrue(datepicker.getAttribute('readonly'));
    datepicker.readonly = false;
    assert.isFalse(datepicker.getAttribute('readonly'));

    datepicker.dispose();
  });


  it("IconOpener", function() {
    getRoot().append("<input type='text' class='datepicker' data-qx-class='qx.ui.mobile.control.DatePicker' value=''></input>");

    var datepicker = q("input.datepicker").datePicker();
    datepicker.icon = '../../../../application/websitewidgetbrowser/demo/datepicker/office-calendar.png';

    var icon = datepicker.getNext();
    assert.equal(1, icon.length);
    assert.equal('img', q.getNodeName(icon));
    assert.equal('qx-datepicker-icon', icon.getClass());

    datepicker.dispose();
  });


  it("IconOpenerToggle", function() {
    var sandbox = q("#sandbox");

    getRoot().append("<input type='text' class='datepicker' data-qx-class='qx.ui.mobile.control.DatePicker' value='' />");

    var datepicker = q("input.datepicker").datePicker();
    datepicker.icon = '../../../../application/websitewidgetbrowser/demo/datepicker/office-calendar.png';
    var icon = datepicker.getNext(".qx-datepicker-icon");
    assert.equal(1, icon.length);

    datepicker.icon = null;

    icon = datepicker.getNext(".qx-datepicker-icon");
    assert.equal(0, icon.length);

    datepicker.dispose();
  });
});

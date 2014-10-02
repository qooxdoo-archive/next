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
qx.Class.define("qx.test.mobile.control.DatePicker",
{
  extend : qx.test.mobile.MobileTestCase,

  members :  {
    testReadOnlyInputElement : function() {
      this.getRoot().append("<input type='text' id='datepicker' data-qx-class='qx.ui.mobile.control.DatePicker' data-qx-config-readonly='false' value=''></input");

      var datepicker = q("input#datepicker").datePicker();

      // config is set via data attribute 'data-qx-config-input-read-only'
      this.assertFalse(datepicker.getAttribute('readonly'));

      datepicker.dispose();
    },

    testReadOnlyInputElementWithConfig : function() {
      this.getRoot().append("<input type='text' class='datepicker' data-qx-class='qx.ui.mobile.control.DatePicker' data-qx-config-readonly='true' value=''></input");

      var datepicker = q("input.datepicker").datePicker();
      this.assertTrue(datepicker.readonly);
      this.assertTrue(datepicker.getAttribute('readonly'));
      datepicker.readonly = false;
      this.assertFalse(datepicker.getAttribute('readonly'));

      datepicker.dispose();
    },

    testIconOpener : function() {
      this.getRoot().append("<input type='text' class='datepicker' data-qx-class='qx.ui.mobile.control.DatePicker' value=''></input>");

      var datepicker = q("input.datepicker").datePicker();
      datepicker.icon = '../../../../application/websitewidgetbrowser/demo/datepicker/office-calendar.png';

      var icon = datepicker.getNext();
      this.assertEquals(1, icon.length);
      this.assertEquals('img', q.getNodeName(icon));
      this.assertEquals('qx-datepicker-icon', icon.getClass());

      datepicker.dispose();
    },

    testIconOpenerToggle : function() {
      var sandbox = q("#sandbox");
      this.getRoot().append("<input type='text' class='datepicker' data-qx-class='qx.ui.mobile.control.DatePicker' value='' />");

      var datepicker = q("input.datepicker").datePicker();
      datepicker.icon = '../../../../application/websitewidgetbrowser/demo/datepicker/office-calendar.png';
      var icon = datepicker.getNext(".qx-datepicker-icon");
      this.assertEquals(1, icon.length);

      datepicker.icon = null;

      icon = datepicker.getNext(".qx-datepicker-icon");
      this.assertEquals(0, icon.length);

      datepicker.dispose();
    }
  }
});
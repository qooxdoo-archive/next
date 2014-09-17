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

qx.Class.define("qx.test.mobile.form.SelectBox",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testValue : function()
    {
      var dd = new qx.data.Array(["Item 1", "Item 2", "Item 3"]);
      var selectBox = new qx.ui.mobile.form.SelectBox();
      selectBox.model = dd;

      // Initial value '''
      this.assertEquals('',selectBox.value);

      // Attempt to set value to "Item 3"
      selectBox.value = "Item 3";
      this.assertEquals(2, selectBox.selection);
      this.assertEquals("Item 3",selectBox.value);

      // Attempting to set invalid value throws validation error.
      this.assertException(function() {
        selectBox.value = "Item 4";
      });

      this.assertEquals("Item 3",selectBox.value, "Nothing should be changed by input setValue('Item 4') because input value is not in model.");

      selectBox.dispose();
      dd.dispose();
      dd = null;
    },

    testNullable : function() {
      var model = new qx.data.Array(["Item 1", "Item 2", "Item 3"]);
      var selectBox = new qx.ui.mobile.form.SelectBox();
      selectBox.model = model;

      // Default case: nullable is true, selection is null.
      this.assertEquals(null, selectBox.selection, "Default selection of SelectBox should be null.");

      // Switch to nullable true...
      selectBox.nullable = false;
      selectBox.selection = 0;

      // Attempting to set null value throws validation error.
      this.assertException(function() {
        selectBox.selection = null;
      });

      // Switch to nullable true... try to set selection to null..
      selectBox.nullable = true;
      selectBox.selection = null;
      this.assertEquals(null, selectBox.selection, "Value should be null.");

      // After
      selectBox.dispose();
      model.dispose();
      model = null;
    },

    testSelectionNoModel : function() {
      var selectBox = new qx.ui.mobile.form.SelectBox();
      this.assertException(function() {
        selectBox.selection = 4;
      });

      selectBox.dispose();
    },

    testResetValue : function() {
      var model = new qx.data.Array(["Item 1", "Item 2", "Item 3"]);
      var selectBox = new qx.ui.mobile.form.SelectBox();
      selectBox.model = model;
      selectBox.nullable = true;
      selectBox.value = "Item 3";

      this.assertEquals(2, selectBox.selection);

      selectBox.value = undefined;

      this.assertEquals(null, selectBox.selection);

      // After
      selectBox.dispose();
      model.dispose();
      model = null;
    },

    testResetValueNotNullable : function() {
      var model = new qx.data.Array(["Item 1", "Item 2", "Item 3"]);
      var selectBox = new qx.ui.mobile.form.SelectBox();
      selectBox.model = model;
      selectBox.nullable = false;
      selectBox.value = "Item 3";

      this.assertEquals(2, selectBox.selection);

      selectBox.value = undefined;

      this.assertEquals(0, selectBox.selection);

      // After
      selectBox.dispose();
      model.dispose();
      model = null;
    },

    testSelection : function()
    {
      var model = new qx.data.Array(["Item 1", "Item 2", "Item 3"]);
      var selectBox = new qx.ui.mobile.form.SelectBox();
      selectBox.model = model;

      // Default value of selectedIndex after setting model is 0.
      this.assertEquals(null, selectBox.selection);

      // Set selection success
      selectBox.selection = 2;
      this.assertEquals(2, selectBox.selection);
      this.assertEquals("Item 3", selectBox.value);

      // Set selection failure
      // Nothing is changed because invalid selectedIndex value.
      this.assertException(function() {
        selectBox.selection = 4;
      });

      this.assertEquals(2, selectBox.selection);
      this.assertEquals("Item 3", selectBox.value);

      // Negative values are not allowed. Nothing is changed.
      this.assertException(function() {
        selectBox.selection = -1;
      });

      this.assertEquals(2, selectBox.selection);
      this.assertEquals("Item 3", selectBox.value);

      // Only type Number is allowed. Nothing is changed.
      this.assertException(function() {
        selectBox.selection = "foo";
      });

      this.assertEquals(2, selectBox.selection);
      this.assertEquals("Item 3", selectBox.value);

      // After
      selectBox.dispose();
      model.dispose();
      model = null;
    }
  }
});

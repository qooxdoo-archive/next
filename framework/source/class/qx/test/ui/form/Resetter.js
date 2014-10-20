/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */
qx.Class.define("qx.test.ui.form.Resetter",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    __username : null,
    __password1 : null,
    __password2 : null,
    __resetter : null,

    setUp: function() {
      this.super(qx.test.mobile.MobileTestCase, "setUp");
      this.__username = new qx.ui.mobile.form.TextField();
      this.__password1 = new qx.ui.mobile.form.TextField();
      this.__password2 = new qx.ui.mobile.form.TextField();
      this.__resetter = new qx.ui.mobile.form.Resetter();
    },

    tearDown: function() {
      this.super(qx.test.mobile.MobileTestCase, "tearDown");
      this.__username.dispose();
      this.__password1.dispose();
      this.__password2.dispose();
    },


    testReset: function() {
      // set the initial values
      this.__username.setValue("A");
      this.__password1.setValue("B");
      this.__password2.setValue("C");
      // add the fields to the form manager
      this.__resetter.add(this.__username);
      this.__resetter.add(this.__password1);
      this.__resetter.add(this.__password2);
      // change the values of the fields
      this.__username.setValue("a");
      this.__password1.setValue("b");
      this.__password2.setValue("c");
      // reset the manager
      this.__resetter.reset();

      // check if the initial values are reset
      this.assertEquals("A", this.__username.getValue());
      this.assertEquals("B", this.__password1.getValue());
      this.assertEquals("C", this.__password2.getValue());
    },


    testRemove: function() {
      // set the initial values
      this.__username.setValue("A");
      this.__password1.setValue("B");
      // add the fields to the form manager
      this.__resetter.add(this.__username);
      this.__resetter.add(this.__password1);
      // change the values of the fields
      this.__username.setValue("a");
      this.__password1.setValue("b");
      // remove one item
      this.assertTrue(this.__resetter.remove(this.__password1));
      // remove again to see that it has not been removed
      this.assertFalse(this.__resetter.remove(this.__password1));
      // reset the manager
      this.__resetter.reset();

      // check if the initial values are reset or kept
      this.assertEquals("A", this.__username.getValue());
      this.assertEquals("b", this.__password1.getValue());
    },


    testResetWithSelectBox : function() {
      var box = new qx.ui.mobile.form.SelectBox();
      box.model = new qx.data.Array(["1", "2"]);
      box.selection = 1;

      // check the initial selection
      this.assertEquals(1, box.selection, "1");

      // add the box to the manager
      this.__resetter.add(box);
      // change the selection
      box.selection = 0;
      // check the new selection
      this.assertEquals(0, box.selection, "2");

      // reset the manager
      this.__resetter.reset();

      // check if the selection has been reseted
      this.assertEquals(1, box.selection, "3");
      box.dispose();
    },


    testDifferentWidgets : function() {
      // set up
      var slider = new qx.ui.mobile.form.Slider();
      var textarea = new qx.ui.mobile.form.TextArea();
      var radiobutton = new qx.ui.mobile.form.RadioButton();
      var list = new qx.ui.mobile.list.List();
      // var l1 = new qx.ui.form.ListItem("1");
      // list.add(l1);
      // var l2 = new qx.ui.form.ListItem("2");
      // list.add(l2);
      var model = new qx.data.Array("a", "b", "c");
      var vsb = new qx.ui.mobile.form.SelectBox();
      vsb.model = model;

      // set the init values
      slider.setValue(22);
      textarea.setValue("aaa");
      radiobutton.setValue(false);
      //list.setSelection([l2]);
      vsb.setValue("b");

      // add the resetter
      this.__resetter.add(slider);
      this.__resetter.add(textarea);
      this.__resetter.add(radiobutton);
      //this.__resetter.add(list);
      this.__resetter.add(vsb);

      // change the values
      slider.setValue(55);
      textarea.setValue("bbb");
      radiobutton.setValue(true);
      //list.setSelection([l1]);
      vsb.setValue("c");

      // reset
      this.__resetter.reset();

      // check
      this.assertEquals(22, slider.getValue());
      this.assertEquals("aaa", textarea.getValue());
      this.assertEquals(false, radiobutton.getValue());
      //this.assertEquals(l2, list.getSelection()[0]);
      this.assertEquals("b", model.getItem(vsb.selection));

      // tear down
      list.dispose();
      radiobutton.dispose();
      textarea.dispose();
      slider.dispose();
      vsb.dispose();
      model.dispose();
    },


    testRedefine : function()
    {
      // set the initla values
      this.__username.setValue("A");
      this.__password1.setValue("B");
      this.__password2.setValue("C");
      // add the fields to the form manager
      this.__resetter.add(this.__username);
      this.__resetter.add(this.__password1);
      this.__resetter.add(this.__password2);
      // change the values of the fields
      this.__username.setValue("a");
      this.__password1.setValue("b");
      this.__password2.setValue("c");
      // redefine the manager
      this.__resetter.redefine();
      // change the values of the fields
      this.__username.setValue("aa");
      this.__password1.setValue("bb");
      this.__password2.setValue("cc");

      // reset the manager
      this.__resetter.reset();

      // check if the initial values are reset
      this.assertEquals("a", this.__username.getValue());
      this.assertEquals("b", this.__password1.getValue());
      this.assertEquals("c", this.__password2.getValue());
    },


    testRefineSelection : function()
    {
      var box = new qx.ui.mobile.form.SelectBox();
      box.model = new qx.data.Array(["1", "2"]);
      box.selection = 1;

      // add the box to the manager
      this.__resetter.add(box);
      // change the selection
      box.selection = 0;
      // check the new selection
      this.assertEquals(0, box.selection);

      // redefine the manager
      this.__resetter.redefine();
      // change the selection
      box.selection = 1;
      // reset the manager
      this.__resetter.reset();

      // check if the selection has been reseted
      this.assertEquals(0, box.selection);
      box.dispose();
    },

    testResetOneItem : function()
    {
      // set the initla values
      this.__username.setValue("A");
      this.__password1.setValue("B");
      this.__password2.setValue("C");
      // add the fields to the form manager
      this.__resetter.add(this.__username);
      this.__resetter.add(this.__password1);
      this.__resetter.add(this.__password2);
      // change the values of the fields
      this.__username.setValue("a");
      this.__password1.setValue("b");
      this.__password2.setValue("c");
      // reset the first two items
      this.__resetter.resetItem(this.__username);
      this.__resetter.resetItem(this.__password1);

      // check if the initial values are reset
      this.assertEquals("A", this.__username.getValue());
      this.assertEquals("B", this.__password1.getValue());
      this.assertEquals("c", this.__password2.getValue());

      // check for a not added item
      var self = this;
      this.assertException(function() {
        self.__resetter.resetItem(this);
      }, Error);
    },


    testRedefineOneItem : function()
    {
      // set the initla values
      this.__username.setValue("A");
      this.__password1.setValue("B");
      this.__password2.setValue("C");
      // add the fields to the form manager
      this.__resetter.add(this.__username);
      this.__resetter.add(this.__password1);
      this.__resetter.add(this.__password2);
      // change the values of the fields
      this.__username.setValue("a");
      this.__password1.setValue("b");
      this.__password2.setValue("c");
      // redefine the first two items
      this.__resetter.redefineItem(this.__username);
      this.__resetter.redefineItem(this.__password1);
      // change the first two items
      this.__username.setValue("1");
      this.__password1.setValue("2");

      // reset the manager
      this.__resetter.reset();

      // check if the initial values are reset
      this.assertEquals("a", this.__username.getValue());
      this.assertEquals("b", this.__password1.getValue());
      this.assertEquals("C", this.__password2.getValue());

      // check for a not added item
      var self = this;
      this.assertException(function() {
        self.__resetter.redefineItem(this);
      }, Error);
    }

  }
});

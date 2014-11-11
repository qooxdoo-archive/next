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
describe("mobile.form.Resetter", function() {

  beforeEach(function() {
    setUpRoot();
    this.__username = new qx.ui.form.TextField();
    this.__password1 = new qx.ui.form.TextField();
    this.__password2 = new qx.ui.form.TextField();
    this.__resetter = new qx.ui.form.Resetter();
  });


  afterEach(function() {
    tearDownRoot();
    this.__username.dispose();
    this.__password1.dispose();
    this.__password2.dispose();
  });


  it("Reset", function() {
    // set the initial values
    this.__username.value = "A";
    this.__password1.value = "B";
    this.__password2.value = "C";
    // add the fields to the form manager
    this.__resetter.add(this.__username);
    this.__resetter.add(this.__password1);
    this.__resetter.add(this.__password2);
    // change the values of the fields
    this.__username.value = "a";
    this.__password1.value = "b";
    this.__password2.value = "c";
    // reset the manager
    this.__resetter.reset();

    // check if the initial values are reset
    assert.equal("A", this.__username.value);
    assert.equal("B", this.__password1.value);
    assert.equal("C", this.__password2.value);
  });


  it("Remove", function() {
    // set the initial values
    this.__username.value = "A";
    this.__password1.value = "B";
    // add the fields to the form manager
    this.__resetter.add(this.__username);
    this.__resetter.add(this.__password1);
    // change the values of the fields
    this.__username.value = "a";
    this.__password1.value = "b";
    // remove one item
    assert.isTrue(this.__resetter.remove(this.__password1));
    // remove again to see that it has not been removed
    assert.isFalse(this.__resetter.remove(this.__password1));
    // reset the manager
    this.__resetter.reset();

    // check if the initial values are reset or kept
    assert.equal("A", this.__username.value);
    assert.equal("b", this.__password1.value);
  });


  it("ResetWithSelectBox", function() {
    var box = new qx.ui.form.SelectBox();
    box.model = new qx.data.Array(["1", "2"]);
    box.value = "2";

    // check the initial selection
    assert.equal("2", box.value, "1");

    // add the box to the manager
    this.__resetter.add(box);
    // change the selection
    box.value = "1";
    // check the new selection
    assert.equal("1", box.value, "2");

    // reset the manager
    this.__resetter.reset();

    // check if the selection has been reseted
    assert.equal("2", box.value, "3");
    box.dispose();
  });


  it("DifferentWidgets", function() {
    // set up
    var slider = new qx.ui.form.Slider();
    var textarea = new qx.ui.form.TextArea();
    var radiobutton = new qx.ui.form.RadioButton();
    var list = new qx.ui.list.List();
    var model = new qx.data.Array("a", "b", "c");
    var vsb = new qx.ui.form.SelectBox();
    vsb.model = model;

    // set the init values
    slider.value = 22;
    textarea.value = "aaa";
    radiobutton.value = false;
    vsb.value = "b";

    // add the resetter
    this.__resetter.add(slider);
    this.__resetter.add(textarea);
    this.__resetter.add(radiobutton);
    //this.__resetter.add(list);
    this.__resetter.add(vsb);

    // change the values
    slider.value = 55;
    textarea.value = "bbb";
    radiobutton.value = true;
    vsb.value = "c";

    // reset
    this.__resetter.reset();

    // check
    assert.equal(22, slider.value);
    assert.equal("aaa", textarea.value);
    assert.equal(false, radiobutton.value);
    assert.equal("b", vsb.value);

    // tear down
    list.dispose();
    radiobutton.dispose();
    textarea.dispose();
    slider.dispose();
    vsb.dispose();
    model.dispose();
  });


  it("Redefine", function() {
    // set the initla values
    this.__username.value = "A";
    this.__password1.value = "B";
    this.__password2.value = "C";
    // add the fields to the form manager
    this.__resetter.add(this.__username);
    this.__resetter.add(this.__password1);
    this.__resetter.add(this.__password2);
    // change the values of the fields
    this.__username.value = "a";
    this.__password1.value = "b";
    this.__password2.value = "c";
    // redefine the manager
    this.__resetter.redefine();
    // change the values of the fields
    this.__username.value = "aa";
    this.__password1.value = "bb";
    this.__password2.value = "cc";

    // reset the manager
    this.__resetter.reset();

    // check if the initial values are reset
    assert.equal("a", this.__username.value);
    assert.equal("b", this.__password1.value);
    assert.equal("c", this.__password2.value);
  });


  it("RefineSelection", function() {
    var box = new qx.ui.form.SelectBox();
    box.model = new qx.data.Array(["1", "2"]);
    box.value = "2";

    // add the box to the manager
    this.__resetter.add(box);
    // change the selection
    box.value = "1";
    // check the new selection
    assert.equal("1", box.value);

    // redefine the manager
    this.__resetter.redefine();
    // change the selection
    box.value = "2";
    // reset the manager
    this.__resetter.reset();

    // check if the selection has been reseted
    assert.equal("1", box.value);
    box.dispose();
  });


  it("ResetOneItem",function() {
    // set the initial values
    this.__username.value = "A";
    this.__password1.value = "B";
    this.__password2.value = "C";
    // add the fields to the form manager
    this.__resetter.add(this.__username);
    this.__resetter.add(this.__password1);
    this.__resetter.add(this.__password2);
    // change the values of the fields
    this.__username.value = "a";
    this.__password1.value = "b";
    this.__password2.value = "c";
    // reset the first two items
    this.__resetter.resetItem(this.__username);
    this.__resetter.resetItem(this.__password1);

    // check if the initial values are reset
    assert.equal("A", this.__username.value);
    assert.equal("B", this.__password1.value);
    assert.equal("c", this.__password2.value);

    // check for a not added item
    assert.throws(function () {
      this.__resetter.resetItem(this);
    }.bind(this), Error);
  });


  it("RedefineOneItem", function() {
    // set the initla values
    this.__username.value = "A";
    this.__password1.value = "B";
    this.__password2.value = "C";
    // add the fields to the form manager
    this.__resetter.add(this.__username);
    this.__resetter.add(this.__password1);
    this.__resetter.add(this.__password2);
    // change the values of the fields
    this.__username.value = "a";
    this.__password1.value = "b";
    this.__password2.value = "c";
    // redefine the first two items
    this.__resetter.redefineItem(this.__username);
    this.__resetter.redefineItem(this.__password1);
    // change the first two items
    this.__username.value = "1";
    this.__password1.value = "2";

    // reset the manager
    this.__resetter.reset();

    // check if the initial values are reset
    assert.equal("a", this.__username.value);
    assert.equal("b", this.__password1.value);
    assert.equal("C", this.__password2.value);

    // check for a not added item
    assert.throws(function () {
      this.__resetter.redefineItem(this);
    }.bind(this), Error);
  });
});

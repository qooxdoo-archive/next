/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

describe("mobile.form.RadioButton", function() {

  beforeEach(function() {
    setUpRoot();
  });


  afterEach(function() {
    tearDownRoot();
  });


  it("Value", function() {
    var radio1 = new qx.ui.form.RadioButton().set({name: "abc"});
    var radio2 = new qx.ui.form.RadioButton().set({name: "abc"});
    var radio3 = new qx.ui.form.RadioButton().set({name: "abc"});

    getRoot().append(radio1);
    getRoot().append(radio2);
    getRoot().append(radio3);

    // Verify: inital all radios buttons should be disabled.
    assert.equal(false, radio1.getValue());
    assert.equal(false, radio2.getValue());
    assert.equal(false, radio3.getValue());

    assert.equal(false, radio1.hasClass("checked"));
    assert.equal(false, radio2.hasClass("checked"));
    assert.equal(false, radio3.hasClass("checked"));

    // Radio 1 enabled
    radio1.setValue(true);

    // Verify
    assert.equal(true, radio1.getValue());
    assert.equal(true, radio1.hasClass("checked"));
    assert.equal(false, radio2.getValue());
    assert.equal(false, radio3.getValue());

    // Radio 3 enabled
    radio3.setValue(true);

    // Verify
    assert.equal(true, radio3.getValue());
    assert.equal(false, radio2.getValue());
    assert.equal(false, radio1.getValue());

    // Clean up tests
    radio1.dispose();
    radio2.dispose();
    radio3.dispose();
  });


  it("Enabled", function() {
    var radio1 = new qx.ui.form.RadioButton();
    getRoot().append(radio1);

    radio1.enabled = false;

    assert.equal(false, radio1.enabled);
    assert.equal(true, qx.bom.element.Class.has(radio1[0], 'disabled'));

    radio1.dispose();
  });


  it("withForm", function() {
    var form = new qx.ui.form.Form().appendTo(getRoot());

    var radio1 = new qx.ui.form.RadioButton().set({name: "abc"}).appendTo(form);
    var radio2 = new qx.ui.form.RadioButton().set({name: "abc"}).appendTo(form);

    radio1.value = true;
    assert.equal(true, radio1.getValue());
    assert.equal(false, radio2.getValue());

    radio2.value = true;
    assert.equal(true, radio2.getValue());
    assert.equal(false, radio1.getValue());

    form.dispose();
    radio1.dispose();
    radio2.dispose();
  });


  it("twoForms", function() {
    var form1 = new qx.ui.form.Form().appendTo(getRoot());
    var radio1 = new qx.ui.form.RadioButton().set({name: "abc"}).appendTo(form1);
    var radio2 = new qx.ui.form.RadioButton().set({name: "abc"}).appendTo(form1);

    var form2 = new qx.ui.form.Form().appendTo(getRoot());
    var radio3 = new qx.ui.form.RadioButton().set({name: "abc"}).appendTo(form2);
    var radio4 = new qx.ui.form.RadioButton().set({name: "abc"}).appendTo(form2);

    radio1.value = true;
    assert.equal(true, radio1.getValue());
    assert.equal(false, radio2.getValue());
    assert.equal(false, radio3.getValue());
    assert.equal(false, radio4.getValue());

    radio2.value = true;
    radio3.value = true;
    assert.equal(false, radio1.getValue());
    assert.equal(true, radio2.getValue());
    assert.equal(true, radio3.getValue());
    assert.equal(false, radio4.getValue());

    form1.dispose();
    form2.dispose();
    radio1.dispose();
    radio2.dispose();
    radio3.dispose();
    radio4.dispose();
  });


  it("globalAndForm", function() {
    var form1 = new qx.ui.form.Form().appendTo(getRoot());
    var radio1 = new qx.ui.form.RadioButton().set({name: "abc"}).appendTo(form1);
    var radio2 = new qx.ui.form.RadioButton().set({name: "abc"}).appendTo(form1);

    var radio3 = new qx.ui.form.RadioButton().set({name: "abc"}).appendTo(getRoot());
    var radio4 = new qx.ui.form.RadioButton().set({name: "abc"}).appendTo(getRoot());

    radio1.value = true;
    assert.equal(true, radio1.getValue());
    assert.equal(false, radio2.getValue());
    assert.equal(false, radio3.getValue());
    assert.equal(false, radio4.getValue());

    radio2.value = true;
    radio3.value = true;
    assert.equal(false, radio1.getValue());
    assert.equal(true, radio2.getValue());
    assert.equal(true, radio3.getValue());
    assert.equal(false, radio4.getValue());

    form1.dispose();
    radio1.dispose();
    radio2.dispose();
    radio3.dispose();
    radio4.dispose();
  });
});

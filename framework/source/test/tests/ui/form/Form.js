/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2011 - 2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

describe("ui.form.Form", function() {

  var username;
  var form;

  beforeEach(function() {
    form = new qx.ui.form.Form()
      .appendTo(sandbox);

    username = new qx.ui.form.TextField()
      .set({
        placeholder : "Username",
        required : true
      })
      .appendTo(form);
  });


  afterEach(function() {
    username.dispose();
    form.dispose();
  });


  it("Reset", function() {
    username.value = "Foo";
    assert.equal("Foo", username.value);
    form.reset();
    assert.equal(null, username.value);
  });


  it("ResetRemoved", function() {
    username.value = "Foo";
    assert.equal("Foo", username.value);
    username.remove();
    form.reset();
    assert.equal("Foo", username.value);
  });


  it("Validate", function() {
    assert.isFalse(form.validate());
    username.value = "Foo";
    assert.isTrue(form.validate());
    username.pattern = ".{4,}";
    assert.isFalse(form.validate());
    username.remove();
    assert.isTrue(form.validate());
  });

  it("Validate multiple items", function() {
    var password = new qx.ui.form.PasswordField().set({
      required: true
    }).appendTo(form);
    assert.isFalse(form.validate());
    assert.isFalse(username.valid);
    assert.isFalse(password.valid);
  });


  it("Factory", function() {
    var form = qxWeb.create("<form>").toForm().appendTo(sandbox);
    assert.instanceOf(form, qx.ui.form.Form);
    assert.equal(form, form[0].$$widget);
    assert.equal("qx.ui.form.Form", form.getData("qxWidget"));

    form.dispose();
  });
});

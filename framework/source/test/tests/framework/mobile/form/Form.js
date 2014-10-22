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

describe("mobile.form.Form", function() {

  var username;
  var form;

  beforeEach(function() {
    setUpRoot();

    form = new qx.ui.mobile.form.Form()
      .appendTo(getRoot());

    username = new qx.ui.mobile.form.TextField()
      .set({
        placeholder : "Username",
        required : true
      })
      .appendTo(form);
  });


  afterEach(function() {
    tearDownRoot();
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

});

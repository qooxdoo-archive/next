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

describe("mobile.form.Form", function()
{
  var __form = null;
  var __username = null;

  beforeEach (function ()  {
    setUpRoot();
    //this.super(qx.test.mobile.MobileTestCase, "setUp");
    __form = __createForm();
  });

  afterEach (function() {
    tearDownRoot();
    //qx.Class.super(qx.test.mobile.MobileTestCase, "tearDown");
    __username.dispose();
    __form.dispose();
  });

  it("CheckValidity", function() {
      assert.isFalse(__form.checkValidity());

      __username.setValue('myusername');
      assert.isTrue(__form.checkValidity());
  });

  it("ChangeRequired", function() {
      assert.isFalse(__form.checkValidity());

      __username.required = false;
      assert.isTrue(__form.checkValidity());
  });
  //test failed
  it("Reset", function() {

      __username.value = "Foo";
      assert.equal("Foo", __username.value);
      assert.isTrue(__form.checkValidity());
      __form.reset();
      assert.equal(null, __username.value);
      assert.isFalse(__form.checkValidity());
  });

  it("ResetRemoved", function() {
      __username.value = "Foo";
      assert.equal("Foo", __username.value);
      assert.isTrue(__form.checkValidity());
      __username.remove();
      __form.reset();
      assert.equal("Foo", __username.value);
      assert.isTrue(__form.checkValidity());
  });

    function __createForm ()
    {
      var form = new qx.ui.mobile.form.Form()
        .appendTo(getRoot());

      var username = __username = new qx.ui.mobile.form.TextField();
      username.placeholder = "Username";
      username.required = true;
      username.appendTo(form);

      return form;
    }


});

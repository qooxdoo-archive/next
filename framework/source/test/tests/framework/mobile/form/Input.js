/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

************************************************************************ */

describe("mobile.form.Input", function() {

  beforeEach(function() {
    __item = new qx.ui.form.Input();
    sandbox.append(__item);
  });


  var onValid = function(e) {
    assert.isTrue(e.value);
    assert.isFalse(e.old);
    assert.isTrue(e.target.valid);
  };

  var onInvalid = function(e) {
    assert.isFalse(e.value);
    assert.isTrue(e.old);
    assert.isFalse(e.target.valid);
  };

  it("Creation", function() {
    assert.equal("input", __item[0].nodeName.toLowerCase());
    __item.type = "text";
    assert.equal("text", __item.getAttribute("type"));
  });


  it("Required", function() {
    __item.required = true;
    assert.isTrue(__item.valid);
    assert.isFalse(__item.hasClass("invalid"));

    var cb = sinon.spy(onInvalid);
    __item.once("changeValid", cb);
    __item.validate();
    sinon.assert.calledOnce(cb);
    assert.isTrue(__item.hasClass("invalid"));

    cb = sinon.spy(onValid);
    __item.once("changeValid", cb);
    __item.value = "Foo";
    sinon.assert.calledOnce(cb);
    assert.isFalse(__item.hasClass("invalid"));

    cb = sinon.spy(onInvalid);
    __item.once("changeValid", cb);
    __item.value = null;
    sinon.assert.calledOnce(cb);
    assert.isTrue(__item.hasClass("invalid"));

    cb = sinon.spy(onValid);
    __item.once("changeValid", cb);
    __item.required = false;
    sinon.assert.calledOnce(cb);
    assert.isFalse(__item.hasClass("invalid"));
  });


  it("CustomValidator", function() {
    assert.isTrue(__item.valid);

    var validator = sinon.spy(function(value) {
      return false;
    });

    var cb = sinon.spy(onInvalid);
    __item.once("changeValid", cb);
    __item.validator = validator;
    sinon.assert.calledOnce(validator);
    sinon.assert.calledOnce(cb);

    cb = sinon.spy(onValid);
    __item.once("changeValid", cb);
    __item.validator = null;
    sinon.assert.calledOnce(cb);
  });


  it("Factory", function() {
    var input = qxWeb.create("<div>").toInput().appendTo(sandbox);
    assert.instanceOf(input, qx.ui.form.Input);
    assert.equal(input, input[0].$$widget);
    assert.equal("qx.ui.form.Input", input.getData("qxWidget"));

    input.dispose();
  });

});

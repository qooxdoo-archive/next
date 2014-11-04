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

describe("mobile.form.TextField", function() {

  beforeEach(function() {
    setUpRoot();
    __tf = new qx.ui.form.TextField();
  });


  afterEach(function() {
    tearDownRoot();
  });


  var onInvalid = function(e) {
    assert.isFalse(e.value);
    assert.isTrue(e.old);
    assert.isFalse(e.target.valid);
  };

  var onValid = function(e) {
    assert.isTrue(e.value);
    assert.isFalse(e.old);
    assert.isTrue(e.target.valid);
  };


  it("Value", function() {
    getRoot().append(__tf);

    assert.equal(null, __tf.value);
    assert.equal(null, qx.bom.element.Attribute.get(__tf[0], 'value'));

    var cb = sinon.spy();
    __tf.once("changeValue", cb);
    __tf.value = "mytext";
    sinon.assert.calledOnce(cb);
    assert.equal('mytext', __tf.value);
    assert.equal('mytext', qx.bom.element.Attribute.get(__tf[0], 'value'));

    __tf.dispose();

    __tf = new qx.ui.form.TextField('affe');
    getRoot().append(__tf);
    assert.equal('affe', __tf.value);
    assert.equal('affe', qx.bom.element.Attribute.get(__tf[0], 'value'));
    __tf.dispose();
  });


  it("Enabled", function() {
    getRoot().append(__tf);
    assert.equal(true, __tf.enabled);
    assert.isFalse(qx.bom.element.Class.has(__tf[0], 'disabled'));

    __tf.enabled = false;
    assert.equal(false, __tf.enabled);
    assert.equal(true, qx.bom.element.Class.has(__tf[0], 'disabled'));

    __tf.dispose();
  });


  it("Pattern", function() {
    var pattern = ".{3,}";
    __tf.pattern = pattern;
    assert.isTrue(__tf.valid);

    var cb = sinon.spy(onInvalid);
    __tf.once("changeValid", cb);
    __tf.value = "aa";
    sinon.assert.calledOnce(cb);

    cb = sinon.spy(onValid);
    __tf.once("changeValid", cb);
    __tf.value = "Foo";
    sinon.assert.calledOnce(cb);

    cb = sinon.spy(onInvalid);
    __tf.once("changeValid", cb);
    __tf.pattern = "aa";
    sinon.assert.calledOnce(cb);

    cb = sinon.spy(onValid);
    __tf.once("changeValid", cb);
    __tf.value = "";
    sinon.assert.calledOnce(cb);
  });


  it("MaxLength", function() {
    __tf.maxLength = 1;
    __tf.value = "Foo";
    assert.equal("F", __tf.value);
    __tf.maxLength = null;
    __tf.value = "Foo";
    assert.equal("Foo", __tf.value);
    __tf.maxLength = 1;
    assert.equal("F", __tf.value);
  });


  it("MaxLengthIllegal", function() {
    var cb = sinon.spy(onInvalid);
    __tf.once("changeValid", cb);
    __tf.maxLength = 1;
    __tf[0].value = "Foo";
    __tf.validate();
    sinon.assert.calledOnce(cb);
  });


  it("TypeEmail", function() {
    __tf.type = "email";
    assert.equal("email", __tf[0].getAttribute("type"));
    assert.isTrue(__tf.valid);

    var cb = sinon.spy(onInvalid);
    __tf.once("changeValid", cb);
    __tf.value = "Foo";
    sinon.assert.calledOnce(cb);

    cb = sinon.spy(onValid);
    __tf.once("changeValid", cb);
    __tf.value = "foo@example.com";
    sinon.assert.calledOnce(cb);
  });


  it("TypeUrl", function() {
    __tf.type = "url";
    assert.equal("url", __tf[0].getAttribute("type"));
    assert.isTrue(__tf.valid);

    var cb = sinon.spy(onInvalid);
    __tf.once("changeValid", cb);
    __tf.value = "Foo";
    sinon.assert.calledOnce(cb);

    cb = sinon.spy(onValid);
    __tf.once("changeValid", cb);
    __tf.value = "http://www.example.com";
    sinon.assert.calledOnce(cb);
  });


  it("Factory", function() {
    var textField = qxWeb.create("<div>").toTextField().appendTo(getRoot());
    assert.instanceOf(textField, qx.ui.form.TextField);
    assert.equal(textField, textField[0].$$widget);
    assert.equal("qx.ui.form.TextField", textField.getData("qxWidget"));

    textField.dispose();
  });

});

/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

describe("ui.form.NumberField", function ()
{

  beforeEach (function ()  {
    __nf = new qx.ui.form.NumberField().appendTo(sandbox);
  });


  afterEach (function() {
    __nf.dispose();
  });


  it("Value", function() {
    assert.equal(null, __nf.getValue());
    assert.equal(null, qx.bom.element.Attribute.get(__nf[0], 'value'));
    qx.core.Assert.assertEventFired(__nf, "changeValue", function() {
      __nf.setValue(15);
    }.bind(this));

    assert.equal(15,__nf.getValue());
    assert.equal(15, qx.bom.element.Attribute.get(__nf[0], 'value'));
  });


  it("Minimum", function() {
    assert.isUndefined(__nf.minimum);
    assert.isNull(__nf.getAttribute("min"));

    __nf.minimum = 42;
    assert.equal(42, __nf.minimum);
    assert.equal(42, __nf.getAttribute("min"));

    var cb = sinonSandbox.spy(function(e) {
      assert.equal(41, e.target.value);
      assert.isFalse(e.value);
      assert.isFalse(e.target.valid);
    });

    __nf.once("changeValid", cb);
    __nf.value = 41;
    sinon.assert.calledOnce(cb);

    __nf.minimum = null;
    assert.isTrue(__nf.valid);
  });


  it("Maximum", function() {
    assert.isUndefined(__nf.maximum);
    assert.isNull(__nf.getAttribute("max"));

    __nf.maximum = 42;
    assert.equal(42, __nf.maximum);
    assert.equal(42, __nf.getAttribute("max"));

    var cb = sinonSandbox.spy(function(e) {
      assert.equal(43, e.target.value);
      assert.isFalse(e.value);
      assert.isFalse(e.target.valid);
    });

    __nf.once("changeValid", cb);
    __nf.value = 43;
    sinon.assert.calledOnce(cb);

    __nf.maximum = null;
    assert.isTrue(__nf.valid);
  });


  it("Step", function() {
    assert.isUndefined(__nf.step);

    __nf.step = 10;
    assert.equal(10, __nf.step);
    assert.equal(10, __nf.getAttribute("step"));

    var cb = sinonSandbox.spy(function(e) {
      assert.equal(12, e.target.value);
      assert.isFalse(e.value);
      assert.isFalse(e.target.valid);
    });

    __nf.once("changeValid", cb);
    __nf.value = 12;
    sinon.assert.calledOnce(cb);

    __nf.step = null;
    assert.isTrue(__nf.valid);
  });


  it("ResetValue", function() {
    assert.equal(null, __nf.getValue());
    assert.isNull(qx.bom.element.Attribute.get(__nf[0], 'value'));

    __nf.setValue(15);
    assert.equal(15,__nf.getValue());

    __nf.resetValue();

    assert.isNull(qx.bom.element.Attribute.get(__nf[0], 'value'));
    assert.equal(null,__nf.getValue());
  });


  it("Enabled", function() {
    assert.isTrue(__nf.enabled);
    assert.isFalse(qx.bom.element.Class.has(__nf[0], 'disabled'));

    __nf.enabled = false;
    assert.isFalse(__nf.enabled);
    assert.isTrue(qx.bom.element.Class.has(__nf[0], 'disabled'));
  });


  it("Factory", function() {
    var numberField = qxWeb.create("<div>").toNumberField().appendTo(sandbox);
    assert.instanceOf(numberField, qx.ui.form.NumberField);
    assert.equal(numberField, numberField[0].$$widget);
    assert.equal("qx.ui.form.NumberField", numberField.getData("qxWidget"));

    numberField.dispose();
  });
});

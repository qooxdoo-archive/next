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

describe("mobile.form.Slider", function() {

  var slider;

  beforeEach(function() {
    slider = new qx.ui.form.Slider();
    sandbox.append(slider);
  });


  afterEach(function() {
    slider.remove().dispose();
  });



  it("Value", function() {
    slider.step = 4;

    assert.equal(0, slider.value);
    assert.equal(0, qx.bom.element.Dataset.get(slider._getKnobElement(), "value"));
    assert.equal(0, qx.bom.element.Dataset.get(slider._getKnobElement(), "percent"));

    qx.core.Assert.assertEventFired(slider, "changeValue", function() {
      slider.nextValue();
    }, function(evt) {
      assert.equal(4, evt.value);
    }.bind(this));

    qx.core.Assert.assertEventFired(slider, "changeValue", function() {
      slider.setValue(11);
    }, function(evt) {
      assert.equal(11, evt.value);
    }.bind(this));

    qx.core.Assert.assertEventFired(slider, "changeValue", function() {
      slider.previousValue();
    }, function(evt) {
      assert.equal(7, evt.value);
    }.bind(this));
  });


  it("Enabled", function() {
    slider.enabled = false;
    assert.equal(false, slider.enabled);
    assert.equal(true, qx.bom.element.Class.has(slider[0], 'disabled'));
  });


  it("Maximum", function() {
    var initMax = slider.maximum;
    slider.value = initMax + 100;
    assert.equal(slider.value, initMax);

    var spy = sinon.spy();
    slider.on("changeValue", spy);
    slider.maximum = 1111;
    slider.value = 1200;
    assert.equal(slider.value, 1111);
    sinon.assert.calledOnce(spy);
    assert.equal(1111, spy.args[0][0].value);
  });


  it("Minimum", function() {
    var initMin = slider.minimum;
    slider.value = initMin - 100;
    assert.equal(slider.value, initMin);

    var spy = sinon.spy();
    slider.on("changeValue", spy);
    slider.minimum = -100;
    slider.value = -200;
    assert.equal(slider.value, -100);
    sinon.assert.calledOnce(spy);
    assert.equal(-100, spy.args[0][0].value);

    slider.value = -300;
    assert.equal(slider.value, -100);
    sinon.assert.calledOnce(spy);
  });


  it("Factory", function() {
    var slider = q.create('<div>')
      .toSlider()
      .appendTo(sandbox);

    assert.instanceOf(slider, qx.ui.form.Slider);
    assert.equal(1, slider.getChildren("div[data-value]").length);
    slider.remove().dispose();
  });
});

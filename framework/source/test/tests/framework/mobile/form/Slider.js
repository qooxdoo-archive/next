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

  beforeEach(function() {
    setUpRoot();
  });


  afterEach(function() {
    tearDownRoot();
  });

  var slider = new qx.ui.form.Slider();


  it("Value", function() {
    slider.step = 4;
    getRoot().append(slider);

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

    slider.dispose();
  });


  it("Enabled", function() {
    getRoot().append(slider);
    slider.enabled = false;
    assert.equal(false, slider.enabled);
    assert.equal(true, qx.bom.element.Class.has(slider[0], 'disabled'));

    slider.dispose();
  });


  it("Factory", function() {
    var slider = q.create('<div>')
      .toSlider()
      .appendTo(getRoot());

    assert.instanceOf(slider, qx.ui.form.Slider);
    assert.equal(1, slider.getChildren("div[data-value]").length);
    slider.remove().dispose();
  });
});

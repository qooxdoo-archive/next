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

qx.Class.define("qx.test.mobile.form.Slider",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testValue : function()
    {
      var slider = new qx.ui.mobile.form.Slider();
      slider.step = 4;
      this.getRoot().append(slider);

      this.assertEquals(0,slider.value);
      this.assertEquals(0,qx.bom.element.Dataset.get(slider._getKnobElement(),"value"));
      this.assertEquals(0,qx.bom.element.Dataset.get(slider._getKnobElement(),"percent"));

      this.assertEventFired(slider, "changeValue", function() {
        slider.nextValue();
      }, function(evt) {
        this.assertEquals(4, evt.value);
      }.bind(this));

      this.assertEventFired(slider, "changeValue", function() {
        slider.setValue(11);
      }, function(evt) {
        this.assertEquals(11, evt.value);
      }.bind(this));

      this.assertEventFired(slider, "changeValue", function() {
        slider.previousValue();
      }, function(evt) {
        this.assertEquals(7, evt.value);
      }.bind(this));

      slider.dispose();
    },

    testEnabled : function()
    {
      var slider = new qx.ui.mobile.form.Slider();
      this.getRoot().append(slider);
      slider.enabled = false;
      this.assertEquals(false,slider.enabled);
      this.assertEquals(true,qx.bom.element.Class.has(slider[0],'disabled'));

      slider.dispose();
    },

    testFactory: function() {
      var slider = q.create('<div>')
        .slider()
        .appendTo(this.getRoot());

      this.assertInstance(slider, qx.ui.mobile.form.Slider);
      this.assertEquals(1, slider.getChildren("div[data-value]").length);
      slider.remove().dispose();
    }

  }
});

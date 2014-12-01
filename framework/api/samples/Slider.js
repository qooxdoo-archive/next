addSample(".toSlider", {
  html: ['<div id="slider-example"></div>'],
  javascript: function () {
    var slider = q('#slider-example').toSlider().set({
      maximum: 20,
      step: 10
    });
  },
  executable: true,
  showMarkup: true
});

addSample(".toSlider", {
  javascript: function () {
    var slider = new qx.ui.form.Slider();
    slider.set({
      minimum: 0,
      maximum: 10,
      step: 2
    });
    slider.appendTo(document.body);
  },
  executable: true
});
addSample('.image', {
  html: '<img id="image-example" src="http://qooxdoo.org/_media/desktop.png" />',
  javascript: function () {
    q('#image-example').image();
  },
  executable: true,
  showMarkup: true
});

addSample('.image', {
  javascript: function () {
    var image = new qx.ui.basic.Image("http://qooxdoo.org/_media/desktop.png");
    q(document.body).append(image);
  },
  executable: true,
  showMarkup: true
});
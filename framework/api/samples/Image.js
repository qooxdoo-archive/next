addSample('.image', {
  html: '<img id="image-example" data-qx-config-source="http://qooxdoo.org/_media/desktop.png" />',
  javascript: function () {
    q('#image-example').toImage();
  },
  executable: true,
  showMarkup: true
});

addSample('.image', {
  javascript: function () {
    var image = new qx.ui.Image("http://qooxdoo.org/_media/desktop.png");
    q(document.body).append(image);
  },
  executable: true,
  showMarkup: true
});
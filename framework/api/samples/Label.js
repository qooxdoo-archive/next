addSample(".label", {
  html : ['<div id="label-example">Hello qooxdoo</div>'],
  javascript: function() {
    q('#label-example').toLabel();
  },
  executable: true,
  showMarkup: true
});

addSample(".label", {
  javascript: function() {
    var label = new qx.ui.Label("Hello qooxdoo");
    q(document.body).append(label);
  },
  executable: true,
  showMarkup: true
});

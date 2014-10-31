addSample(".label", {
  html : ['<div id="label-example">Hello qooxdoo</div>'],
  javascript: function() {
    q('#label-example').label();
  },
  executable: true,
  showMarkup: true
});

addSample(".label", {
  javascript: function() {
    var label = new qx.ui.basic.Label("Hello qooxdoo");
    q(document.body).append(label);
  },
  executable: true,
  showMarkup: true
});

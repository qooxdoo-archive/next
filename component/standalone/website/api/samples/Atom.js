addSample('.atom', {
  html: '<div id="atom-example"></div>',
  javascript: function () {
    q('#atom-example').atom("qooxdoo desktop", "http://qooxdoo.org/_media/desktop.png");
  },
  executable: true,
  showMarkup: true
});

addSample('.atom', {
  javascript: function () {
    var atom = new qx.ui.basic.Atom("qooxdoo desktop", "http://qooxdoo.org/_media/desktop.png");
    atom.iconPosition = 'bottom';
    q(document.body).append(atom);
  },
  executable: true,
  showMarkup: true
});
addSample(".button", {
  html: ['<button id="button-example"></button>'],
  javascript: function() {
    q("#button-example").toButton("Label");
  },
  executable: true,
  showMarkup: true
});

addSample("button.setLabel", {
  html: ['<button id="button-example"></button>'],
  javascript: function() {
    q("#button-example").toButton().setLabel("Label");
  },
  executable: true
});

addSample("button.setIcon", {
  html: ['<button id="button-example">Label</button>'],
  javascript: function() {
    q("#button-example").toButton().setIcon("samples/edit-clear.png");
  },
  executable: true
});

addSample("button.setMenu", {
  html: [
    '<ul id="button-menu">',
    '  <li>Item 1</li>',
    '  <li>Item 2</li>',
    '</ul>',
    '<button id="button-example"></button>'
  ],
  javascript: function() {
    q("#button-example").toButton().setMenu(q("#button-menu"));
  },
  executable: true
});

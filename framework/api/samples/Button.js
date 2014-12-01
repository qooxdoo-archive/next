addSample(".toButton", {
  html: ['<button id="button-example"></button>'],
  javascript: function() {
    q("#button-example").toButton("Label");
  },
  executable: true,
  showMarkup: true
});

addSample(".toButton", {
  html: ['<button id="button-example"></button>'],
  javascript: function() {
    q("#button-example").toButton().set({
      label: "Label",
      icon: "samples/edit-clear.png"
    });
  },
  executable: true
});

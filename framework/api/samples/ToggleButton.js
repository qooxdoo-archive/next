addSample('.toToggleButton', {
  javascript: function () {
    var button = new qx.ui.form.ToggleButton(false, "YES", "NO");
    button.on("changeValue", function (value) {
      alert(value);
    }, this);

    this.getRoot.append(button);
  },
  executable: true,
  showMarkup: true
});



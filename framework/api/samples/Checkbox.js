addSample(".toCheckBox", {
  html : ['<div id="checkbox-example"></div>'],
  javascript: function () {
    var checkBox = q("#checkbox-example").toCheckBox();

    checkBox.model = "Title Activated";
    checkBox.bind("model", title, "value");

    checkBox.on("changeValue", function (evt) {
      this.model = evt.getdata() ? "Title Activated" : "Title Deactivated";
    });

    this.getRoot.append(checkBox);
  },
  executable: true,
  showMarkup: true
});
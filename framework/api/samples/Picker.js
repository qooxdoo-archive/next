addSample(".toPicker", {
  html : ['<div id="picker-example"></div>'],
  javascript: function () {
    var picker = q("#checkbox-example").toPicker();

    picker.height = 200;
    picker.on("changeSelection", function (evt) {
      var data = evt.getData();
    }, this);

    var slotData1 = [{
      title: "Windows Phone"
    }, {
      title: "iOS",
      subtitle: "Version 7.1"
    }, {
      title: "Android"
    }];
    var slotData2 = [{
      title: "Tablet"
    }, {
      title: "Smartphone"
    }, {
      title: "Phablet"
    }];

    picker.addSlot(new qx.data.Array(slotData1));
    picker.addSlot(new qx.data.Array(slotData2));
  },
  executable: true,
  showMarkup: true
});
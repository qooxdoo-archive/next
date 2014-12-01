addSample(".toWidget", {
  html: ['<div id="widget-example"></div>'],
  javascript: function() {
    var widget = q("#widget-example").toWidget();
    widget.enabled = false;
  }
});

addSample(".toWidget", {
  javascript: function() {
    var widget = new qx.ui.Widget();
    widget.on("tap", function () {
      console.log("tap on widget");
    });
  }
});
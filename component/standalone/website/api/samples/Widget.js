addSample(".widget", {
  html: ['<div id="widget-example"></div>'],
  javascript: function() {
    var widget = q("#widget-example").widget();
    widget.enabled = false;
  }
});

addSample(".widget", {
  javascript: function() {
    var widget = new qx.ui.mobile.Widget();
    widget.on("click", function () {
      console.log('click on widget');
    });
  }
});
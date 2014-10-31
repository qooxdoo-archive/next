addSample(".calendar", {
  html : ['<div id="calendar-example"></div>'],
  javascript: function() {
    // the date parameter is optional (default is new Date())
    var date = new Date();
    q("#calendar-example").calendar(date);
  },
  executable: true,
  showMarkup: true
});

addSample(".calendar", {
  javascript: function() {
    // the date parameter is optional (default is new Date())
    var calendar = new qx.ui.control.Calendar(date);
    q('body').append(calendar);
  },
  executable: true,
  showMarkup: true
});

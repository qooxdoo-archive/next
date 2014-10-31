addSample(".datePicker", {
  html : ['<input type="text" id="datepicker-example"/>'],
  javascript: function() {
q("#datepicker-example").datePicker();
  },
  executable: true,
  showMarkup: true
});

addSample(".datePicker", {
  javascript: function() {
var datePicker = new qx.ui.control.DatePicker(new Date());
// enable to manipulate input field
datePicker.set({
  readonly: false
});
// only allow to select week days and only allow to select today and future days
datePicker.getCalendar().set({
  selectableWeekDays: [1, 2, 3, 4, 5],
  minDate: new Date()
});
  },
  executable: true,
  showMarkup: true
});
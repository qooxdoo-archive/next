addSample(".toDatePicker", {
  html : ['<input type="text" id="datepicker-example"/>'],
  javascript: function() {
q("#datepicker-example").toDatePicker();
  },
  executable: true,
  showMarkup: true
});

addSample(".toDatePicker", {
  javascript: function() {
var datePicker = new qx.ui.form.DatePicker(new Date());
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
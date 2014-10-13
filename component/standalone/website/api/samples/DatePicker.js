addSample(".datepicker", {
  html : ['<input type="text" id="datepicker-example"/>'],
  javascript: function() {
q("#datepicker-example").datePicker(new Date());
  },
  executable: true,
  showMarkup: true
});

addSample(".datepicker", {
  html : ['<input type="text" id="datepicker-example"/>'],
  javascript: function() {
var datePicker = q("#datepicker-example").datePicker(new Date());
// customize the format function to change the value which is
// set to the input element
datePicker.set({
  format: function (date) {
    return date.toLocaleString();
  }
});
  },
  executable: true,
  showMarkup: true
});

addSample(".datepicker", {
  html : ['<input type="text" id="datepicker-example"/>'],
  javascript: function() {
var datePicker = q("#datepicker-example").datePicker(new Date());

// configure calendar widget
// only allow to select week days and only allow to select today and future days
datePicker.getCalendar().set({
  selectableWeekdays: [1, 2, 3, 4, 5],
  minDate: new Date()
});

  },
  executable: true,
  showMarkup: true
});

addSample(".datepicker", {
  html : ['<input type="text" id="datepicker-example"/>'],
  javascript: function() {
var datePicker = q("#datepicker-example").datePicker(new Date());

// allow user input on the connected input element
datePicker.set({
  readonly: false
});
  },
  executable: true,
  showMarkup: true
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2013-2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (wittemann)
     * Daniel Wagner (danielwagner)

************************************************************************ */

/**
 * This is a calendar widget used to select a date. It contain a set of
 * buttons to switch to the next or previous month as well as a button for
 * each day in the month.
 *
 * @require(qx.module.Template)
 * @require(qx.module.event.Keyboard)
 *
 * @group (Widget)
 */
qx.Bootstrap.define("qx.ui.mobile.control.Calendar", {
  extend : qx.ui.mobile.Widget,

  properties: {

    /**
     * The currently selected date (or date range).
     */
    value: {
      init: null,
      check: "_checkDate",
      set: "_setValue",
      get: "_getValue",
      apply: "_showValue",
      event: true
    },

    defaultCssClass: {
      init: "calendar"
    },

    /**
     * The earliest user-selectable date.
     */
    minDate: {
      init: null,
      nullable: true,
      check: "Date",
      apply: "_render"
    },

    /**
     * The latest user-selectable date.
     */
    maxDate: {
      init: null,
      nullable: true,
      check: "Date",
      apply: "_render"
    },

    /**
     * The calendar's selection mode. Possible values are 'single' and 'range'.
     */
    selectionMode: {
      init: "single",
      check: function(value) {
        return ["single", "range"].indexOf(value) !== -1;
      },
      apply: "_render"
    },

    /**
     * Array of user-selectable week days (Sunday is 0).
     */
    selectableWeekDays: {
      init: [0, 1, 2, 3, 4, 5, 6],
      check: "Array",
      apply: "_render"
    },

    /**
     * Array of strings containing the names of the months.
     */
    monthNames: {
      init: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      check: function(value) {
        return qx.Bootstrap.getClass(value) === "Array" && value.length === 12;
      },
      apply: "_render"
    },

    /**
     * Array of strings containing the names of the week days
     */
    dayNames: {
      init: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      check: function(value) {
        return qx.Bootstrap.getClass(value) === "Array" && value.length === 7;
      },
      apply: "_render"
    }
  },

  statics : {
    /**
     * *controls*
     *
     * Template for the controls. This should be a <code>tr</code> tag containing
     * the first row of the calendar.
     *
     * Default value:
     * <pre><tr>
     *  <td colspan='1' class='{{cssPrefix}}-prev-container'><button class='{{cssPrefix}}-prev' title='Previous Month'>&lt;</button></td>
     *  <td colspan='5'>{{month}} {{year}}</td>
     *  <td colspan='1' class='{{cssPrefix}}-next-container'><button class='{{cssPrefix}}-next' title='Next Month'>&gt;</button></td>
     * </tr></pre>
     *
     *
     * *dayRow*
     *
     * Template for the row of each day. This should be a tr tag containing the day names.
     *
     * Default value:
     * <pre><tr>
     *  {{#row}}<td class='{{cssPrefix}}-dayname'>{{.}}</td>{{/row}}
     * </tr></pre>
     *
     *
     * *row*
     *
     * Template for the row of days. This should be a <code>tr</code> tag containing
     * a <code>button</code> for each day.
     *
     * Default value:
     * <pre><tr>
     *   {{#row}}<td class='{{cssClass}}'>
     *     <button class='{{cssPrefix}}-day' value='{{date}}'>{{day}}</button>
     *   </td>{{/row}}
     * </tr></pre>
     *
     *
     * *table*
     *
     * Wrapper template for all other templates. This should be a table.
     *
     * Default value:
     * <pre><table class='{{cssPrefix}}-container'><thead>{{{thead}}}</thead><tbody>{{{tbody}}}</tbody></table></pre>
     */
    _templates : {
      controls : "<tr>" +
                   "<td colspan='1' class='{{cssPrefix}}-prev-container'><button class='{{cssPrefix}}-prev' {{prevDisabled}} title='Previous Month'>&lt;</button></td>" +
                   "<td colspan='5' class='{{cssPrefix}}-month'>{{month}} {{year}}</td>" +
                   "<td colspan='1' class='{{cssPrefix}}-next-container'><button class='{{cssPrefix}}-next' {{nextDisabled}} title='Next Month'>&gt;</button></td>" +
                 "</tr>",
      dayRow : "<tr>" +
                 "{{#row}}<td class='{{cssPrefix}}-dayname'>{{.}}</td>{{/row}}" +
               "</tr>",
      row : "<tr>" +
              "{{#row}}<td class='{{cssClass}}'><button class='{{cssPrefix}}-day' {{disabled}} value='{{date}}'>{{day}}</button></td>{{/row}}" +
            "</tr>",
      table : "<table class='{{cssPrefix}}-container'><thead>{{{thead}}}</thead><tbody>{{{tbody}}}</tbody></table>"
    }
  },


  construct : function(date, element) {
    this.base(qx.ui.mobile.Widget, "constructor", element);

    if (!date) {
      date = new Date();
    }
    this._normalizeDate(date);
    this.value = date;
  },


  events : {
    /** Fired at each value change */
    "changeValue" : "Date"
  },


  members : {

    __displayedValue: null,
    __range: null,


    // overridden
    _applyEnabled : function(value) {
      this.base(qx.ui.mobile.Widget, "_applyEnabled", value);

      if (value) {
        var tempDate = new Date().setFullYear(5000);
        var minDate = this.minDate || new Date(0);
        var maxDate = this.maxDate || new Date(tempDate);
        var currentDate = null;

        this.find("button.qx-calendar-day").map(function(button) {
          currentDate = new Date(button.getAttribute("value"));
          button = qxWeb(button);
          if (minDate < currentDate && maxDate > currentDate) {
            button.removeAttribute("disabled");
          }
        });
      }
    },


    /**
     * Sets the given date as the current value and displays it
     *
     * @param value {Date|Array} Date or array of dates to be displayed.
     */
    _setValue : function(value) {
      var minDate = this.minDate;
      var maxDate = this.maxDate;

      if (this.selectionMode == "single") {
        this._normalizeDate(value);

        if (this.selectableWeekDays.indexOf(value.getDay()) == -1) {
          throw new Error("The given date's week day is not selectable.");
        }

        if (minDate) {
          this._normalizeDate(minDate);
          if (value < minDate) {
            throw new Error("Given date " + value.toDateString() + " is earlier than configured minDate " + minDate.toDateString());
          }
        }

        if (maxDate) {
          this._normalizeDate(maxDate);
          if (value > maxDate) {
            throw new Error("Given date " + value.toDateString() + " is later than configured maxDate " + maxDate.toDateString());
          }
        }
      } else if (this.selectionMode == "range") {
        if (!this.__range) {
          this.__range = value.map(function(val) {
            return val.toDateString();
          });
        }
        if (value.length == 2) {
          value.sort(function(a, b) {
            return a - b;
          });
          value = this._generateRange(value);
        } else {
          this._normalizeDate(value[0]);
        }
      }

      var oldValue = this.$$value;
      this.$$value = value;

      this._showValue(value);

      if ((this.selectionMode == "single") || ((this.selectionMode == "range") && (value.length >= 1))) {
        this.emit("changeValue", {
          value: value,
          old: oldValue,
          target: this
        });
      }
    },


    /**
     * Returns the currently selected date of the first
     * calendar widget in the collection.
     *
     * @return {qx.ui.mobile.control.Calendar} The collection for chaining.
     */
    _getValue : function() {
      var value = this.$$value;
      return value ? (qx.Bootstrap.getClass(value) === "Array" ? value : new Date(value)) : null;
    },


    /**
     * Displays the given date
     *
     * @param value {Date} Date to display. Default: The currently displayed value (re-rendering)
     * @return {qx.ui.mobile.control.Calendar} The collection for chaining.
     */
    _showValue : function(value) {
      // If value is an array, show the last selected date
      value = qx.Bootstrap.getClass(value) === "Array" ? value[value.length -1] : value;

      this.__displayedValue = value;

      if (this.getAttribute("tabindex") < 0) {
        this.setAttribute("tabindex", 0);
      }
      this.find("." + this.defaultCssClass + "-prev").off("tap", this._prevMonth, this);
      this.find("." + this.defaultCssClass + "-next").off("tap", this._nextMonth, this);
      this.find("." + this.defaultCssClass + "-day").off("tap", this._selectDay, this);
      this.off("focus", this._onFocus, this, true)
      .off("blur", this._onBlur, this, true);

      this.setHtml(this._getTable(value));

      this.find("." + this.defaultCssClass + "-prev").on("tap", this._prevMonth, this);
      this.find("." + this.defaultCssClass + "-next").on("tap", this._nextMonth, this);
      this.find("td").not(".qx-calendar-invalid")
        .find("." + this.defaultCssClass + "-day").on("tap", this._selectDay, this);
      this.on("focus", this._onFocus, this, true)
      .on("blur", this._onBlur, this, true);

      return this;
    },


    /**
     * value property check
     * @param value {var} new value
     * @return {Boolean} <code>true</code> if the value is valid
     */
    _checkDate: function(value) {
      var clazz = qx.Bootstrap.getClass(value);
      if (clazz === "Date") {
        return true;
      }
      if (clazz === "Array") {
        for (var i=0, l=value.length; i<l; i++) {
          if (qx.Bootstrap.getClass(value[i]) !== "Date") {
            return false;
          }
        }
        return true;
      }
      return false;
    },


    /**
     * Re-build the calendar UI
     */
    _render: function() {
      this._showValue(this.value);
    },


    /**
     * Displays the previous month
     */
    _prevMonth : function() {
      this._showValue(new Date(this.__displayedValue.getFullYear(), this.__displayedValue.getMonth() - 1));
    },


    /**
     * Displays the next month
     */
    _nextMonth : function() {
      this._showValue(new Date(this.__displayedValue.getFullYear(), this.__displayedValue.getMonth() + 1));
    },


    /**
     * Sets the current value to the day selected by the user
     * @param e {Event} The tap event.
     */
    _selectDay : function(e) {
      var day = qxWeb(e.target);
      var newStr = day.getAttribute("value");
      var newValue = new Date(newStr);

      if (this.selectionMode == "range") {
        if (!this.__range) {
          this.__range = [];
        }

        var range = this.__range.slice(0);
        if (range.length == 2) {
          range = [];
        }
        range.push(newStr);

        this.__range = range;
        range = range.map(function(item){
          return new Date(item);
        });

        this.value = range;
        newStr = range;
      } else {
        this.value = newValue;
        newStr = [newStr];
      }

      newStr.forEach(function(str){
        this.find("." + this.defaultCssClass + "-day[value='" + str + "']").focus();
      }.bind(this));

    },


    getTemplate: function(name) {
      return qx.ui.mobile.control.Calendar._templates[name];
    },


    /**
     * TODO
     */
    setTemplate: function(name) {

    },


    /**
     * Renders the calendar for the given date.
     *
     * @param date {Date} The date to render.
     * @return {String} The calendar HTML.
     */
    _getTable : function(date) {
      var controls = qxWeb.template.render(this.getTemplate("controls"), this._getControlsData(date));
      var dayRow = qxWeb.template.render(this.getTemplate("dayRow"), this._getDayRowData());

      var data = {
        thead: controls + dayRow,
        tbody: this._getWeekRows(date),
        cssPrefix: this.defaultCssClass
      };

      return qxWeb.template.render(this.getTemplate("table"), data);
    },


    /**
     * Returns the month and year to be displayed in the calendar controls.
     *
     * @param date {Date} The date to be displayed.
     * @return {Map} A map containing the month and year.
     */
    _getControlsData : function(date) {
      var prevDisabled = "";
      var minDate = this.minDate;
      if (minDate) {
        this._normalizeDate(minDate);
        if (date.getMonth() <= minDate.getMonth()) {
          prevDisabled = "disabled";
        }
      }

      var nextDisabled = "";
      var maxDate = this.maxDate;
      if (maxDate) {
        this._normalizeDate(maxDate);
        if (date.getMonth() >= maxDate.getMonth()) {
          nextDisabled = "disabled";
        }
      }

      return {
        month: this.monthNames[date.getMonth()],
        year: date.getFullYear(),
        cssPrefix : this.defaultCssClass,
        prevDisabled : prevDisabled,
        nextDisabled : nextDisabled
      };
    },


    /**
     * Returns the week day names to be displayed in the calendar.
     *
     * @return {String[]} Array of day names.
     */
    _getDayRowData : function() {
      return {
        row: this.dayNames,
        cssPrefix: this.defaultCssClass
      };
    },


    /**
     * Returns the table rows displaying the days of the month.
     *
     * @param date {Date} The date to be displayed.
     * @return {String} The table rows as an HTML string.
     */
    _getWeekRows : function(date) {

      date = qx.Bootstrap.getClass(date) === "Array" ? date[date.length -1] : date;

      var weeks = [];
      var value = null, valueString = null;
      var today = new Date();
      var helpDate = this._getHelpDate(date);

      var minDate = this.minDate;
      if (minDate) {
        this._normalizeDate(minDate);
      }

      var maxDate = this.maxDate;
      if (maxDate) {
        this._normalizeDate(maxDate);
      }

      if (qx.Bootstrap.getClass(this.value) === "Array") {
        valueString = this.value.map(function(currentDate){ return currentDate.toDateString(); });
      }

      for (var week=0; week<6; week++) {

        var data = {row: []};

        for (var i=0; i<7; i++) {
          var cssClasses = helpDate.getMonth() !== date.getMonth() ? this.defaultCssClass + "-othermonth" : "";
          if((this.selectionMode == "range")  && qx.Bootstrap.getClass(this.value) === "Array"){
            if(valueString.indexOf(helpDate.toDateString()) != -1){
              cssClasses += this.defaultCssClass + "-selected";
            }
          } else {
            var range = this.__range;
            if (this.value) {
              value = this.selectionMode == "range" ? new Date(range[range.length - 1]) : this.value;
              cssClasses += helpDate.toDateString() === value.toDateString() ? " " + this.defaultCssClass + "-selected" : "";
            }
          }

          cssClasses += today.toDateString() === helpDate.toDateString() ? " " + this.defaultCssClass + "-today" : "";

          var disabled = this.enabled ? "" : "disabled";
          if ((minDate && helpDate < minDate) || (maxDate && helpDate > maxDate) ||
            this.selectableWeekDays.indexOf(helpDate.getDay()) == -1) {
            disabled = "disabled";
          }

          cssClasses += (helpDate.getDay() === 0 || helpDate.getDay() === 6) ? " " + this.defaultCssClass + "-weekend" : " " + this.defaultCssClass + "-weekday";

          data.row.push({
            day: helpDate.getDate(),
            date: helpDate.toDateString(),
            cssPrefix: this.defaultCssClass,
            cssClass: cssClasses,
            disabled: disabled
          });
          helpDate.setDate(helpDate.getDate() + 1);
        }

        weeks.push(qxWeb.template.render(this.getTemplate("row"), data));
      }

      return weeks.join("");
    },


    /**
     * Returns a date instance for the first visible day to be displayed
     *
     * @param date {Date} Current date
     * @return {Date} Helper date
     */
    _getHelpDate : function(date) {
      var startOfWeek = 1; //TODO: config option
      var helpDate = new Date(date.getFullYear(), date.getMonth(), 1);

      var firstDayOfWeek = helpDate.getDay();

      helpDate = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
      var nrDaysOfLastMonth = (7 + firstDayOfWeek - startOfWeek) % 7;
      helpDate.setDate(helpDate.getDate() - nrDaysOfLastMonth);

      return helpDate;
    },


    /**
     * Sets the hours, minutes and seconds of a date object to 0
     * to facilitate date comparisons.
     *
     * @param date {Date} Date to normalize
     */
    _normalizeDate : function(date) {
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
    },


    /**
     * Attaches the keydown listener.
     *
     * @param e {Event} focus event
     */
    _onFocus : function(e) {
      this.on("keydown", this._onKeyDown, this);
    },


    /**
     * Removes the keydown listener if the focus moves outside of the calendar.
     *
     * @param e {Event} blur event
     */
    _onBlur : function(e) {
      if (this[0].contains(e.relatedTarget)) {
        this.off("keydown", this._onKeyDown, this);
      }
    },


    /**
     * Keyboard handling.
     *
     * @param e {Event} The keydown event.
     */
    _onKeyDown : function(e) {
      var target = qxWeb(e.target);
      var key = e.getKeyIdentifier();
      var isDayButton = target.hasClass(this.defaultCssClass + "-day");

      if (isDayButton) {
        if (key == "Space") {
          this._selectDay(e);
        }
        else if (key == "Right") {
          e.preventDefault();
          this._focusNextDay(target);
        }
        else if (key == "Left") {
          e.preventDefault();
          this._focusPrevDay(target);
        }
      } else {
        if (key == "Space") {
          if (target.hasClass(this.defaultCssClass + "-prev")) {
            e.preventDefault();
            this._prevMonth();
            this.find("." + this.defaultCssClass + "-prev").focus();
          } else if (target.hasClass(this.defaultCssClass + "-next")) {
            e.preventDefault();
            this._nextMonth();
            this.find("." + this.defaultCssClass + "-next").focus();
          }
        } else if (key == "Right") {
          e.preventDefault();
          this._nextMonth();
          this.find("." + this.defaultCssClass + "-next").focus();
        } else if (key == "Left") {
          e.preventDefault();
          this._prevMonth();
          this.find("." + this.defaultCssClass + "-prev").focus();
        }
      }

      e.stopPropagation();
    },


    /**
     * Focuses the day button following the given one.
     *
     * @param currentDay {qxWeb} The button for the current day.
     */
    _focusNextDay : function(currentDay) {
      var nextDayInWeek = currentDay.getParents().getNext();
      if (nextDayInWeek.length > 0) {
        nextDayInWeek.getChildren("." + this.defaultCssClass + "-day").focus();
      } else {
        var nextWeekRow = currentDay.getParents().getParents().getNext();
        if (nextWeekRow.length > 0) {
          nextWeekRow.find("> td > ." + this.defaultCssClass + "-day").getFirst().focus();
        } else {
          this._nextMonth();
          var oldDate = new Date(currentDay.getAttribute("value"));
          var newDate = new Date(oldDate.valueOf());
          newDate.setDate(oldDate.getDate() + 1);
          var buttonVal = newDate.toDateString();
          this.find("." + this.defaultCssClass + "-day[value='" + buttonVal + "']").focus();
        }
      }
    },


    /**
     * Focuses the day button preceding the given one.
     *
     * @param currentDay {qxWeb} The button for the current day.
     */
    _focusPrevDay : function(currentDay) {
      var prevDayInWeek = currentDay.getParents().getPrev();
      if (prevDayInWeek.length > 0) {
        prevDayInWeek.getChildren("." + this.defaultCssClass + "-day").focus();
      } else {
        var prevWeekRow = currentDay.getParents().getParents().getPrev();
        if (prevWeekRow.length > 0) {
          prevWeekRow.find("> td > ." + this.defaultCssClass + "-day").getLast().focus();
        } else {
          this._prevMonth();
          var oldDate = new Date(currentDay.getAttribute("value"));
          var newDate = new Date(oldDate.valueOf());
          newDate.setDate(oldDate.getDate() - 1);
          var buttonVal = newDate.toDateString();
          this.find("." + this.defaultCssClass + "-day[value='" + buttonVal + "']").focus();
        }
      }
    },

    /**
    * Generates a date list depending on the given range
    *
    * @param range {Array} Array containing the start and end values on the range
    * @return {Array} Array with all the date objects contained in the given range
    */
    _generateRange : function(range) {

      var list = [], current = range[0];

      var minDate = this.minDate ? this.minDate : new Date(range[0].toDateString());
      var maxDate = this.maxDate ? this.maxDate : new Date(range[1].toDateString());

      this._normalizeDate(minDate);
      this._normalizeDate(maxDate);

      while(current <= range[1]){
        this._normalizeDate(current)
        list.push(new Date(current.toDateString()));
        current.setDate(current.getDate() + 1);
      }

      // Removing non selectable days
      list = list.filter(function(date){
        return this.selectableWeekDays.indexOf(date.getDay()) != -1;
      }, this);

      if(list.length == 0){
        throw new Error("Given date range is not valid. Please verify the 'selectableWeekDays' config");
      }

      // Removing days out of defined min/max range
      list = list.filter(function(date){
       return (date >= minDate) && (date <= maxDate);
      }, this);

      if(list.length == 0){
        throw new Error("Given date range is not valid. Please verify the 'minDate' and 'maxDate' configs");
      }

      return list;
    },


    dispose : function() {
      this.find("." + this.defaultCssClass + "-prev").off("tap", this._prevMonth, this);
      this.find("." + this.defaultCssClass + "-next").off("tap", this._nextMonth, this);
      this.find("." + this.defaultCssClass + "-day").off("tap", this._selectDay, this);
      this.off("focus", this._onFocus, this, true)
      .off("blur", this._onBlur, this, true)
      .off("keydown", this._onKeyDown, this);

      this.setHtml("");

      return this.base(qx.ui.mobile.Widget, "dispose");
    }

  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

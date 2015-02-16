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
qx.Class.define("qx.ui.control.Calendar", {
  extend : qx.ui.Widget,

  properties: {

    defaultCssClass: {
      init: "calendar"
    },

    /**
     * Array of strings containing the names of the months.
     */
    monthNames: {
      init: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      check: function(value) {
        return qx.Class.getClass(value) === "Array" && value.length === 12;
      },
      apply: "_render"
    },

    /**
     * Array of strings containing the names of the week days
     */
    dayNames: {
      init: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      check: function(value) {
        return qx.Class.getClass(value) === "Array" && value.length === 7;
      },
      apply: "_render"
    },

    /**
     * Hide all days of the previous/next month. If the entire last row of the calandar are days of
     * the next month the whole row is not rendered.
     */
    hideDaysOfOtherMonth: {
      init: false,
      check: "Boolean",
      apply: "_render"
    },

    /**
     * Disable all days of the previous/next month. The days are visible, but are not responding to
     * user input.
     */
    disableDaysOtherMonth: {
      init: false,
      check: "Boolean",
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
     *     <button class='{{cssPrefix}}-day {{hidden}}' value='{{date}}'>{{day}}</button>
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
              "{{#row}}<td class='{{cssClass}}'><button class='{{cssPrefix}}-day {{hidden}}' {{disabled}} value='{{date}}'>{{day}}</button></td>{{/row}}" +
            "</tr>",
      table : "<table class='{{cssPrefix}}-container'><thead>{{{thead}}}</thead><tbody>{{{tbody}}}</tbody></table>"
    }
  },


  /**
   * @attach {qxWeb, toCalendar}
   * @param date {Date?} Date to display. Default: The current month
   * @param element {Element?} Container element (DIV) for this widget
   * @return {qx.ui.control.Calendar} The new calendar widget.
   */
  construct : function(date, element) {
    this.super(qx.ui.Widget, "construct", element);
    this.__monthElements = {};
    this.showDate(date);
    this.on("keydown", this._onKeyDown, this);
  },


  events : {
    "selected" : null
  },


  members : {

    __displayedDate: null,
    __monthElements: null,


    /**
     * Displays the given date
     *
     * @param date {Date?} Date to display. Default: The current month
     * @return {qx.ui.control.Calendar} The collection for chaining.
     */
    showDate : function(date) {
      if (!date) {
        date = new Date();
      }
      this._normalizeDate(date);

      this.__displayedDate = date;

      if (this.getAttribute("tabindex") < 0) {
        this.setAttribute("tabindex", 0);
      }

      if (this.__monthElements[date.getTime()]) {
        this.find(".calendar-container").remove();
        this.append(this.__monthElements[date.getTime()]);
        return this;
      }

      this.setHtml(this._getTable(date));

      this.find("." + this.defaultCssClass + "-prev").on("tap", this.showPreviousMonth, this);
      this.find("." + this.defaultCssClass + "-next").on("tap", this.showNextMonth, this);
      this.find("." + this.defaultCssClass + "-day")
        .on("tap", this._selectDay, this)
        .forEach(function(button) {
          button.model = new Date(button.getAttribute("value"));
        });

      this.__monthElements[date.getTime()] = this.find(".calendar-container");

      return this;
    },


    /**
     * Displays the previous month
     */
    showPreviousMonth : function() {
      this.showDate(new Date(this.__displayedDate.getFullYear(), this.__displayedDate.getMonth() - 1));
    },


    /**
     * Displays the next month
     */
    showNextMonth : function() {
      this.showDate(new Date(this.__displayedDate.getFullYear(), this.__displayedDate.getMonth() + 1));
    },


    /**
     * Re-build the calendar UI
     */
    _render: function() {
      this._disposeMonthElements();
      this.showDate(this.__displayedDate);
    },


    /**
     * Emits the <code>selected</code> event if a day was selected
     * @param e {Event} The tap event.
     */
    _selectDay : function(e) {
      this.emit("selected", qxWeb(e.target));
    },


    /**
     * Returns a template string
     * @param name {String} Template name
     * @return {String} Template
     */
    getTemplate: function(name) {
      return qx.ui.control.Calendar._templates[name];
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
      return {
        month: this.monthNames[date.getMonth()],
        year: date.getFullYear(),
        cssPrefix : this.defaultCssClass
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
      var weeks = [];
      var today = new Date();
      var helpDate = this._getHelpDate(date);

      for (var week=0; week<6; week++) {
        var data = {row: []};

        for (var i=0; i<7; i++) {

          var cssClasses = "";
          var hidden = "";
          var disabled = this.enabled ? "" : "disabled='disabled'";

          if (helpDate.getMonth() !== date.getMonth()) {

            // first day of the last displayed is already
            if (this.hideDaysOtherMonth === true && week === 5 && i === 0) {
              break;
            }

            cssClasses += this.defaultCssClass + "-othermonth";
            hidden += this.hideDaysOtherMonth ? "qx-hidden" : "";
            disabled = this.disableDaysOtherMonth ? "disabled='disabled'" : "";
          }

          cssClasses += today.toDateString() === helpDate.toDateString() ? " " + this.defaultCssClass + "-today" : "";
          cssClasses += (helpDate.getDay() === 0 || helpDate.getDay() === 6) ? " " + this.defaultCssClass + "-weekend" : " " + this.defaultCssClass + "-weekday";

          data.row.push({
            day: helpDate.getDate(),
            date: helpDate.toDateString(),
            cssPrefix: this.defaultCssClass,
            cssClass: cssClasses,
            disabled: disabled,
            hidden: hidden
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
     * Sets given date object's date of the month to 1 and the time
     * to 00:00:000
     *
     * @param date {Date} Date to normalize
     */
    _normalizeDate : function(date) {
      date.setDate(1);
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
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
            this.showPreviousMonth();
            this.find("." + this.defaultCssClass + "-prev").focus();
          } else if (target.hasClass(this.defaultCssClass + "-next")) {
            e.preventDefault();
            this.showNextMonth();
            this.find("." + this.defaultCssClass + "-next").focus();
          }
        } else if (key == "Right") {
          e.preventDefault();
          this.showNextMonth();
          this.find("." + this.defaultCssClass + "-next").focus();
        } else if (key == "Left") {
          e.preventDefault();
          this.showPreviousMonth();
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
          this.showNextMonth();
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
          this.showPreviousMonth();
          var oldDate = new Date(currentDay.getAttribute("value"));
          var newDate = new Date(oldDate.valueOf());
          newDate.setDate(oldDate.getDate() - 1);
          var buttonVal = newDate.toDateString();
          this.find("." + this.defaultCssClass + "-day[value='" + buttonVal + "']").focus();
        }
      }
    },


    /**
     * Removes tap listeners from the calendar's buttons
     *
     * @param el {qxWeb} Collection containing the table element
     */
    _removeListeners: function(el) {
      el.find("." + this.defaultCssClass + "-prev").off("tap", this.showPreviousMonth, this);
      el.find("." + this.defaultCssClass + "-next").off("tap", this.showNextMonth, this);
      el.find("." + this.defaultCssClass + "-day").off("tap", this._selectDay, this);
    },

    _disposeMonthElements: function() {
      for (var key in this.__monthElements) {
        this._removeListeners(this.__monthElements[key]);
         this.__monthElements[key].setHtml("");
        this.__monthElements[key] = undefined;
      }
      this.__monthElements = {};
    },


    dispose : function() {
      this._disposeMonthElements();
      this._removeListeners(this);
      this.off("keydown", this._onKeyDown, this);

      this.setHtml("");

      return this.super(qx.ui.Widget, "dispose");
    }

  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

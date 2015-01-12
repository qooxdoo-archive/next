"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Alexander Steitz (aback)
     * Tobias Oberrauch (toberrauch)

************************************************************************ */

/**
 * This is a date picker widget used to combine an input element with a calendar widget
 * to select a date. The calendar itself is opened as popup to save visual space.
 *
 * @require(qx.module.Template)
 * @require(qx.module.Placement)
 * @require(qx.ui.control.Calendar)
 *
 * @group (Widget)
 */
qx.Class.define("qx.ui.form.DatePicker", {
  extend: qx.ui.form.Input,

  include: [
    qx.ui.form.MText
  ],

  properties: {
    // overridden
    defaultCssClass :
    {
      init : "qx-datepicker"
    },

    /**
     * Function which is called with a JavaScript Date object instance.
     * You can provide a custom format function to manipulate the value
     * which is displayed in the associated input element.
     */
    format: {
      check: "Function"
    },

    /**
     * Position of the calendar popup from the point of view of the <code>INPUT</code> element.
     * Possible values are
     *
     * * <code>top-left</code>
     * * <code>top-center</code>
     * * <code>top-right</code>,
     * * <code>bottom-left</code>
     * * <code>bottom-center</code>
     * * <code>bottom-right</code>
     * * <code>left-top</code>
     * * <code>left-middle</code>
     * * <code>left-bottom</code>
     * * <code>right-top</code>
     * * <code>right-middle</code>
     * * <code>right-bottom</code>
     *
     * Default value:
     * <pre>bottom-left</pre>
     */
    position: {
      init : "bottom-left",
      check : "_checkPosition"
    }
  },


  /**
   * @attach {qxWeb, toDatePicker}
   * @param date {Date} The current shown date
   * @param element {Element?null} The new date picker widget.
   * @return {qx.ui.form.DatePicker} The new date picker widget.
   */
  construct : function(date, element) {
    this.super(qx.ui.form.Input, "construct", element);

    this.format = function(date) {
      return date;
    };

    this.__uniqueId = Math.round(Math.random() * 10000);

    delete this.readonly;
    this.on('tap', this._onTap);

    var calendarId = 'datepicker-calendar-' + this.__uniqueId;

    var calendar = new qx.ui.control.Calendar()
      .setAttribute('id', calendarId)
      .setStyles({
        position: "absolute",
        display: "none"
      })
      .on('tap', this._onCalendarTap)
      .appendTo(document.body);

    // create the connection between the date picker and the corresponding calendar widget
    this.__calendarId = calendarId;

    // grab tap events at the body element to be able to hide the calender popup
    // if the user taps outside
    qxWeb(document.body).on("tap", this._hideCalendar, this);
    qxWeb(document).on("roll", this._hideCalendar, this);

    // react on date selection
    calendar.on('selected', this._calendarSelected, this);

    if (date !== undefined) {
      calendar.setValue(date);
    }

    this.initMText();
  },

  members : {

    __calendarId: null,
    __uniqueId: null,

    /**
     * Property validation
     * @param value {String} value
     * @return {Boolean} <code>true</code> if the value is valid.
     */
    _checkPosition : function(value) {
      return [ 'top-left', 'top-center', 'top-right',
               'bottom-left', 'bottom-center', 'bottom-right',
               'left-top', 'left-middle', 'left-bottom',
               'right-top', 'right-middle', 'right-bottom' ].indexOf(value) !== -1;
    },


    /**
     * Get the associated calendar widget
     * @return {qx.ui.control.Calendar} calendar widget instance
     */
    getCalendar : function() {
      return qxWeb('div#' + this.__calendarId);
    },

    /**
     * Listener which handles clicks/taps on the associated input element and
     * opens / hides the calendar.
     *
     * @param e {Event} tap event
     */
    _onTap : function(e) {
      if (!this.enabled) {
        return;
      }

      var calendar = this.getCalendar();
      if (calendar.getStyle("display") == "none") {
        calendar
          .placeTo(this, this.position, null, "keep-align")
          .setStyle("display", "block");
      } else {
        calendar.setStyle("display", "none");
      }
    },

    /**
     * Stop tap events from reaching the body so the calendar won't close
     * @param e {Event} Tap event
     */
    _onCalendarTap : function(e) {
      e.stopPropagation();
    },

    /**
     * Listener to the body element to be able to hide the calendar if the user clicks
     * or taps outside the calendar.
     *
     * @param e {Event} tap event
     */
    _hideCalendar : function(e) {
      var target = qxWeb(e.target);

      // fast check for tap on the connected input field
      if (this.length > 0 && target.length > 0 &&
          this[0] == target[0]) {
        return;
      }

      // otherwise check if the target is a child of the (rendered) calendar
      if (this.getCalendar().isRendered()) {
        if (target.isChildOf(this.getCalendar()) === false) {
          this.getCalendar().setStyle("display", "none");
        }
      }
    },

    /**
     * Listens to value selection of the calendar, Whenever the user selected a day
     * we write it back to the input element and hide the calendar.
     *
     * The format of the date can be controlled with the 'format' config function
     *
     * @param selectedDay {qxWeb} qxWeb instance of the current selected day
     */
    _calendarSelected : function(selectedDay) {
      var formattedValue = this.format.call(this, selectedDay.getValue());
      this.setValue(formattedValue);
      this.getCalendar().setStyle("display", "none");
    },

    // overridden
    dispose : function() {
      this.readonly = false;

      this.off('tap', this._onTap);

      qxWeb(document.body).off("tap", this._hideCalendar, this);
      qxWeb(document).off("roll", this._hideCalendar, this);

      this.getCalendar()
        .off('selected', this._calendarSelected, this)
        .off('tap', this._onCalendarTap)
        .remove()
        .dispose();

      this.super(qx.ui.form.Input, "dispose");
    }
  },

  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

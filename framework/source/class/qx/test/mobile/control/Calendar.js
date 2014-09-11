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
     * Daniel Wagner (danielwagner)

************************************************************************ */

qx.Bootstrap.define("qx.test.mobile.control.Calendar",
{
  extend : qx.test.mobile.MobileTestCase,

  members :  {

    __now: null,
    __cal: null,

    setUp: function() {
      this.base(qx.test.mobile.MobileTestCase, "setUp");
      this.__now = new Date();
      this.__cal = new qx.ui.mobile.control.Calendar(this.__now)
        .appendTo(this.getRoot());
    },

    tearDown: function() {
      this.base(qx.test.mobile.MobileTestCase, "tearDown");
    },

    testSetGetValue : function() {
      this.assertEquals(this.__now.toDateString(), this.__cal.value.toDateString());
    },

    testChangeEvent : function() {
      this.__cal.value = new Date();
      this.__cal.on("changeValue", function() {
        this.resume(function() {
          this.assertEquals(this.__now.toDateString(), this.__cal.value.toDateString());
        }, this);
      }.bind(this));

      setTimeout(function() {
        this.__cal.value = this.__now;
      }.bind(this), 100);

      this.wait(250);
    },

    testConfig : function() {
      var monthNames = this.__cal.monthNames.map(function(month) {
        return month.substr(0, 3).toUpperCase();
      });
      var dayNames = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
      this.__cal.monthNames = monthNames;
      this.__cal.dayNames = dayNames;

      var displayedMonth = this.__cal.find("thead tr:nth-child(1) td:nth-child(2)").getHtml();
      this.assertEquals(0, displayedMonth.indexOf(monthNames[this.__now.getMonth()]));

      var displayedDays = this.__cal.find("thead tr:nth-child(2) td").toArray().map(function(cell) {
        return qxWeb(cell).getHtml();
      });
      this.assertArrayEquals(dayNames, displayedDays);
    },

    // testTemplates : function() {
    //   var newClass = "my-cool-calendar";
    //   cal.setTemplate("table", cal.getTemplate("table")
    //     .replace("{{cssPrefix}}-container", "{{cssPrefix}}-container " + newClass));

    //   var newPrev = "prev";
    //   cal.setTemplate("controls", cal.getTemplate("controls")
    //     .replace("&lt;", newPrev));

    //   cal.render();

    //   this.assertEquals(1, q("." + newClass).length);

    //   var displayedPrev = cal.find("thead tr:nth-child(1) td:nth-child(1) button").getHtml();
    //   this.assertEquals(displayedPrev, newPrev);
    // },

    testNewCollection : function() {
      var c1 = this.getRoot().find(".calendar");
      this.assertEquals(this.__now.toDateString(), c1.value.toDateString());
    },

    testMinDate : function() {
      this.__cal.value = new Date(2014, 1, 3);
      this.__cal.minDate = new Date(2013, 5, 6);
      // valid date
      this.__cal.value = new Date(2013, 5, 6);
      this.assertException(function() {
        this.__cal.value = new Date(2013, 5, 5);
      });
    },

    testMaxDate : function() {
      this.__cal.value = new Date(2014, 1, 3);
      this.__cal.maxDate = new Date(2015, 5, 6);
      // valid date
      this.__cal.value = new Date(2015, 5, 6);
      this.assertException(function() {
        this.__cal.value = new Date(2015, 5, 7);
      });
    },

    testSelectableWeekDays : function() {
      this.__cal.value = new Date(2014, 1, 3);
      this.__cal.selectableWeekDays = [1, 2, 3, 4, 5];
      // valid day
      this.__cal.value = new Date(2014, 1, 3);
      this.assertException(function() {
        this.__cal.value = new Date(2014, 1, 2);
      });
    }
  }
});
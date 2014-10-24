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

describe("mobile.control.Calendar", function() {

  this.timeout(2500);
  var __now = null;
  var __cal = null;


  beforeEach(function() {
    setUpRoot();
    __now = new Date();
    __cal = new qx.ui.mobile.control.Calendar(__now).appendTo(getRoot());
  });


  afterEach(function() {
    tearDownRoot();
  });


  it("SetGetValue", function() {
    assert.equal(__now.toDateString(), __cal.value.toDateString());
  });


  it("ChangeEvent", function(done) {
    __cal.value = new Date();
    __cal.on("changeValue", function() {
      setTimeout(function() {
        assert.equal(__now.toDateString(), __cal.value.toDateString());
        done();
      }, 250);
    }.bind(this));

    setTimeout(function() {
      __cal.value = __now;
    }, 100);

  });


  it("Config", function() {
    var monthNames = __cal.monthNames.map(function(month) {
      return month.substr(0, 3).toUpperCase();
    });
    var dayNames = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
    __cal.monthNames = monthNames;
    __cal.dayNames = dayNames;

    var displayedMonth = __cal.find("thead tr:nth-child(1) td:nth-child(2)").getHtml();
    assert.equal(0, displayedMonth.indexOf(monthNames[__now.getMonth()]));

    var displayedDays = __cal.find("thead tr:nth-child(2) td").toArray().map(function(cell) {
      return qxWeb(cell).getHtml();
    });
    assert.deepEqual(dayNames, displayedDays);
  });


  it("NewCollection", function() {
    var c1 = getRoot().find(".qx-calendar");
    assert.equal(__now.toDateString(), c1.value.toDateString());
  });


  it("MinDate", function() {
    __cal.value = new Date(2014, 1, 3);
    __cal.minDate = new Date(2013, 5, 6);
    // valid date
    __cal.value = new Date(2013, 5, 6);
    assert.throw(function() {
      __cal.value = new Date(2013, 5, 5);
    });
  });


  it("MaxDate", function() {
    __cal.value = new Date(2014, 1, 3);
    __cal.maxDate = new Date(2015, 5, 6);
    // valid date
    __cal.value = new Date(2015, 5, 6);
    assert.throw(function() {
      __cal.value = new Date(2015, 5, 7);
    });
  });


  it("SelectableWeekDays", function() {
    __cal.value = new Date(2014, 1, 3);
    __cal.selectableWeekDays = [1, 2, 3, 4, 5];
    // valid day
    __cal.value = new Date(2014, 1, 3);
    assert.throw(function() {
      __cal.value = new Date(2014, 1, 2);
    });
  });


  it("Factory", function(done) {
    __cal = qxWeb.create("<div>").calendar().appendTo(getRoot());
    assert.instanceOf(__cal, qx.ui.mobile.control.Calendar);
    qx.core.Assert.assertEquals(__cal, __cal[0].$$widget);
    setTimeout(function() {
      assert.equal("qx.ui.mobile.control.Calendar", __cal.getData("qxWidget"));
      done();
    }, 100);
  });
});

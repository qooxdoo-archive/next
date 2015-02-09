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

describe("ui.control.Calendar", function() {

  beforeEach(function() {
    this.__now = new Date();
    this.__cal = new qx.ui.control.Calendar(this.__now).appendTo(sandbox);
  });


  afterEach(function() {
    this.__cal.dispose();
  });


  it("Config", function() {
    var monthNames = this.__cal.monthNames.map(function(month) {
      return month.substr(0, 3).toUpperCase();
    });
    var dayNames = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
    this.__cal.monthNames = monthNames;
    this.__cal.dayNames = dayNames;

    var displayedMonth = this.__cal.find("thead tr:nth-child(1) td:nth-child(2)").getHtml();
    assert.equal(0, displayedMonth.indexOf(monthNames[this.__now.getMonth()]));

    var displayedDays = this.__cal.find("thead tr:nth-child(2) td").toArray().map(function(cell) {
      return qxWeb(cell).getHtml();
    });
    assert.deepEqual(dayNames, displayedDays);
  });


  it("NewCollection", function() {
    var c1 = sandbox.find(".calendar");
    assert.equal(c1.classname, "qx.ui.control.Calendar");
  });


  it("Factory", function() {
    this.__cal = qxWeb.create("<div>").toCalendar().appendTo(sandbox);
    assert.instanceOf(this.__cal, qx.ui.control.Calendar);
    qx.core.Assert.assertEquals(this.__cal, this.__cal[0].$$widget);
    assert.equal("qx.ui.control.Calendar", this.__cal.getData("qxWidget"));
  });
});

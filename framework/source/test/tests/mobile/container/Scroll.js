/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

describe("mobile.container.Scroll", function() {

  it("Create", function() {
    var container = new qx.ui.container.Scroll();
    sandbox.append(container);
    container.dispose();
  });


  it("Factory", function() {
    var scroll = q.create('<div>')
      .toScroll()
      .appendTo(sandbox);

    assert.instanceOf(scroll, qx.ui.container.Scroll);
    assert.equal(scroll, scroll[0].$$widget);
    assert.equal("qx.ui.container.Scroll", scroll.getData("qxWidget"));

    scroll.dispose();
  });


  it("Horizontal way-point", function (done) {
    var scrollContainer = new qx.ui.container.Scroll();
    scrollContainer.setStyles({
      overflow: "hidden"
    });
    scrollContainer.setWaypointsX([200]);
    scrollContainer.on("waypoint", function (wayPoint) {
      assert.equal("x", wayPoint.axis);
      assert.equal(0, wayPoint.index);
      assert.equal("left", wayPoint.direction);

      done();
    }, this);

    var content = new qx.ui.Widget();
    content.setStyles({
      width: "5000px",
      height: "5000px"
    });
    scrollContainer.append(content).appendTo(sandbox);

    scrollContainer._updateWaypoints();
    scrollContainer.setScrollLeft(250);
  });
});

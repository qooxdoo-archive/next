/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

describe("util.placement.DirectAxis", function () {
  var __axis;
  
  beforeEach(function () {
    __axis = qx.util.placement.DirectAxis;
  });

  afterEach(function () {
    delete __axis;
  });

  it("EnoughSpace", function () {
    var size = 50;
    var target = {start: 500, end: 600};
    var offsets = {start: 10, end: 20};
    var areaSize = 1000;

    assert.equal(
      430,
      __axis.computeStart(size, target, offsets, areaSize, "edge-start")
    );

    assert.equal(
      610,
      __axis.computeStart(size, target, offsets, areaSize, "edge-end")
    );

    assert.equal(
      510,
      __axis.computeStart(size, target, offsets, areaSize, "align-start")
    );

    assert.equal(
      535,
      __axis.computeStart(size, target, offsets, areaSize, "align-center")
    );

    assert.equal(
      530,
      __axis.computeStart(size, target, offsets, areaSize, "align-end")
    );
  });
});

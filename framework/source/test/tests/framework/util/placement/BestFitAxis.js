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

describe("util.placement.BestFitAxis", function () {
  var __axis;
  
  beforeEach(function () {
    __axis = qx.util.placement.BestFitAxis;
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

  it("NotEnoughSpaceStart", function () {
    var size = 250;
    var target = {start: 30, end: 200};
    var offsets = {start: 10, end: 20};
    var areaSize = 1000;

    assert.equal(
      0,
      __axis.computeStart(size, target, offsets, areaSize, "edge-start")
    );

    assert.equal(
      210,
      __axis.computeStart(size, target, offsets, areaSize, "edge-end")
    );

    assert.equal(
      40,
      __axis.computeStart(size, target, offsets, areaSize, "align-start")
    );

    assert.equal(
      0,
      __axis.computeStart(260, target, offsets, areaSize, "align-center")
    );

    assert.equal(
      0,
      __axis.computeStart(size, target, offsets, areaSize, "align-end")
    );
  });

  it("NotEnoughSpaceEnd", function () {
    var size = 250;
    var target = {start: 300, end: 400};
    var offsets = {start: 10, end: 20};
    var areaSize = 500;

    assert.equal(
      30,
      __axis.computeStart(size, target, offsets, areaSize, "edge-start")
    );

    assert.equal(
      250,
      __axis.computeStart(size, target, offsets, areaSize, "edge-end")
    );

    assert.equal(
      250,
      __axis.computeStart(size, target, offsets, areaSize, "align-start")
    );

    assert.equal(
      210,
      __axis.computeStart(290, target, offsets, areaSize, "align-center")
    );

    assert.equal(
      130,
      __axis.computeStart(size, target, offsets, areaSize, "align-end")
    );
  });

  it("NotEnoughSpaceBothSides", function () {
    var size = 250;
    var target = {start: 50, end: 100};
    var offsets = {start: 10, end: 20};
    var areaSize = 150;

    assert.equal(
      -100,
      __axis.computeStart(size, target, offsets, areaSize, "edge-start")
    );

    assert.equal(
      0,
      __axis.computeStart(size, target, offsets, areaSize, "edge-end")
    );

    assert.equal(
      0,
      __axis.computeStart(size, target, offsets, areaSize, "align-start")
    );

    assert.equal(
      -100,
      __axis.computeStart(size, target, offsets, areaSize, "align-center")
    );

    assert.equal(
      -100,
      __axis.computeStart(size, target, offsets, areaSize, "align-end")
    );
  });
});

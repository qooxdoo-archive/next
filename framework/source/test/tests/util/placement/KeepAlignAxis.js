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

describe("util.placement.KeepAlignAxis", function () {
  beforeEach(function () {
    this.axis = qx.util.placement.KeepAlignAxis;
  });

  afterEach(function () {
    delete this.axis;
  });

  it("EnoughSpace", function () {
    var size = 50;
    var target = {start: 500, end: 600};
    var offsets = {start: 10, end: 20};
    var areaSize = 1000;

    assert.equal(
      430,
      this.axis.computeStart(size, target, offsets, areaSize, "edge-start")
    );

    assert.equal(
      610,
      this.axis.computeStart(size, target, offsets, areaSize, "edge-end")
    );

    assert.equal(
      510,
      this.axis.computeStart(size, target, offsets, areaSize, "align-start")
    );

    assert.equal(
      535,
      this.axis.computeStart(size, target, offsets, areaSize, "align-center")
    );

    assert.equal(
      530,
      this.axis.computeStart(size, target, offsets, areaSize, "align-end")
    );
  });

  it("NotEnoughSpaceStart", function () {
    var size = 260;
    var target = {start: 30, end: 200};
    var offsets = {start: 10, end: 20};
    var areaSize = 1000;

    assert.equal(
      210,
      this.axis.computeStart(size, target, offsets, areaSize, "edge-start")
    );

    assert.equal(
      210,
      this.axis.computeStart(size, target, offsets, areaSize, "edge-end")
    );

    assert.equal(
      40,
      this.axis.computeStart(size, target, offsets, areaSize, "align-start")
    );

    assert.equal(
      40,
      this.axis.computeStart(size, target, offsets, areaSize, "align-center")
    );

    assert.equal(
      40,
      this.axis.computeStart(size, target, offsets, areaSize, "align-end")
    );
  });

  it("NotEnoughSpaceEnd", function () {
    var size = 290;
    var target = {start: 300, end: 400};
    var offsets = {start: 10, end: 20};
    var areaSize = 500;

    assert.equal(
      -10,
      this.axis.computeStart(size, target, offsets, areaSize, "edge-start")
    );

    assert.equal(
      -10,
      this.axis.computeStart(size, target, offsets, areaSize, "edge-end")
    );

    assert.equal(
      90,
      this.axis.computeStart(size, target, offsets, areaSize, "align-start")
    );

    assert.equal(
      90,
      this.axis.computeStart(size, target, offsets, areaSize, "align-center")
    );

    assert.equal(
      90,
      this.axis.computeStart(size, target, offsets, areaSize, "align-end")
    );
  });

  it("NotEnoughSpaceBothSides", function () {
    var size = 250;
    var target = {start: 50, end: 100};
    var offsets = {start: 10, end: 20};
    var areaSize = 200;

    assert.equal(
      110,
      this.axis.computeStart(size, target, offsets, areaSize, "edge-start")
    );

    assert.equal(
      110,
      this.axis.computeStart(size, target, offsets, areaSize, "edge-end")
    );

    assert.equal(
      60,
      this.axis.computeStart(size, target, offsets, areaSize, "align-start")
    );

    assert.equal(
      60,
      this.axis.computeStart(size, target, offsets, areaSize, "align-center")
    );

    assert.equal(
      60,
      this.axis.computeStart(size, target, offsets, areaSize, "align-end")
    );
  });
});

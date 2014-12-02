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


describe("util.placement.Placement", function () {
  it("EnoughSpace", function () {
    var size = {width: 200, height: 300};
    var area = {width: 1000, height: 1000};
    var target = {left: 500, top: 500, right: 600, bottom: 550};
    var offsets = {top: 0, left: 0, bottom: 0, right: 0};

    var modes = ["direct", "keep-align", "best-fit"];
    for (var i = 0; i < modes.length; i++) {
      var mode = modes[i];

      assert.deepEqual(
        {left: 500, top: 200},
        qx.util.placement.Placement.compute(size, area, target, offsets, "top-left", mode, mode),
        mode
      );

      assert.deepEqual(
        {left: 450, top: 200},
        qx.util.placement.Placement.compute(size, area, target, offsets, "top-center", mode, mode),
        mode
      );

      assert.deepEqual(
        {left: 400, top: 200},
        qx.util.placement.Placement.compute(size, area, target, offsets, "top-right", mode, mode),
        mode
      );

      assert.deepEqual(
        {left: 500, top: 550},
        qx.util.placement.Placement.compute(size, area, target, offsets, "bottom-left", mode, mode),
        mode
      );

      assert.deepEqual(
        {left: 450, top: 550},
        qx.util.placement.Placement.compute(size, area, target, offsets, "bottom-center", mode, mode),
        mode
      );

      assert.deepEqual(
        {left: 400, top: 550},
        qx.util.placement.Placement.compute(size, area, target, offsets, "bottom-right", mode, mode),
        mode
      );

      assert.deepEqual(
        {left: 300, top: 500},
        qx.util.placement.Placement.compute(size, area, target, offsets, "left-top", mode, mode),
        mode
      );

      assert.deepEqual(
        {left: 300, top: 375},
        qx.util.placement.Placement.compute(size, area, target, offsets, "left-middle", mode, mode),
        mode
      );

      assert.deepEqual(
        {left: 300, top: 250},
        qx.util.placement.Placement.compute(size, area, target, offsets, "left-bottom", mode, mode),
        mode
      );

      assert.deepEqual(
        {left: 600, top: 500},
        qx.util.placement.Placement.compute(size, area, target, offsets, "right-top", mode, mode),
        mode
      );

      assert.deepEqual(
        {left: 600, top: 375},
        qx.util.placement.Placement.compute(size, area, target, offsets, "right-middle", mode, mode),
        mode
      );

      assert.deepEqual(
        {left: 600, top: 250},
        qx.util.placement.Placement.compute(size, area, target, offsets, "right-bottom", mode, mode),
        mode
      );
    }
  });

  it("RestrictedBottomKeepAlign", function () {
    var size = {width: 200, height: 300};
    var area = {width: 1000, height: 600};
    var target = {left: 500, top: 500, right: 600, bottom: 550};
    var offsets = {top: 0, left: 0, bottom: 0, right: 0};

    assert.deepEqual(
      {left: 500, top: 200},
      qx.util.placement.Placement.compute(size, area, target, offsets, "bottom-left", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 450, top: 200},
      qx.util.placement.Placement.compute(size, area, target, offsets, "bottom-center", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 400, top: 200},
      qx.util.placement.Placement.compute(size, area, target, offsets, "bottom-right", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 300, top: 250},
      qx.util.placement.Placement.compute(size, area, target, offsets, "left-top", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 300, top: 250},
      qx.util.placement.Placement.compute(size, area, target, offsets, "left-middle", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 600, top: 250},
      qx.util.placement.Placement.compute(size, area, target, offsets, "right-top", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 600, top: 250},
      qx.util.placement.Placement.compute(size, area, target, offsets, "right-middle", "keep-align", "keep-align")
    );
  });

  it("RestrictedTopKeepAlign", function () {
    var size = {width: 200, height: 300};
    var area = {width: 1000, height: 1000};
    var target = {left: 500, top: 100, right: 600, bottom: 150};
    var offsets = {top: 0, left: 0, bottom: 0, right: 0};

    assert.deepEqual(
      {left: 500, top: 150},
      qx.util.placement.Placement.compute(size, area, target, offsets, "top-left", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 450, top: 150},
      qx.util.placement.Placement.compute(size, area, target, offsets, "top-center", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 400, top: 150},
      qx.util.placement.Placement.compute(size, area, target, offsets, "top-right", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 300, top: 100},
      qx.util.placement.Placement.compute(size, area, target, offsets, "left-middle", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 300, top: 100},
      qx.util.placement.Placement.compute(size, area, target, offsets, "left-bottom", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 600, top: 100},
      qx.util.placement.Placement.compute(size, area, target, offsets, "right-middle", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 600, top: 100},
      qx.util.placement.Placement.compute(size, area, target, offsets, "right-bottom", "keep-align", "keep-align")
    );
  });

  it("RestrictedRightKeepAlign", function () {
    var size = {width: 200, height: 300};
    var area = {width: 700, height: 1000};
    var target = {left: 500, top: 500, right: 600, bottom: 550};
    var offsets = {top: 0, left: 0, bottom: 0, right: 0};

    assert.deepEqual(
      {left: 300, top: 500},
      qx.util.placement.Placement.compute(size, area, target, offsets, "right-top", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 300, top: 375},
      qx.util.placement.Placement.compute(size, area, target, offsets, "right-middle", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 300, top: 250},
      qx.util.placement.Placement.compute(size, area, target, offsets, "right-bottom", "keep-align", "keep-align")
    );
  });

  it("RestrictedLeftKeepAlign", function () {
    var size = {width: 200, height: 300};
    var area = {width: 1000, height: 1000};
    var target = {left: 100, top: 500, right: 200, bottom: 550};
    var offsets = {top: 0, left: 0, bottom: 0, right: 0};

    assert.deepEqual(
      {left: 200, top: 500},
      qx.util.placement.Placement.compute(size, area, target, offsets, "left-top", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 200, top: 375},
      qx.util.placement.Placement.compute(size, area, target, offsets, "left-middle", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 200, top: 250},
      qx.util.placement.Placement.compute(size, area, target, offsets, "left-bottom", "keep-align", "keep-align")
    );
  });

  it("RestrictedBottomAndTopWithBetterBottomKeepAlign", function () {
    var size = {width: 200, height: 300};
    var area = {width: 1000, height: 440};
    var target = {left: 500, top: 100, right: 600, bottom: 150};
    var offsets = {top: 10, bottom: 20, left: 0, right: 0};

    assert.deepEqual(
      {left: 500, top: 160},
      qx.util.placement.Placement.compute(size, area, target, offsets, "bottom-left", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 450, top: 160},
      qx.util.placement.Placement.compute(size, area, target, offsets, "bottom-center", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 500, top: 160},
      qx.util.placement.Placement.compute(size, area, target, offsets, "top-left", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 450, top: 160},
      qx.util.placement.Placement.compute(size, area, target, offsets, "top-center", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 600, top: 110},
      qx.util.placement.Placement.compute(size, area, target, offsets, "right-top", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 600, top: 110},
      qx.util.placement.Placement.compute(size, area, target, offsets, "right-middle", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 600, top: 110},
      qx.util.placement.Placement.compute(size, area, target, offsets, "right-bottom", "keep-align", "keep-align")
    );
  });

  it("RestrictedLeftAndRightWithBetterLeftKeepAlign", function () {
    var size = {width: 200, height: 300};
    var area = {width: 650, height: 1000};
    var target = {left: 500, top: 500, right: 600, bottom: 550};
    var offsets = {top: 0, bottom: 0, left: 10, right: 20};

    assert.deepEqual(
      {left: 280, top: 500},
      qx.util.placement.Placement.compute(size, area, target, offsets, "left-top", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 280, top: 375},
      qx.util.placement.Placement.compute(size, area, target, offsets, "left-middle", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 280, top: 500},
      qx.util.placement.Placement.compute(size, area, target, offsets, "right-top", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 280, top: 375},
      qx.util.placement.Placement.compute(size, area, target, offsets, "right-middle", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 380, top: 550},
      qx.util.placement.Placement.compute(size, area, target, offsets, "bottom-left", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 380, top: 550},
      qx.util.placement.Placement.compute(size, area, target, offsets, "bottom-center", "keep-align", "keep-align")
    );

    assert.deepEqual(
      {left: 380, top: 550},
      qx.util.placement.Placement.compute(size, area, target, offsets, "bottom-right", "keep-align", "keep-align")
    );
  });
});

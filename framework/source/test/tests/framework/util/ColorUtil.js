/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Jonathan Weiß (jonathan_rass)
     * Christian Hagendorn (cs)

 ************************************************************************ */

describe("util.ColorUtil", function () {
  it("RgbToRgbString", function () {
    sinon.spy()("rgba(255,0,0,1)", qx.util.ColorUtil.rgbToRgbString([255, 0, 0, 1]));
    sinon.spy()("rgba(255,0,0,0.5)", qx.util.ColorUtil.rgbToRgbString([255, 0, 0, 0.5]));
    sinon.spy()("rgba(255,0,0,0)", qx.util.ColorUtil.rgbToRgbString([255, 0, 0, 0]));
    sinon.spy()("rgb(255,0,0)", qx.util.ColorUtil.rgbToRgbString([255, 0, 0]));
  });


  it("CssStringToRgb", function () {
    sinon.spy()("255,0,0", qx.util.ColorUtil.cssStringToRgb("rgba(255,0,0,1)"));
    sinon.spy()("201,23,120", qx.util.ColorUtil.cssStringToRgb("rgba(201,23,120,0.3)"));

    sinon.spy()("255,0,0", qx.util.ColorUtil.cssStringToRgb("rgb(255,0,0)"));
    sinon.spy()("201,23,120", qx.util.ColorUtil.cssStringToRgb("rgb(201,23,120)"));
  });


  it("Hex3StringToHex6String", function () {
    sinon.spy()("#FFFFFF", qx.util.ColorUtil.hex3StringToHex6String("#fff"));
    sinon.spy()("#ffffff", qx.util.ColorUtil.hex3StringToHex6String("#ffffff"));
  });


  it("RgbToHexString", function () {
    sinon.spy()("#FFFFFF", qx.util.ColorUtil.rgbToHexString([255, 255, 255]));
    sinon.spy()("#000000", qx.util.ColorUtil.rgbToHexString([0, 0, 0]));
  });


  it("ValidColors", function () {
    var validColors = {
      "red": [255, 0, 0], //named
      "black": [0, 0, 0], //named
      "#FFF": [255, 255, 255], //hex3
      "#Ff1": [255, 255, 17], //hex3
      "#0101FF": [1, 1, 255], //hex6
      "rgb(123,11,1)": [123, 11, 1] //rgb
    };

    for (var color in validColors) {
      assert.deepEqual(validColors[color], qx.util.ColorUtil.stringToRgb(color));
    }
  });


  it("InvalidColors", function () {
    var invalidColors = [
      "blau",
      "1234",
      "#ff",
      "#ffff",
      "rgb(12,13)"
    ];

    for (var i = 0; i < invalidColors.length; i++) {
      assert.throws(
        function () {
          qx.util.ColorUtil.stringToRgb(invalidColors[i])
        },
        Error,
        "Could not parse color"
      );
    }

    assert.throws(
      function () {
        qx.util.ColorUtil.stringToRgb("inactivecaptiontext")
      },
      Error,
      "Could not convert system colors to RGB"
    );
  });

});

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

describe("util.ColorUtil", function() {
  it("RgbToRgbString", function() {
    sinonSandbox.spy()("rgba(255,0,0,1)", qx.util.ColorUtil.rgbToRgbString([255, 0, 0, 1]));
    sinonSandbox.spy()("rgba(255,0,0,0.5)", qx.util.ColorUtil.rgbToRgbString([255, 0, 0, 0.5]));
    sinonSandbox.spy()("rgba(255,0,0,0)", qx.util.ColorUtil.rgbToRgbString([255, 0, 0, 0]));
    sinonSandbox.spy()("rgb(255,0,0)", qx.util.ColorUtil.rgbToRgbString([255, 0, 0]));
  });


  it("CssStringToRgb", function() {
    sinonSandbox.spy()("255,0,0", qx.util.ColorUtil.cssStringToRgb("rgba(255,0,0,1)"));
    sinonSandbox.spy()("201,23,120", qx.util.ColorUtil.cssStringToRgb("rgba(201,23,120,0.3)"));

    sinonSandbox.spy()("255,0,0", qx.util.ColorUtil.cssStringToRgb("rgb(255,0,0)"));
    sinonSandbox.spy()("201,23,120", qx.util.ColorUtil.cssStringToRgb("rgb(201,23,120)"));
  });


  it("Hex3StringToHex6String", function() {
    sinonSandbox.spy()("#FFFFFF", qx.util.ColorUtil.hex3StringToHex6String("#fff"));
    sinonSandbox.spy()("#ffffff", qx.util.ColorUtil.hex3StringToHex6String("#ffffff"));
  });


  it("hex3StringToRgbError", function() {
    assert.throws(
      function() {
        qx.util.ColorUtil.hex3StringToRgb("#9999")
      },
      Error,
      "Invalid hex3 value: #9999"
    );
  });


  it("ValidColors", function() {
    var validColors = {
      "red": [255, 0, 0], //named
      "black": [0, 0, 0], //named
      "#FFF": [255, 255, 255], //hex3
      "#Ff1": [255, 255, 17], //hex3
      "#0101FF": [1, 1, 255], //hex6
      "rgb(123,11,1)": [123, 11, 1], //rgb
      "rgba(123,11,1,0)": [123, 11, 1], //rgba
      "rgba(0,0,0,0)": [-1, -1, -1]
    };

    for (var color in validColors) {
      assert.deepEqual(validColors[color], qx.util.ColorUtil.stringToRgb(color));
    }
  });


  it("InvalidColors", function() {
    var invalidColors = [
      "blau",
      "1234",
      "#ff",
      "#ffff",
      "rgb(12,13)"
    ];

    for (var i = 0; i < invalidColors.length; i++) {
      assert.throws(
        function() {
          qx.util.ColorUtil.stringToRgb(invalidColors[i])
        },
        Error,
        "Could not parse color"
      );
    }

    assert.throws(
      function() {
        qx.util.ColorUtil.stringToRgb("inactivecaptiontext")
      },
      Error,
      "Could not convert system colors to RGB"
    );
  });


  it("Hex3StringToRgbError", function() {
    assert.throws(
      function() {
        qx.util.ColorUtil.hex3StringToRgb("#9999")
      },
      Error,
      "Invalid hex3 value: #9999"
    );

  });


  it("Hex6StringToRgbError", function() {
    sinonSandbox.spy()([255, 255, 255], qx.util.ColorUtil.hex6StringToRgb("#ffffff"));

    assert.throws(
      function() {
        qx.util.ColorUtil.hex6StringToRgb("#ffff")
      },
      Error,
      "Invalid hex6 value: #ffff"
    );

  });


  it("RandomColor", function() {
    var s = qx.util.ColorUtil.randomColor();
    assert.isTrue(s.indexOf("rgb") === 0);
  });


  it("StringToRgb", function() {
    var col = qx.util.ColorUtil.stringToRgbString("red");
    assert.equal("rgb(255,0,0)", col);
  });


  it("RgbToHsb", function() {
    var col = qx.util.ColorUtil.rgbToHsb([255, 0, 0]);
    var col2 = qx.util.ColorUtil.rgbToHsb([0, 255, 0]);
    var col3 = qx.util.ColorUtil.rgbToHsb([0, 0, 255]);
    assert.deepEqual([0, 100, 100], col);
    assert.deepEqual([120, 100, 100], col2);
    assert.deepEqual([240, 100, 100], col3);
  });


  it("HexStringToRgb", function() {
    sinonSandbox.spy()([255, 255, 255], qx.util.ColorUtil.hexStringToRgb("#fff"));
    sinonSandbox.spy()([255, 255, 255], qx.util.ColorUtil.hexStringToRgb("#ffffff"));
    assert.throws(
      function() {
        qx.util.ColorUtil.hexStringToRgb("#ffwf")
      },
      Error,
      "Invalid hex value: #ffwf"
    );

  });


  it("HsbToRgb", function() {
    var col = qx.util.ColorUtil.hsbToRgb([0, 100, 100]);
    var col2 = qx.util.ColorUtil.hsbToRgb([120, 100, 100]);
    var col3 = qx.util.ColorUtil.hsbToRgb([240, 100, 100]);
    var col4 = qx.util.ColorUtil.hsbToRgb([700, 100, 100]);
    var col5 = qx.util.ColorUtil.hsbToRgb([700, 500, 100]);
    var col6 = qx.util.ColorUtil.hsbToRgb([700, 500, 700]);
    var col7 = qx.util.ColorUtil.hsbToRgb([700, 0, 700]);
    assert.deepEqual([255, 0, 0], col);
    assert.deepEqual([0, 255, 0], col2);
    assert.deepEqual([0, 0, 255], col3);
    assert.deepEqual([255, 0, 85], col4);
    assert.deepEqual([255, 0, 85], col5);
    assert.deepEqual([255, 0, 85], col6);
    assert.deepEqual([255, 255, 255], col7);
  });

});

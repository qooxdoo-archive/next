/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)

************************************************************************ */

describe("util.NumberFormat", function () {
  var __nf = null;
  var __oldLocale = null;

  sinon.stub(qx.locale.Number, "getGroupSeparator", function () {
    return ".";
  });
  sinon.stub(qx.locale.Number, "getDecimalSeparator", function () {
    return ",";
  });


  beforeEach(function () {
    assert.isDefined(qx.util.format.NumberFormat);

    __oldLocale = qx.locale.Manager.getInstance().locale;
    qx.locale.Manager.getInstance().locale = "de";

    __nf = new qx.util.format.NumberFormat();
  });

  afterEach(function () {
    qx.locale.Manager.getInstance().locale = __oldLocale;
  });


  it("NumberFormatConstructor", function () {
    var wrongArgs = [null, undefined, NaN, Infinity, 1, {}, [], true],
      correctArgs = ["de_DE"],
      nf, i, len;

    try {
      nf = new qx.util.format.NumberFormat();
    } catch (e) {
      this.fail("Failed on an empty arguments list");
    }

    try {
      nf = new qx.util.format.NumberFormat("de_DE", true);
      this.fail("Did not fail on wrong arguments number");
    } catch (e) {

    }

    for (i = 0, len = wrongArgs.length; i < len; i += 1) {
      try {
        nf = new qx.util.format.NumberFormat(wrongArgs[i]);
        this.fail("A wrong argument did not raise an error: " + wrongArgs[i]);
      } catch (e) {

      }
    }

    for (i = 0, len = correctArgs.length; i < len; i += 1) {
      try {
        nf = new qx.util.format.NumberFormat(correctArgs[i]);
      } catch (e) {
        this.fail("A correct argument did raise an error: " + correctArgs[i]);
      }
    }
  });


  it("NumberFormat", function () {
    var nf = __nf;

    // this failed due to a rounding error
    sinon.spy()("1.000.000", nf.format(1000000));

    sinon.spy()("-1.000.000", nf.format(-1000000));
    sinon.spy()("-1.000.000", nf.format(-1000000));

    sinon.spy()("0", nf.format(0));
    sinon.spy()("0", nf.format(-0));

    sinon.spy()("12,12", nf.format(12.12));

    var ninfinity = -1 / 0;
    sinon.spy()("-Infinity", nf.format(ninfinity));

    var infinity = 1 / 0;
    sinon.spy()("Infinity", nf.format(infinity));

    var nan = Math.sqrt(-1);
    sinon.spy()("NaN", nf.format(nan));
  });


  it("NumberParse", function () {
    var nf = __nf;

    var goodNumbers = {
      "1000": 1000,
      "-0,02": -0.02,
      "0,02": 0.02,
      ",02": 0.02,
      "-,02": -0.02,
      "+,02": 0.02,
      "-1.111.111,2": -1111111.2,
      "-1.000.000": -1000000,
      "+1.000,12": 1000.12
    };

    for (var number in goodNumbers) {
      if (goodNumbers.hasOwnProperty(number)) {
        assert.equal(
          nf.parse(number),
          goodNumbers[number]
        );
      }
    }

    var badNumberStrings = [
      "2hastalavista",
      "2.3.4.5.6",
      "12.10,10",
      "10,1,12"
    ];

    var badNumberStr;

    for (var i = 0; i < badNumberStrings.length; i++) {
      badNumberStr = badNumberStrings[i];

      assert.throws(
        function () {
          nf.format(nf.parse(badNumberStr));
        },
        Error,
        "does not match the number format",
          "testing if parsing fails on string '" + badNumberStr + "'"
      );
    }

  });


  /*
 @todo Resolve hard dependency to qx.locale.Number
  it("LocaleSwitch", function () {
    var nf = __nf;
    nf.minimumFractionDigits = 0;
    nf.maximumFractionDigits = 2;

    var numberStr = "0.5";

    assert.throws(
      function () {
        nf.parse(numberStr);
      },
      Error,
      "does not match the number format",
        "testing if parsing fails on string '" + numberStr + "'"
    );

    qx.locale.Manager.getInstance().locale = "en_US";

    sinon.spy()(0.5, nf.parse("0.5"),
      "parsing failed after locale change");
  });
 */


  it("NumberFormatChange", function () {
    var nf = __nf;
    nf.postfix = " %";

    var numberStr = "5 Percent";

    assert.throws(
      function () {
        nf.parse(numberStr);
      },
      Error,
      "does not match the number format",
        "testing if parsing fails on string '" + numberStr + "'"
    );

    nf.postfix = " Percent";
    sinon.spy()(5, nf.parse(numberStr),
      "parsing failed after number format change");
  });

});

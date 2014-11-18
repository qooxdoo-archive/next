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

describe("util.DateFormat", function () {
  // result contain an object with what should be expected, the result to test the date against
  var __dates = [
    {'date': new Date(2000, 2, 14), 'result': {}},
    {'date': new Date(2006, 2, 14), 'result': {}},
    {'date': new Date(2007, 3, 14), 'result': {}},
    {'date': new Date(2009, 10, 30), 'result': {}},
    {'date': new Date(2009, 8, 30), 'result': {}},
    {'date': new Date(2011, 3, 15), 'result': {}},
    {'date': new Date(2011, 3, 16), 'result': {}},
    {'date': new Date(2011, 3, 17), 'result': {}},
    {'date': new Date(2011, 0, 26), 'result': {'weekOfYear': 4}},
    {'date': new Date(2011, 0, 1), 'result': {'weekOfYear': 52}},
    {'date': new Date(2011, 0, 3), 'result': {'weekOfYear': 1}},
    {'date': new Date(2011, 0, 10), 'result': {'weekOfYear': 2}},
    {'date': new Date(2011, 9, 3), 'result': {'dayOfYear': 276, 'era': {'abbrev': 'AD', 'fullName': 'Anno Domini', 'narrow': 'A'}}},
    {'date': new Date(2011, 0, 4), 'result': {'dayOfYear': 4, 'dayOfWeek': 2}},
    {'date': new Date(2011, 0, 4), 'result': {'dayOfYear': 4, 'dayOfWeek': 2}},
    {'date': new Date(2011, 0, 4, 9, 9, 9), 'result': {'h_hour': 9, 'K_hour': 9, 'H_hour': 9, 'k_hour': 9}},
    {'date': new Date(2011, 0, 4, 14, 9, 9), 'result': {'h_hour': 2, 'K_hour': 2, 'H_hour': 14, 'k_hour': 14}},
    {'date': new Date(2011, 0, 4, 0, 9, 9), 'result': {'h_hour': 12, 'K_hour': 0, 'H_hour': 0, 'k_hour': 24}},
    {'date': new Date(2011, 0, 4, 12, 9, 9), 'result': {'h_hour': 12, 'K_hour': 0, 'H_hour': 12, 'k_hour': 12}},
    {'date': new Date(2010, 12, 4, 0, 0, 0), 'result': {'h_hour': 12, 'K_hour': 0, 'H_hour': 0, 'k_hour': 24}},
    {'date': new Date(-20, 10, 14), 'result': {'era': {'abbrev': 'BC', 'fullName': 'Before Christ', 'narrow': 'B'}}},
    {'date': new Date(2012, 4, 24, 11, 49, 57, 1), 'result': {}},
    {'date': new Date(2012, 4, 24, 11, 49, 57, 12), 'result': {}},
    {'date': new Date(2012, 4, 24, 11, 49, 57, 123), 'result': {}}
  ];


  var __fillNumber = function (number, minSize) {
    var str = "" + number;

    while (str.length < minSize) {
      str = "0" + str;
    }

    return str;
  };


  var __getExpectedYear = function (absYear, formattedSize, yearsign) {
    var expectedYear = absYear + "";
    if (expectedYear.length < formattedSize) {
      for (var j = expectedYear.length; j < formattedSize; j++) {
        expectedYear = "0" + expectedYear;
      }
    }
    return yearsign === "-" ? (yearsign + expectedYear) : expectedYear;
  };

  var __getMockedDateFormatParseFeed = function () {
    return {
      regex: new RegExp(/^(Sonntag|Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag) (\d\d?)\. (Jan|Feb|Mär|Apr|Mai|Jun|Jul|Aug|Sep|Okt|Nov|Dez) (-*\d\d\d\d+?)$/),
      usedRules: [
        {"pattern": "EEEE", "regex": "(Sonntag|Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag)"},
        {"pattern": "dd", "regex": "(\\d\\d?)", "field": "day"},
        {"pattern": "MMM", "regex": "(Jan|Feb|Mär|Apr|Mai|Jun|Jul|Aug|Sep|Okt|Nov|Dez)"},
        {"pattern": "y+", "regex": "(-*\\d\\d\\d\\d+?)"}
      ],
      patten: '^(Sonntag|Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag) (\d\d?)\. (Jan|Feb|Mär|Apr|Mai|Jun|Jul|Aug|Sep|Okt|Nov|Dez) (-*\d\d\d\d+?)$'
    };
  };

  var _testDateParse = function (date, formatString, locale) {
    var dateFmt = new qx.util.format.DateFormat(formatString, locale);
    dateFmt._parseFeed = __getMockedDateFormatParseFeed();

    var dateStr = dateFmt.format(date);
    var parsedDate = dateFmt.parse(dateStr);

    sinon.spy()(date.getFullYear(), parsedDate.getFullYear());
    sinon.spy()(date.getMonth(), parsedDate.getMonth());
    sinon.spy()(date.getDate(), parsedDate.getDate());
    sinon.spy()(date.getDay(), parsedDate.getDay());

    if (formatString.indexOf(":") > 0) {
      sinon.spy()(date.getHours(), parsedDate.getHours());
      sinon.spy()(date.getMinutes(), parsedDate.getMinutes());
    }

    dateFmt.dispose();
  };


  var _testIsoMasks = function (date, isoFormat, dateFormat) {
    var isodf = new qx.util.format.DateFormat(isoFormat);
    var df = new qx.util.format.DateFormat(dateFormat);
    var isoDateFormatted = isodf.format(date);
    var dateFormatted = df.format(date);
    sinon.spy()(isoDateFormatted, dateFormatted);
    sinon.spy()(isodf.parse(isoDateFormatted).getTime(), df.parse(dateFormatted).getTime());
    isodf.dispose();
    df.dispose();
  };


  /*
  @todo Resolve hard dependency to qx.locale.Date
  it("DateParse", function () {
    for (var i = 0; i < __dates.length; i++) {
      var date = __dates[i].date;
      _testDateParse(date, "EEEE dd. MMM yyyy", "de_DE");
      _testDateParse(date, "yyyyyyyyyddMM", "de_DE");
      _testDateParse(date, "yMMdd", "de_DE");
      _testDateParse(date, "EEE dd. MM yyyy", "de_DE");
      _testDateParse(date, "EE dd. M yyyy", "de_DE");
    }
  });
  */


  it("InvalidDate", function () {
    var invalidDate = new Date("2011-11-32");
    var dateFmt = new qx.util.format.DateFormat();
    assert.isNull(dateFmt.format(invalidDate));
    dateFmt.dispose();
  });


  /*
 @todo Resolve hard dependency to qx.locale.Date
  it("WeeksInDateParsing", function () {
    var dateFormat,
      testDate,
      parsedDate;

    dateFormat = new qx.util.format.DateFormat("EEEE d MMMM yyyy ww");
    dateFormat._parseFeed = __getMockedDateFormatParseFeed();

    testDate = (new Date(2014, 0, 1)).getTime();
    parsedDate = dateFormat.parse("Wednesday 1 January 2014 01");
    this.strictEqual(testDate, parsedDate.getTime(), "ww - 01, should have been parsed");

    try {
      parsedDate = dateFormat.parse("Wednesday 1 January 2014 1");
    } catch (e) {
      parsedDate = new Date();
    }

    this.notStrictEqual(testDate, parsedDate.getTime(), "ww - 1, should not have been parsed");

    try {
      parsedDate = dateFormat.parse("Wednesday 1 January 2014 ");
    } catch (e) {
      parsedDate = new Date();
    }

    this.notStrictEqual(testDate, parsedDate.getTime(), "ww - '', should not have been parsed");

    testDate = (new Date(2014, 4, 6)).getTime();
    parsedDate = dateFormat.parse("Tuesday 6 May 2014 19");
    this.strictEqual(testDate, parsedDate.getTime(), "ww - 19, should have been parsed");

    dateFormat = new qx.util.format.DateFormat("EEEE d MMMM yyyy w");
    parsedDate = dateFormat.parse("Tuesday 6 May 2014 19");
    this.strictEqual(testDate, parsedDate.getTime(), "w - 19, should have been parsed");

    testDate = (new Date(2014, 0, 1)).getTime();
    parsedDate = dateFormat.parse("Wednesday 1 January 2014 01");
    this.strictEqual(testDate, parsedDate.getTime(), "w - 01, should have been parsed");

    parsedDate = dateFormat.parse("Wednesday 1 January 2014 1");
    this.strictEqual(testDate, parsedDate.getTime(), "w - 1, should have been parsed");

    try {
      parsedDate = dateFormat.parse("Wednesday 1 January 2014 ");
    } catch (e) {
      parsedDate = new Date();
    }

    this.notStrictEqual(testDate, parsedDate.getTime(), "w - '', should not have been parsed");
  });
  */


  it("TimeZone", function () {
    var date = new qx.test.util.DateMock({timezoneOffset: -60, time: 1316000836451});

    var formatStr = "z";
    var dateFmt = new qx.util.format.DateFormat(formatStr, "de_DE");

    sinon.spy()("GMT+01:00", dateFmt.format(date));

    date = new qx.test.util.DateMock({timezoneOffset: 60, time: 1316000836451});
    sinon.spy()("GMT-01:00", dateFmt.format(date));

    date = new qx.test.util.DateMock({timezoneOffset: -90, time: 1316000836451});
    sinon.spy()("GMT+01:30", dateFmt.format(date));

    date = new qx.test.util.DateMock({timezoneOffset: 90, time: 1316000836451});
    sinon.spy()("GMT-01:30", dateFmt.format(date));

    dateFmt.dispose();
  });


  /*
   @todo Resolve hard dependency to qx.locale.Date
  it("LocalizedDates", function () {
    for (var i = 0; i < __dates.length; i++) {
      var date = __dates[i].date;

      var formatStr = qx.locale.Date.getDateFormat("short", "fr_FR");
      _testDateParse(date, formatStr, "fr_FR");

      formatStr = qx.locale.Date.getDateFormat("medium", "fr_FR");
      _testDateParse(date, formatStr, "fr_FR");

      formatStr = qx.locale.Date.getDateFormat("long", "fr_FR");
      _testDateParse(date, formatStr, "fr_FR");

      formatStr = qx.locale.Date.getDateFormat("full", "fr_FR");
      _testDateParse(date, formatStr, "fr_FR");

      formatStr = qx.locale.Date.getDateFormat("short", "de_DE");
      _testDateParse(date, formatStr, "de_DE");

      formatStr = qx.locale.Date.getDateFormat("medium", "de_DE");
      _testDateParse(date, formatStr, "de_DE");

      formatStr = qx.locale.Date.getDateFormat("long", "de_DE");
      _testDateParse(date, formatStr, "de_DE");

      formatStr = qx.locale.Date.getDateFormat("full", "de_DE");
      _testDateParse(date, formatStr, "de_DE");
    }
  });
  */


  it("Pattern_y_", function () {
    var df;

    for (var i = 0; i < __dates.length; i++) {
      var date = __dates[i].date;
      var yearsign = date.getFullYear() > 0 ? '+' : '-';
      var absYear = "" + Math.abs(date.getFullYear());
      var fullYear = date.getFullYear() + '';
      var lastTwoDigitsYear = fullYear.substring(absYear.length - 2);

      df = new qx.util.format.DateFormat("yyyy");
      var expectedYear = __getExpectedYear(absYear, 4, yearsign);
      sinon.spy()(expectedYear, df.format(date));
      var parsedDate = df.parse(df.format(date));
      sinon.spy()(date.getFullYear(), parsedDate.getFullYear());
      df.dispose();

      // case y
      df = new qx.util.format.DateFormat("y");
      sinon.spy()(fullYear, df.format(date));
      df.dispose();

      // case yy
      df = new qx.util.format.DateFormat("yy");
      sinon.spy()(lastTwoDigitsYear, df.format(date));
      df.dispose();

      // case yyy
      df = new qx.util.format.DateFormat("yyy");
      expectedYear = __getExpectedYear(absYear, 3, yearsign);
      sinon.spy()(expectedYear, df.format(date));
      df.dispose();

      // case yyyy
      df = new qx.util.format.DateFormat("yyyy");
      expectedYear = __getExpectedYear(absYear, 4, yearsign);
      sinon.spy()(expectedYear, df.format(date));
      df.dispose();

      // case yyyyy
      df = new qx.util.format.DateFormat("yyyyy");
      expectedYear = __getExpectedYear(absYear, 5, yearsign);
      sinon.spy()(expectedYear, df.format(date));
      df.dispose();

      // case yyyyy
      df = new qx.util.format.DateFormat("yyyyyyyyyyy");
      expectedYear = __getExpectedYear(absYear, 11, yearsign);
      sinon.spy()(expectedYear, df.format(date));
      df.dispose();
    }
  });


  it("Pattern_M_", function () {
    var df;
    var locale = qx.locale.Manager.getInstance().locale;
    for (var i = 0; i < __dates.length; i++) {
      var date = __dates[i].date;
      var absYear = "" + Math.abs(date.getFullYear());
      var yearsign = date.getFullYear() > 0 ? '+' : '-';
      var expectedYear = __getExpectedYear(absYear, 4, yearsign);
      var month = date.getMonth();
      var realMonth = (month + 1) + "";

      df = new qx.util.format.DateFormat("yyyy/MM");
      sinon.spy()(expectedYear + "/" + __fillNumber(realMonth, 2), df.format(date));
      df.dispose();
      df = new qx.util.format.DateFormat("yyyy/M");
      sinon.spy()(expectedYear + "/" + realMonth, df.format(date));
      df.dispose();
      df = new qx.util.format.DateFormat("yyyy/MMM");
      sinon.spy()(expectedYear + "/" + qx.locale.Date.getMonthName("abbreviated", month, locale, "format", true), df.format(date));
      df.dispose();
      df = new qx.util.format.DateFormat("yyyy/MMMM");
      sinon.spy()(expectedYear + "/" + qx.locale.Date.getMonthName("wide", month, locale, "format", true), df.format(date));
      df.dispose();
      df = new qx.util.format.DateFormat("yyyy/MMMMM");
      sinon.spy()(expectedYear + "/" + qx.locale.Date.getMonthName("narrow", month, locale, "format", true), df.format(date));
      df.dispose();
    }
  });


  it("Pattern_L_", function () {
    var df;
    var locale = qx.locale.Manager.getInstance().locale;
    for (var i = 0; i < __dates.length; i++) {
      var date = __dates[i].date;
      var month = date.getMonth();
      var realMonth = (month + 1) + "";

      df = new qx.util.format.DateFormat("LL");
      sinon.spy()(__fillNumber(realMonth, 2), df.format(date));
      df.dispose();
      df = new qx.util.format.DateFormat("L");
      sinon.spy()(realMonth, df.format(date));
      df.dispose();
      df = new qx.util.format.DateFormat("LLL");
      sinon.spy()(qx.locale.Date.getMonthName("abbreviated", month, locale, "stand-alone", true), df.format(date));
      df.dispose();
      df = new qx.util.format.DateFormat("LLLL");
      sinon.spy()(qx.locale.Date.getMonthName("wide", month, locale, "stand-alone", true), df.format(date));
      df.dispose();
      df = new qx.util.format.DateFormat("LLLLL");
      sinon.spy()(qx.locale.Date.getMonthName("narrow", month, locale, "stand-alone", true), df.format(date));
      df.dispose();
    }
  });


  it("Pattern_w_", function () {
    var df;
    for (var i = 0; i < __dates.length; i++) {
      if (__dates[i].result.weekOfYear) {
        var date = __dates[i].date;
        var weekOfYear = __dates[i].result.weekOfYear + "";

        df = new qx.util.format.DateFormat("w");
        sinon.spy()(weekOfYear, df.format(date));
        df.dispose();

        df = new qx.util.format.DateFormat("ww");
        sinon.spy()(__fillNumber(weekOfYear, 2), df.format(date));
        df.dispose();
      }
    }
  });


  it("Pattern_d_", function () {
    var df;
    for (var i = 0; i < __dates.length; i++) {
      var date = __dates[i].date;
      var dayOfMonth = date.getDate();

      df = new qx.util.format.DateFormat("d");
      sinon.spy()(dayOfMonth + "", df.format(date));
      df.dispose();
      df = new qx.util.format.DateFormat("dd");
      sinon.spy()(__fillNumber(dayOfMonth, 2), df.format(date));
      df.dispose();
    }
  });


  it("Pattern_D_", function () {
    var df, dateStr;
    for (var i = 0; i < __dates.length; i++) {
      var date = __dates[i].date;
      if (__dates[i].result.dayOfYear) {
        var dayOfYear = __dates[i].result.dayOfYear + "";

        df = new qx.util.format.DateFormat("D");
        sinon.spy()(dayOfYear, df.format(date));
        df.dispose();

        df = new qx.util.format.DateFormat("DD");
        sinon.spy()(__fillNumber(dayOfYear, 2), df.format(date));
        df.dispose();

        df = new qx.util.format.DateFormat("DDD");
        sinon.spy()(__fillNumber(dayOfYear, 3), df.format(date));
        df.dispose();
      }

      var dateFmt = new qx.util.format.DateFormat("MM / yyy / DDD");
      dateStr = dateFmt.format(date);

      var parsedDate = dateFmt.parse(dateStr);
      sinon.spy()(date.getFullYear(), parsedDate.getFullYear());
      sinon.spy()(date.getMonth(), parsedDate.getMonth());
      sinon.spy()(date.getDate(), parsedDate.getDate());
      sinon.spy()(date.getDay(), parsedDate.getDay());
      dateFmt.dispose();
    }

  });


  it("Pattern_E_", function () {
    var df;
    var locale = qx.locale.Manager.getInstance().locale;

    for (var i = 0; i < __dates.length; i++) {
      if (__dates[i].result.dayOfWeek) {
        var date = __dates[i].date;
        var fullYear = "" + date.getFullYear();
        var dayOfWeek = __dates[i].result.dayOfWeek;

        df = new qx.util.format.DateFormat("yyyy/E");
        sinon.spy()(fullYear + "/" + qx.locale.Date.getDayName("abbreviated", dayOfWeek, locale, "format", true), df.format(date));
        df.dispose();
        df = new qx.util.format.DateFormat("yyyy/EE");
        sinon.spy()(fullYear + "/" + qx.locale.Date.getDayName("abbreviated", dayOfWeek, locale, "format", true), df.format(date));
        df.dispose();
        df = new qx.util.format.DateFormat("yyyy/EEE");
        sinon.spy()(fullYear + "/" + qx.locale.Date.getDayName("abbreviated", dayOfWeek, locale, "format", true), df.format(date));
        df.dispose();
        df = new qx.util.format.DateFormat("yyyy/EEEE");
        sinon.spy()(fullYear + "/" + qx.locale.Date.getDayName("wide", dayOfWeek, locale, "format", true), df.format(date));
        df.dispose();
        df = new qx.util.format.DateFormat("yyyy/EEEEE");
        sinon.spy()(fullYear + "/" + qx.locale.Date.getDayName("narrow", dayOfWeek, locale, "format", true), df.format(date));
        df.dispose();
      }
    }

  });


  it("Pattern_c_", function () {
    var df;
    var locale = qx.locale.Manager.getInstance().locale;
    var locales = [locale, "en_US", "ro_RO", "de_DE", "fr_FR"];
    for (var k = 0; k < locales.length; k++) {
      qx.locale.Manager.getInstance().locale = locales[k];
      for (var i = 0; i < __dates.length; i++) {
        var date = __dates[i].date;
        var dayOfWeek = date.getDay();
        var startOfWeek = qx.locale.Date.getWeekStart(locales[k]);
        var expectedDayOfWeek = 1 + ((dayOfWeek - startOfWeek >= 0) ? (dayOfWeek - startOfWeek) : 7 + (dayOfWeek - startOfWeek));

        df = new qx.util.format.DateFormat("c", locales[k]);
        sinon.spy()(expectedDayOfWeek + "", df.format(date));
        df.dispose();

        df = new qx.util.format.DateFormat("ccc", locales[k]);
        sinon.spy()(qx.locale.Date.getDayName("abbreviated", dayOfWeek, locales[k], "stand-alone", true), df.format(date));
        df.dispose();

        df = new qx.util.format.DateFormat("cccc", locales[k]);
        sinon.spy()(qx.locale.Date.getDayName("wide", dayOfWeek, locales[k], "stand-alone", true), df.format(date));
        df.dispose();

        df = new qx.util.format.DateFormat("ccccc", locales[k]);
        sinon.spy()(qx.locale.Date.getDayName("narrow", dayOfWeek, locales[k], "stand-alone", true), df.format(date));
        df.dispose();
      }
    }
    qx.locale.Manager.getInstance().locale = locale;
  });


  it("Pattern_e_", function () {
    var df;
    var locale = qx.locale.Manager.getInstance().locale;
    for (var i = 0; i < __dates.length; i++) {
      var date = __dates[i].date;
      var dayOfWeek = date.getDay();
      var startOfWeek = qx.locale.Date.getWeekStart(locale);
      var expectedDayOfWeek = 1 + ((dayOfWeek - startOfWeek >= 0) ? (dayOfWeek - startOfWeek) : 7 + (dayOfWeek - startOfWeek));

      df = new qx.util.format.DateFormat("e");
      sinon.spy()(expectedDayOfWeek + "", df.format(date));
      df.dispose();

      df = new qx.util.format.DateFormat("ee");
      sinon.spy()("0" + expectedDayOfWeek, df.format(date));
      df.dispose();

      df = new qx.util.format.DateFormat("eee");
      sinon.spy()(qx.locale.Date.getDayName("abbreviated", dayOfWeek, locale, "format", true), df.format(date));
      df.dispose();

      df = new qx.util.format.DateFormat("eeee");
      sinon.spy()(qx.locale.Date.getDayName("wide", dayOfWeek, locale, "format", true), df.format(date));
      df.dispose();

      df = new qx.util.format.DateFormat("eeeee");
      sinon.spy()(qx.locale.Date.getDayName("narrow", dayOfWeek, locale, "format", true), df.format(date));
      df.dispose();
    }
  });


  it("Pattern_e_parse", function () {
    var df, parsedDate;
    var locale = qx.locale.Manager.getInstance().locale;
    for (var i = 0; i < __dates.length; i++) {
      var date = __dates[i].date;
      var dayOfWeek = date.getDay();

      df = new qx.util.format.DateFormat("e-yyyy-MM-dd");
      parsedDate = df.parse(df.format(date));
      sinon.spy()(dayOfWeek, parsedDate.getDay());
      df.dispose();

      df = new qx.util.format.DateFormat("ee-yyyy-MM-dd");
      parsedDate = df.parse(df.format(date));
      sinon.spy()(dayOfWeek, parsedDate.getDay());
      df.dispose();

      df = new qx.util.format.DateFormat("eee-yyyy-MM-dd");
      parsedDate = df.parse(df.format(date));
      sinon.spy()(dayOfWeek, parsedDate.getDay());
      df.dispose();

      df = new qx.util.format.DateFormat("eeee-yyyy-MM-dd");
      parsedDate = df.parse(df.format(date));
      sinon.spy()(dayOfWeek, parsedDate.getDay());
      df.dispose();

      df = new qx.util.format.DateFormat("eeeee-yyyy-MM-dd");
      parsedDate = df.parse(df.format(date));
      sinon.spy()(dayOfWeek, parsedDate.getDay());
      df.dispose();
    }
  });


  it("Pattern_a_", function () {
    var df;
    var locale = qx.locale.Manager.getInstance().locale;
    for (var i = 0; i < __dates.length; i++) {
      var date = __dates[i].date;
      var hour = date.getHours();
      df = new qx.util.format.DateFormat("a", locale);
      sinon.spy()(hour < 12 ? qx.locale.Date.getAmMarker(locale).toString() : qx.locale.Date.getPmMarker(locale).toString(), df.format(date));
      df.dispose();
    }
  });


  it("Pattern_h_", function () {
    var df;
    for (var i = 0; i < __dates.length; i++) {
      if (__dates[i].result.h_hour) {
        var date = __dates[i].date;
        var hour = __dates[i].result.h_hour;

        df = new qx.util.format.DateFormat("h");
        sinon.spy()(hour + "", df.format(date));
        df.dispose();

        df = new qx.util.format.DateFormat("hh");
        sinon.spy()(__fillNumber(hour, 2), df.format(date));
        df.dispose();
      }
    }
  });


  it("Pattern_H_", function () {
    var df;
    for (var i = 0; i < __dates.length; i++) {
      if (__dates[i].result.H_hour) {
        var date = __dates[i].date;
        var hour = __dates[i].result.H_hour;

        df = new qx.util.format.DateFormat("H");
        sinon.spy()(hour + "", df.format(date));
        df.dispose();

        df = new qx.util.format.DateFormat("HH");
        sinon.spy()(__fillNumber(hour, 2), df.format(date));
        df.dispose();
      }
    }
  });


  it("Pattern_k_", function () {
    var df;
    for (var i = 0; i < __dates.length; i++) {
      if (__dates[i].result.k_hour) {
        var date = __dates[i].date;
        var hour = __dates[i].result.k_hour;

        df = new qx.util.format.DateFormat("k");
        sinon.spy()(hour + "", df.format(date));
        df.dispose();

        df = new qx.util.format.DateFormat("kk");
        sinon.spy()(__fillNumber(hour, 2), df.format(date));
        df.dispose();
      }
    }
  });


  it("Pattern_K_", function () {
    var df;
    for (var i = 0; i < __dates.length; i++) {
      if (__dates[i].result.K_hour) {
        var date = __dates[i].date;
        var hour = __dates[i].result.K_hour;

        df = new qx.util.format.DateFormat("K");
        sinon.spy()(hour + "", df.format(date));
        df.dispose();

        df = new qx.util.format.DateFormat("KK");
        sinon.spy()(__fillNumber(hour, 2), df.format(date));
        df.dispose();
      }
    }
  });


  it("Pattern_m_", function () {
    var df;
    for (var i = 0; i < __dates.length; i++) {
      var date = __dates[i].date;
      var min = date.getMinutes();

      df = new qx.util.format.DateFormat("m");
      sinon.spy()(min + "", df.format(date));
      df.dispose();

      df = new qx.util.format.DateFormat("mm");
      sinon.spy()(__fillNumber(min, 2), df.format(date));
      df.dispose();
    }
  });


  it("Pattern_s_", function () {
    var df;
    for (var i = 0; i < __dates.length; i++) {
      var date = __dates[i].date;
      var sec = date.getSeconds();

      df = new qx.util.format.DateFormat("s");
      sinon.spy()(sec + "", df.format(date));
      df.dispose();

      df = new qx.util.format.DateFormat("ss");
      sinon.spy()(__fillNumber(sec, 2), df.format(date));
      df.dispose();
    }
  });


  it("Pattern_S_", function () {
    var df;
    for (var i = 0; i < __dates.length; i++) {
      var date = __dates[i].date;
      // pad milliseconds to become a fraction of second
      var msec = __fillNumber(date.getMilliseconds(), 3);

      df = new qx.util.format.DateFormat("S");
      sinon.spy()(msec.substring(0, 1), df.format(date));
      df.dispose();

      df = new qx.util.format.DateFormat("SS");
      sinon.spy()(msec.substring(0, 2), df.format(date));
      df.dispose();

      df = new qx.util.format.DateFormat("SSS");
      sinon.spy()(msec.substring(0, 3), df.format(date));
      df.dispose();

      // check that remaining format specification is padded with zeros
      df = new qx.util.format.DateFormat("SSSS");
      sinon.spy()(msec.substring(0, 3) + "0", df.format(date));
      df.dispose();
    }
  });


  // z and Z can be tested when knowing the timezoneoffset of the machines the test will run on
  // here it is EET
  it("Pattern_z_", function () {
    var df;
    for (var i = 0; i < __dates.length; i++) {
      var date = __dates[i].date;

      var timezoneOffset = date.getTimezoneOffset();
      var timezoneSign = timezoneOffset > 0 ? 1 : -1;
      var timezoneHours = Math.floor(Math.abs(timezoneOffset) / 60);
      var timezoneMinutes = Math.abs(timezoneOffset) % 60;

      var localTimeZone = "GMT" + ((timezoneSign > 0) ? "-" : "+") + __fillNumber(Math.abs(timezoneHours), 2) + ":" + __fillNumber(timezoneMinutes, 2);

      df = new qx.util.format.DateFormat("z");
      sinon.spy()(localTimeZone, df.format(date));
      df.dispose();

      df = new qx.util.format.DateFormat("zz");
      sinon.spy()(localTimeZone, df.format(date));
      df.dispose();

      df = new qx.util.format.DateFormat("zzz");
      sinon.spy()(localTimeZone, df.format(date));
      df.dispose();
    }
  });


  it("Pattern_G_", function () {
    var df;
    for (var i = 0; i < __dates.length; i++) {
      if (__dates[i].result.era) {
        var date = __dates[i].date;
        var era = __dates[i].result.era;

        df = new qx.util.format.DateFormat("G");
        sinon.spy()(era.abbrev, df.format(date));
        df.dispose();

        df = new qx.util.format.DateFormat("yyyy MM dd G");
        var dateFormatted = df.format(date);
        var parsedDate = df.parse(dateFormatted);
        sinon.spy()(date.getFullYear(), parsedDate.getFullYear());
        sinon.spy()(date.getMonth(), parsedDate.getMonth());
        sinon.spy()(date.getDate(), parsedDate.getDate());
        sinon.spy()(date.getDay(), parsedDate.getDay());
        df.dispose();
      }
    }
  });


  it("IsoMasks", function () {
    for (var i = 0; i < __dates.length; i++) {
      var date = __dates[i].date;
      _testIsoMasks(date, 'isoDate', 'yyyy-MM-dd');
      _testIsoMasks(date, 'isoTime', 'HH:mm:ss');
      _testIsoMasks(date, 'isoDateTime', "yyyy-MM-dd'T'HH:mm:ss");
    }
  });


  it("ChangingLocales", function () {
    var manager = qx.locale.Manager.getInstance();
    manager.locale = 'en_US';

    var df = new qx.util.format.DateFormat("EEEE yyyy-mm-dd");
    var dfFR = new qx.util.format.DateFormat("EEEE yyyy-mm-dd", "fr_FR");
    var dfDE = new qx.util.format.DateFormat("EEEE yyyy-mm-dd", "de_DE");
    var dfUS = new qx.util.format.DateFormat("EEEE yyyy-mm-dd", "en_US");
    var d = new Date();

    sinon.spy()(df.format(d), dfUS.format(d));

    manager.locale = 'fr_FR';
    sinon.spy()(df.format(d), dfFR.format(d));
    manager.locale = 'de_DE';
    sinon.spy()(df.format(d), dfDE.format(d));

    manager.locale = null;
    sinon.spy()(df.format(d), dfUS.format(d));

    manager.locale = 'fr_FR';
    sinon.spy()(df.format(d), dfFR.format(d));

    df.locale = null;
    sinon.spy()(df.format(d), dfUS.format(d));

    dfFR.locale = 'de_DE';
    sinon.spy()(dfFR.format(d), dfDE.format(d));

    dfFR.locale = null;

    df.dispose();
    dfFR.dispose();
    dfDE.dispose();
    dfUS.dispose();
  });

});

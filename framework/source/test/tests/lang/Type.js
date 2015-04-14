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

describe("lang.Type", function() {

  it("IsString", function() {
    var Type = qx.lang.Type;

    assert.isTrue(Type.isString(""));
    assert.isTrue(Type.isString("Juhu"));
    assert.isTrue(Type.isString(new String("Juhu")));
    if (qx.type.BaseString) {
      assert.isTrue(Type.isString(new qx.type.BaseString("juhu")));
    }

    assert.isFalse(Type.isString());
    assert.isFalse(Type.isString(function() {}));
    assert.isFalse(Type.isString(null));
    assert.isFalse(Type.isString(2));
    assert.isFalse(Type.isString({}));
    assert.isFalse(Type.isString([]));
    assert.isFalse(Type.isString(/juhu/));

    // test IE issue with a null returned from DOM
    assert.isFalse(Type.isString(document.getElementById("ReturnedNull")));
  });


  it("IsArray", function() {
    var Type = qx.lang.Type;

    assert.isTrue(Type.isArray([]));
    assert.isTrue(Type.isArray(new Array()));
    assert.isTrue(Type.isArray(new qx.type.BaseArray()));

    assert.isFalse(Type.isArray());
    assert.isFalse(Type.isArray(function() {}));
    assert.isFalse(Type.isArray(""));
    assert.isFalse(Type.isArray(null));
    assert.isFalse(Type.isArray(2));
    assert.isFalse(Type.isArray({}));
    assert.isFalse(Type.isArray(true));
    assert.isFalse(Type.isArray(/juhu/));

    // test IE issue with a null returned from DOM
    assert.isFalse(Type.isArray(document.getElementById("ReturenedNull")));
  });


  it("IsObject", function() {
    var Type = qx.lang.Type;

    assert.isTrue(Type.isObject({}));
    assert.isTrue(Type.isObject(new Object()));

    assert.isFalse(Type.isObject(), "undefined is not an object");
    assert.isFalse(Type.isObject(function() {}), "function is not an object");
    assert.isFalse(Type.isObject(""), "string is not an object");
    assert.isFalse(Type.isObject(null), "null is not an object");
    assert.isFalse(Type.isObject(undefined), "undefined is not an object");
    assert.isFalse(Type.isObject(2), "number is not an object");
    assert.isFalse(Type.isObject([]), "array is not an object");
    assert.isFalse(Type.isObject(true), "boolean is not an object");
    assert.isFalse(Type.isObject(/juhu/), "regexp is not an object");

    // test IE issue with a null returned from DOM
    assert.isFalse(Type.isObject(document.getElementById("ReturenedNull")));
  });


  it("IsRegExp", function() {
    var Type = qx.lang.Type;

    assert.isTrue(Type.isRegExp(/juhu/));
    assert.isTrue(Type.isRegExp(new RegExp()));

    assert.isFalse(Type.isRegExp());
    assert.isFalse(Type.isRegExp(function() {}));
    assert.isFalse(Type.isRegExp(""));
    assert.isFalse(Type.isRegExp(null));
    assert.isFalse(Type.isRegExp(2));
    assert.isFalse(Type.isRegExp([]));
    assert.isFalse(Type.isRegExp(true));
    assert.isFalse(Type.isRegExp({}));

    // test IE issue with a null returned from DOM
    assert.isFalse(Type.isRegExp(document.getElementById("ReturenedNull")));
  });


  it("IsNumber", function() {
    var Type = qx.lang.Type;

    assert.isTrue(Type.isNumber(1));
    assert.isTrue(Type.isNumber(1.1));
    assert.isTrue(Type.isNumber(new Number(1)));
    assert.isTrue(Type.isNumber(0));

    assert.isFalse(Type.isNumber());
    assert.isFalse(Type.isNumber(function() {}));
    assert.isFalse(Type.isNumber(""));
    assert.isFalse(Type.isNumber(null));
    assert.isFalse(Type.isNumber(/g/));
    assert.isFalse(Type.isNumber([]));
    assert.isFalse(Type.isNumber(true));
    assert.isFalse(Type.isNumber({}));

    // test IE issue with a null returned from DOM
    assert.isFalse(Type.isNumber(document.getElementById("ReturenedNull")));
  });


  it("IsBoolean", function() {
    var Type = qx.lang.Type;

    assert.isTrue(Type.isBoolean(true));
    assert.isTrue(Type.isBoolean(false));
    assert.isTrue(Type.isBoolean(new Boolean()));

    assert.isFalse(Type.isBoolean());
    assert.isFalse(Type.isBoolean(function() {}));
    assert.isFalse(Type.isBoolean(""));
    assert.isFalse(Type.isBoolean(null));
    assert.isFalse(Type.isBoolean(/g/));
    assert.isFalse(Type.isBoolean([]));
    assert.isFalse(Type.isBoolean(2));
    assert.isFalse(Type.isBoolean({}));

    // test IE issue with a null returned from DOM
    assert.isFalse(Type.isBoolean(document.getElementById("ReturenedNull")));
  });


  it("IsFunction", function() {
    var Type = qx.lang.Type;

    assert.isTrue(Type.isFunction(function() {}));
    assert.isTrue(Type.isFunction(arguments.callee));
    assert.isTrue(Type.isFunction(Object));

    assert.isFalse(Type.isFunction());
    assert.isFalse(Type.isFunction(true));
    assert.isFalse(Type.isFunction(""));
    assert.isFalse(Type.isFunction(null));
    assert.isFalse(Type.isFunction(/g/));
    assert.isFalse(Type.isFunction([]));
    assert.isFalse(Type.isFunction(2));
    assert.isFalse(Type.isFunction({}));

    // test IE issue with a null returned from DOM
    assert.isFalse(Type.isFunction(document.getElementById("ReturenedNull")));
  });


  it("IsDate", function() {
    var Type = qx.lang.Type;

    assert.isTrue(Type.isDate(new Date()));
    assert.isTrue(Type.isDate(new Date(1981, 1, 10)));
    assert.isTrue(Type.isDate(new Date(1981, 1, 10, 6, 1, 2)));
    assert.isTrue(Type.isDate(new Date(516848615165861)));

    assert.isFalse(Type.isDate());
    assert.isFalse(Type.isDate(true));
    assert.isFalse(Type.isDate(""));
    assert.isFalse(Type.isDate(null));
    assert.isFalse(Type.isDate(undefined));
    assert.isFalse(Type.isDate(/g/));
    assert.isFalse(Type.isDate([]));
    assert.isFalse(Type.isDate(2));
    assert.isFalse(Type.isDate({}));
    assert.isFalse(Type.isDate(new Error()));

    // test IE issue with a null returned from DOM
    assert.isFalse(Type.isDate(document.getElementById("ReturenedNull")));
  });


  it("IsError", function() {
    var Type = qx.lang.Type;

    assert.isTrue(Type.isError(new Error()));
    assert.isTrue(Type.isError(new Error("")));
    assert.isTrue(Type.isError(new Error("test")));
    assert.isTrue(Type.isError(new EvalError()));
    assert.isTrue(Type.isError(new RangeError()));

    assert.isFalse(Type.isError());
    assert.isFalse(Type.isError(true));
    assert.isFalse(Type.isError(""));
    assert.isFalse(Type.isError(null));
    assert.isFalse(Type.isError(undefined));
    assert.isFalse(Type.isError(/g/));
    assert.isFalse(Type.isError([]));
    assert.isFalse(Type.isError(2));
    assert.isFalse(Type.isError({}));
    assert.isFalse(Type.isError(new Date()));

    // test IE issue with a null returned from DOM
    assert.isFalse(Type.isError(document.getElementById("ReturenedNull")));
  });
});

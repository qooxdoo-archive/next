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
     * Adrian Olaru (adrianolaru)

************************************************************************ */


describe("util.Validate", function () {

  it("Number", function () {
    //The number is valid if an error isn't raised
    qx.util.Validate.number(2);

    //ValidationError raised if not a number
    assert.throw(function () {
      qx.util.Validate.number("not a number");
    }, qx.core.ValidationError);

    // ValidationError raised with a custom message
    assert.throw(function () {
      qx.util.Validate.number("Custom Error Message")("not a number");
    }, qx.core.ValidationError, "Custom Error Message");
  });


  it("Email", function () {
    //The email is valid if an error isn't raised
    qx.util.Validate.email("an@email.ro");

    //ValidationError raised if not an email
    assert.throw(function () {
      qx.util.Validate.email("not an email");
    }, qx.core.ValidationError);

    //Valid since new domain extensions
    qx.util.Validate.email("foo@bar.qooxdoo");
  });


  it("String", function () {
    //The string is valid if an error isn't raised
    qx.util.Validate.string("I'm a string");

    //ValidationError raised if not a string
    assert.throw(function () {
      qx.util.Validate.string(1);
    }, qx.core.ValidationError);
  });


  it("Url", function () {
    //The url is valid if an error isn't raised
    qx.util.Validate.url("http://anurl.ro");

    //ValidationError raised if not an url
    assert.throw(function () {
      qx.util.Validate.url("not an url");
    }, qx.core.ValidationError);
  });


  it("Color", function () {
    //The color value is valid if an error isn't raised
    qx.util.Validate.color("#667788");

    //ValidationError raised if not a color value
    assert.throw(function () {
      qx.util.Validate.color("not a color value");
    }, qx.core.ValidationError);
  });


  it("Range", function () {
    //The value is valid if it's in the range
    qx.util.Validate.range(3, 2, 4);

    //ValidationError raised if the value isn't in the range
    assert.throw(function () {
      qx.util.Validate.range(5, 2, 4);
    }, qx.core.ValidationError);
  });


  it("InArray", function () {
    //The value is valid if it's in the range
    qx.util.Validate.inArray(3, [2, 3]);

    //ValidationError raised if the value isn't in array
    assert.throw(function () {
      qx.util.Validate.inArray(4, [2, 3]);
    }, qx.core.ValidationError);
  });


  it("Regex", function () {
    qx.util.Validate.regExp("1and1", /^\dand\d$/);

    //ValidationError raised if the value isn't in array
    assert.throw(function () {
      qx.util.Validate.regExp("oneandone", /^\dand\d$/);
    }, qx.core.ValidationError, /oneandone/g);

    //ValidationError raised if the value isn't in array
    assert.throw(function () {
      qx.util.Validate.regExp("xyz", /^\dand\d$/);
    }, qx.core.ValidationError, /xyz/g);
  });

});


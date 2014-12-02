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
     * Jonathan Weiß (jonathan_rass)

************************************************************************ */

/**
 * @ignore(qx.String)
 */

describe("qx.test.type.BaseString", function() {

  it("ToString", function() {
    var s = new qx.type.BaseString("Juhu");
    assert.equal("Juhu", s);
  });


  it("ValueOf", function() {
    var s = new qx.type.BaseString("Juhu");
    assert.equal("Juhu".valueOf(), s.valueOf());
  });


  it("UpperCase", function() {
    var s = new qx.type.BaseString("Juhu");
    assert.equal("JUHU", s.toUpperCase());
  });


  it("IndexOf", function() {
    var s = new qx.type.BaseString("Juhu");
    assert.equal(1, s.indexOf("u"));
  });


  it("PlusOperator", function() {
    var s = new qx.type.BaseString("Juhu");
    assert.equal("__Juhu__", ["__", s + "__"].join(""));
  });


  it("CharAt", function() {
    var s = new qx.type.BaseString("Juhu");
    assert.equal("h", s.charAt(2));
  });


  it("charCodeAt", function() {
    var s = new qx.type.BaseString("Juhu");
    assert.equal(104, s.charCodeAt(2));
  });


  it("lastIndexOf", function() {
    var s = new qx.type.BaseString("Juhu");
    assert.equal(3, s.lastIndexOf("u"));
  });


  it("Length", function() {
    var s = new qx.type.BaseString("Juhu");
    assert.equal(4, s.length);
  });


  it("LowerCase", function() {
    var s = new qx.type.BaseString("Juhu");
    assert.equal("juhu", s.toLowerCase());
  });


  it("SubstringOneArgument", function() {
    var s = new qx.type.BaseString("Juhu");
    assert.equal("hu", s.substring(2));
  });


  it("SubstringTwoArguments", function() {
    var s = new qx.type.BaseString("Juhu");
    assert.equal("u", s.substring(2, 1));
  });


  it("SearchString", function() {
    var s = new qx.type.BaseString("Juhu");
    assert.equal(2, s.search("h"));
  });


  it("SearchRegExp", function() {
    var s = new qx.type.BaseString("Juhu");
    assert.equal(0, s.search(/J/));
  });


  it("Replace", function() {
    var s = new qx.type.BaseString("Juhu");
    assert.equal("Johu", s.replace("u", "o"));
  });


  it("EmptyString", function() {
    var s = new qx.type.BaseString();
    assert.equal("", s.toString());

    s = new qx.type.BaseString("");
    assert.equal("", s.toString());
  });


  it("Extend", function() {
    qx.Class.define("qx.String", {
      extend: qx.type.BaseString,

      members: {
        bold: function() {
          return "<b>" + this.toString() + "</b>";
        }
      }
    });

    var s = new qx.String("Juhu");
    assert.equal("<b>Juhu</b>", s.bold());
  });
});

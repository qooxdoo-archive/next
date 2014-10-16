/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2010 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Jonathan Weiß (jonathan_rass)
     * Mustafa Sak (msak)

************************************************************************ */

describe("bom.Font", function ()
{

  function hasNoIe ()
  {
    return qx.core.Environment.get("engine.name") !== "mshtml";
  }


  beforeEach (function ()  {
      __font = new qx.bom.Font;
  });
 
  it("Bold", function() {
      __font.bold = true;

      var styles = __font.getStyles();
      assert.equal("bold", styles.fontWeight, "Wrong style value for 'bold' property!");
  });
 
  it("Italic", function() {
      __font.italic = true;

      var styles = __font.getStyles();
      assert.equal("italic", styles.fontStyle, "Wrong style value for 'italic' property!");
  });
 
  it("DecorationUnderline", function() {
      __font.decoration = "underline";

      var styles = __font.getStyles();
      assert.equal("underline", styles.textDecoration, "Wrong style value for 'decoration' property!");
  });
 
  it("DecorationLineThrough", function() {
      __font.decoration = "line-through";

      var styles = __font.getStyles();
      assert.equal("line-through", styles.textDecoration, "Wrong style value for 'decoration' property!");
  });
 
  it("DecorationOverline", function() {
      __font.decoration = "overline";

      var styles = __font.getStyles();
      assert.equal("overline", styles.textDecoration, "Wrong style value for 'decoration' property!");
  });
 
  it("FontFamily", function() {
      __font.family = ["Arial"];

      var styles = __font.getStyles();
      assert.equal("Arial", styles.fontFamily, "Wrong style value for 'family' property!");
  });
 
  it("FontFamilyMultipleWords", function() {
      __font.family = ['Times New Roman'];

      var styles = __font.getStyles();
      assert.equal('"Times New Roman"', styles.fontFamily, "Wrong style value for 'family' property!");
  });
 
  it("LineHeight", function() {
      __font.lineHeight = 1.5;

      var styles = __font.getStyles();
      assert.equal(1.5, styles.lineHeight, "Wrong style value for 'lineHeight' property!");
  });
 
  it("Size", function() {
      __font.size = 20;

      var styles = __font.getStyles();
      assert.equal("20px", styles.fontSize, "Wrong style value for 'size' property!");
  });
 
  it("Color", function() {
      __font.color = "red";

      var styles = __font.getStyles();
      assert.equal("red", styles.color, "Wrong style value for 'color' property!");
  });
 
  it("TextShadow", function() {
      //require(["noIe"]);

      __font.textShadow = "red 1px 1px 3px, green -1px -1px 3px, white -1px 1px 3px, white 1px -1px 3px";

      var styles = __font.getStyles();
      assert.equal("red 1px 1px 3px, green -1px -1px 3px, white -1px 1px 3px, white 1px -1px 3px", styles.textShadow, "Wrong style value for 'textShadow' property!");
  });
 
  it("GetStyles", function() {
      var styles = __font.getStyles();

      // we expect a map with only 'fontFamily' set, otherwise the null values
      // which are returned are overwriting styles. Only return styles which are set.
      var keys = Object.keys(styles);

      assert.isObject(styles, "Method 'getStyles' should return a map!");
      assert.equal(8, Object.keys(styles).length, "Map should contain 8 key!");
      assert.isDefined(styles.fontFamily, "Key 'fontFamily' has to be present!");
      assert.isDefined(styles.fontStyle, "Key 'fontStyle' has to be present!");
      assert.isDefined(styles.fontWeight, "Key 'fontWeight' has to be present!");
      assert.isDefined(styles.fontSize, "Key 'fontSize' has to be present!");
      assert.isDefined(styles.lineHeight, "Key 'lineHeight' has to be present!");
      assert.isDefined(styles.textDecoration, "Key 'textDecoration' has to be present!");
      assert.isDefined(styles.color, "Key 'color' has to be present!");
      assert.isDefined(styles.textShadow, "Key 'textShadow' has to be present!");
  });
 
  it("GetSomeStyles", function() {
      __font.bold = true;
      __font.italic = true;
      __font.color = "#3f3f3f";
      __font.decoration = "underline";

      var styles = __font.getStyles();
      var keys = Object.keys(styles);

      assert.isObject(styles, "Method 'getStyles' should return a map!");
      assert.equal("fontFamily", keys[0], "Key 'fontFamily' has to be present!");
      assert.equal("", styles.fontFamily, "'fontFamily' has to have the value ''!");
      assert.equal("italic", styles.fontStyle, "Wrong value for 'fontStyle'!");
      assert.equal("bold", styles.fontWeight, "Wrong value for 'fontWeight'!");
      assert.equal("#3f3f3f", styles.color, "Wrong value for 'color'!");
      assert.equal("underline", styles.textDecoration, "Wrong value for 'textDecoration'!");
  });
 
  it("FromConfig", function() {
      var config =
      {
        bold: true,
        italic: false,
        decoration: "underline",
        lineHeight: 1.2,
        size: 20,
        family: [ "Arial" ],
        color: "red"
      };
      var font = qx.bom.Font.fromConfig(config);

      var expected =
      {
        fontWeight: "bold",
        fontStyle: "normal",
        textDecoration: "underline",
        lineHeight: 1.2,
        fontSize: "20px",
        fontFamily: "Arial",
        color: "red"
      };
      var found = font.getStyles();

      assert.equal(expected.fontWeight, found.fontWeight, "Wrong value for 'fontWeight'");
      assert.equal(expected.fontStyle, found.fontStyle, "Wrong value for 'fontStyle'");
      assert.equal(expected.fontSize, found.fontSize, "Wrong value for 'fontSize'");
      assert.equal(expected.lineHeight, found.lineHeight, "Wrong value for 'lineHeight'");
      assert.equal(expected.textDecoration, found.textDecoration, "Wrong value for 'textDecoration'");
      assert.equal(expected.fontFamily, found.fontFamily, "Wrong value for 'fontFamily'");
      assert.equal(expected.textColor, found.textColor, "Wrong value for 'textColor'");
  });
 
  it("FromString", function() {
      var config = "bold italic underline 20px Arial";
      var font = qx.bom.Font.fromString(config);

      var expected =
      {
        fontWeight: "bold",
        fontStyle: "italic",
        textDecoration: "underline",
        fontSize: "20px",
        fontFamily: "Arial"
      };
      var found = font.getStyles();

      assert.equal(expected.fontWeight, found.fontWeight, "Wrong value for 'fontWeight'");
      assert.equal(expected.fontStyle, found.fontStyle, "Wrong value for 'fontStyle'");
      assert.equal(expected.fontSize, found.fontSize, "Wrong value for 'fontSize'");
      assert.equal(expected.textDecoration, found.textDecoration, "Wrong value for 'textDecoration'");
      assert.equal(expected.fontFamily, found.fontFamily, "Wrong value for 'fontFamily'");
    
  });
});

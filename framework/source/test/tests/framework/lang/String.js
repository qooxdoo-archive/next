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

describe("lang.String", function()
{
 
 it("String", function() {
      assert.isDefined(qx.lang.String);
  });
 
  it("Format", function() {
      assert.isDefined(qx.lang.String.format);
      var Str = qx.lang.String;

      assert.equal("1-2", Str.format("%1-%2", [ 1, 2 ]));
      assert.equal("2-1", Str.format("%2-%1", [ 1, 2 ]));

      assert.equal("1-2", Str.format("%1-%2", [ "1", "2" ]));
      assert.equal("2-1", Str.format("%2-%1", [ "1", "2" ]));
      assert.equal("1-2-3-4-5-6-7-8-9-10-11", Str.format("%1-%2-%3-%4-%5-%6-%7-%8-%9-%10-%11", [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]));
  });
 
  it("Repeat", function() {
      assert.equal("", qx.lang.String.repeat("", 10));
      assert.equal("", qx.lang.String.repeat("1", 0));
      assert.equal("1111", qx.lang.String.repeat("1", 4));
      assert.equal("123123123", qx.lang.String.repeat("123", 3));
      assert.equal("üüüü", qx.lang.String.repeat("ü", 4));
  });
 
  it("Pad", function() {
      assert.isDefined(qx.lang.String.pad);
      var Str = qx.lang.String;

      assert.equal("------", Str.pad("", 6, '-'));

      assert.equal("---123", Str.pad("123", 6, '-'));
      assert.equal("----123", Str.pad("123", 7, '-'));
      assert.equal("    123", Str.pad("123", 7, ' '));
      assert.equal("0000123", Str.pad("123", 7));

      assert.equal("123", Str.pad("123", 2, '-'));
      assert.equal("123", Str.pad("123", 3, '-'));
  });
 
  it("Append", function() {
      assert.isDefined(qx.lang.Array.append);
      var a = [ 1, 2, 3 ];
      qx.lang.Array.append(a, [ 4, 5, 6 ]);

      qx.core.Assert.assertJsonEquals(a, [ 1, 2, 3, 4, 5, 6 ]);

      var error = false;

      try {
        qx.lang.Array.append(a, 1);
      } catch(ex) {
        error = true;
      }

      assert(error);
  });
 
  it("StartsWith", function() {
      var String = qx.lang.String;

      assert.isTrue(String.startsWith("123", "1"));
      assert.isTrue(String.startsWith("123", "123"));
      assert.isTrue(String.startsWith("1231", "1"));
      assert.isFalse(String.startsWith("123", "3"));
      assert.isFalse(String.startsWith("123", "4"));
  });
 
  it("Escape", function() {
      // escape HTML
      assert.equal("\n", qx.bom.String.escape("\n"));

      assert.equal("Hello", qx.bom.String.escape("Hello"));
      assert.equal("juhu &lt;&gt;", qx.bom.String.escape("juhu <>"));

      assert.equal("&lt;div id='1'&gt;&amp;nbsp; &euro;&lt;/div&gt;", qx.bom.String.escape("<div id='1'>&nbsp; €</div>"));

      // textToHtml
      assert.equal("&lt;div id='1'&gt;<br> &nbsp;&amp;nbsp; &euro;&lt;/div&gt;", qx.bom.String.fromText("<div id='1'>\n  &nbsp; €</div>"));

      // htmlToText
      assert.equal("<div id='1'>\n \u00A0&nbsp; €</div>", qx.bom.String.toText("&lt;div id='1'&gt;<br> &nbsp;&amp;nbsp;  \n   &euro;&lt;/div&gt;"));

      // unescape HTML
      assert.equal("\n", qx.bom.String.unescape("\n"));
      assert.equal("Hello", qx.bom.String.unescape("Hello"));
      assert.equal("juhu <>", qx.bom.String.unescape("juhu &lt;&gt;"));

      assert.equal("<div id='1'>&nbsp; €</div>", qx.bom.String.unescape("&lt;div id='1'&gt;&amp;nbsp; &euro;&lt;/div&gt;"));

      assert.equal(">&zzzz;x", qx.bom.String.unescape("&gt;&zzzz;x"));

      assert.equal("€", qx.bom.String.unescape("&#x20AC;"));

      assert.equal("€", qx.bom.String.unescape("&#X20AC;"));

      // escape XML
      assert.equal("\n", qx.xml.String.escape("\n"));
      assert.equal("Hello", qx.xml.String.escape("Hello"));
      assert.equal("juhu &lt;&gt;", qx.xml.String.escape("juhu <>"));

      assert.equal("&lt;div id=&apos;1&apos;&gt;&amp;nbsp; &#8364;&lt;/div&gt;", qx.xml.String.escape("<div id='1'>&nbsp; €</div>"));

      assert.equal("&quot;bread&quot; &amp; &quot;butter&quot;", qx.xml.String.escape('"bread" & "butter"'));

      // unescape XML
      assert.equal("\n", qx.xml.String.unescape("\n"));
      assert.equal("Hello", qx.xml.String.unescape("Hello"));
      assert.equal("juhu <>", qx.xml.String.unescape("juhu &lt;&gt;"));

      assert.equal("<div id='1'>&nbsp; €</div>", qx.xml.String.unescape("&lt;div id=&apos;1&apos;&gt;&amp;nbsp; &#8364;&lt;/div&gt;"));

      assert.equal('"bread" & "butter"', qx.xml.String.unescape("&quot;bread&quot; &amp; &quot;butter&quot;"));
  });
 
  it("Capitalize", function() {
      assert.equal("Alibaba", qx.lang.String.capitalize("alibaba"));
      assert.equal("Über", qx.lang.String.capitalize("über"));
      assert.equal("Aüber", qx.lang.String.capitalize("aüber"));
      assert.equal("Die-Über", qx.lang.String.capitalize("die-über"));
      assert.equal("Die Über", qx.lang.String.capitalize("die über"));
  });
 
  it("CamelCase", function() {
      assert.equal("paddingTop", qx.lang.String.camelCase("padding-top"));
      assert.equal("ILikeCookies", qx.lang.String.camelCase("I-like-cookies"));
      assert.equal("iLikeCookies", qx.lang.String.camelCase("i-like-cookies"));
  });
 
  it("Hyphenate", function() {
      assert.equal("padding-top", qx.lang.String.hyphenate("paddingTop"));
      assert.equal("-i-like-cookies", qx.lang.String.hyphenate("ILikeCookies"));
      assert.equal("i-like-cookies", qx.lang.String.hyphenate("iLikeCookies"));
  });

    // Check for bug #7234
 
 it("CombineCamelCaseAndHyphenate", function() {
      qx.lang.String.hyphenate("padding-top");
      assert.equal("paddingTop", qx.lang.String.camelCase("padding-top"));

      qx.lang.String.camelCase("marginTop");
      assert.equal("margin-top", qx.lang.String.hyphenate("marginTop"));
  });
 
  it("Clean", function() {
      var str = "  a  b\tc\rd\fe\vf\n\ng\nh\ri ";
      var cleanStr = "a b c d e f g h i";
      // IE sees \v as "v"
      if (
        qx.core.Environment.get("engine.name") == "mshtml" &&
        !(parseFloat(qx.core.Environment.get("engine.version")) >= 9 &&
        qx.core.Environment.get("browser.documentmode") >= 9)
      ) {
        cleanStr = "a b c d evf g h i";
      }
      assert.equal(cleanStr, qx.lang.String.clean(str));
  });
 
  it("Quote", function() {
      assert.equal('"abc \\"defg\\" hij"', qx.lang.String.quote('abc "defg" hij'));
      assert.equal('"abc \\\\defg\\\\ hij"', qx.lang.String.quote('abc \\defg\\ hij'));
      assert.equal('"abc \\"defg\\\\ hij"', qx.lang.String.quote('abc "defg\\ hij'));
    
  });
});

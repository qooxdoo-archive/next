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

describe("bom.Basic", function() {

  beforeEach(function() {
    var div = document.createElement("div");
    div.id = "html_basics";

    div.innerHTML =
      '<div id="test1" class="hello world" title="hello world title">' +
      ' <input id="test2" name="foo2" type="text" maxlength="20" value="hello"/>' +
      '  <input tabindex="2" id="test3" type="checkbox" checked="true" name="foo3" value="bar"/>' +
      '  <input id="test4" type="text" disabled="disabled"/>' +
      '  <input id="test5" type="text" disabled="false" READONLY="true"/>' + // <- note this div will be disabled!!
      '  <a id="test6" style="color:red;background:blue" href="../foo.html"><b>Foo</b>-Link</a>' +
      '  <table id="test7" valign="bottom"><tr><td colspan="3"></td></tr></table>' +
      '  <span id="test8">Black</span>' +
      '</div>';
    document.body.appendChild(div);
  });


  afterEach(function() {
    var div = document.getElementById("html_basics");
    document.body.removeChild(div);
  });


  it("ElementAttributes", function() {
    var attrib = qx.bom.element.Attribute;
    var style = qx.bom.element.Style;

    var test1 = document.getElementById("test1");

    assert.equal("hello world", attrib.get(test1, "class"));
    assert.equal("hello world title", attrib.get(test1, "title"));

    var test2 = document.getElementById("test2");
    assert.equal("foo2", attrib.get(test2, "name"));
    assert.equal("hello", attrib.get(test2, "value"));
    assert.equal("text", attrib.get(test2, "type"));
    assert.equal(20, attrib.get(test2, "maxlength"));

    var test3 = document.getElementById("test3");
    assert.equal("foo3", attrib.get(test3, "name"));
    assert.equal("bar", attrib.get(test3, "value"));
    assert.equal("checkbox", attrib.get(test3, "type"));
    assert.isTrue(attrib.get(test3, "checked"));
    assert.isFalse(attrib.get(test3, "disabled"));
    assert.equal(2, attrib.get(test3, "tabindex"));

    assert.isTrue(attrib.get(document.getElementById("test4"), "disabled"));
    assert.isFalse(attrib.get(document.getElementById("test4"), "readonly"));

    assert.isTrue(attrib.get(document.getElementById("test5"), "disabled"));
    assert.isTrue(attrib.get(document.getElementById("test5"), "readonly"));

    assert(qx.lang.String.endsWith(attrib.get(document.getElementById("test6"), "href"), "/foo.html"));

    var test6Color = style.get(document.getElementById("test6"), "color");
    qx.core.Assert.assertCssColor("red", test6Color);

    var test6BackgroundColor = style.get(document.getElementById("test6"), "backgroundColor");
    qx.core.Assert.assertCssColor("blue", test6BackgroundColor);

    assert.strictEqual("", style.get(document.getElementById("test6"), "font", style.LOCAL_MODE));

    // This test fails in IE, Webkit and Opera but the value is correct
    //assert.equal("serif", style.get(document.getElementById("test6"), "fontFamily"));
    assert.equal("Foo-Link", attrib.get(document.getElementById("test6"), "text"));
    assert.equal("<b>foo</b>-link", attrib.get(document.getElementById("test6"), "html").toLowerCase());

    assert.equal("bottom", attrib.get(document.getElementById("test7"), "valign"));
    assert.equal(3, attrib.get(document.getElementById("test7").getElementsByTagName("td")[0], "colspan"));

    style.set(document.getElementById("test8"), "color", "red");
    style.set(document.getElementById("test8"), "backgroundColor", "black");

    var test8Color = style.get(document.getElementById("test8"), "color");
    qx.core.Assert.assertCssColor("red", test8Color);

    var test8BackgroundColor = style.get(document.getElementById("test8"), "backgroundColor");
    qx.core.Assert.assertCssColor("black", test8BackgroundColor);
  });
});

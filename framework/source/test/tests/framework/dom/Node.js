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
     * Fabian Jakobs (fjakobs)

************************************************************************ */

describe("dom.Node", function() {

  var sandbox;
  beforeEach (function () {
    sandbox = q.create("<div id='sandbox'></div>").appendTo(document.body);
  });


  afterEach (function () {
    sandbox.remove();
  });


  it("BlockNodes", function() {
    var blockNodeList = [ "body", "h1", "h2", "h3", "h4", "h5", "div", "blockquote",
                          "hr", "form", "textarea", "fieldset", "iframe",
                          "ul", "ol", "li", "dl", "dt", "dd", "p", "quote",
                          "pre", "table", "thead", "tbody", "tfoot", "tr",
                          "td", "th", "iframe", "address" ];

    var blockElement;
    var blockElements = [];
    for (var i=0, j=blockNodeList.length; i<j; i++)
    {
      blockElement = document.createElement(blockNodeList[i]);
      sandbox.append(blockElement);

      blockElements.push(blockElement);

      qx.log.Logger.info("Testing node " + qx.dom.Node.getName(blockElement));
      assert.isTrue(qx.dom.Node.isBlockNode(blockElement));
    }
  });


  it("InlineNodes", function() {
    var inlineNodeList = [ "a", "span", "abbr", "acronym", "dfn", "object", "param",
                           "em", "strong", "code", "b", "i", "tt", "samp",
                           "kbd", "var", "big", "small", "br", "bdo", "cite",
                           "del", "ins", "q", "sub", "sup", "img", "map" ];

    var inlineElement;
    var inlineElements = [];
    for (var i=0, j=inlineNodeList.length; i<j; i++)
    {
      inlineElement = document.createElement(inlineNodeList[i]);
      sandbox.append(inlineElement);

      inlineElements.push(inlineElement);

      qx.log.Logger.info("Testing node " + qx.dom.Node.getName(inlineElement));
      assert.isFalse(qx.dom.Node.isBlockNode(inlineElement));
    }
  });


  it("TextNodes", function() {
    var blockElement = document.createElement("div");
    var blockElementText = document.createTextNode("schokobaer");
    blockElement.appendChild(blockElementText);

    var innerElement = document.createElement("span");
    blockElement.appendChild(innerElement);

    var innerTextNode = document.createTextNode("vanillebaer");
    innerElement.appendChild(innerTextNode);

    sandbox.append(blockElement);

    var data = "<Root><foo></foo></Root>";
    var xml = qx.xml.Document.fromString(data);

    var cdataElement = xml.createCDATASection("karamelbaer");
    xml.getElementsByTagName("foo")[0].appendChild(cdataElement);

    assert.equal("vanillebaer", qx.dom.Node.getText(innerTextNode), "Failed to get the right value for one text node.");
    assert.equal("schokobaervanillebaer", qx.dom.Node.getText(blockElement), "Failed to get the right value for text of an element.");
    assert.equal("karamelbaer", qx.dom.Node.getText(xml.getElementsByTagName("foo")[0].firstChild), "Failed to get the text of a CData text node.");
  });


  it("GetWindow", function() {
    var rendered = document.createElement("div");
    sandbox.append(rendered);
    var unrendered = document.createElement("div");
    var text = document.createTextNode("affe");

    assert.equal(window, qx.dom.Node.getWindow(rendered));
    assert.equal(window, qx.dom.Node.getWindow(unrendered));
    assert.equal(window, qx.dom.Node.getWindow(text));
  });
});
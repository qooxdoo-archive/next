describe("module.Traversing", function() {

  it("IsRendered", function() {
    assert.isTrue(sandbox.isRendered());
    assert.isFalse(q.create("<div>").isRendered());
  });


  it("AddElement", function() {
    var test = q.create("<div id='testdiv'/>");
    assert.equal(1, test.length);
    test.add(document.body);
    assert.equal(2, test.length);
  });


  it("AddCollection", function() {
    var test = q.create("<div id='testdiv'/>");
    var toAdd = q.create("<h2>Foo</h2>");
    assert.equal(1, test.length);
    test.add(toAdd);
    assert.equal(2, test.length);
  });


  it("AddDocumentFragment", function() {

    var test = q.create("<div id='testdiv'/>");
    var toAdd = document.createDocumentFragment();
    assert.equal(1, test.length);
    test.add(toAdd);
    assert.equal(2, test.length);
  });


  it("AddIllegal", function() {
    var test = q.create("<div id='testdiv'/>")
      .add(window)
      .add(document)
      .add("affe")
      .add(42)
      .add(true)
      .add({});
    assert.equal(3, test.length);
  });


  it("GetChildren", function() {
    var test = q.create("<div><p>test</p></div>");
    var res = test.getChildren();
    assert.instanceOf(res, qxWeb);
    assert.equal(1, res.length);
    assert.equal(1, test.getChildren()[0].nodeType);
  });


  it("GetChildrenSelector", function() {
    var test = q.create("<div><h1/><p/></div>");
    var res = test.getChildren("div");
    assert.instanceOf(res, qxWeb);
    assert.equal(0, res.length);
    assert.equal(1, test.getChildren("h1").length);
  });


  it("forEach", function() {
    var test = q.create("<div id='testdiv'/>");
    test.add(q.create("<div/>")[0]);
    var self = this;
    var i = 0;
    test.forEach(function(item, id, array) {
      assert.equal(self, this);
      assert.equal(test[i], item);
      assert.equal(i, id);
      assert.equal(test, array);
      i++;
    }, this);
  });


  it("ForEachElement", function() {
    var test = q.create("<div/><h1/>").add(window);
    var exec = 0;
    test.forEach(function(item) {
      exec++;
      assert.notEqual(window, item);
      assert.notEqual(window, item[0]);
      assert.instanceOf(item, qxWeb);
      assert.equal(1, item[0].nodeType);
      assert.equal(1, item.length);
    }, this);
    assert.equal(2, exec);
  });


  it("GetParents", function() {
    var test = q.create("<div id='testdiv'/>");
    test.appendTo(sandbox[0]);
    var res = test.getParents();
    assert.instanceOf(res, qxWeb);
    assert.equal(sandbox[0], res[0]);
    test.remove();
  });


  it("IsChildOf", function() {
    var test = q.create("<div id='testdiv'><div id='testchild'><div id='testchild2'></div></div><div>");
    test.appendTo(sandbox[0]);
    assert.isTrue(q("#testchild").isChildOf(test));
    assert.isTrue(q("#testchild2").isChildOf(test));
    assert.isTrue(q("#testchild2").isChildOf(q("#testchild")));
    assert.isTrue(test.isChildOf(q(sandbox)));
    assert.isTrue(test.find("div").isChildOf(q("#testchild")));
    test.remove();
  });


  it("GetParentsSelector", function() {
    var test = q.create("<a id='parent'><div id='test'/></a>");
    test.appendTo(sandbox[0]);
    var parent = q("#parent");
    var res = q("#test").getParents("a");
    assert.instanceOf(res, qxWeb);
    assert.equal(parent[0], res[0], "Element mismatch");
    assert.equal(0, q("#test").getParents("div").length);
    test.remove();
  });


  it("GetAncestors", function() {
    var test = q.create('<div id="ancestor"><div id="parent"><div id="child"></div></div></div>');
    test.appendTo(sandbox[0]);
    var ancestors = q("#child").getAncestors();
    assert.instanceOf(ancestors, qxWeb);
    //parent ancestor sandbox body documentElement document
    assert.equal(6, ancestors.length);

    assert.equal("parent", ancestors[0].id);
    assert.equal(document, ancestors[5]);
    test.remove();
  });


  it("GetAncestorsSelector", function() {
    var test = q.create('<div id="ancestor"><div id="parent"><div id="child"></div></div></div>');
    test.appendTo(sandbox[0]);
    var ancestors = q("#child").getAncestors("div");
    assert.instanceOf(ancestors, qxWeb);
    assert.equal(3, ancestors.length);
    assert.equal("parent", ancestors[0].id);
    assert.equal("sandbox", ancestors[2].id);
    test.remove();
  });


  it("GetAncestorsUntil", function() {
    var test = q.create('<div id="ancestor"><div id="parent"><div id="child"></div></div></div>');
    test.appendTo(sandbox[0]);
    var ancestors = q("#child").getAncestorsUntil("body");
    assert.instanceOf(ancestors, qxWeb);
    assert.equal(3, ancestors.length);
    assert.equal("parent", ancestors[0].id);
    assert.equal("sandbox", ancestors[2].id);

    ancestors = q("#child").getAncestorsUntil("body", "#sandbox");
    assert.equal(1, ancestors.length);
    assert.equal("sandbox", ancestors[0].id);
    test.remove();
  });


  it("GetClosest", function() {
    var test = q.create("<div><a id='closest'><div><div id='test'/></div></a></div>");
    test.appendTo(sandbox[0]);
    assert.equal(q("#closest")[0], q("#test").getClosest("a")[0], "Element mismatch");
    var res = q("#test").getClosest("a");
    assert.instanceOf(res, qxWeb);
    assert.equal(1, res.length, "Ancestor not found");
    assert.equal(1, q("#test").getClosest("#test").length, "Self not found");
    assert.equal(0, q("#test").getClosest("#no").length, "Found unexpected");
    test.remove();
  });


  it("Filter", function() {
    var test = q.create("<div id='test' class='item'/><div class='item'/>");
    test.appendTo(sandbox[0]);
    var collection = q(".item");
    assert.equal(q("#test")[0], collection.filter("#test")[0], "Element mismatch");
    var res = collection.filter("#test");
    assert.instanceOf(res, qxWeb);
    assert.equal(1, res.length);
    test.remove();
  });


  it("FilterSelector", function() {
    var col = q([]);
    var test = q.create("<div id='test' class='item'/>");
    var other = q.create("<div class='item'/>");
    col.add(test[0]);
    col.add(other[0]);
    assert.equal(test[0], col.filter("#test")[0], "Element mismatch");
    var res = col.filter("#test");
    assert.instanceOf(res, qxWeb);
    assert.equal(1, res.length);
    assert.equal(2, col.filter("div").length);
  });


  it("FilterFunction", function() {
    var test = q.create("<div id='test' class='item'/><div class='item'/>");
    test.appendTo(sandbox[0]);
    var collection = q(".item");
    assert.equal(q("#test")[0], collection.filter(function(item) {
      return item.id == "test";
    })[0], "Element mismatch");
    var res = collection.filter("#test");
    assert.instanceOf(res, qxWeb);
    assert.equal(1, res.length);
    test.remove();
  });


  it("Find", function() {
    var test = q.create("<div id='outer'><div><div id='test'/><div/></div></div>");
    test.appendTo(sandbox[0]);
    var res = q("#outer").find("div");
    assert.instanceOf(res, qxWeb);
    assert.equal(3, res.length);
    assert.equal(q("#test")[0], q("#outer").find("#test")[0], "Element mismatch");
    assert.equal(1, q("#outer").find("#test").length);
    test.remove();
  });


  it("GetContents", function() {
    var html = "<div class='container'><h1>One</h1><!-- first comment -->foo</div>";
    html += "<div class='container'><h1>Two</h1><!-- second comment -->bar</div>";
    var test = q.create(html);
    test.appendTo(sandbox[0]);
    var contents = q(".container").getContents();
    assert.instanceOf(contents, qxWeb);
    assert.equal(2, contents.length);
    assert.equal(1, contents[0].nodeType);
    assert.equal(1, contents[1].nodeType);
    test.remove();

    //must be ignored:
    q(window).getContents();
  });


  it("Is", function() {
    var html = "<ul class='test'><li>Item</li><li>Item</li><li class='foo'>Item</li></ul>";
    var test = q.create(html);
    test.appendTo(sandbox[0]);
    assert.isTrue(q(".test li").is(".foo"));
    assert.isFalse(q(".test li").is("#bar"));
    test.remove();
  });


  it("IsWithFunction", function() {
    var html = "<ul class='test'><li>Item</li><li>Item</li><li class='foo'>Item</li></ul>";
    var test = q.create(html);
    test.appendTo(sandbox[0]);
    assert.isTrue(q(".test li").is(function(item) {
      return item.className == "foo";
    }));
    test.remove();
  });


  it("Eq", function() {
    var html = '<ul class="test"><li id="a">A</li><li id="b">B</li><li id="c">C</li></ul>';
    var test = q.create(html);
    test.appendTo(sandbox[0]);
    var res = q(".test li").eq(1);
    assert.instanceOf(res, qxWeb);
    assert.equal("b", res[0].id);
    assert.equal("b", q(".test li").eq(-2)[0].id);
    test.remove();
  });


  it("GetFirst", function() {
    var html = '<p id="first" class="foo">Affe</p><h2 class="foo">Juhu</h2><div class="foo">Hugo</div>';
    var test = q.create(html);
    test.appendTo(sandbox[0]);
    var res = q(".foo").getFirst();
    assert.instanceOf(res, qxWeb);
    assert.equal(1, res.length);
    assert.equal(document.getElementById("first"), q(".foo").getFirst()[0]);
    test.remove();
  });


  it("GetLast", function() {
    var html = '<p class="foo">Affe</p><h2 class="foo">Juhu</h2><div id="last" class="foo">Hugo</div>';
    var test = q.create(html);
    test.appendTo(sandbox[0]);
    var res = q(".foo").getLast();
    assert.instanceOf(res, qxWeb);
    assert.equal(1, res.length);
    assert.equal(document.getElementById("last"), q(".foo").getLast()[0]);
    test.remove();
  });


  it("Has", function() {
    var html = '<ul class="test">' +
      '  <li>Foo</li>' +
      '  <li id="target1"><a class="affe" href="#">Bar</a></li>' +
      '  <li>Baz</li>' +
      '</ul>' +
      '<ul class="test">' +
      '  <li>Foo</li>' +
      '  <li id="target2"><a class="affe" href="#">Bar</a></li>' +
      '  <li>Baz</li>' +
      '</ul>';
    var test = q.create(html);
    test.appendTo(sandbox[0]);
    assert.equal(6, q(".test li").length);
    var res = q(".test li").has(".affe");
    assert.instanceOf(res, qxWeb);
    assert.equal(2, res.length);
    assert.equal("target1", q(".test li").has(".affe")[0].id);
    assert.equal("target2", q(".test li").has(".affe")[1].id);
    test.remove();
    assert.equal(0, q(window).has("body").length);
  });


  it("GetNext", function() {
    var html = '<p class="qxtest" id="foo">foo</p>\nText\n<p id="bar">bar</p><p id="baz">baz</p>';
    var test = q.create(html);
    test.appendTo(sandbox[0]);
    var testNext = q(".qxtest").getNext();
    assert.instanceOf(testNext, qxWeb);
    assert.equal(1, testNext.length);
    assert.equal("bar", q("#foo").getNext()[0].id);

    // check for null next
    assert.equal(0, test.eq(3).getNext().length);
    test.remove();
  });


  it("GetNextWithSelector", function() {
    var html = '<div>a</div><p>f</p><div>f</div><p class="foo">e</p> ';
    var test = q.create(html);
    test.appendTo(sandbox[0]);
    var testNext = q("#sandbox div").getNext(".foo");
    assert.equal(1, testNext.length);
    assert.instanceOf(testNext, qxWeb);
    assert.equal("foo", q("#sandbox div").getNext(".foo")[0].className);
    test.remove();
  });


  it("GetNextAll", function() {
    var html = '<div><span id="test">a</span><span>f</span><span id="foo">f</span></div><p>foo</p>';
    var test = q.create(html);
    test.appendTo(sandbox[0]);
    var testNext = q("#test").getNextAll();
    assert.instanceOf(testNext, qxWeb);
    assert.equal(2, testNext.length);
    assert.equal(1, q("#test").getNextAll("#foo").length);
    assert.equal(document.getElementById("foo"), q("#test").getNextAll("#foo")[0]);
    test.remove();
  });


  it("GetNextUntil", function() {
    var html = '<ul>' + '  <li class="first">a</li>' + '  <li>f</li>' + '  <li>f</li>' + '  <li class="last">e</li>' + '</ul>' + '<p class="first">a</p>' + '<p>f</p>' + '<p>f</p>' + '<p class="last">e</p>';
    var test = q.create(html);
    test.appendTo(sandbox[0]);
    var res = q("#sandbox .first").getNextUntil(".last");
    assert.instanceOf(res, qxWeb);
    assert.equal(4, res.length);
    assert.equal("LI", res[0].tagName);
    assert.equal("LI", res[1].tagName);
    assert.equal("P", res[2].tagName);
    assert.equal("P", res[3].tagName);
    test.remove();
  });


  it("GetPrev", function() {
    var html = '<p class="test" id="foo">foo</p>\nText\n<p id="bar">bar</p><p id="baz">baz</p>';
    var test = q.create(html);
    test.appendTo(sandbox[0]);
    var testPrev = q("#baz").getPrev();
    assert.instanceOf(testPrev, qxWeb);
    assert.equal(1, testPrev.length);
    assert.equal("bar", q("#baz").getPrev()[0].id);
    test.remove();
  });


  it("GetPrevWithSelector", function() {
    var html = '<h1>A</h1><p>f</p>' + '<h2 class="foo">A</h2><p>f</p>' + '<h3>A</h3><p>f</p>' + '<h4 class="foo">A</h4><p>f</p>';
    var test = q.create(html);
    test.appendTo(sandbox[0]);
    var res = q("#sandbox p").getPrev(".foo");
    assert.instanceOf(res, qxWeb);
    assert.equal(2, res.length);
    assert.equal("foo", res[0].className);
    assert.equal("foo", res[1].className);
    assert.equal("H2", res[0].tagName);
    assert.equal("H4", res[1].tagName);
    test.remove();
  });


  it("GetPrevAll", function() {
    var html = '<p>foo</p><div><span>f</span><span id="foo">f</span><span id="test">a</span></div>';
    var test = q.create(html);
    test.appendTo(sandbox[0]);
    var res = q("#test").getPrevAll();
    assert.instanceOf(res, qxWeb);
    assert.equal(2, res.length);
    assert.equal(1, q("#test").getPrevAll("#foo").length);
    assert.equal(document.getElementById("foo"), q("#test").getPrevAll("#foo")[0]);
    test.remove();
  });


  it("GetPrevUntil", function() {
    var html = '<ul>' + '  <li class="first">a ONE</li>' + '  <li>f TWO</li>' + '  <li>f THREE</li>' + '  <li class="last">e</li>' + '</ul>' + '<p class="first">a</p>' + '<p>f</p>' + '<p>f</p>' + '<p class="last">e</p>';
    var test = q.create(html);
    test.appendTo(sandbox[0]);
    var res = q("#sandbox .last").getPrevUntil(".first");
    assert.instanceOf(res, qxWeb);
    assert.equal(4, res.length);
    assert.equal("LI", res[0].tagName);
    assert.equal("LI", res[1].tagName);
    assert.equal("P", res[2].tagName);
    assert.equal("P", res[3].tagName);
    test.remove();
  });


  it("GetSiblings", function() {
    var html = '<ul class="test">' + '  <li id="juhu">A</li>' + '  <li>F</li>' + '  <li class="foo">F</li>' + '  <li>E</li>' + '</ul>';
    var test = q.create(html);
    test.appendTo(sandbox[0]);
    var res = q(".foo").getSiblings();
    assert.instanceOf(res, qxWeb);
    assert.equal(3, res.length);
    assert.equal("A", res[0].innerHTML);
    assert.equal("F", res[1].innerHTML);
    assert.equal("E", res[2].innerHTML);

    res = q(".foo").getSiblings("#juhu");
    assert.equal(1, res.length);
    assert.equal("juhu", res[0].id);
    test.remove();
  });


  it("Not", function() {
    var html = '<ul class="test">' + '  <li id="juhu">A</li>' + '  <li>F</li>' + '  <li class="foo">F</li>' + '  <li>E</li>' + '</ul>';
    var test = q.create(html);
    test.appendTo(sandbox[0]);
    var res = q(".test li").not(".foo");
    assert.instanceOf(res, qxWeb);
    assert.equal(3, res.length);
    assert.equal(0, q.$$qx.bom.Selector.matches(".foo", res));
    test.remove();
  });


  it("NotWithFunction", function() {
    var html = '<ul class="test">' + '  <li id="juhu">A</li>' + '  <li>F</li>' + '  <li class="foo">F</li>' + '  <li>E</li>' + '</ul>';
    var test = q.create(html);
    test.appendTo(sandbox[0]);
    var res = q(".test li").not(function(item) {
      return item.className.indexOf("foo") >= 0;
    });
    assert.instanceOf(res, qxWeb);
    assert.equal(3, res.length);
    assert.equal(0, q.$$qx.bom.Selector.matches(".foo", res));
    test.remove();
  });


  it("GetOffsetParent", function() {
    var html = '<div><p class="foo">affe</p></div><div id="fixed" style="position:fixed"><p class="foo">affe</p></div>';
    var test = q.create(html);
    test.appendTo(sandbox[0]);
    var res = q(".foo").getOffsetParent();
    assert.instanceOf(res, qxWeb);
    assert.equal(2, res.length);
    assert.equal(document.body, res[0]);
    assert.equal(document.getElementById("fixed"), res[1]);
    test.remove();
  });


  it("IsElement", function() {
    assert.isTrue(q.isElement(document.body));
    assert.isTrue(q.isElement(q("#sandbox")[0]));
    assert.isTrue(q.isElement(q("#sandbox")));
    assert.isTrue(q.isElement("#sandbox"));
    assert.isFalse(q.isElement({}));
    q.create('<span id="affe">text</span>').appendTo(sandbox[0]);
    assert.isFalse(q.isElement(q("#sandbox #affe")[0].firstChild));
  });


  it("IsNode", function() {
    assert.isTrue(q.isNode(document));
    assert.isTrue(q.isNode(q("#sandbox")[0]));
    assert.isTrue(q.isNode(q("#sandbox")));
    assert.isTrue(q.isNode("#sandbox"));
    assert.isFalse(q.isNode({}));
    q.create('<span id="affe">text</span>').appendTo(sandbox[0]);
    assert.isTrue(q.isNode(q("#sandbox #affe")[0].firstChild));
    assert.isTrue(q.isNode(document.createAttribute("id")));
  });


  it("IsDocument", function() {
    assert.isTrue(q.isDocument(document));
    assert.isTrue((q.isDocument(document)));
    assert.isFalse(q.isDocument(q("#sandbox")[0]));
    assert.isFalse(q.isDocument({}));
  });


  it("GetWindow", function() {
    assert.equal(window, q.getWindow(q("#sandbox")[0]));
    assert.equal(window, q.getWindow(q("#sandbox")));
    assert.equal(window, q.getWindow(q("#sandbox")[0]));
  });


  it("IsWindow", function() {
    assert.isTrue(q.isWindow(window));
    assert.isTrue(q.isWindow(q(window)));
    assert.isFalse(q.isWindow(document));
    assert.isFalse(q.isWindow(document.body));
  });


  it("GetDocument", function() {
    assert.equal(document, q.getDocument(q("#sandbox")[0]));
    assert.equal(document, q.getDocument(q("#sandbox")));
    assert.equal(document, q.getDocument("#sandbox"));
    assert.equal(document, q.getDocument(window));
    assert.equal(document, q.getDocument(document));
  });


  it("GetNodeName", function() {
    assert.equal("html", q.getNodeName(document.documentElement));
    assert.equal("div", q.getNodeName("#sandbox"));
    assert.equal("div", q.getNodeName(q("#sandbox")));
    assert.equal("div", q.getNodeName(q("#sandbox")[0]));
  });


  it("GetNodeText", function() {
    assert.equal("monkeycheese", q.getNodeText(q.create("<div>monkey<p>cheese</p></div>")[0]));
    assert.equal("monkeycheese", q.getNodeText(q.create("<div>monkey<p>cheese</p></div>")));
    q("#sandbox").setHtml("monkeycheese");
    assert.equal("monkeycheese", q.getNodeText("#sandbox"));
  });


  it("IsBlockNode", function() {
    assert.isTrue(q.isBlockNode(document.createElement("p")));
    assert.isTrue(q.isBlockNode("#sandbox"));
    assert.isTrue(q.isBlockNode(q("#sandbox")));
    assert.isFalse(q.isBlockNode(document.createElement("span")));
  });


  it("IsNodeName", function() {
    assert.isTrue(q.isNodeName(document.createElement("p"), "p"));
    assert.isTrue(q.isNodeName(q("#sandbox"), "div"));
    assert.isTrue(q.isNodeName("#sandbox", "div"));
    assert.isTrue(q.isNodeName(document.createTextNode("bla"), "#text"));
  });


  it("IsTextNode", function() {
    assert.isTrue(q.isTextNode(document.createTextNode("bla")));
    assert.isFalse(q.isTextNode(document.createElement("p")));
  });


  it("EqualNodes", function() {
    // same node
    var node1 = q("#sandbox");
    var node2 = "#sandbox";
    assert.isTrue(q.equalNodes(node1, node2));

    // same node types/names
    node1 = q.create("<div>");
    node2 = q.create("<div>");
    assert.isTrue(q.equalNodes(node1, node2));

    // different node types
    node1 = q.create("<p>Foo</p>")[0];
    node2 = q.create("<p>Foo</p>")[0].firstChild;
    assert.isFalse(q.equalNodes(node1, node2));

    // different node names
    node1 = q.create("<div class='foo'>");
    node2 = q.create("<h2 class='foo'>");
    assert.isFalse(q.equalNodes(node1, node2));

    // same attributes/values
    node1 = q.create("<div style='display:block' class='foo'>");
    node2 = q.create("<div style='display:block' class='foo'>");
    assert.isTrue(q.equalNodes(node1, node2));

    // same attributes/different values
    node1 = q.create("<div class='foo' style='display:block'>");
    node2 = q.create("<div class='foo' style='display:none'>");
    assert.isFalse(q.equalNodes(node1, node2));

    // same attributes/values in different order
    node1 = q.create("<div class='foo' style='display:block'>");
    node2 = q.create("<div style='display:block' class='foo'>");
    assert.isTrue(q.equalNodes(node1, node2));

    // different attributes length
    node1 = q.create("<img src='foo.png' class='bar'>");
    node2 = q.create("<img src='foo.png'>");
    assert.isFalse(q.equalNodes(node1, node2));

    // same children
    node1 = q.create("<div class='foo'><p class='bar'>Foo</p></div>");
    node2 = q.create("<div class='foo'><p class='bar'>Foo</p></div>");
    assert.isTrue(q.equalNodes(node1, node2));

    // different children
    node1 = q.create("<div class='foo'><p class='bar'>Foo</p></div>");
    node2 = q.create("<div class='foo'><p class='baz'>Foo</p></div>");
    assert.isFalse(q.equalNodes(node1, node2));

    // same children in different order
    node1 = q.create("<div><h2>Foo</h2><p>Bar</p></div>");
    node2 = q.create("<div><p>Bar</p><h2>Foo</h2></div>");
    assert.isFalse(q.equalNodes(node1, node2));

    // different children lengths
    node1 = q.create("<div><p>Foo</p></div>");
    node2 = q.create("<div><p>Foo</p><p>Foo</p></div>");
    assert.isFalse(q.equalNodes(node1, node2));
  });


  it("Contains", function() {
    var div = q.create("<div>").appendTo(sandbox);
    div.append(q.create("<h2 class='foo'>Foo</h2>"));

    assert.equal(1, qxWeb(document.documentElement).contains(document.body).length);
    assert.equal(1, div.contains(q(".foo")[0]).length);
    assert.equal(0, div.contains(window).length);

    assert.equal(1, div.contains(q("#sandbox .foo")).length);
    assert.equal(0, div.contains(q("#sandbox .nope")).length);

    div.push(window);
    div.push(q.create("<div>")[0]);
    assert.equal(2, div.contains(q("#sandbox .foo")).length);
    assert.equal(0, div.contains(q("#sandbox .nope")).length);
  });
});

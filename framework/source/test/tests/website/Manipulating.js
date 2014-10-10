 describe('Manipulating', function() {
  this.timeout(5000);
  beforeEach (function () {
   globalSetup();
 });
  afterEach (function () {
   globalTeardown();
 });
 
 it("CreateDiv", function() {
    assert.isNotNull(q.create("<div/>"));
    assert.equal(1, q.create("<div/>")[0].nodeType);
  });

  it("CreateWithContext", function(done) {
    
    var onIframeLoad = function() {
        setTimeout(function() {
          var frameDoc = frame[0].contentDocument;
          var frameNode = q.create("<div id='foo'>", frameDoc).appendTo(frameDoc.body);
          assert.equal(q.getDocument(frameNode[0]), frameDoc);
          assert.equal(frameDoc.body, frameNode.getAncestors()[0]);
          done();
        }, 1000);
    };
    var frame = q.create('<iframe src="html/media.html"></iframe>')
    .once("load", onIframeLoad, this)
    .appendTo("#sandbox");
  });
 
 it("WrapElement", function() {
    var test = q.create("<div id='testdiv'/>");
    test.appendTo(sandbox[0]);
    var el = document.getElementById("testdiv");
    assert.equal(el, q(el)[0]);
    assert.equal(el, q([el])[0]);
    test.remove();
  });
 
 it("Clone", function() {
    var orig = q.create("<div id='testdiv'>abc</div>");
    var clone = orig.clone();
    assert.notEqual(orig[0], clone[0]);
    assert.equal(orig.getAttribute("id"), clone.getAttribute("id"));
    assert.equal(orig.getHtml(), clone.getHtml());

    //must be ignored:
    var df = document.createDocumentFragment ? document.createDocumentFragment() : undefined;
    q([window, document, df]).clone();
  });
 
 it("CloneWithEvents", function() {
    var orig = q.create("<div id='testdiv'>abc</div>");
    var called = 0;
    orig.on("click", function() {
      called++;
    });
    orig.on("custom", function() {
      called--;
    });
    var clone = orig.clone(true);
    clone.emit("click");
    assert.equal(1, called);

    orig.emit("click");
    assert.equal(2, called);

    orig.emit("custom");
    assert.equal(1, called);

    clone.emit("custom");
    assert.equal(0, called);
  });
 
 it("CloneWithEventsDeep", function() {
    var orig = q.create("<div id='testdiv'>abc</div>");
    var origInner = q.create("<div id='inner'>def</div>");
    origInner.appendTo(orig);
    var called = 0;
    origInner.on("click", function() {
      called++;
    });

    var clone = orig.clone(true);
    var children = clone.getChildren();
    q(children[0]).emit("click");
    assert.equal(1, called);
  });
 
 it("CloneWithNestedDomStructure", function() {
    var orig = q.create("<span id='container'><span id='subcontainer'><a href='#' title='test' class='foo'></a></span></span>");

    var clone = orig.getChildren().clone();
    var secondClone = orig.getChildren().clone(true);

    assert.equal(1, clone.length, "Cloning without events failed!");
    assert.equal(1, secondClone.length, "Cloning with events failed!");
  });
 
 it("AppendToRemove", function() {
    var test = q.create("<div/>");
    test.appendTo(sandbox[0]);
    assert.equal(sandbox[0], test[0].parentNode);
    test.remove();
    // In legacy IEs, nodes removed from the DOM will have a document fragment
    // parent (node type 11)
    assert(!test[0].parentNode || test[0].parentNode.nodeType !== 1);

    // must be ignored:
    q([window, document]).remove();
  });

 it("appendTo with cloned collection", function() {
    var test = q.create('<span class="child">foo</span><span class="child">foo</span');
    test.appendTo(sandbox[0]);
    var parent = q.create('<div class="parent"></div><div class="parent"></div>');
    parent.appendTo(sandbox[0]);
    q(".child").appendTo(q(".parent"));
    assert.equal(q(".parent .child~.child").length, 2);
  });

 it("appendTo with selector", function() {
    var test = q.create('<span class="child">foo</span><span class="child">foo</span');
    test.appendTo("#sandbox");
    assert.equal(2, q("#sandbox .child").length);

    //must be ignored:
    q([window, document]).appendTo("#sandbox");
  });
 
 it("appendTo documentFragment", function() {


    var df = document.createDocumentFragment();
    q.create("<h1 id='baz'>qux</h1>").appendTo(df);
    assert.equal("baz", df.firstChild.id);
 });

 it("empty", function() {
    var test = q.create("<div><p>test</p></div>");
    test.empty();
    assert.equal("", test[0].innerHTML);

    //must be ignored:
    q([window, document]).empty();
  });

  
 
 it("empty documentFragment", function() {

    var df = document.createDocumentFragment();
    df.appendChild(document.createElement("h1"));
    q(df).empty();
    assert.equal(0, df.childNodes.length);
  });
  
 it("empty and don't destroy children in IE", function() {
    // see [BUG #7323]

    var el = q.create("<div>foo<p>bar</p></div>");
    var ieSpecialTreatment = function(html) {
      // IE uses uppercase tag names and inserts whitespace
      return html.toLowerCase().replace(/\s+/, "");
    };

    q('#sandbox').empty().append(el);
    assert.equal("foo<p>bar</p>", ieSpecialTreatment(el.getHtml()));
    q('#sandbox').empty().append(el);
    assert.equal("foo<p>bar</p>", ieSpecialTreatment(el.getHtml()));
    assert.equal("<div>foo<p>bar</p></div>", ieSpecialTreatment(q('#sandbox').getHtml()));
  });
 
 it("AppendHtmlString", function() {
    var test = q.create("<ul><li>Foo</li><li>Bar</li></ul>");
    test.appendTo(sandbox[0]);

    q("#sandbox li").append('<h2>Hello</h2><span>Affe</span>');
    assert.equal(2, q("#sandbox li").has("h2").length);
    assert.equal(2, q("#sandbox li").has("span").length);

    //must be ignored:
    q([window, document]).append("<h2>Foo</h2>");
  });
 
 it("AppendHtmlStringToDocumentFragment", function() {


    var df = document.createDocumentFragment();
    q(df).append("<h1 id='qux'>Affe</h1>");
    assert.equal("qux", df.firstChild.id);
  });
 
 it("AppendCollection", function() {
    var test = q.create("<ul><li>Foo</li><li>Bar</li></ul>");
    test.appendTo(sandbox[0]);

    var children = q.create('<h2>Hello</h2><span>Affe</span>');
    q("#sandbox li").append(children);
    assert.equal(2, q("#sandbox li").has("h2").length);
    assert.equal(2, q("#sandbox li").has("span").length);
  });
 
 it("AppendCollectionToDocumentFragment", function() {


    var df = document.createDocumentFragment();
    var test = q.create("<h1 id='qux'>Affe</h1>");
    test.appendTo(df);
    assert.equal("qux", df.firstChild.id);
  });
 
 it("Scroll", function() {
    var t = q.create('<div id="test" style="overflow:auto; width:50px; height:50px;"><div style="width:150px; height:150px;">AAAAA</div></div>');
    t.appendTo(sandbox[0]);
    q("#test").setScrollLeft(50).setScrollTop(50);
    assert.equal(50, q("#test").getScrollLeft());
    assert.equal(50, q("#test").getScrollTop());
  });
 
 it("AnimateScrollLeft", function(done) {
    var t = q.create('<div id="test" style="overflow:auto; width:50px; height:50px;"><div style="width:150px; height:150px;">AAAAA</div></div>');
    t.appendTo(sandbox[0]);
    q("#test").on("animationEnd", function() {
        setTimeout(function() {
            assert.equal(50, q("#test").getScrollLeft());
            done();
        },1500);
    });
     
    setTimeout(function() {
      q("#test").setScrollLeft(50, 500);
    }, 100);
  });
 
 it("AnimateScrollTop", function() {
    var t = q.create('<div id="test" style="overflow:auto; width:50px; height:50px;"><div style="width:150px; height:150px;">AAAAA</div></div>');
    t.appendTo(sandbox[0]);
    q("#test").on("animationEnd", function() {
      setTimeout(function() {
        assert.equal(50, q("#test").getScrollTop());
        done()
      }, 1500);
    });

    setTimeout(function() {
      q("#test").setScrollTop(50, 500);
    }, 100);

  });

 it("before with HTML string", function() {
    var test = q.create('<p>Affe</p><p>Affe</p>');
    test.appendTo(sandbox[0]);
    q("#sandbox p").before('<h2>Juhu</h2>');
    assert.equal(2, q("#sandbox h2 + p").length);

    //must be ignored:
    q([window, document]).before("<p>Foo</p>");
  });

  
 
 it("before with array of HTML strings", function() {
    var test = q.create('<p>Affe</p><p>Affe</p>');
    test.appendTo(sandbox[0]);
    q("#sandbox p").before(['<h2>Juhu</h2>', '<h3>Kinners</h3>']);
    assert.equal(2, q("#sandbox h2 + h3 + p").length);
  });

  
 
 it("before with collection", function() {
    var test = q.create('<p>Affe</p><p>Affe</p>');
    test.appendTo(sandbox[0]);
    var elements = q.create('<h2>Juhu</h2><h3>Kinners</h3>');
    q("#sandbox p").before(elements);
    assert.equal(2, q("#sandbox h2 + h3 + p").length);
  });

  
 
 it("before documentFragment", function() {


    var test = q.create('<p>Affe</p><p>Affe</p>');
    var df = document.createDocumentFragment();
    test.appendTo(df);
    q(df).appendTo("#sandbox");
    var elements = q.create('<h2>Juhu</h2><h3>Kinners</h3>');
    test.before(elements);
    assert.equal(2, q("#sandbox h2 + h3 + p").length);
  });

  
 
 it("after with HTML string", function() {
    var test = q.create('<p>Affe</p><p>Affe</p>');
    test.appendTo(sandbox[0]);
    q("#sandbox p").after('<h2>Juhu</h2>');
    assert.equal(2, q("#sandbox p + h2").length);

    //must be ignored:
    q([window, document]).after("<p>Foo</p>");
  });

  
 
 it("after with array of HTML strings", function() {
    var test = q.create('<p>Affe</p><p>Affe</p>');
    test.appendTo(sandbox[0]);
    q("#sandbox p").after(['<h2>Juhu</h2>', '<h3>Kinners</h3>']);
    assert.equal(2, q("#sandbox p + h2 + h3").length);
  });

  
 
 it("after with collection", function() {
    var test = q.create('<p>Affe</p><p>Affe</p>');
    test.appendTo(sandbox[0]);
    var elements = q.create('<h2>Juhu</h2><h3>Kinners</h3>');
    q("#sandbox p").after(elements);
    assert.equal(2, q("#sandbox p + h2 + h3").length);
  });

  
 
 it("insertAfter with element", function() {
    q.create('<h1>Foo</h1>').
    appendTo("#sandbox");
    q.create('<h2>Bar</h2><h3>Baz</h3>').insertAfter(q("#sandbox h1")[0]);
    assert.equal(1, q("#sandbox h1 + h2 + h3").length);

    //must be ignored:
    q([window, document]).insertAfter(q("#sandbox h1")[0]);
  });

  
 
 it("InsertAfter with collection", function() {
    q.create('<h1>Foo</h1><h1>Foo</h1>').
    appendTo("#sandbox");
    q.create('<h2>Bar</h2><h3>Baz</h3>').insertAfter("#sandbox h1");
    assert.equal(2, q("#sandbox h1 + h2 + h3").length);
  });

  
 
 it("insertBefore with element", function() {
    q.create('<h1>Foo</h1>').
    appendTo("#sandbox");
    q.create('<h2>Bar</h2><h3>Baz</h3>').insertBefore(q("#sandbox h1")[0]);
    assert.equal(1, q("#sandbox h2 + h3 + h1").length);

    //must be ignored:
    q([window, document]).insertBefore(q("#sandbox h1")[0]);
  });

  
 
 it("InsertBefore with collection", function() {
    q.create('<h1>Foo</h1><h1>Foo</h1>').
    appendTo("#sandbox");
    q.create('<h2>Bar</h2><h3>Baz</h3>').insertBefore("#sandbox h1");
    assert.equal(2, q("#sandbox h2 + h3 + h1").length);
  });

  
 
 it("wrap with HTML string", function() {
    var test = q.create('<span class="baz">Inner</span><span class="baz">Inner</span>')
    .appendTo("#sandbox");
    test.wrap('<div class="foo"><p class="bar"/></div>');
    assert.equal(2, q("#sandbox .foo .bar .baz").length);

    //must be ignored:
    q([window, document]).wrap("<div></div>");
  });

  
 
 it("wrap with element", function() {
    var test = q.create('<span class="baz">Inner</span><span class="baz">Inner</span>')
    .appendTo("#sandbox");
    var wrapper = q.create('<div class="foo"><p class="bar"/></div>').appendTo('#sandbox');
    test.wrap(wrapper[0]);
    assert.equal(2, q("#sandbox .foo .bar .baz").length);
  });

  
 
 it("wrap with selector", function() {
    var test = q.create('<span class="baz">Inner</span><span class="baz">Inner</span>')
    .appendTo('#sandbox');
    q.create('<div class="foo"><p class="bar"/></div>').appendTo('#sandbox');
    test.wrap('.foo');
    assert.equal(2, q('#sandbox .foo .bar .baz').length);
  });

  
 
 it("wrap with list of elements", function() {
    var test = q.create('<span class="baz">Inner</span><span class="baz">Inner</span>')
    .appendTo('#sandbox');
    var wrapper = q.create('<div class="foo"><p class="bar"/></div>').appendTo('#sandbox');
    test.wrap([wrapper[0]]);
    assert.equal(2, q('#sandbox .foo .bar .baz').length);
  });

  
 
 it("wrap with collection", function() {
    var test = q.create('<span class="baz">Inner</span><span class="baz">Inner</span>')
    .appendTo('#sandbox');
    var wrapper = q.create('<div class="foo"><p class="bar"/></div>').appendTo('#sandbox');
    test.wrap(wrapper);
    assert.equal(2, q('#sandbox .foo .bar .baz').length);
  });
}); 

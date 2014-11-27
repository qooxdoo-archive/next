describe('Css', function() {

  afterEach(function() {
    q('link[href="css/style2.css"]').remove();
  });


  it("Style", function() {
    var test = q.create("<div/>");
    test.appendTo(sandbox[0]);
    test.setStyle("width", "10px");
    assert.equal("10px", test.getStyle("width"));
    test.setStyle("padding-top", "5px");
    assert.equal("5px", test.getStyle("padding-top"));
    assert.equal("5px", test.getStyle("paddingTop"));
    test.remove();

    assert.isNull(q(window).getStyle("padding-top"));
    assert.isNull(q(document).getStyle("padding-top"));

    // must be ignored:
    q([window, document]).setStyle("padding-right", "10px");
    assert.isNull(q(window).getStyle("padding-right"));
    assert.isNull(q(document).getStyle("padding-right"));
  });


  it("Styles", function() {
    var test = q.create("<div/>");
    test.appendTo(sandbox[0]);
    test.setStyles({
      "width": "10px",
      "height": "20px",
      "marginBottom": "15px"
    });
    var result = test.getStyles(["width", "height", "margin-bottom", "marginBottom"]);
    assert.equal("10px", result.width);
    assert.equal("20px", result.height);
    assert.equal("15px", result.marginBottom);
    assert.equal("15px", result["margin-bottom"]);
    test.remove();
  });


  it("SpecialProperties", function() {
    var props = {
      "css.appearance": ["appearance", "searchfield"],
      "css.textoverflow": ["textOverflow", "ellipsis"],
      "css.userselect": ["userSelect", q.env.get("css.userselect.none")],
      "css.float": ["float", "right"],
      "css.usermodify": ["userModify", "read-only"],
      "css.boxsizing": ["boxSizing", "border-box"]
    };

    for (var envKey in props) {
      var style = props[envKey][0];
      var envVal = q.env.get(envKey);
      if (!envVal) {
        continue;
      }
      var value = props[envKey][1];
      var test = q.create("<div>affe</div>").appendTo(sandbox[0])
        .setStyle(style, value);

      assert.equal(value, test.getStyle(style));
    }
  });


  it("Class", function() {
    var test = q.create("<div/><div/>");
    test.addClass("test");
    assert.equal("test", test.getAttribute("class"));
    assert.equal("test", test.eq(1).getAttribute("class"));
    assert.equal("test", test.getClass());
    assert.isTrue(test.eq(0).hasClass("test"));
    assert.isTrue(test.eq(1).hasClass("test"));
    test.toggleClass("test");
    assert.isFalse(test.eq(0).hasClass("test"));
    assert.isFalse(test.eq(1).hasClass("test"));
    assert.equal("", test.getClass());
    test.toggleClass("test");
    assert.isTrue(test.eq(0).hasClass("test"));
    assert.isTrue(test.eq(1).hasClass("test"));
    assert.equal("test", test.getClass());
    test.removeClass("test");
    assert.isFalse(test.eq(0).hasClass("test"));
    assert.isFalse(test.eq(1).hasClass("test"));
    assert.equal("", test.getClass());
    test.addClass("test");
    test.replaceClass("test", "foo");
    assert.isFalse(test.eq(0).hasClass("test"));
    assert.isFalse(test.eq(1).hasClass("test"));
    assert.isTrue(test.eq(0).hasClass("foo"));
    assert.isTrue(test.eq(1).hasClass("foo"));
    assert.equal("foo", test.getClass());

    // must be ignored:
    q([window, document]).addClass("test");
    assert.equal("", q(window).getClass("test"));
    assert.equal("", q(document).getClass("test"));
    assert.isFalse(q(window).hasClass("test"));
    assert.isFalse(q(document).hasClass("test"));
    q([window, document]).removeClass("test");
    q([window, document]).replaceClass("foo", "bar");
    q([window, document]).toggleClass("bar");
  });


  it("Classes", function() {
    var test = q.create("<div/><div/>");
    test.addClasses(["foo", "bar"]);
    assert.isTrue(test.eq(0).hasClass("foo"));
    assert.isTrue(test.eq(0).hasClass("foo"));
    assert.isTrue(test.eq(1).hasClass("bar"));
    assert.isTrue(test.eq(1).hasClass("bar"));
    assert.equal("foo bar", test.getClass());
    test.toggleClass("bar");
    assert.isTrue(test.eq(0).hasClass("foo"));
    assert.isFalse(test.eq(0).hasClass("bar"));
    assert.isTrue(test.eq(1).hasClass("foo"));
    assert.isFalse(test.eq(1).hasClass("bar"));
    assert.equal("foo", test.getClass());
    test.addClass("bar");
    test.removeClasses(["foo", "bar"]);
    assert.isFalse(test.eq(0).hasClass("foo"));
    assert.isFalse(test.eq(0).hasClass("bar"));
    assert.isFalse(test.eq(1).hasClass("foo"));
    assert.isFalse(test.eq(1).hasClass("bar"));
    assert.equal("", test.getClass());
    test.addClass("bar");
    test.toggleClasses(["foo", "bar", "baz"]);
    assert.isTrue(test.eq(0).hasClass("foo"));
    assert.isFalse(test.eq(0).hasClass("bar"));
    assert.isTrue(test.eq(0).hasClass("baz"));
    assert.isTrue(test.eq(1).hasClass("foo"));
    assert.isFalse(test.eq(1).hasClass("bar"));
    assert.isTrue(test.eq(1).hasClass("baz"));
    assert.match(test.getClass(), /foo baz/g);

    // must be ignored:
    q([window, document]).addClasses(["foo", "bar"]);
    q([window, document]).removeClasses(["foo", "bar"]);
    q([window, document]).toggleClasses(["foo", "bar", "baz"]);
  });


  it("GetHeightElement", function() {
    var test = q.create("<div style='height: 100px'></div><div></div>");
    test.appendTo(sandbox[0]);
    assert.isNumber(test.getHeight());
    assert.equal(100, test.getHeight());
    test.remove();
  });


  it("GetHeightNonDisplayedElement", function() {
    var test = q.create("<div style='display: none; height: 100px'></div><div></div>");
    test.appendTo(sandbox[0]);
    assert.isNumber(test.getHeight(true));
    assert.equal(100, test.getHeight(true));
    test.remove();
  });


  it("GetHeightDocument", function() {
    assert.isNumber(q(document).getHeight());
  });


  it("GetHeightWindow", function() {
    assert.isNumber(q(window).getHeight());
  });


  it("GetWidthElement", function() {
    var test = q.create("<div style='width: 100px'></div><div></div>");
    test.appendTo(sandbox[0]);
    assert.isNumber(test.getWidth());
    assert.equal(100, test.getWidth());
    test.remove();
  });


  it("GetWidthNonDisplayedElement", function() {
    var test = q.create("<div style='display: none; width: 100px'></div><div></div>");
    test.appendTo(sandbox[0]);
    assert.isNumber(test.getWidth(true));
    assert.equal(100, test.getWidth(true));
    test.remove();
  });


  it("GetWidthDocument", function() {
    assert.isNumber(q(document).getWidth());
  });


  it("GetWidthWindow", function() {
    assert.isNumber(q(window).getWidth());
  });


  it("GetOffset", function() {
    var test = q.create("<div style='position: absolute; top: 100px'></div><div></div>");
    test.appendTo(sandbox[0]);
    assert.isNumber(test.getOffset().top);
    assert.isNumber(test.getOffset().right);
    assert.isNumber(test.getOffset().bottom);
    assert.isNumber(test.getOffset().left);
    assert.equal(100, test.getOffset().top);
    assert.isNull(q(window).getOffset());
    assert.isNull(q(document).getOffset());
  });


  it("GetContentHeight", function() {
    var test = q.create("<div id='test'></div>").setStyles({
      position: "absolute",
      height: "200px",
      padding: "50px"
    });
    test.appendTo(sandbox[0]);

    assert.equal(200, test.getContentHeight());
  });


  it("GetContentHeightNonDisplayedElement", function() {
    var test = q.create("<div id='test'></div>").setStyles({
      position: "absolute",
      height: "200px",
      padding: "50px",
      display: "none"
    });
    test.appendTo(sandbox[0]);

    assert.equal(200, test.getContentHeight(true));
  });


  it("GetContentWidth", function() {
    var test = q.create("<div id='test'></div>").setStyles({
      position: "absolute",
      width: "200px",
      padding: "50px"
    });
    test.appendTo(sandbox[0]);

    assert.equal(200, test.getContentWidth());
  });


  it("GetContentWidthNonDisplayedElement", function() {
    var test = q.create("<div id='test'></div>").setStyles({
      position: "absolute",
      width: "200px",
      padding: "50px",
      display: "none"
    });
    test.appendTo(sandbox[0]);

    assert.equal(200, test.getContentWidth(true));
  });


  it("GetPosition", function() {
    var outer = q.create('<div id="outer"></div>').setStyles({
      padding: 0,
      backgroundColor: "red",
      position: "absolute",
      top: "0px",
      left: "0px"
    }).appendTo(sandbox[0]);

    var test = q.create('<div id="affe"></div>').setStyles({
      margin: "10px"
    }).appendTo(outer[0]);

    var pos = test.getPosition();
    assert.equal(10, pos.left);
    assert.equal(10, pos.top);
  });


  it("IncludeStylesheet", function(done) {
    var styleSheet = "css/style2.css";
    q.includeStylesheet(styleSheet);
    q.create('<div id="affe"></div>').appendTo(sandbox[0]);

    var self = this;
    window.setTimeout(function() {
      var val;
      if (typeof window.getComputedStyle == "function") {
        var compStyle = window.getComputedStyle(q("#sandbox #affe")[0], null);
        val = compStyle.borderTopWidth;
      } else {
        val = q("#sandbox #affe").getStyle("border-top-width");
      }
      assert.equal("1px", val);
      done();
    }, 250);

  });


  it("HideShow", function() {
    var test = q.create('<div style="display: inline">Yoohoo</div>')
      .appendTo(sandbox[0]);
    test.hide();
    assert.equal("none", test.getStyle("display"));
    test.show();
    assert.equal("inline", test.getStyle("display"));

    // no previous value:
    var test2 = q.create('<span style="display: none">Yoohoo</span>')
      .appendTo(sandbox[0]);
    test2.show();
    assert.equal("inline", test2.getStyle("display"));

    // must be ignored:
    q([window, document]).hide().show();
  });
});

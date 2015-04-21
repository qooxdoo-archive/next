describe("module.Animation", function() {

  afterEach(function() {
    q('link[href="css/style2.css"]').remove();
  });


  it("FadeOut", function(done) {
    var test = q.create("<div id='testdiv'/>");
    test.appendTo(sandbox[0]);
    test.on("animationEnd", function() {
      assert.equal("none", test[0].style["display"]);
      test.remove();
      done();
    }, test);
    test.fadeOut();
  });


  it("FadeIn", function(done) {
    var test = q.create("<div id='testdiv'/>");
    test.appendTo(sandbox[0]);
    test.on("animationEnd", function() {
      if (qxWeb.env.get("browser.name") === "ie" && qxWeb.env.get("browser.version") <= 9) {
        assert.equal(0.99, test.getStyle("opacity"), "not visible after the animation");
      } else {
        assert.equal(1, test.getStyle("opacity"), "not visible after the animation");
      }

      test.remove();
      done();
    }, test);
    test.fadeIn();
  });


  it("FadeInWithInvisibleElement", function(done) {
    var styleSheet = "css/style2.css";
    q.includeStylesheet(styleSheet);

    var test = q.create('<div id="invisible"></div>');
    test.appendTo(sandbox[0]);

    test.on('animationEnd', function() {
      setTimeout(function() {
        if (qxWeb.env.get("browser.name") === "ie" && qxWeb.env.get("browser.version") <= 9) {
          assert.equal(0.99, test.getStyle("opacity"), "not visible after the animation");
        } else {
          assert.equal(1, test.getStyle("opacity"), "not visible after the animation");
        }

        test.remove();
        var sheets = [].filter.call(document.styleSheets, function(sheet) {
          return sheet.href && sheet.href.indexOf("style2.css") != -1;
        });
        sheets.length > 0 && q(sheets[0].ownerNode).remove();
        done();
      }, 10);
    }, test);
    test.fadeIn();
  });


  it("NewCollectionPlaying", function() {
    var test = q.create("<div id='testdiv'/>");
    test.appendTo(sandbox[0]);
    test.fadeIn();
    assert.isTrue(q("#testdiv").isPlaying());
  });


  it("NonElement", function() {
    // non-element node objects should be ignored (no error)
    q(window, document).fadeOut();
  });
});

describe("module.Blocker", function() {


  afterEach(function() {
    q(document).unblock();
    sandbox.getChildren().forEach(function(el) {
      el.unblock();
    });
    q('link[href="css/style2.css"]').remove();
  });


  it("Blocker", function() {
    var styles = {
      position: "absolute",
      top: "250px",
      left: "200px",
      width: "200px",
      height: "150px"
    };
    var test = q.create('<div id="foo"></div>').setStyles(styles)
      .appendTo(sandbox[0]);

    test.block("#00FF00", 1);

    var blockerDiv = test[0].$$blocker.div;
    assert.isTrue(q.$$qx.dom.Hierarchy.isRendered(blockerDiv[0]));
    var blockerLocation = blockerDiv.getOffset();
    assert.equal(styles.top, blockerLocation.top + "px");
    assert.equal(styles.left, blockerLocation.left + "px");
    assert.equal(styles.width, blockerDiv.getWidth() + "px");
    assert.equal(styles.height, blockerDiv.getHeight() + "px");
    assert.equal(1, blockerDiv.getStyle("opacity"));
    assert.match(blockerDiv.getStyle("backgroundColor"), /(rgb.*?0,.*?255.*?0|#00ff00)/i);

    test.unblock();

    assert.isFalse(q.$$qx.dom.Hierarchy.isRendered(blockerDiv[0]));

    var newStyles = {
      top: "400px",
      left: "500px",
      width: "250px",
      height: "175px"
    };
    test.setStyles(newStyles);

    test.block();

    assert.isTrue(q.$$qx.dom.Hierarchy.isRendered(blockerDiv[0]));
    blockerLocation = blockerDiv.getOffset();
    assert.equal(newStyles.top, blockerLocation.top + "px");
    assert.equal(newStyles.left, blockerLocation.left + "px");
    assert.equal(newStyles.width, blockerDiv.getWidth() + "px");
    assert.equal(newStyles.height, blockerDiv.getHeight() + "px");

    test.unblock();
  });


  it("BlockDocument", function() {
    q(document).block();

    var blockerDiv = document.$$blocker.div;
    assert.isTrue(q.$$qx.dom.Hierarchy.isRendered(blockerDiv[0]));
    assert.equal(q(document.body).getChildren(":first-child")[0], blockerDiv[0]);
    assert.equal('fixed', blockerDiv.getStyle("position"));
    assert.equal('100%', blockerDiv[0].style.width);
    assert.equal('100%', blockerDiv[0].style.height);

    q(document).unblock();

    assert.isFalse(q.$$qx.dom.Hierarchy.isRendered(blockerDiv[0]));
  });


  it("GetBlockerElements", function() {
    var styles = {
      position: "absolute",
      top: "250px",
      left: "200px",
      width: "200px",
      height: "150px"
    };

    q.create('<div id="foo"></div>').setStyles(styles).appendTo(sandbox[0]);
    q.create('<div id="bar"></div>').setStyles(styles).appendTo(sandbox[0]);

    var test = sandbox.getChildren();

    test.block();

    var blockerCollection = test.getBlocker();
    assert.instanceOf(blockerCollection, q);
    assert.equal(2, blockerCollection.length);
    assert.isTrue(qxWeb.isElement(blockerCollection[0]));
    assert.isTrue(qxWeb.isElement(blockerCollection[1]));

    test.unblock();
  });


  it("GetBlockerWithoutBlockingBefore", function() {
    var styles = {
      position: "absolute",
      top: "250px",
      left: "200px",
      width: "200px",
      height: "150px"
    };
    var test = q.create('<div id="foo"></div>').setStyles(styles)
      .appendTo(sandbox[0]);

    var blockerCollection = test.getBlocker();
    assert.instanceOf(blockerCollection, q);
    assert.equal(0, blockerCollection.length);
  });


  it("BlockerWithCSSClassStyling", function(done) {
    var styleSheet = "css/style2.css";
    q.includeStylesheet(styleSheet);

    q(document).block();
    var blockerDiv = document.$$blocker.div;

    window.setTimeout(function() {
      var opacity = (qxWeb.env.get("browser.name") === "ie" && qxWeb.env.get("browser.version") <= 8) ? 0 : 0.7;

      assert.match(blockerDiv.getStyle("backgroundColor"), /(rgb.*?255,.*?0.*?0|#ff0000)/i);
      assert.equal('8000', blockerDiv.getStyle('zIndex'));
      assert.equal(opacity, (Math.round(blockerDiv.getStyle('opacity') * 10) / 10));

      q(document).unblock();
      q('link[href="css/style2.css"]').remove();
      done();
    }, 500);
  });


  it("BlockerWithJSStyling", function() {
    q(document).block('#00FF00', 0.6, 7000);
    var blockerDiv = document.$$blocker.div;

    assert.match(blockerDiv.getStyle("backgroundColor"), /(rgb.*?0,.*?255.*?0|#00ff00)/i);
    assert.equal('7000', blockerDiv.getStyle('zIndex'));
    assert.equal('0.6', (Math.round(blockerDiv.getStyle('opacity') * 10) / 10));

    q(document).unblock();
  });
});

describe("module.MatchMedia", function() {

  beforeEach(function() {
    this.__iframe = q.create('<iframe src="html/media.html" frameborder="0" width="500" height="400" name="Testframe"></iframe>');
    this.__iframe.appendTo(sandbox[0]);
  });


  afterEach(function() {
    qxWeb(window).off('message', null, null);
  });


  it("MediaQueryMatches", function() {

    if (qxWeb.env.get("qx.debug")) {
      return;
    }

    var iframe = this.__iframe[0];
    sandbox.mediaQueryToClass("only screen", "testMediaQueryMatches", iframe.window);

    assert.isTrue(sandbox.hasClass("testMediaQueryMatches"));
  });


  it("MediaQueryNotMatches", function() {

    if (qxWeb.env.get("qx.debug")) {
      return;
    }

    var iframe = this.__iframe[0];
    sandbox.mediaQueryToClass("only print", "testMediaQueryNotMatches", iframe.window);

    assert.isFalse(sandbox.hasClass("testMediaQueryNotMatches"));
  });


  it("MediaQueryMatchesAfterResizing", function(done) {

    if (qxWeb.env.get("qx.debug")) {
      done();
      return;
    }

    var iframe = this.__iframe[0];
    sandbox.mediaQueryToClass("only screen and (min-width: 40.063em)", "testMediaQueryMatchesAfterResizing", iframe.window);

    iframe.width = 800;

    setTimeout(function() {
      assert.isTrue(sandbox.hasClass("testMediaQueryMatchesAfterResizing"));
      done();
    }, 1000);
  });
});

describe('event.TrackHandler', function() {

  beforeEach(function() {
    globalSetup();
  });


  afterEach(function() {
    globalTeardown();
  });


  it("Register", function() {
    var cb = function() {};
    var test = q.create('<div></div>').appendTo(sandbox[0])
      .on("track", cb)
      .on("trackstart", cb);
    assert.equal("qx.event.handler.Track", test[0].$$trackHandler.classname);
    test.off("track", cb);
    assert.isNotNull(test[0].$$trackHandler);
    test.off("trackstart", cb);
    assert.isUndefined(test[0].$$trackHandler);
  });


  it("DisposeHandler", function() {
    var cb = function() {};
    sandbox
      .on("track", cb)
      .on("trackstart", cb)
      .off("track", cb);
    assert.isDefined(sandbox[0].$$trackHandler);
    sandbox.off("trackstart", cb);
    assert.isUndefined(sandbox[0].$$trackHandler);
  });


  it("RemoveMultiple", function() {
    var cb = function() {};
    sandbox
      .on("track", cb)
      .on("trackstart", cb)
      .off("trackstart", cb)
      .off("trackstart", cb);
    assert.isDefined(sandbox[0].$$trackHandler);
    sandbox.off("track", cb);
    assert.isUndefined(sandbox[0].$$trackHandler);
  });
});

describe('event.GestureHandler', function() {

  beforeEach (function () {
    globalSetup();
  });
  afterEach (function () {
    globalTeardown();
  });
 
  it("Register", function() {
    var cb = function() {};
    var test = q.create('<div></div>').appendTo(sandbox[0])
    .on("tap", cb)
    .on("swipe", cb);
    assert.equal("qx.event.handler.GestureCore", test[0].$$gestureHandler.classname);
    test.off("tap", cb);
    assert.isNotNull(test[0].$$gestureHandler);
    test.off("swipe", cb);
    assert.isUndefined(test[0].$$gestureHandler);
  });
 
  it("DisposeHandler", function() {
    var cb = function() {};
    sandbox
      .on("tap", cb)
      .on("swipe", cb)
      .off("tap", cb);
    assert.isDefined(sandbox[0].$$gestureHandler);
    sandbox.off("swipe", cb);
    assert.isUndefined(sandbox[0].$$gestureHandler);
  });
 
  it("RemoveMultiple", function() {
    var cb = function() {};
    sandbox
      .on("tap", cb)
      .on("swipe", cb)
      .off("swipe", cb)
      .off("swipe", cb);
    assert.isDefined(sandbox[0].$$gestureHandler);
    sandbox.off("tap", cb);
    assert.isUndefined(sandbox[0].$$gestureHandler);
  });
}); 
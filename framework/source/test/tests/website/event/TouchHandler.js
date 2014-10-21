describe('event.TouchHandler', function() {

  beforeEach(function() {
    globalSetup();
  });


  afterEach(function() {
    globalTeardown();
  });


  it("Register", function() {
    //require(["qx.debug"]);
    var cb = function() {};
    var test = q.create('<div></div>').appendTo(sandbox[0])
      .on("touchstart", cb).on("touchmove", cb);
    assert.equal("qx.event.handler.TouchCore", test[0].$$touchHandler.classname);
    test.off("touchstart", cb);
    assert.isNotNull(test[0].$$touchHandler);
    test.off("touchmove", cb);
    assert.isNull(test[0].$$touchHandler);
  });
});

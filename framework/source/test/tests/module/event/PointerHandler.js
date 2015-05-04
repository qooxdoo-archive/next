describe('event.PointerHandler', function() {

  it("Register", function() {
    //this.require(["qx.debug"]);
    if (q.$$qx.core.Environment.get("event.mspointer")) {
      return;
    }
    var cb = function() {};
    var test = q.create('<div></div>').appendTo(sandbox[0])
      .on("pointerdown", cb)
      .on("pointerup", cb);
    assert.equal("qx.event.handler.Pointer", test[0].$$pointerHandler.classname);
    test.off("pointerdown", cb);
    assert.isDefined(test[0].$$pointerHandler);
    test.off("pointerup", cb);
    assert.isUndefined(test[0].$$pointerHandler);
  });

  var __onMouseDown = function(e) {
    setTimeout(function() {
      q(document).off("mousedown", __onMouseDown, this);
      assert.equal("mousedown", e.getType());
    }, 0);
  };

  it("NativeBubbling", function(done) {
    sandbox.on("pointerdown", function() {});
    q(document).on("mousedown", __onMouseDown);
    setTimeout(function() {
      var domEvent = createMouseEvent("mousedown");
      sandbox[0].dispatchEvent ?
        sandbox[0].dispatchEvent(domEvent) :
        sandbox[0].fireEvent("onmousedown", domEvent);
      done();
    }, 250);
  });


  it("DisposeHandler", function() {
    var cb = function() {};
    sandbox
      .on("pointerdown", cb)
      .on("pointerup", cb)
      .off("pointerdown", cb);
    assert.isDefined(sandbox[0].$$pointerHandler);
    sandbox.off("pointerup", cb);
    assert.isUndefined(sandbox[0].$$pointerHandler);
  });


  it("RemoveMultiple", function() {
    var cb = function() {};
    sandbox
      .on("pointerdown", cb)
      .on("pointerup", cb)
      .off("pointerup", cb)
      .off("pointerup", cb);
    assert.isDefined(sandbox[0].$$pointerHandler);
    sandbox.off("pointerdown", cb);
    assert.isUndefined(sandbox[0].$$pointerHandler);
  });
});

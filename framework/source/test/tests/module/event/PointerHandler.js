describe('event.PointerHandler', function() {

  var createMouseEvent = function(type) {
    var domEvent;
    if (qxWeb.env.get("event.customevent")) {
      domEvent = new MouseEvent(type, {
        canBubble: true,
        cancelable: true,
        view: window,
      });
      domEvent.initMouseEvent(type, true, true, window,
        1, 0, 0, 0, 0,
        false, false, false, false,
        0, null);
    } else if (document.createEvent) {
      domEvent = document.createEvent("UIEvents");
      domEvent.initEvent(type, true, true);
    } else if (document.createEventObject) {
      domEvent = document.createEventObject();
      domEvent.type = type;
    }
    return domEvent;
  };


  it("Register", function() {
    //this.require(["qx.debug"]);
    if (q.$$qx.core.Environment.get("event.mspointer")) {
      return;
    }
    var cb = function() {};
    var test = q.create('<div></div>').appendTo(sandbox[0])
      .on("pointerdown", cb)
      .on("pointerup", cb);
    assert.equal("qx.event.handler.PointerCore", test[0].$$pointerHandler.classname);
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

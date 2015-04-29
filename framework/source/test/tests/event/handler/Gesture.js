describe("event.handler.Gesture", function() {

  it("checkAndFireGesture", function() {
    var handler = sinonSandbox.spy();
    var elem = q.create('<div></div>').appendTo(sandbox[0]);
    var evt = new qx.event.handler.Gesture(elem);

    elem.on("gesturebegin", function() {
      evt.checkAndFireGesture(elem, "gesturebegin");
      handler.call();
    });

    // elem.on("gesturemove", function() {
    //   evt.checkAndFireGesture(elem, "gesturemove");
    //   handler.call();
    // });

    elem.on("gesturefinish", function() {
      evt.checkAndFireGesture(elem, "gesturefinish", sandbox[0]);
      handler.call();
    });

    elem.on("gesturecancel", function() {
      evt.checkAndFireGesture(elem, "gesturecancel", sandbox[0]);
      handler.call();
    });

    elem.emit("gesturebegin", elem);
    // elem.emit("gesturemove", elem);
    elem.emit("gesturefinish", elem);
    elem.emit("gesturebegin", elem);
    elem.emit("gesturecancel", elem);
    sinon.assert.callCount(handler, 4);

    evt.dispose();
  });


});

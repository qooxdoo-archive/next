describe("event.type.dom.Pointer", function() {

  beforeEach(function() {
    var domEvent = createMouseEvent("mousedown");
    this.evt = new qx.event.type.dom.Pointer("pointerdown", domEvent, "detail");
    qx.event.type.dom.Pointer.normalize(this.evt);
  });


  it("getPointerType", function() {
    var evt = this.evt;
    var type = evt.getPointerType();
    assert.equal(type, "");
  });


  it("getViewportCoordinates", function() {
    var evt = this.evt;
    var left = evt.getViewportLeft();
    var top = evt.getViewportTop();
    assert.equal(left, 0);
    assert.equal(top, 0);
  });


  it("getDocumentCoordinates", function() {
    var evt = this.evt;
    var left = evt.getDocumentTop();
    var top = evt.getDocumentLeft();
    assert.equal(left, 0);
    assert.equal(top, 0);
  });


  it("getScreenCoordinates", function() {
    var evt = this.evt;
    var left = evt.getScreenTop();
    var top = evt.getScreenLeft();
    assert.equal(left, 0);
    assert.equal(top, 0);
  });


});

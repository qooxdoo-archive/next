describe("event.type.dom.Custom", function(){


  it("preventDefault", function() {
    elem = q.create("<div id='main'><h2>first header</h2><p>para 1 (within)</p><p>para 2 (within)</p><div>div 1</div></div>").appendTo(sandbox[0]);
    var evt = new qx.event.type.dom.Custom("pointerdown", elem, "detail");
    assert.isUndefined(evt.preventDefault());
   });

 });
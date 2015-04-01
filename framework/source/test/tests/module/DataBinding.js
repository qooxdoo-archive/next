describe("module.DataBinding", function() {

  var stub;
  beforeEach(function() {
    stub = sinon.stub(qx.Class, "define");
  });


  afterEach(function() {
    stub.restore();
  });


  it("define: properties", function() {
    qxWeb.model.define("M", {
      properties: {
        a: {},
        b: {init: 123}
      }
    });

    assert.equal("M", stub.args[0][0]);
    assert.isTrue(stub.args[0][1].properties.a.event);
    assert.equal(123, stub.args[0][1].properties.b.init);
    assert.isTrue(stub.args[0][1].properties.b.event);
  });


  it("define: extend", function() {
    qxWeb.model.define("M", {
      properties: {
        a: {},
      }
    });

    assert.equal(qx.event.Emitter, stub.args[0][1].extend);
  });


  it("define: extend override", function() {
    qxWeb.model.define("M", {
      extend: Object,
      properties: {
        a: {},
      }
    });

    assert.equal(Object, stub.args[0][1].extend);
  });


  it("define: bubbles", function() {
    qxWeb.model.define("M", {
      bubbling: true,
      properties: {
        a: {},
      }
    });

    assert.isUndefined(stub.args[0][1].bubbling);
    assert.equal(qx.data.marshal.MEventBubbling, stub.args[0][1].include[0]);
    assert.equal("_applyEventPropagation", stub.args[0][1].properties.a.apply);
  });


  it("define: bubbles with include", function() {
    qxWeb.model.define("M", {
      include: [Object],
      bubbling: true,
      properties: {
        a: {},
      }
    });

    assert.isUndefined(stub.args[0][1].bubbling);
    assert.equal(qx.data.marshal.MEventBubbling, stub.args[0][1].include[1]);
    assert.equal("_applyEventPropagation", stub.args[0][1].properties.a.apply);
  });
});
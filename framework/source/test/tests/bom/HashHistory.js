describe("bom.HashHistory", function() {

  beforeEach(function() {
    __history = new qx.bom.HashHistory();
    sinonSandbox.spy(__history, "_writeState");
  });

  afterEach(function(){
    __history.dispose();
  });

  it("addToHistory", function(){
    __history.addToHistory("foo","baz");
    sinon.assert.calledOnce(__history._writeState);
  });

});

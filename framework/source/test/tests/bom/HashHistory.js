describe("bom.HashHistory", function() {

  var __history;
  beforeEach(function() {
    __history = new qx.bom.HashHistory();
    sinonSandbox.spy(__history, "_writeState");
  });

  afterEach(function(){
    __history.dispose();
  });

  it("addToHistory", function(){
    if (qxWeb.env.get("engine.name") == "gecko") {
      // changing the iframe's URI hash in Firefox causes an exception:
      // "Unexpected error"  nsresult: "0x8000ffff (NS_ERROR_UNEXPECTED)"
      // Skip the test since HashHistory is only used for IE9
      this.test.skipped = true;
      return;
    }
    __history.addToHistory("foo","baz");
    sinon.assert.calledOnce(__history._writeState);
  });

});

describe("module.IO", function() {

  it("BasicXhr", function(done) {
    q.io.xhr("scriptload.js").on("loadend", function(xhr) {
      assert.equal(xhr.readyState, 4);
      xhr.dispose();
      done();
    }, this).send();
  });


  it("XhrWithHeader", function(done) {
    q.io.xhr("scriptload.js", {
      header: {
        "Content-Type": "application/json"
      }
    }).on("loadend", function(xhr) {
      assert.equal(xhr.readyState, 4);
      xhr.dispose();
      done();
    }, this).send();
  });


  it("BasicScript", function(done) {
    var req = q.io.script("scriptload.js").on("loadend", function() {
      assert.equal(req.readyState, 4);
      assert.equal(window.qTest, "loaded"); // will be set by the test file
      window.qTest = undefined;
      req.dispose();
      done();
    }, this).send();
  });


  it("BasicJsonp", function(done) {
    var req = q.io.jsonp("jsonpload.js", {
      callbackName: "callback"
    }).on("loadend", function() {
      assert.equal(req.readyState, 4);
      assert.equal(req.response.data, "test"); // comes from the test file
      req.dispose();
      done();
    }, this).send();
  });


  it("AutomatedJsonPCallback", function() {
    var jsonp = q.io.jsonp("jsonpload.js", {
      callbackName: "callback"
    }).send();

    var checkForReserverdURLChars = /[\!#\$&'\(\)\*\+,\/\:;\=\?@\[\]]/;
    var url = jsonp.getGeneratedUrl();
    var callbackPart = url.substr(url.indexOf("=") + 1);

    assert.isFalse(checkForReserverdURLChars.test(callbackPart), "Generated URL is not valid");
  });
});

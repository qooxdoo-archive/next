describe("module.IO", function() {

  it("BasicXhr", function(done) {
    q.io.xhr("scriptload.js").on("loadend", function(xhr) {
      setTimeout(function() {
        assert.equal(4, xhr.readyState);
        xhr.dispose();
        done();
      }, 0);
    }, this).send();
  });


  it("XhrWithHeader", function(done) {
    q.io.xhr("scriptload.js", {
      header: {
        "Content-Type": "application/json"
      }
    }).on("loadend", function(xhr) {
      setTimeout(function() {
        assert.equal(4, xhr.readyState);
        xhr.dispose();
        done();
      }, 0);
    }, this).send();
  });


  it("BasicScript", function(done) {
    q.io.script("scriptload.js").on("loadend", function(script) {
      setTimeout(function() {
        assert.equal(4, script.readyState);
        assert.equal("loaded", window.qTest); // will be set by the test file
        window.qTest = undefined;
        script.dispose();
        done();
      }, 0);
    }, this).send();
  });


  it("BasicJsonp", function(done) {
    var req = q.io.jsonp("jsonpload.js", {
      callbackName: "callback"
    }).on("loadend", function() {
      setTimeout(function() {
        assert.equal(req.readyState, 4);
        assert.equal(req.response.data, "test"); // comes from the test file
        req.dispose();
        done();
      }, 0);
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

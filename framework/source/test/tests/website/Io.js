describe('IO', function() {

  it("BasicXhr", function(done) {
    q.io.xhr("tests.js").on("loadend", function(xhr) {
      setTimeout(function (){
        assert.equal(4, xhr.readyState);
        xhr.dispose();
        done();
      }, 0);
    }, this).send();
  });

  it("XhrWithHeader", function(done) {
    q.io.xhr("tests.js", {header: {"Content-Type": "application/json"}}).on("loadend", function(xhr) {
     setTimeout(function (){
        assert.equal(4, xhr.readyState);
        xhr.dispose();
        done();
      }, 0);
    }, this).send();
  });

  it("BasicScript", function(done) {
    q.io.script("scriptload.js").on("loadend", function(script) {
     setTimeout(function (){
        assert.equal(4, script.readyState);
        assert.equal("loaded", window.qTest); // will be set by the test file
        window.qTest = undefined;
        script.dispose();
        done();
      }, 0);
    }, this).send();
  });

  it("BasicJsonp", function(done) {
    q.io.jsonp("jsonpload.js", {callbackName: "callback"}).on("loadend", function(req) {
      setTimeout(function (){
        assert.equal(4, req.readyState);
        assert.equal("test", req.responseJson.data); // comes from the test file
        req.dispose();
        done();
      }, 0);
    }, this).send();
  });

  it("AutomatedJsonPCallback", function() {
    var jsonp = q.io.jsonp("jsonpload.js");

    var checkForReserverdURLChars = /[\!#\$&'\(\)\*\+,\/\:;\=\?@\[\]]/;
    var url = jsonp.getGeneratedUrl();
    var callbackPart = url.substr(url.indexOf("=") + 1);

    assert.isFalse(checkForReserverdURLChars.test(callbackPart), "Generated URL is not valid");
  });
});
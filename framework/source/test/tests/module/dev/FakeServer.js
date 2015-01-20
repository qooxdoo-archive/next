describe('FakeServer', function() {
this.timeout(5000);

  it("ConfiguredResponse", function(done) {
    var url = "/doesnotexist" + Date.now();
    var expectedResponse = "OK";

    sinonSandbox.useFakeServer([{
      method: "GET",
      url: url,
      response: expectedResponse
    }]);

    var req = q.io.xhr(url);
    req.on("readystatechange", function() {
      if (req.status == 200 && req.readyState == 4 && req.responseText == expectedResponse) {
        setTimeout(function() {
          done();
        }, 20);
      }
    }, this);
    req.send();
  });


  it("RemoveResponse", function(done) {
    var url = "/doesnotexist" + Date.now();
    var expectedResponse = "OK";

    sinonSandbox.useFakeServer([{
      method: "GET",
      url: url,
      response: expectedResponse
    }]);

    sinonSandbox.useFakeServer().restore("GET", url);

    var req = q.io.xhr(url);
    req.on("readystatechange", function() {
      if (req.status == 404 && req.readyState == 4) {
        setTimeout(function() {
          done();
        }, 10);
      }
    }, this);
    req.send();
  });


  it("RespondWith", function(done) {
    var url = "/doesnotexist" + Date.now();
    var expectedResponse = "OK";
    sinonSandbox.useFakeServer().respondWith("GET", url, expectedResponse);

    var req = q.io.xhr(url);
    req.on("readystatechange", function() {
      if (req.status == 200 && req.readyState == 4 && req.responseText == expectedResponse) {
        setTimeout(function() {
          done();
        }, 10);
      }
    }, this);
    req.send();
  });
});

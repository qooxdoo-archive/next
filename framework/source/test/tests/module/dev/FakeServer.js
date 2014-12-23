describe('FakeServer', function() {

  afterEach(function() {
    sinonSandbox.fakeServer.restore();
  });


  it("ConfiguredResponse", function(done) {
    debugger;
    var url = "/doesnotexist" + Date.now();
    var expectedResponse = "OK";

    sinonSandbox.fakeServer.configure([{
      method: "GET",
      url: url,
      response: expectedResponse
    }]);

    var req = q.io.xhr(url);
    req.on("readystatechange", function() {
      if (req.status == 200 && req.readyState == 4 && req.responseText == expectedResponse) {
        setTimeout(function() {
          done();
        }, 0);
      }
    }, this);
    req.send();
  });

  it("RemoveResponse", function(done) {
    var url = "/doesnotexist" + Date.now();
    var expectedResponse = "OK";

    sinonSandbox.fakeServer.configure([{
      method: "GET",
      url: url,
      response: expectedResponse
    }]);

    sinonSandbox.fakeServer.removeResponse("GET", url);

    var req = q.io.xhr(url);
    req.on("readystatechange", function() {
      if (req.status == 404 && req.readyState == 4) {
        setTimeout(function() {
          done();
        }, 0);
      }
    }, this);
    req.send();
  });


  it("RespondWith", function(done) {
    var url = "/doesnotexist" + Date.now();
    var expectedResponse = "OK";
    sinonSandbox.fakeServer.respondWith("GET", url, expectedResponse);

    var req = q.io.xhr(url);
    req.on("readystatechange", function() {
      if (req.status == 200 && req.readyState == 4 && req.responseText == expectedResponse) {
        setTimeout(function() {
          done();
        }, 0);
      }
    }, this);
    req.send();
  });
});

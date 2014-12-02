describe('FakeServer', function() {

  afterEach(function() {
    q.dev.fakeServer.restore();
  });


  it("ConfiguredResponse", function(done) {
    var url = "/doesnotexist" + Date.now();
    var expectedResponse = "OK";

    q.dev.fakeServer.configure([{
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

    q.dev.fakeServer.configure([{
      method: "GET",
      url: url,
      response: expectedResponse
    }]);

    q.dev.fakeServer.removeResponse("GET", url);

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
    q.dev.fakeServer.respondWith("GET", url, expectedResponse);

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

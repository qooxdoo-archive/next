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

    // debugger
    var req = q.io.xhr(url);
    req.on("readystatechange", function(xhr) {
      if (xhr.status == 200 && xhr.readyState == 4 && xhr.responseText == expectedResponse) {
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
    req.on("readystatechange", function(xhr) {
      if (xhr.status == 404 && xhr.readyState == 4) {
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
    req.on("readystatechange", function(xhr) {
      if (xhr.status == 200 && xhr.readyState == 4 && xhr.responseText == expectedResponse) {
        setTimeout(function() {
          done();
        }, 0);
      }
    }, this);
    req.send();
  });
});

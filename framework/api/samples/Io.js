addSample("q.io.xhr", function () {
  var req = new qx.io.request.Xhr("/some/path/file.json");

  req.on("success", function (origReq) {
    var req = origReq;

    // Response parsed according to the server's
    // response content type, e.g. JSON
    req.getResponse();
  }, this);

  // Send request
  req.send();
});

addSample("q.io.jsonp", function () {
  var req = new qx.io.request.Jsonp();
  req.url = "http://feeds.delicious.com/v2/json/popular";

  // Some services have a fixed callback name
  // req.setCallbackName("callback");

  req.addListener("success", function (e) {
    var req = e.getTarget();

    // HTTP status code indicating success, e.g. 200
    req.getStatus();

    // "success"
    req.phase;

    // JSON response
    req.getResponse();
  }, this);

  // Send request
  req.send();
});


addSample("q.io.script", function () {
  var req = new qx.io.request.Script();
  req.on("load", function () {
    // Script is loaded and parsed and
    // globals set are available
  }, this);

  req.open("GET", url);
  req.send();
});

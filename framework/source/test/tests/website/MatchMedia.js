 describe('MatchMedia', function() {

  beforeEach( function(){
    globalSetup();
    this.__iframe = q.create('<iframe src="html/media.html" frameborder="0" width="500" height="400" name="Testframe"></iframe>');
    this.__iframe.appendTo(sandbox[0]);
  });

  afterEach (function () {
   globalTeardown();
  });

  var hasNoLegacyIe = function() {
    return (qxWeb.env.get("engine.name") != "mshtml" ||
      qxWeb.env.get("browser.documentmode") > 8);
  };
 
  it("Landscape", function(done) {

    var iframe = this.__iframe[0];
    iframe.width = "500px";
    iframe.height = "400px";

    qxWeb(window).once('message',function(e){
      setTimeout(function (){
        assert.equal(e.data, "true");
        done();
      }, 0);
    },this);

    window.setTimeout(function(){
      iframe.contentWindow.postMessage("all and (orientation:landscape)",'*');
    },100);
  });
 
  it("MinWidth", function(done) {
    var iframe = this.__iframe[0];

    iframe.width = "500px";
    iframe.height = "400px";

    qxWeb
    (window).once('message',function(e){
      setTimeout(function (){ 
        assert.equal(e.data, "true");
        done();
      }, 1000);
    },this);

    window.setTimeout(function(){
      iframe.contentWindow.postMessage("all and (min-width:500px)",'*');
    },100);

  });
 
  it("MaxWidth", function(done) {

    var iframe = this.__iframe[0];

    iframe.width = "500px";
    iframe.height = "400px";

    qxWeb(window).once('message',function(e){
      setTimeout(function (){
        assert.equal(e.data, "true");
        done();
      }, 1000);
    },this);

    window.setTimeout(function(){
      iframe.contentWindow.postMessage("all and (max-width:500px)",'*');
    },100);

  });
 
  it("And", function(done) {

    var iframe = this.__iframe[0];

    iframe.width = "300px";
    iframe.height = "400px";

    qxWeb(window).once('message',function(e){
      setTimeout(function (){
        assert.equal(e.data, "false");
        done();
      }, 1000);
    },this);

    window.setTimeout(function(){
      iframe.contentWindow.postMessage("screen and (min-width: 400px) and (max-width: 700px)",'*');
    },100);

  });
 
  it("MinHeight", function(done) {
    var iframe = this.__iframe[0];

    iframe.width = "500px";
    iframe.height = "400px";

    qxWeb(window).once('message',function(e){
      setTimeout(function (){
        assert.equal(e.data, "false");
        done();
      }, 1000);
    },this);

    window.setTimeout(function(){
      iframe.contentWindow.postMessage("all and (min-height:500px)",'*');
    },100);

  });
 
  it("Color", function(done) {
    var iframe = this.__iframe[0];

    iframe.width = "500px";
    iframe.height = "400px";

    qxWeb(window).once('message',function(e){
        setTimeout(function (){
        assert.equal(e.data, "true");
        done();
      }, 1000);
    },this);

    window.setTimeout(function(){
      iframe.contentWindow.postMessage("all and (min-color: 1)",'*');
    },100);

  });
 
  it("Combined", function(done) {

    var iframe = this.__iframe[0];

    iframe.width = "800px";
    iframe.height = "400px";

    qxWeb(window).once('message',function(e){
      setTimeout(function (){
        assert.equal(e.data, "true");
        done();
      }, 1000);
    },this);

    window.setTimeout(function(){
      iframe.contentWindow.postMessage("(min-width: 700px) and (orientation: landscape)",'*');
    },100);

  });
 
  it("DeviceWidth", function(done) {
    var iframe = this.__iframe[0];

    qxWeb(window).once('message',function(e){
      setTimeout(function (){
        var dw = window.screen.width;
        var match = dw <= 799 ? "true" : "false";
        assert.equal(e.data, match);
        done();
       },1000); 
    },this);

    window.setTimeout(function(){
      iframe.contentWindow.postMessage("screen and (max-device-width: 799px)",'*');
    },100);

  });
 
  it("Width", function(done) {
    var iframe = this.__iframe[0];
    iframe.width = "800px";

    qxWeb(window).once('message',function(e){
      setTimeout(function (){
        assert.equal(e.data, "true");
        done();
      }, 1000);
    },this);

    window.setTimeout(function(){
      iframe.contentWindow.postMessage("screen and (width: 800px)",'*');
    },100);

  });
 
  it("Pixelratio", function(done) {
    var iframe = this.__iframe[0];
    iframe.width = "800px";

    qxWeb(window).once('message',function(e){
      setTimeout(function (){
        assert.equal(e.data, "true");
        done();
      }, 1000);  
    },this);

    window.setTimeout(function(){
      iframe.contentWindow.postMessage("screen and (width: 800px)",'*');
    },100);

  });
 
  it("Not", function(done) {
    var iframe = this.__iframe[0];
    iframe.width = "500px";

    qxWeb(window).once('message',function(e){
      setTimeout(function (){
        assert.equal(e.data, "true");
        done();
      }, 1000);  
    },this);

    window.setTimeout(function(){
      iframe.contentWindow.postMessage("not screen and (min-width: 800px)",'*');
    },100);
  });

  it("MediaQueryMatches", function () {
    var iframe = this.__iframe[0];
    sandbox.mediaQueryToClass("only screen", "testMediaQueryMatches", iframe.window);

    assert.isTrue(sandbox.hasClass("testMediaQueryMatches"));
  });

  it("MediaQueryNotMatches", function () {
    var iframe = this.__iframe[0];
    sandbox.mediaQueryToClass("only print", "testMediaQueryNotMatches", iframe.window);

    assert.isFalse(sandbox.hasClass("testMediaQueryNotMatches"));
  });

  it("MediaQueryMatchesAfterResizing", function(done) {
    var iframe = this.__iframe[0];
    sandbox.mediaQueryToClass("only screen and (min-width: 40.063em)","testMediaQueryMatchesAfterResizing",iframe.window);

    iframe.width = 800;

    setTimeout(function(){
      assert.isTrue(sandbox.hasClass("testMediaQueryMatchesAfterResizing"));
      done();
    }, 1000);
  });
});
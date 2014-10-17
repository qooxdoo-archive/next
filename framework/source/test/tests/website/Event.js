describe('Events', function() {

  beforeEach (function () {
   globalSetup();
  });
  afterEach (function () {
   globalTeardown();
  });
 
   it("OnOffEmit", function() {
    var test = q.create("<div/>");
    var self = this;
    var called = 0;
    var listener = function(data) {
      assert.equal(self,this);
      assert.equal(sendData,data);
      called++;
    };
    test.on("changeName", listener, this);
    var sendData = {a: 12};
    test.emit("changeName", sendData);
    assert.equal(1, called);

    test.off("changeName", listener, this);
    test.emit("changeName", sendData);
    assert.equal(1, called);
  });

  it("OnOffEmitWithoutContext", function() {
    var test = q.create("<div/>");
    var self = this;
    var called = 0;
    var listener = function(data) {
      assert.equal(sendData, data);
      called++;
    };
    test.on("changeName", listener);
    var sendData = {a: 12};
    test.emit("changeName", sendData);
    assert.equal(1, called);

    test.off("changeName", listener);
    test.emit("changeName", sendData);
    assert.equal(1, called);
  });

  it("OnOffEmitChange", function() {
    var test = q.create("<div/>");
    var self = this;
    var called = 0;
    var listener = function(data) {
      assert.equal(self,this);
      assert.equal(sendData,data);
      called++;
    };
    test.on("changeName", listener, this);
    var sendData = {a: 12};
    test.emit("changeName", sendData);
    assert.equal(1, called);

    var test2 = q(test[0]);
    test2.emit("changeName", sendData);
    assert.equal(2, called);
  });

  it("OnOffEmitMany", function() {
    var test = q.create("<div/>");
    test.add(q.create("<div/>")[0]);
    var self = this;
    var called = 0;
    var listener = function(data) {
      assert.equal(self,this);
      assert.equal(sendData,data);
      called++;
    };
    test.on("changeName", listener, this);
    var sendData = {a: 12};
    test.emit("changeName", sendData);
    assert.equal(2, called);

    test.off("changeName", listener, this);
    test.emit("changeName", sendData);
    assert.equal(2, called);
  });

  it("Once", function() {
    var test = q.create("<div/>");
    var self = this;
    var called = 0;
    var listener = function(data) {
      assert.equal(self,this);
      assert.equal(sendData,data);
      called++;
    };
    test.once("changeName", listener, this);
    var sendData = {a: 12};
    test.emit("changeName", sendData);
    assert.equal(1, called);

    test.emit("changeName", sendData);
    assert.equal(1, called);
 });
  it("OnOffEmitNative", function() {
    var test = q.create("<div id='foo'/>");
    test.appendTo(sandbox[0]);
    var obj = {
      count : 0
    }
    var callback = function (ev) {
      this.count++;
    }
    var callback2 = function (ev) {
      this.count += 2;
    }
    // two listeners on the same element/event; make sure off() removes the
    // right one
    q("#foo").on("mousedown", callback2, obj);
    q("#foo").on("mousedown", callback, obj);
    q("#foo").off("mousedown", callback, obj);
    q("#foo").emit("mousedown");
    assert.equal(2, obj.count);
    q("#foo").off("mousedown", callback2, obj);

    test.remove();
  });

  it("HasListener", function() {
    var test = q.create('<div></div>').appendTo("#sandbox");
    assert.isFalse(test.hasListener("mousedown"));
    var cb = function() {};
    test.on("mousedown", cb);
    assert.isTrue(test.hasListener("mousedown"));
    test.off("mousedown", cb);
    assert.isFalse(test.hasListener("mousedown"));
  });

  it("HasListenerWithHandler", function() {
    var test = q.create('<div></div>').appendTo("#sandbox");
    var cb = function() {};
    test.on("mousedown", cb);
    assert.isTrue(test.hasListener("mousedown", cb));
    assert.isFalse(test.hasListener("mousedown", function() {}));
    test.off("mousedown", cb);
    assert.isFalse(test.hasListener("mousedown", cb));

    var ctx = {};
    test.on("mousedown", cb, ctx);
    assert.isTrue(test.hasListener("mousedown", cb));
    assert.isFalse(test.hasListener("mousedown", function() {}));
    test.off("mousedown", cb, ctx);
    assert.isFalse(test.hasListener("mousedown", cb));
  });

  it("HasListenerWithContext", function() {
    var test = q.create('<div></div>').appendTo("#sandbox");
    var cb = function() {};
    var ctx = {};

    test.on("mousedown", cb, ctx);
    assert.isTrue(test.hasListener("mousedown", cb, ctx));
    assert.isFalse(test.hasListener("mousedown", cb, {}));
    test.off("mousedown", cb, ctx);
    assert.isFalse(test.hasListener("mousedown", cb, ctx));
  });

  it("Context", function(done) {

    window.temp = null;
    q.create('<input type="text" id="one"></input><input type="text" id="two"></input>')
    .on("mousedown", function(ev) {
      window.temp = this.getAttribute("id");
    }).appendTo("#sandbox");

    window.setTimeout(function() {
      var event = new q.$$qx.event.type.dom.Custom("mousedown");
      q("#sandbox #one")[0].dispatchEvent(event);
    }, 100);

    setTimeout(function(){
      assert.equal("one", window.temp);
      done();
    }, 200);
  });

  it("Ready", function(done) {
    var ctx = {
      ready : 0
    };
    var callback = function() {
      this.ready++;
    };

    setTimeout(function() {
      q.ready(callback.bind(ctx));
    }, 100);

    setTimeout( function() {
      assert.equal(1, ctx.ready);
      done();
    }, 200);
  });

  it("AllOffWithType", function() {
    var test = q.create('<h1>Foo</h1><div></div>').appendTo("#sandbox");
    test.eq(0).on("mouseup", function() {});
    test.eq(1).on("mousedown", function() {});
    test.allOff("mousedown");
    assert.isTrue(test.eq(0).hasListener("mouseup"));
    assert.isFalse(test.eq(1).hasListener("mousedown"));
  });

  it("AllOff", function() {
    var test = q.create('<h1>Foo</h1><div></div>').appendTo("#sandbox");
    test.eq(0).on("mouseup", function() {});
    test.eq(1).on("mousedown", function() {});
    test.allOff();
    assert.isFalse(test.eq(0).hasListener("mouseup"));
    assert.isFalse(test.eq(1).hasListener("mousedown"));
  });
});

describe('event.Normalization', function() {

  beforeEach (function () {
   globalSetup();
  });

  afterEach (function () {
   globalTeardown();
  });

  var __registerNormalization = function(type, normalizer) {
    q.define("EventNormalize" + Date.now(), {
      statics :
      {
        normalize : normalizer
      },
      classDefined : function(statics)
      {
       q.$registerEventNormalization(type, statics.normalize);
      }
     });
  }

  it("Normalization", function(done) {

    var normalizer0 = function(event) {
      event.affe = "juhu";
      return event;
    };
    __registerNormalization("mousedown", normalizer0);

    var normalizer1 = function(event) {
      event.affe += " hugo";
      return event;
    };
    __registerNormalization("mousedown", normalizer1);

    var normalizer2 = function(event) {
      event.affe += " affe";
      return event;
    };

    __registerNormalization("mousedown", normalizer2);

    var obj = {
      normalized : false
    };
    var callback = function(ev) {
      if (ev.affe && ev.affe === "juhu affe") {
        this.normalized = true;
      }
    };

    var test = q.create('<input type="text"></input>');
    test.appendTo(sandbox[0]);
    test.on("mousedown", callback, obj);

    q.$unregisterEventNormalization("mousedown", normalizer1);

    window.setTimeout(function() {
      var event = new q.$$qx.event.type.dom.Custom("mousedown");
      test[0].dispatchEvent(event);
    }, 100);

    setTimeout(function(){
      q.$unregisterEventNormalization("mousedown", normalizer0);
      assert(obj.normalized, "Event was not manipulated!");
      q.$unregisterEventNormalization("mousedown", normalizer2);
      done();
    }, 200);
  });

   it("NormalizationWildcard", function(done) {

    var normalizer = function(event) {
      event.affe = "juhu";
      return event;
    };
    __registerNormalization("*", normalizer);

    var obj1, obj2;
    obj1 = obj2 = {
      normalized : false
    };
    var callback = function(ev) {
      if (ev.affe && ev.affe === "juhu") {
        this.normalized = true;
      }
    };

    var test = q.create('<input type="text"></input>');
    test.appendTo(sandbox[0]);
    test.on("mousedown", callback, obj1);
    test.on("mouseup", callback, obj2);

    window.setTimeout(function() {
      var down = new q.$$qx.event.type.dom.Custom("mousedown");
      test[0].dispatchEvent(down);
      var up = new q.$$qx.event.type.dom.Custom("mouseup");
      test[0].dispatchEvent(up);
    }, 100);

    setTimeout(function(){
      assert(obj1.normalized, "Event was not manipulated!");
      assert(obj2.normalized, "Event was not manipulated!");
      q.$unregisterEventNormalization("*", normalizer);
      done();
    }, 200);

  });

  var __normalizeMouse = null;
   it("NormalizationForMultipleTypes", function(done) {

    __normalizeMouse = function(event) {
      event.affe = "juhu";
      return event;
    };
    __registerNormalization(["mousedown", "mouseup"], __normalizeMouse);

    var obj1, obj2;
    obj1 = obj2 = {
      normalized : false
    };
    var callback = function(ev) {
      if (ev.affe && ev.affe === "juhu") {
        this.normalized = true;
      }
    };

    var test = q.create('<input type="text" />');
    test.appendTo(sandbox[0]);
    test.on("mousedown", callback, obj1);
    test.on("mouseup", callback, obj2);

    window.setTimeout(function() {
      var event = new q.$$qx.event.type.dom.Custom("mousedown");
      test[0].dispatchEvent(event);
    }, 100);

    window.setTimeout(function() {
      var event = new q.$$qx.event.type.dom.Custom("mouseup");
      test[0].dispatchEvent(event);
    }, 250);

    setTimeout(function(){
      assert(obj1.normalized, "Mousedown event was not manipulated!");
      assert(obj2.normalized, "Mouseup event was not manipulated!");
      tearDownTestNormalizationForMultipleTypes();
      done();
    }, 500);
  });

  var tearDownTestNormalizationForMultipleTypes = function() {
    var registry = q.$getEventNormalizationRegistry();
    var before = registry["mousedown"].length + registry["mouseup"].length;
    q.$unregisterEventNormalization(["mousedown", "mouseup"], __normalizeMouse);
    var after = registry["mousedown"].length + registry["mouseup"].length;
    assert.equal((before - 2), after);
  };
});
describe('event.RegistrationHooks', function() {

  beforeEach (function () {
   globalSetup();
  });
  afterEach (function () {
   globalTeardown();
  });

  it("RegisterHook", function() {
    var test = q.create('<div></div>').appendTo(sandbox[0]);
    var registerHook = function(element, type, callback, context) {
      element.hookApplied = true;
    };
    var unregisterHook = function(element, type, callback, context) {
      element.hookApplied = false;
    };
    var hooks = q.$getEventHookRegistry();
    var onHookCount = hooks["on"]["foo"] ? hooks["on"]["foo"].length : 0;

    q.$registerEventHook(["foo"], registerHook, unregisterHook);
    assert.isArray(hooks["on"]["foo"]);
    assert.equal(onHookCount+1, hooks["on"]["foo"].length);

    var cb = function() {};
    test.on("foo", cb);
    assert.isTrue(test[0].hookApplied);

    test.off("foo", cb);
    assert.isFalse(test[0].hookApplied);

    q.$unregisterEventHook(["foo"], registerHook, unregisterHook);
    assert.equal(onHookCount, hooks["on"]["foo"].length);
  });
});

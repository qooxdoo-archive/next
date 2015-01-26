describe('event.Normalization', function() {

  var __registerNormalization = function(type, normalizer) {
    q.define("EventNormalize" + Date.now(), {
      statics: {
        normalize: normalizer
      },
      classDefined: function(statics) {
        q.$registerEventNormalization(type, statics.normalize);
      }
    });
  };


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
      normalized: false
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

    setTimeout(function() {
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
      normalized: false
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

    setTimeout(function() {
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
      normalized: false
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

    setTimeout(function() {
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
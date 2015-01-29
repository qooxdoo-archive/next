describe("module.Event", function() {

  it("OnOffEmit", function() {
    var test = q.create("<div/>");
    var self = this;
    var called = 0;
    var listener = function(data) {
      assert.equal(self, this);
      assert.equal(sendData, data);
      called++;
    };
    test.on("changeName", listener, this);
    var sendData = {
      a: 12
    };
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
    var sendData = {
      a: 12
    };
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
      assert.equal(self, this);
      assert.equal(sendData, data);
      called++;
    };
    test.on("changeName", listener, this);
    var sendData = {
      a: 12
    };
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
      assert.equal(self, this);
      assert.equal(sendData, data);
      called++;
    };
    test.on("changeName", listener, this);
    var sendData = {
      a: 12
    };
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
      assert.equal(self, this);
      assert.equal(sendData, data);
      called++;
    };
    test.once("changeName", listener, this);
    var sendData = {
      a: 12
    };
    test.emit("changeName", sendData);
    assert.equal(1, called);

    test.emit("changeName", sendData);
    assert.equal(1, called);
  });


  it("OnceWith3", function() {
    var test = q.create("<div/>");
    var called = 0;
    var listener = function(data) {called++;};
    test.once("changeName", listener);
    test.once("changeName", listener);
    test.once("changeName", listener);

    test.emit("changeName");
    assert.equal(3, called);
  });


  it("OnOffEmitNative", function() {
    var test = q.create("<div id='foo'/>");
    test.appendTo(sandbox[0]);
    var obj = {
      count: 0
    };
    var callback = function(ev) {
      this.count++;
    };
    var callback2 = function(ev) {
      this.count += 2;
    };
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

    setTimeout(function() {
      assert.equal("one", window.temp);
      done();
    }, 200);
  });


  it("Ready", function(done) {
    var ctx = {
      ready: 0
    };
    var callback = function() {
      this.ready++;
    };

    setTimeout(function() {
      q.ready(callback.bind(ctx));
    }, 100);

    setTimeout(function() {
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

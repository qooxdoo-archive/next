describe("module.Messaging", function() {

  beforeEach(function() {
    qx.log.appender.Native.SILENT = true;
  });

  afterEach(function() {
    qx.log.appender.Native.SILENT = false;
  });

  it("On", function() {
    var called = 0;
    var id = q.messaging.on("X", "test", function() {
      called = called + 1;
    });
    q.messaging.emit("X", "test");
    assert.equal(1, called);
    q.messaging.emit("X", "test");
    assert.equal(2, called);
    q.messaging.remove(id);

    q.messaging.emit("X", "test");
    assert.equal(2, called);
  });


  it("OnAny", function() {
    // counter for every handler
    var called = 0;
    var called2 = 0;
    var calledAny = 0;
    // attach 3 handler
    var id = q.messaging.on("X", "test", function() {
      called = called + 1;
    });
    var id2 = q.messaging.on("Y", "test", function() {
      called2 = called2 + 1;
    });
    var idAny = q.messaging.onAny("test", function() {
      calledAny = calledAny + 1;
    });

    // emit test
    q.messaging.emit("X", "test");
    assert.equal(1, called);
    assert.equal(0, called2);
    assert.equal(1, calledAny);

    // emit test2
    q.messaging.emit("Y", "test");
    assert.equal(1, called);
    assert.equal(1, called2);
    assert.equal(2, calledAny);

    // remove all handler
    q.messaging.remove(id);
    q.messaging.remove(id2);
    q.messaging.remove(idAny);

    // emit all events and check if the removal worked
    q.messaging.emit("X", "test");
    q.messaging.emit("X", "test2");
    assert.equal(1, called);
    assert.equal(1, called2);
    assert.equal(2, calledAny);
  });
});

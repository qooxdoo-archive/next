describe('FunctionUtil', function() {

  this.timeout(5000);

  beforeEach(function() {
    this.clock = sinonSandbox.useFakeTimers();
  });

  afterEach(function() {
    this.clock.restore();
  });

  it("FunctionDebounce", function() {

    var spy = sinonSandbox.spy();

    var deferred = q.func.debounce(spy, 300);
    deferred();

    this.clock.tick(200);
    sinon.assert.notCalled(spy);

    this.clock.tick(800);
    sinon.assert.calledOnce(spy);

  });


  it("FunctionDebounceWithEvents", function() {
    var callCounter = 0;
    var context;
    var data;
    var myCallback = function(e) {
      callCounter++;
      context = this;
      data = e;
    };

    sandbox.on("myEvent", q.func.debounce(myCallback, 200), sandbox);

    for (var i = 0; i < 5; i++) {
      this.clock.tick(50);
      sandbox.emit("myEvent", "interval_" + i);
    }
    var checkContext = sandbox;
    this.clock.tick(500);
    assert.equal(1, callCounter);
    assert.equal(checkContext, context);
    assert.equal("interval_4", data);
  });


  it("FunctionDebounceWithImmediateEvents", function() {
    var callCounter = 0;
    var context;
    var data;
    var myCallback = function(e) {
      callCounter++;
      context = this;
      data = e;
    };

    sandbox.on("myEvent", q.func.debounce(myCallback, 200, true), sandbox);

    for (var i = 0; i <= 20; i++) {
      sandbox.emit("myEvent", "interval_" + i);
      this.clock.tick(50);
      if (i === 20) {
        this.clock.tick(500);
        sandbox.emit("myEvent", "interval_" + i);
      }
    }
    var checkContext = sandbox;
    assert.equal(2, callCounter);
    assert.equal(checkContext, context);
    assert.equal("interval_20", data);

  });


  it("FunctionThrottle", function() {
    var intervalCounter = 0;
    var callInfo = [];
    var spy = sinonSandbox.spy();
    var throttled = q.func.throttle(spy, 250);
    for (var i = 0; i <= 20; i++) {
      throttled();
      this.clock.tick(25);
    }
    sinon.assert.calledTwice(spy);
  });


  it("FunctionThrottleNoTrailing", function() {
    var intervalCounter = 0;
    var callInfo = [];
    var spy = sinonSandbox.spy();
    var throttled = q.func.throttle(spy, 500, {
      trailing: false
    });

    for (var i = 0; i <= 20; i++) {
      this.clock.tick(90);
      throttled();
    }

    sinon.assert.calledThrice(spy);
  });


  it("FunctionThrottleNoLeadingNoTrailing", function() {
    var intervalCounter = 0;
    var callInfo = [];
    var spy = sinonSandbox.spy();
    var throttled = q.func.throttle(spy, 500, {
      leading: false,
      trailing: false
    });
    for (var i = 0; i <= 20; i++) {
      this.clock.tick(80);
      throttled();
    }
    sinon.assert.calledTwice(spy);
  });


  it("FunctionThrottleWithEvents", function() {
    var spy = sinonSandbox.spy();
    sandbox.on("myEvent", q.func.throttle(spy, 400), sandbox);

    for (var i = 0; i < 4; i++) {
      this.clock.tick(350);
      sandbox.emit("myEvent");
    }
    sinon.assert.calledThrice(spy);
  });


  it("FunctionThrottleWithLeadingEvents", function() {
    var spy = sinonSandbox.spy();

    sandbox.on("myEvent", q.func.throttle(spy, 250, {
      trailing: false
    }), sandbox);
    for (var i = 0; i < 17; i++) {
      this.clock.tick(100);
      sandbox.emit("myEvent");
      if (i === 14) {
        this.clock.tick(500);
        sandbox.emit("myEvent");
      }
    }
    assert.equal(6, spy.callCount);
  });

});

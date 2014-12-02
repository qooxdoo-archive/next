describe('FunctionUtil', function() {

  this.timeout(5000);

  it("FunctionDebounce", function(done) {
    var called = 0;
    var checkCalled;

    var spy = function() {
      called++;
    };

    var deferred = q.func.debounce(spy, 300);
    deferred();

    window.setTimeout((function() {
      checkCalled = (called === 0);
    }), 200);

    window.setTimeout(function() {
      assert.isTrue(checkCalled);
      assert.equal(1, called);
      done();
    }, 1000);
  });


  it("FunctionDebounceWithEvents", function(done) {
    var callCounter = 0;
    var context;
    var data;
    var myCallback = function(e) {
      callCounter++;
      context = this;
      data = e;
    };

    sandbox.on("myEvent", q.func.debounce(myCallback, 200), sandbox);

    var counter = 0;
    var intervalId = window.setInterval((function() {
      this.emit("myEvent", "interval_" + counter);
      counter++;

      if (counter === 20) {
        window.clearInterval(intervalId);
      }
    }).bind(sandbox), 50);

    var checkContext = sandbox;
    setTimeout(function() {
      assert.equal(1, callCounter);
      assert.equal(checkContext, context);
      assert.equal("interval_19", data);
      done();
    }, 1500);
  });


  it("FunctionDebounceWithImmediateEvents", function(done) {
    var callCounter = 0;
    var context;
    var data;
    var myCallback = function(e) {
      callCounter++;
      context = this;
      data = e;
    };

    sandbox.on("myEvent", q.func.debounce(myCallback, 200, true), sandbox);

    var counter = 0;
    var intervalId = window.setInterval((function() {
      var that = this.emit("myEvent", "interval_" + counter);
      counter++;

      if (counter === 20) {
        window.clearInterval(intervalId);

        setTimeout(function() {
          that.emit("myEvent", "interval_" + counter);
        }, 500);
      }
    }).bind(sandbox), 50);

    var checkContext = sandbox;
    setTimeout(function() {
      assert.equal(2, callCounter);
      assert.equal(checkContext, context);
      assert.equal("interval_20", data);
      done();
    }, 1950);
  });


  it("FunctionThrottle", function(done) {
    var intervalCounter = 0;
    var callInfo = [];
    var spy = function() {
      callInfo.push(Date.now());
    };
    var throttled = q.func.throttle(spy, 250);

    var intervalId = window.setInterval((function() {
      throttled();
      if (intervalCounter == 10) {
        window.clearInterval(intervalId);
      }
      intervalCounter++;
    }), 10);

    setTimeout(function() {
      assert.equal(2, callInfo.length);
      done();
    }, 1000);
  });


  it("FunctionThrottleNoTrailing", function(done) {
    var intervalCounter = 0;
    var callInfo = [];
    var spy = function() {
      callInfo.push(Date.now());
    };
    var throttled = q.func.throttle(spy, 500, {
      trailing: false
    });

    var intervalId = window.setInterval((function() {
      throttled();
      if (intervalCounter == 20) {
        window.clearInterval(intervalId);
      }
      intervalCounter++;
    }).bind(this), 80);

    window.setTimeout((function() {
      assert.equal(3, callInfo.length);
      done();
    }), 2000);
  });


  it("FunctionThrottleNoLeadingNoTrailing", function(done) {
    var intervalCounter = 0;
    var callInfo = [];
    var spy = function() {
      callInfo.push(Date.now());
    };
    var throttled = q.func.throttle(spy, 500, {
      leading: false,
      trailing: false
    });

    var intervalId = window.setInterval((function() {
      throttled();
      if (intervalCounter == 20) {
        window.clearInterval(intervalId);
      }
      intervalCounter++;
    }).bind(this), 80);

    window.setTimeout(function() {
      assert.equal(2, callInfo.length);
      done();
    }, 2000);
  });


  it("FunctionThrottleWithEvents", function(done) {

    var context;
    var callInfo = [];
    var spy = function(e) {
      context = this;
      callInfo.push(Date.now());
    };
    sandbox.on("myEvent", q.func.throttle(spy, 400), sandbox);

    var counter = 0;
    var intervalId = window.setInterval((function() {
      this.emit("myEvent");

      if (counter === 4) {
        window.clearInterval(intervalId);
      }
      counter++;
    }).bind(sandbox), 150);

    var checkContext = sandbox;
    setTimeout(function() {
      assert.equal(checkContext, context);
      assert.equal(3, callInfo.length);
      done();
    }, 2000);
  });


  it("FunctionThrottleWithLeadingEvents", function(done) {
    var context;
    var callInfo = [];
    var spy = function(e) {
      context = this;
      callInfo.push(Date.now());
    };
    sandbox.on("myEvent", q.func.throttle(spy, 250, {
      trailing: false
    }), sandbox);

    var counter = 0;
    var intervalId = window.setInterval((function() {
      var that = this.emit("myEvent");

      if (counter === 14) {
        window.clearInterval(intervalId);

        window.setTimeout(function() {
          that.emit("myEvent");
        }, 500);
      }
      counter++;
    }).bind(sandbox), 100);

    var checkContext = sandbox;
    setTimeout(function() {
      assert.equal(checkContext, context);
      assert.equal(6, callInfo.length);
      done();
    }, 2500);
  });
});

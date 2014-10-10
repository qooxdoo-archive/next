describe('event.Native', function() {

  beforeEach (function () {
   globalSetup();
  });
  afterEach (function () {
   globalTeardown();
 });
 
  it("GetTarget", function() {

    var obj = {
      target : null
    };
    var callback = function(ev) {
      this.target = ev.getTarget();
      this.currentTarget = ev.getCurrentTarget();
    };

    var test = q.create('<input id="foo" type="text" />');
    test.appendTo(sandbox[0]);
    test.on("mousedown", callback, obj);

    window.setTimeout(function() {
      var event = new q.$$qx.event.type.dom.Custom("mousedown");
      test[0].dispatchEvent(event);
    }, 100);

    setTimeout(function() {
      assert.equal(test[0], obj.target);
      assert.equal(test[0], obj.currentTarget);
    }, 200);
  });
 
  it("EventMethods", function() {

    var methods = ["getRelatedTarget", "preventDefault", "stopPropagation"];

    var obj = {
      target : null
    };
    var callback = function(ev) {
      for (var i=0, l=methods.length; i<l; i++) {
        var methodName = methods[i];
        this[methodName] = (typeof ev[methodName] == "function");
      }
    };

    var test = q.create('<input type="text"></input>');
    test.appendTo(sandbox[0]);
    test.on("mousedown", callback, obj);

    window.setTimeout(function() {
      var event = new q.$$qx.event.type.dom.Custom("mousedown");
      test[0].dispatchEvent(event);
    }, 100);

    setTimeout(function() {
      for (var i=0, l=methods.length; i<l; i++) {
        assert.isTrue(obj[methods[i]]);
      }
    }, 200);
  });
 
  it("CurrentTarget", function() {


    var target;

    var callback = function(ev) {
      target = ev.getCurrentTarget();
    };

    var test = q.create('<input type="text" />');
    test.appendTo(sandbox[0]);
    test.on("mousedown", callback, this);

    window.setTimeout(function() {
      var event = new q.$$qx.event.type.dom.Custom("mousedown");
      test[0].dispatchEvent(event);
    }, 100);

    setTimeout(function() {
      assert.equal(test[0], target);
    }, 500);
  });
 
  it("CurrentTargetMultiElementsDispatch", function() {


    var target;

    var callback = function(ev) {
      target = ev.getCurrentTarget();
    };

    var test = q.create('<div/><div/><div/>')
      .appendTo(sandbox[0])
      .on("mousedown", callback, this);

    window.setTimeout(function() {
      var event = new q.$$qx.event.type.dom.Custom("mousedown");
      test[1].dispatchEvent(event);
    }, 100);

    setTimeout(function() {
      assert.equal(test[1], target);
    }, 500);
  });
 
  it("CurrentTargetMultiElementsEmit", function() {
     var target;
     var callback = function(ev) {
       target = ev.getCurrentTarget();
     };

     var test = q.create('<div id="0"/><div id="1"/><div id="2"/>')
       .appendTo(sandbox[0])
       .on("mousedown", callback, this);

     window.setTimeout(function() {
       window.affe = true;
       test.eq(1).emit("mousedown", {});
       window.affe = false;
     }, 100);

     setTimeout(function() {
       assert.equal(test[1].getAttribute("id"), target.getAttribute("id"));
     }, 500);
  });
}); 

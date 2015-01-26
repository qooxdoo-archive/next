describe('event.RegistrationHooks', function() {

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
    assert.equal(onHookCount + 1, hooks["on"]["foo"].length);

    var cb = function() {};
    test.on("foo", cb);
    assert.isTrue(test[0].hookApplied);

    test.off("foo", cb);
    assert.isFalse(test[0].hookApplied);

    q.$unregisterEventHook(["foo"], registerHook, unregisterHook);
    assert.equal(onHookCount, hooks["on"]["foo"].length);
  });
});

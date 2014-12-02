describe('event.Touch', function() {

  it("EventNormalization", function() {
    var eventTypes = ["tap", "swipe"];
    assert.isArray(eventTypes);
    assert(eventTypes.length > 0);
    var registry = q.$getEventNormalizationRegistry();
    for (var i = 0, l = eventTypes.length; i < l; i++) {
      assert.isDefined(registry[eventTypes[i]]);
    }
  });
});

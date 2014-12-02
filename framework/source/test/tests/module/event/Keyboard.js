describe('event.Keyboard', function() {

  it("EventNormalization", function() {
    var eventTypes = ["keydown", "keypress", "keyup"];
    assert.isArray(eventTypes);
    assert(eventTypes.length > 0);
    var registry = q.$getEventNormalizationRegistry();
    for (var i = 0, l = eventTypes.length; i < l; i++) {
      assert.isDefined(registry[eventTypes[i]]);
    }
  });


  it("EventMethods", function() {
    var test = q.create("<div id='foo'></div>");
    test.appendTo(sandbox[0]);

    var obj = {};

    q("#sandbox #foo").on("keydown", function(ev) {
      this.keyIdentifier = ev.getKeyIdentifier();
    }, obj);

    q("#sandbox #foo").emit("keydown", {
      keyCode: 27
    });

    assert.equal("Escape", obj.keyIdentifier);
  });
});

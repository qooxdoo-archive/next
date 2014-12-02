describe('event.Mouse', function() {

  it("EventNormalization", function() {
    var eventTypes = ["click", "dblclick", "mousedown", "mouseup", "mouseover", "mousemove",
      "mouseout"
    ];
    var registry = q.$getEventNormalizationRegistry();
    for (var i = 0, l = eventTypes.length; i < l; i++) {
      assert.isDefined(registry[eventTypes[i]]);
    }
  });


  it("EventMethods", function() {
    var eventMethods = ["getButton", "getViewportLeft", "getViewportTop",
      "getDocumentLeft", "getDocumentTop", "getScreenLeft", "getScreenTop"
    ];

    var test = q.create("<div id='foo'></div>");
    test.appendTo(sandbox[0]);

    var obj = {};

    q("#sandbox #foo").on("mousedown", function(ev) {
      for (var i = 0; i < eventMethods.length; i++) {
        if (typeof ev[eventMethods[i]] !== "function" || ev[eventMethods[i]]() !== "none") {
          this.normalized = false;
          return;
        }
      }
      this.normalized = true;
    }, obj);

    q("#sandbox #foo").emit("mousedown", {
      button: "none",
      clientX: "none",
      clientY: "none",
      pageX: "none",
      pageY: "none",
      screenX: "none",
      screenY: "none"
    });

    assert.isTrue(obj.normalized);
  });
});

describe("log.appender.Util", function() {


  it("FormatOffset", function() {
    var a = qx.log.appender.Util.formatOffset(288, 6);
    var b = qx.log.appender.Util.formatOffset(288, 4);
    assert.equal(a, 000288);
    assert.equal(b, 0288);
  });


  it("EscapeHTML", function() {
    var a = qx.log.appender.Util.escapeHTML("hello !!! <");
    assert.equal(a, "hello !!! &lt;")
  });


  it("ToText", function() {
    var time = new Date(1000);
    var entry = {
      time: time,
      offset: 900,
      level: "warn",
      items: [],
      win: window,
      clazz: qx.event.Emitter
    };

    var text = qx.log.appender.Util.toText(entry);
    assert.equal("000900 qx.event.Emitter:", text);
  });


  it("ToTextArray", function() {
    var time = new Date(1000);
    var entry = {
      time: time,
      offset: 900,
      level: "warn",
      win: window,
      items: [{
        "text": "test"
      }]
    };
    var a = qx.log.appender.Util.toTextArray(entry);
    console.log(a);
    assert.deepEqual(a[0], "000900");
  });

});

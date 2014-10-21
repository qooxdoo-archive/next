describe('Attribute', function() {

  beforeEach(function() {
    globalSetup();
  });


  afterEach(function() {
    globalTeardown();
  });


  it("Html", function() {
    var test = q.create("<div/>");
    test.setHtml("affe");
    assert.equal("affe", test[0].innerHTML);
    assert.equal("affe", test.getHtml());

    // must be ignored:
    q(window).setHtml("no way");
    q(document).setHtml("no way");
    assert.isNull(q(window).getHtml());
    assert.isNull(q(document).getHtml());

    sandbox.setHtml("<div id='one'/><div id='two'></div>");
    assert.equal(0, q("#sandbox > #one > #two").length);
    assert.equal(1, q("#sandbox > #two").length);
  });


  it("Attribute", function() {
    var test = q.create("<div/>");
    test.setAttribute("id", "affe");
    assert.equal("affe", test[0].getAttribute("id"));
    assert.equal("affe", test.getAttribute("id"));
    test.removeAttribute("id");
    assert.isNull(test[0].getAttribute("id"));
    assert.isNull(test.getAttribute("id"));

    // must be ignored:
    q([window, document]).setAttribute("id", "affe");
    assert.isNull(q(window).getAttribute("id"));
    assert.isNull(q(document).getAttribute("id"));
    q([window, document]).removeAttribute("id");
  });


  it("Attributes", function() {
    var test = q.create("<div/>");
    test.setAttributes({
      "id": "affe",
      "x": "y"
    });
    assert.equal("affe", test[0].getAttribute("id"));
    assert.equal("affe", test.getAttributes(["id", "x"]).id);
    assert.equal("y", test.getAttributes(["id", "x"]).x);
    test.removeAttributes(["id", "x"]);
    assert.isNull(test.getAttributes(["id", "x"]).id);
    assert.isNull(test.getAttributes(["id", "x"]).x);
  });


  it("Property", function() {
    var test = q.create("<div/>");
    test.setProperty("affe", "AFFE");
    assert.equal("AFFE", test[0].affe);
    assert.equal("AFFE", test.getProperty("affe"));
    test.removeProperty("affe");
    assert.isUndefined(test.getProperty("affe"));
  });


  it("Properties", function() {
    var test = q.create("<div/>");
    test.setProperties({
      "affe": "AFFE",
      "x": "y"
    });
    assert.equal("AFFE", test[0].affe);
    assert.equal("AFFE", test.getProperties(["affe", "x"]).affe);
    assert.equal("y", test.getProperties(["affe", "x"]).x);
    test.removeProperties(["affe", "x"]);
    assert.isUndefined(test.getProperty("affe"));
    assert.isUndefined(test.getProperty("x"));
  });


  it("GetSetValue", function() {
    q.create('<input type="text" value="affe"/>' +
        '<input type="checkbox" value="affe"/>' +
        '<select id="single"><option value="foo">Foo</option><option selected="selected" value="affe">Affe</option></select>')
      .appendTo(sandbox[0]);

    q.create('<select id="multiple" multiple="multiple">' +
        '<option selected="selected" value="foo">Foo</option>' +
        '<option value="bar">Bar</option>' +
        '<option selected="selected" value="baz">Baz</option>' +
        '<option value="boing">Boing</option>' +
        '</select>')
      .appendTo(sandbox[0]);

    assert.equal("affe", q("#sandbox input[type=text]").getValue());
    assert.equal("affe", q("#sandbox input[type=checkbox]").getValue());
    assert.equal("affe", q("#sandbox select").getValue());
    assert.deepEqual(["foo", "baz"], q("#multiple").getValue());

    q("#sandbox input").setValue("fnord");
    // setting the same value again sets the 'checked' attribute
    q("#sandbox input[type=checkbox]").setValue("affe");
    q("#sandbox select").setValue("foo");
    q("#multiple").setValue(["bar", "boing"]);

    assert.equal("fnord", q("#sandbox input[type=text]").getValue());
    assert.isTrue(q("#sandbox input[type=checkbox]").getAttribute("checked"));
    assert.equal("foo", q("#sandbox select").getValue());
    assert.deepEqual(["bar", "boing"], q("#multiple").getValue());

    // must not throw exceptions:
    q(window).setValue("no way");
    q(document).setValue("no way");
    assert.isNull(q(document).getValue());
    assert.isNull(q(window).getValue());
  });
});

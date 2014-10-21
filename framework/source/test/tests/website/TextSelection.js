describe('TextSelection', function() {

  beforeEach(function() {
    globalSetup();
  });


  afterEach(function() {
    globalTeardown();
  });


  var __testSelection = function(coll, selected) {
    var isIe8 = q.env.get("engine.name") == "mshtml" && q.env.get("browser.documentmode") < 9;
    coll.setTextSelection(5, 9);
    assert.equal(4, coll.getTextSelectionLength(), "selected length");
    assert.equal(5, coll.getTextSelectionStart(), "selected start");
    assert.equal(9, coll.getTextSelectionEnd(), "selected end");
    assert.equal(selected, coll.getTextSelection(), "selected text");

    coll.clearTextSelection();
    assert.equal(0, coll.getTextSelectionLength(), "cleared length");
    if (!isIe8 || coll[0].tagName.toLowerCase() !== "textarea") {
      assert.equal(0, coll.getTextSelectionStart(), "cleared start");
    }
    if (!isIe8 || coll[0].tagName.toLowerCase() !== "span" && coll[0].tagName.toLowerCase() !== "textarea") {
      assert.equal(0, coll.getTextSelectionEnd(), "cleared end");
    }
    assert.equal("", coll.getTextSelection(), "cleared text");
  };


  it("Input", function() {
    var coll = q.create('<input type="text" value="Just some text" />')
      .appendTo("#sandbox");
    __testSelection(coll, "some");
  });


  it("Textarea", function() {
    var coll = q.create('<textarea>Just some text</textarea>')
      .appendTo("#sandbox");
    __testSelection(coll, "some");
  });


  it("Span", function() {
    var coll = q.create('<span>Just some text</span>')
      .appendTo("#sandbox");
    __testSelection(coll, "some");
  });


  it("NoText", function() {
    var coll = q.create("<h1></h1>");
    coll.push(window);
    coll.push(document.documentElement);
    // Should not throw:
    coll.setTextSelection(5, 9);
    coll.getTextSelectionLength();
    coll.getTextSelectionStart();
    coll.getTextSelectionEnd();
    coll.getTextSelection();
  });
});

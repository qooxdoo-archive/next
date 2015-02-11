describe("module.TextSelection", function() {

  var __testSelection = function(coll, selected) {
    coll.setTextSelection(5, 9);
    assert.equal(coll.getTextSelectionLength(), 4, "selected length");
    assert.equal(coll.getTextSelectionStart(), 5, "selected start");
    assert.equal(coll.getTextSelectionEnd(), 9, "selected end");
    assert.equal(selected, coll.getTextSelection(), "selected text");

    coll.clearTextSelection();
    assert.equal(coll.getTextSelectionLength(), 0, "cleared length");
    assert.equal(coll.getTextSelectionStart(), 0, "cleared start");

    if (coll[0].tagName.toLowerCase() !== "textarea") {
      assert.equal(coll.getTextSelectionEnd(), 0, "cleared end");
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

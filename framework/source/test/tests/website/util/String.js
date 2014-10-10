describe('StringUtil', function() {
 
  it("CamelCase", function() {
    assert.equal("ABC", q.string.camelCase("-a-b-c"));
    assert.equal("WebkitLinearGradient", q.string.camelCase("-webkit-linear-gradient"));
  });
 
  it("Hyphenate", function() {
    assert.equal("-a-b-c", q.string.hyphenate("ABC"));
    assert.equal("-webkit-linear-gradient", q.string.hyphenate("WebkitLinearGradient"));
  });
 
  it("FirstUp", function() {
    assert.equal("MAn", q.string.firstUp("mAn"));
    assert.equal("Man", q.string.firstUp("Man"));
  });
 
  it("FirstLow", function() {
    assert.equal("man", q.string.firstLow("Man"));
    assert.equal("mAN", q.string.firstLow("MAN"));
  });
 
  it("StartsWith", function() {
    assert.isTrue(q.string.startsWith("Test", "Te"));
    assert.isTrue(q.string.startsWith("Test", "Test"));
    assert.isFalse(q.string.startsWith("Test", "est"));
    assert.isFalse(q.string.startsWith("Test", "x"));
  });
 
  it("EndsWith", function() {
    assert.isTrue(q.string.endsWith("Test", "st"));
    assert.isTrue(q.string.endsWith("Test", "Test"));
    assert.isFalse(q.string.endsWith("Test", "Te"));
    assert.isFalse(q.string.endsWith("Test", "x"));
  });
 
  it("EscapeRegexpChars", function() {
    // also escape the \ in the expected
    assert.equal("\\.\\.\\.", q.string.escapeRegexpChars("..."));
  });
 
  it("Trim", function() {
    assert.equal("abc", "    abc    ".trim());
  });
}); 
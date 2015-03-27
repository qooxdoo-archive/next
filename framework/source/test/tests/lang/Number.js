describe("lang.Number", function() {
  /**
   * Number tests
   *
   */

  it("IsInRange", function() {
    assert.isTrue(qx.lang.Number.isInRange(17, 1, 22));
    assert.isTrue(qx.lang.Number.isInRange(17, 17, 22));
  });


  it("IsBetweenRange", function() {
    assert.isTrue(qx.lang.Number.isBetweenRange(17, 1, 22));
    assert.isFalse(qx.lang.Number.isBetweenRange(1, 1, 22));
  });


  it("Limit", function() {
    assert.equal(qx.lang.Number.limit(17, 1, 22), 17);
    assert.equal(qx.lang.Number.limit(-2, 1, 22), 1);
    assert.equal(qx.lang.Number.limit(23, 1, 22), 22);
  });

});

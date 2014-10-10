describe('Environment', function() {
 
  it("Get", function() {
    assert.equal(q.$$qx.core.Environment.get("qx.debug"), q.env.get("qx.debug"));
  });
 
  it("Add", function() {
    q.env.add("q.test", true);
    assert.isTrue(q.env.get("q.test"));
  });
}); 
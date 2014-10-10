describe('Storage', function() {
  var __testKey = "qx_website_test_key";
 
 it("LocalSetGetRemove", function() {
    q.localStorage.setItem(__testKey, {a: 1, b: true});
    assert.equal(1, q.localStorage.getItem(__testKey).a);
    assert.equal(true, q.localStorage.getItem(__testKey).b);
    q.localStorage.removeItem(__testKey);
    assert.isNull(q.localStorage.getItem(__testKey));
  });
 
 it("LocalGetLength", function() {
    q.localStorage.removeItem(__testKey);
    var oldLength = q.localStorage.getLength();
    q.localStorage.setItem(__testKey, "abc");
    assert.equal(oldLength + 1, q.localStorage.getLength());
    q.localStorage.removeItem(__testKey);
    assert.equal(oldLength, q.localStorage.getLength());
  });
 
 it("SessionSetGetRemove", function() {
    q.sessionStorage.setItem(__testKey, {a: 1, b: true});
    assert.equal(1, q.sessionStorage.getItem(__testKey).a);
    assert.equal(true, q.sessionStorage.getItem(__testKey).b);
    q.sessionStorage.removeItem(__testKey);
    assert.isNull(q.sessionStorage.getItem(__testKey));
  });
 
 it("SessionGetLength", function() {
    q.sessionStorage.removeItem(__testKey);
    var oldLength = q.sessionStorage.getLength();
    q.sessionStorage.setItem(__testKey, "abc");
    assert.equal(oldLength + 1, q.sessionStorage.getLength());
    q.sessionStorage.removeItem(__testKey);
    assert.equal(oldLength, q.sessionStorage.getLength());
  });
}); 
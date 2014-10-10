describe('Type', function() {
 
  it("Get", function() {
    assert.equal("Array", q.type.get([]));
    assert.equal("Array", q.type.get([1,2,3]));
    assert.equal("Boolean", q.type.get(true));
    assert.equal("Boolean", q.type.get(false));
    assert.equal("Date", q.type.get(new Date()));
    assert.equal("Error", q.type.get(new Error()));
    assert.equal("Function", q.type.get(function() {}));
    assert.equal("Number", q.type.get(123));
    assert.equal("Number", q.type.get(0x123));
    assert.equal("Number", q.type.get(0123));
    assert.equal("Number", q.type.get(1e23));
    assert.equal("Object", q.type.get({}));
    assert.equal("Object", q.type.get({a: "b"}));
    assert.equal("RegExp", q.type.get(new RegExp("^123")));
    assert.equal("RegExp", q.type.get(/^123/g));
    assert.equal("String", q.type.get(""));
    assert.equal("String", q.type.get("123"));
    assert.equal("String", q.type.get("abc"));
  });
}); 

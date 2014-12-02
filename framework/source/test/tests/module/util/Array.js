describe('ArrayUtil', function() {

  it("Cast", function() {
    var a;
    (function() {
      a = q.array.cast(arguments, Array);
    })(1, 2, 3, 4);
    assert.equal(4, a.length);
    assert.equal([].constructor, a.constructor);
  });


  it("Equals", function() {
    var a = [1, 2, 3, 4];
    var b = [1, 2, 3, 4];
    assert.isTrue(q.array.equals(a, b));
    a.push(5);
    assert.isFalse(q.array.equals(a, b));
  });


  it("Exclude", function() {
    var a = [1, 2, 3, 4];
    var b = [2, 4];
    q.array.exclude(a, b);
    assert.equal(1, a[0]);
    assert.equal(3, a[1]);
  });


  it("FromArguments", function() {
    var a;
    (function() {
      a = q.array.fromArguments(arguments);
    })(1, 2, 3, 4);
    assert.equal(4, a.length);
    assert.equal([].constructor, a.constructor);
  });


  it("InsertAfter", function() {
    var a = [1, 2, 4];
    q.array.insertAfter(a, 3, 2);
    assert.equal(4, a.length);
    assert.equal(3, a[2]);
  });


  it("InsertBefore", function() {
    var a = [1, 2, 4];
    q.array.insertBefore(a, 3, 4);
    assert.equal(4, a.length);
    assert.equal(3, a[2]);
  });


  it("Max", function() {
    var a = [1, 4, 2, 3];
    assert.equal(4, q.array.max(a));
  });


  it("Min", function() {
    var a = [1, 4, 2, 3];
    assert.equal(1, q.array.min(a));
  });


  it("Remove", function() {
    var a = [1, 2, 'x', 3, 4];
    q.array.remove(a, 'x');
    assert.equal(4, a.length);
    assert.equal(3, a[2]);
  });


  it("RemoveAll", function() {
    var a = [1, 2, 3, 4];
    q.array.removeAll(a);
    assert.equal(0, a.length);
  });


  it("Unique", function() {
    var a = [1, 1, 2, 3, 4, 4, 4];
    var b = q.array.unique(a);
    assert.equal(4, b.length);
    assert.equal(1, b[0]);
    assert.equal(2, b[1]);
    assert.equal(3, b[2]);
    assert.equal(4, b[3]);
  });
});

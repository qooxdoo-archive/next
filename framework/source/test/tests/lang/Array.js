/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */
describe("lang.Array", function() {
  /**
   * Array tests
   *
   */

  it("Append", function() {
    assert.isDefined(qx.lang.Array.append);
    var a = [1, 2, 3];
    qx.lang.Array.append(a, [4, 5, 6]);
    assert.equal(JSON.stringify(a), JSON.stringify([1, 2, 3, 4, 5, 6]));

    var error = false;

    try {
      qx.lang.Array.append(a, 1);
    } catch (ex) {
      error = true;
    }

    assert(error);
  });


  it("MinNumeric", function() {
    var a = [-3, -2, -1, 0, 1, 2, 3];
    var b = [16, 2, 5, -1, 1, 2, 3];
    var result = qx.lang.Array.min(a);
    var result2 = qx.lang.Array.min(b);
    assert.equal(-3, result);
    assert.equal(-1, result2);
  });


  it("MaxNumeric", function() {
    var a = [-3, -2, -1, 0, 1, 2, 3];
    var result = qx.lang.Array.max(a);
    assert.equal(3, result);
  });


  it("MinMixed", function() {
    var a = [-3, -2, -1, 0, 1, 2, 3, 'foo', 'bar', undefined, null];
    var result = qx.lang.Array.min(a);
    assert.equal(-3, result);
  });


  it("MaxMixed", function() {
    var a = [-3, -2, -1, 0, 1, 2, 3, 'foo', 'bar', undefined, null];
    var result = qx.lang.Array.max(a);
    assert.equal(3, result);
  });


  it("MinEmpty", function() {
    var a = [];
    var result = qx.lang.Array.min(a);
    assert.equal(null, result);
  });


  it("MaxEmpty", function() {
    var a = [];
    var result = qx.lang.Array.max(a);
    assert.equal(null, result);
  });


  it("Remove", function() {
    var a = [-3, -2, -1, 0, 1, 2, 3];
    qx.lang.Array.remove(a, 2);

    assert.equal(JSON.stringify(a), JSON.stringify([-3, -2, -1, 0, 1, 3]));
    assert.equal(6, a.length);
  });


  it("RemoveAt", function() {
    var a = [-3, -2, -1, 0, 1, 2, 3];
    qx.lang.Array.removeAt(a, 3);

    assert.equal(JSON.stringify(a), JSON.stringify([-3, -2, -1, 1, 2, 3]));
    assert.equal(6, a.length);
  });


  it("RemoveAll", function() {
    var a = [-3, -2, -1, 0, 1, 2, 3];
    qx.lang.Array.removeAll(a);

    assert.equal(JSON.stringify(a), JSON.stringify([]));
    assert.equal(0, a.length);
  });


  it("FromShortHand", function() {
    var a = [-2];
    var b = [-7, 5, 4];
    var c = [-7, 5];
    var result = qx.lang.Array.fromShortHand(a);
    var result2 = qx.lang.Array.fromShortHand(b);
    var result3 = qx.lang.Array.fromShortHand(c);
    assert.isTrue(result.length === 4);
    assert.isTrue(result2.length === 4);
    assert.isTrue(result3.length === 4);
  });


  it("InsertBefore", function() {
    var a = [-2];
    var b = [2, "hello", 4];
    var c = [];
    var result = qx.lang.Array.insertBefore(b, "122a", "hello");
    var result2 = qx.lang.Array.insertBefore(c, "122a");
    var result3 = qx.lang.Array.insertBefore(a, "122a");
    assert.deepEqual(result, [2, "122a", "hello", 4]);
    assert.deepEqual(result2, ["122a"]);
    assert.deepEqual(result3, [-2, "122a"]);
  });


  it("InsertAt", function() {
    var a = "Affe";
    var b = [2, "hello", 4];
    var c = [];
    var result = qx.lang.Array.insertAt(b, a, 1);
    assert.deepEqual(result, [2, "Affe", "hello", 4]);
  });


  it("InsertAfter", function() {
    var a = [-2];
    var b = [2, "hello", 4];
    var c = [];
    var result = qx.lang.Array.insertAfter(b, "122a", "hello");
    var result2 = qx.lang.Array.insertAfter(c, "122a");
    var result3 = qx.lang.Array.insertAfter(a, "122a");

    assert.deepEqual(result, [2, "hello", "122a", 4]);
    assert.deepEqual(result2, ["122a"]);
    assert.deepEqual(result3, [-2, "122a"]);
  });


  it("Exclude", function() {
    var a = [-2];
    var b = [2, "hello", 4, -2];
    var c = [2, 17, "hello", 43, 4, -2];
    var result = qx.lang.Array.exclude(b, a);
    var result2 = qx.lang.Array.exclude(c, b);

    assert.deepEqual(result, [2, "hello", 4]);
    assert.deepEqual(result2, [17, 43, -2]);
  });


  it("Contains", function() {
    var b = [2, "hello", 4, -2];
    var result = qx.lang.Array.contains(b, 4);
    assert.isTrue(qx.lang.Array.contains(b, 4));
    assert.isFalse(qx.lang.Array.contains(b, 1));
  });


  it("Equals", function() {
    var b = [2, "hello", 4, -2];
    var c = [2, "hello", 4, -2];
    var d = [2, "goodbye", 4, -2];
    var e = [2, "goodbye", 4, -2, 4];
    var result = qx.lang.Array.equals(b, c);
    var result = qx.lang.Array.equals(b, d);
    assert.isTrue(qx.lang.Array.equals(b, c));
    assert.isFalse(qx.lang.Array.equals(b, d));
    assert.isFalse(qx.lang.Array.equals(d, e));
  });


  it("Sum", function() {
    var d = [2, 1, 4, -2];
    var e = [2, -40, 4, -2, 4];
    assert.equal(qx.lang.Array.sum(d), 5);
    assert.equal(qx.lang.Array.sum(e), -32);
  });


  it("Unique", function() {
    var d = [2, 1, 4, -2];
    var e = [];
    var f = [{
      "name": "affe",
      "age": 4
    }];
    assert.deepEqual(qx.lang.Array.unique(d), [2, 1, 4, -2]);
    assert.deepEqual(qx.lang.Array.unique(e), []);
    assert.deepEqual(qx.lang.Array.unique(f), [{
      "name": "affe",
      "age": 4
    }]);
  });


  it("Range", function() {
    assert.deepEqual(qx.lang.Array.range(), []);
    assert.deepEqual(qx.lang.Array.range(1, 22, 12), [1, 13]);
    assert.deepEqual(qx.lang.Array.range(-10, -30, -2), [-10, -12, -14, -16, -18, -20, -22, -24, -26, -28]);
  });


  });

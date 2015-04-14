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

************************************************************************ */

/**
 * @ignore(type.TestArray)
 */

describe("type.BaseArray", function() {

  qx.Class.define("type.TestArray", {
    extend: qx.type.BaseArray
  });


  it("ListConstruct", function() {

    var list = new type.TestArray(10);
    assert.equal(10, list.length);
    list = new type.TestArray(1, 2, 3);
    assert.deepEqual([1, 2, 3], list.toArray());
  });


  it("SingleItemConstruct", function() {
    var list = new type.TestArray("42");
    assert.instanceOf(list, Array);
    assert.equal(list.length, 1);
    assert.strictEqual("42", list.toArray()[0], "The answer was not 42!");
  });


  it("ArrayLength", function() {
    var list = new type.TestArray(1, 2, 3);
    assert.equal(3, list.length);
  });


  it("Clear", function() {
    var list = new type.TestArray(1, 2, 3);
    list.length = 0;
    assert.deepEqual([], list.toArray());
  });


  it("ArrayJoin", function() {
    var list = new type.TestArray(1, 2, 3);
    assert.equal("1, 2, 3", list.toArray().join(", "));
  });


  it("ArrayConcat", function() {
    var list = new type.TestArray(1, 2, 3);
    assert.deepEqual([1, 2, 3, 4, 5], list.toArray().concat(4, 5));
    assert.instanceOf(list.concat(4, 5), type.TestArray);
  });


  it("ArrayPop", function() {
    var list = new type.TestArray(1, 2, 3);
    var popped = list.pop();
    assert.equal(3, popped);
    assert.deepEqual([1, 2], list.toArray());
  });


  it("ArrayPush", function() {
    var list = new type.TestArray(1, 2);
    var length = list.push(3);
    assert.equal(3, length);
    assert.deepEqual([1, 2, 3], list.toArray());

    length = list.push(4, 5);
    assert.equal(5, length);
    assert.deepEqual([1, 2, 3, 4, 5], list.toArray());
  });


  it("ArrayReverse", function() {
    var list = new type.TestArray(1, 2, 3, 4, 5);
    list.reverse();
    assert.deepEqual([5, 4, 3, 2, 1], list.toArray());
    list.reverse();
    assert.deepEqual([1, 2, 3, 4, 5], list.toArray());
  });


  it("ArrayShift", function() {
    var list = new type.TestArray(1, 2, 3, 4, 5);
    var shifted = list.shift();
    assert.equal(1, shifted);
    assert.deepEqual([2, 3, 4, 5], list.toArray());
  });


  it("ArrayUnshift", function() {
    var list = new type.TestArray(2, 3, 4, 5);
    var length = list.unshift(1);
    assert.deepEqual([1, 2, 3, 4, 5], list.toArray());
  });


  it("ArraySlice", function() {
    var list = new type.TestArray(1, 2, 3, 4, 5);
    var res = list.slice(2, 4);
    assert.deepEqual([3, 4], res.toArray());
    res = list.slice(1);
    assert.deepEqual([2, 3, 4, 5], res.toArray());
    res = list.slice(2, -1);
    assert.deepEqual([3, 4], res.toArray());
    assert.instanceOf(list.slice(2, 4), type.TestArray);
  });


  it("ArraySort", function() {
    var list = new type.TestArray(3, 5, 1, -1);
    var sorted = list.sort();
    assert.deepEqual([-1, 1, 3, 5], list.toArray());

    list = new type.TestArray(3, 5, 1, -1);
    sorted = list.sort(function(a, b) {
      return a > b ? -1 : 1;
    });
    assert.deepEqual([5, 3, 1, -1], list.toArray());
  });


  it("ArraySplice", function() {
    var list = new type.TestArray(1, 2, 3, 4, 5);
    var removed = list.splice(1, 2, 22, 33);
    assert.deepEqual([2, 3], removed.toArray());
    assert.instanceOf(removed, type.TestArray);
    assert.deepEqual([1, 22, 33, 4, 5], list.toArray());
  });


  it("ArrayToString", function() {
    var list = new type.TestArray(1, 2, 3);
    assert.equal(list.join(), list.toString());
  });


  it("ArrayAccess", function() {
    var list = new type.TestArray(1, 2, 3);
    assert.equal(1, list[0]);
    assert.equal(2, list[1]);
    assert.equal(3, list[2]);
  });


  it("IndexOf", function() {
    var obj = {};
    var arr = new type.TestArray(1, obj, "str", 1);

    assert.equal(0, arr.indexOf(1));
    assert.equal(1, arr.indexOf(obj));
    assert.equal(2, arr.indexOf("str"));
    assert.equal(-1, arr.indexOf(0));
  });


  it("LastIndexOf", function() {
    var obj = {};
    var arr = new type.TestArray(1, obj, "str", 1);

    assert.equal(3, arr.lastIndexOf(1));
    assert.equal(1, arr.lastIndexOf(obj));
    assert.equal(2, arr.lastIndexOf("str"));
    assert.equal(-1, arr.lastIndexOf(0));
  });


  it("ForEach", function() {
    var obj = {};
    var arr = new type.TestArray(1, obj, "str", 1);

    var values = [];
    var indexes = [];
    arr.forEach(function(element, index, array) {
      values[index] = element;
      indexes.push(index);
      assert.equal(arr, array);
    }, this);

    assert.deepEqual(arr.toArray(), values);
    assert.deepEqual([0, 1, 2, 3], indexes);
  });


  it("Filter", function() {
    var arr = new type.TestArray(1, 2, 3, 4);

    var values = [];
    var indexes = [];
    var odd = arr.filter(function(element, index, array) {
      values[index] = element;
      indexes.push(index);
      assert.equal(arr, array);

      return index % 2 == 1;
    }, this);

    assert.instanceOf(odd, type.TestArray);
    assert.deepEqual(arr.toArray(), values);
    assert.deepEqual([0, 1, 2, 3], indexes);
    assert.deepEqual([2, 4], odd.toArray());
  });


  it("Map", function() {
    var arr = new type.TestArray(1, 2, 3, 4);

    var values = [];
    var indexes = [];
    var result = arr.map(function(element, index, array) {
      values[index] = element;
      indexes.push(index);
      assert.equal(arr, array);

      return element + 1;
    }, this);

    assert.instanceOf(result, type.TestArray);
    assert.deepEqual([2, 3, 4, 5], result.toArray());
    assert.deepEqual(arr.toArray(), values);
    assert.deepEqual([0, 1, 2, 3], indexes);
  });


  it("Some", function() {
    var arr = new type.TestArray(1, 2, 3, 4);

    var values = [];
    var indexes = [];
    var result = arr.some(function(element, index, array) {
      values[index] = element;
      indexes.push(index);
      assert.equal(arr, array);
    }, this);

    assert.isFalse(result);
    assert.deepEqual(arr.toArray(), values);
    assert.deepEqual([0, 1, 2, 3], indexes);

    assert.isTrue(arr.some(function(element) {
      return element == 3;
    }));

    assert.isFalse(arr.some(function(element, index) {
      return index == 6;
    }));
  });


  it("Every", function() {
    var arr = new type.TestArray(1, 2, 3, 4);
    var values = [];
    var indexes = [];
    var result = arr.every(function(element, index, array) {
      values[index] = element;
      indexes.push(index);
      assert.equal(arr, array);
      return true;
    }, this);

    assert.isTrue(result);
    assert.deepEqual(arr.toArray(), values);
    assert.deepEqual([0, 1, 2, 3], indexes);

    assert.isFalse(arr.every(function(element) {
      return element == 3;
    }));

    assert.isTrue(arr.every(function(element, index) {
      return element == index + 1;
    }));
  });
});

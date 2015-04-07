/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2010 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */
describe("type.Array", function() {

  var __arr = null;

  beforeEach(function() {
    __arr = new qx.type.Array("x");
  });

  afterEach(function() {
    __arr = null;
  });


  it("Construct", function() {
    assert.equal(__arr[0], "x");
  });


  it("Append", function() {
    // native array
    __arr.append([1, 2]);
    assert.equal(__arr[1], 1);
    assert.equal(__arr[2], 2);

    // type array
    var a = new qx.type.Array(3, 4);
    __arr.append(a);
    assert.equal(__arr[3], 3);
    assert.equal(__arr[4], 4);

    // type base array
    var b = new qx.type.BaseArray(5, 6);
    __arr.append(b);
    assert.equal(__arr[5], 5);
    assert.equal(__arr[6], 6);
  });


  it("Prepend", function() {
    // native array
    __arr.prepend([1, 2]);
    assert.equal(__arr[0], 1);
    assert.equal(__arr[1], 2);

    // type array
    var a = new qx.type.Array(3, 4);
    __arr.prepend(a);
    assert.equal(__arr[0], 3);
    assert.equal(__arr[1], 4);

    // type base array
    var b = new qx.type.BaseArray(5, 6);
    __arr.prepend(b);
    assert.equal(__arr[0], 5);
    assert.equal(__arr[1], 6);
  });


  it("InsertAt", function() {
    var a = {name : "affe"};
    var b = {number : 3};
    var result = __arr.insertAt(a, 0);
    assert.deepEqual(result[0], {name : "affe"});
    var result2 = __arr.insertAt(b, 2);
    assert.deepEqual(result[2], {number : 3});
  });


  it("InsertBefore", function() {
    var a = {name: "affe"};
    var b = {number : 3};
    var c = {number : 123};
    var result = __arr.insertBefore(a,"x");
    assert.deepEqual(result[0],{name:"affe"});
    var result2 = __arr.insertBefore(b,a);
    assert.deepEqual(result[0],{number:3});
    var result3 = __arr.insertBefore(c,"blub");
    assert.deepEqual(result[3],c);
  });


  it("InsertBefore", function() {
    var a = {name: "affe"};
    var b = {number : 3};
    var c = {number : 123};
    var result = __arr.insertBefore(a,"x");
    assert.deepEqual(result[0],{name:"affe"});
    var result2 = __arr.insertBefore(b,a);
    assert.deepEqual(result[0],{number:3});
    var result3 = __arr.insertBefore(c,"blub");
    assert.deepEqual(result[3],c);
  });


  it("InsertAfter", function() {
    var a = {name: "affe"};
    var b = {number : 3};
    var c = {number : 123};
    var result = __arr.insertAfter(a,"x");
    assert.deepEqual(result[1],{name:"affe"});
    var result3 = __arr.insertAfter(c,"blub");
    assert.deepEqual(result[2],c);
    var result2 = __arr.insertAfter(b,a);
    assert.deepEqual(result[2],{number:3});
  });


  it("RemoveAt", function() {
    var result = __arr.removeAt(0);
    assert.deepEqual(result[0],"x");
  });


  it("RemoveAll", function() {
    __arr.append([1, 2]);
    var result = __arr.removeAll();
    assert.deepEqual(result[0],"x");
  });


  it("Remove", function() {
    __arr.append([1, 2, 3]);
    var result = __arr.remove(2);
    assert.deepEqual(result,2);
    assert.deepEqual(__arr[2],3);
  });


  it("Contains", function() {
    __arr.append([1, 2, 3]);
    var result = __arr.contains(2);
    var result2 = __arr.contains(11);
    assert.isTrue(result);
    assert.isFalse(result2);
  });

});

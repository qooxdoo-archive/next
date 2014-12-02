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

});

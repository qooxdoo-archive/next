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
    qx.core.Assert.assertJsonEquals(a, [1, 2, 3, 4, 5, 6]);

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
    var result = qx.lang.Array.min(a);
    assert.equal(-3, result);
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

    qx.core.Assert.assertJsonEquals(a, [-3, -2, -1, 0, 1, 3]);
    assert.equal(6, a.length);
  });


  it("RemoveAt", function() {
    var a = [-3, -2, -1, 0, 1, 2, 3];
    qx.lang.Array.removeAt(a, 3);

    qx.core.Assert.assertJsonEquals(a, [-3, -2, -1, 1, 2, 3]);
    assert.equal(6, a.length);
  });


  it("RemoveAll", function() {
    var a = [-3, -2, -1, 0, 1, 2, 3];
    qx.lang.Array.removeAll(a);

    qx.core.Assert.assertJsonEquals(a, []);
    assert.equal(0, a.length);
  });
});

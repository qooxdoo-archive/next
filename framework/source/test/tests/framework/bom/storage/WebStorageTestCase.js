/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Adrian Olaru (adrianolaru)

************************************************************************ */

describe("bom.storage.WebStorageTestCase", function() {

  it("LocalItem", function() {
    testItem(qx.bom.Storage.getLocal());
  });


  it("SessionItem", function() {
    testItem(qx.bom.Storage.getSession());
  });


  var testItem = function(storage) {
    storage.clear();
    assert.isNull(storage.getItem("key1"));

    storage.setItem("key1", "value1");
    assert.equal("value1", storage.getItem("key1"));

    storage.removeItem("key1");
    assert.isNull(storage.getItem("key1"));

    storage.setItem("key2", [1, "a"]);
    assert.deepEqual([1, "a"], storage.getItem("key2"));

    storage.setItem("key2", {
      "a": 1,
      "b": "c"
    });
    assert.deepEqual({
      "a": 1,
      "b": "c"
    }, storage.getItem("key2"));

    //overriding
    storage.setItem("key2", 12);
    assert.equal(12, storage.getItem("key2"));
  };


  it("LocalGetKey", function() {
    testGetKey(qx.bom.Storage.getLocal());
  });


  it("SessionGetKey", function() {
    testGetKey(qx.bom.Storage.getSession());
  });

  var testGetKey = function(storage) {
    //the order is unreliable, so just test that the getKey works
    storage.setItem("key1", "value");
    assert.equal("key1", storage.getKey(0));
  };


  it("LocalLength", function() {
    testLength(qx.bom.Storage.getLocal());
  });


  it("SessionLength", function() {
    testLength(qx.bom.Storage.getSession());
  });


  var testLength = function(storage) {
    storage.clear();
    assert.equal(0, storage.getLength());

    for (var i = 0; i < 10; i++) {
      storage.setItem("key" + i, "value");
    }

    assert.equal(10, storage.getLength());
  };


  it("LocalClear", function() {
    testClear(qx.bom.Storage.getLocal());
  });


  it("SessionClear", function() {
    testClear(qx.bom.Storage.getSession());
  });


  var testClear = function(storage) {
    for (var i = 0; i < 10; i++) {
      storage.setItem("key" + i, "value");
    }
    assert.equal(10, storage.getLength());
    storage.clear();
    assert.equal(0, storage.getLength());
  };


  it("LocalForEach", function() {
    testForEach(qx.bom.Storage.getLocal());
  });


  it("SessionForEach", function() {
    testForEach(qx.bom.Storage.getSession());
  });


  var testForEach = function(storage) {
    var i;
    for (i = 0; i < 10; i++) {
      storage.setItem("key" + i, "value");
    }
    //don't rely on the order
    i = 0;
    storage.forEach(function(key, item) {
      assert.equal(storage.getItem(key), item);
      i++;
    }, this);
    assert.equal(10, i);
  };
});

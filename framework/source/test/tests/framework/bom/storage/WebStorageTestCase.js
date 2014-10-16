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

describe("bom.storage.WebStorageTestCase", function ()
{

  var _storage = null;

  beforeEach (function ()  {
      _storage = qx.bom.Storage.getLocal();
      _storage.clear();
  });

  afterEach (function ()  {
      _storage = null;
  });
 
  it("Item", function() {
      assert.isNull(_storage.getItem("key1"));

      _storage.setItem("key1","value1");
      assert.equal("value1", _storage.getItem("key1"));

      _storage.removeItem("key1");
      assert.isNull(_storage.getItem("key1"));

      _storage.setItem("key2", [1,"a"]);
      assert.deepEqual([1,"a"], _storage.getItem("key2"));

      _storage.setItem("key2", {"a": 1, "b": "c"});
      assert.deepEqual({"a": 1, "b": "c"}, _storage.getItem("key2"));

      //overriding
      _storage.setItem("key2", 12);
      assert.equal(12, _storage.getItem("key2"));
  });
 
  it("GetKey", function() {
      //the order is unreliable, so just test that the getKey works
      _storage.setItem("key1","value");
      assert.equal("key1", _storage.getKey(0));
  });
 
  it("Length", function() {
      assert.equal(0, _storage.getLength());

      for (var i=0; i<10; i++) {
        _storage.setItem("key"+i,"value");
      }

      assert.equal(10, _storage.getLength());
  });
 
  it("Clear", function() {
      for (var i=0; i<10; i++) {
        _storage.setItem("key"+i,"value");
      }
      assert.equal(10, _storage.getLength());
      _storage.clear();
      assert.equal(0, _storage.getLength());
  });
 
  it("ForEach", function() {
      var i;
      for (i=0; i<10; i++) {
        _storage.setItem("key"+i,"value");
      }
      //don't rely on the order
      i = 0;
      _storage.forEach(function(key, item) {
        assert.equal(_storage.getItem(key), item);
        i++;
      }, this);
      assert.equal(10, i);
    
  });

  function classDefined (statics) {
    qx.test.bom.storage.WebStorageTestCase.$$classtype = "abstract";
  }
});

/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */
qx.Bootstrap.define("qx.test.data.store.Offline",
{
  extend : qx.dev.unit.TestCase,
  include : [qx.dev.unit.MRequirements, qx.dev.unit.MMock],

  construct : function() {
    this.initMMock();
  },

  members :
  {
    __store : null,
    __testKey : "qx-unit-test",

    hasQxDebug : function()
    {
      return qx.core.Environment.get("qx.debug");
    },


    tearDown : function()
    {
      this.getSandbox().restore();

      // erase the data from the storages
      qx.bom.Storage.getLocal().removeItem(this.__testKey);
    },


    __initDefaultStore : function() {
      this.__store = new qx.data.store.Offline(this.__testKey, "local");
    },

    __createDefaultModel : function() {
      return qx.data.marshal.Json.createModel({a: "a"}, true);
    },



    testCreate : function() {
      this.require(["qxDebug"]);

      var store;
      this.assertException(function() {
        store = new qx.data.store.Offline();
      });

      // fallback for the storage is local
      store = new qx.data.store.Offline(this.__testKey);
      this.assertEquals(store._storage, qx.bom.Storage.getLocal());

      // assert no exception
      this.__initDefaultStore();
      this.assertEquals(this.__testKey, this.__store.getKey());
    },


    testCreateWithDelegate : function() {
      var del = {};
      var spy = this.spy(qx.data.marshal, "Json");
      var store = new qx.data.store.Offline(this.__testKey, "local", del);
      this.assertCalledWith(spy, del);
    },


    testCheckEmptyModel : function() {
      this.__initDefaultStore();
      this.assertNull(this.__store.model);

      var model = this.__createDefaultModel();
      this.__store.model = (model);
      this.__store.model = (null);
      this.assertNull(qx.bom.Storage.getLocal().getItem(this.__testKey));
    },


    testSetModel : function() {
      this.__initDefaultStore();

      var model = this.__createDefaultModel();
      this.__store.model = (model);
      this.assertEquals("a", this.__store.model.a);
    },


    testChangeModel : function() {
      this.__initDefaultStore();

      var model = this.__createDefaultModel();
      this.__store.model = (model);
      this.assertEquals("a", this.__store.model.a);

      model.a = "A";
      this.assertEquals("A", this.__store.model.a);
    },


    testModelWriteRead : function() {
      this.__initDefaultStore();

      var model = this.__createDefaultModel();
      this.__store.model = (model);
      this.assertEquals("a", this.__store.model.a);

      this.__initDefaultStore();
      this.assertNotNull(this.__store.model);
      this.assertEquals("a", this.__store.model.a);
    },


    testModelRead : function() {
      this.stub(qx.bom.Storage.getLocal(), "getItem").returns({b : "b"});
      this.__initDefaultStore();

      this.assertNotUndefined(this.__store.model);
      this.assertEquals("b", this.__store.model.b);
    },


    testUpdateModel : function() {
      this.__initDefaultStore();

      var model = this.__createDefaultModel();
      this.__store.model = (model);
      this.assertEquals("a", this.__store.model.a);

      this.__initDefaultStore();
      this.assertNotNull(this.__store.model);
      this.__store.model.a = "b";
      this.assertEquals("b", this.__store.model.a, "1");

      this.__initDefaultStore();
      this.assertNotNull(this.__store.model);
      this.assertEquals("b", this.__store.model.a, "2");
    },


    testReplaceModel : function() {
      this.__initDefaultStore();

      var model1 = this.__createDefaultModel();
      this.__store.model = (model1);

      var model2 = qx.data.marshal.Json.createModel({x: "x"}, true);
      this.__store.model = (model2);

      this.__initDefaultStore();
      this.assertNotNull(this.__store.model);
      this.assertEquals("x", this.__store.model.x);
    },


    testBigModel : function() {
      var data = {a: [{b: 1, c: true}, 12.567, "a"]};
      var model = qx.data.marshal.Json.createModel(data, true);

      this.__initDefaultStore();

      this.__store.model = (model);
      this.assertEquals(1, this.__store.model.a.getItem(0).b);
      this.assertEquals(true, this.__store.model.a.getItem(0).c);
      this.assertEquals("a", this.__store.model.a.getItem(2));
    }
  }
});
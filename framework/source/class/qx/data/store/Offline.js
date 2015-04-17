define(['qx/Class', 'qx/event/MEmitter', 'qx/bom/Storage', 'qx/core/Assert', 'qx/core/Environment', 'qx/data/marshal/Json', 'qx/util/Serializer'], function(Dep0,Dep1,Dep2,Dep3,Dep4,Dep5,Dep6) {
var qx = {
  "Class": Dep0,
  "event": {
    "MEmitter": Dep1
  },
  "bom": {
    "Storage": Dep2
  },
  "core": {
    "Assert": Dep3,
    "Environment": Dep4
  },
  "data": {
    "marshal": {
      "Json": Dep5
    },
    "store": {
      "Offline": null
    }
  },
  "util": {
    "Serializer": Dep6
  }
};

"use strict";
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
/**
 * This store is a read / write store for local or session storage.
 * It can be used like any other store by setting and manipulating the model
 * property or the model itself. Please keep in mind that if you want to have
 * the update functionality, you have to use a model which supports the
 * {@link qx.data.marshal.MEventBubbling#changeBubble} event.
 */
var clazz = qx.Class.define("qx.data.store.Offline",
{
  extend : Object,
  include : [qx.event.MEmitter],


  /**
   * @param key {String} A unique key which is used to store the data.
   * @param storage {String?} Either "local" or "session" to determinate which
   *   storage should be used. Default: "local"
   * @param delegate {Object} An object containing one of the methods described
   *   in {@link qx.data.marshal.IMarshalerDelegate}.
   */
  construct : function(key, storage, delegate)
  {
    if (qx.core.Environment.get("qx.debug")) {
      qx.core.Assert.assertNotUndefined(key);
    }

    if (storage == "session") {
      this._storage = qx.bom.Storage.getSession();
    } else {
      this._storage = qx.bom.Storage.getLocal();
    }

    this._marshaler = new qx.data.marshal.Json(delegate);
    this._key = key;

    this._initializeModel();
  },


  properties :
  {
    /**
     * Property for holding the loaded model instance. Please keep in mind to
     * use a model supporting the changeBubble event.
     */
    model : {
      nullable: true,
      event: true,
      apply: "_applyModel"
    }
  },


  members :
  {
    _storage : null,
    __modelListenerId : null,


    // property apply
    _applyModel : function(value, old) {
      // take care of the old stuff.
      if (old) {
        old.offById(this.__modelListenerId);
        this.__modelListenerId = null;
      }

      if (value) {
        value.on(
          "changeBubble", this.__storeModel, this
        );
        this.__modelListenerId = value.getListenerId();
        this.__storeModel();
      } else {
        this._storage.removeItem(this._key);
      }
    },


    /**
     * Internal helper for writing the set model to the browser storage.
     */
    __storeModel : function() {
      var value = qx.util.Serializer.toNativeObject(this.model);
      this._storage.setItem(this._key, value);
    },


    /**
     * Helper for reading the model from the browser storage.
     */
    _initializeModel : function() {
      this._setModel(this._storage.getItem(this._key));
    },


    /**
     * Responsible for creating the model read from the brwoser storage.
     * @param data {var} The data read from the storage.
     */
    _setModel : function(data) {
      this._marshaler.toClass(data, true);

      var model = this._marshaler.toModel(data, true);
      if (model === undefined) {
        model = null;
      }
      this.model = model;
    },


    /**
     * Accessor for the unique key used to store the data.
     * @return {String} The key.
     */
    getKey : function() {
      return this._key;
    }
  }
});

 qx.data.store.Offline = clazz;
return clazz;
});

"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2013 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (wittemann)

************************************************************************ */

/**
 * Data binding module forwarding the data stores, marshaling and basic binding mechanisms.
 */
qx.Class.define("qx.module.DataBinding", {

  statics: {
    /**
     * Creates and returns a Json data store.
     * @param url {String?} The url to load.
     * @return {qx.data.store.Json} The new data store
     */
    createJsonStore : function(url) {
      return new qx.data.store.Json(url);
    },


    /**
     * Creates and returns a offline data store.
     * @param key {String} A unique key which is used to store the data.
     * @param storage {String?} Either "local" or "session" to determinate which
     *   storage should be used. Default: "local"
     * @return {qx.data.store.Offline} The new data store
     */
    createOfflineStore : function(key, storage) {
      return new qx.data.store.Offline(key, storage);
    }
  },

  classDefined : function(statics)
  {
    qxWeb.$attachStatic({
      data: {
        bind: qx.data.SingleValueBinding.bind.bind(qx.data.SingleValueBinding),
        createJsonStore : statics.createJsonStore,
        createOfflineStore : statics.createOfflineStore,
        createModel : qx.data.marshal.Json.createModel
      }
    });
  }
});

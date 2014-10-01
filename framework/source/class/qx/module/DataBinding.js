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


qx.Class.define("qx.module.DataBinding", {

  statics: {
    createJsonStore : function(url) {
      return new qx.data.store.Json(url);
    },

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

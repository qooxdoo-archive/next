define(['qx/Class', 'qx/data/store/Jsonp'], function(Dep0,Dep1) {
var qx = {
  "Class": Dep0,
  "data": {
    "store": {
      "Jsonp": Dep1,
      "Yql": null
    }
  }
};

"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */

/**
 * This store uses the {@link qx.data.store.Jsonp} store to query Yahoo's
 * YQL service. (http://developer.yahoo.com/yql/)
 *
 * If you want to test your queries, take a look at the YQL console:
 * http://developer.yahoo.com/yql/console/
 */
var clazz = qx.Class.define("qx.data.store.Yql",
{
  extend : qx.data.store.Jsonp,

  /**
   * @param query {String} The query for YQL.
   * @param delegate {Object?null} The delegate containing one of the methods
   *   specified in {@link qx.data.store.IStoreDelegate}.
   * @param https {Boolean?null} If https should be used.
   */
  construct : function(query, delegate, https)
  {
    var prefix = https ? "https" : "http";
    var url = prefix + "://query.yahooapis.com/v1/public/yql?q=" +
    encodeURIComponent(query) +
    "&format=json&diagnostics=false&" +
    "env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
    this.super("construct", url, delegate, "callback");
  }
});

 qx.data.store.Yql = clazz;
return clazz;
});

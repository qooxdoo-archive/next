define(['qx/Class', 'qxWeb', 'qx/io/request/Jsonp', 'qx/io/request/Script', 'qx/io/request/Xhr'], function(Dep0,Dep1,Dep2,Dep3,Dep4) {
var qx = {
  "Class": Dep0,
  "io": {
    "request": {
      "Jsonp": Dep2,
      "Script": Dep3,
      "Xhr": Dep4
    }
  },
  "module": {
    "Io": null
  }
};
var qxWeb = Dep1;

"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (wittemann)

************************************************************************ */

/**
 * This module provides basic IO functionality. It contains three ways to load
 * data:
 *
 * * XMLHttpRequest
 * * Script tag
 * * Script tag using JSONP
 *
 * @group (IO)
 */
var clazz = qx.Class.define("qx.module.Io", {
  statics :
  {
    /**
     * Returns a configured XMLHttpRequest object. Using the send method will
     * finally send the request.
     *
     * @param url {String} Mandatory URL to load the data from.
     * @param settings {Map?} Optional settings map which may contain one of
     *   the following settings:
     * <ul>
     * <li><code>method</code> The method of the request. Default: <code>GET</code></li>
     * <li><code>async</code> flag to mark the request as asynchronous. Default: <code>true</code></li>
     * <li><code>header</code> A map of request headers.</li>
     * </ul>
     *
     * @attachStatic {qxWeb, io.xhr}
     * @return {qx.io.request.Xhr} The request object.
     */
    xhr : function(url, settings) {
      if (!settings) {
        settings = {};
      }
      var xhr = new qx.io.request.Xhr(url, settings.method);
      xhr.async = settings.async;
      if (settings.header) {
        var header = settings.header;
        for (var key in header) {
          xhr.setRequestHeader(key, header[key]);
        }
      }
      return xhr;
    },


    /**
     * Returns a predefined script tag wrapper which can be used to load data
     * from cross-domain origins.
     *
     * @param url {String} Mandatory URL to load the data from.
     * @attachStatic {qxWeb, io.script}
     * @return {qx.io.request.Script} The request object.
     */
    script : function(url) {
      var script = new qx.io.request.Script();
      script.open("get", url);
      return script;
    },


    /**
     * Returns a predefined script tag wrapper which can be used to load data
     * from cross-domain origins via JSONP.
     *
     * @param url {String} Mandatory URL to load the data from.
     * @param settings {Map?} Optional settings map which may contain one of
     *   the following settings:
     *
     * * <code>callbackName</code>: The name of the callback which will
     *      be called by the loaded script.
     * * <code>callbackParam</code>: The name of the callback expected by the server
     * @attachStatic {qxWeb, io.jsonp}
     * @return {qx.io.request.Jsonp} The request object.
     */
    jsonp : function(url, settings) {
      var script = new qx.io.request.Jsonp();
      script.url = url;
      if (settings && settings.callbackName) {
        script.callbackName = settings.callbackName;
      }
      if (settings && settings.callbackParam) {
        script.callbackParam = settings.callbackParam;
      }
      script.prefix = "qxWeb.$$"; // needed in case no callback name is given
      return script;
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachStatic({
      io : {
        xhr : statics.xhr,
        script : statics.script,
        jsonp : statics.jsonp
      }
    });
  }
});

 qx.module.Io = clazz;
return clazz;
});

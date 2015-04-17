define(['qx/Class', 'qx/io/request/authentication/IAuthentication', 'qx/util/Base64'], function(Dep0,Dep1,Dep2) {
var qx = {
  "Class": Dep0,
  "io": {
    "request": {
      "authentication": {
        "IAuthentication": Dep1,
        "Basic": null
      }
    }
  },
  "util": {
    "Base64": Dep2
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
     * Tristan Koch (tristankoch)

************************************************************************ */

/**
 * Basic authentication.
 */
var clazz = qx.Class.define("qx.io.request.authentication.Basic",
{

  extend: Object,

  implement: qx.io.request.authentication.IAuthentication,

  /**
   * @param username {var} The username to use.
   * @param password {var} The password to use.
   */
  construct : function(username, password)
  {
    this.__credentials = qx.util.Base64.encode(username + ':' + password);
  },

  members :
  {
    __credentials : null,

    /**
     * Headers to include for basic authentication.
     * @return {Map} Map containing the authentication credentials
     */
    getAuthHeaders: function() {
      return [
        {key: "Authorization", value: "Basic " + this.__credentials}
      ];
    }
  }
});

 qx.io.request.authentication.Basic = clazz;
return clazz;
});

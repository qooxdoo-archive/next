define(['qx/Class', 'qxWeb', 'qx/io/rest/Resource'], function(Dep0,Dep1,Dep2) {
var qx = {
  "Class": Dep0,
  "io": {
    "rest": {
      "Resource": Dep2
    }
  },
  "module": {
    "Rest": null
  }
};
var qxWeb = Dep1;

"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2013 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Richard Sternagel (rsternagel)

************************************************************************ */
/**
 * This modules eases the communication with a RESTful web service by providing
 * a client-side wrapper of a REST resource.
 *
 * See {@link qx.io.rest.Resource}.
 *
 * @group (IO)
 */
var clazz = qx.Class.define("qx.module.Rest", {
  statics :
  {
    /**
     * @param description {Map?} Each key of the map is interpreted as
     *  <code>action</code> name. The value associated to the key must be a map
     *  with the properties <code>method</code> and <code>url</code>.
     *  <code>check</code> is optional. Also see {@link qx.io.rest.Resource#map}.
     *
     * @attachStatic {qxWeb, rest.resource}
     * @return {qx.io.rest.Resource} The resource object.
     */
    resource : function(description) {
      return new qx.io.rest.Resource(description);
    }
  },

  classDefined : function(statics) {
    qxWeb.$attachStatic({
      "rest" : {
        "resource" : statics.resource
      }
    });
  }
});

 qx.module.Rest = clazz;
return clazz;
});

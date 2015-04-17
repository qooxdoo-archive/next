define(['qx/Class', 'qx/application/Routing', 'qxWeb'], function(Dep0,Dep1,Dep2) {
var qx = {
  "Class": Dep0,
  "application": {
    "Routing": Dep1
  },
  "module": {
    "Routing": null
  }
};
var qxWeb = Dep2;

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


var clazz = qx.Class.define("qx.module.Routing", {

  classDefined : function() {
    qxWeb.$attachStatic({
      routing : new qx.application.Routing()
    });
  }
});

 qx.module.Routing = clazz;
return clazz;
});

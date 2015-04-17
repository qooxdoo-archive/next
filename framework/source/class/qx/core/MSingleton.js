define(['qx/Mixin'], function(Dep0) {
var qx = {
  "Mixin": Dep0,
  "core": {
    "MSingleton": null
  }
};

"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (wittemann)

************************************************************************ */

var clazz = qx.Mixin.define("qx.core.MSingleton", {
  statics : {
    __instance : null,

    getInstance: function() {
      if (!this.__instance) {
        this.__instance = new this();
      }
      return this.__instance;
    }
  },

  members : {
    initMSingleton : function() {
      if (this.constructor.__instance) {
        throw new Error("'" + this.classname + "' is a singleton class and can not be instantiated directly. Please use '" + this.classnme + ".getInstance()' instead.");
      }
    }
  }
});

 qx.core.MSingleton = clazz;
return clazz;
});

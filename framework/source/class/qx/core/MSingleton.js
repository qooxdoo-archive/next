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

/**
 * Mixin to supply the singleton pattern. To use that singleton, you have to forward the
 * static <code>getInstance</code> to your class and call the <code>initMSingleton</code>
 * methon in you constuctor.
 */
qx.Mixin.define("qx.core.MSingleton", {
  statics : {
    __instance : null,

    /**
     * Returns the singleton.
     * @return {Object} The singleton object.
     */
    getInstance: function() {
      if (!this.__instance) {
        this.__instance = new this();
      }
      return this.__instance;
    }
  },

  members : {
    /**
     * Initialized the mixin. It makes sure there will be only one instance of this singleton.
     */
    initMSingleton : function() {
      if (this.constructor.__instance) {
        throw new Error("'" + this.classname + "' is a singleton class and can not be instantiated directly. Please use '" + this.classnme + ".getInstance()' instead.");
      }
    }
  }
});

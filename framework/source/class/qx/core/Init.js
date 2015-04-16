"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)

************************************************************************ */

/**
 * This is the base class for all qooxdoo applications.
 *
 * @require(qx.module.Core)
 */
qx.Class.define("qx.core.Init", {
  statics : {
    __application : null,


    /**
     * Returns the instantiated qooxdoo application.
     *
     * @return {Object|null} The application instance.
     */
    getApplication : function() {
      return qx.core.Init.__application || null;
    },


    /**
     * Sets the instantiated qooxdoo application.
     *
     * @param application {Object} The application instance.
     */
    setApplication : function(application) {
      qx.core.Init.__application = application;
    },


    /**
     * Runs when the application is loaded. Automatically creates an instance
     * of the class defined by the setting <code>qx.application</code>.
     */
    ready : function() {
      if (!(qxWeb.isReady())) {
        qxWeb.ready(qx.core.Init.ready);
        return;
      }

      if (qx.core.Init.__application) {
        return;
      }

      var app = qx.core.Environment.get("qx.application");
      var Clazz = qx.Class.getByName(app);

      if (Clazz) {
        qx.core.Init.__application = new Clazz();

        var start = new Date();
        qx.core.Init.__application.main();
        qx.log.Logger.debug(qx.core.Init, "Main runtime: " + (new Date() - start) + "ms");
      } else {
        qx.log.Logger.debug(qx.core.Init, "Main application class could not be found");
      }
    },


    /**
     * Runs before the document is unloaded. Calls the application's close
     * method to check if the unload process should be stopped.
     *
     * @param e {Event} Incoming beforeunload event.
     */
    __close : function(e) {
      var app = qx.core.Init.getApplication();
      if (app) {
        var ret = app.close();
        if (ret !== undefined) {
          e.returnValue = ret;
        }
      }
    },


    /**
     * Runs when the document is unloaded. Automatically terminates a previously
     * created application instance.
     */
    __shutdown : function() {
      var app = qx.core.Init.getApplication();

      if (app) {
        app.terminate();
      }
    }
  },


  classDefined : function(statics) {
    qxWeb(window)
      .on("beforeunload", statics.__close, statics)
      .on("unload", statics.__shutdown, statics);
  }
});

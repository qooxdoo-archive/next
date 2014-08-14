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
     * Sebastian Werner (wpbasti)
     * Daniel Wagner (d_wagner)
     * John Spackman

************************************************************************ */

/**
 * This is the base class for non-browser qooxdoo applications.
 */
qx.Bootstrap.define("qx.core.BaseInit",
{
  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    __application : null,


    /**
     * Returns the instantiated qooxdoo application.
     *
     * @return {Object} The application instance.
     */
    getApplication : function() {
      return qx.core.BaseInit.__application || null;
    },


    /**
     * Runs when the application is loaded. Automatically creates an instance
     * of the class defined by the setting <code>qx.application</code>.
     *
     */
    ready : function() {
      if (!(qx.$$loader.scriptLoaded && qxWeb.isReady())) {
        return;
      }

      if (qx.core.BaseInit.__application) {
        return;
      }

      if (qx.core.Environment.get("engine.name") == "") {
        qx.log.Logger.warn("Could not detect engine!");
      }
      if (qx.core.Environment.get("engine.version") == "") {
        qx.log.Logger.warn("Could not detect the version of the engine!");
      }
      if (qx.core.Environment.get("os.name") == "") {
        qx.log.Logger.warn("Could not detect operating system!");
      }

      qx.log.Logger.debug(qx.core.BaseInit, "Load runtime: " + (new Date - qx.Bootstrap.LOADSTART) + "ms");

      var app = qx.core.Environment.get("qx.application");
      var clazz = qx.Bootstrap.getByName(app);

      if (clazz)
      {
        qx.core.BaseInit.__application = new clazz();

        var start = new Date();
        qx.core.BaseInit.__application.main();
        qx.log.Logger.debug(qx.core.BaseInit, "Main runtime: " + (new Date - start) + "ms");

        var start = new Date;
        qx.core.BaseInit.__application.finalize();
        qx.log.Logger.debug(qx.core.BaseInit, "Finalize runtime: " + (new Date - start) + "ms");
      }
      else
      {
        qx.log.Logger.warn("Missing application class: " + app);
      }
    },


    /**
     * Runs before the document is unloaded. Calls the application's close
     * method to check if the unload process should be stopped.
     *
     * @param e {qx.event.type.Native} Incoming beforeunload event.
     */
    __close : function(e)
    {
      var app = qx.core.BaseInit.__application;
      if (app) {
        app.close();
      }
    },


    /**
     * Runs when the document is unloaded. Automatically terminates a previously
     * created application instance.
     *
     */
    __shutdown : function()
    {
      var app = qx.core.BaseInit.__application;

      if (app) {
        app.terminate();
      }
    }
  }
});

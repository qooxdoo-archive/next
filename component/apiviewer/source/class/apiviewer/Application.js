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
     * Til Schneider (til132)
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Fabian Jakobs (fjakobs)
     * Jonathan Weiß (jonathan_rass)

************************************************************************ */

/**
 * Your apiviewer application
 *
 * @asset(apiviewer/*)
 * @require(qx.module.Template)
 * @require(qx.ui.Button)
 */
qx.Class.define("apiviewer.Application",
{
  extend : qx.application.Mobile,

  construct : function()
  {
    this.base(qx.application.Mobile, "constructor");
    var uri = qx.util.ResourceManager.getInstance().toUri("apiviewer/css/apiviewer.css");
    qx.bom.Stylesheet.includeFile(uri);
  },


  members :
  {
    // overridden
    main : function()
    {
      // Add log appenders
      if (qx.core.Environment.get("qx.debug")) {
        qx.log.appender.Native;
      }

      // init version label
      var data = {version : q.env.get("qx.version")};
      q("#version-label")
        .setHtml(q.template.render(q("#version-label").getHtml(), data))
        .setStyle("visibility", "visible");

      // initialize buttons
      q("#contentButton");
      q("#searchButton");
      q("#legendButton");
      q("#includesButton");
      q("#protectedButton");
      q("#privateButton");

      // new app root
      this.__root = new qx.ui.core.Root(document.getElementById("root"));
      this.setRoot(this.__root);

      qx.Mixin.add(qx.ui.core.Widget, apiviewer.MWidgetRegistry);

      // this.viewer = new apiviewer.Viewer();
      this.controller = new apiviewer.Controller();

      // this.getRoot().append(this.viewer);
      var classViewer = new apiviewer.ui.ClassViewer();
      this.getRoot().append(classViewer);

      // Finally load the data
      this.controller.load("script/apidata.json");
    },


    dispose : function() {
      this.viewer.dispose();
      this.controller.dispose();
    }
  }
});

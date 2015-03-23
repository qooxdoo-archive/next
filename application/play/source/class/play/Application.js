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
     * Martin Wittemann (martinwittemann)

************************************************************************ */

/**
 * @asset(play/*)
 * @ignore(ace)
 * @ignore(ace.edit)
 */
qx.Class.define("play.Application",
{
  extend : qx.application.Mobile,


  members : {
    main : function()
    {
      // Call super class
      this.super(qx.application.Mobile, "main");

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug")) {
        /*eslint no-unused-expressions: 0 */
        qx.log.appender.Native;
      }

      var editor = ace.edit("editor");
      editor.getSession().setMode("ace/mode/javascript");
      editor.getSession().setTabSize(2);

      // init version label
      var data = {version : q.env.get("qx.version")};
      q("#version-label")
        .setHtml(q.template.render(q("#version-label").getHtml(), data))
        .setStyle("visibility", "visible");

      // show content
      q(".play-content").setStyle("visibility", "visible");

      var samples = new play.Samples();
      var samplesMenu = new qx.ui.dialog.Menu(samples)
        .appendTo(new qx.ui.core.Root(document.body));
      samplesMenu.on("selected", function(el) {
        /*eslint no-shadow: 0 */
        var title = samplesMenu.model.getItem(el.getData("row")).title;
        var code = samples.getCode(title);
        editor.setValue(code);
        editor.clearSelection();
        q("#runButton").emit("tap");
        samplesMenu.hideWithDelay(500);
      }).title = "Samples";

      q("#runButton").on("tap", this.run, this);
      q("#samplesButton").on("tap", samplesMenu.show, samplesMenu);
      q("#shorteButton").on("tap", this.shortenUrl, this);

      (new qx.ui.Button("Close"))
        .setStyle("marginTop", "10px")
        .on("tap", function() {
          samplesMenu.hide();
        })
        .appendTo(samplesMenu.getContents());

      // new app root
      var root = new qx.ui.core.Root(document.getElementById("playroot"));
      this.setRoot(root);

      // run initial app
      if (!play.CodeStore.init()) {
        var title = samplesMenu.model.getItem(0).title;
        var code = samples.getCode(title);
        editor.setValue(code);
        this.run();
      }
    },


    run : function() {
      this.getRoot().setHtml("");
      var code = ace.edit("editor").getValue();
      play.CodeStore.add(code);
      /*eslint no-new-func: 0 */
      var f = new Function(code);
      f.bind(this)();
    },


    shortenUrl : function() {
      window.open(
        "http://tinyurl.com/create.php?url=" + encodeURIComponent(location.href),
        "tinyurl",
        "width=800,height=600,resizable=yes,scrollbars=yes"
      );
    }
  }
});

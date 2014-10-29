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
      var samplesMenu = new qx.ui.mobile.dialog.Menu(samples);
      samplesMenu.on("changeSelection", function(data) {
        var code = samples.getCode(data.item.title);
        editor.setValue(code);
        editor.clearSelection();
        q("#runButton").emit("tap");
      }).title = "Samples";

      q("#runButton").on("tap", this.run, this);
      q("#samplesButton").on("tap", samplesMenu.show, samplesMenu);
      q("#shorteButton").on("tap", this.shortenUrl, this);

      (new qx.ui.mobile.Button("Close"))
        .setStyle("marginTop", "10px")
        .on("tap", function() {
          samplesMenu.hide();
        })
        .appendTo(samplesMenu.getContents());

      // new app root
      this.__root = new qx.ui.mobile.core.Root(document.getElementById("playroot"));
      this.setRoot(this.__root);

      // run initial app
      if (!play.CodeStore.init()) {
        samplesMenu.selectedIndex = 0;
      }
    },


    run : function() {
      this.getRoot().setHtml("");
      if (this.__manager) {
        this.__manager.dispose();
        delete this.__manager;
      }
      var code = ace.edit("editor").getValue();
      play.CodeStore.add(code);
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

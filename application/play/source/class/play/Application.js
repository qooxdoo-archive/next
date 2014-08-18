/**
 * @asset(play/*)
 * @ignore(ace.edit)
 */
qx.Bootstrap.define("play.Application",
{
  extend : qx.application.Mobile,


  members : {
    main : function()
    {
      // Call super class
      this.base(qx.application.Mobile, "main");

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug")) {
        qx.log.appender.Native;
      }

      var editor = ace.edit("editor");

      // init version label
      var data = {version : q.env.get("qx.version")};
      q("#version-label").setHtml(q.template.render(q("#version-label").getHtml(), data));

      // buttons
      var runButton = new qx.ui.mobile.form.Button("Run");
      runButton.appendTo("#toolbar").on("tap", function() {
        this.getRoot().setHtml("");
        if (this.__manager) {
          this.__manager.dispose();
          delete this.__manager;
        }
        var code = editor.getValue();
        var f = new Function(code);
        f.bind(this)();
      }, this);

      var samplesButton = new qx.ui.mobile.form.Button("Samples");
      samplesButton.on("tap", function() {
        samplesMenu.show();
      }).appendTo("#toolbar");

      var samples = new play.Samples();
      var samplesMenu = new qx.ui.mobile.dialog.Menu(samples);
      samplesMenu.on("changeSelection", function(data) {
        var code = samples.getCode(data.item);
        editor.setValue(code);
        editor.clearSelection();
        runButton.emit("tap");
      }).title = "Samples";
      var closeButton = new qx.ui.mobile.form.Button("Close");
      closeButton.setStyle("marginTop", "10px")
        .on("tap", function() {
          samplesMenu.hide();
        })
        .appendTo(samplesMenu.getContents());

      var shortenButton = new qx.ui.mobile.form.Button("Shorten URL");
      shortenButton.appendTo("#toolbar").enabled = false;;

      // new app root
      this.__root = new qx.ui.mobile.core.Root(document.getElementById("playroot"));
      this.setRoot(this.__root);

      // run initial app
      samplesMenu.selectedIndex = 0;
    },


    getManager : function() {
      if (!this.__manager) {
        this.__manager = new qx.ui.mobile.page.Manager(false);
      }
      return this.__manager;
    }
  }
});

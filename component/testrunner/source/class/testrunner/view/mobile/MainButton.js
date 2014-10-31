qx.Class.define("testrunner.view.mobile.MainButton", {

  extend : qx.ui.Button,

  construct : function(label, icon)
  {
    this.super(qx.ui.Button, "constructor", label, icon);
    qx.bom.element.Class.replace(this[0], "button", "navigationbar-backbutton");
  },

  properties :
  {
    state :
    {
      apply : "_applyState"
    }
  },

  members :
  {
    _applyState : function(value)
    {
      this.removeClasses(["runbutton", "stopbutton"]);
      switch(value) {
        case "init":
          break;
        case "loading":
          this.enabled = false;
          break;
        case "ready":
          this.enabled = true;
          this.setValue("Run");
          this.addClass("runbutton");
          break;
        case "error":
          this.enabled = false;
          break;
        case "running":
          this.setValue("Stop");
          this.addClass("stopbutton");
          break;
        case "finished":
          this.setValue("Run");
          this.addClass("runbutton");
          break;
        case "aborted":
          this.setValue("Run");
          this.addClass("runbutton");
      }
    }
  }
});

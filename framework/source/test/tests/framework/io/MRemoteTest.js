qx.Mixin.define("qx.test.io.MRemoteTest",
{
  members :
  {
    getUrl : function(path) {
      return qx.util.ResourceManager.getInstance().toUri(path);
    },


    isLocal : function() {
      return window.location.protocol == "file:";
    },


    needsPHPWarning : function() {
      qx.log.Logger.warn("This test can only be run from a web server with PHP support.");
    }
  }
});
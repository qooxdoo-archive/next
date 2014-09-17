/**
 * @require(qx.module.Blocker)
 */
qx.Class.define("apiviewer.LoadingIndicator",
{
  extend : Object,
  include : [qx.core.MSingleton],

  statics : {
    getInstance : qx.core.MSingleton.getInstance
  },


  construct: function() {
    this.initMSingleton();

    return;

    // TODO
    this.__blocker = new qx.ui.core.Blocker(apiviewer.MWidgetRegistry.getWidgetById("tabView"));
    this.__blocker.setColor("#D5D5D5");
    this.__blocker.setOpacity(0.5);

    this.__blocker.getBlockerElement().setStyle('padding-top','100px');
    this.__blocker.getBlockerElement().setStyle('text-align','center');

    var loadingImage = new qx.html.Element('img');
    loadingImage.setAttribute('src',qx.util.ResourceManager.getInstance().toUri('apiviewer/image/loading66.gif'));
    this.__blocker.getBlockerElement().add(loadingImage);
  },

  members :
  {
    __blocker : null,

    show : function() {
      q(document).block("#D5D5D5", 0.5);
    },

    hide : function() {
      q(document).unblock();
    }
  }
});
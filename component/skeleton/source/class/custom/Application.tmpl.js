/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "${Name}"
 *
 * @asset(${Namespace}/*)
 */
qx.Class.define("${Namespace}.Application",
{
  extend : qx.application.Mobile,

  members :
  {
    /**
     * This method contains the initial application code and gets called
     * during startup of the application
     */
    main : function()
    {
      var button = new qx.ui.Button("First Button");
      button.on("tap", function() {
        alert("Hello World");
      }, this);
      button.appendTo(this.getRoot());
    }
  }
});

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
      q.create("<button>")
        .toButton("First Button")
        .on("tap", function() {
          alert("Hello World");
        }, this)
        .appendTo(this.getRoot());
    }
  }
});

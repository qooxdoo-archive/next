/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 */
qx.Class.define("${Namespace}.page.Overview",
{
  extend : qx.ui.page.NavigationPage,

  construct : function()
  {
    this.super(qx.ui.page.NavigationPage, "constructor");
    this.title = "Overview";
    this.showBackButton = true;
    this.backButtonText = "Back";
  },


  members :
  {
    // overridden
    _initialize : function()
    {
      this.super(qx.ui.page.NavigationPage, "_initialize");

      this.getContent().append(new qx.ui.basic.Label("Your first app."));
    },


    // overridden
    _back : function()
    {
      qx.core.Init.getApplication().getRouting().back();
    }
  }
});

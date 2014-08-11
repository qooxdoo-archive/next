/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 */
qx.Class.define("${Namespace}.page.Overview",
{
  extend : qx.ui.mobile.page.NavigationPage,

  construct : function()
  {
    this.base(this.constructor.superclass, "constructor");
    this.title = "Overview";
    this.showBackButton = true;
    this.backButtonText = "Back";
  },


  members :
  {
    // overridden
    _initialize : function()
    {
      this.base(this.constructor.superclass, "_initialize");

      this.getContent().add(new qx.ui.mobile.basic.Label("Your first app."));
    },


    // overridden
    _back : function()
    {
      qx.core.Init.getApplication().getRouting().back();
    }
  }
});
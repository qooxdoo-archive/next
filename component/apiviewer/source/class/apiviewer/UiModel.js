qx.Class.define("apiviewer.UiModel",
{
  extend : Object,
  include : [qx.core.MSingleton],

  statics : {
    getInstnace : qx.core.MSingleton.getInstance
  },

  construct : function() {
    this.initMSingleton();
  },

  properties :
  {
    /** whether to display inherited items */
    showInherited :
    {
      check: "Boolean",
      init: false,
      event : true
    },

    /** whether to display included items */
    showIncluded :
    {
      check: "Boolean",
      init: true,
      event : true
    },

    /** whether to display protected items */
    expandProperties :
    {
      check: "Boolean",
      init: false,
      event : true
    },

    /** whether to display protected items */
    showProtected :
    {
      check: "Boolean",
      init: false,
      event : true
    },

    /** whether to display private items */
    showPrivate :
    {
      check: "Boolean",
      init: false,
      event : true
    },

    /** whether to display internal items */
    showInternal :
    {
      check: "Boolean",
      init: false,
      event : true
    }
  }
});
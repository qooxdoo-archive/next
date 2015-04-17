define(['qx/Class', 'qx/application/IApplication', 'qx/core/Init'], function(Dep0,Dep1,Dep2) {
var qx = {
  "Class": Dep0,
  "application": {
    "IApplication": Dep1,
    "Basic": null
  },
  "core": {
    "Init": Dep2
  }
};

"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Thomas Herchenroeder (thron7)

************************************************************************ */

/**
 * For a basic, out-of-browser application (running e.g. on Node.js, Rhino).
 * @require(qx.core.Init)
 */
var clazz = qx.Class.define("qx.application.Basic",
{
  extend : Object,
  implement : [qx.application.IApplication],


  members :
  {
    // interface method
    main : function()
    {
      // empty
    },


    // interface method
    finalize : function()
    {
      // empty
    },


    // interface method
    close : function()
    {
      // empty
    },

    // interface method
    terminate : function()
    {
      // empty
    }
  }
});

 qx.application.Basic = clazz;
return clazz;
});

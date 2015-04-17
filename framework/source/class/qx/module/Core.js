define(['qx/Class', 'qx/module/Attribute', 'qx/module/Css', 'qx/module/Environment', 'qx/module/Event', 'qx/module/Manipulating', 'qx/module/Traversing'], function(Dep0,Dep1,Dep2,Dep3,Dep4,Dep5,Dep6) {
var qx = {
  "Class": Dep0,
  "module": {
    "Attribute": Dep1,
    "Css": Dep2,
    "Environment": Dep3,
    "Event": Dep4,
    "Manipulating": Dep5,
    "Traversing": Dep6,
    "Core": null
  }
};

"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (wittemann)

************************************************************************ */

/**
 * Placeholder class which simply defines and includes the core of qxWeb.
 * The core modules are:
 *
 * * {@link qx.module.Attribute}
 * * {@link qx.module.Css}
 * * {@link qx.module.Environment}
 * * {@link qx.module.Event}
 * * {@link qx.module.Manipulating}
 * * {@link qx.module.Traversing}
 *
 * @require(qx.module.Attribute)
 * @require(qx.module.Css)
 * @require(qx.module.Environment)
 * @require(qx.module.Event)
 * @require(qx.module.Manipulating)
 * @require(qx.module.Traversing)
 */
var clazz = qx.Class.define("qx.module.Core", {});

 qx.module.Core = clazz;
return clazz;
});

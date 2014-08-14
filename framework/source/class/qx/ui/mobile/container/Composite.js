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
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * The Composite is a generic container widget.
 *
 * It exposes all methods to set layouts and to manage child widgets
 * as public methods. You must configure this widget with a layout manager to
 * define the way the widget's children are positioned.
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *   // create the composite
 *   var composite = new qx.ui.mobile.container.Composite();
 *
 *   composite.setLayout(new qx.ui.mobile.layout.HBox());
 *
 *   // add some children
 *   composite.append(new qx.ui.mobile.basic.Label("Name: "));
 *   composite.append(new qx.ui.mobile.form.TextField());
 *
 *   this.getRoot().append(composite);
 * </pre>
 *
 * This example horizontally groups a label and text field by using a
 * Composite configured with a horizontal box layout as a container.
 */
qx.Bootstrap.define("qx.ui.mobile.container.Composite",
{
  extend : qx.ui.mobile.core.Widget,
  include : [ qx.ui.mobile.core.MChildrenHandling, qx.ui.mobile.core.MLayoutHandling],


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param layout {qx.ui.mobile.layout.Abstract?null} The layout that should be used for this
   *     container
   */
  construct : function(layout)
  {
    this.base(qx.ui.mobile.core.Widget, "constructor");
    if (layout) {
      this.setLayout(layout);
    }
  },




  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */

  defer : function(statics, members)
  {
    qx.ui.mobile.core.MChildrenHandling.remap(members);
    qx.ui.mobile.core.MLayoutHandling.remap(members);
  }
});

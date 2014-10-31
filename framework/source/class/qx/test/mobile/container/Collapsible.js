/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

************************************************************************ */

qx.Class.define("qx.test.mobile.container.Collapsible",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testFactory: function() {
      var collapsible = q.create('<div>')
        .collapsible("Header")
        .appendTo(this.getRoot());

      this.assertInstance(collapsible, qx.ui.container.Collapsible);
      this.assertInstance(qxWeb(collapsible.getChildren()[0]), qx.ui.basic.Label);
      this.assertInstance(collapsible.find(".collapsible-content"), qx.ui.Widget);
      collapsible.remove().dispose();
    }
  }

});
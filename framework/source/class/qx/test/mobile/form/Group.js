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
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

qx.Bootstrap.define("qx.test.mobile.form.Group",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testGroup : function()
    {
      var button = new qx.ui.mobile.form.Button("affe");
      var group = new qx.ui.mobile.form.Group();
      group.append(button);
      this.getRoot().append(button);

      group.dispose();
      button.dispose();
    }
  }

});

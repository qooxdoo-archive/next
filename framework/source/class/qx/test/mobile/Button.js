/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

qx.Bootstrap.define("qx.test.mobile.Button",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testLabel : function()
    {
      var button = new qx.ui.mobile.Button("affe");
      this.getRoot().append(button);

      this.assertString(button.label);
      this.assertEquals("affe", button.label );
      this.assertEquals(button.label, button.getLabelWidget().getHtml());

      this.assertEventFired(button, "changeLabel", function() {
        button.label = "";
      });

      this.assertEquals("", button.label);
      this.assertNull(button.getLabelWidget().getHtml());

      button.dispose();
    },

    testFactory: function() {
      var button = qxWeb.create("<div>").button().appendTo(this.getRoot());
      this.assertInstance(button, qx.ui.mobile.Button);
      this.assertEquals(button, button[0].$$widget);
      this.wait(100, function() {
        this.assertEquals("qx.ui.mobile.Button", button.getData("qxWidget"));
      }, this);
    }
  }

});

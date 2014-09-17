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

qx.Class.define("qx.test.mobile.layout.VBox",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testAdd : function()
    {
      var composite = new qx.ui.mobile.Widget();
      composite.layout = new qx.ui.mobile.layout.VBox();
      this.getRoot().append(composite);


      this.assertTrue(composite.hasClass("qx-vbox"));

      var widget1 = new qx.ui.mobile.Widget();
      composite.append(widget1);

      var widget2 = new qx.ui.mobile.Widget();
      composite.append(widget2);

      widget1.dispose();
      widget2.dispose();
      composite.dispose();
    },


    testFlex : function() {
      var composite = new qx.ui.mobile.Widget();
      composite.layout = new qx.ui.mobile.layout.VBox();
      this.getRoot().append(composite);

      var widget1 = new qx.ui.mobile.Widget();
      widget1.layoutPrefs = {flex:1};
      composite.append(widget1);
      this.assertTrue(widget1.hasClass("qx-flex1"));

      var widget2 = new qx.ui.mobile.Widget();
      widget2.layoutPrefs = {flex:2};
      composite.append(widget2);
      this.assertTrue(widget2.hasClass("qx-flex2"));

      widget1.dispose();
      widget2.dispose();
      composite.dispose();
    },


    testRemove : function() {
      var composite = new qx.ui.mobile.Widget();
      composite.layout = new qx.ui.mobile.layout.VBox();
      this.getRoot().append(composite);

      var widget1 = new qx.ui.mobile.Widget();
      widget1.layoutPrefs = {flex:1};
      composite.append(widget1);
      widget1.remove();
      this.assertFalse(widget1.hasClass("qx-flex1"));

      var widget2 = new qx.ui.mobile.Widget();
      widget2.layoutPrefs = {flex:2};
      composite.append(widget2);
      widget2.remove();
      this.assertFalse(widget2.hasClass("qx-flex2"));

      composite.remove();
      this.assertTrue(composite.hasClass("qx-vbox"));

      widget1.dispose();
      widget2.dispose();
      composite.dispose();
    },


    testReset : function() {
      var composite = new qx.ui.mobile.Widget();
      composite.layout = new qx.ui.mobile.layout.VBox();
      this.getRoot().append(composite);

      composite.layout = null;
      this.assertFalse(composite.hasClass("qx-vbox"));

      composite.dispose();
    }
  }

});

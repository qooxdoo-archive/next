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

qx.Bootstrap.define("qx.test.mobile.form.TextField",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testValue : function()
    {
      var textField = new qx.ui.mobile.form.TextField();
      this.getRoot().append(textField);

      this.assertEquals('',textField.value);
      this.assertEquals(null,qx.bom.element.Attribute.get(textField[0],'value'));
      this.assertEventFired(textField, "changeValue", function() {
        textField.value = "mytext";
      });
      this.assertEquals('mytext',textField.value);
      this.assertEquals('mytext',qx.bom.element.Attribute.get(textField[0],'value'));

      textField.dispose();

      textField = new qx.ui.mobile.form.TextField('affe');
      this.getRoot().append(textField);
      this.assertEquals('affe',textField.value);
      this.assertEquals('affe',qx.bom.element.Attribute.get(textField[0],'value'));
      textField.dispose();
    },


    testEnabled : function()
    {
      var textField = new qx.ui.mobile.form.TextField();
      this.getRoot().append(textField);
      this.assertEquals(true,textField.enabled);
      this.assertFalse(qx.bom.element.Class.has(textField[0],'disabled'));

      textField.enabled = false;
      this.assertEquals(false,textField.enabled);
      this.assertEquals(true,qx.bom.element.Class.has(textField[0],'disabled'));

      textField.dispose();
    }

  }
});

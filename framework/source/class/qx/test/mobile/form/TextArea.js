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

qx.Class.define("qx.test.mobile.form.TextArea",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testValue : function()
    {
      var textArea = new qx.ui.mobile.form.TextArea();
      this.getRoot().add(textArea);

      this.assertEquals('', textArea.value);
      this.assertEquals(null, qx.bom.element.Attribute.get(textArea.getContainerElement(),'value'));
      this.assertEventFired(textArea, "changeValue", function() {
        textArea.value = "mytext";
      });
      this.assertEquals('mytext', textArea.value);
      this.assertEquals('mytext', qx.bom.element.Attribute.get(textArea.getContainerElement(),'value'));

      textArea.dispose();

      textArea = new qx.ui.mobile.form.TextArea('affe');
      this.getRoot().add(textArea);
      this.assertEquals('affe', textArea.value);
      this.assertEquals('affe', qx.bom.element.Attribute.get(textArea.getContainerElement(),'value'));
      textArea.dispose();
    },


    testEnabled : function()
    {
      var textArea = new qx.ui.mobile.form.TextArea();
      this.getRoot().add(textArea);
      this.assertEquals(true, textArea.enabled);
      this.assertFalse(qx.bom.element.Class.has(textArea.getContainerElement(),'disabled'));

      textArea.enabled = false;
      this.assertEquals(false, textArea.enabled);
      this.assertEquals(true, qx.bom.element.Class.has(textArea.getContainerElement(),'disabled'));

      textArea.dispose();
    }

  }
});

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

/* ************************************************************************
************************************************************************ */
/**
 *
 * @asset(qx/icon/Tango/48/places/user-home.png)
 * @asset(qx/icon/Tango/32/places/folder-open.png)
 */

qx.Bootstrap.define("qx.test.mobile.basic.Atom",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testLabel : function()
    {
      var atom = new qx.ui.mobile.basic.Atom("myText");
      this.getRoot().append(atom);

      this.assertString(atom.label);
      this.assertEquals(atom.label, "myText");
      this.assertEquals(atom.label, atom.getLabelWidget().getHtml());

      atom.label = "mySecondText";
      this.assertEquals(atom.label, "mySecondText");
      this.assertEquals(atom.label, atom.getLabelWidget().getHtml());

      atom.dispose();
    },

    testIcon : function()
    {
      var imageURL = qx.util.ResourceManager.getInstance().toUri("qx/icon/Tango/48/places/user-home.png");
      var atom = new qx.ui.mobile.basic.Atom("myText", imageURL);
      this.getRoot().append(atom);

      this.assertString(atom.icon);
      this.assertEquals(atom.getIconWidget().source, imageURL);
      // atom.getIconWidget()[0].src is usually in the form:
      // http://127.0.0.1/tablet/framework/test/html/qx/icon/Tango/48/places/folder-remote.png
      // but http://127.0.0.1/tablet/framework/test/html/ differs on where you test it
      this.assertTrue(atom.getIconWidget().getAttribute("src").indexOf("qx/icon/Tango/48/places/user-home.png") != -1);

      var image2URL = qx.util.ResourceManager.getInstance().toUri("qx/icon/Tango/32/places/folder-open.png");

      atom.icon = image2URL;
      this.assertEquals(atom.icon, image2URL);
      this.assertTrue(atom.getIconWidget().getAttribute("src").indexOf("qx/icon/Tango/32/places/folder-open.png") != -1);

      atom.dispose();
    },

    testShow : function()
    {
      var imageURL = qx.util.ResourceManager.getInstance().toUri("qx/icon/Tango/48/places/user-home.png");
      var atom = new qx.ui.mobile.basic.Atom("myText", imageURL);
      this.getRoot().append(atom);

      this.assertEquals("visible", atom.getIconWidget().visibility);
      this.assertEquals("visible", atom.getLabelWidget().visibility);

      atom.showChildren = 'label';
      this.assertEquals("excluded", atom.getIconWidget().visibility);
      this.assertEquals("visible", atom.getLabelWidget().visibility);

      atom.showChildren = 'icon';
      this.assertEquals("visible", atom.getIconWidget().visibility);
      this.assertEquals("excluded", atom.getLabelWidget().visibility);

      atom.showChildren = 'both';
      this.assertEquals("visible", atom.getIconWidget().visibility);
      this.assertEquals("visible", atom.getLabelWidget().visibility);
    },


    testIconPosition : function()
    {
      var imageURL = qx.util.ResourceManager.getInstance().toUri("qx/icon/Tango/48/places/user-home.png");
      var atom = new qx.ui.mobile.basic.Atom("myTextmyTextmyTextmyTextmyText", imageURL);
      this.getRoot().append(atom);

      var iconElement = atom.getIconWidget()[0];
      var labelElement = atom.getLabelWidget()[0];

      atom.iconPosition = 'top';
      this.assertTrue(qx.bom.element.Location.getTop(iconElement) <= qx.bom.element.Location.getTop(labelElement), "setIconPosition(top): iconElement.top is greater than labelElement.top");
      this.assertTrue(atom.getIconWidget()._getParentWidget().layout.classname.indexOf("VBox") !== -1,"Layout of IconPosition Top should be VBox ");
      this.assertFalse(atom.getIconWidget()._getParentWidget().layout.reversed,"Layout should not be reversed.");

      atom.iconPosition = 'bottom';
      this.assertTrue(atom.getIconWidget()._getParentWidget().layout.classname.indexOf("VBox") !== -1,"Layout of IconPosition Bottom should be VBox ");
      this.assertTrue(atom.getIconWidget()._getParentWidget().layout.reversed,"Layout should be reversed.");

      atom.iconPosition = 'left';
      this.assertTrue(atom.getIconWidget()._getParentWidget().layout.classname.indexOf("HBox") !== -1,"Layout of IconPosition Left should be HBox ");
      var labelLeft = qx.bom.element.Location.getLeft(labelElement);
      var iconLeft = qx.bom.element.Location.getLeft(iconElement);
      this.assertTrue(iconLeft <= labelLeft, "setIconPosition(left): iconElement.left is greater than labelElement.left");
      this.assertFalse(atom.getIconWidget()._getParentWidget().layout.reversed,"Layout should not be reversed.");

      atom.iconPosition = 'right';
      this.assertTrue(atom.getIconWidget()._getParentWidget().layout.classname.indexOf("HBox") !== -1,"Layout of IconPosition Right should be HBox ");
      this.assertTrue(atom.getIconWidget()._getParentWidget().layout.reversed,"Layout should be reversed.");

      labelLeft = qx.bom.element.Location.getLeft(labelElement);
      iconLeft = qx.bom.element.Location.getLeft(iconElement);
      this.assertTrue(iconLeft >= labelLeft, "setIconPosition(right): iconElement.left is lower than labelElement.left");
    },


    testSetLabelAndIcon : function() {

      var testText = "test234";

      var imageURL = qx.util.ResourceManager.getInstance().toUri("qx/icon/Tango/48/places/user-home.png");

      var atom = new qx.ui.mobile.basic.Atom();
      atom.label = testText;
      atom.icon = imageURL;

      var atomElement = atom[0];
      var atomChildrenLength = atomElement.children.length;

      var atomIconTag = atomElement.children[0].tagName;
      var atomIconInnerHtml = atomElement.children[0].innerHTML;
      var atomLabelInnerHtml = atomElement.children[1].innerHTML;

      this.assertEquals("IMG", atomIconTag, 'Unexpected atom children tag');
      this.assertEquals(2, atomChildrenLength, 'Unexpected count of atom element children');
      this.assertEquals('',atomIconInnerHtml, 'Child element of icon has wrong content');
      this.assertEquals(testText,atomLabelInnerHtml, 'Child element of icon has wrong content');
    }
  }

});

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

describe("mobile.Atom", function() {


 it("Label", function() {
      var atom = new qx.ui.Atom("myText");

      sandbox.append(atom);

      assert.isString(atom.label);
      assert.equal(atom.label, "myText");
      assert.equal(atom.label, atom.getLabelWidget().getHtml());

      atom.label = "mySecondText";
      assert.equal(atom.label, "mySecondText");
      assert.equal(atom.label, atom.getLabelWidget().getHtml());

      atom.dispose();
  });


  it("Icon", function() {
      var imageURL = "../resource/qx/icon/Tango/48/places/user-home.png";
      var atom = new qx.ui.Atom("myText", imageURL);

      sandbox.append(atom);

      assert.isString(atom.icon);
      assert.equal(atom.getIconWidget().source, imageURL);
      // atom.getIconWidget()[0].src is usually in the form:
      // http://127.0.0.1/tablet/framework/test/html/qx/icon/Tango/48/places/folder-remote.png
      // but http://127.0.0.1/tablet/framework/test/html/ differs on where you test it
      assert.isTrue(atom.getIconWidget().getAttribute("src").indexOf("../resource/qx/icon/Tango/48/places/user-home.png") != -1);

      var image2URL = "../resource/qx/icon/Tango/32/places/folder-open.png";

      atom.icon = image2URL;
      assert.equal(atom.icon, image2URL);
      assert.isTrue(atom.getIconWidget().getAttribute("src").indexOf("../resource/qx/icon/Tango/32/places/folder-open.png") != -1);

      atom.dispose();
  });


  it("Show", function() {
      var imageURL = "../resource/qx/icon/Tango/48/places/user-home.png";
      var atom = new qx.ui.Atom("myText", imageURL);

      sandbox.append(atom);

      assert.equal("visible", atom.getIconWidget().visibility);
      assert.equal("visible", atom.getLabelWidget().visibility);

      atom.showChildren = 'label';
      assert.equal("excluded", atom.getIconWidget().visibility);
      assert.equal("visible", atom.getLabelWidget().visibility);

      atom.showChildren = 'icon';
      assert.equal("visible", atom.getIconWidget().visibility);
      assert.equal("excluded", atom.getLabelWidget().visibility);

      atom.showChildren = 'both';
      assert.equal("visible", atom.getIconWidget().visibility);
      assert.equal("visible", atom.getLabelWidget().visibility);
  });


  it("IconPosition", function() {
      var imageURL = "../resource/qx/icon/Tango/48/places/user-home.png";
      var atom = new qx.ui.Atom("myTextmyTextmyTextmyTextmyText", imageURL);

      sandbox.append(atom);

      var iconElement = atom.getIconWidget()[0];
      var labelElement = atom.getLabelWidget()[0];

      atom.iconPosition = 'top';
      assert.isTrue(qx.bom.element.Location.getTop(iconElement) <= qx.bom.element.Location.getTop(labelElement), "setIconPosition(top): iconElement.top is greater than labelElement.top");
      assert.isTrue(atom.getIconWidget()._getParentWidget().layout.classname.indexOf("VBox") !== -1,"Layout of IconPosition Top should be VBox ");
      assert.isFalse(atom.getIconWidget()._getParentWidget().layout.reversed,"Layout should not be reversed.");

      atom.iconPosition = 'bottom';
      assert.isTrue(atom.getIconWidget()._getParentWidget().layout.classname.indexOf("VBox") !== -1,"Layout of IconPosition Bottom should be VBox ");
      assert.isTrue(atom.getIconWidget()._getParentWidget().layout.reversed,"Layout should be reversed.");

      atom.iconPosition = 'left';
      assert.isTrue(atom.getIconWidget()._getParentWidget().layout.classname.indexOf("HBox") !== -1,"Layout of IconPosition Left should be HBox ");
      var labelLeft = qx.bom.element.Location.getLeft(labelElement);
      var iconLeft = qx.bom.element.Location.getLeft(iconElement);
      assert.isTrue(iconLeft <= labelLeft, "setIconPosition(left): iconElement.left is greater than labelElement.left");
      assert.isFalse(atom.getIconWidget()._getParentWidget().layout.reversed,"Layout should not be reversed.");

      atom.iconPosition = 'right';
      assert.isTrue(atom.getIconWidget()._getParentWidget().layout.classname.indexOf("HBox") !== -1,"Layout of IconPosition Right should be HBox ");
      assert.isTrue(atom.getIconWidget()._getParentWidget().layout.reversed,"Layout should be reversed.");

      labelLeft = qx.bom.element.Location.getLeft(labelElement);
      iconLeft = qx.bom.element.Location.getLeft(iconElement);
      assert.isTrue(iconLeft >= labelLeft, "setIconPosition(right): iconElement.left is lower than labelElement.left");
  });


  it("SetLabelAndIcon", function() {

      var testText = "test234";
      var imageURL = "../resource/qx/icon/Tango/48/places/user-home.png";

      var atom = new qx.ui.Atom();
      atom.label = testText;
      atom.icon = imageURL;

      var atomElement = atom[0];
      var atomChildrenLength = atomElement.children.length;

      var atomIconTag = atomElement.children[0].tagName;
      var atomIconInnerHtml = atomElement.children[0].innerHTML;
      var atomLabelInnerHtml = atomElement.children[1].innerHTML;

      assert.equal("IMG", atomIconTag, 'Unexpected atom children tag');
      assert.equal(2, atomChildrenLength, 'Unexpected count of atom element children');
      assert.equal('',atomIconInnerHtml, 'Child element of icon has wrong content');
      assert.equal(testText,atomLabelInnerHtml, 'Child element of icon has wrong content');
  });


  it("Factory", function() {
    var imagePath = "../resource/qx/icon/Tango/48/places/user-home.png";
    var imageUri = imagePath;
    var label = "myText";
    var atom = q.create('<div></div>')
      .toAtom(label, imageUri)
      .appendTo(sandbox);

    assert.instanceOf(atom, qx.ui.Atom);
    assert.equal(atom, atom[0].$$widget);
    assert.equal(label, atom.label);
    assert.equal(imageUri, atom.icon);
    assert.equal("qx.ui.Atom", atom.getData("qxWidget"));
    atom.remove().dispose();
  });

});

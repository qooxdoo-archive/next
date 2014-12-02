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

describe("mobile.form.TextArea", function() {

  it("Value", function() {
    var textArea = new qx.ui.form.TextArea();
    sandbox.append(textArea);

    assert.equal(null, textArea.value);
    assert.equal(null, qx.bom.element.Attribute.get(textArea[0], 'value'));
    qx.core.Assert.assertEventFired(textArea, "changeValue", function() {
      textArea.value = "mytext";
    });
    assert.equal('mytext', textArea.value);
    assert.equal('mytext', qx.bom.element.Attribute.get(textArea[0], 'value'));

    textArea.dispose();

    textArea = new qx.ui.form.TextArea('affe');
    sandbox.append(textArea);
    assert.equal('affe', textArea.value);
    assert.equal('affe', qx.bom.element.Attribute.get(textArea[0], 'value'));
    textArea.dispose();
  });


  it("Enabled", function() {
    var textArea = new qx.ui.form.TextArea();
    sandbox.append(textArea);
    assert.equal(true, textArea.enabled);
    assert.isFalse(qx.bom.element.Class.has(textArea[0], 'disabled'));

    textArea.enabled = false;
    assert.equal(false, textArea.enabled);
    assert.equal(true, qx.bom.element.Class.has(textArea[0], 'disabled'));

    textArea.dispose();
  });
});

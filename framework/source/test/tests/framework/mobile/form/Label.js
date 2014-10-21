/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2011-2013 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

describe("mobile.form.Label", function() {

  beforeEach(function() {
    setUpRoot();
  });


  afterEach(function() {
    tearDownRoot();
  });


  it("LabelForTarget", function() {
    var label = new qx.ui.mobile.form.Label("foo-label");
    var target = new qx.ui.mobile.form.TextField("foo");
    label.setLabelFor(target.getAttribute("id"));

    var foundValue = label.getAttribute("for");

    assert.equal(target.getAttribute("id"), foundValue, "'For' attribute has an unexpected value.");

    label.dispose();
    target.dispose();
  });


  it("DisableTarget", function() {
    var label = new qx.ui.mobile.form.Label("foo-label");
    var target = new qx.ui.mobile.form.TextField("foo");
    getRoot().append(target);

    target.enabled = false;

    label.setLabelFor(target.getAttribute("id"));

    // check if state is considered before label.for is set.
    assert.equal(target.enabled, label.enabled);

    target.enabled = true;

    assert.isTrue(label.enabled);

    target.enabled = false;

    assert.isFalse(label.enabled);

    label.dispose();
    target.dispose();
  });
});

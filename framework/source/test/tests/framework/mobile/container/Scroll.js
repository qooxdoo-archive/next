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
     * Tino Butz (tbtz)

************************************************************************ */

describe("mobile.container.Scroll", function() {

  beforeEach(function() {
    setUpRoot();
  });

  afterEach(function() {
    tearDownRoot();
  });


  it("Create", function() {
    var container = new qx.ui.container.Scroll();
    getRoot().append(container);
    container.dispose();
  });


  it("Factory", function() {
    var scroll = q.create('<div>')
      .toScroll()
      .appendTo(getRoot());

    assert.instanceOf(scroll, qx.ui.container.Scroll);
    assert.equal(scroll, scroll[0].$$widget);
    assert.equal("qx.ui.container.Scroll", scroll.getData("qxWidget"));

    scroll.dispose();
  });

});

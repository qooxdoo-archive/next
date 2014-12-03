/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

************************************************************************ */

describe("mobile.FlexCarousel", function() {

  var carousel;

  beforeEach(function() {
    carousel = new qx.ui.FlexCarousel();
    carousel.appendTo(sandbox);
  });


  afterEach(function() {
    carousel.dispose();
  });


  it("intitial active", function() {
    var p1 = new qx.ui.Widget();
    p1.appendTo(carousel);
    assert.equal(carousel.active[0], p1[0]);
    assert.equal(p1.getStyle("order"), "0");
  });


  it("order first active", function() {
    var p1 = new qx.ui.Widget();
    p1.appendTo(carousel);
    var p2 = new qx.ui.Widget();
    p2.appendTo(carousel);
    var p3 = new qx.ui.Widget();
    p3.appendTo(carousel);

    assert.equal(p1.getStyle("order"), "0");
    assert.equal(p2.getStyle("order"), "1");
    assert.equal(p3.getStyle("order"), "-1");
  });


  it("order last active", function() {
    var p1 = new qx.ui.Widget();
    p1.appendTo(carousel);
    var p2 = new qx.ui.Widget();
    p2.appendTo(carousel);
    var p3 = new qx.ui.Widget();
    p3.appendTo(carousel);

    carousel.active = p3;

    assert.equal(p3.getStyle("order"), "0");
    assert.equal(p1.getStyle("order"), "1");
    assert.equal(p2.getStyle("order"), "-1");
  });


  it("order middle active", function() {
    var p1 = new qx.ui.Widget();
    p1.appendTo(carousel);
    var p2 = new qx.ui.Widget();
    p2.appendTo(carousel);
    var p3 = new qx.ui.Widget();
    p3.appendTo(carousel);

    carousel.active = p2;

    assert.equal(p2.getStyle("order"), "0");
    assert.equal(p3.getStyle("order"), "1");
    assert.equal(p1.getStyle("order"), "-1");
  });

  it("remove active", function() {
    var p1 = new qx.ui.Widget();
    p1.appendTo(carousel);
    var p2 = new qx.ui.Widget();
    p2.appendTo(carousel);
    var p3 = new qx.ui.Widget();
    p3.appendTo(carousel);
    var p4 = new qx.ui.Widget();
    p4.appendTo(carousel);

    p1.remove();

    assert.equal(carousel.active[0], p2[0]);
    assert.equal(p2.getStyle("order"), "0");
    assert.equal(p3.getStyle("order"), "1");
    assert.equal(p4.getStyle("order"), "-1");
  });


  it("nextPage", function() {
    var p1 = new qx.ui.Widget();
    p1.appendTo(carousel);
    var p2 = new qx.ui.Widget();
    p2.appendTo(carousel);
    var p3 = new qx.ui.Widget();

    carousel.nextPage();
    assert.equal(carousel.active[0], p2[0]);

    carousel.nextPage();
    assert.equal(carousel.active[0], p3[0]);

    carousel.nextPage();
    assert.equal(carousel.active[0], p1[0]);
  });
});
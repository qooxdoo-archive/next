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
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

describe("mobile.container.Carousel", function() {

  beforeEach(function() {
    setUpRoot();
  });


  afterEach(function() {
    tearDownRoot();
  });


  it("Init", function() {
    var carousel = new qx.ui.container.Carousel(0.4);
    getRoot().append(carousel);
    carousel.dispose();
  });


  it("Add Page", function() {
    var carousel = new qx.ui.container.Carousel();
    var carouselPage = new qx.ui.Widget();
    carousel.append(carouselPage);

    getRoot().append(carousel);

    carousel.dispose();
    carouselPage.dispose();
  });


  it("Remove Page", function() {
    var carousel = new qx.ui.container.Carousel();
    var carouselPage1 = new qx.ui.Widget();
    carousel.append(carouselPage1);
    var carouselPage2 = new qx.ui.Widget();
    carousel.append(carouselPage2);

    getRoot().append(carousel);
    carouselPage1.remove();

    assert.equal(carouselPage2[0], carousel.active);

    carousel.dispose();
    carouselPage1.dispose();
    carouselPage2.dispose();
  });


  it("FirstActive", function() {
    var carousel = new qx.ui.container.Carousel();
    var carouselPage1 = new qx.ui.Widget();
    carousel.append(carouselPage1);

    var carouselPage2 = new qx.ui.Widget();
    carousel.append(carouselPage2);

    getRoot().append(carousel);

    assert.equal(carouselPage1[0], carousel.active);

    carousel.dispose();
    carouselPage1.dispose();
    carouselPage2.dispose();
  });


  it("PageSwitch", function() {
    var carousel = new qx.ui.container.Carousel();
    var carouselPage1 = new qx.ui.Widget();
    carousel.append(carouselPage1);

    var carouselPage2 = new qx.ui.Widget();
    carousel.append(carouselPage2);

    getRoot().append(carousel);

    carousel.nextPage();
    assert.equal(carouselPage2[0], carousel.active);

    // OVERFLOW
    carousel.nextPage();
    assert.equal(carouselPage1[0], carousel.active);

    carousel.previousPage();
    assert.equal(carouselPage2[0], carousel.active);

    // OVERFLOW
    carousel.previousPage();
    assert.equal(carouselPage1[0], carousel.active);

    carousel.dispose();
    carouselPage1.dispose();
    carouselPage2.dispose();
  });


  it("PageSwitchEvent", function() {
    var carousel = new qx.ui.container.Carousel();
    var carouselPage1 = new qx.ui.Widget();
    carousel.append(carouselPage1);

    var carouselPage2 = new qx.ui.Widget();
    carousel.append(carouselPage2);

    getRoot().append(carousel);

    qx.core.Assert.assertEventFired(carousel, "changeActive", function() {
      carousel.nextPage();
    }, function(data) {
      assert.equal(carouselPage2[0], data.value);
      assert.equal(carouselPage1[0], data.old);
    }.bind(this));

    qx.core.Assert.assertEventFired(carousel, "changeActive", function() {
      carousel.previousPage();
    }, function(data) {
      assert.equal(carouselPage1[0], data.value);
      assert.equal(carouselPage2[0], data.old);
    }.bind(this));

    carousel.dispose();
    carouselPage1.dispose();
    carouselPage2.dispose();
  });


  it("ScrollToPage", function(done) {
    var carousel = new qx.ui.container.Carousel();
    var carouselPage1 = new qx.ui.Widget();
    carousel.append(carouselPage1);

    var carouselPage2 = new qx.ui.Widget();
    carousel.append(carouselPage2);
    getRoot().append(carousel);

    assert.equal(carouselPage1[0], carousel.active);

    carousel.active = carouselPage2[0];
    assert.equal(carouselPage2[0], carousel.active);

    window.setTimeout(function() {
      carousel.dispose();
      carouselPage1.dispose();
      carouselPage2.dispose();
      done();
    }, 600);
  });


  it("Factory", function() {
    var carousel = q.create('<div>')
      .toCarousel()
      .appendTo(getRoot());

    assert.instanceOf(carousel, qx.ui.container.Carousel);
    assert.equal(carousel, carousel[0].$$widget);
    assert.equal("qx.ui.container.Carousel", carousel.getData("qxWidget"));

    carousel.remove().dispose();
  });

});

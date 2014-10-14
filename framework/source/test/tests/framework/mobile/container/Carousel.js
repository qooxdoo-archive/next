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

describe("mobile.container.Carousel", function ()
{
 beforeEach( function () {
   setUpRoot();
  });

 afterEach( function (){
   tearDownRoot();
 });
  it("Init", function() {
      var carousel = new qx.ui.mobile.container.Carousel(0.4);
      getRoot().append(carousel);
      carousel.dispose();
  });
 
  it("AddCarouselPage", function() {
      var carousel = new qx.ui.mobile.container.Carousel();
      var carouselPage = new qx.ui.mobile.Widget();
      carousel.append(carouselPage);

      getRoot().append(carousel);

      carousel.dispose();
      carouselPage.dispose();
  });
 
  it("RemoveCarouselPage", function() {
      var carousel = new qx.ui.mobile.container.Carousel();
      var carouselPage = new qx.ui.mobile.Widget();

      carousel.append(carouselPage);

      carousel.removePageByIndex(0);

      getRoot().append(carousel);

      carousel.dispose();
      carouselPage.dispose();
  });
 
  it("PageSwitch", function() {
      var carousel = new qx.ui.mobile.container.Carousel();
      var carouselPage1 = new qx.ui.mobile.Widget();
      carousel.append(carouselPage1);

      var carouselPage2 = new qx.ui.mobile.Widget();
      carousel.append(carouselPage2);

      getRoot().append(carousel);

      assert.equal(0,carousel.currentIndex);

      carousel.nextPage();
      assert.equal(1, carousel.currentIndex);

      // OVERFLOW
      carousel.nextPage();
      assert.equal(1, carousel.currentIndex);

      carousel.previousPage();
      assert.equal(0,carousel.currentIndex);

      // OVERFLOW
      carousel.previousPage();
      assert.equal(0,carousel.currentIndex);

      carousel.dispose();
      carouselPage1.dispose();
      carouselPage2.dispose();
  });
 
  it("PageSwitchEvent", function() {
      var carousel = new qx.ui.mobile.container.Carousel();
      var carouselPage1 = new qx.ui.mobile.Widget();
      carousel.append(carouselPage1);

      var carouselPage2 = new qx.ui.mobile.Widget();
      carousel.append(carouselPage2);

      getRoot().append(carousel);

      qx.core.Assert.assertEventFired(carousel, "changeCurrentIndex", function() {
        carousel.nextPage();
      }, function(e) {
        assert.equal(1, e.value);
        assert.equal(0, e.old);
      }.bind(this));

      qx.core.Assert.assertEventFired(carousel, "changeCurrentIndex", function() {
        carousel.previousPage();
      }, function(e) {
        assert.equal(0, e.value);
        assert.equal(1, e.old);
      }.bind(this));

      carousel.dispose();
      carouselPage1.dispose();
      carouselPage2.dispose();
  });
 
  it("ScrollToPage", function() {
      var carousel = new qx.ui.mobile.container.Carousel();
      var carouselPage1 = new qx.ui.mobile.Widget();
      carousel.append(carouselPage1);

      var carouselPage2 = new qx.ui.mobile.Widget();
      carousel.append(carouselPage2);

      getRoot().append(carousel);

      assert.equal(0,carousel.currentIndex);

      carousel.currentIndex = 1;
      assert.equal(1, carousel.currentIndex);

      window.setTimeout(function() {
        carousel.dispose();
        carouselPage1.dispose();
        carouselPage2.dispose();
      }, 600);
  });
 
  it("Factory", function() {
      var carousel = q.create('<div>')
        .carousel()
        .appendTo(getRoot());

      assert.instanceOf(carousel, qx.ui.mobile.container.Carousel);
      carousel.remove().dispose();
    
  });

});

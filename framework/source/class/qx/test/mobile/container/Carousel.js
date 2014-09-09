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

qx.Bootstrap.define("qx.test.mobile.container.Carousel",
{
  extend : qx.test.mobile.MobileTestCase,

  members :
  {
    testInit : function()
    {
      var carousel = new qx.ui.mobile.container.Carousel(0.4);
      this.getRoot().append(carousel);
      carousel.dispose();
    },


    testAddCarouselPage : function()
    {
      var carousel = new qx.ui.mobile.container.Carousel();
      var carouselPage = new qx.ui.mobile.Widget();
      carousel.append(carouselPage);

      this.getRoot().append(carousel);

      carousel.dispose();
      carouselPage.dispose();
    },


    testRemoveCarouselPage : function()
    {
      var carousel = new qx.ui.mobile.container.Carousel();
      var carouselPage = new qx.ui.mobile.Widget();

      carousel.append(carouselPage);

      carousel.removePageByIndex(0);

      this.getRoot().append(carousel);

      carousel.dispose();
      carouselPage.dispose();
    },


    testPageSwitch : function()
    {
      var carousel = new qx.ui.mobile.container.Carousel();
      var carouselPage1 = new qx.ui.mobile.Widget();
      carousel.append(carouselPage1);

      var carouselPage2 = new qx.ui.mobile.Widget();
      carousel.append(carouselPage2);

      this.getRoot().append(carousel);

      this.assertEquals(0,carousel.currentIndex);

      carousel.nextPage();
      this.assertEquals(1, carousel.currentIndex);

      // OVERFLOW
      carousel.nextPage();
      this.assertEquals(1, carousel.currentIndex);

      carousel.previousPage();
      this.assertEquals(0,carousel.currentIndex);

      // OVERFLOW
      carousel.previousPage();
      this.assertEquals(0,carousel.currentIndex);

      carousel.dispose();
      carouselPage1.dispose();
      carouselPage2.dispose();
    },


    testPageSwitchEvent : function()
    {
      var carousel = new qx.ui.mobile.container.Carousel();
      var carouselPage1 = new qx.ui.mobile.Widget();
      carousel.append(carouselPage1);

      var carouselPage2 = new qx.ui.mobile.Widget();
      carousel.append(carouselPage2);

      this.getRoot().append(carousel);

      this.assertEventFired(carousel, "changeCurrentIndex", function() {
        carousel.nextPage();
      }, function(e) {
        this.assertEquals(1, e.value);
        this.assertEquals(0, e.old);
      }.bind(this));

      this.assertEventFired(carousel, "changeCurrentIndex", function() {
        carousel.previousPage();
      }, function(e) {
        this.assertEquals(0, e.value);
        this.assertEquals(1, e.old);
      }.bind(this));

      carousel.dispose();
      carouselPage1.dispose();
      carouselPage2.dispose();
    },


    testScrollToPage : function()
    {
      var carousel = new qx.ui.mobile.container.Carousel();
      var carouselPage1 = new qx.ui.mobile.Widget();
      carousel.append(carouselPage1);

      var carouselPage2 = new qx.ui.mobile.Widget();
      carousel.append(carouselPage2);

      this.getRoot().append(carousel);

      this.assertEquals(0,carousel.currentIndex);

      carousel.currentIndex = 1;
      this.assertEquals(1, carousel.currentIndex);

      window.setTimeout(function() {
        carousel.dispose();
        carouselPage1.dispose();
        carouselPage2.dispose();
      }, 600);
    }
  }

});

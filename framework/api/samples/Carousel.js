addSample('.carousel', {
  html: '<div id="carousel-example">' +
    '<div class="qx-carousel-scroller">' +
    '<div class="qx-carousel-page">asd</div>' +
    '<div class="qx-carousel-page">dsa</div>' +
    '</div>' +
    '</div>',
  javascript: function () {
    q('#carousel-example').toCarousel();
  },
  executable: true,
  showMarkup: true
});

addSample('.carousel', {
  javascript: function () {
    var carousel = new qx.ui.container.Carousel();

    var frontPage = new qx.ui.Widget()
      .append(new qx.ui.Label("This is a carousel. Please swipe left."));

    var secondPage = new qx.ui.Widget()
      .append(new qx.ui.Label("Now swipe right."));

    carousel.append(frontPage);
    carousel.append(secondPage);

    q(document.body).append(carousel);
  },
  executable: true,
  showMarkup: true
});
addSample(".rating", {
  html: '<div id="rating-example"></div>',
  javascript: function() {
    q("#rating-example").rating();
  },
  executable: true,
  showMarkup: true
});

addSample(".rating", {
  javascript: function() {
var rating = new qx.ui.mobile.Rating();
rating.set({
  symbol: "•",
  value: 3
});
rating.appendTo(document.body);
  },
  executable: true
});
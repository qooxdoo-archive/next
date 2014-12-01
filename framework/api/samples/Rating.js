addSample(".toRating", {
  html: '<div id="rating-example"></div>',
  javascript: function() {
    q("#rating-example").toRating();
  },
  executable: true,
  showMarkup: true
});

addSample(".toRating", {
  javascript: function() {
var rating = new qx.ui.Rating();
rating.set({
  symbol: "•",
  value: 3
});
rating.appendTo(document.body);
  },
  executable: true
});
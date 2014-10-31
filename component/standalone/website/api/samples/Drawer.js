addSample(".drawer", {
  html : ['<div id="drawer-example"></div>'],
  javascript: function() {
    var drawer = q('#drawer-example').drawer();

    // only to show the drawer by clicking on document body
    q(document.body).on("tap", function () {
      drawer.isHidden() ? drawer.show() : drawer.hide();
    });
  },
  executable: true,
  showMarkup: true
});

addSample(".drawer", {
  javascript: function() {
    var drawer = new qx.ui.container.Drawer();
    drawer.positionZ = "below";

    // click on body to show the drawer
    q(document.body).append(drawer).on("tap", function () {
      drawer.isHidden() ? drawer.show() : drawer.hide();
    });
  },
  executable: true,
  showMarkup: true
});

addSample(".tabBar", {
  html: [
    '<ul id="tab-bar-example">',
      '<li class="button" data-qx-config-page=".view-website">Website</li>',
      '<li class="button" data-qx-config-page=".view-mobile">Mobile</li>',
      '<li class="button" data-qx-config-page=".view-desktop">Desktop</li>',
    '</ul>',
    '<div class="view-desktop">Single-page applications</div>',
    '<div class="view-mobile">Android, iOS, WP8, HTML5</div>',
    '<div class="view-website">DOM, Events, Templating</div>'
  ],
  javascript: function () {
    q("#tab-bar-example").toTabBar();
  },
  executable: true,
  showMarkup: true
});

addSample(".tabBar", {
  javascript: function () {
    var tabBar = q.create('<ul>').appendTo(document.body);

    tabBar.append(q.create('<li class="button" data-qx-config-page=".view1">Website</li>'));
    q.create('<div class="view1">DOM, Events, Templating</div>').insertAfter(tabBar);

    tabBar.append(q.create('<li class="button" data-qx-config-page=".view2">Mobile</li>'));
    q.create('<div class="view2">Android, iOS, WP8, HTML5</div>').insertAfter(tabBar);

    tabBar.append(q.create('<li class="button" data-qx-config-page=".view3">Desktop</li>'));
    q.create('<div class="view3">Single-page applications</div>').insertAfter(tabBar);

    tabBar.tabBar();
  },
  executable: true
});

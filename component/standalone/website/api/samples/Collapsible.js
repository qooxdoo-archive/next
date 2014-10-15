addSample(".calendar", {
  html : ['<div id="collapsible-example">This is the content of the Collapsible.</div>'],
  javascript: function() {
    q("#collapsible-example").collapsible("Collapsible Header");
  },
  executable: true,
  showMarkup: true
});

addSample(".calendar", {
  javascript: function() {
    var collapsible = new qx.ui.mobile.container.Collapsible("Collapsible Header");
    collapsible.combined = false;
    collapsible.collapsed = false;

    var label = new qx.ui.mobile.basic.Label("This is the content of the Collapsible.");
    collapsible.append(label);

    q(document.body).append(collapsible);
  },
  executable: true,
  showMarkup: true
});

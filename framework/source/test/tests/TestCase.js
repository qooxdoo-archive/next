var $$root;

var setUpRoot = function() {
  $$root = new qx.ui.core.Root(document.createElement("div"));
  $$root.appendTo(document.body);
}

var getRoot = function() {
  return $$root;
}

var tearDownRoot = function() {
  $$root.empty();
  $$root.dispose();
}

var skipAfterTest = function(testTitle) {
  q(".suite").find("h2").filter(function(el) {
    return el.innerHTML.indexOf(testTitle) !== -1
  }).getParents()[0].className = "test pass pending";
}

function assertQxMobileWidget(obj) {
  assert.instanceOf(obj, qx.ui.Widget);
}
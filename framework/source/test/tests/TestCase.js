var $$root;

var setUpRoot = function() {
  $$root = new qx.ui.mobile.core.Root(document.createElement("div"));
  $$root.appendTo(document.body);
}

var getRoot = function() {
  return $$root;
}

var tearDownRoot = function() {
  $$root.empty();
  $$root.dispose();
}


    function assertQxMobileWidget(obj)
    {
      assert.instanceOf(obj, qx.ui.mobile.Widget);
    }
  
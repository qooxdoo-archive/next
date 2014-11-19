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

var skipAfterTest = function(suiteTitle, testTitle) {
	var suites = q(".suite")
	for(var i = 0; i < suites.length; i++){
		if(suiteTitle.indexOf(suites[i].children[0].textContent)===0){
			suite = suites[i];
		}
	}
  suite.find("h2").filter(function(el) {
    return el.innerHTML.indexOf(testTitle) !== -1
  }).getParents()[0].className = "test pass pending";
}

function assertQxMobileWidget(obj) {
  assert.instanceOf(obj, qx.ui.Widget);
}
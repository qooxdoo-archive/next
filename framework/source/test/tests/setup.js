// (function() { TODO

mocha.setup('bdd');

// Basic setup
if (typeof process !== 'undefined') {
  // We are in node. Require modules.
  assert = require('chai').assert;
  sinon = require('sinon');
} else {
  // We are in the browser. Set up variables like above using served js files.
  assert = chai.assert;
}


var skipAfterTest = function(suiteTitle, testTitle) {
  var suites = qxWeb(".suite");
  for (var i = 0; i < suites.length; i++) {
    if (suiteTitle.indexOf(suites[i].children[0].textContent) === 0) {
      qxWeb(suites[i]).find("h2")
        .filter(function(el) {
          return el.innerHTML.indexOf(testTitle) !== -1;
        })
        .getParents()[0].className = "test pass pending";
    }
  }
};


// TODO move to a framework class??
var createMouseEvent = function(type) {
  var domEvent;
  if (qxWeb.env.get("event.customevent")) {
    domEvent = new MouseEvent(type, {
      canBubble: true,
      cancelable: true,
      view: window,
    });
    domEvent.initMouseEvent(type, true, true, window,
      1, 0, 0, 0, 0,
      false, false, false, false,
      0, null);
  } else if (document.createEvent) {
    domEvent = document.createEvent("UIEvents");
    domEvent.initEvent(type, true, true);
  } else if (document.createEventObject) {
    domEvent = document.createEventObject();
    domEvent.type = type;
  }
  return domEvent;
};



// CSS metrics should be integer by default in IE10 Release Preview, but
// getBoundingClientRect will randomly return float values unless this
// feature is explicitly deactivated:
if (document.msCSSOMElementFloatMetrics) {
  document.msCSSOMElementFloatMetrics = null;
}


var commonBeforeEach = function() {
  // set up root widget (sandbox)
  window.sandbox = new qx.ui.core.Root(document.createElement("div"));
  window.sandbox.setAttribute("id", "sandbox");
  window.sandbox.appendTo(document.body);
}


var commonAfterEach = function() {
  window.sandbox.remove().dispose();
  window.sandbox = null;
}


// start
qxWeb.ready(function() {
  var runner = mocha.run();

  // register global before / after hooks
  runner.on("suite", function(suite) {
    suite.beforeEach(commonBeforeEach);
    suite._beforeEach.reverse(); // make sure the common is executed before all other
    suite.afterEach(commonAfterEach);
  });

  runner.on("end", function() {
    window.testsDone = true;
  });
});

// })();
(function() {

mocha.setup('bdd');

// node.js
if (typeof process !== 'undefined') {
  assert = require('chai').assert;
  sinon = require('sinon');
// Browser
} else {
  assert = chai.assert;
  chai.config.includeStack = true;

  // CSS metrics should be integer by default in IE10 Release Preview, but
  // getBoundingClientRect will randomly return float values unless this
  // feature is explicitly deactivated:
  if (document.msCSSOMElementFloatMetrics) {
    document.msCSSOMElementFloatMetrics = null;
  }
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


var commonBeforeEach = function() {
  // root widget (DOM sandbox)
  sandbox = new qx.ui.core.Root(document.createElement("div"));
  sandbox.setAttribute("id", "sandbox");
  sandbox.appendTo(document.body);

  // sinon sandbox
  sinonSandbox = sinon.sandbox.create();
};


var commonAfterEach = function() {
  // root widget
  sandbox.remove().dispose();
  sandbox = null;

  // sinon sandbox
  sinonSandbox.restore();
  sinonSandbox = null;

  if (this.currentTest.skip) {
    skipAfterTest(this.currentTest.parent.title, this.currentTest.title);
  }
};


// start
qxWeb.ready(function() {
  var runner = mocha.run();

  // register global before / after hooks
  runner.on("suite", function(suite) {
    suite.beforeEach(commonBeforeEach);
    suite._beforeEach.reverse(); // make sure the common beforeEach is executed before all other
    suite.afterEach(commonAfterEach);
  });

  runner.on("end", function() {
    testsDone = true;
  });
});

})();
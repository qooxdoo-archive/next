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
  sandbox = new qx.ui.core.Root(document.createElement("div"))
    .set({layout: null})
    .setAttribute("id", "sandbox")
    .appendTo(document.body);

  // sinon sandbox
  sinonSandbox = sinon.sandbox.create();
};


var commonAfterEach = function() {
  // root widget
  if(sandbox){
    sandbox.remove().dispose();
    sandbox = null;
  }

  // sinon sandbox
  if(sinonSandbox){
    sinonSandbox.restore();
    sinonSandbox = null;
  }
  if (this.currentTest.skip) {
    skipAfterTest(this.currentTest.parent.title, this.currentTest.title);
  }
};


// start
qxWeb.ready(function() {
  var runner = mocha.run();

  // blanket doesn't return runner!
  if (typeof runner !== 'undefined') {
    // code for index.html and index-source.html
    runner.on("suite", function(suite) {
      suite.beforeEach(commonBeforeEach);
      suite._beforeEach.reverse(); // make sure the common beforeEach is executed before all other
      suite.afterEach(commonAfterEach);
    });

    runner.on("end", function() {
      // Generate a TAP test stream from the results
      var tap = "1.." + runner.stats.tests + "\n"; // TAP test plan
      var count = 0;
      runner.suite.suites.forEach(function(suite) {
        suite.tests.forEach(function(test) {
          count++;
          var result = test.state == "passed" ? "ok" : "not ok";
          var line = result + " " + count + " " + suite.title + " " + test.title;
          tap += line + "\n";
          if (test.err) {
            if (test.err.stack) {
              tap += "# " + test.err.stack.split("\n").join("\n#") + "\n";
            } else {
              tap += "# " + test.err.message + "\n";
            }
          }
        });
      });
    });

    window.tap = tap;
    window.testsDone = true;
  } else {
    // code for index-coverage.html
    mocha.suite.beforeEach(commonBeforeEach);
    mocha.suite._beforeEach.reverse(); // make sure the common beforeEach is executed before all other
    mocha.suite.afterEach(commonAfterEach);
    mocha.suite.afterAll(function() {
      testsDone = true;
    });
  }
});


})();

 if (typeof process !== 'undefined') {
    // We are in node. Require modules.
    assert = require('chai').assert;
    isBrowser = false;
} else {
    // We are in the browser. Set up variables like above using served js files.
    assert = chai.assert;
    isBrowser = true;
    
}

var initAttached = false;
var globalSetup = function() {
  if (!initAttached) {
    // attach a custom init function
    q.$attachInit(function() {
      this.testInit = true;
    });
    initAttached = true;
  }

  sandbox = q.create("<div id='sandbox'></div>");
  sandbox.appendTo(document.body);

  // CSS metrics should be integer by default in IE10 Release Preview, but
  // getBoundingClientRect will randomly return float values unless this
  // feature is explicitly deactivated:
  if (document.msCSSOMElementFloatMetrics) {
    document.msCSSOMElementFloatMetrics = null;
  }
};

var globalTeardown = function() {
  sandbox.remove();
};

var createMouseEvent = function(type) {
  var domEvent;
  if (q.$$qx.core.Environment.get("event.customevent")) {
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
}
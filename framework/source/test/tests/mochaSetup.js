 if (typeof process !== 'undefined') {
    // We are in node. Require modules.
    assert = require('chai').assert;
    sinon = require('sinon');
    isBrowser = false;
} else {
    // We are in the browser. Set up variables like above using served js files.
    assert = chai.assert;
    isBrowser = true;
}
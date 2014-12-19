/*global exports*/
var fs = require('fs');
var assert = require('chai').assert;
var qxServerFilePath = '../build/qxserver.js';

if (!fs.existsSync(qxServerFilePath)) {
  throw new Error("You have to run './generate.py npm-package-copy' before");
}

var qx = require(qxServerFilePath);

describe("qxserver tests", function () {
  it("test if qx.Class exists", function () {
    assert.notEqual(qx.Class, undefined);
  });
  it("test if qx.Interface exists", function () {
    assert.notEqual(qx.Interface, undefined);
  });
  it("test if qx.Mixin exists", function () {
    assert.notEqual(qx.Mixin, undefined);
  });
});

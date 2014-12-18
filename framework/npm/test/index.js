/*global exports*/
var fs = require('fs');
var qxServerFilePath = '../build/qxserver.js';

if (!fs.existsSync(qxServerFilePath)) {
  throw new Error("You have to run './generate.py npm-package-copy' before");
}

var qx = require(qxServerFilePath);

exports.testQxClassExists = function (test) {
  test.notEqual(qx.Class, undefined);

  test.done();
};

exports.testQxInterfaceExists = function (test) {
  test.notEqual(qx.Interface, undefined);

  test.done();
};

exports.testQxMixinExists = function (test) {
  test.notEqual(qx.Mixin, undefined);

  test.done();
};
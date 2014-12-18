/*global exports*/
var qx = require('../build/qxserver.js');

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
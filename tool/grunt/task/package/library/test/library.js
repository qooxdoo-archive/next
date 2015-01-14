/* *****************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Richard Sternagel (rsternagel)

***************************************************************************** */

'use strict';

var path = require('path');

module.exports = {
  setUp: function(done) {
    this.library = require('../lib/library.js');
    this.testJsonPaths = [
      './test/data/myapp/package.json',
      './test/data/framework/package.json'
    ];
    done();
  },

  readPackageJson: function (test) {
    var expected = ['myapp', 'qx'];
    var actual = this.library.readPackageJson(this.testJsonPaths);
    test.deepEqual(Object.keys(actual), expected);

    test.done();
  },

  getPathsFor: function (test) {
    var expectedClassWithKeys = {
      myapp: path.normalize('test/data/myapp/source/class'),
      qx: path.normalize('test/data/framework/source/class')
    };
    var actualClassWithKeys = this.library.getPathsFor('class', this.testJsonPaths, {withKeys: true});
    test.deepEqual(actualClassWithKeys, expectedClassWithKeys);

    var expectedRessourceWithKeys = {
      myapp: path.normalize('test/data/myapp/source/resource'),
      qx: path.normalize('test/data/framework/source/resource')
    };
    var actualResourceWithKeys = this.library.getPathsFor('resource', this.testJsonPaths, {withKeys: true});
    test.deepEqual(actualResourceWithKeys, expectedRessourceWithKeys);

    var expectedClass = [
      path.normalize('test/data/myapp/source/class'),
      path.normalize('test/data/framework/source/class')
    ];
    var actualClass = this.library.getPathsFor('class', this.testJsonPaths);
    test.deepEqual(actualClass, expectedClass);

    var expectedResource = [
      path.normalize('test/data/myapp/source/resource'),
      path.normalize('test/data/framework/source/resource')
    ];
    var actualResource = this.library.getPathsFor('resource', this.testJsonPaths);
    test.deepEqual(actualResource, expectedResource);

    test.done();
  }
};


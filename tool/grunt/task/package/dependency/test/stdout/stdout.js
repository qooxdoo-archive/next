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

// just print to stdout
//  - e.g. to check class list order
//  - e.g. to check class deps of some classes
//  - e.g. to check assertHints of some classes
var depAnalyzer = require('../../lib/depAnalyzer.js');

var classListLoadOrder = [];
var classListPaths = [];
var classesDeps = {};
var atHintIndex = {};

/*
classesDeps = depAnalyzer.collectDepsRecursive(
  {'myapp': './test/data/myapp/source/class/',
   'qx': '../../../../../framework/source/class/'},
  ['myapp.Application', 'myapp.theme.Theme'],
  excludedClassIds
);
*/

/*
classesDeps = depAnalyzer.collectDepsRecursive(
  {'qx': '../../../../../framework/source/class/'},
  ['qx.*'],
  ['qx.test.*',
   'qx.dev.unit.*',
   'qx.dev.FakeServer']  // as this depends on qx.dev.unit classes
);
*/

var includes = ['qx.module.Core'];
var excludes = [];
var explicitExcludes = [];
classesDeps = depAnalyzer.collectDepsRecursive(
  {'qx': '../../../../../framework/source/class/'},
  includes,
  excludes
);

classListLoadOrder = depAnalyzer.sortDepsTopologically(classesDeps, 'load', includes, excludes, explicitExcludes);
classListLoadOrder = depAnalyzer.prependNamespace(classListLoadOrder, ['qx', 'myapp']);
classListPaths = depAnalyzer.translateClassIdsToPaths(classListLoadOrder);
atHintIndex = depAnalyzer.createAtHintsIndex(classesDeps);

console.log(JSON.stringify(classesDeps, null, 2));
console.log(classListLoadOrder, classListLoadOrder.length);

// var escgen = require("escodegen");
// console.log(escgen.generate(depAnalyzer.getTrees()["qx.Class"]));

// console.log(Object.keys(depAnalyzer.getTrees()));

// console.log(Object.keys(classesDeps).length);
// console.log(classListLoadOrder.length);
// console.log(Object.keys(depAnalyzer.getTrees()).length);

// console.log(classListPaths);
// console.log(atHintIndex);

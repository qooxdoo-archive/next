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

var depAnalyzer = require('../../lib/depAnalyzer.js');

var libPaths = {'qx': '../../../../../framework/source/class/'};
var moduleClasses = {};

var modules = {
  'qx.module.Html': {
    exclude: [],
    include: []
  },
  'qx.module.Attribute': {
    exclude: ['qx.module.Html'],
    include: []
  },
  'qx.module.Css': {
    exclude: ['qx.module.Html'],
    include: []
  },
  'qx.module.Manipulating': {
    exclude: ['qx.module.Html'],
    include: []
  },
  'qx.module.Traversing': {
    exclude: ['qx.module.Css'],
    include: []
  },
  'qx.module.Event': {
    exclude: [],
    include: ['qx.module.event.Native']
  },
  'qx.module.event.Keyboard': {
    exclude: ['qx.module.Event'],
    include: []
  },
  'qx.module.event.Mouse': {
    exclude: ['qx.module.Event'],
    include: []
  },
  'qx.module.event.TouchHandler': {
    exclude: ['qx.module.Event'],
    include: []
  },
  'qx.module.event.PointerHandler': {
    exclude: ['qx.module.Event'],
    include: ['qx.module.event.Pointer']
  },
  'qx.module.event.GestureHandler': {
    exclude: ['qx.module.Event', 'qx.module.event.PointerHandler', 'qx.module.AnimationFrame' ],
    include: ['qx.module.event.Swipe', 'qx.module.event.Tap', 'qx.module.event.Pinch', 'qx.module.event.Track', 'qx.module.event.TrackHandler' ]
  },
  'qx.module.event.OrientationHandler': {
    exclude: ['qx.module.Event'],
    include: ['qx.module.event.Orientation']
  },
  'qx.module.event.Rotate': {
    exclude: ['qx.module.Event'],
    include: []
  },
  'qx.module.util.Array': {
    exclude: [],
    include: ['qx.module.util.Function', 'qx.module.util.Object', 'qx.module.util.String', 'qx.module.util.Type']
  }
};

var coreDeps = depAnalyzer.collectDepsRecursive(
  libPaths,
  ['qx.module.Oo', 'qx.module.Lang', 'qxWeb', 'qx.module.Environment'],
  []
);
var coreDepsList = Object.keys(coreDeps);

for (var moduleName in modules) {
  var moduleExcludes = coreDepsList;
  var excludedModules = modules[moduleName].exclude;

  // collect dependencies of required modules
  excludedModules.forEach(function(exMod) {
    var exDeps = depAnalyzer.collectDepsRecursive(
      libPaths,
      [exMod],
      []
    );
    moduleExcludes = moduleExcludes.concat(Object.keys(exDeps));
  });

  // collect the module's own dependencies (minus Core and required modules)
  var moduleIncludes = [moduleName].concat(modules[moduleName].include);
  var moduleDeps = depAnalyzer.collectDepsRecursive(
    libPaths,
    moduleIncludes,
    moduleExcludes
  );

  Object.keys(moduleDeps).forEach(function(className) {
    if (className !== moduleName) {
      if (!moduleClasses[className]) {
        moduleClasses[className] = [];
      }
      if (moduleClasses[className].length > 0 && modules[moduleName].exclude.indexOf(className) == -1) {
        console.warn(moduleName + ': ' + className +
          ' already used in ' + moduleClasses[className].join(', '));
      }
      moduleClasses[className].push(moduleName);
    }
  });
}

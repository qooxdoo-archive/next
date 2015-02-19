'use strict';

var fs = require('fs');
var glob = require('glob');
var shell = require('shelljs');

if (shell.test('-L', 'node_modules/qx-dependency')) {
  fs.unlinkSync('node_modules/qx-dependency');
}
shell.mkdir('-p', 'node_modules');
fs.symlinkSync('../../../../tool/grunt/task/package/dependency/', 'node_modules/qx-dependency', 'dir');

var qxDep = require("qx-dependency");
var os = require("os");

var getSourcePaths = function(scope, classListLoadOrder) {
  if (typeof scope === 'undefined' || scope === 'all') {
    return classListLoadOrder.concat(['setup.js',
      'tests/**/*.js'
    ]);
  }
  return classListLoadOrder.concat(['setup.js',
    'tests/' + scope + '*.js',
    'tests/' + scope + '/**/*.js'
  ]);
};

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-injector');
  grunt.registerTask('html', 'A task to preprocess the website.html', function(scope) {
    var opts = {
      includes: ["qx.*"],
      excludes: ["qx.dev.FakeServer"],
      environment: {},
      classPaths: {'qx': '../class'}
    };
    var depsCollectingOptions = {
      variants: false,
      cachePath: null,
      buildType: "source"
    };

    var classesDeps = qxDep.collectDepsRecursive(opts.classPaths, opts.includes, opts.excludes, opts.environment, depsCollectingOptions);
    var classListLoadOrder = qxDep.sortDepsTopologically(classesDeps, "load", opts.excludes);
    // classListLoadOrder = qxDep.prependNamespace(classListLoadOrder, ["qx"]);
    var classListPaths = qxDep.translateClassIdsToPaths(classListLoadOrder);
    // console.log(classListPaths);
    var injectorConfig = grunt.config.get('injector');
    classListPaths.forEach(function(path, i) {
      classListPaths[i] = "../class/" + path;
    });

    var sourcePaths = getSourcePaths(scope, classListPaths);
    // console.log(sourcePaths);
    injectorConfig.testBuild.files = {
      "index.html": sourcePaths
    };
    injectorConfig.testSource.files = {
      "index-source.html": sourcePaths
    };
    grunt.config.set('injector', injectorConfig);
    grunt.task.run(['injector']);
  });
};

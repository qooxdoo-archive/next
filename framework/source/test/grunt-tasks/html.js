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

var getSourcePaths = function(scope) {
  // scope is used to build tests only for one test namespace (e.g. ui)
  // provide it on the command line like this 'grunt html:ui'
  return (typeof scope === 'undefined' || scope === 'all')
         ? ['tests/**/*.js' ]
         : ['tests/' + scope + '*.js',
            'tests/' + scope + '/**/*.js'];
};

var calculateClassLoadList = function() {
    var opts = {
      includes: ["qx.*"],
      excludes: [],
      environment: {},
      classPaths: {'qx': '../class'}
    };
    var depsCollectingOptions = {
      variants: false,
      cachePath: null,
      buildType: "source"
    };

    var expandedExcludes = qxDep.expandExcludes(opts.excludes, opts.includes, opts.classPaths);
    var classesDeps = qxDep.collectDepsRecursive(opts.classPaths, opts.includes, opts.excludes, opts.environment, depsCollectingOptions);
    var classListLoadOrder = qxDep.sortDepsTopologically(classesDeps, "load", opts.includes, expandedExcludes);
    var classListPaths = qxDep.translateClassIdsToPaths(classListLoadOrder);
    classListPaths.forEach(function(path, i) {
      classListPaths[i] = "../class/" + path;
    });

    return classListPaths;
};

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-injector');
  grunt.registerTask('html', 'A task to preprocess the website.html', function(scope) {
    var injectorConfig = grunt.config.get('injector');

    var sourcePaths = getSourcePaths(scope);
    injectorConfig.testBuild.files = { "index.html": sourcePaths };
    injectorConfig.testModule.files = { "index-module.html": ['tests/module/*.js' ] };
    injectorConfig.testSource.files = { "index-source.html": sourcePaths };
    injectorConfig.testSourceCoverage.files = {
      "index-coverage.html": calculateClassLoadList().concat(['setup.js']).concat(sourcePaths)
    };

    grunt.config.set('injector', injectorConfig);
    grunt.task.run(['injector']);
  });
};

'use strict';

var fs = require('fs');
var glob = require('glob');
var shell = require('shelljs');
if (shell.test('-L', './node_modules/qx-dependency')) {
  fs.unlinkSync('./node_modules/qx-dependency');
}
fs.symlinkSync('../../../tool/grunt/task/package/dependency/', 'node_modules/qx-dependency', 'junction');
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
  grunt.initConfig({
    injector: {
      options: {
        addRootSlash: false,
        ignorePath: [
          'tests/setup.js',
          'tests/mochaSetup.js',
          'tests/TestCase.js'
        ],
        transform: function(filepath) {
          if (filepath.indexOf("../class/") === 0) {
            return '<script src="' + filepath + '" data-cover></script>';
          } else {
            return '<script src="' + filepath + '"></script>';
          }
        }
      },
      testBuild: {
        options: {
          template: "index.tmpl"
        }
      },
      testSource: {
        options: {
          template: "index-source.tmpl"
        }
      }
    }
  });

  grunt.registerTask('html', 'A task to preprocess the website.html', function(scope) {
    var opts = {
      includes: ["qx.*"],
      excludes: [
        "qx.test.*",
        "qx.dev.unit.*",
        "qx.dev.FakeServer" // as this depends on qx.dev.unit classes
      ],
      environment: {
        "qx.debug": true,
        "qx.debug.ui.queue": true,
        "qx.nativeScrollBars": true,
        "qx.allowUrlSettings": true,
        "qx.mobile.emulatetouch": true
      },
      cachePath: os.tmpdir() + "/next4.1/cache",
      classPaths: {
        qx: '../class'
      }
    }

    var depsCollectingOptions = {
      variants: false,
      cachePath: opts.cachePath,
      buildType: "source"
    };
    var classesDeps = qxDep.collectDepsRecursive(opts.classPaths, opts.includes, opts.excludes, opts.environment, depsCollectingOptions);
    var classListLoadOrder = qxDep.sortDepsTopologically(classesDeps, "load", opts.excludes);
    // classListLoadOrder = qxDep.prependNamespace(classListLoadOrder, ["qx"]);
    var classListPaths = qxDep.translateClassIdsToPaths(classListLoadOrder);
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

'use strict';

var fs = require('fs');
var glob = require('glob');

var getSourcePaths = function (scope) {
  if (typeof scope === 'undefined' || scope === 'all') {
    return 'tests/**/*.js';
  }
  return 'tests/' + scope + '/**/*.js';
};

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-injector');
  grunt.initConfig({
    injector: {
      options: {
        addRootSlash: false,
        ignorePath: [
          'tests/setup.js',
          'tests/mochaSetup.js',
          'tests/TestCase.js'
        ]
      },
      test: {
        files: {
          // paths will set dynamically
          "index.html": [],
          "index-source.html": []
        }
      }
    }
  });

  grunt.registerTask('html', 'A task to preprocess the website.html', function (scope) {
    var injectorConfig = grunt.config.get('injector');

    var sourcePaths = getSourcePaths(scope);
    injectorConfig.test.files = {
      "index-source.html": sourcePaths,
      "index.html": sourcePaths
    };
    grunt.config.set('injector', injectorConfig);
    grunt.task.run(['injector']);
  });
};
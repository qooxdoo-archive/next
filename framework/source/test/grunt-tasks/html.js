'use strict';

var fs = require('fs');
var glob = require('glob');

var getSourcePaths = function (scope) {
  if (typeof scope === 'undefined' || scope === 'all') {
    return [
      'tests/**/*.js'
    ];
  }
  return [
    'tests/' + scope + '*.js',
    'tests/' + scope + '/**/*.js'
  ];
};

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-injector');

  grunt.registerTask('html', 'A task to preprocess the website.html', function (scope) {
    var injectorConfig = grunt.config.get('injector');

    var sourcePaths = getSourcePaths(scope);
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
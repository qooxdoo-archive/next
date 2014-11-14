'use strict';

var fs = require('fs');
var glob = require('glob');

module.exports = function (grunt) {
  var getTestPath = function (scope) {
    if (typeof scope === 'undefined' || scope === 'all') {
      return 'tests/**/*.js';
    }
    return 'tests/' + scope + '/**/*.js';
  };

  grunt.registerTask('html', 'A task to preprocess the website.html', function (scope) {
    var testPath = getTestPath(scope);
    // read index files
    ["index.html", "index-source.html"].forEach(function (fileName) {
      var index = fs.readFileSync(fileName, {encoding: 'utf8'});

      var tests = glob.sync(testPath);
      var scriptTags = '  <!-- TESTS START -->\n';
      tests.filter(function (path) {
        // exclude infrastructure files
        return path.indexOf("setup.js") === -1 &&
          path.indexOf("mochaSetup.js") === -1 &&
          path.indexOf("TestCase.js") === -1;
      })
        .forEach(function (path) {
          scriptTags += '  <script src="' + path + '"></script>\n';
        });
      scriptTags += '  <!-- TESTS END -->';

      index = index.replace(/\s\s<!--\sTESTS\sSTART\s-->((.|\n)*)<!--\sTESTS\sEND\s-->/g, scriptTags);

      // write index file
      fs.writeFileSync(fileName, index, {'encoding': 'utf8'});
    });
  });
};
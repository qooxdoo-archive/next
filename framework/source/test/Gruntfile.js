module.exports = function(grunt) {

  var fs = require('fs');
  var glob = require('glob');

  var getTestPath = function (scope) {
    if (typeof scope === 'undefined' || scope === 'all') {
      return 'tests/**/*.js';
    }
    return 'tests/' + scope + '/**/*.js';
  };

  // process test HTML
  grunt.registerTask('html', 'A task to preprocess the website.html', function(scope) {
    var testPath = getTestPath(scope);
    // read index file
    var index = fs.readFileSync('index.html', {encoding: 'utf8'});

    var tests = glob.sync(testPath);
    var scriptTags = '  <!-- TESTS START -->\n';
    tests.forEach(function(path) {
      // ignore all files starting with lower letter like setup.js
      if (path.indexOf("setup.js") != -1) {
        return;
      }
      scriptTags += '  <script src="' + path + '"></script>\n';
    });
    scriptTags += '  <!-- TESTS END -->';

    index = index.replace(/\s\s<!--\sTESTS\sSTART\s-->((.|\n)*)<!--\sTESTS\sEND\s-->/g, scriptTags);

    // write index file
    fs.writeFileSync('index.html', index, {'encoding': 'utf8'});
  });


  var shell = require('shelljs');
  grunt.registerTask('build', 'Build the test artefact', function() {
    shell.cd('../../');
    console.log('Opening the framework folder');
    shell.exec('grunt build-all');
    shell.cd('source/test');
  });


  grunt.registerTask('default', ['build', 'html']);
};
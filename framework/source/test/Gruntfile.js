module.exports = function(grunt) {

  var fs = require('fs');
  var glob = require("glob");
  var websiteTests = 'tests/website/**/*.js';

  // process website test HTML
  grunt.registerTask('website', 'A task to preprocess the website.html', function() {
    // read index file
    var index = fs.readFileSync('website.html', {encoding: 'utf8'});

    var scriptTags = '  <!-- TESTS START -->\n';
    var tests = glob.sync(websiteTests);
    tests.forEach(function(fileName) {
      scriptTags += '  <script src="' + fileName + '"></script>\n';
    });
    scriptTags += '  <!-- TESTS END -->';

    index = index.replace(/\s\s<!--\sTESTS\sSTART\s-->((.|\n)*)<!--\sTESTS\sEND\s-->/g, scriptTags);

    // write index file
    fs.writeFileSync('website.html', index, {'encoding': 'utf8'});
  });

};

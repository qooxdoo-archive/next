module.exports = function (grunt) {

  var shell = require('shelljs');

  grunt.initConfig({
    convert: {
      source: __dirname + '/../class/qx/test/',
      destination: __dirname + '/tests/framework/destination/'
    }
  });

  grunt.loadTasks('grunt-tasks');
  grunt.registerTask('build', 'Build the test artifact (optimized version)', function () {
    console.log('Opening the framework folder');
    shell.cd('../../');
    shell.exec('npm install');
    shell.exec('grunt build-all');
    shell.cd('source/test');
  });

  grunt.registerTask('source', 'Build the test artifact (source version)', function () {
    console.log('Opening the framework folder');
    shell.cd('../../');
    shell.exec('npm install');
    shell.exec('grunt source-all --gargs="-m BUILD_PATH:source/test"');
    shell.cd('source/test');
  });


  grunt.registerTask('default', ['build', 'html']);
};
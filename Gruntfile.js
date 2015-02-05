// requires
var shell = require("shelljs");

// grunt
module.exports = function(grunt) {
  grunt.initConfig({
    // apps
    run_grunt: {
      build_play: {
        options: {
          log: true,
          task: ["build"],
          process: function(res) {
            if (res.fail) {
              grunt.log.writeln('Error during "grunt build" within application/play.');
            }
          }
        },
        src: ['application/play/Gruntfile.js']
      },
      build_mobileshowcase: {
        options: {
          log: true,
          task: ["build"],
          process: function(res) {
            if (res.fail) {
              grunt.log.writeln('Error during "grunt build" within application/mobileshowcase.');
            }
          }
        },
        src: ['application/mobileshowcase/Gruntfile.js']
      },
      build_apps: {
        options: {
          log: true,
          task: ["build"],
          process: function(res) {
            if (res.fail) {
              grunt.log.writeln('Error during building all applications');
            }
          }
        },
        src: ['application/play/Gruntfile.js', "application/mobileshowcase/Gruntfile.js"]
      }
    }
  });

  // skeleton
  grunt.task.registerTask (
    'build_skel',
    'Build skeleton app',
    function() {
      shell.exec('python create-application.py -n "test_skel"');
      shell.exec('grunt build --gruntfile test_skel/Gruntfile.js');
      shell.exec('rm -rf test_skel');
    }
  );

  grunt.loadNpmTasks('grunt-run-grunt');
};




// requires
var shell = require("shelljs");

// grunt
module.exports = function(grunt) {
  grunt.initConfig({
    // apps
    run_grunt: {
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
      },
      clean_apps: {
        options: {
          log: true,
          task: ["clean:app"],
          process: function(res) {
            if (res.fail) {
              grunt.log.writeln('Error during cleaning all applications');
            }
          }
        },
        src: ['application/play/Gruntfile.js', "application/mobileshowcase/Gruntfile.js"]
      },
      lint_apps: {
        options: {
          log: true,
          task: ["lint"],
          process: function(res) {
            if (res.fail) {
              grunt.log.writeln('Error during linting all applications');
            }
          }
        },
        src: [
          "application/play/Gruntfile.js",
          "application/mobileshowcase/Gruntfile.js",
          "framework/Gruntfile.js"
        ]
      }
    }
  });

  // alias
  grunt.registerTask('lint', 'run_grunt:lint_apps');
  grunt.registerTask('clean', 'run_grunt:clean_apps');
  grunt.registerTask('build', 'run_grunt:build_apps');

  // skeleton
  grunt.task.registerTask (
    'build_skel',
    'Build skeleton app',
    function() {
      shell.mkdir('-p', 'release');
      shell.exec('python create-application.py -n test_skel -o release');
      shell.exec('grunt build --gruntfile release/test_skel/Gruntfile.js');
      shell.rm('-rf', 'release/test_skel');
    }
  );

  // rm node_modules (grunt remove_node_modules <=> grunt setup)
  grunt.task.registerTask (
    'remove_node_modules',
    'Removes all node_modules directories',
    function() {
      var dirs = shell.find('.').filter(function(file) {
        return file.match(/node_modules$/);
      }).forEach(function(path) {
        shell.rm('-rf', path);
      });
    }
  );

  // setup toolchain, apps and tests (grunt setup <=> grunt remove_node_modules)
  grunt.task.registerTask (
    'setup',
    'Setup toolchain and apps',
    function() {
      shell.cd('tool/grunt');
      shell.exec('npm install');
      shell.exec('node setup.js');
      shell.cd('../../framework');
      shell.exec('npm install');
      shell.cd('../application');
      var apps = shell.ls('.');
      apps.forEach(function(appPath) {
        shell.cd(appPath);
        shell.exec('npm install');
        shell.cd('../');
      });
      shell.cd('../framework/source/test');
      shell.exec('npm install');
    }
  );

  grunt.loadNpmTasks('grunt-run-grunt');
};




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
      },
      eslint_apps: {
        options: {
          log: true,
          task: ["eslint:default"],
          process: function(res) {
            if (res.fail) {
              grunt.log.writeln('Error during eslinting all applications');
            }
          }
        },
        src: [
          "application/play/Gruntfile.js",
          "application/mobileshowcase/Gruntfile.js",
          "tool/grunt/Gruntfile.js",
          "framework/Gruntfile.js"
        ]
      },
    }
  });

  // alias
  grunt.registerTask('lint', 'run_grunt:lint_apps');
  grunt.registerTask('eslint', 'run_grunt:eslint_apps');
  grunt.registerTask('clean', 'run_grunt:clean_apps');
  grunt.registerTask('build', 'run_grunt:build_apps');

  // run toolchain tests
  grunt.task.registerTask (
    'test_toolchain',
    'Run toolchain tests',
    function() {
      shell.cd('tool/grunt/');
      shell.cd('eslint/eslint-plugin-qx-rules');
      shell.exec('npm test');
      shell.cd('../../task/package');
      var packages = shell.ls('.');
      packages.forEach(function(pkgPath) {
        if (shell.test('-d', pkgPath)) {
          shell.cd(pkgPath);
          shell.exec('npm test');
          shell.cd('../');
        }
      });
    }
  );

  // run toolchain tasks
  grunt.task.registerTask (
    'run_toolchain_tasks',
    'Run toolchain tasks',
    function() {
      shell.cd('tool/grunt/task/source');
      shell.exec('grunt source');
      shell.cd('../build');
      shell.exec('grunt build');
      shell.cd('../info');
      shell.exec('grunt info');
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




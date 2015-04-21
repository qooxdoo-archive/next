// requires
var shell = require("shelljs");
var path = require('path');
var fs = require('fs');

// grunt
module.exports = function(grunt) {
  grunt.initConfig({
    // apps
    run_grunt: {
      source_apps: {
        options: {
          log: true,
          task: ["source"],
          process: function(res) {
            if (res.fail) {
              grunt.log.writeln('Error during building (source version of) all applications');
            }
          }
        },
        src: ['application/play/Gruntfile.js', "application/mobileshowcase/Gruntfile.js"]
      },
      source_modules: {
        options: {
          log: true,
          task: ["source"],
          process: function(res) {
            if (res.fail) {
              grunt.log.writeln('Error during building (source version of) all modules');
            }
          }
        },
        src: ["framework/Gruntfile.js"]
      },
      source_testsuite: {
        options: {
          log: true,
          task: ["source", "html"],
          process: function(res) {
            if (res.fail) {
              grunt.log.writeln('Error during building (source version of) test suite');
            }
          }
        },
        src: ["framework/source/test/Gruntfile.js"]
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
      },
      build_modules: {
        options: {
          log: true,
          task: ["build"],
          process: function(res) {
            if (res.fail) {
              grunt.log.writeln('Error during building all modules');
            }
          }
        },
        src: ["framework/Gruntfile.js"]
      },
      build_testsuite: {
        options: {
          log: true,
          task: ["build", "html"],
          process: function(res) {
            if (res.fail) {
              grunt.log.writeln('Error during building test suite');
            }
          }
        },
        src: ["framework/source/test/Gruntfile.js"]
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
      clean_modules: {
        options: {
          log: true,
          task: ["clean:app"],
          process: function(res) {
            if (res.fail) {
              grunt.log.writeln('Error during cleaning all modules');
            }
          }
        },
        src: ["framework/Gruntfile.js"]
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
  grunt.registerTask('lint', 'run_grunt:eslint_apps');
  grunt.registerTask('clean', ['run_grunt:clean_apps', 'run_grunt:clean_modules']);
  grunt.registerTask('build', ['run_grunt:build_apps', 'run_grunt:build_modules', 'run_grunt:build_testsuite']);
  grunt.registerTask('source', ['run_grunt:source_apps', 'run_grunt:source_modules', 'run_grunt:source_testsuite']);

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
      var rootDir = shell.pwd();
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

      // symlink yeoman generator
      shell.cd(rootDir);
      var homeDir = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
      var homeGeneratorPath = path.join(homeDir, 'node_modules/generator-next');
      var yeomanPath = path.join(rootDir, 'tool/yeoman/generator-next');
      shell.cd(yeomanPath);
      shell.exec('npm install');
      shell.cd(rootDir);
      grunt.log.subhead("Installing yeoman generator for next");
      grunt.log.oklns('Creating a symlink for next\'s yeoman generator in: ' + homeGeneratorPath);
      grunt.log.oklns('If you intend to create applications outside of your home directory, '+
                      'run \'npm link\' (may require sudo) in: ' + yeomanPath);
      if (shell.test('-L', homeGeneratorPath)) {
        fs.unlinkSync(homeGeneratorPath);
      }
      shell.mkdir('-p', path.join(homeDir, 'node_modules'));
      fs.symlinkSync(yeomanPath, homeGeneratorPath, 'dir');
    }
  );

  grunt.loadNpmTasks('grunt-run-grunt');
};




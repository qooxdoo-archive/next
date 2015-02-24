module.exports = function (grunt) {

  var shell = require('shelljs');

  grunt.initConfig({

    injector: {
      options: {
        addRootSlash: false,
        ignorePath: [
          'tests/setup.js',
          'tests/mochaSetup.js',
          'tests/TestCase.js'
        ],
      },
      testBuild: {
        options: {
          template: "index.tmpl"
        }
      },
      testSource: {
        options: {
          template: "index-source.tmpl"
        }
      },
      testSourceCoverage: {
        options: {
          template: "index-coverage.tmpl",
          transform: function(filepath) {
            if (filepath.indexOf("../class/") === 0) {
              return '<script src="' +filepath+ '" data-cover></script>';
            } else {
              return '<script src="' +filepath+ '"></script>';
            }
          }
        }
      }
    },

    webdriver: {
      options: {
        autUri: undefined, // Test suite URI, e.g. http://localhost/next/framework/source/test/
        serverUri: undefined, // Selenium server URI, e.g. http://localhost:4444/wd/hub/
        capabilities: { // desired capabilities for Webdriver/Selenium Grid
          browserName: 'firefox'
        },
        timeout: 600000, // test suite timeout
        filename: undefined // output file for test results
      }
    }
  });

  grunt.loadTasks('grunt-tasks');
  grunt.registerTask('build', 'Build the test artifact (optimized version)', function () {
    console.log('Opening the framework folder');
    shell.cd('../../');
    shell.exec('npm install');
    shell.exec('grunt sass:indigo');
    shell.exec('grunt build-all');
    shell.cd('source/test');
  });

  grunt.registerTask('source', 'Build the test artifact (source version)', function () {
    console.log('Opening the framework folder');
    shell.cd('../../');
    shell.exec('npm install');
    shell.exec('grunt sass:indigo');
    shell.exec('grunt source-all --gargs="-m BUILD_PATH:source/test"');
    shell.cd('source/test');
  });

  grunt.registerTask('default', ['source', 'build', 'html']);
};

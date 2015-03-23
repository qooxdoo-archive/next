// requires
var shell = require('shelljs');
var qx = require('../../../tool/grunt');

// grunt
module.exports = function (grunt) {

  var config = {

    common: {
      'APPLICATION' : 'qx'
    },

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

     sass: {
       indigo: {
         options: {
           style: 'compressed'
         },
         files: [{
           cwd: ".",
           expand: false,
           src: '../../source/resource/qx/scss/indigo.scss',
           dest: 'build/resource/qx/css/indigo.css',
         }]
       },
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
     },

     source: {
       options: {
         "=includes": ["qx.*"],
         "loaderTemplate": "../../../tool/data/generator/website.loader.source.tmpl.js",
       }
     },

     build: {
       options: {
         "=includes": ["qx.*"],
         "loaderTemplate": "../../../tool/data/generator/website.loader.tmpl.js"
       }
     }
  };

  var mergedConf = qx.config.mergeConfig(config, {'source': 'source-base', 'build': 'build-base'});
  // console.log(util.inspect(mergedConf, false, null));
  grunt.initConfig(mergedConf);

  qx.task.registerTasks(grunt);

  grunt.loadTasks('grunt-tasks');

  // 'extend' source job
  grunt.task.renameTask('source', 'source-base');
  grunt.task.registerTask(
    'source',
    'Build the test artifact (source version)',
    ['sass:indigo', 'source-base']
  );

  // 'extend' build job
  grunt.task.renameTask('build', 'build-base');
  grunt.task.registerTask(
    'build',
    'Build the test artifact (build version)',
    ['sass:indigo', 'build-base']
  );

  grunt.registerTask('default', ['source', 'build', 'html']);
};

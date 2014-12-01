// requires
var util = require('util');
var qx = require("../../../tool/grunt");

// grunt
module.exports = function(grunt) {

  var config = {
    generator_config: {
      let : {
      }
    },

    common: {
      "APPLICATION" : "website",
      "LOCALES": ["en"],
      "QOOXDOO_PATH" : "../../..",
      "QXTHEME": "<%= common.APPLICATION %>.theme.Theme"
    },

    sass: {
      indigo: {
        options: {
          style: 'compressed'
        },
        files: {
          'script/indigo.css': 'indigo.scss'
        }
      }
    },

    notify: {
      source: {
        options: {
          message: 'qx.Website source version generated.'
        }
      },
      build: {
        options: {
          message: 'qx.Website unminified build version generated.'
        }
      }
    }
  };

  var mergedConf = qx.config.mergeConfig(config);
  grunt.initConfig(mergedConf);

  qx.task.registerTasks(grunt);

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-sass');

  // 'extend' source job
  grunt.task.renameTask('source', 'temp');
  grunt.task.registerTask(
    'source',
    'Generate the source version of qx.Website and the widget CSS',
    ["generate:source", "sass:indigo", "notify:source"]
  );

  // 'extend' build job
  grunt.task.renameTask('build', 'temp');
  grunt.task.registerTask(
    'build',
    'Generate the build version of qx.Website and the widget CSS',
    ["generate:build", "sass:indigo", "notify:build"]
  );

};
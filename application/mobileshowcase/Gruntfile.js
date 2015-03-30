// requires
var util = require('util');
var qx = require("../../tool/grunt");
var shell = require("shelljs");

// grunt
module.exports = function(grunt) {
  var config = {
    generator_config: {
      let: {
      }
    },

    common: {
      "APPLICATION" : "mobileshowcase",
      "QOOXDOO_PATH" : "../..",
      "QXTHEME": "",
      "THEME": "indigo",  // possible values: "indigo","flat"
      "ENVIRONMENT": {
        "qx.application": "<%= common.APPLICATION %>.Application",
        "qx.revision":"",
        "qx.theme": "<%= common.THEME %>",
        "qx.version":"<%= common.QOOXDOO_VERSION %>"
      },
      "BUILD_PATH": "<%= common.ROOT %>/build-indigo",
    },

    clean: {
      build: ["./build-<%= common.THEME %>"]
    },

    source: {
      options: {
        "=includes": ["<%= common.APPLICATION_MAIN_CLASS %>"]
      }
    },

    build: {
      options: {
        "=includes": ["<%= common.APPLICATION_MAIN_CLASS %>"],
        buildPath: "./build-<%= common.THEME %>"
      }
    }
  };

  var mergedConf = qx.config.mergeConfig(config, {"build": "build-base", "source": "source-base"});
  // console.log(util.inspect(mergedConf, false, null));
  grunt.initConfig(mergedConf);

  qx.task.registerTasks(grunt);

  grunt.loadNpmTasks('grunt-contrib-sass');

  // 'extend' build job
  grunt.task.renameTask('build', 'build-base');
  grunt.task.registerTask(
    'build',
    'Build the Mobile Showcase and compile the stylesheets with Sass.',
    ["sass:indigo", "build-base"]
  );

  // 'extend' source job
  grunt.task.renameTask('source', 'source-base');
  grunt.task.registerTask(
    'source',
    'Build the Mobile Showcase and compile the stylesheets with Sass.',
    ["sass:indigo", "source-base"]
  );

  grunt.task.registerTask(
    "lint",
    "Lints the files of the current app",
    function () {
      shell.exec("python generate.py lint");
    }
  );
};

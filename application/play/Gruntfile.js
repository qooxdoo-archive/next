// requires
var util = require('util');
var qx = require("../../tool/grunt");
var shell = require("shelljs");

// grunt
module.exports = function(grunt) {
  var config = {

    common: {
      "APPLICATION" : "play",
      "QOOXDOO_PATH" : "../..",
      "THEME": "custom",
    },

    source: {
      options: {
        includes: ["<%= common.APPLICATION %>.*", "qx.*"],
        excludes: [
         "qx.test.*",
         "qx.dev.unit.*",
         "qx.dev.FakeServer",  // as this depends on qx.dev.unit classes
         "playground.test.*"
        ],
        environment: {
          "qx.debug" : true,
          "qx.debug.ui.queue" : true,
          "qx.nativeScrollBars" : true,
          "qx.allowUrlSettings" : true,
          "qx.mobile.emulatetouch" : true
        },
        libraries: [
          "<%= common.QOOXDOO_PATH %>/framework/package.json",
          "<%= common.ROOT %>/package.json"
        ]
      }
    },

    build: {
      options: {
        includes: ["<%= common.APPLICATION %>.*", "qx.*"],
        excludes: [
         "qx.test.*",
         "qx.dev.unit.*",
         "qx.dev.FakeServer",  // as this depends on qx.dev.unit classes
         "playground.test.*"
        ],
        environment: {
          "qx.debug" : true,
          "qx.debug.ui.queue" : true,
          "qx.nativeScrollBars" : true,
          "qx.allowUrlSettings" : true,
          "qx.mobile.emulatetouch" : true
        },
        libraries: [
          "<%= common.QOOXDOO_PATH %>/framework/package.json",
          "<%= common.ROOT %>/package.json"
        ]
      }
    },

    eslint: {
      options: {
        globals: ["ace"]
      }
    }

  };

  var mergedConf = qx.config.mergeConfig(config, {"build": "build-base", "source": "source-base"});
  // console.log(util.inspect(mergedConf, false, null));
  grunt.initConfig(mergedConf);

  qx.task.registerTasks(grunt);

  // 'extend' source job
  grunt.task.renameTask('source', 'source-base');
  grunt.task.registerTask(
    'source',
    'Build the playground and compile the stylesheets with Sass.',
    ["sass:indigo", "source-base"]
  );

  // 'extend' build job
  grunt.task.renameTask('build', 'build-base');
  grunt.task.registerTask(
    'build',
    'Build the playground and compile the stylesheets with Sass.',
    ["sass:indigo", "build-base"]
  );

  grunt.task.registerTask(
    "lint",
    "Lints the files of the current app",
    function () {
      shell.exec("python generate.py lint");
    }
  );
};

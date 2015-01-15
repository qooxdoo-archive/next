// requires
var util = require('util');
var qx = require("../../tool/grunt");

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
    ["source-base", "sass:indigo"]
  );
};

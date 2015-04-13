// requires
var util = require('util');
var qx = require("${REL_QOOXDOO_PATH}/tool/grunt");

// grunt
module.exports = function(grunt) {
  var config = {

    common: {
      "APPLICATION" : "${Namespace}",
      "QOOXDOO_PATH" : "${REL_QOOXDOO_PATH}",
      "THEME": "custom"
    },

    source: {
      default: {
        // my custom (overridden) options
      }
    },

    build: {
      default: {
        // my custom (overridden) options
      }
    }

    /*
    myThirdPartyOrSelfWrittenTask: {
      options: {},
      myTarget: {
        options: {}
      }
    }
    */
  };

  var mergedConf = qx.config.mergeConfig(config, {"build": "build-base", "source": "source-base"});
  // console.log(util.inspect(mergedConf, false, null));
  grunt.initConfig(mergedConf);

  qx.task.registerTasks(grunt);

  // 'extend' source job
  grunt.task.renameTask('source', 'source-base');
  grunt.task.registerTask(
    'source',
    'Build the application and compile the stylesheets with Sass.',
    ["sass:indigo", "source-base"]
  );

  // 'extend' build job
  grunt.task.renameTask('build', 'build-base');
  grunt.task.registerTask(
    'build',
    'Build the application and compile the stylesheets with Sass.',
    ["sass:indigo", "build-base"]
  );

  // grunt.loadNpmTasks('grunt-my-plugin');
};

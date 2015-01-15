// requires
var util = require('util');
var qx = require("${REL_QOOXDOO_PATH}/tool/grunt");

// grunt
module.exports = function(grunt) {
  var config = {

    common: {
      "APPLICATION" : "${Namespace}",
      "QOOXDOO_PATH" : "${REL_QOOXDOO_PATH}",
      "QXTHEME": "${Namespace}.theme.Theme"
    }

    /*
    myTask: {
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
    'Build the playground and compile the stylesheets with Sass.',
    ["source-base", "sass:indigo"]
  );

  // grunt.loadNpmTasks('grunt-my-plugin');
};

// requires
var util = require('util');
var qx = require("../next.git/tool/grunt");

// grunt
module.exports = function(grunt) {
  var config = {

    common: {
      "APPLICATION" : "myapp",
      "QOOXDOO_PATH" : "../next.git",
      "THEME": "custom"
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
    ["sass:indigo", "source-base"]
  );

  // 'extend' build job
  grunt.task.renameTask('build', 'build-base');
  grunt.task.registerTask(
    'build',
    'Build the playground and compile the stylesheets with Sass.',
    ["sass:indigo", "build-base"]
  );

  // grunt.loadNpmTasks('grunt-my-plugin');
};

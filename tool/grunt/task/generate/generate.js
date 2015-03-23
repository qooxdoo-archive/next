'use strict';

var fs = require('fs');
var crypto = require('crypto');
var childProcess = require('childProcess');

/**
 * TODO: This is a quick hack from http://stackoverflow.com/a/15365656/127465
 * It should eventually be replaced by something more decent, like
 * https://npmjs.org/package/temporary
 */
function tempFileName(path) {
  var filename;
  do {
    filename = 'conf'+crypto.randomBytes(4).readUInt32LE(0)+'.tmp';
  } while (fs.existsSync(path + "/" + filename));
  return filename;
}

module.exports = function(grunt) {

  // 'generate.py' shell exit
  grunt.registerTask('generate', 'Use the generator of qooxdoo.', function(job) {
    //grunt.log.write("Args: " + job + "," + args);
    var optString = grunt.option('gargs');
    var done = this.async();
    var child;
    var childKilled = false;

    /*
     * Customize generator jobs from Gruntfile.
     *
     * read grunt.config.generator_config, which should have the normal Generator
     * config.json structure.
     * write it out as a temp. generator .json config which top
     * level-"include"s the default config.json (or the one named with -c)
     */

    var configMap = grunt.config.get('generator_config');
    // link to original config file
    if (!configMap.include) {
      configMap.include = [];
    }
    configMap.include.push(
      // TODO: inspect if gargs has '-c <otherconfig>'
      // TODO: with this synthetic config file, the original 'default' job is not detected
       {
          "path" : "./config.json",
          "bypass-export-list" : true
        });

    // create random tmpfile name
    var genConfFile = tempFileName(".") + ".json";

    fs.writeFile(genConfFile, JSON.stringify(configMap, null, 4), function(err) {
      if(err) {
        console.log(err);
        //exit(1)
      }
    });


    var cmd = [
      'python generate.py',
      (job || ''),
      //'-s',
      '-c ' + genConfFile,
      (optString || '')
    ].join(' ');

    grunt.log.write("Running: '" + cmd + "'");

    child = childProcess.exec(cmd,
      function (error, stdout, stderr) {
        if (error !== null && !childKilled) {
          grunt.log.error('stderr: ' + stderr);
          grunt.log.error('exec error: ' + error);
        }
        done(error === null);
      });

    // forward child STDOUT
    child.stdout.on("data", function(data) {
      grunt.log.write(data);
    });

    // forward child STDERR
    child.stderr.on("data", function(data) {
      grunt.log.warn(data);
    });

    // clean-up on child exit
    child.on('close', function() {
      fs.unlinkSync(genConfFile);
      if (childKilled) {
        grunt.fail.fatal("Interrupting task", 0);
      }
    });

    // handle interrupt signal (Ctrl-C)
    process.on('SIGINT', function() {
      child.kill('SIGINT'); // forward to child
      childKilled = true;
      //fs.unlinkSync(genConfFile);  // is done automatically on 'close'
    });

  });

};

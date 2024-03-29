/* *****************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Richard Sternagel (rsternagel)

***************************************************************************** */

'use strict';

// native
var fs = require('fs');
var path = require('path');

// third party
var shell = require('shelljs');
var hooker = require('hooker');

// lib
var qx = {};
qx.tool = {};
qx.tool.Cache = require('../lib/qx/tool/Cache');


// functions
var isSetupDone = function(filePath) {
  return fs.existsSync(filePath);
};

var abortOnError = function(grunt) {
  var exit = function(e) {
    if (e && e.message) {
      grunt.fatal(e.message);
    } else if (e) {
      grunt.fatal(e);
    }
    // don't exit when no 'e', try to continue
    // to next meaningful error with a message
  };

  // run on error
  hooker.hook(grunt.log, 'fail', exit);
  hooker.hook(grunt.log, 'error', exit);
};

var queryAndWriteCurrentJobs = function(grunt, cacheFilePath, cache) {
  var cmd = 'python generate.py --list-jobs';
  var jobs = {};

  var stdout = shell.exec(cmd, {silent:true}).output;
  jobs.timestamp = new Date().getTime();
  try {
    jobs.map = JSON.parse(stdout);
    cache.write(cacheFilePath, JSON.stringify(jobs));
  } catch (syntaxError) {
    grunt.warn("Aborted JSON parsing. 'python generate.py --list-jobs' "+
               "doesn't generate valid JSON:\n" + syntaxError.message);
  }

  return jobs.map;
};

var getCacheContents = function(cacheFilePath, cache) {
  return JSON.parse(cache.read(cacheFilePath));
};

var retrieveGeneratorJobsFromCache = function(files, cache) {
  if (!fs.existsSync(files.config)) {
    // fail early
    return;
  }

  var cachedJobs = {};
  if (cache.has(files.jobsAndDesc)) {
    cachedJobs = getCacheContents(files.jobsAndDesc, cache);
  }

  var configTimestamp = fs.statSync(files.config).ctime.getTime();

  return (cachedJobs && cachedJobs.timestamp && cachedJobs.timestamp >= configTimestamp)
         ? cachedJobs.map
         : null;
};

var getSupersededJobs = function() {
  return [
    "clean",
    "info",
    "source",
    "build"
  ];
};

var getMalfunctionedJobs = function() {
  return [
    "migration" // the migration job doesn't work because user input is needed
  ];
};

var getCancelledJobs = function() {
  // blacklist jobs that shouldn't be looped through anymore to the python toolchain
  return [
    "distclean"
  ];
};

var registerGeneratorJobsAsTasks = function(grunt, jobs, supersededJobs, malfunctionedJobs, cancelledJobs) {
  var sortedJobNames = Object.keys(jobs).sort();
  sortedJobNames.forEach(function (jobName) {
    var jobDesc = jobs[jobName];

    if (supersededJobs.indexOf(jobName) === -1 && cancelledJobs.indexOf(jobName) === -1) {
      // register generator job as task if there's
      // no replacement implemented in node
      // and the job can be used with grunt
      if (malfunctionedJobs.indexOf(jobName) === -1) {
        grunt.registerTask(jobName, jobDesc, function () {
          grunt.task.run(["generate:"+jobName]);
        });
      } else {
        grunt.registerTask(jobName, jobDesc, function () {
          grunt.warn("The '" + jobName + "' doesn't work with grunt, " +
            "please use the real generator './generate.py " + jobName + "' instead.");
        });
      }
    }
  });
};

var registerNodeTasks = function(grunt, relSdkPath) {
  grunt.loadTasks(relSdkPath + '/tool/grunt/task/generate');
  grunt.loadTasks(relSdkPath + '/tool/grunt/task/info/tasks');
  grunt.loadTasks(relSdkPath + '/tool/grunt/task/source/tasks');
  grunt.loadTasks(relSdkPath + '/tool/grunt/task/build/tasks');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
};

var registerTasks = function(grunt) {
  var conf = grunt.config.get('common');
  var cache = new qx.tool.Cache(conf.CACHE);
  var files = {
    "config": "config.json",
    "jobsAndDesc": "jobsAndDesc-" + fs.realpathSync(conf.ROOT)
  };
  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  // exit early
  if (!isSetupDone(path.join(conf.QOOXDOO_PATH, "tool/grunt/task/source/node_modules"))) {
    grunt.fatal("Aborted due to missing setup. Go to '" +
                path.resolve(conf.QOOXDOO_PATH) + "' and run 'grunt setup'");
  }
  abortOnError(grunt);

  if (endsWith(shell.pwd(), "framework")) {
    // enable python toolchain for SDK itself
    var jobs = retrieveGeneratorJobsFromCache(files, cache);
    if (jobs) {
      registerGeneratorJobsAsTasks(grunt, jobs, getSupersededJobs(), getMalfunctionedJobs(), getCancelledJobs());
      registerNodeTasks(grunt, conf.QOOXDOO_PATH);
    } else {
      jobs = queryAndWriteCurrentJobs(grunt, files.jobsAndDesc, cache);
      if (jobs !== null) {
        registerGeneratorJobsAsTasks(grunt, jobs, getSupersededJobs(), getMalfunctionedJobs(), getCancelledJobs());
      }
      registerNodeTasks(grunt, conf.QOOXDOO_PATH);
    }
  } else {
    // created apps shouldn't need python toolchain
    registerNodeTasks(grunt, conf.QOOXDOO_PATH);
  }

  grunt.registerTask('default', ['source']);
};

// exports
module.exports.registerTasks = registerTasks;

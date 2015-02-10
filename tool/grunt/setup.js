#!/usr/bin/env node

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

// third-party
var program = require('commander');
var shell = require('shelljs');

program
  .version('0.0.1')
  .on('--help', function(){
    console.log('  Run this for bootstraping the Grunt toolchain.');
    console.log('');
  })
  .parse(process.argv);

var rootDir = shell.pwd();
var packages = [];
var tasks = [];

// install all packages
shell.cd('task/package');

// cache is used by others so install first
shell.exec('node runNpmCmd.js install cache');
var usingCachePackages = ['dependency', 'compression'];
usingCachePackages.forEach(function(pkg) {
  shell.cd(pkg);
  // symlink cache package
  if (shell.test('-L', 'node_modules/qx-cache')) {
    fs.unlinkSync('node_modules/qx-cache');
  }
  fs.symlinkSync('../../cache/', 'node_modules/qx-cache');
  shell.cd('../');
});

// exclude runNpmCmd.js through filtering
packages = shell.ls('.').filter(function(dirOrFile) { return !dirOrFile.match(/\.js$/); });
shell.exec('node runNpmCmd.js install');
shell.cd(rootDir);

// install all tasks and symlink packages ('qx-*')
tasks = ['source', 'build'];
tasks.forEach(function(task){
  shell.cd('task/'+task);
  packages.forEach(function(pkg) {
    if (shell.test('-L', 'node_modules/qx-compression')) {
      fs.unlinkSync('node_modules/qx-compression');
    }
    fs.symlinkSync('../../package/compression/', 'node_modules/qx-compression');

    if (shell.test('-L', 'node_modules/qx-dependency')) {
      fs.unlinkSync('node_modules/qx-dependency');
    }
    fs.symlinkSync('../../package/dependency/', 'node_modules/qx-dependency');

    if (shell.test('-L', 'node_modules/qx-library')) {
      fs.unlinkSync('node_modules/qx-library');
    }
    fs.symlinkSync('../../package/library/', 'node_modules/qx-library');

    if (shell.test('-L', 'node_modules/qx-resource')) {
      fs.unlinkSync('node_modules/qx-resource');
    }
    fs.symlinkSync('../../package/resource/', 'node_modules/qx-resource');

    shell.exec('npm install');
  });
  shell.cd(rootDir);
});

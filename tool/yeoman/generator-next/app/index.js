/* *****************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2015 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

***************************************************************************** */

var path = require('path');
var fs = require('fs');

var generators = require('yeoman-generator');
var assert = require('yeoman-generator').assert;
var esutils = require('esutils');
var globals = require('globals');
var chalk = require('chalk');

module.exports = generators.Base.extend({

  constructor: function () {
    generators.Base.apply(this, arguments);

    var nextpath = path.join(this.sourceRoot(), '..', '..', '..', '..', '..');
    this.options.nextpath = path.relative(this.destinationRoot(), nextpath);
    this.options.appname = path.basename(this.destinationRoot());
    this.options.gituser = this.user.git.name();

    this.option('appnamespace', {
      desc: 'The applications\'s top-level namespace. (Default: The application name)',
      type: String
    });

    this.option('installDeps', {
      desc: 'Install NPM dependencies after app creation.',
      default: false,
      type: Boolean
    });

    this.option('generateSource', {
      desc: 'Generate development version after app creation.',
      default: false,
      type: Boolean
    });
  },


  getNamespace: function() {
    if (!this.options.appnamespace) {
      var prompt = {
        type: 'input',
        name: 'appnamespace',
        message: 'What\'s your applications\'s top-level namespace?',
        default: this.appname
      };
      var done = this.async();
      this.prompt(prompt, function(answers) {
        this.options.appnamespace = answers.appnamespace;
        done();
      }.bind(this));
    }
  },


  checkNameSpace: function () {
    var split = this.options.appnamespace.split('.');
    split.forEach(function(part) {
      // check if each namespace part is a valid identifier
      var msg = "Invalid namespace part '" + part + "':";
      assert(esutils.keyword.isIdentifierES6(part, true), msg + " Must be a valid ECMAScript identifier!");
      assert(!esutils.keyword.isRestrictedWord(part, true), msg + " ECMAScript restricted words are not allowed!");
      assert(!(part in globals.builtin), msg + " Built-in globals are not allowed!");
      assert(!(part in globals.browser), msg + " Browser globals are not allowed!");
    });
  },


  createApplication: function() {
    // copy and process the template files
    this.directory('.');
    // force mem-fs to sync so we can access the files
    this.fs.commit(function() {
      var tmplClassDir = path.join(this.destinationRoot(), 'source', 'class', 'custom');
      var appClassDir = path.join(this.destinationRoot(), 'source', 'class', this.options.appnamespace);
      fs.renameSync(tmplClassDir, appClassDir);

      // copy the framework's precompiled styles
      var stylesFrom = path.join(this.options.nextpath, 'framework/source/resource/qx/scss/theme/indigo/_styles.scss');
      var stylesTo = path.join(this.destinationRoot(), 'source', 'theme', '_styles.scss');
      this.fs.copy(
        stylesFrom,
        stylesTo
      );

    }.bind(this));
  },


  askForInstall: function() {
    if (!this.options.installDeps) {
      var prompt = {
        type: 'confirm',
        name: 'installDeps',
        message: 'Should I install your app\'s module dependencies now?'
      };
      var done = this.async();
      this.prompt(prompt, function(answers) {
        this.options.installDeps = answers.installDeps;
        done();
      }.bind(this));
    }
  },


  installDeps: function() {
    if (this.options.installDeps) {
      this.installDependencies({
        bower: false,
        skipMessage: true,
        callback: function() {
          this._generateSource();
        }.bind(this)
      });
    }
  },


  askForSource: function() {
    if (!this.options.installDeps) {
      this.log(chalk.green("Please remember to run 'npm install' followed by 'grunt source' to generate the development version of your application."));
    } else if (!this.options.generateSource) {
      var prompt = {
        type: 'confirm',
        name: 'generateSource',
        message: 'The development version of your app needs to be generated. Should I do that now?'
      };
      var done = this.async();
      this.prompt(prompt, function(answers) {
        this.options.generateSource = answers.generateSource;
        done();
      }.bind(this));
    }
  },


  _generateSource: function() {
    if (this.options.installDeps) {
      if (this.options.generateSource) {
        var proc = this.spawnCommand('grunt', ['source']);
        proc.on('close', function (code) {
          if (code === 0) {
            this.log(chalk.green("\nYour app is ready. Happy coding!"));
          }
        }.bind(this));
      } else {
        this.log(chalk.green("Keep in mind you need to run 'grunt source' before you can use your application."));
      }
    }
  }
});

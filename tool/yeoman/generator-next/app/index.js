var generators = require('yeoman-generator');
var path = require('path');
var fs = require('fs');
var assert = require('yeoman-generator').assert;
var esutils = require('esutils');
var globals = require('globals');

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
      var msg = "Invalid namespace part '" + part + "':";
      assert(esutils.keyword.isIdentifierES6(part, true), msg + " Must be a valid ECMAScript identifier!");
      assert(!esutils.keyword.isRestrictedWord(part, true), msg + " ECMAScript restricted words are not allowed!");
      assert(!(part in globals.builtin), msg + " Built-in globals are not allowed!");
      assert(!(part in globals.browser), msg + " Browser globals are not allowed!");
    });
  },


  createApplication: function() {
    this.directory('.');
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
  }
});

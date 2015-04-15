var generators = require('yeoman-generator');
var path = require('path');
var assert = require('yeoman-generator').assert;
var esutils = require('esutils');
var globals = require('globals');

module.exports = generators.Base.extend({

  constructor: function () {
    generators.Base.apply(this, arguments);

    this.options.appname = path.basename(this.destinationRoot());

    this.option('appnamespace', {
      desc: 'The applications\'s top-level namespace. (Default: The application name)',
      type: String
    });
  },


  getNamespace: function() {
    if (!this.options.appnamespace) {
      var prompt = {
        type    : 'input',
        name    : 'appnamespace',
        message : 'What\'s your applications\'s top-level namespace? (can be multi-part, e.g. foo.bar)',
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
    // console.log(this.sourceRoot());
    // console.log(this.destinationRoot());

    this.directory('source');
    // TODO: rename source/custom to source/$this.options.appnamespace
  }
});

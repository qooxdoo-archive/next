/**
 * @fileoverview Prevent references within members property initialization
 * @author rsternagel
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("eslint").linter,
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-illegal-private-usage", {

  valid: [
    {
      code: 'qx.Bootstrap.define("qx.foo.Bar", { members: { __known: null, foo: function(){ this.__known = true; } } });'
    },
    {
      code: 'qx.Bootstrap.define("qx.foo.Bar", { members: { __known: null, foo: function(){ qx.foo.Bar.__known = true; } } });'
    },
  ],

  invalid: [
    {
      code: 'qx.Bootstrap.define("qx.foo.Bar", { members: { foo: function(){ this.__notDeclared = false } } });',
      errors: [ { message: "Do not use private \'__notDeclared\' of foreign class" } ]
    },
    {
      code: 'qx.Bootstrap.define("qx.foo.Bar", { members: { foo: function(){ Foo.__notDeclared = false } } });',
      errors: [ { message: "Do not use private \'__notDeclared\' of foreign class" } ]
    },
    {
      code: 'qx.Bootstrap.define("qx.foo.Bar", { members: { foo: function(){ qx.foo.Bar.__notDeclared = false } } });',
      errors: [ { message: "Do not use private \'__notDeclared\' of foreign class" } ]
    }
  ]

});

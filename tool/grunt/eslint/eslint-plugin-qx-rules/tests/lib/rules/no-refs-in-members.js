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
eslintTester.addRuleTest("lib/rules/no-refs-in-members", {

  valid: [
    {
      code: 'qx.Bootstrap.define("qx.foo.Bar", { members: { myMember: 1, myMember2: true } });'
    }
  ],

  invalid: [
    {
      code: 'qx.Bootstrap.define("qx.foo.Bar", { members: { myMember: new Fugu() } });',
      errors: [ { message: "Do not initialize member \'myMember\' with new operator" } ]
    },
    {
      code: 'qx.Bootstrap.define("qx.foo.Bar", { members: { myMember: {} } });',
      errors: [ { message: "Do not initialize member \'myMember\' with object literal" } ]
    },
    {
      code: 'qx.Bootstrap.define("qx.foo.Bar", { members: { myMember: [] } });',
      errors: [ { message: "Do not initialize member \'myMember\' with array literal" } ]
    }
  ]

});

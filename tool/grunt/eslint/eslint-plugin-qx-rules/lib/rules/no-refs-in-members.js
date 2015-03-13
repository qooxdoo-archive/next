/**
 * @fileoverview Prevent references within members property initialization
 * @author rsternagel
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

// http://esprima.org/demo/parse.html
/**
 *  qx.Bootstrap.define("qx.foo.Bar",
 *  {
 *    members: {
 *      baafoo: 1          // ok
 *
 *      foo: new Fugu(),   // bad
 *      baa: [],           // bad
 *      foobaa: {},        // bad
 *    }
 *  });
 */

module.exports = function(context) {

  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  return {
    'Identifier': function(node) {
      if (node.name === "members"
          && node.parent
          && node.parent.value
          && node.parent.value.properties) {
        node.parent.value.properties.forEach(function(prop) {

          switch (prop.value.type) {
            case "NewExpression":
              context.report(node, "Do not initialize member '"+prop.key.name+"' with new operator");
              break;

            case "ObjectExpression":
              context.report(node, "Do not initialize member '"+prop.key.name+"' with object literal");
              break;

            case "ArrayExpression":
              context.report(node, "Do not initialize member '"+prop.key.name+"' with array literal");
              break;

            // no default
          }

        });
      }
    }
  };

};

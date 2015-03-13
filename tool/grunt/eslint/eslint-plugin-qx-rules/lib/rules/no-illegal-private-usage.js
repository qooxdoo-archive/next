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
 *      __known: null,
 *      foo: function() {
 *        this.__known         // ok
 *        qx.foo.Bar.__known   // ok
 *
 *        this.__notDeclared   // bad
 *        f.__notDeclared      // bad
 *        Foo.__notDeclared    // bad
 *      }
 *    }
 *  });
 */

module.exports = function(context) {

  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  var usedPrivates = [];
  var declaredPrivates = [];

  return {
    'Identifier': function(node) {
      if (node.name.indexOf("__") === 0) {
        usedPrivates.push(node.name);
      }

      if (node.name === "members"
          && node.parent
          && node.parent.value
          && node.parent.value.properties) {
        node.parent.value.properties.forEach(function(prop) {
          var curMember = prop.key.name;
          if (curMember.indexOf("__") === 0) {
            declaredPrivates.push(curMember);
          }
        });
      }

      // actual check
      usedPrivates.forEach(function(priv, i) {
        if (declaredPrivates.indexOf(priv) === -1) {
          context.report(node, "Do not use private '"+priv+"' of foreign class");
          delete usedPrivates[i];
        }
      });
    }
  };

};


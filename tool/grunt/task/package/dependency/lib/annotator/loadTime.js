/* *****************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2013-2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Thomas Herchenroeder (thron7)
     * Richard Sternagel (rsternagel)

***************************************************************************** */

'use strict';

/**
 * @module annotator.loadTime
 *
 * @desc
 * Annotator for esprima AST.
 *
 * <dl>
 *  <dt>What?</dt>
 *  <dd>boolean whether loadTime or not</dd>
 *  <dt>Where?</dt>
 *  <dd>specific nodes which also define an own scope
        (e.g. the global scope or the <code>classDefined</code>
        FunctionExpression)</dd>
 * </dl>
 */

/**
 * Augmentation key for tree.
 */
var annotateKey = "isLoadTime";
var additiveAnnotateKey = "staticMethodName";

/**
 * Check whether node is <code>classDefined()</code> call.
 *
 * @param {Object} node - esprima node
 * @return {boolean}
 */
function isClassDefinedFunction(node) {
  return (
    node.type === "FunctionExpression" &&
    node.parent &&
    node.parent.type === 'Property' &&
    node.parent.key &&
    node.parent.key.type === 'Identifier' &&
    node.parent.key.name === 'classDefined'
  );
}

/**
 * Annotate static methods as load time.
 *
 * @param {Scope} scope
 * @see {@link http://constellation.github.io/escope/Scope.html|Scope class}
 */
function annotateStaticMethods(scope) {
  // statics arg should be first arg of classDefined func
  var staticsArgName = (scope.variables && scope.variables[1] && scope.variables[1].name)
                       ? scope.variables[1].name
                       : 'statics';

  // store all scopes by name to be able to easily annotate them
  var otherScopes = scope.upper.childScopes;
  var otherScopesByName = {};
  for (var i in otherScopes) {
    if (otherScopes[i].block
        && otherScopes[i].block.parent
        && otherScopes[i].block.parent.parent
        && otherScopes[i].block.parent.parent.parent
        && otherScopes[i].block.parent.parent.parent.key
        && otherScopes[i].block.parent.parent.parent.key.name
        && otherScopes[i].block.parent.parent.parent.key.name === "statics") {
      var methodName = otherScopes[i].block.parent.key.name;
      // annotate the scopes itself to easily find
      // the scope by method name later on during processing
      otherScopes[i][additiveAnnotateKey] = methodName;
      // build map for annotation simplification
      otherScopesByName[methodName] = otherScopes[i];
    }
  }

  // TODO:
  // the following is *not* generic and should be replaced with something
  // more abstract but at the moment I don't know how to transform the
  // (cyclic!) esprima nodes from escope back to a proper AST which
  // could for example be processed with esquery (looking
  // just for MemberExpression with the name 'statics')

  var annotateMatchingScope = function(methName) {
    if (otherScopesByName[methName]) {
      otherScopesByName[methName][annotateKey] = true;
    }
  };

  // reuse i
  i = 0;
  var j;
  var k;
  var curArg;
  var curExpr;

  var body = scope.variableScope.block.body.body;
  if (body) {
    for (var line in body) {
      // find expression statements which look like:
      //    * statics.xyz()
      //    * statics.xyz
      if (body[line].expression
          && body[line].expression.callee
          && body[line].expression.callee.object
          && body[line].expression.callee.object.name
          && body[line].expression.callee.object.name === staticsArgName) {
        // this is xyz
        annotateMatchingScope(body[line].expression.callee.property.name);

      }
      // the reread tree after an Uglify2 pass changes the AST structure :/
      if (body[line].expression
          && body[line].expression.expressions
          && body[line].expression.expressions.length !== 0) {
        for (i in body[line].expression.expressions) {
          curExpr = body[line].expression.expressions[i];
          for (j in curExpr.arguments) {
            curArg = body[line].expression.expressions[i].arguments[j];
            if (curArg.type === "MemberExpression" && curArg.object.name === staticsArgName) {
              // this is xyz
              annotateMatchingScope(curArg.property.name);
            }
          }
        }
      }
      if (body[line].expression
          && body[line].expression.arguments
          && body[line].expression.arguments.length !== 0) {
        for (k in body[line].expression.arguments) {
          curArg = body[line].expression.arguments[k];
          if (curArg.type === "MemberExpression" && curArg.object.name === staticsArgName) {
            // this is xyz
            annotateMatchingScope(curArg.property.name);
          }
        }
      }
    }
  }
}


/**
 * Annotate unknown references as load time.
 *
 * @param {Scope} scope
 * @see {@link http://constellation.github.io/escope/Scope.html|Scope class}
 */
function annotateUnknownReferences(scope) {
  var i = 0;

  for (; i < scope.through.length; i++) {
    scope.through[i][annotateKey] = true;
  }
}

/**
 * Annotate deps of static method calls within <code>classDefined()</code>
 * as load time (cause classDefined is load time too).
 *
 * @param {Scope} scope
 * @see {@link http://constellation.github.io/escope/Scope.html|Scope class}
 */
function recurseAndAnnotateClassDefinedDeps(scope) {
  annotateStaticMethods(scope);
  annotateUnknownReferences(scope);
}

/**
 * Check whether node is immediate call (i.e. <code>(function(){})()</code> aka
 *  <abbr title="Immediately-Invoked Function Expression">IIFE</abbr>).
 *
 * @param {Object} node - esprima node
 * @return {boolean}
 */
function isImmediateCall(node) {
  // find     a(function(){}()) => CE(CE(FE))
  // but not  a(function(){})   => CE(FE)
  return (node.type === "FunctionExpression"
          && node.parent
          && node.parent.type === "CallExpression"
          && node.parent.parent.type === "CallExpression");
}

module.exports = {
  /**
   * Annotate scope with load-/run-time marks.
   *
   * @param {Scope} scope
   * @param {boolean} parentLoad
   * @see {@link http://constellation.github.io/escope/Scope.html|Scope class}
   */
  annotate: function(scope, parentLoad) {
    var node = scope.block;
    if (scope.type === 'global') {
      scope[annotateKey] = true;
    } else if (scope.type === 'function') {
      if (isClassDefinedFunction(node)) {
        scope[annotateKey] = true;
        recurseAndAnnotateClassDefinedDeps(scope);
      } else if (isImmediateCall(node)) {
        scope[annotateKey] = parentLoad; // inherit
      } else {
        scope[annotateKey] = false;
      }
    } else {
      scope[annotateKey] = parentLoad; // inherit
    }
    for (var cld in scope.childScopes) {
      // recurse
      this.annotate(scope.childScopes[cld], scope[annotateKey]);
    }
  }
};

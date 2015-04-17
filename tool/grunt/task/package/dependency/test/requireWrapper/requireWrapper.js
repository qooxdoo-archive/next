'use strict';
var esprima = require('esprima');
var classNameAnnotator = require('../../lib/annotator/className');
var depAnalyzer = require('../../lib/depAnalyzer.js');
var recursive = require('recursive-readdir');
var fs = require('fs');

var basePaths = {'qx': '../../../../../framework/source/class/'};

var convertToRequire = function(classId) {
  var jsCode = depAnalyzer.readFileContent([classId], basePaths);
  var tree = esprima.parse(jsCode[0], {comment: true, loc: true});
  classNameAnnotator.annotate(tree, classId);
  var deps = depAnalyzer.findUnresolvedDeps(tree, {}, {}, basePaths, {flattened: false});

  deps = deps.load.concat(deps.run);
  deps = deps.filter(function(dep) {
    return dep !== "define" && dep !== "require";
  });

  // console.log(classId);
  // console.log(deps);

  var namespace = {};
  deps.concat([classId]).forEach(function(dep, depIndex) {
    var currentRoot = namespace;
    dep.split('.').forEach(function(part, index, split) {
      if (!currentRoot[part]) {
        if (index == split.length - 1) {
          if (dep === classId) {
            currentRoot[part] = null;
          } else {
            currentRoot[part] = "Dep" + depIndex;
          }
        } else {
          currentRoot[part] = {};
        }
      }
      currentRoot = currentRoot[part];
    });
  });

  var createNamespace = '';
  for (var key in namespace) {
    createNamespace += 'var ' + key +' = ' + JSON.stringify(namespace[key], null, 2).replace(/"(Dep\d+)"/g, '$1') + ';\n';
  }

  deps = deps.map(function(dep) {
    return dep.replace(/\./g, '/');
  });

  var classDeps = [];
  for (var i=0; i < deps.length; i++) {
    classDeps.push("Dep" + i);
  }

  // console.log(classDeps.join(", "));
  // console.log(createNamespace + '\n\n');

  return "define(['" + deps.join("', '") + "'], function(" + classDeps.join(',') + ") {\n" +
    createNamespace + "\n" +
    jsCode.join('')
      .replace(/qx\.(Class|Interface|Mixin)\.define\(/, 'var clazz = qx.$1.define(') +
      "\n " + classId + " = clazz;\nreturn clazz;\n" + "});\n";
};

recursive(basePaths.qx, function (err, files) {
  files = files.filter(function(file) {
    return file.indexOf('__') == -1 && file.indexOf('gitignore') == -1;
  });
  files.forEach(function(file) {
    var classId = file.split('class/')[1].replace(/\//g, '.').replace('.js', '');
    var converted = convertToRequire(classId);
    var outPath = file.replace('.js', '.require.js');
    fs.writeFile(file, converted);
  });
});



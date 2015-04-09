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

/*
 * grunt-qx-source
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// native
var crypto = require("crypto");
var path = require("path");
var url = require("url");

// third-party
var pathIsInside = require("path-is-inside");
var _ = require('underscore');

// qx
var qxRes = require("qx-resource");
var qxDep = require("qx-dependency");
var qxLib = require("qx-library");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function createHashOver(content) {
  return crypto.createHash('sha1').update(content).digest("hex");
}

function renderLoaderTmpl(tmpl, ctx) {
  var tmplVar = "";
  var regex = "";

  for (tmplVar in ctx) {
    regex = new RegExp("%\{"+tmplVar+"\}", "g");
    if (ctx[tmplVar] === "") {
      tmpl = tmpl.replace(regex, "");
    } else {
      tmpl = tmpl.replace(regex, JSON.stringify(ctx[tmplVar]));
    }
  }

  return tmpl;
}

function calculateRelPaths(packageJsonData, qxPath, appName, appRoot, ns) {
  var resolvedQxPath = path.resolve(qxPath);
  var gruntDir = "tool/grunt";
  var frameworkDir = "framework";
  var rel = {
    qx: "",
    res: "",
    class: ""
  };

  // qx path depending on whether app is within qooxdoo sdk or not
  rel.qx = (pathIsInside(packageJsonData[appName].base.abs, resolvedQxPath))
           ? path.relative(packageJsonData[appName].base.abs, resolvedQxPath)
           : qxPath;

  // paths depending on whether app is within ...
  if (pathIsInside(packageJsonData[appName].base.abs, path.join(resolvedQxPath, gruntDir))) {
    // ... "tool/grunt" dir ('myapp' test app)
    rel.res = url.resolve(path.join("../", packageJsonData[ns].resource), '');
    rel.class = url.resolve(path.join("../", packageJsonData[ns].class), '');
  } else if (pathIsInside(packageJsonData[appName].base.abs, path.join(resolvedQxPath, frameworkDir))) {
    // ... "framework" dir
    // ...    * for source/index.html
    // ...    * for source/test/{index,index-source,index-coverage}.html
    rel.res = url.resolve(path.join(path.relative(appRoot, packageJsonData[ns].resource)), '');
    rel.class = url.resolve(path.join(path.relative(appRoot, packageJsonData[ns].class)), '');
  } else {
    rel.res = url.resolve(path.join("../", packageJsonData[ns].base.rel, packageJsonData[ns].resource), '');
    rel.class = url.resolve(path.join("../", packageJsonData[ns].base.rel, packageJsonData[ns].class), '');
  }

  return rel;
}


//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(grunt) {

  grunt.registerMultiTask('source', 'create source version of current application', function() {
    var opts = this.options();
    // console.log(opts);

    if (!grunt.file.exists(opts.loaderTemplate)) {
      grunt.log.warn('Loader template file "' + opts.loaderTemplate + '" not found. Can\'t proceed.');
      throw new Error('ENOENT - Loader template file "' + opts.loaderTemplate + '" not found. Can\'t proceed.');
    }

    grunt.log.writeln('Scanning libraries ...');
    // -----------------------------------------
    var classPaths = qxLib.getPathsFor("class", opts.libraries, {withKeys: true});
    var resBasePathMap = qxLib.getPathsFor("resource", opts.libraries, {withKeys: true});
    var allNamespaces = Object.keys(classPaths);
    grunt.log.ok('Done.');


    grunt.log.writeln('Collecting classes ...');
    // -----------------------------------------
    var depsCollectingOptions = {variants: false, cachePath: opts.cachePath, buildType: "source"};
    var classesDeps = qxDep.collectDepsRecursive(classPaths, opts.includes, opts.excludes, opts.environment, depsCollectingOptions);
    grunt.log.ok('Done.');

    // expand excludes starting with a '='
    opts.excludes = qxDep.expandExcludes(opts.excludes, classPaths);
    var depsWithoutExcludes = _.difference(Object.keys(classesDeps), opts.excludes);

    grunt.log.writeln('Sorting ' + depsWithoutExcludes.length + ' classes ...');
    // ------------------------------------------------------------------------------
    var classListLoadOrder = qxDep.sortDepsTopologically(classesDeps, "load", opts.excludes);
    classListLoadOrder = qxDep.prependNamespace(classListLoadOrder, allNamespaces);
    var classListPaths = qxDep.translateClassIdsToPaths(classListLoadOrder);
    var atHintIndex = qxDep.createAtHintsIndex(classesDeps);
    grunt.log.ok('Done.');


    grunt.log.writeln('Get resources ...');
    // ------------------------------------
    var macroToExpansionMap = {
      "${qx.icontheme}": opts.qxIconTheme
    };
    var assetNsBasesPaths = qxRes.flattenExpandAndGlobAssets(atHintIndex.asset, resBasePathMap, macroToExpansionMap);
    var resData = qxRes.collectResources(assetNsBasesPaths, resBasePathMap, {metaFiles: true});
    grunt.log.ok('Done.');

    var resources = {
      "resources": resData
    };
    var resourcesContent = "qx.$$packageData['0']=" + JSON.stringify(resources) + ";";

    var resourcesHash = createHashOver(resourcesContent).substr(0, 12);
    var resourcesFileName = opts.appName + "." + resourcesHash + ".js";

    // {"uris":["__out__:myapp.e2c18d74cbbe.js","qx:qx/Bootstrap.js", ...]};
    var packagesUris = {
      "uris": ["__out__:"+resourcesFileName].concat(classListPaths)
    };

    var libinfo = { "__out__":{"sourceUri":"script"} };
    var packageJsonData = qxLib.readPackageJson(opts.libraries);
    var relPaths = {};
    var ns = "";
    for (ns in packageJsonData) {
      relPaths = calculateRelPaths(packageJsonData, opts.qxPath, opts.appName, opts.appRoot, ns);
      libinfo[ns] = {};
      if (ns === "qx" && opts.appName !== "qx") {
        libinfo[ns] = {
          "resourceUri": url.resolve(path.join('../', relPaths.qx, '/framework/source/resource'), ''),
          "sourceUri": url.resolve(path.join('../', relPaths.qx, '/framework/source/class'), ''),
          "sourceViewUri":"https://github.com/qooxdoo/qooxdoo/blob/%{qxGitBranch}/framework/source/class/%{classFilePath}#L%{lineNumber}"
        };
      } else {
        libinfo[ns].resourceUri = relPaths.res;
        libinfo[ns].sourceUri = relPaths.class;
      }
    }

    var ctx = {
      EnvSettings: opts.environment,
      Libinfo: libinfo,
      Resources: {},
      Parts: {"boot":[0]},             // TODO: impl missing
      Packages: {"0": packagesUris},   // ...
      CssBefore: opts.addCss || [],
      Boot: 'boot',                    // ...
      BootIsInline: false,             // ...
      BootPart: ''                     // ...
    };

    grunt.log.writeln('Generate loader script ...');
    // ---------------------------------------------
    var tmpl = grunt.file.read(opts.loaderTemplate);
    var renderedTmpl = renderLoaderTmpl(tmpl, ctx);

    var fileName = opts.fileName + ".js";

    // write script files
    grunt.file.write(path.join(opts.sourcePath, fileName), renderedTmpl);
    grunt.file.write(path.join(opts.sourcePath, resourcesFileName), resourcesContent);
    grunt.log.ok('Done.');
  });
};

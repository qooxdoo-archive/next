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

'use strict';

/**
 * @module library
 *
 * @desc
 * Wrapper for <code>package.json</code> files. Reads them and provides their contents.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// native
var fs = require('fs');
var path = require('path');


//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {
  /**
   * Read JSON file (e.g. package.json).
   *
   * @param {string[]} filePaths
   * @returns {Object}
   */
  readPackageJson: function(filePaths) {
    var i = 0;
    var l = filePaths.length;
    var jsonPath = '';
    var contents = '';
    var packageJson = '';
    var packageJsonFiles = {};

    for (; i<l; i++) {
      jsonPath = filePaths[i];
      if (!fs.existsSync(jsonPath)) {
        throw Error('Can\'t read package.json file from: ' + jsonPath);
      }
      contents = fs.readFileSync(jsonPath, {encoding: 'utf8'});
      packageJson = JSON.parse(contents);
      if (!('org_next' in packageJson)) {
        throw Error('Missing "org_next" key of package.json file from: ' + jsonPath);
      }
      packageJsonFiles[packageJson.org_next.namespace] = {
        "base": {
          rel: path.dirname(jsonPath),
          abs: path.resolve(path.dirname(jsonPath))
        },
        "data": packageJson,
        "class": packageJson.org_next.class,
        "resource": packageJson.org_next.resource
      };

    }

    return packageJsonFiles;
  },

  /**
   * Extracts data by kind (<code>'class'</code> or
   * <code>'resource'</code> from given
   * <code>package.json</code> paths optionally with namespace key.
   *
   * @param {string} kind
   * @param {string[]} filePaths
   * @param {Object} [options]
   * @param {boolean} [options.withKeys=false] - namespaces as keys
   * @returns {Object|string[]}
   */
  getPathsFor: function(kind, filePaths, options) {
    var libPaths = readPackageJson(filePaths);
    var validKinds = ['class', 'resource'];
    var specificPathsWithKeys = {};
    var specificPaths = [];
    var lib = '';

    var opts = {};

    if (!options) {
      options = {};
    }

    // merge options and default values
    opts = {
      withKeys: options.withKeys === true ? true : false,
    };

    if (validKinds.indexOf(kind) === -1) {
      throw Error('Invalid kind ('+kind+'). Supported: '+validKinds);
    }

    for (lib in libPaths) {
      if (opts.withKeys) {
        specificPathsWithKeys[lib] = path.join(libPaths[lib].base.rel, libPaths[lib][kind]);
      } else {
        specificPaths.push(path.join(libPaths[lib].base.rel, libPaths[lib][kind]));
      }
    }

    return opts.withKeys ? specificPathsWithKeys : specificPaths;
  }
};

// shortcut
var getPathsFor = module.exports.getPathsFor;
var readPackageJson = module.exports.readPackageJson;

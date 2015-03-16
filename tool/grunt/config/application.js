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

// native
var fs = require('fs');
var os = require('os');
var path = require('path');

// third party
var deepmerge = require('deepmerge');
var q = require('qooxdoo');

var common = {
  "ROOT": ".",
  "QOOXDOO_PATH": "../../..",
  "THEME": "custom",
  "QXICONTHEME": ["Tango"],
  "TMPDIR": os.tmpdir(),
  "CACHE": "<%= common.TMPDIR %>/next<%= common.QOOXDOO_VERSION %>/cache",
  "CACHE_KEY":
  {
    "compile": "<%= common.CACHE %>",
    "downloads": "<%= common.CACHE %>/downloads",
  },
  "APPLICATION_MAIN_CLASS" : "<%= common.APPLICATION %>.Application",
  "SOURCE_PATH": "<%= common.ROOT %>/source",
  "BUILD_PATH": "<%= common.ROOT %>/build",
  "ENVIRONMENT": {
    "qx.application": "<%= common.APPLICATION %>.Application",
    "qx.revision":"",
    "qx.theme": "<%= common.THEME %>",
    "qx.version":"<%= common.QOOXDOO_VERSION %>"
  }
};

var getQxVersion = function(relQxPath) {
  var vers = fs.readFileSync(fs.realpathSync(path.join(path.join(__dirname, relQxPath), 'version.txt')), 'utf-8');
  return vers.trim();
};

common.QOOXDOO_VERSION = getQxVersion(common.QOOXDOO_PATH);

var getConfig = function() {
  var config = {
    generator_config: {
      let: {}
    },

    common: common,

    pkg: JSON.parse(fs.readFileSync('package.json')),

    /* grunt-contrib-clean */
    clean: {
      options: {
        force: true
      },
      source: ["<%= common.SOURCE_PATH %>/script",
               "<%= common.SOURCE_PATH %>/theme/*.css*"],
      build: ["<%= common.BUILD_PATH %>"],
      api: ["<%= common.ROOT %>/api"],
      app: ["<%= common.SOURCE_PATH %>/script",
            "<%= common.SOURCE_PATH %>/theme/*.css*",
            "<%= common.BUILD_PATH %>",
            "<%= common.ROOT %>/api"],
      cache: ["<%= common.CACHE_KEY.compile %>",
              "<%= common.CACHE_KEY.downloads %>"]
    },
    /* grunt-qx-source */
    source: {
      options: {
        appName: "<%= common.APPLICATION %>",
        qxPath: "<%= common.QOOXDOO_PATH %>",
        qxIconTheme: "<%= common.QXICONTHEME %>",
        sourcePath: "<%= common.SOURCE_PATH %>/script",
        cachePath: "<%= common.CACHE %>",
        loaderTemplate: "<%= common.QOOXDOO_PATH %>/tool/data/generator/loader.tmpl.js",
        environment: common.ENVIRONMENT,
        addCss: ["theme/<%= common.THEME %>.css"],
        includes: ["<%= common.APPLICATION_MAIN_CLASS %>"],
        excludes: [],
        libraries: [
          "<%= common.QOOXDOO_PATH %>/framework/package.json",
          "<%= common.ROOT %>/package.json"
        ]
      }
    },
    /* grunt-qx-build */
    build: {
      options: {
        appName: "<%= common.APPLICATION %>",
        qxPath: "<%= common.QOOXDOO_PATH %>",
        qxIconTheme: "<%= common.QXICONTHEME %>",
        sourcePath: "<%= common.SOURCE_PATH %>",
        buildPath: "<%= common.BUILD_PATH %>",
        cachePath: "<%= common.CACHE %>",
        loaderTemplate: "<%= common.QOOXDOO_PATH %>/tool/data/generator/loader.tmpl.js",
        environment: deepmerge(common.ENVIRONMENT, {
          "qx.debug" : false,
          "qx.debug.databinding" : false,
          "qx.debug.dispose" : false,
          "qx.debug.ui.queue" : false,
          "qx.debug.io" : false
        }),
        addCss: ["theme/<%= common.THEME %>.css"],
        includes: ["<%= common.APPLICATION_MAIN_CLASS %>"],
        excludes: [],
        libraries: [
          "<%= common.QOOXDOO_PATH %>/framework/package.json",
          "<%= common.ROOT %>/package.json"
        ]
      }
    },
    /* grunt-qx-info */
    info: {
      options: {
        qxPath: "<%= common.QOOXDOO_PATH %>",
        cachePaths: "<%= common.CACHE_KEY %>"
      }
    },
    /* grunt-contrib-sass */
    sass: {
      indigo: {
        options: {
          style: 'compressed',
          noCache: true,
          loadPath: ['<%= common.QOOXDOO_PATH %>/framework/source/resource/qx/scss']
        },
        files: [{
          expand: true,
          cwd: 'source/theme',
          src: ['*.scss'],
          dest: 'source/theme',
          ext: '.css'
        }]
      }
    },
    /* grunt-eslint */
    eslint: {
      options: {
        configFile: '<%= common.QOOXDOO_PATH %>/tool/grunt/eslint/eslint.json',
        rulePaths: ['<%= common.QOOXDOO_PATH %>/tool/grunt/eslint/eslint-plugin-qx-rules/lib/rules']
      },
      target: ['<%= pkg.org_next.class %>']
    },
    /* grunt-contrib-watch */
    watch: {
      source: {
        files: [
          "source/class/**/*.js",
          "source/theme/**/*.scss"
        ],
        tasks: ["default"],
        options: {
          interrupt: true
        }
      }
    }
  };

  return config;
};

var mergeConfig = function(config, renameMap) {
  var task = "";
  var prop = "";
  var confKey = "";
  var confKeyProp = "";
  var newTaskName = "";
  var oldTaskName = "";

  var mergedConfig = deepmerge(getConfig(), config);

  // possibility to rename tasks (i.e. config)
  if (renameMap) {
    for (oldTaskName in renameMap) {
      newTaskName = renameMap[oldTaskName];
      mergedConfig[newTaskName] = mergedConfig[oldTaskName];
      delete mergedConfig[oldTaskName];
    }
  }

  // TODO:
  //  Consider:
  //    * Recycle '={confKey}'-syntax from config.json or sth. better?
  //    * Introduce '!{confKeyProp}'-syntax for removing of confKeyProp?!

  for (task in mergedConfig) {
    for (prop in mergedConfig[task]) {
      if (prop === "options") {
        for (confKey in mergedConfig[task].options) {
          if (q.Bootstrap.isObject(mergedConfig[task].options[confKey])) {
            for (confKeyProp in mergedConfig[task].options[confKey]) {
              if (confKeyProp[0] === "!") {
                // remove !{confKeyProp}
                delete mergedConfig[task].options[confKey][confKeyProp.substr(1)];
                delete mergedConfig[task].options[confKey][confKeyProp];
              }
            }
          }
          if (confKey[0] === "=") {
            // overwrite std mergedConfig and remove "={confKey}"
            mergedConfig[task].options[confKey.substr(1)] = mergedConfig[task].options[confKey];
            delete mergedConfig[task].options[confKey];
          }
        }
      }
    }
  }

  return mergedConfig;
};


// exports
module.exports.getConfig = getConfig;
module.exports.mergeConfig = mergeConfig;

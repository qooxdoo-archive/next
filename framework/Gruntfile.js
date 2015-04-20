// requires
var fs = require('fs');
var util = require('util');
var qx = require('../tool/grunt');

// grunt
module.exports = function(grunt) {

  var config = {
    generator_config: {
      let: {
      }
    },

    common: {
      'APPLICATION': 'qx',
      'QOOXDOO_PATH' : '../'
    },

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';'
      },
      samples : {
        src: ['api/samples/*.js'],
        dest: 'api/script/samples.js'
      }
    },

    watch: {
      samples: {
        files: ['api/samples/*.js'],
        tasks: ['concat:samples', 'notify:samples']
      },
      'api-data': {
        files: ['source/**/*.js'],
        tasks: ['api-data', 'notify:apidata']
      },
      'source': {
        files: ['source/**/*.js'],
        tasks: ['default']
      }
    },

    sass: {
      flat: {
        options: {
          style: 'compressed'
        },
        files: {
          'build/resource/qx/css/flat.css': 'source/resource/qx/scss/flat.scss'
        }
      },
      indigo: {
        options: {
          style: 'compressed'
        },
        files: [{
          cwd: ".",
          expand: false,
          src: 'source/resource/qx/scss/indigo.scss',
          dest: 'build/resource/qx/css/indigo.css'
        }]
      }
    },

    notify: {
      api: {
        options: {
          message: 'API viewer generated.'
        }
      },
      apidata: {
        options: {
          message: 'API data generated.'
        }
      },
      samples: {
        options: {
          message: 'API samples concatenated.'
        }
      }
    },

    source: {
      qxweb: {
        options: {
          includes: [ "qxWeb", "qx.module.*" ],
          libraries: [ "<%= common.ROOT %>/package.json" ],
          loaderTemplate: "../tool/data/generator/website.loader.source.tmpl.js",
          appRoot: 'source',
          fileName: "q-source"
        }
      }
    },

    build: {
      options: {
        "=libraries": [
          "<%= common.ROOT %>/package.json"
        ]
      },
      qxweb: {
        options: {
          includes: [ "qxWeb", "qx.module.*" ],
          loaderTemplate: "../tool/data/generator/website.loader.tmpl.js",
          fileName: "q"
        }
      },
      "module-core": {
        options: {
          includes: [
            "qx.module.Core"
          ],
          excludes: [],
          loaderTemplate: "../tool/data/generator/website.loader.tmpl.js",
          fileName: "core"
        }
      },
      "module-animation": {
        options: {
          includes: [ "qx.module.Animation" ],
          excludes: [ "qx.Class", "qxWeb", "=qx.module.Core" ],
          loaderTemplate: "../tool/data/generator/website.loader.tmpl.js",
          fileName: "animation"
        }
      },
      "module-blocker": {
        options: {
          includes: [ "qx.module.Blocker" ],
          excludes: [ "qx.Class", "qxWeb", "=qx.module.Core" ],
          loaderTemplate: "../tool/data/generator/website.loader.tmpl.js",
          fileName: "blocker"
        }
      },
      "module-cookie": {
        options: {
          includes: [ "qx.module.Cookie" ],
          excludes: [ "qx.Class", "qxWeb", "=qx.module.Core" ],
          loaderTemplate: "../tool/data/generator/website.loader.tmpl.js",
          fileName: "cookie"
        }
      },
      "module-dataset": {
        options: {
          includes: [ "qx.module.Dataset" ],
          excludes: [ "qx.Class", "qxWeb", "=qx.module.Core" ],
          loaderTemplate: "../tool/data/generator/website.loader.tmpl.js",
          fileName: "dataset"
        }
      },
      "module-dev": {
        options: {
          includes: [ "qx.module.dev.FakeServer" ],
          excludes: [ "qx.Class", "qxWeb", "=qx.module.Core" ],
          loaderTemplate: "../tool/data/generator/website.loader.tmpl.js",
          fileName: "dev"
        }
      },
      "module-io": {
        options: {
          includes: [ "qx.module.Io" ],
          excludes: [ "qx.Class", "qxWeb", "=qx.module.Core" ],
          loaderTemplate: "../tool/data/generator/website.loader.tmpl.js",
          fileName: "io"
        }
      },
      "module-matchmedia": {
        options: {
          includes: [ "qx.module.MatchMedia" ],
          excludes: [ "qx.Class", "qxWeb", "=qx.module.Core" ],
          loaderTemplate: "../tool/data/generator/website.loader.tmpl.js",
          fileName: "matchmedia"
        }
      },
      "module-messaging": {
        options: {
          includes: [ "qx.module.Messaging" ],
          excludes: [ "qx.Class", "qxWeb", "=qx.module.Core" ],
          loaderTemplate: "../tool/data/generator/website.loader.tmpl.js",
          fileName: "messaging"
        }
      },
      "module-placement": {
        options: {
          includes: [ "qx.module.Placement" ],
          excludes: [ "qx.Class", "qxWeb", "=qx.module.Core" ],
          loaderTemplate: "../tool/data/generator/website.loader.tmpl.js",
          fileName: "placement"
        }
      },
      "module-rest": {
        options: {
          includes: [ "qx.module.Rest" ],
          excludes: [ "qx.Class", "qxWeb", "=qx.module.Core" ],
          loaderTemplate: "../tool/data/generator/website.loader.tmpl.js",
          fileName: "rest"
        }
      },
      "module-storage": {
        options: {
          includes: [ "qx.module.Storage" ],
          excludes: [ "qx.Class", "qxWeb", "=qx.module.Core" ],
          loaderTemplate: "../tool/data/generator/website.loader.tmpl.js",
          fileName: "storage"
        }
      },
      "module-template": {
        options: {
          includes: [ "qx.module.Template" ],
          excludes: [ "qx.Class", "qxWeb", "=qx.module.Core" ],
          loaderTemplate: "../tool/data/generator/website.loader.tmpl.js",
          fileName: "template"
        }
      },
      "module-textselection": {
        options: {
          appName: "textselection",
          includes: [ "qx.module.TextSelection" ],
          excludes: [ "qx.Class", "qxWeb", "=qx.module.Core" ],
          loaderTemplate: "../tool/data/generator/website.loader.tmpl.js",
          fileName: "textselection"
        }
      },
      "module-transform": {
        options: {
          includes: [ "qx.module.Transform" ],
          excludes: [ "qx.Class", "qxWeb", "=qx.module.Core" ],
          loaderTemplate: "../tool/data/generator/website.loader.tmpl.js",
          fileName: "transform"
        }
      },
      "module-util": {
        options: {
          includes: [
           "qx.module.util.Array",
           "qx.module.util.String",
           "qx.module.util.Type",
           "qx.module.util.Object",
           "qx.module.util.Function"
          ],
          excludes: [ "qx.Class", "qxWeb", "=qx.module.Core" ],
          loaderTemplate: "../tool/data/generator/website.loader.tmpl.js",
          fileName: "util"
        }
      },
      "module-ui": {
        options: {
          includes: [ "qx.module.Ui" ],
          excludes: [ "qx.Class", "qxWeb", "=qx.module.Core" ],
          loaderTemplate: "../tool/data/generator/website.loader.tmpl.js",
          fileName: "ui"
        }
      }
    }
  };

  var mergedConf = qx.config.mergeConfig(config, {"source": "source-base"});

  // define custom 'clean' task
  mergedConf.clean = {
    options: {
      force: true
    },
    api: ["<%= common.ROOT %>/api/script"],
    app: ["<%= common.SOURCE_PATH %>/script",
          "<%= common.BUILD_PATH %>",
          "<%= common.ROOT %>/api/script"]
  };

  // console.log(util.inspect(mergedConf, false, null));
  grunt.initConfig(mergedConf);

  qx.task.registerTasks(grunt);

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-notify');

  // 'extend' source job
  grunt.task.renameTask('source', 'source-base');
  grunt.task.registerTask(
    'source',
    'Build the playground and compile the stylesheets with Sass.',
    ["sass:indigo", "source-base"]
  );

  // 'extend' API job
  grunt.task.renameTask('api', 'generate-api');
  grunt.task.registerTask(
    'api',
    'Concat the samples and generate the API.',
    ['concat:samples', 'generate-api', 'notify:api']
  );

  // pre-process the index file
  grunt.registerTask('process-api-html', 'A task to preprocess the index.html', function() {
    // read index file
    var index = fs.readFileSync('api/index.html', {encoding: 'utf8'});

    // process index file
    var found = index.match(/<!--\s*\{.*\}\s*-->/g);
    for (var i = 0; i < found.length; i++) {
      var name = found[i].replace(/<!--|-->|\{|\}/g, "").trim();
      var templateFileName = "api/" + name + ".html";
      if (fs.existsSync(templateFileName)) {
        console.log("Processing '" + name + "': OK");
        index = index.replace(found[i], fs.readFileSync(templateFileName));
      } else {
        console.log("Processing '" + name + "': ignore");
      }
    }

    // write index file
    fs.writeFileSync('api/index.new.html', index, {'encoding': 'utf8'});
  });
};

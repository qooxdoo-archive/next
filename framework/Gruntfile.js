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
      'APPLICATION' : 'qx',
      'LOCALES': ['en'],
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
    }
  };

  var mergedConf = qx.config.mergeConfig(config);
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

  // 'extend' API job
  grunt.task.renameTask('api', 'generate-api');
  grunt.task.registerTask(
    'api',
    'Concat the samples and generate the API.',
    ['concat:samples', 'generate-api', 'notify:api']
  );

  // 'extend' qxWeb jobs
  var qxWebTasks = {
    'qxweb-source': 'qx.Website source version generated.',
    'qxweb-build': 'qx.Website unminified build version generated.',
    'qxweb-build-min': 'qx.Website minified build version generated.',
    'qxweb-build-module-all': 'qx.Website unminified modular build version generated.',
    'qxweb-build-module-all-min': 'qx.Website minified modular build version generated.'
  };

  for (var task in qxWebTasks) {
    mergedConf.notify[task] = {
      options: {
        message: qxWebTasks[task]
      }
    };
    grunt.task.renameTask(task, 'temp');
    grunt.task.registerTask(
      task,
      'Generate the build version of qx.Website and the widget CSS',
      ['generate:' + task, 'sass:indigo', 'notify:' + task]
    );
  }

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

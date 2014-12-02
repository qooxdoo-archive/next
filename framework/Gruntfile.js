// requires
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
      'APPLICATION' : 'qooxdoo',
      'LOCALES': ['en'],
      'QOOXDOO_PATH' : '../',
    },

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
      }
    },

    sass: {
      indigo: {
        options: {
          style: 'compressed'
        },
        files: {
          'build/resource/qx/css/indigo.css': 'source/resource/qx/scss/indigo.scss'
        }
      },
      flat: {
        options: {
          style: 'compressed'
        },
        files: {
          'build/resource/qx/css/flat.css': 'source/resource/qx/scss/flat.scss'
        }
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
      },
      'qxweb-source': {
        options: {
          message: 'qx.Website source version generated.'
        }
      },
      'qxweb-build': {
        options: {
          message: 'qx.Website unminified build version generated.'
        }
      },
      'qxweb-build-min': {
        options: {
          message: 'qx.Website minified build version generated.'
        }
      },
      'qxweb-build-module-all': {
        options: {
          message: 'qx.Website unminified modular build version generated.'
        }
      },
      'qxweb-build-module-all-min': {
        options: {
          message: 'qx.Website minified modular build version generated.'
        }
      }
    }
  };

  var mergedConf = qx.config.mergeConfig(config);
  grunt.initConfig(mergedConf);

  qx.task.registerTasks(grunt);

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-notify');

  // 'extend' API job
  grunt.task.renameTask('api', 'generate-api');
  grunt.task.registerTask(
    'api',
    'Concat the samples and generate the API.',
    ['concat:samples', 'generate-api', 'notify:api']
  );

  // 'extend' qxWeb jobs
  [
    'qxweb-source',
    'qxweb-build',
    'qxweb-build-min',
    'qxweb-build-module-all',
    'qxweb-build-module-all-min'
  ].forEach(function(task) {
    grunt.task.renameTask(task, 'temp');
    grunt.task.registerTask(
      task,
      'Generate the build version of qx.Website and the widget CSS',
      ['generate:' + task, 'sass:indigo', 'notify:' + task]
    );
  });

  // pre-process the index file
  var fs = require('fs');
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

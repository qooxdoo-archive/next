// grunt
module.exports = function(grunt) {
  grunt.initConfig({
    eslint: {
      options: {
        globals: ["myapp"],
        configFile: 'eslint/eslint.json',
        rulePaths: ['eslint/eslint-plugin-qx-rules/lib/rules']
      },
      target: ['lib','task']
    },
  });

  // alias
  grunt.registerTask('lint', 'eslint');

  grunt.loadNpmTasks('grunt-eslint');
};




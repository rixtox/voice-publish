module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    clean: {
      build: ['public']
    },

    copy: {
      public: {
        files: [{
          expand: true,
          cwd: 'src/html',
          src: ['**/*.html'],
          dest: 'public'
    }]}},

    stylus: {
      compile: {
        options: {
          paths: ['src/styles'],
          'include css': true
        },
        files: {
          'public/style.css': 'src/styles/main.styl'
    }}},

    browserify: {
      options: {
        transform: [
          require('liveify'),
          require('grunt-react').browserify
      ]},
      app: {
        src: 'src/scripts/app.ls',
        dest: 'public/app.js'
    }},

    watch: {
      stylus: {
        files: ['src/styles/**/*.styl'],
        tasks: ['stylus:compile'],
        options: {
          livereload: true
      }},
      browserify: {
        files: ['src/scripts/**/*.ls', 'src/scripts/**/*.jsx'],
        tasks: ['browserify'],
        options: {
          livereload: true
      }},
      html: {
        files: ['src/html/**/*.html'],
        tasks: ['copy:public'],
        options: {
          livereload: true
    }}}
  });

  grunt.registerTask('build', ['copy:public', 'stylus:compile', 'browserify']);
  grunt.registerTask('default', ['clean', 'build']);
};
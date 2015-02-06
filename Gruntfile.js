module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  var webpack = require('webpack');
  var webpackConfig = require('./webpack.config.js');

  grunt.initConfig({
    clean: {
      build: [webpackConfig.output.path]
    },

    webpack: {
      options: webpackConfig,
      build: {
        plugins: webpackConfig.plugins.concat(
          new webpack.DefinePlugin({
            'process.env': {
              'NODE_ENV': JSON.stringify('production')
            }
          }),
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.UglifyJsPlugin()
        )
      },
      'build-dev': {
        devtool: 'sourcemap',
        debug: true
      }
    },

    'webpack-dev-server': {
      options: {
        webpack: webpackConfig,
        contentBase: webpackConfig.output.path
      },
      start: {
        keepAlive: true,
        webpack: {
          devtool: 'eval',
          debug: true
        }
      }
    },

    watch: {
      app: {
        files: ['src/**/*', 'config.ls'],
        tasks: ['clean', 'webpack:build-dev'],
        options: {
          spawn: false,
          livereload: true
        }
      }
    }
    
  });

  grunt.registerTask('default', ['webpack-dev-server:start']);
  grunt.registerTask('dev', ['clean', 'webpack:build-dev', 'watch:app']);
  grunt.registerTask('build', ['clean', 'webpack:build']);

};

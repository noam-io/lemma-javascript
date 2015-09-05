//Copyright (c) 2015, IDEO
'use strict';

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configurable paths for the application
  var cfg = {
    dist: 'dist',
    src: 'src'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    cfg: cfg,

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= cfg.dist %>/{,*/}*',
            '!<%= cfg.dist %>/.git*'
          ]
        }]
      }
    },

    uglify: {
       dist: {
         files: {
           '<%= cfg.dist %>/lemma.min.js': [
             '<%= cfg.dist %>/lemma.js'
           ]
         }
       }
     },

    concat: {
       dist: {
         src: [
          '<%= cfg.src %>/*.js'
          ],
         dest: '<%= cfg.dist %>/lemma.js',
       }
     }
  });

  grunt.registerTask('default', [
    'clean:dist',
    'concat:dist',
    'uglify:dist'
  ]);
};

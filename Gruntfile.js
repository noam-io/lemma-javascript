//Copyright (c) 2015, IDEO
'use strict';

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configurable paths for the application
  var cfg = {
    dist: 'dist',
    src: 'src',
    outputfile: 'lemma.js',
    minifiedFile: 'lemma.min.js'
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

    release: {
      options: {
        additionalFiles: ['bower.json'],
        beforeBump:['test']
      }
    },
    uglify: {
       dist: {
         files: {
           '<%= cfg.dist %>/<%= cfg.minifiedFile %>': [
             '<%= cfg.dist %>/<%= cfg.outputfile %>'
           ]
         }
       }
     },

    jscs: {
      src: ['<%= cfg.src %>/*.js', '<%= cfg.dist %>/<%= cfg.outputfile %>'],
      options: {
        config: '.jscsrc',
        fix: true
      }
    },

    jshint: {
      options: {
        jshintrc: true
      },
      all: ['<%= cfg.src %>/*.js', '<%= cfg.dist %>/<%= cfg.outputfile %>']
    },

    concat: {
       dist: {
         options: {
           // Replace all 'use strict' statements in the code with a single one at the top
           banner: '\'use strict\';\n\n',
           process: function(src, filepath) {
             return '// Source: ' + filepath + '\n' +
               src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
           }
         },
         src: [
          '<%= cfg.src %>/*.js'
          ],
         dest: '<%= cfg.dist %>/<%= cfg.outputfile %>'
       }
     }
  });

  grunt.registerTask('test', [
    'jshint',
    'jscs'
  ]);

  grunt.registerTask('default', [
    'clean:dist',
    'concat:dist',
    'uglify:dist',
    'test'
  ]);

};

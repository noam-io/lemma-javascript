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

    sync: {
      all: {
        options: {
          // sync specific options
          sync: ['author', 'name', 'version', 'private', 'contributors', 'license', 'homepage']
        }
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

    jscs: {
      src: ['<%= cfg.src %>/*.js', '<%= cfg.dist %>/lemma.js'],
      options: {
        config: '.jscsrc',
        fix: true
      }
    },

    jshint: {
      options: {
        jshintrc: true
      },
      all: ['<%= cfg.src %>/*.js', '<%= cfg.dist %>/lemma.js']
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
         dest: '<%= cfg.dist %>/lemma.js'
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
    'test',
    'sync'
  ]);

};

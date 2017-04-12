module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jscs: {
      src: [
        'src/js/**/*.js'
      ],
      util: [
        'Gruntfile.js'
      ],
      options: {
        config: '.jscsrc',
        fix: false
      }
    },
    browserify: {
      development: {
        src: [
          'src/js/**/*.js'
        ],
        dest: 'build/js/app.js',
        options: {
          browserifyOptions: {debug: true},
          transform: [['babelify', {presets: ['es2015']}]]
        }
      }
    },
    'htmlmin': {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          'expand': true,
          'cwd': 'src/static',
          'src': ['**/*.html', '**/*.css'],
          'dest': 'build/'
        }]
      }
    },
    'watch': {
      scripts: {
        files: ['src/js/**/*.js'],
        tasks: ['watchRebuildScripts']
      },
      html: {
        files: ['src/**/*.html', 'src/**/*.css'],
        tasks: ['watchRebuildHtml']
      },
      util: {
        files: ['Gruntfile.js'],
        tasks: ['watchRebuildUtil']
      },
      options: {
        livereload: 8081
      }
    },
    'connect': {
      all: {
        options:{
          port: 8080,
          livereload: {
            host: process.env.IP,
            port: 8081
          }
        }
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {expand: true, cwd: 'src/static/images/', src: ['**'], dest: 'build/images/', filter: 'isFile'}
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Build-all task
  grunt.registerTask('build', ['jscs', 'browserify', 'htmlmin', 'copy']);

  // Default task, builds project and then configures watch
  // for automatic rebuild + live reload on file edits
  grunt.registerTask('default',
    ['build', 'connect', 'watch']);

  // Rebuilds all scripts and copies to build
  grunt.registerTask('watchRebuildScripts', ['jscs:src', 'browserify']);
  // Minifies + copies HTML to build
  grunt.registerTask('watchRebuildHtml', ['htmlmin']);
  // Rebuilds everything if the configuration changes
  grunt.registerTask('watchRebuildUtil', ['default']);

};
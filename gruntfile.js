module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            css: {
                files: '**/*.scss',
                tasks: ['sass', 'concat']
            },
            js: {
                files: 'assets/js/*.js',
                tasks: ['uglify']
            }
        },
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'assets/css/kssj.css': 'assets/sass/kssj.scss'
                }
            }
        },
        uglify: {
            lib: {
                files: {
                    'public/js/lib.js': ['bower_components/jquery/dist/jquery.js','bower_components/typeahead.js/dist/typeahead.bundle.js'],
                    'public/js/kssj.js': ['assets/js/kssj.js']
                }
            }
        },
        concat: {
            css: {
                src: ['assets/css/kssj.css'/*, 'assets/css/typeahead.css'*/],
                dest: 'public/stylesheets/kssj.css'
            }
        }
    });


    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).
    grunt.registerTask('default', ['watch']);
};
'use strict';
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            dev: {
                files: {
                    './public/css/traitydogs.css': [
                        './public/less/traitydogs.less'
                    ]
                },
                options: {
                    compress: false,
                    sourceMap:true,
                    sourceMapFilename: 'traitydogs.css.map'
                }
            }
        },
        watch: {
            less: {
                files: [
                    '.public/less/*.less'
                ],
                tasks: ['less:dev']
            }
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    // Register tasks
    grunt.registerTask('serve', [
        'less:dev',
        'watch'
    ]);

};

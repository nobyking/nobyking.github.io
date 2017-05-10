module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        path: {
            dev: 'code',
            release: 'out'
        },
        clean: {
            dist: {
                src: [
                    '<%= path.release %>/*'
                ]
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: '<%= path.dev %>',
                    dest: '<%= path.release %>',
                    src: '**/*.{php,txt,json,htm,html,png,jpg,jpeg,gif,ico}'
                }]
            }
        },
        filerev: {
            files: {
                src: [
                    '<%= path.release %>/img/{,live-ad/}*.{png,jpg,jpeg,gif}',
                    '<%= path.release %>/js/{,*/}*.js',
                    '<%= path.release %>/css/{,*/}*.css'
                ]
            }
        },
        useminPrepare: {
            html: ['<%= path.dev %>/*.html'],
            options: {
                root: '<%= path.dev %>',
                dest: '<%= path.release %>'
            }
        },
        usemin: {
            html: '<%= path.release %>/*.html',
            css: '<%= path.release %>/css/{,*/}*.css',
            js: '<%= path.release %>/js/{,*/}*.js',
            options: {
                assetsDirs: ['<%= path.release %>', '<%= path.release %>/img'],
                patterns: {
                    js: [
                        [/["']([^:"']+\.(?:png|gif|jpe?g))["']/img, 'Image replacement in js files']
                    ]
                }
            }
        },
        cdn: {
            options: {
                cdn: 'http://stdl.qq.com/stdl/miyue/',
                flatten: true,
                supportedTypes: {
                    'phtml': 'html'
                }
            },
            dist: {
                src: ['<%= path.release %>/*.html', '<%= path.release %>/css/{,*/}*.css', '<%= path.release %>/js/{,*/}*.js']
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyJS: true,
                    minifyCSS: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= path.release %>',
                    src: '*.html',
                    dest: '<%= path.release %>'
                }]
            }
        },
        zip: {
            'out': {
                cwd: '<%= path.release %>',
                src: ['<%= path.release %>/css/{,*/}*', '<%= path.release %>/js/{,*/}*', '<%= path.release %>/img/{,*/}*','<%= path.release %>/images/{,*/}*','<%= path.release %>/index.html'],
                dest: '<%= path.release %>/out.zip'
            }
        }
    })


    grunt.registerTask('default', [
        'clean:dist',
        'copy:main',
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'cdn:dist',
        'htmlmin',
        'zip:out'
    ])
}
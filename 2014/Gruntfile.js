module.exports = function(grunt) {
    grunt.registerTask('dev', [
        'copy:dev', 'less'
    ]);

    grunt.initConfig({
        watch: {
            dev: {
                files: ['src/**'],
                tasks: ['dev']
            }
        },
        less: {
            dev: {
                files: {
                    'asset/index/css/main.css': 'src/index/css/main.less'
                }
            }
        },
        copy: {
            dev: {
                files: [
                    {
                        expand: true,
                        cwd: 'dep',
                        src: ['**'],
                        dest: 'asset/dep',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'src/img',
                        src: ['**'],
                        dest: 'asset/img',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'src/common',
                        src: ['**'],
                        dest: 'asset/common',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'src/data',
                        src: ['**'],
                        dest: 'asset/data',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'src/index',
                        src: ['**'],
                        dest: 'asset/index',
                        filter: 'isFile'
                    }
                ]
            },
            build: {
                files: [
                    {
                        expand: true,
                        cwd: 'dep',
                        src: ['**'],
                        dest: '_build/dep',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'src/common',
                        src: ['**'],
                        dest: '_build/common',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'src/data',
                        src: ['**'],
                        dest: '_build/data',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'src/index',
                        src: ['**'],
                        dest: '_build/index',
                        filter: 'isFile'
                    }
                ]
            }
        },
        requirejs: {
            pub: {
                options: {
                    baseUrl: './_build/index/js',
                    name: 'main',
                    packages: [
                        {
                            name: 'echarts',
                            location: '../../dep/echarts/src',
                            main: 'echarts'
                        },
                        {
                            name: 'zrender',
                            location: '../../dep/zrender/src',
                            main: 'zrender'
                        }
                    ],
                    findNestedDependencies: true,
                    out: 'asset/index/js/main.js',
                    preserveLicenseComments: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
};

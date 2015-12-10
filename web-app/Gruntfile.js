// Generated on 2015-04-09 using generator-angular 0.11.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Configurable paths for the application
	var config = {
		app: require('./bower.json').appPath || 'app',
		dist: 'dist',
		test: 'test',
		sass: '.sass-cache',
		temp: '.tmp',
		tasks: grunt.cli.tasks
	};

	// Define the configuration for all the tasks
	grunt.initConfig({

		// Project settings
		config: config,

		// Compiles Sass to CSS and generates necessary files if requested
		compass: {
			options: {
				cssDir:                     '<%= config.temp %>/styles',
				generatedImagesDir:         '<%= config.temp %>/images/generated',
				sassDir:                    '<%= config.app %>/styles',
				imagesDir:                  '<%= config.app %>/images',
				javascriptsDir:             '<%= config.app %>/scripts',
				fontsDir:                   '<%= config.app %>/styles/fonts',
				importPath:                 './bower_components',
				httpImagesPath:             '/images',
				httpGeneratedImagesPath:    '/images/generated',
				httpFontsPath:              '/styles/fonts',
				relativeAssets:             false,
				assetCacheBuster:           false,
				raw:                        'Sass::Script::Number.precision = 10\n'
			},

			dist: {
				options: {
					generatedImagesDir: '<%= config.dist %>/images/generated'
				}
			},

			server: {
				options: {
					sourcemap: true
				}
			}
		},

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			bower: {
				files: ['bower.json'],
				tasks: ['wiredep']
			},

			js: {
				files: ['<%= config.app %>/scripts/{,*/}*.js'],
				tasks: ['newer:jshint'],
				options: {
					livereload: true
				}
			},

			jsTest: {
				files: ['<%= config.test %>/spec/{,*/}*.js'],
				tasks: ['newer:jshint:test', 'karma']
			},

			compass: {
				files: ['<%= config.app %>/styles/{,*/}*.{scss}'],
				tasks: ['compass:server', 'autoprefixer']
			},

			gruntfile: {
				files: ['Gruntfile.js']
			},

			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},

				files: [
					'<%= config.temp %>/styles/{,*/}*.css',
					'<%= config.app %>/{,*/}*.html',
					'<%= config.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
					'<%= config.app %>/manifest.json',
					'<%= config.app %>/_locales/{,*/}*.json',
					'<%= config.app %>/resources/{,*/}*.{json,png,jpg}'
				]
			}
		},

		// The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				hostname: 'localhost',
				livereload: 35729,

				open: true,
				useAvailablePort: true
			},

			chrome: {
				options: {
					open: false,
					middleware: function (connect) {
						return [
							connect.static(config.temp),
							connect().use('/bower_components', connect.static('./bower_components')),
							connect().use('/app/styles', connect.static('./app/styles')),
							connect.static(config.app)
						];
					}

				}
			},

			test: {
				options: {
					middleware: function (connect) {
						return [
							connect.static(config.temp),
							connect.static(config.test),
							connect().use('/bower_components', connect.static('./bower_components')),
							connect.static(config.app)
						];
					}
				}
			},

			dist: {
				options: {
					base: '<%= config.dist %>'
				}
			}
		},

		// Empties folders to start fresh
		clean: {
			server: '<%= config.temp %>',
			chrome: '<%= config.temp %>',
			dist: {
				files: [{
					dot: true,
					src: [
						'<%= config.temp %>',
						'<%= config.sass %>',
						'<%= config.dist %>/{,*/}*',
						'!<%= config.dist %>/.git{,*/}*'
					]
				}]
			}
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: {
				src: [
					'Gruntfile.js',
					'<%= config.app %>/scripts/{,*/}*.js',
					'!<%= config.app %>/scripts/{,*/}satelliteservice.js',
					'!<%= config.app %>/scripts/vendor/*'
				]
			},

			test: {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				src: ['<%= config.test %>/spec/{,*/}*.js']
			}
		},

		// Add vendor prefixed styles
		autoprefixer: {
			options: {
				browsers: ['last 1 version']
			},
			chrome: {
				options: {
					map: true
				},
				files: [{
					expand: true,
					cwd: '<%= config.temp %>/styles/',
					src: '{,*/}*.css',
					dest: '<%= config.temp %>/styles/'
				}]
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.temp %>/styles/',
					src: '{,*/}*.css',
					dest: '<%= config.temp %>/styles/'
				}]
			}
		},

		// Automatically inject Bower components into the app
		wiredep: {
			app: {
				src: ['<%= config.app %>/index.html'],
				ignorePath:  /\.\.\//
			},

			test: {
				devDependencies: true,
				src: '<%= karma.unit.configFile %>',
				ignorePath:  /\.\.\//,
				fileTypes:{
					js: {
						block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
						detect: {
							js: /'(.*\.js)'/gi
						},
						replace: {
							js: '\'{{filePath}}\','
						}
					}
				}
			},
			sass: {
				src: ['<%= config.app %>/styles/{,*/}*.scss'],
				ignorePath: /(\.\.\/){1,2}bower_components\//
			}
		},

		// Renames files for browser caching purposes
		filerev: {
			dist: {
				src: [
					'<%= config.dist %>/scripts/{,*/}*.js',
					'<%= config.dist %>/styles/{,*/}*.css',
					'<%= config.dist %>/styles/fonts/*',
					'<%= config.dist %>/images/{,*/}*.{png,jpg,jpeg,svg}',
					'!<%= config.dist %>/images/icon_{16,128}.png',
					'!<%= config.dist %>/images/ISSIcon.png',
					'!<%= config.dist %>/images/land_shallow_topo_2048.jpg',
					'!<%= config.dist %>/scripts/background.js'
				]
			}
		},

		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			html: '<%= config.app %>/index.html',
			options: {
				dest: '<%= config.dist %>',
				flow: {
					html: {
						steps: {
							js: ['concat', 'uglifyjs'],
							css: ['cssmin']
						},
						post: {}
					}
				}
			}
		},

		// Performs rewrites based on filerev and the useminPrepare configuration
		usemin: {
			html: ['<%= config.dist %>/{,*/}*.html'],
			css: ['<%= config.dist %>/styles/{,*/}*.css'],
			options: {
				assetsDirs: [
					'<%= config.dist %>',
					'<%= config.dist %>/images',
					'<%= config.dist %>/styles'
				]
			}
		},

		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.app %>/images',
					src: '{,*/}*.{png,jpg,jpeg,gif}',
					dest: '<%= config.dist %>/images'
				}]
			}
		},

		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.app %>/images',
					src: '{,*/}*.svg',
					dest: '<%= config.dist %>/images'
				}]
			}
		},

		htmlmin: {
			dist: {
				options: {
					customAttrAssign: [/\?=/],
					collapseBooleanAttributes: true,
					collapseWhitespace: true,
					conservativeCollapse: true,
					removeCommentsFromCDATA: true,
					removeOptionalTags: true,
					removeRedundantAttributes: true,
					useShortDoctype: true
				},
				files: [{
					expand: true,
					cwd: '<%= config.dist %>',
					src: ['*.html', 'views/{,*/}*.html'],
					dest: '<%= config.dist %>'
				}]
			}
		},

		// ng-annotate tries to make the code safe for minification automatically
		// by using the Angular long form for dependency injection.
		ngAnnotate: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.temp %>/concat/scripts',
					src: '*.js',
					dest:'<%= config.temp %>/concat/scripts'
				}]
			}
		},

		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= config.app %>',
					dest: '<%= config.dist %>',
					src: [
						'*.{ico,png,txt}',
						'.htaccess',
						'*.html',
						'views/{,*/}*.html',
						'styles/fonts/{,*/}*.{eot,svg,ttf,woff,woff2}',
						'_locales/{,*/}*.json',
						'resources/**'
					]
				}, {
					expand: true,
					cwd: '<%= config.temp %>/images',
					dest: '<%= config.dist %>/images',
					src: ['generated/*']
				}, {
					expand: true,
					cwd: '.',
					src: [
						'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
						'bower_components/cesiumjs/Build/Cesium/**'
					],
					dest: '<%= config.dist %>'
				}]
			},
			build: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= config.temp %>/concat/',
					dest: '<%= config.dist %>',
					src: [
						'scripts/*.js'
					]
				}]
			},
			styles: {
				expand: true,
				cwd: '<%= config.app %>/styles',
				dest: '<%= config.temp %>/styles/',
				src: '{,*/}*.css'
			}
		},

		// Run some tasks in parallel to speed up the build process
		concurrent: {
			server: [
				'compass:server'
			],
			chrome: [
				'compass:server'
			],
			test: [
				'compass'
			],
			dist: [
				'compass:dist',
				'imagemin',
				'svgmin'
			]
		},

		// Merge event page, update build number, exclude the debug script
		chromeManifest: {
			dist: {
				options: {
					buildnumber: false,
					background: {
						target: 'scripts/background.js',
						exclude: [
							'scripts/chromereload.js'
						]
					}
				},
				src: '<%= config.app %>',
				dest: '<%= config.dist %>'
			},

			package: {
				options: {
					buildnumber: true,
					background: {
						target: 'scripts/background.js',
						exclude: [
							'scripts/chromereload.js'
						]
					}
				},
				src: '<%= config.app %>',
				dest: '<%= config.dist %>'
			}

		},

		// Compress files in dist to make Chromea Apps package
		compress: {
			dist: {
				options: {
					archive: function() {
						var manifest = grunt.file.readJSON('app/manifest.json');
						return 'package/build-' + manifest.version + '.zip';
					}
				},
				files: [{
					expand: true,
					cwd: '<%= config.dist %>/',
					src: ['**'],
					dest: ''
				}]
			}
		},

		// Test settings
		karma: {
			unit: {
				configFile: 'test/karma.conf.js',
				singleRun: true
			}
		}
	});

	grunt.registerTask('debug', function (platform) {
		var watch = grunt.config('watch');
		platform = platform || 'chrome';

		// Configure style task for debug:server task
		if (platform === 'server') {
			watch.styles.tasks = ['newer:copy:styles'];
			watch.styles.options.livereload = false;
		}

		// Configure updated watch task
		grunt.config('watch', watch);

		grunt.task.run([
			'clean:' + platform,
			'wiredep',
			'concurrent:' + platform,
			'autoprefixer:' + platform,
			'connect:' + platform,
			'watch'
		]);
	});

	grunt.registerTask('test', [
		'clean:server',
		'wiredep',
		'concurrent:test',
		'autoprefixer',
		'connect:test',
		'karma'
	]);

	grunt.registerTask('build', [
		//'test',
		'clean:dist',
		'chromeManifest:dist',
		'wiredep',
		'useminPrepare',
		'concurrent:dist',
		'autoprefixer',
		'concat',
		'ngAnnotate',
		'copy',
		'cssmin',
		'filerev',
		'usemin',
		'htmlmin'
	]);

	grunt.registerTask('package', [
		'clean:dist',
		'chromeManifest:package',
		'wiredep',
		'useminPrepare',
		'concurrent:dist',
		'autoprefixer',
		'concat',
		'ngAnnotate',
		'copy:dist',
		'cssmin',
		'uglify',
		'filerev',
		'usemin',
		'htmlmin',
		'compress'
	]);

	grunt.registerTask('default', [
		'newer:jshint',
		'test',
		'build'
	]);
};

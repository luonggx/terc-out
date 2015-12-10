'use strict';

/**
 * @ngdoc overview
 * @name museumOfFlightApp
 * @description
 * # museumOfFlightApp
 *
 * Main module of the application.
 */
angular
	.module('museumOfFlightApp', ['ngAnimate', 'ngResource', 'ngRoute', 'ui.bootstrap', 'cesiumjs'])
	.config([
		'$routeProvider', '$logProvider', '$compileProvider',
		'DEBUG_MODE', 'APP_DEFAULT_ROUTE_PATH', 'VIEWS_DIR',
		function ($routeProvider, $logProvider, $compileProvider,
		          DEBUG_MODE, APP_DEFAULT_ROUTE_PATH, VIEWS_DIR) {
			$logProvider.debugEnabled(DEBUG_MODE);

			$compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file):|data:image\/)|chrome-extension:/);
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
			$routeProvider.caseInsensitiveMatch = true;

			$routeProvider
				.when('/', {redirectTo: '/touch/photography'})

				.when('/viewer/photography', {
					templateUrl: '/views/photographyviewer.html',
					controller: 'PhotographyViewerCtrl'
				})

				.when('/viewer/photography/:album/:image', {
					templateUrl: '/views/photographyviewer.html',
					controller: 'PhotographyViewerCtrl'
				})

				.when('/touch/photography', {
					templateUrl: VIEWS_DIR + 'galleryfullwidth.html',
					controller: 'PhotographyTouchCtrl'
				})

				.when('/touch/flyover/', {
					templateUrl: '/views/gallerywithmap.html',
					controller: 'FlyoverTouchCtrl'
				})
				.when('/viewer/flyover/:flyoverName', {
					controller: 'FlyoverViewerCtrl',
					templateUrl: VIEWS_DIR + 'flyoverVideoViewer.html',
					title: 'View from the International Space Station of __FLYOVER_NAME__'
				})
				.when('/viewer/flyover/:flyoverName/:dayNight', {
					controller: 'FlyoverViewerCtrl',
					templateUrl: VIEWS_DIR + 'flyoverVideoViewer.html',
					title: 'View from the International Space Station of __FLYOVER_NAME__'
				})
				.when('/touch/photography/:album', {
					templateUrl: VIEWS_DIR + 'gallerywithmap.html',
					controller: 'PhotographyTouchAlbumCtrl'
				})
				.otherwise({redirectTo: '/touch/photography'})
			;
		}
	])

;

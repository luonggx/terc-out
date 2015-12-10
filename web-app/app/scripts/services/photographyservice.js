'use strict';

/**
 * @ngdoc service
 * @name museumOfFlightApp.Photography
 * @description
 * # Photography
 * Factory in the museumOfFlightApp.
 */
angular.module('museumOfFlightApp')
	.factory('PhotographyService',[
		'$rootScope', '$resource', '$q', '$interval', '$log',
		'SERVICES_CACHE_DURATION', 'SERVICES_BASE_PATH',
		'SERVICES_PHOTOGRAPHY_GALLERY', 'SERVICES_PHOTOGRAPHY_ALBUM',
	function ($rootScope, $resource, $q, $interval, $log,
			  SERVICES_CACHE_DURATION, SERVICES_BASE_PATH,
			  SERVICES_PHOTOGRAPHY_GALLERY, SERVICES_PHOTOGRAPHY_ALBUM) {

		//Private Variables
		var _data          = {},
			_promises      = [],
			_cacheHandler  = null,
			_cacheDuration = SERVICES_CACHE_DURATION * 1000;

		var _galleryResource = $resource(SERVICES_BASE_PATH + SERVICES_PHOTOGRAPHY_GALLERY);
		var _albumResource   = $resource(SERVICES_BASE_PATH + SERVICES_PHOTOGRAPHY_ALBUM);

		/**
		 *
		 * @param cacheDuration
		 * @private
		 */
		function _cacheConfigure(cacheDuration) {
			if(_cacheDuration !== cacheDuration) {
				$log.debug('PhotographyService: cancel auto-reload');
				$interval.cancel( _cacheHandler );

				_cacheDuration = cacheDuration >= 0 ? cacheDuration*1000 : _cacheDuration;

				if(_cacheDuration > 0) {
					$log.debug('PhotographyService: auto-reload in ' + Math.floor(_cacheDuration/1000) + ' seconds' );
					_cacheHandler = $interval(_initialize, _cacheDuration);
				}
			}
		}

		/**
		 *
		 * @private
		 */
		function _initialize() {
			$log.debug('PhotographyService: loading ->');
			var promise = _galleryResource.get().$promise;

			_data     = {};
			_promises = [];

			_promises.push(promise);
			promise.then(_processGalleryResource);
		}

		/**
		 *
		 * @param gallery
		 * @private
		 */
		function _processGalleryResource(gallery) {
			$log.debug('PhotographyService: process resource -> ' + gallery.title);

			_data = {
				title:         gallery.title,
				imagePath:     SERVICES_BASE_PATH + getRouteKey() + '/',
				cacheDuration: gallery.cacheDuration,
				defaultAlbum:  gallery.defaultAlbum,
				albums:        {},
				order:         []
			};

			_data.viewerImage = {
				id:          'galleryViewer',
				title: 	     gallery.title,
				filename:	 _data.imagePath + gallery.viewerImage
			};

			_cacheConfigure(_data.cacheDuration);

			angular.forEach(gallery.albums, _fetchAlbums);
			$q.all(_promises).then( function() {
				$log.debug('PhotographyService: broadcast Gallery Loaded');
				$rootScope.$broadcast(getEvents().LOADED);
			});
		}

		/**
		 *
		 * @param album
		 * @private
		 */
		function _fetchAlbums(album) {
			if (!album.enabled) {
				$log.debug('PhotographyService: skip disabled Album -> ' + album.path);
				return;
			}

			$log.debug('PhotographyService: adding Album ' + album.path);
			_data.order.push(album.path);
			_data.albums[album.path] = {
				id:       album.path,
				basePath: _data.imagePath + album.path + '/'
			};

			var promise = _albumResource.get({album: album.path}).$promise;
			_promises.push(promise);
			promise.then(_processAlbum);
		}

		/**
		 *
		 * @param albumData
		 * @private
		 */
		function _processAlbum(albumData) {
			$log.debug('PhotographyService: process Album ->');
			var details = _data.albums[albumData.id];

			details.title  = albumData.title;
			details.cover  = details.basePath + albumData.cover;
			details.images = [];

			angular.forEach(albumData.images || [], function(image) {
				if(!image.active) {
					return false;
				}

				details.images.push( {
					id:          image.id,
					title: 	     image.title,
					description: image.description,
					thumbnail:   details.basePath + image.thumbnail,
					filename:	 details.basePath + image.filename,
					fileType:    image.filename,
					timestamp:   image.timestamp,
					latitude:	 image.latitude,
					longitude:   image.longitude,
					altitude:    image.altitude,
					tags:        image.tags,
					mapImg:      details.basePath + image.id + '.png'
				});
			});

			$log.debug('PhotographyService: added this album ' + _data.albums[albumData.id]);
		}

		/**
		 *
		 * @returns {$promise}
		 */
		function getAlbums() {
			var deferred = $q.defer();
			$q.all(_promises).then( function() {
				var list = [];
				angular.forEach(_data.order, function(id) {
					list.push(_data.albums[id]);
				});
				deferred.resolve( list );
			},
				function(errors) {
					deferred.reject(errors);
				},
				function(updates) {
					deferred.update(updates);
				});

			return deferred.promise;
		}

		/**
		 *
		 * @param albumId {string}
		 * @returns {$promise}
		 * @private
		 */
		function getAlbumPhotos(albumId) {
			var deferred = $q.defer();
			$q.all(_promises).then( function() {
					var list = [];
					angular.forEach((_data.albums[albumId] || {}).images || [], function(photo) {
						list.push(photo);
					});
					deferred.resolve( list );
				},
				function(errors) {
					deferred.reject(errors);
				},
				function(updates) {
					deferred.update(updates);
				});

			return deferred.promise;
		}

		/**
		 *
		 * @returns {{LOADED: string}}
		 */
		function getEvents() {
			return { LOADED: 'PhotographyServiceLoaded'};
		}

		/**
		 *
		 * @returns {promise}
		 * @private
		 */
		function getDefaultAlbum() {
			var deferred = $q.defer();
			$q.all(_promises).then(
				function() {
					deferred.resolve( _data.defaultAlbum || _data.albums[0] );
				},
				function(errors) {
					deferred.reject(errors);
				},
				function(updates) {
					deferred.update(updates);
				});
			return deferred.promise;
		}

		/**
		 *
		 * @param albumId
		 * @param photoId
		 * @returns {*}
		 */
		function getPhoto(albumId, photoId) {
			var deferred = $q.defer();
			$q.all(_promises).then(
				function() {
					var result = null;
					angular.forEach((_data.albums[albumId] || {}).images || [], function(image) {
						if(image.id === photoId) {
							result = image;
							return false;
						}
					});
					deferred.resolve( result );
				},
				function(errors) {
					deferred.reject(errors);
				},
				function(updates) {
					deferred.update(updates);
				});
			return deferred.promise;
		}

		/**
		 *
		 * @returns {string}
		 */
		function getRouteKey() {
			return 'photography';
		}

		/**
		 *
		 * @returns {*}
		 */
		function getViewerImage() {
			var deferred = $q.defer();
			$q.all(_promises).then(
				function() {
					var result = _data.viewerImage;
					deferred.resolve( result );
				},
				function(errors) {
					deferred.reject(errors);
				},
				function(updates) {
					deferred.update(updates);
				});
			return deferred.promise;
		}

		_initialize();

		// Public API here
		return {
			getAlbums:      getAlbums,
			getAlbumPhotos: getAlbumPhotos,
			getDefault:     getDefaultAlbum,
			getEvents:      getEvents,
			getPhoto:       getPhoto,
			getViewerImage: getViewerImage,
			getRouteKey:    getRouteKey
		};
	}
	]);

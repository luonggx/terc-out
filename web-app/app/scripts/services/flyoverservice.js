'use strict';

/**
 * @ngdoc service
 * @name museumOfFlightApp.FlyoverService
 * @description
 * # FlyoverService
 * Factory in the museumOfFlightApp.
 * TODO: Still need to add the resource pull to feed the data store
 */
angular.module('museumOfFlightApp')
	.factory('FlyoverService', [
		'$rootScope', '$resource', '$q', '$interval', '$log', 'SatelliteService',
		'SERVICES_CACHE_DURATION', 'SERVICES_BASE_PATH', 'SERVICES_FLYOVERS', 'SERVICES_FLYOVERS_TLE',
		'SERVICES_FLYOVERS_MOVIES', 'DOMAIN_URL',
		function ($rootScope, $resource, $q, $interval, $log, SatelliteService,
		          SERVICES_CACHE_DURATION, SERVICES_BASE_PATH, SERVICES_FLYOVERS, SERVICES_FLYOVERS_TLE,
		          SERVICES_FLYOVERS_MOVIES, DOMAIN_URL) {
		//Private variables
		var _data            = {},
			_promises        = [],
			_cacheHandler    = null,
			_cacheDuration   = SERVICES_CACHE_DURATION * 1000;

		var _flyoverResource = $resource(SERVICES_BASE_PATH + SERVICES_FLYOVERS);
		var _tleResource     = $resource(DOMAIN_URL + SERVICES_BASE_PATH + SERVICES_FLYOVERS_TLE);

		/**
		 *
		 * @param cacheDuration
		 * @private
		 */
		function _cacheConfigure(cacheDuration) {
			if(_cacheDuration !== cacheDuration) {
				$log.debug('FlyoverService: cancel auto-reload');
				$interval.cancel( _cacheHandler );

				_cacheDuration = cacheDuration >= 0 ? cacheDuration*1000 : _cacheDuration;

				if(_cacheDuration > 0) {
					$log.debug('FlyoverService: auto-reload in ' + Math.floor(_cacheDuration/1000) + ' seconds' );
					_cacheHandler = $interval(_initialize, _cacheDuration);
				}
			}

		}

		/**
		 *
		 * @private
		 */
		function _initialize() {
			$log.debug('FlyoverService: loading -> ');
			var promise = _flyoverResource.get().$promise;

			_data     = {};
			_promises = [];

			_promises.push(promise);
			promise.then(_processFlyoverResource);
		}

		/**
		 *
		 * @param flyoverManifest
		 * @private
		 */
		function _processFlyoverResource(flyoverManifest) {
			$log.debug('FlyoverService: process flyoverManifest');
			_data = {
				flyoverDefault:   flyoverManifest.flyoverDefault,
				issIcon:          flyoverManifest.issIcon,
				imagePath:        flyoverManifest.imagePath,
				tlePath:          flyoverManifest.tlePath,
				durationDefault:  flyoverManifest.durationDefault,
				cacheDuration:    flyoverManifest.cacheDuration,
				flyovers:         {},
				order:            []
			};

			_cacheConfigure(_data.cacheDuration);

			angular.forEach(flyoverManifest.flyovers, _processFlyover);

			$q.all(_promises).then( function() {
				$log.debug('FlyoverService: broadcast flyovers Loaded');
				$rootScope.$broadcast(getEvents().LOADED);
			});
		}

		/**
		 *
		 * @param flyover {{}}
		 * @private
		 */
		function _processFlyover(flyover) {
			if (!flyover.enabled) {
				$log.debug('FlyoverService: skipped ' + flyover.title + ' - disabled');
				return;
			}

			_data.order.push(flyover.id);

			$log.debug('FlyoverService: adding ' + flyover.title);
			var baseImagePath   = SERVICES_BASE_PATH + getRouteKey() + '/' + _data.imagePath + '/',
				type     = flyover.type === 'realTime' ? flyover.type : 'static';

			/*if (flyover.mediaType === 'cesium') {
				_promises.push(
					_tleResource
						.get({
							tlePath: _data.tlePath,
							flyoverId: flyover.id
						})
						.$promise
						.then(_processTLE));
			}*/
			_promises.push(
				_tleResource.get({tlePath: _data.tlePath, flyoverId: flyover.id}).$promise.then(_processTLE)
			);

			_data.flyovers[flyover.id] = {
				id:          flyover.id,

				title:       flyover.title,
				description: flyover.description,
				type:        type,

				media:       {
					type:       flyover.mediaType,
					srcDay:     SERVICES_FLYOVERS_MOVIES.replace(':flyoverId', flyover.id).replace(':type', flyover.mediaType),
					srcNight:   flyover.hasNight ? SERVICES_FLYOVERS_MOVIES.replace(':flyoverId', (flyover.id + '_night')).replace(':type', flyover.mediaType) : null,
					width:      flyover.mediaWidth,
					height: flyover.mediaHeight
				},

				cover:       baseImagePath + flyover.id + '.' + flyover.coverType,
				satellite:   null,
				startTime:   new Date(flyover.startTime),
				endTime:     type === 'static' ? new Date(flyover.endTime) : null,

				image:       baseImagePath + _data.issIcon
			};
		}

		/**
		 *
		 * @param tleResource{{id:{string},tle:{string}}}
		 * @private
		 */
		function _processTLE(tleResource) {
			$log.debug('FlyoverService: processing TLE for ' + tleResource.id);
			var satellite = SatelliteService.get();

			satellite.tle.loadTLE(tleResource.tle);
			$log.debug(satellite);

			_data.flyovers[tleResource.id].satellite = satellite;
		}

		/**
		 *
		 * @returns {promise}
		 */
		function getAllFlyovers() {
			var deferred = $q.defer();
			$q.all(_promises).then( function() {
				var list = [];
				angular.forEach(_data.order, function(id) {
					list.push(_data.flyovers[id]);
				});
				deferred.resolve( list );
			});

			return deferred.promise;
		}

		/**
		 *
		 * @returns {promise}
		 */
		function getDefault() {
			var deferred = $q.defer();
			$q.all(_promises).then(
				function() {
					deferred.resolve( _data.flyoverDefault || _data.flyovers[_data.order[0]] );
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
			return { LOADED: 'FlyoverServiceLoaded' };
		}

		/**
		 *
		 * @param flyoverId {string}
		 */
		function getFlyover(flyoverId) {
			var deferred = $q.defer();
			$q.all(_promises).then( function() {
				deferred.resolve( _data.flyovers[flyoverId] );
			});

			return deferred.promise;
		}

		/**
		 *
		 * @returns {string}
		 */
		function getRouteKey() {
			return 'flyover';
		}

		//INIT the factory and get it reloading based on cache
		if(_cacheDuration > 0) {
			$log.debug('FlyoverService: auto-reload in ' + Math.floor(_cacheDuration/1000) + ' seconds (default)' );
			_cacheHandler = $interval(_initialize, _cacheDuration);
		}
		_initialize();

		// Public API here
		return {
			getAllFlyovers: getAllFlyovers,
			getDefault:     getDefault,
			getEvents:		getEvents,
			getFlyover:     getFlyover,
			getRouteKey:    getRouteKey
		};
	}]);

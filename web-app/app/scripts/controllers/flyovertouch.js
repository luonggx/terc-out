'use strict';

/**
 * @ngdoc function
 * @name museumOfFlightApp.controller:FlyoverTouchCtrl
 * @description
 * # FlyoverTouchCtrl
 * Controller of the museumOfFlightApp
 */
angular.module('museumOfFlightApp')
	.controller('FlyoverTouchCtrl', [
		'$window', '$rootScope', '$scope', '$timeout', '$routeParams', '$location', '$filter', '$q', '$interval', '$log',
		'PrimaryViewer', 'FlyoverService', 'CesiumjsWidgetService', 'APP_DEFAULT_ROUTE_PATH', 'BASE_VIEWER_URL', 'IMAGERY_PROVIDER', 'orbitalMapPosition', 'orbitalMapUnits', 'SCENE_MODE',
		function ($window, $rootScope, $scope, $timeout, $routeParams, $location, $filter, $q, $interval, $log,
			PrimaryViewer, FlyoverService, CesiumjsWidgetService, APP_DEFAULT_ROUTE_PATH, BASE_VIEWER_URL, IMAGERY_PROVIDER, orbitalMapPosition, orbitalMapUnits, SCENE_MODE) {

			$log.debug('FlyoverTouchCtrl: init');
			var _defaultId             = null,
				_flyoverEvents         = FlyoverService.getEvents(),
				_routerKey             = FlyoverService.getRouteKey(),

				_lineColor             = '#ffff00',
				_intervalIconHertz     = 1000, //milliseconds
				_intervalPathHertz     = 300000, //milliseconds 5 min
				_intervalIconRef,
				_intervalPathRef,
				_clamps = {
					lon: {min: -180, max: 180},
					lat: {min: -60, max: 60}
				};

			/**
			 *
			 * @private
			 */
			function _init() {
				// Variables for Pagination //
				$scope.itemList     = [];
				$scope.currentItem  = {};
				$scope.currentPage  = 1;
				$scope.itemsPerPage = 9;

				$scope.chooseItem     = chooseItem;
				$scope.isActive       = isActive;

				$scope.$watch('currentItem', _currentItemChanged);

				$scope.$on(_flyoverEvents.LOADED, _flyoverDataProcess);
				$scope.$on('$destroy', _destructor);

				$rootScope.showMap            = false;
				$rootScope.orbitalPosition    = angular.copy(orbitalMapPosition);
				$rootScope.showOrbitalGauges  = true;
				$rootScope.showDayNightToggle = false;
				$scope.showDayNightToggle = true;

				$scope.toggleDayNight     = setDayNight;

				$scope.$watch('dayActive', _dayNightChanged);

				CesiumjsWidgetService.removeAllMarkers();
				CesiumjsWidgetService.removeAllPolyLines();

				CesiumjsWidgetService.enableSun(false);
				CesiumjsWidgetService.enableMoon(false);
				CesiumjsWidgetService.enableSkyBox(false);
				CesiumjsWidgetService.enableSkyAtmosphere(false);
				CesiumjsWidgetService.setSceneMode(SCENE_MODE.scene3d, false);

				$scope.dayActive = true;

				_flyoverDataProcess(); //loads all the flyovers if needed
			}

			/**
			 *
			 * @private
			 */
			function _destructor() {
				if (_intervalIconRef !== null) {
					$interval.cancel(_intervalIconRef);
					_intervalIconRef = null;
				}

				if (_intervalPathRef !== null) {
					$interval.cancel(_intervalPathRef);
					_intervalPathRef = null;
				}

				CesiumjsWidgetService.removeAllMarkers();
				CesiumjsWidgetService.removeAllPolyLines();
			}

			/**
			 *
			 * @private
			 */
			function _addOrbitalPath() {
				var current = $scope.currentItem,
					path = { start: null, end: null, segments: [], cartesian: [] };

				var clock = { };

				switch(current.type) {
					case 'realTime': {
						clock.startTime = new Date();
						path.startTime = new Date(clock.startTime.getTime()-3000 * 1000);//-25min
						path.endTime   = new Date(clock.startTime.getTime()+3000 * 1000);//+25min
						break;
					}

					case 'static': {
						clock.startTime = current.startTime;
						clock.endTime   = new Date(current.startTime.getTime() + (current.duration * 1000) );

						path.startTime  = new Date(clock.startTime.getTime()-3000 * 1000);//-25min
						path.endTime   = new Date(clock.startTime.getTime()+3000 * 1000);//+25min
						break;
					}

					default: {
						$log.error('FlyoverTouchCtrl: invalid flyover ' + current.id + 'type = ' + current.type);
					}
				}

				path.segments = current.satellite.locateRange(path.startTime, path.endTime, 15);
				$log.debug(path.segments);

				angular.forEach(path.segments, function(point) {
					path.cartesian.push( ((point.lon + 180) % 360) - 180 );
					path.cartesian.push( ((point.lat +  90) % 180) - 90  );
					path.cartesian.push( Math.round(point.alt * 1000) );
				});

				CesiumjsWidgetService.addPolyLine(current.id, path.cartesian, _lineColor, true);
			}

			/**
			 *
			 * @param current
			 * @private
			 */
			function _currentItemChanged(current, previous) {

				$log.debug('FlyoverTouchCtrl: currentItemChanged');

				if (current == null) {
					return;
				}

				var clock = {};

				if (_intervalIconRef !== null) {
					$interval.cancel(_intervalIconRef);
					_intervalIconRef = null;
				}

				if (_intervalPathRef !== null) {
					$interval.cancel(_intervalPathRef);
					_intervalPathRef = null;
				}

				if ( angular.isDefined( (previous || {}).id ) ) {
					CesiumjsWidgetService.removePolyLine(previous.id);
					CesiumjsWidgetService.hideCustomMarker(previous.id);
				}


				if ( !angular.isDefined( (current || {}).id ) ) {
					return;
				}

				CesiumjsWidgetService.showCustomMarker(current.id);

				if (current.type === 'realTime') {
					clock.startTime = new Date();
					clock.currentTime = clock.startTime;
				}
			 	else if (current.type === 'static') {
					clock.startTime = current.startTime;
					clock.currentTime = clock.startTime;
				}
				else {
					$log.error('FlyoverTouchCtrl: invalid flyover ' + current.id + 'type = ' + current.type);
					return;
				}

				// update orbital only to ISSNow
				if (current.type === 'realTime') {
				$rootScope.issResetter = $timeout(function() {
					$log.debug('Restarting after 6 minutes of idle on ISSNow...');
					if(chrome) {
							chrome.runtime.sendMessage({updatePath: BASE_VIEWER_URL + 'photography'}, function(){ });
							$location.path(APP_DEFAULT_ROUTE_PATH);
							//reset the side bar select button in touch panel
							$rootScope.issReset = true;
						}
					}, 360000);
				}
				else{
					// resets counter if navigated out of issnow
					if($rootScope.issResetter) {
						$timeout.cancel($rootScope.issResetter);
						$rootScope.issResetter = undefined;
					}
				}

				$rootScope.showMap = true;
				CesiumjsWidgetService.adjustClock(clock);
				_addOrbitalPath();
				_updateLocation(true);

				_intervalPathRef = $interval(_addOrbitalPath, _intervalPathHertz);
				_intervalIconRef = $interval(_updateLocation, _intervalIconHertz);

				//show cesium
				$rootScope.orbitalPosition = angular.copy(orbitalMapPosition);
				CesiumjsWidgetService.setCameraPosition(orbitalMapPosition.latitude,
						orbitalMapPosition.longitude,
						orbitalMapPosition.altitudeInKM);

				PrimaryViewer.updateViewerLocation(_routerKey, current.id + ($scope.dayActive ? '/day' : '/night') );
			}

			/**
			 *
			 * @param current {boolean}
			 * @param previous {boolean}
			 */
			function _dayNightChanged(current, previous) {
				if (!angular.isDefined(current) || current === previous ) {
					return;
				}
				var map = $scope.dayActive ? 'day' : 'night';

				CesiumjsWidgetService.enableSun(current);

				PrimaryViewer.updateViewerLocation(_routerKey, $scope.currentItem.id + '/' + map);
			}

			/**
			 *
			 * @private
			 */
			function _flyoverDataProcess() {
				$log.debug('FlyoverTouchCtrl: FlyoverService Load Detected');
				$scope.itemList = [];

				$q.all([FlyoverService.getDefault(),
					FlyoverService.getAllFlyovers()])
					.then(function(results) {
						_defaultId = results[0];
						$scope.itemList = results[1];

						angular.forEach($scope.itemList, function(item) {
							CesiumjsWidgetService.addCustomMarker(item.id, item.image, 75, 0.0, 0.0, 0.0, false);
						});

						if (!($scope.currentItem).id) {
							chooseItem(_defaultId);
						}
					});
			}

			/**
			 *
			 * @param location
			 * @param units
			 * @private
			 */
			function _locationProcessToOrbitalPosition(location, units) {
				var position = angular.copy(orbitalMapPosition);

				switch(units) {
					case orbitalMapUnits.kilometers: {
						position.altitude = Math.round(location.alt * 100) / 100;
						position.velocity = Math.round((location.theta * 3600) * 100 ) / 100; //convert to kilometers/hour
						break;
					}

					case orbitalMapUnits.miles: {
						position.altitude = Math.round(location.alt * 62.14) / 100;
						position.velocity = Math.round((location.theta*3.6)*62140) / 100;//meters/sec to converted to miles/hour
						break;
					}
					default:
						$log.error('FlyoverTouchCtrl: _locationProcessToOrbitalPosition');
						return $rootScope.orbitalPosition;
				}

				position.units = units;
				position.latitude  = location.lat;
				position.longitude = location.lon > 180 ? -1 * (360-location.lon) : location.lon;

				return position;
			}

			/**
			 *
			 * @param animate
			 * @private
			 */
			function _updateLocation(animate) {

				CesiumjsWidgetService.getCurrentTime().then(function(currentTime) {
					var current       = $scope.currentItem,
						units         = angular.copy($rootScope.orbitalPosition.units);
					//check if end time has arrived
					if(current.endTime && currentTime.getTime() > current.endTime.getTime() ) {
						CesiumjsWidgetService.adjustClock({
							startTime: current.startTime,
							currentTime: current.startTime
							//endTime: _currentItem.endTime
						});
						return;
					}


					var location     = current.satellite.locate(currentTime),
						position     = _locationProcessToOrbitalPosition( location, units),
						altitudeInKM = location.alt * 1000;

					$rootScope.orbitalPosition = position;
					CesiumjsWidgetService.moveCustomMarker(
						current.id,
						position.latitude,
						position.longitude,
						altitudeInKM);
					CesiumjsWidgetService.setCameraPosition(
						Math.min(Math.max(position.latitude,  _clamps.lat.min), _clamps.lat.max),
						Math.min(Math.max(position.longitude, _clamps.lon.min), _clamps.lon.max),
						altitudeInKM * 25,
						animate === true);
				}, function(error){
					$log.debug('error:', error);
				});
			}

			/**
			 *
			 * @param itemId {string}
			 */
			function chooseItem(itemId) {
				$log.debug('FlyoverTouchCtrl: chooseItem = ' + itemId);

				$scope.currentItem = $filter('filter')($scope.itemList, function (i) {
					return i.id === itemId;
				})[0] || {};
			}

			/**
			 *
			 * @param itemId
			 * @returns {boolean}
			 */
			function isActive(itemId){
				return itemId === $scope.currentItem.id;
			}

			/**
			 *
			 * @param isDay {boolean}
			 */
			function setDayNight(isDay) {
				$scope.dayActive = !!isDay;
			}
			_init();
		}])

	//.config(['$routeProvider', 'VIEWS_DIR',
	//	function ($routeProvider, VIEWS_DIR) {
	//		$routeProvider.when('/touch/flyover/', {
	//				templateUrl: VIEWS_DIR + 'gallerywithmap.html',
	//				controller: 'FlyoverTouchCtrl'
	//			});
	//	}
	//])
;

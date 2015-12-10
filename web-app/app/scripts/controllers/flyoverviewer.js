'use strict';

/**
 * @ngdoc function
 * @name museumOfFlightApp.controller:FlyoverViewerCtrl
 * @description
 * # FlyoverViewerCtrl
 * Controller of the museumOfFlightApp
 */
angular.module('museumOfFlightApp')
	.controller('FlyoverViewerCtrl', [
		'$rootScope', '$scope', '$timeout', '$routeParams', '$interval', '$log',
		'FlyoverService', 'CesiumjsWidgetService',
		function ($rootScope, $scope, $timeout, $routeParams, $interval, $log,
		          FlyoverService, CesiumjsWidgetService) {

			var _animationFrames    = 10,
				_animationLocations = [],
				_animationLocationsIntervalHertz = 5000,
				_animationLocationsIntervalRef,
				_viewConfig = { bearing: 0, tilt: 35, roll: 0};

			/**
			 *
			 * @param flyover {{}}
			 * @private
			 */
			function _initWithFlyover(flyover) {
				$log.debug('FlyoverViewerCtrl: init flyover finished');
				$scope.currentItem = flyover || null;
				$scope.isDay = ($routeParams['dayNight'] || '').toLowerCase() !== 'night';
				$scope.isAnimation = (flyover.id === 'seattle' ||
					flyover.id === 'nile' ||
					flyover.id === 'asiaEast' ||
					flyover.id === 'asiaCentral');

				switch ( $scope.currentItem.media.type ) {
					case 'mp4': //Fall Through
					case 'mov':
						$rootScope.showMap = false;
						break;

					case 'cesium':
						var clock = {};
						clock.startTime   = flyover.type === 'static' ? flyover.startTime : new Date();
						clock.currentTime = clock.startTime;
						clock.endTime     = flyover.endTime;

						$rootScope.showMap = true;
						CesiumjsWidgetService.adjustClock(clock);
						CesiumjsWidgetService.enableSun(false);
						CesiumjsWidgetService.enableMoon(false);
						CesiumjsWidgetService.enableSkyBox(true);
						CesiumjsWidgetService.enableSkyAtmosphere(false);

						CesiumjsWidgetService.setActiveLayer($scope.isDay ? 'day' : 'night');
						CesiumjsWidgetService.getCurrentTime().then(_updateAnimationLocations);

						_animationLocationsIntervalRef = $interval(function() {
							CesiumjsWidgetService.getCurrentTime().then(_updateAnimationLocations);
						}, _animationLocationsIntervalHertz);

						//Start the animation engine and hope!!!
						CesiumjsWidgetService.whenReady(function() {
							CesiumjsWidgetService.animationMethod = _doAnimationFrame;
							CesiumjsWidgetService.tick();
						});
						break;

					default:
						$log.error('FlyoverViewerCtrl: unknown media type.');
						throw 'unknown media type.';

				}
			}

			/**
			 *
			 * @param currentTime {Date}
			 * @private
			 */
			function _doAnimationFrame(currentTime) {
				if(!$scope.animationReady) {
					return;
				}

				//check if end time has arrived
				if($scope.currentItem.endTime && currentTime.getTime() > $scope.currentItem.endTime.getTime() ) {

					CesiumjsWidgetService.adjustClock({
						startTime: $scope.currentItem.startTime,
						currentTime: $scope.currentItem.startTime
					});
				}

				var percentTime = (currentTime.getTime() % 1000 ) / 1000,
					index       = Math.floor( currentTime.getTime() / 1000 ) % _animationFrames,
					indexNext   = (index+1) % _animationFrames,
					baseFrame   = _animationLocations[ index ],
					nextFrame   = _animationLocations[ indexNext ],
					bearing     = baseFrame.bearing;

				var nowPoint = baseFrame.latLon.destinationPoint( bearing, baseFrame.kmPerSec * percentTime),
					nowAlt   = baseFrame.geodetic.alt + (nextFrame.geodetic.alt - baseFrame.geodetic.alt) * percentTime;

				CesiumjsWidgetService._setCameraPosition(nowPoint.lat(), nowPoint.lon(), nowAlt * 300, false);

				//adjust bearing for active window
				var relativeBearing = (bearing + _viewConfig.bearing) % 360;
				CesiumjsWidgetService._adjustCamera('twistRight', relativeBearing);
				CesiumjsWidgetService._adjustCamera('tilt', _viewConfig.tilt);
				CesiumjsWidgetService._adjustCamera('roll', _viewConfig.roll);
			}

			/**
			 *
			 * @param currentTime {Date}
			 * @private
			 */
			function _updateAnimationLocations(currentTime) {
				$log.debug('FlyoverViewerCtrl: ' + $scope.currentItem.id + ' for ' + currentTime.toUTCString());

				if (!angular.isDefined($scope.currentItem)) {
					return;
				}

				var lat, lon, here, there, index, startTime, endTime, locations;

				//drop milliseconds
				startTime  = new Date( Math.floor( currentTime.getTime() / 1000 ) * 1000);

				//end however many seconds as there are frames the plus 1 for bearings
				endTime    = new Date( startTime.getTime() + ((_animationFrames+1) * 1000) );

				//my seconds based index
				index      = Math.floor( startTime.getTime() / 1000 ) % _animationFrames;

				locations  = $scope.currentItem.satellite.locateRange(startTime, endTime, 1);

				for (var i = 0; i < _animationFrames; i++ ) {
					lat = locations[i].lat;
					lon = locations[i].lon > 180 ? -1 * (360-locations[i].lon) : locations[i].lon;
					here = new LatLon( lat, lon );

					lat = locations[i+1].lat;
					lon = locations[i+1].lon > 180 ? -1 * (360-locations[i+1].lon) : locations[i+1].lon;
					there = new LatLon( lat, lon );

					_animationLocations[index++] = {
						geodetic: locations[i],
						latLon: here,
						bearing: here.finalBearingTo( there ),
						kmPerSec: here.distanceTo( there ) //at ground level
					};
					index = index % _animationFrames;
				}
				$scope.animationReady = true;
				$log.debug('FlyoverViewerCtrl: finished generating locations for animating');
				//$log.debug(_animationLocations);
			}

			$scope.$on('$destroy', function() {
				CesiumjsWidgetService.setFullScreen(false);
				if (_animationLocationsIntervalRef) {
					$interval.cancel(_animationLocationsIntervalRef);
					_animationLocationsIntervalRef = null;
				}
				$log.debug('FlyoverViewerCtrl: I SHOULD DESTROY ALL THE BEAUTIFUL THINGS');
			});

			$scope.animationReady = false;
			$scope.currentItem = null;
			$scope.routeParams = $routeParams;
			$rootScope.showMap = false;
			FlyoverService.getFlyover($routeParams['flyoverName']).then(_initWithFlyover);
		}
	])
;

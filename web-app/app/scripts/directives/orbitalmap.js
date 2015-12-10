'use strict';

/**
 * @ngdoc directive
 * @name museumOfFlightApp.directive:orbitalMap
 * @description
 * # orbitalMap
 */
angular.module('museumOfFlightApp')
	.constant('orbitalMapConfig',   {
		showGauges:       true,
		units:           'miles',
		velocityGauge:   { min: 16900, max: 17300, segments: 5, inverted: false },
		altitudeGauge:   { min:   210, max:   270, segments: 5, inverted: false },
		latitudeGauge:   { min:   -90, max:    90, segments: 5, inverted: false },
		longitudeGauge:  { min:  -180, max:   180, segments: 5, inverted: true }
	})
	.constant('orbitalMapUnits', {
		miles: 'miles',
		kilometers: 'km'
	})
	.constant('orbitalMapPosition', {
		units:     'miles', // orbitalMapUnits
		velocity:  17125,
		altitude:    225,
		latitude:      0,
		longitude:     0
	})

	.controller('OrbitalMapCtrl', [
		'$scope', '$rootScope', '$attrs', '$parse', '$log',
		'orbitalMapConfig', 'orbitalMapPosition', 'orbitalMapUnits',
	function($scope, $rootScope, $attrs, $parse, $log,
			 orbitalMapConfig, orbitalMapPosition, orbitalMapUnits) {

		var _element;

		/**
		 *
		 * @param attribute
		 */
		function _calculateMinMaxList(attribute) {
			try {
				var segments = attribute.segments || 5,
					min         = Math.min( attribute.min, attribute.max ),
					max         = Math.max( attribute.min, attribute.max ),
					range       = Math.abs( min - max),
					incrementer = range / (segments-1);

				attribute.scalor = 100 / range;
				attribute.segments = [];
				attribute.range = range;
				attribute.inverted = !!attribute.inverted;

				for (var i = 0; i < segments; i++) {
					attribute.segments[ attribute.inverted ? 'push' : 'unshift' ](Math.round(min + (i*incrementer) ));
				}

			} catch(e) {
				$log.error(e.message);
			}
		}

		/**
		 ** @param gaugeId
		 * @returns {string|number}
		 */
		function getMarkerPosition(gaugeId) {
			$log.debug('OrbitalMapCtrl: getMarkerPosition');
			var searchProp;
			var isLatLong = false;
			switch (gaugeId) {
				case 'latitude':{
					//vertical gauges
					searchProp = 'offsetHeight';
					isLatLong = true;
					break;
				}
				case 'altitude':
				case 'velocity': {
					//vertical gauges
					searchProp = 'offsetHeight';
					break;
				}

				case 'longitude': {
					//horizontal gauges
					searchProp = 'offsetWidth';
					isLatLong = true;
					break;
				}

				default: {
					$log.error('OrbitalMapCtrl: getMarkerPosition invalid gaugeId '+ gaugeId);
					return '50%';
				}
			}

			var gauge           = _element.find( '.' + gaugeId + '-display'),
				currentValue    = $scope.position[gaugeId],
				gaugeConfig     = $scope[ gaugeId + 'Gauge' ],
				percentOfGauge  = (gaugeConfig.max - currentValue) * gaugeConfig.scalor;

			percentOfGauge  = Math.min(100, Math.max(0, percentOfGauge));
			if(gaugeConfig.inverted) {
				percentOfGauge = 100 - percentOfGauge;
			}
			var chart, marker, ticker, header;

			if (isLatLong) {
				chart  = (gauge.find('.chart-body').prop(searchProp) || 0);
				marker = (gauge.find('.marker').prop(searchProp) || 0) / 2;
				return (chart * (percentOfGauge/100)) - marker;

			} else {
				ticker = (gauge.find('.tick').prop(searchProp)   || 0) / 2;
				marker = (gauge.find('.marker').prop(searchProp) || 0) / 2;
				header = (gauge.find('.header').prop(searchProp) || 0) + 1;
				chart  = (gauge.find('.chart-body').prop(searchProp) || 0);

				var start = header + (ticker-marker),
					range = chart - (2*ticker);

				return start + (range * (percentOfGauge/100));
			}
		}

		/**
		 ** @param val - string w/ night or day in it
		 * 	TODO: implement this
		 *  needs to update viewer with day/night and update dayActive boolean variable
		 */
		function toggleDayNight(val){
			$scope.dayActive = val !== 'night';
		}

		/**
		 *
		 * @param element
		 * @private
		 */
		this.init = function _init(element) {
			$log.debug('OrbitalMapCtrl: init');
			var config = orbitalMapConfig;
			_element = element;

			$scope.velocityGauge     = $scope.velocityGauge     || config.velocityGauge;
			$scope.altitudeGauge     = $scope.altitudeGauge     || config.altitudeGauge;
			$scope.latitudeGauge     = $scope.latitudeGauge     || config.latitudeGauge;
			$scope.longitudeGauge    = $scope.longitudeGauge    || config.longitudeGauge;
			$scope.position          = $scope.position          || angular.copy(orbitalMapPosition);
			$scope.showOrbitalGauges = angular.isDefined($scope.showOrbitalGauges) ? !!$scope.showOrbitalGauges : config.showGauges;

			if($attrs.position) {
				$rootScope.$watch($parse($attrs.position), function(value) {
					if(angular.isDefined(value) ) {
						$scope.position.units     = orbitalMapUnits[value.units] || orbitalMapPosition.units;
						$scope.position.velocity  = parseFloat(value.velocity)   || orbitalMapPosition.velocity;
						$scope.position.altitude  = parseFloat(value.altitude)   || orbitalMapPosition.altitude;
						$scope.position.latitude  = parseFloat(value.latitude)   || orbitalMapPosition.latitude;
						$scope.position.longitude = parseFloat(value.longitude)  || orbitalMapPosition.longitude;
					}
				});
			}

			if($attrs.showOrbitalGauges) {
				$rootScope.$watch($parse($attrs.showOrbitalGauges), function(value) {
					$scope.showOrbitalGauges = angular.isDefined(value) ? !!value : $scope.showOrbitalGauges;
				});
			}

			if($attrs.velocityGauge) {
				$rootScope.$watch($parse($attrs.velocityGauge), function(value) {
					$scope.velocityGauge.min = angular.isDefined(value.min) && angular.isNumber(value.min) ? value.min : $scope.velocityGauge.min;
					$scope.velocityGauge.max = angular.isDefined(value.max) && angular.isNumber(value.max) ? value.max : $scope.velocityGauge.min;
					$scope.velocityGauge.segments = angular.isNumber(value.segments) ? value.segments : config.velocityGauge.segments;
					_calculateMinMaxList($scope.velocityGauge);
				});
			}
			_calculateMinMaxList($scope.velocityGauge);

			if($attrs.altitudeGauge) {
				$rootScope.$watch($parse($attrs.altitudeGauge), function(value) {
					$scope.altitudeGauge.min = angular.isDefined(value.min) && angular.isNumber(value.min) ? value.min : config.altitudeGauge.min;
					$scope.altitudeGauge.max = angular.isDefined(value.max) && angular.isNumber(value.max) ? value.max : config.altitudeGauge.max;
					$scope.altitudeGauge.segments = angular.isNumber(value.segments) ? value.segments : config.altitudeGauge.segments;
					_calculateMinMaxList($scope.altitudeGauge);
				});
			}
			_calculateMinMaxList($scope.altitudeGauge);

			if($attrs.latitudeGauge) {
				$rootScope.$watch($parse($attrs.latitudeGauge), function(value) {
					$scope.latitudeGauge.min = angular.isDefined(value.min) && angular.isNumber(value.min) ? value.min : config.latitudeGauge.min;
					$scope.latitudeGauge.max = angular.isDefined(value.max) && angular.isNumber(value.max) ? value.max : config.latitudeGauge.max;
					$scope.latitudeGauge.segments = angular.isNumber(value.segments) ? value.segments : config.latitudeGauge.segments;
					_calculateMinMaxList($scope.latitudeGauge);
				});
			}
			_calculateMinMaxList($scope.latitudeGauge);

			if($attrs.longitudeGauge) {
				$rootScope.$watch($parse($attrs.longitudeGauge), function(value) {
					$scope.longitudeGauge.min = angular.isDefined(value.min) && angular.isNumber(value.min) ? value.min : config.longitudeGauge.min;
					$scope.longitudeGauge.max = angular.isDefined(value.max) && angular.isNumber(value.max) ? value.max : config.longitudeGauge.max;
					$scope.longitudeGauge.segments = angular.isNumber(value.segments) ? value.segments : config.longitudeGauge.segments;
					_calculateMinMaxList($scope.longitudeGauge);
				});
			}
			_calculateMinMaxList($scope.longitudeGauge);
		};
		$scope.dayActive = false;
		$scope.toggleDayNight = toggleDayNight;
		$scope.getMarkerPosition = getMarkerPosition;
	}])

	.directive('orbitalMap', [
		'$rootScope', 'VIEWS_DIR',
		function ($rootScope, VIEWS_DIR) {
			return {
				restrict: 'E',
				scope: {
					velocityGauge:     '=?',
					altitudeGauge:     '=?',
					latitudeGauge:     '=?',
					longitudeGauge:    '=?',
					position:          '=?',
					showOrbitalGauges: '=?',
					showDayNightToggle:'=?'
				},
				controller: 'OrbitalMapCtrl',
				templateUrl: VIEWS_DIR + 'orbitalmap.html',
				replace: true,
				transclude: true,
				link: function(scope, element, attrs, orbitalMapCtrl) {
					// Setup configuration parameters
					orbitalMapCtrl.init(element);
				}
			};
		}
	]);

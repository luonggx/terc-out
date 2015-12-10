'use strict';

/**
 * @ngdoc service
 * @name museumOfFlightApp.GeodeticService
 * @description
 * # GeodeticService
 * Factory in the museumOfFlightApp.
 */
angular.module('museumOfFlightApp')
	.factory('GeodeticService', [
		'$log',
		function ($log) {

			function Geodetic() {
				this.lat    = 0.0;
				this.lon    = 0.0;
				this.alt    = 0.0;
				this.theta  = 0.0;
			}

			Geodetic.prototype.constructor = function(o) {
				if(o.class === this.class) {
					this.lat   = o.lat;
					this.lon   = o.lon;
					this.alt   = o.alt;
					this.theta = o.theta;
				}
			};

			Geodetic.prototype.getCartesian3 = function() {
				$log.debug('Geodetic: getCartesian3 [' + this.lat+','+this.lon+','+this.alt+']');
				return Cesium.Cartesian3.fromDegrees(this.lon, this.lat, this.alt);
			};

			Geodetic.prototype.getAsArray = function() {
				$log.debug('Geodetic: getAsArray [' + this.lat+','+this.lon+','+this.alt+']');
				return [this.lon, this.lat, Math.round(this.alt*1000)];
			};

			// Public API here
			return {
				/**
				 *
				 * @param obj {Geodetic|null}
				 * @returns {museumOfFlightApp.GeodeticService.Geodetic}
				 */
				get: function (obj) {
					return new Geodetic(obj);
				}
			};
		}
	]);

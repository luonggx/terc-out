'use strict';

/**
 * @ngdoc service
 * @name museumOfFlightApp.ApplicationTLEService
 * @description
 * # ApplicationTLEService
 * Factory in the museumOfFlightApp.
 */
angular.module('museumOfFlightApp')
	.factory('ApplicationTLEService', [
		'$log', 'PREDICT_APP_FLAGS',
		function ($log, PREDICT_APP_FLAGS) {
		var _ces = Cesium;
		var _math = _ces.Math;
		var minutesPerDay   = 1440;
		var ae              = 1.0;
		var xke             = 7.43669161E-2;
		var twoThirds       = (2/3);
		var ck2             = 5.413079E-4;

		function ApplicationTLE() {
			this.name      = '';
			this.epoch     = 0;
			this.xndt2o    = 0;
			this.xndd6o    = 0;
			this.bstar     = 0;
			this.xincl     = 0;
			this.xnodeo    = 0;
			this.eo        = 0;
			this.omegao    = 0;
			this.xmo       = 0;
			this.xno       = 0;
			this.catnr     = 0;
			this.elset     = 0;
			this.revnum    = 0;
			this.idesg     = '';
		}

		/**
		 *
		 * @param flagCallback {function|null}
		 */
		ApplicationTLE.prototype.selectEphemeris = function (flagCallback) {
			// Selects the appropriate ephemeris type to be used //
			// for predictions according to the data in the TLE  //
			// It also processes values in the tle set so that   //
			// they are appropriate for the sgp4/sdp4 routines   //

			var ao, xnodp, dd1, dd2, delo, temp, a1, del1, r1;

			// Preprocess tle set
			this.xnodeo = _math.toRadians(this.xnodeo);
			this.omegao = _math.toRadians(this.omegao);
			this.xmo    = _math.toRadians(this.xmo);
			this.xincl  = _math.toRadians(this.xincl);

			temp = _math.TWO_PI / minutesPerDay / minutesPerDay;
			this.xno = this.xno * temp * minutesPerDay;
			this.xndt2o = this.xndt2o * temp;
			this.xndd6o = this.xndd6o * temp / minutesPerDay;
			this.bstar /= ae;

			// Period > 225 minutes is deep space
			dd1 = (xke / this.xno);
			dd2 = twoThirds;
			a1 = Math.pow(dd1, dd2);
			r1 = Math.cos(this.xincl);
			dd1 = (1.0 - this.eo * this.eo);
			temp = ck2 * 1.5 * (r1 * r1 * 3.0 - 1.0) / Math.pow(dd1, 1.5);
			del1 = temp / (a1 * a1);
			ao = a1 * (1.0 - del1 * (twoThirds * 0.5 + del1 * (del1 * 1.654320987654321 + 1.0) ) );
			delo = temp / (ao * ao);
			xnodp = this.xno / (delo + 1.0);

			// Select a deep-space/near-earth ephemeris
			if (angular.isFunction(flagCallback)) {
				flagCallback(
					_math.TWO_PI / xnodp / minutesPerDay >= 0.15625 ? 'set' : 'clear',
					PREDICT_APP_FLAGS.DEEP_SPACE_EPHEM_FLAG
				);
			}
		};

		return {
			get: function () {
				return new ApplicationTLE();
			}
		};
	}])
;

'use strict';

/**
 * @ngdoc service
 * @name museumOfFlightApp.TwoLineElementService
 * @description
 * # TwoLineElementService
 * Factory in the museumOfFlightApp.
 */
angular.module('museumOfFlightApp')
	.factory('TwoLineElementService', [
		function () {
			function TwoLineElement() {
				this._tleString = '';

				this.name =       '';
				this.catnum =     0;
				this.setnum =     0;
				this.designator = '';
				this.year =       0;
				this.refepoch =   0.0;
				this.incl =       0.0;
				this.raan =       0.0;
				this.eccn =       0.0;
				this.argper =     0.0;
				this.meanan =     0.0;
				this.meanmo =     0.0;
				this.drag =       0.0;
				this.nddot6 =     0.0;
				this.bstar =      0.0;
				this.orbitnum =   0;
			}

			/**
			 *
			 * @param tleString {string}
			 */
			TwoLineElement.prototype.loadTLE = function (tleString) {
				this._tleString = tleString;

				var line = tleString.split('\n'),
					i = 0,
					temp;

				this.name = line.length === 3 ? line[i++] : 'undefined';

				this.catnum = Number(line[i].substring(2,7) );
				this.designator = line[i].substring(9,17);
				this.year = Number(line[i].substring(18,20) );
				this.refepoch = Number(line[i].substring(20,32) );
				this.drag = Number(line[i].substring(33,43) );

				temp = 1.0e-5 * Number(line[i].substring(44,50) );
				this.nddot6 = temp / Math.pow(10.0,(line[i].substring(51, 52)-'0'));

				temp = 1.0e-5 * Number(line[i].substring(53,59) );
				this.bstar = temp / Math.pow(10.0,(line[i].substring(60, 61)-'0') );
				this.setnum = Number(line[i++].substring(64,68) );

				this.incl = Number(line[i].substring(8,16) );
				this.raan = Number(line[i].substring(17,25) );
				this.eccn = 1.0e-07 * Number(line[i].substring(26,33) );
				this.argper = Number(line[i].substring(34,42) );
				this.meanan = Number(line[i].substring(43,51) );
				this.meanmo = Number(line[i].substring(52,63) );
				this.orbitnum = Number(line[i].substring(63,68) );
			};

			TwoLineElement.prototype.class = 'TwoLineElement';

			// Public API here
			return {
				get: function () {
					return new TwoLineElement();
				}
			};
		}
	]);

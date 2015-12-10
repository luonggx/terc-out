'use strict';

/**
 * @ngdoc filter
 * @name museumOfFlightApp.filter:offset
 * @function
 * @description
 * # offset
 * Filter in the museumOfFlightApp.
 */
angular.module('museumOfFlightApp')
	.filter('offset', function () {
		return function(input, start) {
			if(angular.isArray(input)) {
				return input.slice(parseInt(start, 10), input.length);
			}
			return input;
		};
	});

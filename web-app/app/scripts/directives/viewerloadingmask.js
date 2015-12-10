'use strict';

angular.module('museumOfFlightApp')
	.directive('viewerLoadingMask', [
		'$timeout',
		function($timeout) {

			return function(scope, element) {
        var hideLoadingMask = function() {
          element.hide();
        };

        $timeout(hideLoadingMask, 800);
			};

		}]);

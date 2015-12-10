'use strict';

/**
 * @ngdoc directive
 * @name museumOfFlightApp.directive:RightClick
 * @description
 * # RightClick
 */
angular.module('museumOfFlightApp')
	.directive('ngRightClick', [
		'$parse',
		function($parse) {

			return function(scope, element, attrs) {
				var fn = $parse(attrs.ngRightClick);
				element.bind('contextmenu', function(event) {
					scope.$apply(function() {
						event.preventDefault();
						fn(scope, {$event:event});
					});
				});
			};
		}]);

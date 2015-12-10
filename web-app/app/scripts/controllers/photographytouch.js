'use strict';

/**
 * @ngdoc function
 * @name museumOfFlightApp.controller:PhotographyTouchCtrl
 * @description
 * # PhotographyTouchCtrl
 * Controller of the museumOfFlightApp
 */
angular.module('museumOfFlightApp')
	.controller('PhotographyTouchCtrl', [
		'$rootScope', '$scope', '$location', '$timeout', '$log', 'PhotographyService', 'PrimaryViewer', 'BASE_TOUCH_URL',
		function ($rootScope, $scope, $location, $timeout, $log, PhotographyService, PrimaryViewer, BASE_TOUCH_URL) {

			/**
			 *
			 * @param albums
			 * @private
			 */
			function _loadGalleryItems(albums) {
				// make sure orbital is hidden
				$rootScope.showMap = false;

				$log.debug('PhotographyTouchCtrl loadGalleryItems');
				$log.debug(albums);
				angular.forEach(albums, function(album) {
					$scope.itemList.push( {
						title: album.title,
						link:  BASE_TOUCH_URL + PhotographyService.getRouteKey() + '/' + album.id,
						cover: album.cover,
						id:    album.id
					});
				});
			}

			// resets counter if navigated out of issnow
			if($rootScope.issResetter) {
				$timeout.cancel($rootScope.issResetter);
				$rootScope.issResetter = undefined;
			}

			$log.debug('PhotographyTouchCtrl Init');
			$scope.itemList = [];


			PhotographyService.getAlbums().then(_loadGalleryItems);
			PrimaryViewer.updateViewerLocation(PhotographyService.getRouteKey(), null);
		}
	])
;

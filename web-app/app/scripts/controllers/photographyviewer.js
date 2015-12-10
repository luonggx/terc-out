'use strict';

/**
 * @ngdoc function
 * @name museumOfFlightApp.controller:PhotographyViewerCtrl
 * @description
 * # PhotographyViewerCtrl
 * Controller of the museumOfFlightApp
 */
angular.module('museumOfFlightApp')
	.controller('PhotographyViewerCtrl', [
	'$rootScope', '$scope', '$log', '$routeParams', 'PhotographyService',
		function ($rootScope, $scope, $log, $routeParams, PhotographyService) {
			//PRIVATE
			var _albumId 			= $routeParams['album'],
				_imageId			= $routeParams['image'];

			/**
			 *
			 * @param image {{}}
			 * @private
			 */
			function _loadImage(image) {
				$scope.image = {
					title: image.title,
					src: image.filename,
					fileType: image.fileType || '.jpg'
				};
			}

			//PUBLIC
			$rootScope.showMap = false;

			if(_albumId && _imageId) {
				PhotographyService.getPhoto(_albumId, _imageId).then( _loadImage );
			} else {
				PhotographyService.getViewerImage().then( _loadImage);
			}
		}

	])
;

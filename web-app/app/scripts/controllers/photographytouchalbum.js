'use strict';

/**
 * @ngdoc function
 * @name museumOfFlightApp.controller:PhotographytouchalbumCtrl
 * @description
 * # PhotographytouchalbumCtrl
 * Controller of the museumOfFlightApp
 */
angular.module('museumOfFlightApp')
	.controller('PhotographyTouchAlbumCtrl', [
		'$rootScope', '$scope', '$location', '$routeParams', '$filter', '$log',
		'PhotographyService', 'PrimaryViewer',
		function ($rootScope, $scope, $location, $routeParams, $filter, $log,
				  PhotographyService, PrimaryViewer) {

			//Private variables
			var _albumId  = $routeParams['album'],
				_activeId = null;

			/**
			 *
			 * @private
			 */
			function _init() {
				// make sure orbital is hidden
				$rootScope.showMap = false;

				PhotographyService.getAlbumPhotos(_albumId).then(_loadAlbumImages);
			}

			/**
			 *
			 * @param current
			 * @private
			 */
			function _currentItemChanged(current) {
				$log.debug('PhotographyTouchAlbumCtrl: currentItemChanged', current);
			}

			/**
			 *
			 * @private
			 */
			function _loadAlbumImages(images) {
				$log.debug(images);
				$scope.itemList = [];
				_activeId = null;

				angular.forEach(images, function(image) {
					_activeId = _activeId || image.id;
					image.cover = image.thumbnail;
					$scope.itemList.push(image);
				});

				chooseItem(_activeId);
			}

			//PUBLIC FUNCTIONS
			/**
			 *
			 * @param itemId
			 */
			function chooseItem(itemId){
				$log.debug('PhotographyTouchAlbumCtrl: chooseItem ' + itemId);
				_activeId = itemId;

				$scope.currentItem = $filter('filter')($scope.itemList, function (i) {return i.id === itemId;})[0] || {};
				$scope.$parent.currentItem = $scope.currentItem;

				PrimaryViewer.updateViewerLocation(PhotographyService.getRouteKey(), _albumId + '/' + _activeId);
			}

			/**
			 *
			 * @param itemId
			 * @returns {boolean}
			 */
			function isActive(itemId){
				return itemId === _activeId;
			}

			// Variables for Pagination
			$scope.itemList       = [];
			$scope.currentItem    = {};
			$scope.currentPage    = 1;
			$scope.itemsPerPage   = 9;

			$scope.chooseItem     = chooseItem;
			$scope.isActive       = isActive;

			$scope.$watch('currentItem', _currentItemChanged);

			// Variables for Orbital Map //
			$scope.showDayNightToggle = false;

			_init();
		}
	])
;

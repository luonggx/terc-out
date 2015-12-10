'use strict';

/**
 * @ngdoc service
 * @name museumOfFlightApp.PrimaryViewer
 * @description
 * # PrimaryViewer
 * Factory in the museumOfFlightApp.
 */
angular.module('museumOfFlightApp')
	.factory('PrimaryViewer',[
	'$window', '$location', '$log', 'BASE_VIEWER_URL_PATTERN', 'BASE_VIEWER_URL', 'DEBUG_MODE', 'LINK_WINDOWS',
	function ($window, $location, $log, BASE_VIEWER_URL_PATTERN, BASE_VIEWER_URL, DEBUG_MODE, LINK_WINDOWS) {

		var _windowName = 'MoF_PrimaryViewer_';
		var _windowRef = null;

		/**
		 *
		 * @private
		 */
		function _initialize() {
			$log.debug('PrimaryViewer: Init ' + _windowName);
			if( !BASE_VIEWER_URL_PATTERN.test( $location.path() ) ) {
				_windowRef = $window.open(null, _windowName,
					'left=0,top=0,toolbar=0,status=0,scrollbars=0', true);
			}
			$log.debug(_windowRef);
		}

		/**
		 *
		 */
		function closeWindow() {
			_windowRef.close();
			_windowRef = null;
		}

		/**
		 *
		 * @param routeKey
		 * @param key
		 */
		function updateViewerLocation(routeKey, key) {
			var combinedKey = key ? '/' + key : '';
			var path = BASE_VIEWER_URL + routeKey + combinedKey;

			$log.debug('Update Viewer to: ' + path);

			if (chrome) {
				chrome.runtime.sendMessage({updatePath: path}, function(){ });
			}


		}

		if(LINK_WINDOWS) {
			_initialize();
		} else {
			$log.warn('PrimaryViewer: init halted for debugging: change Link Windows to true in constants to enable auto linking');
		}

		// Public API here
		return {
			updateViewerLocation: updateViewerLocation,
			closeViewer: closeWindow
		};
	}
	]);

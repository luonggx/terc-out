'use strict';

/**
 * @ngdoc service
 * @name museumOfFlightApp.MenuItems
 * @description
 * @readonly
 * # MenuItems
 * Service in the museumOfFlightApp.
 * Wrapper for the menu resource
 */
angular.module('museumOfFlightApp')
	.factory('MenuItems',
	function MenuItems($resource,
	                   SERVICES_BASE_PATH, SERVICES_MENU_ITEMS) {

		//Private variables
		var _url = SERVICES_BASE_PATH + SERVICES_MENU_ITEMS;

		/**
		 *
		 * @returns {$promise}
		 * @private
		 */
		function _get() {
			return $resource(_getResourcePath(), {}, {isArray: true})
				.get()
				.$promise;
		}

		/**
		 *
		 * @returns {$promise}
		 * @private
		 */
		function _query() {
			return $resource(_getResourcePath(), {}, {isArray: true})
				.query()
				.$promise;
		}

		/**
		 *
		 * @returns {String}
		 * @private
		 * @description
		 * Includes cache buster for browsers
		 */
		function _getResourcePath() {
			return _url;
		}

		/**
		 *
		 * @returns {String}
		 * @private
		 * @description
		 * raw service url without cache buster
		 */
		function _getResourcePathRaw() {
			return _url;
		}

		//Public API
		return {
			get:    _get,
			query:  _query,
			getResourcePath:    _getResourcePath,
			getResourcePathRaw: _getResourcePathRaw
		};

	});

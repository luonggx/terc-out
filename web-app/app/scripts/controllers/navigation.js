'use strict';

/**
 * @ngdoc function
 * @name museumOfFlightApp.controller:NavigationCtrl
 * @description
 * # NavigationCtrl
 * Controller of the museumOfFlightApp
 */
angular.module('museumOfFlightApp')
	.controller('NavigationCtrl', [
		'$rootScope', '$scope', '$location', '$log', '$route', 'CESIUM_BING_API_KEY', 'IMAGERY_PROVIDER', 'SCENE_MODE', 'DEBUG_MODE',
		'MenuItems', 'PrimaryViewer', 'FlyoverService', 'PhotographyService', 'CesiumjsWidgetService',
		'BASE_TOUCH_URL', 'BASE_VIEWER_URL_PATTERN', 'BASE_TOUCH_BLUE_URL', 'VIEWS_DIR', 'GEO_SERVER_MOF_CONF',
		function ($rootScope, $scope, $location, $log, $route, CESIUM_BING_API_KEY, IMAGERY_PROVIDER, SCENE_MODE, DEBUG_MODE,
				  MenuItems, PrimaryViewer, FlyoverService, PhotographyService, CesiumjsWidgetService,
				  BASE_TOUCH_URL, BASE_VIEWER_URL_PATTERN, BASE_TOUCH_BLUE_URL, VIEWS_DIR, GEO_SERVER_MOF_CONF) {

			//Private variables
			var _routeDefaults = {};

			_routeDefaults[FlyoverService.getRouteKey()]     = FlyoverService.getDefault();
			_routeDefaults[PhotographyService.getRouteKey()] = PhotographyService.getDefault();

			/**
			 * @private
			 */
			function _initialize() {
				$log.debug('Navigation Initializing Started');
				MenuItems.query().then(_loadMenuItems);
				var provider;
				//$scope.showMap = false;
				$rootScope.showMap = false;

				if(!isTouchApp()){
				provider = angular.copy(IMAGERY_PROVIDER.WEB_MAP_SERVICE);
				provider.url = GEO_SERVER_MOF_CONF.url;

				provider.layers = GEO_SERVER_MOF_CONF.layer.night;
				CesiumjsWidgetService.addImageryLayer('night', CesiumjsWidgetService.generateImageryProvider(provider));

				provider.layers = GEO_SERVER_MOF_CONF.layer.day;
				CesiumjsWidgetService.addImageryLayer('day', CesiumjsWidgetService.generateImageryProvider(provider));

				CesiumjsWidgetService.setActiveLayer('day');
				}
				else {
				provider = angular.copy(IMAGERY_PROVIDER.SINGLE_TILE);
				provider.url = BASE_TOUCH_BLUE_URL;
				CesiumjsWidgetService.addImageryLayer('orbitalMap', CesiumjsWidgetService.generateImageryProvider(provider));

				CesiumjsWidgetService.setActiveLayer('orbitalMap');
				}

				CesiumjsWidgetService.enableDebug(DEBUG_MODE);


				//default to day low as shown

				CesiumjsWidgetService.enableDefaultHandlers(false);
				$route.reload();
			}

			/**
			 *
			 * @param menu
			 * @private
			 */
			function _loadMenuItems(menu) {
				$log.debug('MenuItems Fetched');
				$log.debug(menu);
				$scope.menuItems = {};
				for(var i = 0; i < menu.length; i++) {
					var menuSection = menu[i];

					if (menuSection.title === 'primary' || menuSection.title === 'secondary') {
						$scope.menuItems[menuSection.title] = [];
					} else {
						continue;
					}

					for(var j = 0; j < menuSection.items.length; j++) {
						var menuItem = menuSection.items[j];

						//setup menuItems that are for use in the side nav
						$scope.menuItems[menuSection.title].push( {
							title:      menuItem.title,
							icon:       menuItem.icon,
							routeKey:   menuItem.routeKey,
							default:    _routeDefaults[menuItem.routeKey],
							active:     $location.path().indexOf(BASE_TOUCH_URL + menuItem.routeKey) !== -1
						});
					}
				}
			}

			/**
			 *
			 * @returns {String}
			 */
			function getBaseURL() {
				return BASE_TOUCH_URL;
			}

			/**
			 *
			 * @returns {string}
			 */
			function getApplicationContextTemplate() {
				return VIEWS_DIR + (isTouchApp() ? 'touchapplication.html' : 'viewerapplication.html');

			}

			/**
			 *
			 * @param routeKey {String}
			 * @returns {boolean}
			 */
			function isActiveMenuItem(routeKey) {
				return $location.path().indexOf(routeKey) !== -1;
			}

			/**
			 *
			 * @param routeKey
			 * @returns {boolean}
			 */
			function isChildMenu(routeKey) {
				var pattern = new RegExp('^' + BASE_TOUCH_URL + routeKey + '\/(.+)$');
				return  pattern.test( $location.path() );
			}

			/**
			 *
			 * @returns {boolean}
			 * @description
			 * if not the viewer app assume its the touch app
			 */
			function isTouchApp() {
				var path = $location.path() || BASE_TOUCH_URL;
				return !BASE_VIEWER_URL_PATTERN.test(path);
			}

			/**
			 *
			 * @param routeKey
			 */
			function menuItemPressed(routeKey) {
				angular.forEach($scope.menuItems, function(menuSections) {
					angular.forEach(menuSections, function(menuItem) {
						menuItem.active = menuItem.routeKey === routeKey;
					});
				});
			}

			$rootScope.issReset = false;
			$rootScope.$watch('issReset', function(newVal, oldVal){
				if(newVal && newVal !== oldVal) {
					$scope.menuItems.primary[0].active = true;
					$scope.menuItems.primary[1].active = false;
					$rootScope.issReset = false;
				}
			});

			//Public API
			$scope.menuItems = null;

			$scope.getApplicationContextTemplate = getApplicationContextTemplate;
			$scope.getBaseUrl                    = getBaseURL;
			$scope.isActiveMenu                  = isActiveMenuItem;
			$scope.isChildMenu                   = isChildMenu;
			$scope.isTouchApp                    = isTouchApp;
			$scope.menuItemPressed               = menuItemPressed;

			_initialize();

		}])
;

'use strict';

describe('Controller: NavigationCtrl', function () {

	// load the controller's module
	beforeEach(module('museumOfFlightApp'));

	var NavigationCtrl,
		scope,
		route,
		routeKeys,
		location,
		baseTouchPath,
		baseViewerPath;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope, $route, $location,
	                            BASE_TOUCH_URL, BASE_VIEWER_URL) {

		scope           = $rootScope.$new();
		route           = $route;
		routeKeys       = {about: 'about'};
		location        = $location;
		baseTouchPath   = BASE_TOUCH_URL;
		baseViewerPath  = BASE_VIEWER_URL;

		NavigationCtrl  = $controller('NavigationCtrl', {
			$scope: scope
		});

	}));

	it('should exist', function () {
		expect(NavigationCtrl).toBeDefined();
	});

	it('should have a base url', function () {
		expect(scope.getBaseUrl).toBeDefined();
		var baseUrl = scope.getBaseUrl();
		expect(typeof baseUrl).toBe('string');

	});

	it('should detect if a menu item is active', function () {
		expect(scope.isActiveMenu).toBeDefined();

		location.path(baseTouchPath + 'test/foo');
		expect(scope.isActiveMenu('test')).toBe(true);

		location.path(baseTouchPath + 'fail/foo');
		expect(scope.isActiveMenu('test')).toBe(false);
	});

	it('should detect if touch app or viewer', function () {
		expect(scope.isTouchApp).toBeDefined();

		location.path(baseTouchPath + '/test/foo');
		expect(scope.isTouchApp()).toBe(true);

		location.path(baseViewerPath + '/test/foo');
		expect(scope.isTouchApp()).toBe(false);

		location.path('/');
		expect(scope.isTouchApp()).toBe(true);
	});

	it('should set menu items as active when they are selected', function () {
		//TODO: this needs mock data for the menuItems so this can be actually tested
		expect(scope.menuItems).toBeDefined();
		expect(scope.menuItemPressed).toBeDefined();
	});

	it('should contain routes', function () {
		expect(route.routes[baseTouchPath + routeKeys.about]).toBeDefined();
	});
});

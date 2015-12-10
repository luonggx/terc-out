'use strict';

describe('Controller: PhotographyTouchCtrl', function () {

	// load the controller's module
	beforeEach(module('museumOfFlightApp'));

	var PhotographyTouchCtrl,
		scope,
		route,
		routeKey,
		baseTouchPath;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope, $route,
	                            BASE_TOUCH_URL) {

		scope           = $rootScope.$new();
		route           = $route;
		baseTouchPath   = BASE_TOUCH_URL;
		routeKey        = 'photography';

		PhotographyTouchCtrl = $controller('PhotographyTouchCtrl', {
			$scope: scope
		});

	}));

	it('should exist', function () {
		expect(PhotographyTouchCtrl).toBeDefined();
	});

	it('should contain routes', function () {
		expect(route.routes[baseTouchPath + routeKey]).toBeDefined();
	});
});

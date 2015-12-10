'use strict';

describe('Controller: FlyoverTouchCtrl', function () {

	// load the controller's module
	beforeEach(module('museumOfFlightApp'));

	var FlyoverTouchCtrl,
		scope,
		route,
		routeKey,
		baseTouchPath;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope, $route,
	                            BASE_TOUCH_URL) {

		scope               = $rootScope.$new();
		route               = $route;
		routeKey            = 'flyover';
		baseTouchPath       = BASE_TOUCH_URL;

		FlyoverTouchCtrl    = $controller('FlyoverTouchCtrl', {
			$scope: scope
		});

	}));

	it('should exist', function () {
		expect(FlyoverTouchCtrl).toBeDefined();
	});

	it('should contain routes', function () {
		expect(route.routes[baseTouchPath + routeKey]).toBeDefined();
		//expect(route.routes[null].redirectTo).toBe(baseTouchPath + routeKey);
	});

});

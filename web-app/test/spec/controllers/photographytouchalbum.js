'use strict';

describe('Controller: PhotographyTouchAlbumCtrl', function () {


	// load the controller's module
	beforeEach(module('museumOfFlightApp'));

	var PhotographyTouchAlbumCtrl,
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

		PhotographyTouchAlbumCtrl = $controller('PhotographyTouchAlbumCtrl', { $scope: scope });
	}));

	it('should exist', function () {
		expect(PhotographyTouchAlbumCtrl).toBeDefined();
	});

	it('should contain routes', function () {
		expect(route.routes[baseTouchPath + routeKey] + '/:gallery').toBeDefined();
	});
});

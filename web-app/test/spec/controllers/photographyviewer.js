'use strict';

describe('Controller: PhotographyViewerCtrl', function () {

	// load the controller's module
	beforeEach(module('museumOfFlightApp'));

	var PhotographyViewerCtrl,
		scope,
		route,
		routeKey,
		baseViewerPath;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope, $route,
	                            BASE_VIEWER_URL) {

		scope           = $rootScope.$new();
		route           = $route;
		routeKey        = 'photography';
		baseViewerPath  = BASE_VIEWER_URL;

		PhotographyViewerCtrl = $controller('PhotographyViewerCtrl', {
			$scope: scope
		});

	}));

	it('should exist', function () {
		expect(PhotographyViewerCtrl).toBeDefined();
	});

	it('should contain routes', function () {
		expect(route.routes[baseViewerPath + routeKey] + '/:gallery/:image').toBeDefined();
	});
});

'use strict';

describe('Controller: FlyoverViewerCtrl', function () {

	// load the controller's module
	beforeEach(module('museumOfFlightApp'));

	var FlyoverViewerCtrl,
		scope,
		route,
		routeKey,
		baseViewerPath;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope, $route,
	                            BASE_VIEWER_URL) {

		scope               = $rootScope.$new();
		route               = $route;
		routeKey            = 'flyover';
		baseViewerPath      = BASE_VIEWER_URL;

		FlyoverViewerCtrl   = $controller('FlyoverViewerCtrl', {
			$scope: scope
		});

	}));

	it('should exist', function () {
		expect(FlyoverViewerCtrl).toBeDefined();
	});

	it('should contain routes', function () {
		expect(route.routes[baseViewerPath + routeKey] + '/:flyoverName').toBeDefined();
	});

});

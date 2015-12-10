'use strict';

describe('Service: PrimaryViewer', function () {

	// load the service's module
	beforeEach(module('museumOfFlightApp'));

	// instantiate service
	var factory;

	beforeEach(inject(function (PrimaryViewer) {

		factory = PrimaryViewer;

	}));

	it('should exist', function () {
		expect(!!factory).toBe(true);
	});

	// check to see if it has the expected API
	it('should have get, query and getPath methods', function() {
		expect(angular.isFunction(factory.updateViewerLocation)).toBe(true);
	});

});

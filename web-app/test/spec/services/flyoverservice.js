'use strict';

describe('Service: FlyoverService', function () {

	// load the service's module
	beforeEach(module('museumOfFlightApp'));

	// instantiate service
	var factory,
		cache,
		path,
		flyoverPath,
		tlePath;

	beforeEach(inject(function (FlyoverService,
								SERVICES_CACHE_DURATION,
								SERVICES_BASE_PATH, SERVICES_FLYOVERS, SERVICES_FLYOVERS_TLE) {

		factory     = FlyoverService;
		cache       = SERVICES_CACHE_DURATION;
		path        = SERVICES_BASE_PATH;
		flyoverPath = SERVICES_FLYOVERS;
		tlePath     = SERVICES_FLYOVERS_TLE;

	}));

	it('should do something', function () {
		expect(factory).toBeDefined();
	});

	it('should return promise to a routeKey', function() {
		expect(typeof factory.getRouteKey()).toBe('string');
	});

	it('should return the default flyover key', function() {
		expect(typeof factory.getDefault()).toBe('object');
	});

	it('relies on constants to be defined', function() {
		expect(angular.isString(path        )).toBe(true);
		expect(angular.isString(flyoverPath )).toBe(true);
		expect(angular.isString(tlePath     )).toBe(true);
		expect(cache >= 0                    ).toBe(true);
	});

});

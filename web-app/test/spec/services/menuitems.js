'use strict';

describe('Service: MenuItems', function () {

	// load the service's module
	beforeEach(module('museumOfFlightApp'));

	// instantiate service
	var factory,
		rootScope,
		q,
		servicesBasePath,
		servicesMenuItemsPath;

	beforeEach(inject(function (MenuItems,
	                            $rootScope,
	                            $q,
	                            SERVICES_BASE_PATH,
	                            SERVICES_MENU_ITEMS) {

		factory     = MenuItems;
		rootScope   = $rootScope;
		q           = $q;

		servicesBasePath        = SERVICES_BASE_PATH;
		servicesMenuItemsPath   = SERVICES_MENU_ITEMS;

	}));

	// check to see if it has the expected function
	it('should have get, query and getPath methods', function() {
		expect(angular.isFunction(factory.get)).toBe(true);
		expect(angular.isFunction(factory.query)).toBe(true);
		expect(angular.isFunction(factory.getResourcePath)).toBe(true);
	});

	it('should have its path set from the constants', function() {
		var path = factory.getResourcePath();
		expect(path).toBe(servicesBasePath + servicesMenuItemsPath);
	});

	it('should return a promise for fetching data', function () {
		expect(factory.get()  .then).toBeDefined();
		expect(factory.query().then).toBeDefined();
	});

	//check to see if it returns 3 sections, primary, secondary and footer
//	it('should return menuItems from the resource', function() {
//		var data        = null,
//			deferred    = q.defer(),
//			promise     = deferred.promise;
//
//		// set up promise resolve callback
//		promise.then(function (response) {
//			data = response;
//		});
//
//		factory.get().then( function(response) {
//			// resolve our deferred with the response when it returns
//			deferred.resolve(response);
//		});
//
//		// force `$digest` to resolve/reject deferred
//		rootScope.$digest();
//
//		// make your actual test
//		console.log(data);
//
//
//		if(result.length) {
//			expect(data[0].title).toBe('primary');
//			expect(data[1].title).toBe('secondary');
//			expect(data[2].title).toBe('blag');
//		}
//	});

});

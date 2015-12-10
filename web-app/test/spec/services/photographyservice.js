'use strict';

describe('Service: PhotographyService', function () {

	// load the service's module
	beforeEach(module('museumOfFlightApp'));

	// instantiate service
	var factory,
		path,
		galleryPath,
		albumPath;

	beforeEach(inject(function (PhotographyService,
								SERVICES_BASE_PATH, SERVICES_PHOTOGRAPHY_GALLERY, SERVICES_PHOTOGRAPHY_ALBUM) {
		factory     = PhotographyService;
		path        = SERVICES_BASE_PATH;
		galleryPath = SERVICES_PHOTOGRAPHY_GALLERY;
		albumPath   = SERVICES_PHOTOGRAPHY_ALBUM;
	}));

	// check to see if it has the expected function
	it('should have getter methods', function() {
		expect(angular.isFunction(factory.getAlbums      )).toBe(true);
		expect(angular.isFunction(factory.getAlbumPhotos )).toBe(true);
		expect(angular.isFunction(factory.getDefault     )).toBe(true);
		expect(angular.isFunction(factory.getPhoto       )).toBe(true);
		expect(angular.isFunction(factory.getRouteKey    )).toBe(true);
	});

	it('should implement these events', function() {
		var events = factory.events;

		expect(angular.isString(events.GALLERY_LOADED          )).toBe(true);
		expect(angular.isString(events.GALLERY_DEFAULT_CHANGED )).toBe(true);
	});

	it('relies on constants to be defined', function() {
		expect(angular.isString(path        )).toBe(true);
		expect(angular.isString(galleryPath )).toBe(true);
		expect(angular.isString(albumPath   )).toBe(true);
	});

});

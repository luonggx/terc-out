'use strict';

describe('Filter: offset', function () {

	// load the filter's module
	beforeEach(module('museumOfFlightApp'));

	// initialize a new instance of the filter before each test
	var filter,
		mockData;

	beforeEach(inject(function ($filter) {
		filter = $filter('offset');
		mockData = ['apple', 'orange', 'banana', 'cherry', 'kiwi'];
	}));

	it('should split an array', function () {
		var filtered = filter(mockData, 2);

		expect( filtered.length          ).toBe(3);
		expect( filtered[0]              ).toBe('banana');
		expect( filtered.indexOf('kiwi') ).toBe(2);
	});

	it('should default to do nothing if an invalid offset value is received', function() {
		expect( filter(mockData).length         ).toBe(5);
		expect( filter(mockData, 'blah').length ).toBe(5);
		expect( filter(mockData, -123).length   ).toBe(5);
	});

	it('should not modify non array type variables', function() {
		var object = {foo:'bar', blue:'moon'};
		expect( filter('Fuzzy Wuzzy', 2) ).toBe('Fuzzy Wuzzy');
		expect( filter(2345, 2)          ).toBe(2345);
		expect( filter(object, 1).foo    ).toBe('bar');
		expect( filter(object, 1).blue   ).toBe('moon');
	});


});

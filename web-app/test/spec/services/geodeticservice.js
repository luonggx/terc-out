'use strict';

describe('Service: GeodeticService', function () {

  // load the service's module
  beforeEach(module('museumOfFlightApp'));

  // instantiate service
  var GeodeticService;
  beforeEach(inject(function (_GeodeticService_) {
    GeodeticService = _GeodeticService_;
  }));

  it('should do something', function () {
    expect(!!GeodeticService).toBe(true);
  });

});

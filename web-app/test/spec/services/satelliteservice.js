'use strict';

describe('Service: SatelliteService', function () {

  // load the service's module
  beforeEach(module('museumOfFlightApp'));

  // instantiate service
  var SatelliteService;
  beforeEach(inject(function (_SatelliteService_) {
    SatelliteService = _SatelliteService_;
  }));

  it('should do something', function () {
    expect(!!SatelliteService).toBe(true);
  });

});

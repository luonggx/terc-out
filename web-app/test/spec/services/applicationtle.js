'use strict';

describe('Service: ApplicationTLE', function () {

  // load the service's module
  beforeEach(module('museumOfFlightApp'));

  // instantiate service
  var ApplicationTLE;
  beforeEach(inject(function (_ApplicationTLE_) {
    ApplicationTLE = _ApplicationTLE_;
  }));

  it('should do something', function () {
    expect(!!ApplicationTLE).toBe(true);
  });

});

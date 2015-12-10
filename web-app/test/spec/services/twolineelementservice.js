'use strict';

describe('Service: TwoLineElementService', function () {

  // load the service's module
  beforeEach(module('museumOfFlightApp'));

  // instantiate service
  var TwoLineElementService;
  beforeEach(inject(function (_TwoLineElementService_) {
    TwoLineElementService = _TwoLineElementService_;
  }));

  it('should do something', function () {
    expect(!!TwoLineElementService).toBe(true);
  });

});

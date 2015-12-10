'use strict';

describe('Directive: orbitalMap', function () {

  // load the directive's module
  beforeEach(module('museumOfFlightApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<orbital-map></orbital-map>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the orbitalMap directive');
  }));
});

'use strict';

describe('Controller: TouchmapCtrl', function () {

  // load the controller's module
  beforeEach(module('museumOfFlightApp'));

  var TouchmapCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TouchmapCtrl = $controller('TouchmapCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

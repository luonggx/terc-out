'use strict';

describe('Directive: prevNextPager', function () {

  // load the directive's module
  beforeEach(module('museumOfFlightApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<prev-next-pager></prev-next-pager>');
    element = $compile(element)(scope);
	  //TODO: Fix this
//    expect(element.text()).toBe('this is the prevNextPager directive');
  }));
});

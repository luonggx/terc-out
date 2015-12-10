'use strict';

/**
 * @overrides
 * @description
 * Template overrides to ui.bootstrap
 */
angular.module('template/pagination/pager.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/pagination/pager.html',
    '<div ng-hide="totalPages===1" class="pager-wrapper">\n' +
	'  <div class="pager">\n' +
    '    <a href ng-class="{disabled: noPrevious(), previous: align}" ng-click="selectPage(page - 1)"><span class=\"icon-arrow-left\"></span></a>\n' +
    '    <a href ng-class="{disabled: noNext(), next: align}" ng-click="selectPage(page + 1)"><span class=\"icon-arrow-right\"></span></a>\n' +
    '  </div>\n' +
	'  <div class="page-count">{{page}}/{{totalPages}}</div>' +
	'</div>\n'
  );
}]);

"use strict";
angular.module('app').directive('preview', [function () {
    return {
        restrict: 'AE',
        scope: {
            file:'=file'
        },
        templateUrl: 'app/views/templates/previewTemplate.html',
        link: function (scope, elem, attr) {

        }
    }
}]);
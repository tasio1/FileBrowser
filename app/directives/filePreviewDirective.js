"use strict";
angular.module('app').directive('preview', [function () {
    return {
        restrict: 'AE',
        scope: {
            file:'=file'
        },
        controller: 'FilePreviewController',
        templateUrl: 'app/views/templates/previewTemplate.html',
        link: function (scope, elem, attr) {

        }
    }
}]);
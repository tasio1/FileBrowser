"use strict";
angular.module('app').controller('FilePreviewController', ['$scope', '$location', 'filesService', 'dialogsService', function ($scope, $location, filesService, dialogsService) {

    var init = function () {
        var path = decodeURIComponent($location.search().path);
        filesService.list(path).then(function (data) {
            $scope.file = data[0];
            $scope.backLink = filesService.getBackLink(path);
        });
    }

    $scope.rename = function (file) {
        return dialogsService.rename(file.name).then(function (updatedFile) {
            file.clearName = updatedFile.clearName;
            file.name = updatedFile.name;
        });
    }

    init();

}]);
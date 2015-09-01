"use strict";
angular.module('app').controller('FilesBrowserController', ['$scope', '$rootScope', '$http', '$location', 'filesService', 'dialogsService', function ($scope, $rootScope, $http, $location, filesService, dialogsService) {

    var locationParams = $location.search();
    $scope.sortType = (locationParams.sortBy) ? locationParams.sortBy : 'name';
    $scope.pathURI = (locationParams.path) ? decodeURIComponent(locationParams.path) : '/';
    $scope.backLink = $scope.pathURI;

    var init = function () {
        filesService.list($scope.pathURI).then(function (data) {
            $scope.files = data;
            $scope.backLink = filesService.getBackLink($scope.pathURI);
        }, function (error) {
            dialogsService.alert(error.message).then(function (response) {
                $location.search('path', $scope.backLink);
            });
        });
    }

    $scope.rename = function (file) {
        return dialogsService.rename(file.name).then(function (updatedFile) {
            file.clearName = updatedFile.clearName;
            file.name = updatedFile.name;
        });
    }

    $scope.goToPreviewPage = function (path) {
        $location.path('/preview').search({ path: encodeURIComponent(path) });;
    }

    $scope.toggleSort = function (type) {
        $location.search('sortBy', type);
    }

    $scope.changeDirectory = function (path) {
        $location.search('path', encodeURIComponent(path));
    }

    $rootScope.$on('$locationChangeSuccess', function (event, newUrl, oldUrl) {
        var params = $location.search();

        if (!params.sortBy) {
            $scope.toggleSort($scope.sortType);
        }

        if (!params.path) {
            $scope.changeDirectory('/');
        }

        if ($scope.sortType !== params.sortBy) {
            $scope.sortType = params.sortBy;
            filesService.sort($scope.files, $scope.sortType);
        }

        if ($scope.pathURI !== params.path) {
            $scope.pathURI = decodeURIComponent(params.path);
            filesService.list($scope.pathURI).then(function (data) {
                $scope.files = data;
                $scope.backLink = filesService.getBackLink($scope.pathURI);
            }, function (error) {
                dialogsService.alert(error.message).then(function (response) {
                    $location.search('path', $scope.backLink);
                });
            });
        }

    });

    init();

}]);
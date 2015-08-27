"use strict";
angular.module('app').controller('FilesBrowserController', ['$scope', '$rootScope', '$http', '$location', 'filesService', 'dialogsService', function ($scope, $rootScope, $http, $location, filesService, dialogsService) {

    var filesURI = '/api/files';
    var renameURI = '/api/files/rename';
    $scope.sortType = 'name';

    $scope.pathURI = '/';

    var init = function () {
        $location.search('sortBy', $scope.sortType);
        if (!$location.search().path) {
            $location.search('path', encodeURIComponent($scope.pathURI));
        } else {
            $scope.pathURI = $location.search().path;
        }

        $scope.getFilesFromDirectory($scope.pathURI);
    }

    var getBackLink = function () {
        var parts = $scope.pathURI.split('/');
        var link = parts.splice(parts.length - 2, 1);
        link = link.join('/');

        return link;
    }

    var convertSize = function (size, unit) {
        return (size / (1024 * 1024)).toFixed(2) + ' ' + unit;
    }

    var convertFileDetails = function (files) {
        for (var i = 0; i < files.length; i++) {
            var parts = files[i].name.split('/');
            files[i].clearName = parts[parts.length - 1];
            files[i].size = convertSize(files[i].size, 'Mb');
        }

        return files;
    }

    $scope.getFilesFromDirectory = function (path) {
        var directoryURI;

        path = decodeURIComponent(path);
        directoryURI = filesURI + '?path=' + path;
        setURI(path);

        filesService.list(directoryURI).then(function (data) {
            data = convertFileDetails(data);
            $scope.files = filesService.sort(data, $scope.sortType);
            $scope.backLink = getBackLink();
        }, function (error) {
            dialogsService.alert(error);
        });
    }

    $scope.rename = function (file, from, to) {
        var parts = from.split('/');
        var updatedTo;

        parts = parts.splice(0, parts.length - 1);
        parts.push(to);
        updatedTo = parts.join('/');

        filesService.rename(renameURI, from, updatedTo).then(function (updatedFile) {
            file.name = updatedFile.name;
            file.clearName = to;
        }, function (error) {
            dialogsService.alert(error);
            $scope.openPromptWindow(file);
        });
    }

    $scope.openPromptWindow = function (file) {
        var newName = dialogsService.prompt(file);
        if (newName) {
            $scope.rename(file, file.name, newName);
        }
    }

    $scope.sortByType = function (type) {
        $scope.sortType = ($scope.sortType.substr(1) === '-') ? type : ($scope.sortType === type) ? '-' + type : type;
        $scope.files = filesService.sort($scope.files, $scope.sortType);
        $location.search('sortBy', type);
    }

    $scope.goToPreviewPage = function (path) {
        $location.path('/preview').search({ path: encodeURIComponent(path) });;
    }

    var setURI = function (path) {
        $scope.pathURI = path
        path = encodeURIComponent(path);
        $location.search('path', path);
    }

    init();

}]);
"use strict";
angular.module('app').controller('FilePreviewController', ['$scope', '$location', 'filesService', 'dialogsService', function ($scope, $location, filesService, dialogsService) {

    var filesURI = '/api/files';
    var renameURI = '/api/files/rename';
    var fielPath = '';

    var init = function () {
        var path = decodeURIComponent($location.search().path);
        getFileByPath(path);
    }

    var convertSize = function (size, unit) {
        return (size / (1024 * 1024)).toFixed(2) + ' ' + unit;
    }

    var getFileType = function (file) {
        var parts = file.name.split('/');
        var fileParts = parts[parts.length - 1].split('.');
        var type = fileParts[fileParts.length - 1];

        return type;
    }

    var getFileParentDirectory = function (file) {
        var parts = file.name.split('/');

        return parts[parts.length - 2];
    }

    var convertFileDetails = function (file) {
        var parts = file.name.split('/');
        file.clearName = parts[parts.length - 1];
        file.size = convertSize(file.size, 'Mb');
        file.type = getFileType(file);
        file.parentDirectory = getFileParentDirectory(file);
        
        return file;
    }

    var getBackLink = function (file) {
        var parts, link;

        parts = file.name.split('/');
        parts = parts.slice(0, parts.length - 1);
        link = parts.join('/');

        return encodeURIComponent(link);
    }

    var getFileByPath = function (path) {
        var fileURI = filesURI + '?path=' + path;

        filesService.list(fileURI).then(function (data) {
            $scope.file = convertFileDetails(data[0]);
            $scope.backLink = getBackLink($scope.file);
        }, function (error) {
            dialogsService.alert(error);
        });
    }

    var getFullUpdatedName = function (from, to) {
        var parts = from.split('/');
        var updatedTo;
        parts = parts.splice(0, parts.length - 1);
        parts.push(to);
        updatedTo = parts.join('/');

        return updatedTo;
    }

    $scope.openPromptWindow = function (file) {
        var newName = dialogsService.prompt(file);
        if (newName) {
            $scope.rename(file, file.name, newName);
        }
    }

    $scope.rename = function (file, from, to) {
        var updatedTo = getFullUpdatedName(from, to);

        filesService.rename(renameURI, from, updatedTo).then(function (updatedFile) {
            file.name = updatedFile.name;
            file.clearName = to;
        }, function (error) {
            dialogsService.alert(error);
            $scope.openPromptWindow(file);
        });
    }

    init();

}]);
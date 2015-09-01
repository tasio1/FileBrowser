"use strict";
angular.module('app').factory('filesService', ['$http', '$q', '$location', function ($http, $q, $location) {
    var filesServiceFactory = {};
    var filesURI = '/api/files';
    var renameURI = '/api/files/rename';
    var _locationParams = $location.search();
    var _sortType = (_locationParams.sortBy) ? _locationParams.sortBy : 'name';
    var _pathURI = (_locationParams.path) ? decodeURIComponent(_locationParams.path) : '/';

    var _list = function (path) {
        var uri = filesURI + '?path=' + path;
        return $http.get(uri).then(function (response) {
            if (typeof response.data === 'object') {
                _sort(response.data, _sortType);   
                return _convertFileDetails(response.data);
            } else {
                return $q.reject(response.data);
            }
        }, function (response) {
            return $q.reject(response.data);
        });
    }

    var _getBackLink = function (path) {
        var parts = path.split('/');
        var link = parts.splice(parts.length - 2, 1);
        link = link.join('/');

        return link;
    }

    var _getDateDigitsSum = function (number) {
        var numberString = number.toString();
        var result = 0;

        for (var i = 0; i < numberString.length; i++) {
            result += Math.sqrt(parseInt(numberString[i]));
        }

        return result;
    }

    var _getFileType = function (file) {
        var parts = file.name.split('/');
        var fileParts = parts[parts.length - 1].split('.');
        var type = fileParts[fileParts.length - 1];

        return type;
    }

    var _getFileParentDirectory = function (file) {
        var parts = file.name.split('/');
        return parts[parts.length - 2];
    }

    var _convertFileDetails = function (files) {
        for (var i = 0; i < files.length; i++) {
            var parts = files[i].name.split('/');
            files[i].clearName = parts[parts.length - 1];
            files[i].type = _getFileType(files[i]);
            files[i].parentDirectory = _getFileParentDirectory(files[i]);
        }

        return files;
    }

    var _updateURI = function () {
        $location.search('sortBy', _sortType);
    }

    var _convertValuesToSort = function (list) {
        for (var i = 0; i < list.length; i++) {
            list[i].dateDigitsSum = _getDateDigitsSum(list[i].date);
        }

        return list;
    }

    var _sort = function (list, type) {
        var sortOrder = 1,
            convertedList = _convertValuesToSort(list);

        _sortType = type;

        if (_sortType[0] === "-") {
            sortOrder = -1;
            type = type.substr(1);
        }

        convertedList.sort(function (a, b) {
            var result, typeOrder;
            typeOrder = (a[type] === b[type]) ? 0 : (a[type] < b[type] ? -1 : 1);
            result = ((a.directory && b.directory) || (!a.directory && !b.directory)) ? typeOrder * sortOrder : a.directory ? -1 : 1;

            return result;
        });

        _updateURI();
    }

    var _rename = function (from, to) {
        var parts = from.split('/');
        var updatedTo;

        parts = parts.splice(0, parts.length - 1);
        parts.push(to);
        updatedTo = parts.join('/');

        return $http.post(renameURI, { from: from, to: updatedTo }).then(function (response) {
            if (typeof response.data === 'object') {
                var updatedFile = _convertFileDetails([response.data])[0];
                return updatedFile;
            } else {
                return $q.reject(response.data);
            }
        },
         function (response) {
             return $q.reject(response.data);
         });
    }

    filesServiceFactory.list = _list;
    filesServiceFactory.sort = _sort; 
    filesServiceFactory.rename = _rename;
    filesServiceFactory.getBackLink = _getBackLink;

    return filesServiceFactory;
}]);
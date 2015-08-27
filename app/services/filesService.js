"use strict";
angular.module('app').factory('filesService', ['$http', '$q', function ($http, $q) {
    var filesServiceFactory = {};

    var _list = function (uri) {
        return $http.get(uri).then(function (response) {
            if (typeof response.data === 'object') {
                return response.data;
            } else {
                return $q.reject(response.data);
            }
        }, function (response) {
            return $q.reject(response.data);
        });
    }

    var _getDateDigitsSum = function (number) {
        var numberString = number.toString();
        var result = 0;

        for (var i = 0; i < numberString.length; i++) {
            result += Math.sqrt(parseInt(numberString[i]));
        }

        return result;
    }

    var _getValuesToSort = function (a, b, type) {
        var leftValue = a[type];
        var rightValue = b[type];

        if (type === 'date') {
            leftValue = _getDateDigitsSum(leftValue);
            rightValue = _getDateDigitsSum(rightValue);
        }

        return {
            leftValue: leftValue,
            rightValue: rightValue
        }
    }

    var _sort = function (list, type) {
        var sortOrder = 1;

        if (type[0] === "-") {
            sortOrder = -1;
            type = type.substr(1);
        }
        list.sort(function (a, b) {
            var result, typeOrder;
            var values = _getValuesToSort(a, b, type);
            var leftValue = values.leftValue;
            var rightValue = values.rightValue;

            typeOrder = (leftValue === rightValue) ? 0 : (leftValue < rightValue ? -1 : 1);
            result = ((a.directory && b.directory) || (!a.directory && !b.directory)) ? typeOrder * sortOrder : a.directory ? -1 : 1;

            return result;
        });

        return list;
    }

    var _rename = function (uri, from, to) {
        return $http.post(uri, { from: from, to: to }).then(function (response) {
            if (typeof response.data === 'object') {
                return response.data;
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

    return filesServiceFactory;
}]);
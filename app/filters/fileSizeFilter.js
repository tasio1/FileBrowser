"use strict";
angular.module('app').filter('toMB', function () {
    return function (input) {
        return (input / (1024 * 1024)).toFixed(2) + ' ' + 'Mb'
    };
});
"use strict";
angular.module('app').factory('dialogsService', [function () {
    var dialogsServiceFactory = {};

    var _alert = function (data) {
        alert(data.message);
    }

    var _prompt = function (data) {
        return prompt('Rename ' + data.clearName, data.clearName);
    }

    var _confirm = function (data) {
        confirm(data.message);
    }

    dialogsServiceFactory.alert = _alert;
    dialogsServiceFactory.prompt = _prompt;
    dialogsServiceFactory.confirm = _confirm;

    return dialogsServiceFactory;
}]);
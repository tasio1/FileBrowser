"use strict";
angular.module('app').factory('dialogsService', ['$window', '$q', 'filesService', function ($window, $q, filesService) {
    var dialogsServiceFactory = {};

    var _alert = function (message) {
        var defer = $q.defer();
        $window.alert(message);
        defer.resolve();

        return defer.promise;
    }

    var _prompt = function (message) {
        var defer = $q.defer();
        var response = $window.prompt(message);

        if (response === null) {
            defer.reject({ code: 0 });
        } else {
            defer.resolve(response);
        }

        return defer.promise;
    }

    var _rename = function (from) {
        var firstPromptMsg = 'Enter new name for ' + from;
        var existsPromptMsg = 'Choose other name for ' + from;
        var existsSorryMsg = 'Sorry, file already exists';

        function _promptRenaming(msg) {
            var defer = $q.defer();
            return _prompt(msg).then(function (to) {
                defer.resolve();
                return filesService.rename(from, to);
            })
            .catch(function (error) {
                if ('EEXIST' === error.code) {
                    return _alert(existsSorryMsg)
                        .then(function () {
                            return _promptRenaming(existsPromptMsg);
                        });
                }
                defer.reject('Unable to rename file due to unexpected problem');

                return defer.promise;
            });
        }

        return _promptRenaming(firstPromptMsg);
    }

    var _confirm = function (message) {
        var defer = $q.defer();
        var response = $window.confirm(message);
        if (response === null) {
            defer.reject();
        } else {
            defer.resolve(response);
        }

        return defer.promise;
    }

    dialogsServiceFactory.alert = _alert;
    dialogsServiceFactory.prompt = _prompt;
    dialogsServiceFactory.confirm = _confirm;
    dialogsServiceFactory.rename = _rename;

    return dialogsServiceFactory;
}]);
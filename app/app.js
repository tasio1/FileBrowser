"use strict";

angular.module('app', ['httpAPIMock', 'ui.router'])
.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state("home", {
        url: "/home",        
        templateUrl: "app/views/filesTableView.html",
        controller: "FilesBrowserController"
    })
    .state("preview", {
        url: "/preview?path",
        templateUrl: "app/views/filePreviewView.html",
        controller: "FilePreviewController"
    });

    $urlRouterProvider.otherwise('/home');

}]);

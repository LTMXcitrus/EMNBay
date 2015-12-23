/**
 * Created by Matthieu on 09/12/2015.
 */
'use strict';

var app = angular.module('myApp', ['ngResource', 'ngRoute', 'ui.materialize','ngCookies','angularFileUpload']);


app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'hall/Hall.html'
        })
        .when('/items', {
            templateUrl: 'items/items.html'
        })
        .when('/item/:id',{
            templateUrl: 'items/item.html',
            controller: 'itemCtrl'
        })
        .when('/login',{
            templateUrl: 'auth/auth.html',
            controller: 'AuthCtrl'
        })
        .when('/account',{
            templateUrl: 'account/account.html',
            controller: 'accountCtrl'
        })
        .when('/createaccount',{
            templateUrl: 'account/createaccount.html',
            controller: 'createAccountCtrl'
        })
        .when('/myItemsForSale',{
            templateUrl: 'items/itemsForSale.html',
            controller: 'itemsForSale'
        })
        .otherwise({
            redirectTo: '/'
        });
});

/**
 * Created by Matthieu on 09/12/2015.
 */

'use strict';

var baseUrl = "http://localhost:8080";

app.
    controller('navCtrl', ['$scope', 'Auth', function ($scope, Auth) {
        $scope.$on('auth', function (event, args) {
            $scope.user = Auth.getUser();
        });
        $scope.user = Auth.getUser();
        $scope.isConnected = function () {
            return Auth.isConnected();
        };
        $scope.disconnect = function () {
            Auth.disconnect();
        };
    }])
    .controller('itemsList', function ($scope, $resource) {
        var Items = $resource(baseUrl + "/items", {'query': {method: 'GET', isArray: true}});
        Items.query().$promise.then(function (items) {
            $scope.items = items;
        });
        $scope.$on('newItem', function (event, argq) {
            Items.query().$promise.then(function (items) {
                $scope.items = items;
            });
        });
    })
    .controller('itemCtrl', ['$scope', '$routeParams', '$resource', function ($scope, $routeParams, $resource) {
        var Item = $resource(baseUrl + "/item/" + $routeParams.id, {'query': {method: 'GET', isArray: false}});
        Item.get().$promise.then(function (item) {
            $scope.item = item;
        });
    }])
    .controller('itemUpForSale', ['$scope', '$routeParams', '$resource', '$rootScope', 'FileUploader','Auth',
        function ($scope, $routeParams, $resource, $rootScope, FileUploader,Auth) {
            var uploader = new FileUploader();
            uploader.url = '/uploads/itemPicture';
            $scope.uploader = uploader;
            $scope.uploader.onSuccessItem = function () {
                $rootScope.$broadcast('newItem');
            }
            $scope.item = {};
            $scope.updateName = function (item) {
                $scope.item = angular.copy(item);
            }
            $scope.upForSale = function (item) {
                item.user = Auth.getUser().id;
                var Item = $resource(baseUrl + '/item');
                Item.save(item, function (newItem) {
                    var picture = $scope.uploader.queue[0];
                    picture.url = picture.url + '/' + newItem.itemId;
                    picture.upload();
                });
            }
        }])
    .controller('AuthCtrl', ['$scope', '$http', 'Auth', '$rootScope',
        function ($scope, $http, Auth, $rootScope) {
            $scope.user = {};
            $scope.loginError = '';

            $scope.submitLogin = function (user) {
                $http.post(baseUrl + '/whoisit', user)
                    .success(function (user) {
                        if (user.username != 'unknown') {
                            Auth.setUser(user);
                            $rootScope.$broadcast('auth');
                            Materialize.toast('You are logged in!', 4000)
                        }
                        else {
                            Materialize.toast(user.error, 4000);
                        }
                    })
                    .error(function (data) {
                        $scope.loginError = data.loginError;
                    });
            };
        }])
    .controller('accountCtrl', ['$scope', '$http', '$resource',
        function ($scope, $http, $resource) {
            var user = $resource(baseUrl + '/whoisit', {'query': {method: 'GET', isArray: false}});
            user.get().$promise.then(function (user) {
                $scope.user = user;
            })
        }])
    .controller('createAccountCtrl', ['$scope', '$http', 'Auth', '$rootScope',
        function ($scope, $http, Auth, $rootScope) {
            $scope.user = {};

            $scope.createAccount = function (user) {

                if ($scope.password === $scope.password2) {
                    delete user.password2;
                    $http.post(baseUrl + '/createAccount', user)
                        .success(function (user) {
                            if (user.username != 'unknown') {
                                Auth.setUser(user);
                                $rootScope.$broadcast('auth');
                                Materialize.toast('You have successfully created an account', 4000);
                            }
                        })
                        .error(function (data) {
                            if (data) Materialize.toast(data, 4000);
                        })
                }
                else {
                    Materialize.toast('the given password are not identical');
                }
            }
        }])
    .controller('itemsForSale', ['$scope', '$resource', 'Auth',
        function ($scope, $resource,Auth) {
            var Items = $resource(baseUrl + "/myitems/"+Auth.getUser().id, {'query': {method: 'GET', isArray: true}});
            Items.query().$promise.then(function (items) {
                $scope.items = items;
            });
            $scope.$on('newItem', function (event, argq) {
                Items.query().$promise.then(function (items) {
                    $scope.items = items;
                });
            });
        }
    ])
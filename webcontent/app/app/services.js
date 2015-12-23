/**
 * Created by Matthieu on 12/12/2015.
 */


var baseUrl = "http://localhost:8080";


app.service('Auth', ['$cookies', '$http', function ($cookies, $http) {
    return {
        getUser: function () {
            return $cookies.getObject('user');
        },
        setUser: function (newUser) {
            $cookies.putObject('user', newUser);
        },
        isConnected: function () {
            return !!$cookies.getObject('user');
        },
        disconnect: function () {
            $cookies.remove('user');
            $http.get(baseUrl + '/disconnect')
                .success(function(data){
                    Materialize.toast(data, 4000);
                })
                .error(function (data) {
                    Materialize.toast(data, 4000);
                });
        }
    };
}]);

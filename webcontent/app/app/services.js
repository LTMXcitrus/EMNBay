/**
 * Created by Matthieu on 12/12/2015.
 */


var baseUrl = "/ws";


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
        },
        isAdmin: function(){
            var user = $cookies.getObject('user');
            return user && user.username && user.username === 'mattcitron'; //quick workaround, of course it is also checked on server side.
        }
    };
}]);

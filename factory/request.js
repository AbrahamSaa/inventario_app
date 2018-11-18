app.factory('request', function($http) {
    return {
        get: function(url, token) {
            return $http({
                method:"GET",
                url:url,
                headers:{
                    'token':token,
                }
            });
        },
        put: function (url, data, token) {
            return $http({
                method:"PUT",
                url:url,
                data:data,
                headers:{
                    'token':token,
                }
            });
        },
        post: function (url, data, token) {
            return $http({
                method:"POST",
                url:url,
                data:data,
                headers:{
                    'token':token,
                }
            });
        },
        delete: function (url, token) {
            return $http({
                method:"POST",
                url:url,
                headers:{
                    'token':token,
                }
            });
        },
    };
});
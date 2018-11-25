app.factory('request', function($http) {
    return {
        get: function(url, token, companyId) {
            return $http({
                method:"GET",
                url:url,
                headers:{
                    'token':token,
                    'selectedCompany':companyId
                }
            });
        },
        put: function (url, data, token, companyId) {
            return $http({
                method:"PUT",
                url:url,
                data:data,
                headers:{
                    'token':token,
                    'selectedCompany':companyId
                }
            });
        },
        post: function (url, data, token, companyId) {
            return $http({
                method:"POST",
                url:url,
                data:data,
                headers:{
                    'token':token,
                    'selectedCompany':companyId
                }
            });
        },
        delete: function (url, token, companyId) {
            return $http({
                method:"DELETE",
                url:url,
                headers:{
                    'token':token,
                    'selectedCompany':companyId
                }
            });
        },
    };
});
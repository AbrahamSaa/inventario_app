app.controller("loginController", function($scope, request, $location){
	$scope.login = function () {
    	let data = {
    		email:$scope.email,
    		password:$scope.password
    	}

    	request.post(URLAPI+"/login", data, "").then((success)=>{
    		if(success.data.ok){
    			$scope.showMessage(success.message, "success", "left");
    			document.cookie = "token="+success.data.token;
    			window.location.href="/app";
    		}
    	}).catch((e)=>{
			$scope.showMessage(e.data.message, "danger", "left");
    	})

    }

    $scope.register = function(){
    	let data = {
    		email:$scope.emailRegister,
    		password:$scope.passwordRegister,
    		name:$scope.nameRegister,
    		last_name:$scope.lastnameRegister,
    		company_name:$scope.companyRegister,
    		company_dir:$scope.companyRegister
    	}

    	request.post(URLAPI+"/user", data, "").then((success)=>{
    		if(success.data.ok){
    			$scope.showMessage(success.data.message, "success", "left");
    			$scope.email = data.email;
    			$scope.password = data.password;
    		}
    	}).catch((e)=>{
			$scope.showMessage(e.data.message, "danger", "left");
    	});
    }


    $scope.setButtons = function(){
        document.querySelector("#registerBtn").addEventListener("click", ()=>{
            $("#loginForm").toggle(100);
            $("#registerForm").toggle(200);
        });

        document.querySelector("#loginBack").addEventListener("click", ()=>{
            $("#loginForm").toggle(200);
            $("#registerForm").toggle(100);
        })
    }
});
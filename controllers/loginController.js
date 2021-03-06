app.controller("loginController", function($scope, request, $location){
	$scope.login = function () {
    	let data = {
    		email:$scope.email,
    		password:$scope.password
    	}

    	request.post(URLAPI+"/login", data, "").then((success)=>{
    		if(success.data.ok){
                var date = new Date();
                var days = days || 365;
                date.setTime(+ date + (days * 24*60*60*90));
    			document.cookie = "token="+success.data.token+"; expires="+ date.toGMTString()+"; path=/";
    			window.location.href="/app";
    		}
    	}).catch((e)=>{
            console.log(e);
			$scope.showMessage(e.data.message, "danger", "left");
    	});

    }

    $scope.register = function(){
    	let data = {
    		email:$scope.emailRegister,
    		password:$scope.passwordRegister,
    		name:$scope.nameRegister,
    		last_name:$scope.lastnameRegister,
    	}

    	request.post(URLAPI+"/user", data, "").then((success)=>{
            console.log(success)
    		if(success.data.ok){
    			$scope.showMessage(success.data.message, "success", "left");
    			$scope.email = data.email;
    			$scope.password = data.password;
                $scope.login();
    		}
    	}).catch((e)=>{
            console.log(e.data.message);
            console.log(e.data["message"]);
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
    
    $scope.getToken();
});
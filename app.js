var app = angular.module("Manager", ["ngCookies"]); 

app.controller("loginController", function($scope, request) {
    
    $scope.getToken = function(){
    	let token = $scope.getTokenCookie("token");
        console.log(URLAPI);
    	if(token!=""){
    		request.get("/auth", token).then((success)=>{
    			if(success.data.ok)
    				window.location.href="/app";
    			
    		}).catch((e)=>{
    			console.log(e)
    		});
    	}
    }

    $scope.login = function () {
    	let data = {
    		email:$scope.email,
    		password:$scope.password
    	}

    	request.post("/login", data, "").then((success)=>{
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

    	request.post("/user", data, "").then((success)=>{
    		if(success.data.ok){
    			$scope.showMessage(success.data.message, "success", "left");
    			$scope.email = data.email;
    			$scope.password = data.password;
    		}
    	}).catch((e)=>{
			$scope.showMessage(e.data.message, "danger", "left");
    	});
    }

    $scope.showMessage = function(text, type, position){
	    var x = document.getElementById("snackbar");
	    x.innerHtml = text;
	    let pos = "50";
	    switch(position){
	    	case "left":
	    		pos = 10;
	    		break;
	    	case "center":
	    		pos = 50;
	    		break;
	    	case "rigth":
	    		pos = 85;
	    		break;
	    }
	    x.style.left = pos+"%";
	    x.className = "show "+ type;

	    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 4000);
    }

    $scope.getTokenCookie = function(cname){
    	var name = cname + "=";
	    var decodedCookie = decodeURIComponent(document.cookie);
	    var ca = decodedCookie.split(';');
	    for(var i = 0; i <ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0) == ' ') {
	            c = c.substring(1);
	        }
	        if (c.indexOf(name) == 0) {
	            return c.substring(name.length, c.length);
	        }
	    }

	    return "";
    }

    $scope.getToken();
});
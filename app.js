var app = angular.module("Manager", ["ngRoute"]); 

app.controller("mainController", function($scope, request,$location) {
    
    $scope.getToken = function(){
    	let token = $scope.getTokenCookie("token");
    	if(token!=""){
    		request.get(URLAPI+"/auth", token).then((success)=>{
    			if(success.data.ok)
                    if(document.URL.indexOf("app")<0)
    				    $location.path("/app");
    			
    		}).catch((e)=>{
    			console.log(e)
    		});
    	}
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
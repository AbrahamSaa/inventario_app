var app = angular.module("Manager", ["ngRoute"]); 

app.controller("mainController", function($scope, request,$location, $http) {
    
	$scope.companySelected = false;
	$scope.companyId = "";

	$scope.uploadImgCompany = function(companyId, file) {
        let data = {
            image:file
        };

        $http({ 
            headers: {
                'Content-Type': undefined,
                "token":$scope.getTokenCookie("token"),
                "selectedCompany":companyId,
            },
            method  : 'PUT',
            url     : URLAPI+"/upload/companies/"+companyId,
            processData: false,
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("image", file);
                return formData;
            },
            data : $scope.form,
           
        }).then(function(data){
            if(data.data.ok){
            	$scope.getCompanies();
                $scope.showMessage("Se subio con exito la imagen", "success", "left");
            }
        }).catch((e)=>{
        	console.log(e);
        });
        
    };


    $scope.getToken = function(){
    	let token = $scope.getTokenCookie("token");
    	if(token!=""){
    		request.get(URLAPI+"/auth", token).then((success)=>{
    			if(success.data.ok)
                    if(document.URL.indexOf("login")>=0){
    					//window.location.href='/app';
                    }
    			
    		}).catch((e)=>{
    			if(!e.data.ok && document.URL.indexOf("login")<0)
    				console.log("Entre")
    		});
    	}else if(document.URL.indexOf("login")<0){
    		//window.location.href='/login';
    	}
    }

    $scope.showMessage = function(text, type, position){
	    var x = document.getElementById("snackbar");
	    x.innerHTML = text;
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

    $scope.newCompany = function () {
		let company = {
			name: $scope.name,
			dir: $scope.dir,
			img: $scope.img,
			cellphone: $scope.cellphone,
		};

		request.post(URLAPI+"/company", company, $scope.getTokenCookie("token")).then((success)=>{
			if($scope.files!== undefined){
				$scope.uploadImgCompany(success.data.company._id, $scope.files[0]);
			}
    		if (success.data.ok) {
    			$("#newCompany").modal("hide");
    			$scope.showMessage(success.data.message, "success", "left");
    			$scope.getCompanies();
    		}
    	}).catch((e)=>{
			$scope.showMessage(e.data.message, "danger", "left");
    	});
	}

	$scope.getCompanies = function(){
		console.log("entre");
		request.get(URLAPI+"/company", $scope.getTokenCookie("token")).then((success)=>{
			if(success.data.ok){
				$scope.companies = success.data.companies;
			}
		}).catch((e)=>{
			$scope.showMessage(e.data.message, "danger", "left");
		})
	}

	$scope.deleteCompany = function(_id){
		request.delete(URLAPI+"/company/"+_id, $scope.getTokenCookie("token")).then((success)=>{
			console.log(success);
			if(success.data.ok){
				$scope.showMessage(success.data.message, "success", "left");
				$scope.getCompanies();
			}
		}).catch((e)=>{
			$scope.showMessage(e.data.message, "danger", "left");
		})
	}

	$scope.editCompany = function(company){
		$scope.companyId = company._id;
		$scope.nameEdit = company.name;
		$scope.dirEdit = company.dir;
		$scope.cellphoneEdit = parseInt(company.cellphone);
		$("#editCompany").modal("show");
	};


	$scope.editCompanyFun = function(){
		let company = {
			name: $scope.nameEdit,
			dir : $scope.dirEdit,
			cellphone : $scope.cellphoneEdit,
		}

		request.put(URLAPI+"/company/"+ $scope.companyId, company ,$scope.getTokenCookie("token"), $scope.companyId)
			.then((success)=>{
				if($scope.files!== undefined){
					$("#editCompany").modal("hide");
					$scope.uploadImgCompany($scope.companyId, $scope.files[0]);
					$scope.showMessage(success.data.message, "success", "left");
				}
			}).catch((e)=>{
				$scope.showMessage(e.data.message, "danger", "left");
			})
	};

	$scope.setCompany = function(id){

		request.get(URLAPI+/selectCompany/+id, $scope.getTokenCookie("token")).then((success)=>{
			if(success.data.ok){
    			$scope.showMessage(success.data.message, "success", "left");
    			$scope.companySelected = true;
    			localStorage["selectedCompany"]=id;
    			$location.path("/dashboard");
    			$scope.getCompany();
			}
		}).catch((e)=>{
			$scope.showMessage(e.data.message, "danger", "left");
		})
	};

	$scope.getProfile = function(){
		request.get(URLAPI+"/user", $scope.getTokenCookie("token")).then((success)=>{
			if(success.data.ok){
				$scope.userName= success.data.user.name + " " + success.data.user.last_name;
			}
		}).catch((e)=>{
			console.log(e);
		});
	};

	$scope.getCompany = function(){
		if(localStorage["selectedCompany"]!== undefined){
			if(localStorage["selectedCompany"]!=""){
				request.get(URLAPI+"/selectedCompany", $scope.getTokenCookie("token"),localStorage["selectedCompany"])
				.then((success)=>{
					if(success.data.ok){
						$scope.companySelected = true;
						$scope.selectedCompany = success.data.company.name;
					}
				}).catch((e)=>{
					localStorage["selectedCompany"] = "";
					//window.location.href='/app';

				});

			}
		}
	}

	$scope.logout = function(){
    	document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		window.location.reload();
	}

	$scope.setImg = function(company){
		var checkImgElem = setInterval(function(){

		if($("#"+company._id).length > 0 ){
			$("#"+company._id).attr("src", URLAPI+"/img/companies/"+company["_id"]+"/"+company["img"]);
			clearInterval(checkImgElem);
		}

		},1000);
	}

	$scope.uploadedFileApp = function(element) {
        $scope.currentFile = element.files[0];
        var reader = new FileReader();


        reader.onload = function(event) {
            $scope.image_source = event.target.result
            $scope.$apply(function($scope) {
                $scope.files = element.files;
            });
        };
        reader.readAsDataURL(element.files[0]);
    };


	$scope.link = "http://localhost:4200/";


    $scope.getProfile();
    $scope.getCompany();
    $scope.urlapi = URLAPI;

});
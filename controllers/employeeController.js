
app.controller("employeeController", function($scope, request,$location) {

	$scope.addEmployee = function(){
		if(!$scope.editMode){
			let employee = {
				name: $scope.name,
	        	last_name: $scope.last_name,
	        	email: $scope.email,
	        	password: $scope.password,
			}

			request.post(URLAPI+"/employee", employee, $scope.getTokenCookie("token"),localStorage["selectedCompany"])
				.then((success)=>{
					if(success.data.ok){
						$("#newEmployee").modal("hide");
						$scope.showMessage(success.data.message, "success", "left");
						$scope.getEmployees();
					}
				}).catch((e)=>{
					$scope.showMessage(e.data.message, "danger", "left");
				})
		}else{
			$scope.editEmployee();
		}
	}

	$scope.editEmployee = function(){
		let employee = {
			name: $scope.name,
        	last_name: $scope.last_name,
        	email: $scope.email,
		}


		if($scope.password != ""){
			employee["password"] = $scope.password;
		}else{
			delete employee["password"];
		}

		request.put(URLAPI+"/employee/"+$scope.employeeId, employee, $scope.getTokenCookie("token"),localStorage["selectedCompany"])
			.then((success)=>{
				console.log(success);
				if(success.data.ok){
					$("#newEmployee").modal("hide");
					$scope.showMessage(success.data.messagge, "success", "left");
					$scope.getEmployees();
				}
			}).catch((e)=>{
				$scope.showMessage(e.data.message, "danger", "left");
			})
	}


	$scope.getEmployees = function(){
		request.get(URLAPI+"/employee",$scope.getTokenCookie("token"),localStorage["selectedCompany"])
			.then((success)=>{
				if(success.data.ok){
					let employees = [];
					for(var i = 0; i < success.data.users.length; i++){
						if(!success.data.users[i]["account_delete"]){
							employees.push(success.data.users[i]);
						}
					}
					$scope.employees = employees;
				}
			}).catch((e)=>{
				console.log(e);
			})
	}


	$scope.deleteEmployeeModal =function (_id) {
		$("#deleteEmployee").modal("show");
		$scope.employeeId = _id;
	}

	$scope.deleteEmployeeAction = function(){
		request.delete(URLAPI+"/employee/"+$scope.employeeId, $scope.getTokenCookie("token"),localStorage["selectedCompany"])
			.then((success)=>{
				if(success.data.ok){
					$("#deleteEmployee").modal("hide");
					$scope.showMessage(success.data.message, "success", "left");
					$scope.getEmployees();
				}
			}).catch((e)=>{
				console.log(e);
			});
	}


	$scope.editEmployeeBtn = function (_id) {
		for (var i = 0; i < $scope.employees.length; i++) {
			if($scope.employees[i]._id == _id){
				$scope.name = $scope.employees[i].name;
		    	$scope.last_name = $scope.employees[i].last_name;
		    	$scope.email = $scope.employees[i].email;
			}
		}
		$scope.editMode = true;
		$scope.employeeId = _id;
		$("#newEmployee").modal("show");
		$(".formEmployee").focus();
		$(".password").prop("required", false);
	}

	$scope.setEditMode=function(){
		$scope.editMode = false;
		$(".password").prop("required", true);

		$scope.name = "";
    	$scope.last_name = "";
    	$scope.email = "";
    	$scope.password = "";
	}

	
	$scope.getToken();	
});
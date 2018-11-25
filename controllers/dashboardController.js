
app.controller("dashboardController", function($scope, request,$location) {

	$scope.ordersAccepted = 0;

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

	$scope.getOrders = function(){
		request.get(URLAPI+"/order",$scope.getTokenCookie("token"),localStorage["selectedCompany"])
			.then((success)=>{
				if(success.data.ok){
					$scope.orders = success.data.orders;
				}


				for (var i = 0; i < $scope.orders.length; i++) {
					if(parseInt($scope.orders[i]["completed"])==1)
						$scope.ordersAccepted++;

				}
			}).catch((e)=>{
				console.log(e);
				$scope.showMessage(e.data.message, "danger", "left");
			})
	}

	$scope.getEmployee = function(_id){
		return request.get(URLAPI+"/employee/"+_id, $scope.getTokenCookie("token"),localStorage["selectedCompany"])
			.then((success)=>{
				return success.data.user;
			}).catch((e)=>{
				console.log(e);
			});
	}

	$scope.getWarehouse = function(){
		request.get(URLAPI+"/warehouse",$scope.getTokenCookie("token"),localStorage["selectedCompany"])
			.then((success)=>{
				if(success.data.ok){
					$scope.warehouses = success.data.warehouses;
				}
			}).catch((e)=>{
				$scope.showMessage(e.data.message, "danger", "left");
			});
	}

	$scope.getDate = function(_date){
		return moment(_date).format("D/MM/YYYY");
	}


	$scope.getDelivery = function(_date){
		return moment(_date).format("D/MM/YYYY");
	}

	$scope.getEmployee = function(_id){
		if(_id === null || _id === undefined)
			return "Ningun empleado ha aceptado";
	}

	$scope.getStatus = function(_status){
		switch (_status){
			case 0:
				return "Aun no ha sido aceptado";
			case 1:
				return "En proceso";
			case 2:
				return "Terminado";
			default:
				return "Aun no ha sido aceptado";
		}

		console.log(_status);
	}



	$scope.getToken();
	$scope.getWarehouse();
	$scope.getOrders();
	$scope.getEmployees();
});
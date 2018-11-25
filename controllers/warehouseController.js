app.controller("warehouseController",function($scope, request,$location) {

	$scope.idWarehouse;

	$scope.addWarehouse = function(){
		if(!$scope.editMode){
			$.ajax({
				method:"GET",
				url:"https://maps.googleapis.com/maps/api/geocode/json?&address="+$scope.dir+
				" "+$scope.number+", "+$scope.housing+", "+$scope.city+" &key=AIzaSyBefc-n9G5ImvJX-CJ826w-KtofaOycdf8",
				success:function(s){
					$scope.idWarehouse = "";
					let warehouse = {
						dir: $scope.dir+" "+", "+$scope.housing,
						num: $scope.number,
						lat: s.results[0]["geometry"]["location"]["lat"],
						lon: s.results[0]["geometry"]["location"]["lng"],
						city: $scope.city,
					}

					request.post(URLAPI+"/warehouse", warehouse, $scope.getTokenCookie("token"), localStorage["selectedCompany"])
						.then((success)=>{
							if(success.data.ok){
								$("#newWarehouse").modal("hide");
								$scope.showMessage(success.data.message, "success", "left");
								$scope.getWarehouse();
							}
						}).catch((e)=>{
							$scope.showMessage(e.data.message, "danger", "left");
						});
				}
			});
		}else{
			$scope.editWarehousePut();
		}
	}

	$scope.setEditMode = function(){
		$scope.editMode = false;
	}

	$scope.warehouses = [];

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

	$scope.openMap = function(_id){
		for (var i = 0; i < $scope.warehouses.length; i++) {
			if($scope.warehouses[i]["_id"] == _id){
				window.open("https://maps.google.com/?q="+$scope.warehouses[i]["lat"]+","+$scope.warehouses[i]["lon"], "_blank");
				//win.focus();
			}
		}
	}

	$scope.deleteWarehouseModal = function(_id){
		$scope.idWarehouse = _id;
		$("#deleteWarehouse").modal("show");
	}

	$scope.deleteWarehouse = function(){
		if($scope.idWarehouse != ""){
			request.delete(URLAPI+"/warehouse/"+$scope.idWarehouse, $scope.getTokenCookie("token"), localStorage["selectedCompany"])
				.then((success)=>{
					if(success.data.ok){
						$("#deleteWarehouse").modal("hide");
						$scope.showMessage(success.data.message, "success", "left");
						$scope.getWarehouse();
					}
				});
		}
	}

	$scope.editWarehouse = function(_id){
		$scope.idWarehouse = _id;
		console.log(_id);
		for (var i = 0; i < $scope.warehouses.length; i++) {
			if($scope.warehouses[i]["_id"] == _id){
				$scope.editMode = true;
				let dir = $scope.warehouses[i]["dir"].split(",");
				$scope.dir = dir[0];
				$scope.housing = dir[1];
				$scope.number = parseInt($scope.warehouses[i]["num"]);
				$scope.city = $scope.warehouses[i]["city"];
				$("#newWarehouse").modal("show");
				$(".formEmployee").focus();
			}
		}
	}

	$scope.editWarehousePut = function(){
		$.ajax({
			method:"GET",
			url:"https://maps.googleapis.com/maps/api/geocode/json?&address="+$scope.dir+
			" "+$scope.number+", "+$scope.housing+", "+$scope.city+" &key=AIzaSyBefc-n9G5ImvJX-CJ826w-KtofaOycdf8",
			success:function(s){
				let warehouse = {
					dir: $scope.dir+", "+$scope.housing,
					num: parseInt($scope.number),
					lat: s.results[0]["geometry"]["location"]["lat"],
					lon: s.results[0]["geometry"]["location"]["lng"],
					city: $scope.city,
				}

				request.put(URLAPI+"/warehouse/"+$scope.idWarehouse, warehouse, $scope.getTokenCookie("token"), localStorage["selectedCompany"])
					.then((success)=>{
						if(success.data.ok){
							$("#newWarehouse").modal("hide");
							$scope.showMessage(success.data.message, "success", "left");
							$scope.getWarehouse();
						}
					}).catch((e)=>{
						$scope.showMessage(e.data.message, "danger", "left");
					});
			}
		});
	}

	$scope.getWarehouse();
	$scope.getToken();
});
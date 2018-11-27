app.controller("orderController", function($scope, request,$location, $routeParams, $compile) {

	$scope.setDate = function(){
  		$( function() {
    		$( "#datepicker" ).datepicker({
    			minDate:new Date(),
    		});
  		});
	}

	$scope.editOrder = function(){
		let order = {
			date:moment($("#datepicker").val()).valueOf(),
		}

		request.put(URLAPI+"/order/"+$routeParams.id, order,$scope.getTokenCookie("token"),localStorage["selectedCompany"])
			.then((success)=>{
				if(success.data.ok){
					$("#editOrder").modal("hide");
					$scope.showMessage(success.data.message, "success", "left");
				}
			}).catch((e)=>{
				$scope.showMessage(e.data.message, "danger", "left");
			});
	}

	$scope.addOrder = function(){
		let order = {
			today: moment().valueOf(),
			date: moment($("#datepicker").val()).valueOf(),
		}

		request.post(URLAPI+"/order", order, $scope.getTokenCookie("token"),localStorage["selectedCompany"])
			.then((success)=>{
				if(success.data.ok){
					$("#newOrder").modal("hide");
					$scope.showMessage(success.data.message, "success", "left");
					$scope.getOrders();
				}
			}).catch((e)=>{
				$scope.showMessage(e.data.message, "danger", "left");
			});
	}


	$scope.getOrders = function(){
		request.get(URLAPI+"/order",$scope.getTokenCookie("token"),localStorage["selectedCompany"])
			.then((success)=>{
				console.log(success);
				if(success.data.ok){
					$scope.orders = success.data.orders;
				}
			}).catch((e)=>{
				$scope.showMessage(e.data.message, "danger", "left");
			})
	}


	$scope.orderId = "";

	$scope.deleteOrder = function(){				
		request.delete(URLAPI+"/order/"+$scope.orderId, $scope.getTokenCookie("token"),localStorage["selectedCompany"])
			.then((success)=>{
				console.log(success);
				if(success.data.ok){
					$("#deleteOrder").modal("hide");
					$scope.getOrders();
					$scope.showMessage(success.data.message, "success", "left");
				}
			}).catch((e)=>{
				$scope.showMessage(e.data.message, "danger", "left");
			});
	}

	$scope.openOrder = function(_id){
		$location.path("/orderDetails/"+_id.replace(/'/g, ''));
	}

	$scope.getOrder = function(){
		request.get(URLAPI+"/order/"+$routeParams.id, $scope.getTokenCookie("token"),localStorage["selectedCompany"])
			.then((success)=>{
				if(success.data.ok){
					$scope.order = success.data.order;
					$("#datepicker").val(moment($scope.order.date_delivery ).format("D/MM/YYYY"));
					$scope.getUserInfo($scope.order.employee_id);
				}
			}).catch((e)=>{
				$scope.showMessage(e.data.message, "danger", "left");
			});
	}

	$scope.showEmployeeMsg = false;

	$scope.getUserInfo = function(_id){
		if(_id === undefined || _id == null){
			$scope.showEmployeeMsg = true;

		}else{
			request.get(URLAPI+"/employee/"+_id, $scope.getTokenCookie("token"),localStorage["selectedCompany"])
				.then((success)=>{
					if(success.data.ok){
						$scope.employee = success.data.user;
					}
				}).catch((e)=>{
					console.log(e);
				});
		}
	}

	$scope.deleteOrderAct = function(_id){
		$scope.orderId = _id;
		$("#deleteOrder").modal("show");
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

	$scope.getProducts = function(){
        request.get(URLAPI+"/product",$scope.getTokenCookie("token"), localStorage["selectedCompany"])
            .then((success)=>{
                if(success.data.ok){
                    $scope.products = success.data.products;
                }
            }).catch((e)=>{
                $scope.showMessage(e.data.message, "danger", "left");
            })

    };

	$scope.qty = 0;

    $scope.changeProduct = function(){
    	for (var i = 0; i < $scope.products.length; i++) {
    		if($scope.products[i]["_id"] == $scope.productId){
    			console.log($scope.products[i]["qty"]);
    			$scope.qty = $scope.products[i]["qty"];
    			break;
    		}
    	}
    };

    $scope.addOrderItem = function(){
    	let id = $routeParams.id;
    	if($routeParams.id.indexOf("#")>=0){
    		id = id.split("#");
    		id = id[0];
    	}
    	let orderItem = {
    		qty: $scope.qtyObj,
    		idproduct: $scope.productId,
    		OrderId: id,
    	}

    	console.log(orderItem)

    	if(orderItem.qty <= $scope.qty && orderItem.qty > 0){
    		request.post(URLAPI+"/orderItem/"+id, orderItem, $scope.getTokenCookie("token"), localStorage["selectedCompany"])
            .then((success)=>{
            	if(success.data.ok){
            		$("#addOrderItem").modal("hide");
                	$scope.showMessage(success.data.message, "success", "left");

            	}
            }).catch((e)=>{
                $scope.showMessage(e.data.message, "danger", "left");
            });
    	}else{
            $scope.showMessage("Seleccione una cantidad valida", "danger", "left");
    	}
    }

    $scope.getWarehouses = function(){
		request.get(URLAPI+"/warehouse",$scope.getTokenCookie("token"),localStorage["selectedCompany"])
			.then((success)=>{
				if(success.data.ok){
					$scope.warehouses = success.data.warehouses;
				}
			}).catch((e)=>{
				$scope.showMessage(e.data.message, "danger", "left");
			});
    }


    var orderItemArray = false;
    $scope.getOrderItem = function(){
    	$scope.getWarehouses();
    	let id = $routeParams.id;
    	if($routeParams.id.indexOf("#")>=0){
    		id = id.split("#");
    		id = id[0];
    	}

    	console.log(id);

    	request.get(URLAPI+"/orderItem/"+id, $scope.getTokenCookie("token"), localStorage["selectedCompany"])
            .then((success)=>{
            	if(success.data.ok){
            		$scope.orderItems = success.data.ordersItems;
            		for (var i = 0; i < $scope.orderItems.length; i++) {
            			$scope.orderItems[i].orderitemid = $scope.orderItems[i]._id;
            			$scope.orderItems[i].qtyOrder = $scope.orderItems[i].qty;
            		}
            		orderItemArray = true;

            	}
            }).catch((e)=>{
                $scope.showMessage(e.data.message, "danger", "left");
            });

        $scope.mergeJson();
    }

    $scope.mergeJson = function(){
    	var setIntervals = setInterval(function(){
    		if($scope.orderItems === undefined){
    			clearInterval(setIntervals);	
    		}
    		else if(orderItemArray && $scope.warehouses.length > 0 && $scope.products.length > 0){

    			let res = $scope.orderItems.map(x => Object.assign(x, $scope.products.find(y => y._id == x.product_id)));
    			res = res.map(x => Object.assign(x, $scope.warehouses.find(y => y._id === x.warehouse_id)));

    			let html = "";
    			if( res.length > 0 ){
    				for (var i = 0; i < res.length; i++) {
    					html += `<tr><td>${res[i]["name"]}</td><td class="text-truncate">${res[i]["city"]}</td><td>${res[i]["qtyOrder"]}</td>
    					<td>${res[i]["dir"]}</td><td><button class="btn btn-danger" ng-click="deleteOrderItem('${res[i]["orderitemid"]}')">Eliminar</button></td>`;
    				}
    			}else{
                	$("#noItemsMsg").css({"display":"block"});
    			}
    			if(html != ""){
                	let el = document.getElementById('tbodyOrder');
                	angular.element(el).append( $compile(html)($scope) );
            	}
    			clearInterval(setIntervals);	
    		}
    	}, 1000);
    };

    $scope.deleteOrderItem = function(_id){
    	request.delete(URLAPI+"/orderItem/"+_id,  $scope.getTokenCookie("token"), localStorage["selectedCompany"])
    		.then((success)=>{
    			if(success.data.ok){
                	$scope.showMessage(success.data.message, "danger", "left");
                	$scope.getOrderItem();
    			}
    		}).catch((e)=>{
                $scope.showMessage(e.data.message, "danger", "left");
    		})
    }

    $scope.productId = "";
	$scope.getProducts();
	$scope.getOrders();
	$scope.getToken();
	$scope.setDate();
});

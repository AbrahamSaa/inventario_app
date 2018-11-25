
app.config(($routeProvider, $locationProvider)=>{
	$routeProvider
		.when('/app',{
			templateUrl:'./views/home/index.html',
			controller:"userController",
		})
		.when('/dashboard', {
			templateUrl:"./views/dashboard/index.html",
			controller:"dashboardController",
		})
		.when('/employee',{
			templateUrl:"./views/employee/index.html",
			controller:"employeeController",
		})
		.when('/warehouse',{
			templateUrl:"./views/warehouse/index.html",
			controller:"warehouseController"
		})
		.when('/products',{
			templateUrl:"./views/products/index.html",
			controller:"productsController"
		})
		.when('/order',{
			templateUrl:"./views/order/index.html",
			controller:"orderController"
		})

		.when('/orderDetails/:id',{
			templateUrl:"./views/order/orderDetail.html",
			controller:"orderController"
		})
		
		.otherwise({
			redirectTo:'/app'
		})
  	
  	$locationProvider.html5Mode(true);
});
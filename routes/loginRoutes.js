
app.config(($routeProvider, $locationProvider)=>{
	$routeProvider
		.when('/login',{
			templateUrl:'./views/login/index.html',
			controller:'loginController',
		})
		.when('/app',{
			templateUrl:'./views/home/index.html',
			controller:"userController",
		})
		.otherwise({
			redirectTo:'/login'
		})
  	
  	$locationProvider.html5Mode(true);
});
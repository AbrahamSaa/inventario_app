
app.config(($routeProvider, $locationProvider)=>{
	$routeProvider
		.when('/login',{
			templateUrl:'./views/login/index.html',
			controller:"loginController",
		})
		.otherwise({
			redirectTo:'/login'
		})
  	
  	$locationProvider.html5Mode(true);
});
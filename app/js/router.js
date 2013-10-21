/**
 * router module
 *
 * 路由模块
 *
 * 模块依赖项：
 * ui.router 外部依赖项ui-router
 * 
 */
angular.module('app.router', ['ui.router']);

angular.module('app.router')
	.config(['$urlRouterProvider', '$locationProvider', function($urlRouterProvider, $locationProvider) {
		// html5模式，使url不含'#'
		$locationProvider.html5Mode(true);
		// 设定错误url导向页面
		$urlRouterProvider.otherwise('/login');
	}]);

angular.module('app.router').config(['$stateProvider', function($stateProvider) {
	// 设置路由
	$stateProvider

		.state('home', {
			name: 'home',
			abstract: true,
			templateUrl: 'template/home.html'
		})

		.state('login', {
			name: 'login',
			parent: 'home',
			url: '/login',
			templateUrl: 'template/login.html'
		})

		.state('register', {
			name: 'register',
			parent: 'home',
			url: '/register',
			templateUrl: 'template/register.html'
		});
}]);
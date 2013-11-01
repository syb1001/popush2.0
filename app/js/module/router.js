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
	
	// 主页，父页面，抽象
	$stateProvider.state('home', {
		name: 'home',
		abstract: true,
		templateUrl: 'template/home.html'
	});

	// 登录页，子页面
	$stateProvider.state('login', {
		name: 'login',
		parent: 'home',
		url: '/login',
		templateUrl: 'template/login.html',
		controller: LoginCtrl
	});

	// 注册页，子页面
	$stateProvider.state('register', {
		name: 'register',
		parent: 'home',
		url: '/register',
		templateUrl: 'template/register.html',
		controller: RegisterCtrl
	});

	// 文件管理页，父页面，抽象
	$stateProvider.state('dashboard', {
		name: 'dashboard',
		abstract: true,
		templateUrl: 'template/dashboard.html'
	});

	// 文件管理页，子页面，多视图，不可设置模板
	$stateProvider.state('dashboard', {
		name: 'dashboard',
		parent: 'container',
		url: '/dashboard',
		views: {
			// 导航栏
			'navbar': {
				templateUrl: 'template/navbar.html',
				controller: NavbarCtrl
			},
			// 文件列表
			'filelist': {
				templateUrl: 'template/filelist.html',
				controller: FileListCtrl
			}
		}
	});
}]);